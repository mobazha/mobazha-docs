# RFC-0011: Order Settlement Authorization Keys

- Status: Draft
- Authors: Mobazha settlement, order-protocol, and documentation maintainers
- Created: 2026-07-12
- Updated: 2026-07-15
- Decision owners: Mobazha Open Core, distributions, hosted service, clients, and documentation maintainers
- Affected surfaces: Order protocol (Profile, Listing, OrderOpen, Payment Attempt), settlement signers, moderation, hosted service, clients, recovery, docs
- Supersedes: None
- Superseded by: None

## Summary

Replace long-lived profile and escrow keys as standard-order fund
authorization with deterministic hardened keys scoped to one order payment
attempt for buyer, seller, and moderator. Introduce Identity-signed,
attempt-scoped public-key offers that never expose Settlement private
material. Require the seller to authorize an attempt before its funding target
becomes actionable, and require a valid moderator key offer while the attempt
is still a non-actionable draft rather than probing at payment submission.

This RFC proposes resolutions to open questions 1 and 2 of
[RFC-0008](./0008-node-key-domains-and-receiving-architecture.md): which
per-order, epoch, or prekey protocol each settlement chain uses, and
which key-reference semantics Profile, Listing, Order, and Payment Attempt
messages carry.
It defines the public protocol contract; exact field encodings and
conformance vectors belong to a separate specification.

[RFC-0014](./0014-quote-bound-cross-currency-payment-attempt-authorization.md)
extends this authorization ceremony for cross-currency attempts by binding a
buyer-proposed, seller-validated funding basis into seller-authorized terms.
Participant key offers remain free of price, rate, fee, and payment-amount
data.

## Problem and evidence

Standard orders currently use long-lived published keys as fund
authorization. A review of the public Core source at revision
[`b21ea986`](https://github.com/mobazha/mobazha/tree/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba)
shows:

- UTXO escrow participant keys are
  [derived non-hardened](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/internal/core/payment/utxo_info.go#L47-L86)
  from each participant's published escrow public key plus an order
  chaincode carried in the order message. Because the parent public
  key and the chaincode are both public, disclosure of any one order
  child private key recovers the parent escrow master private key and
  with it every past and future order key of that node.
- EVM orders project buyer, seller, and moderator participant addresses
  directly from
  [profile public keys](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/pkg/payment/order_escrow_info.go#L55-L80),
  so the identity key doubles as fund authorization.
- The Solana key is created from unscoped seed bytes without a
  settlement derivation domain, as shown by
  [`CreateHDKeys`](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/internal/repo/repo.go#L478-L517).

The order identifier is the hash of the serialized `OrderOpen` message.
Any protocol that derives participant keys from the order identifier is
therefore circular once `OrderOpen` itself carries participant public
keys; the protocol needs an independent key-locating reference.

Settlement keys are the most exposed keys in the system: they sign
during checkout, dispute, and release flows and their signatures travel
between counterparties. Under the current non-hardened scheme, one such
exposure is mathematically equivalent to a node-level compromise, and
the compromise is silent: an attacker can wait and sign future orders
rather than move visible funds.

## Proposal

### 1. Key hierarchy

```text
Settlement root (one independent root per node or hosted tenant)
└─ Attempt participant keys (buyer / seller / moderator /
                             order-scoped managed-escrow owner)
```

A per-attempt participant private key is derived deterministically inside the opaque
signer:

```text
attemptKey = KDF(settlementRoot,
                 protocolVersion, chainFamily, network,
                 participantRole, purpose,
                 authorizationContextID)
```

Business services and counterparties handle only typed key references
and public keys. Private keys, derivation paths, and the settlement
root never leave the signer. No per-attempt private key is stored;
recovery requires the settlement root plus order and key-reference
state, consistent with the wallet-state backup contract of RFC-0008.

Tenant isolation comes from using a different Settlement root for every node
or hosted tenant, not from placing a mutable tenant database identifier in the
derivation path. A tenant identifier may remain in an authenticated signer
request for policy, root selection, routing, and audit, but it is not a KDF
input after the tenant-specific root has been selected. The field-level
specification defines chain-family KDFs, scalar handling, canonical encodings,
and deterministic vectors; no implementation may substitute an unreviewed
raw-hash-to-private-key rule.

Disclosure boundaries:

- an attempt private key compromises at most that order attempt;
- the Identity key can forge public bindings for new attempts but cannot sign
  fund actions for already frozen attempts;
- the Settlement root is a top-level incident that blocks new attempts and
  requires a chain-specific close-out plan before real-funds release.

### 2. Authorization context and scope

Each payment attempt carries an immutable 32-byte cryptographically random
`authorizationContextID`, persisted before requesting a seller or moderator
offer. It is non-secret, is the key-locating input for participant derivation,
and is independent of the final order identifier. The name deliberately does
not reuse the existing Order Extension `SettlementReference`, which has a
different lifecycle and meaning.

One authorization context belongs to exactly one order, payment attempt,
protocol version, chain family, and network. Idempotent retries of that attempt
reuse the same context and keys. Changing the asset in a way that changes the
settlement chain or network, changing the moderator, or replacing any frozen
participant binding creates a new attempt and a new context; it never mutates
the old attempt. An expired or abandoned attempt retains enough state to prove
which key offer it used but cannot become actionable again.

Both the authorization context and the final order and attempt identifiers
enter every settlement signing payload. A protocol that places participant
keys inside `OrderOpen` cannot derive those keys from the resulting order hash;
the independent context avoids that circular construction. The exact wire
placement may evolve, but the immutable Payment Attempt owns the final
authorization bundle because the rail and network are attempt facts.

### 3. Public objects and semantic ownership

The protocol separates key provisioning from financial authorization:

1. **Settlement key offer** — an Identity-signed statement naming protocol version,
   authorization context, order and attempt correlation when known,
   participant identity and role, rail/network, purpose, public key or address,
   and no economic data. It binds one attempt public key; it does not approve
   prices, recipients, or other economic terms. Its canonical digest is its
   stable identity; the first production version does not add a separate offer
   identifier, clock, TTL, or availability lease.
2. **Attempt authorization bundle** — the immutable Payment Attempt value that
   freezes every participant binding, the validated offer proofs, the terms
   hash, and the participant signatures required by RFC-0009. This bundle, not
   Profile or Listing, is authoritative for fund authorization.

Profile publishes the Identity public material needed to verify offers.
Listing may constrain allowed protocol versions and moderator policy, but it
does not freeze an attempt key.
`OrderOpen` identifies the parties and selected moderation policy. The Payment
Attempt owns rail-specific public keys and the final authorization bundle.
Exact protobuf/JSON placement and canonical bytes belong to the public
specification, but implementations must preserve this semantic ownership and
must not create a second mutable authorization source.

Bundle validation also binds the economic fields that offers are intended to
authorize. For a moderated attempt, the terms' moderator payout address and
fee equal the moderator offer, and the escrow timeout equals the value agreed
by the required offers. Affiliate terms equal the accepted order's immutable
attribution snapshot, including an explicit zero-rounded allocation. Valid
signatures over a bundle assembled from self-consistent but substituted terms
do not satisfy these cross-object invariants.

### 4. Authorization ceremony and participant liveness

The target flow is:

1. create and durably persist a non-actionable payment-attempt draft and its
   authorization context;
2. derive the buyer attempt key and obtain idempotent seller and moderator key
   offers for the selected rail and network;
3. validate Identity signatures, offer scope, and exact public key/address
   encoding;
4. build the rail funding target and canonical RFC-0009 settlement terms from
   those bindings;
5. compute the final terms hash and collect the required participant
   authorization signatures over the order, attempt, context, bindings, target
   commitment, and terms hash;
6. atomically persist the authorization bundle and actionable funding target;
   only then expose the target to the buyer.

Before step 1, route admission checks the order shape and every required
operation, not merely whether a projector exists for the rail. An economic or
product feature the attempt protocol does not support must use a separately
admitted route before any authorization draft is created. It must not enter
the ceremony and then fail permanently at seller finalization.

After a draft exists, retryable seller or moderator unavailability leaves the
same draft non-actionable and may project `awaiting_seller_receipt`; this means
the seller-side funding target is not ready, not that buyer funds are late.
Retries republish or reacquire the same scoped offers. A permanently
incompatible stale draft is atomically abandoned together with its retained
offers before another route may become actionable, so one order never exposes
two live funding targets.

No external key-offer request or funding-target provisioning occurs before the
draft and context are durable. No database transaction remains open across a
network request. A crash resumes the same draft and context instead of issuing
new keys or a second target.

- **Buyer** derives its attempt key locally and binds it through the signed
  order/attempt authorization.
- **Seller** must be reachable to issue its key offer and authorize frozen
  seller-funded terms before payment. An offline order proposal may be queued,
  but offline ordering that returns a payable funding target is removed.
- **Moderator** does not approve the order economics, but its signer must issue
  an attempt key offer while provisioning the draft. A moderator without a
  valid offer is not selectable for that attempt.

Offer rules:

- the same authorization context and scope always return the same public key
  and offer identity;
- one offer cannot be rebound to another role, party, order, attempt, rail,
  network, purpose, or protocol version;
- offer failure has one result: the draft remains non-actionable and the
  moderator is unavailable for that draft; there is no weaker fallback path;
- choosing a different moderator or unmoderated mode requires an explicit
  buyer choice and a new attempt/quote, and is forbidden when seller policy
  requires moderation.

### 5. Freezing, rotation, and key loss

Order-attempt terms freeze the complete participant binding: public keys, key
references, protocol version, authorization context, offer proofs, and required
authorization signatures. Profile rotation affects new attempts only; a
funded attempt continues under its frozen keys until terminal.

Because the project has no production compatibility obligation at adoption,
development orders and keys are reset rather than migrated. After real-funds
release, loss or compromise of an Identity or Settlement root immediately
blocks new attempts. Frozen funded attempts are never silently re-keyed or
redirected; the owning chain's documented recovery or close-out procedure must
be used. A generic cross-chain re-key protocol is outside this RFC and is not a
prerequisite for development implementation.

Before real-funds production, the protocol and operator contract must define
how counterparties receive and authenticate an Identity- or Settlement-root
compromise notice. Once observed, the notice rejects new attempts and
unfrozen offers associated with the affected authority; it does not mutate a
frozen funded attempt. The exact recovery anchor, transport, caching, and
replay rules remain specification work. Development cutover does not require a
generic revocation registry or cross-chain re-key service.

### 6. Signing domain

Every settlement signature binds at least: protocol version, signature type,
purpose, participant role, chain family, canonical network identity,
authorization context, order identifier, payment-attempt identifier,
action kind and sequence/nonce, the exact transaction-plan or target
commitment, and the frozen-terms hash.
Signatures are not valid across chains, networks, attempts, orders, actions,
roles, or purposes.

Address comparison never erases an economic network boundary merely because
two encodings contain the same witness program or public key. Any accepted
cross-prefix equivalence must be an explicit non-production network rule (for
example, a testnet/regtest compatibility mapping); a mainnet address is never
equal to its test-network spelling.

### 7. Chain mapping

The key reference and signing semantics are uniform; the cryptography
is per chain family:

- **UTXO (BTC/BCH/LTC)**: secp256k1 hardened per-attempt keys as script
  or multisig participants;
- **EVM**: secp256k1 per-attempt addresses as escrow or Safe
  participants and managed-escrow owners;
- **Solana**: SLIP-0010 hardened per-attempt keys; Ed25519 supports no
  public non-hardened derivation, so no chain may assume publicly
  derivable child keys.

Public non-hardened child derivation from a published parent key is
the rejection baseline for every chain and must not reappear in any
role, including as an epoch-level participant key.

Long-lived contract administration, emergency councils, and Solana program
upgrade authorities are not attempt participant keys. They require separate
operational/governance authority and must not be derived merely by changing
the `purpose` string of this protocol. An order-scoped managed-escrow owner is
covered only when its authority is limited to that order attempt.

### 8. Custody and verification ownership

Standalone deployments and hosted tenant custody implement the same
observable signer contract defined in RFC-0008: resolve a public key or sign a
typed request for a key reference, without returning private material to
business services. Standalone encrypted keystores and hosted Vault/HSM or
equivalent custody may store the Settlement root, but ordinary application
databases, handlers, logs, and API payloads do not.

The first production scope maps each moderator Identity to one independent
Settlement root and one logical signing endpoint. Moderator multi-device
delegation, employee sub-authorities, and delegated-staff policy are outside
this RFC. A custody implementation may provide transparent infrastructure
redundancy behind that endpoint without exposing delegation as an order
protocol concept.

The Core order/payment verifier owns cryptographic and semantic validation of
Identity signatures, offers, frozen bindings, and signing domains.
Hosting may authenticate transport, cache or relay public objects, and enforce
additional policy, but it cannot replace Core validation, derive participant
keys, assert custody from publication, or sign order funds.

## Security, privacy, and abuse analysis

The moderator key is structurally weaker than buyer or seller keys in
a 2-of-3 model: alone it moves no funds, and its compromise is
exploitable only in orders where the attacker is also a participant.
This bounds the value of attacking moderators but does not justify a shared
fund key: one key serving many attempts concentrates concurrent orders behind
one secret, and a non-hardened xpub would reintroduce parent-key recovery. Fund
authorization therefore stays per-attempt for all roles; Identity signatures
authenticate public bindings but never authorize fund actions directly.

Chain families do not share identical threshold semantics. Review must
verify per chain which actions each key can authorize alone (including
privileged Safe or program actions) rather than assuming the UTXO
2-of-3 intuition.

Denial-of-service against a moderator prevents that moderator from issuing a
key offer and therefore makes it unselectable; it does not block unrelated
checkout. Selecting another moderator or unmoderated mode requires an explicit
buyer choice, seller-policy permission, and a new attempt and quote. A
successful offer proves key availability during provisioning, not that a later
dispute will meet an SLA.

A future client may use a non-authoritative online or recently-available hint
to rank, filter, or warn before provisioning. Such discovery metadata is not
part of this authorization protocol, never replaces successful key-offer
validation, and creates no financial authority.

Key offers are public metadata and may expose when a buyer is preparing a
moderated payment. They carry only the identities and opaque correlations
required to prevent rebinding; they do not carry item details, shipping data,
prices, private contact data, or transaction plans. Transport metadata is
minimized, and implementations must not compensate with covert fingerprinting.

Offer issuance is an abuse surface even when private keys are derived without
storage. Implementations apply authenticated, privacy-preserving quotas,
bounded concurrency, reject caller-chosen malformed contexts, and
make repeated requests for the same context idempotent. Audit records contain
protocol version, role, rail/network, result and stable denial reason, but
never roots, private keys, derivation material, raw signing payloads, or
unnecessary commerce metadata.

## Economic and legal analysis

This RFC does not change any payer, recipient, fee, calculation basis,
refund, or dispute outcome; economic terms remain governed by
[RFC-0007](./0007-seller-funded-affiliate-atomic-settlement.md) and
[RFC-0009](./0009-frozen-payment-attempt-settlement-terms.md). Two
product-behavior changes require operator and user documentation:
sellers must be reachable before an attempt becomes payable, and moderators
that cannot issue a valid offer are not selectable. Neither changes
economic terms; both change availability expectations.

## Alternatives

### Keep public non-hardened derivation

Rejected. One leaked order child key recovers the escrow master key;
this is the baseline the RFC exists to eliminate.

### Epoch keys as direct fund participants

Rejected, including short-TTL variants. A short TTL bounds the cohort
of orders behind one key, not the duration of the risk: orders created
in an epoch remain live through their dispute windows, and a busy
moderator concentrates many orders in even a daily epoch. A
non-hardened epoch xpub additionally allows recovering the epoch
private key from one child key.

### Synchronous moderator probe at payment submission

Rejected. It couples the most conversion-critical step to third-party
liveness, creates timeout and race states at payment time, and gives
attackers an availability lever against checkout. Obtaining the offer
while provisioning a durable non-actionable attempt keeps the dependency in
the selection phase, where failure is a recoverable choice. The attempt still
requires an offer before becoming actionable; freshness is not treated as a
substitute for possession of the attempt key.

### Dual online-strong/offline-weak key paths

Rejected. The security floor becomes the weak path, which an attacker
selects by timing, while the protocol carries both surfaces.

### Random per-order keys stored per order

Rejected. It creates a private-key inventory whose backup and
migration burden grows with order volume; deterministic derivation
from the settlement root provides the same isolation without storage.

### Deriving keys only from the order identifier

Rejected. If participant keys are placed in `OrderOpen`, deriving them from
its hash is circular. Even when a later attempt message could safely reference
an existing order ID, an order may have several abandoned or rail-specific
attempts. The independently persisted authorization context gives each attempt
separate keys, idempotent recovery, and an unambiguous pre-network-I/O claim.

## Rollout and rollback

Implementation authority remains with the internal implementation
ADRs in the implementation repositories and proceeds only after this
RFC completes security review.

Gates:

1. freeze this protocol contract and publish field ownership, canonical
   encodings, KDFs, signature domains, state transitions, and deterministic
   per-chain vectors;
2. implement opaque signer derivation and encrypted backup without returning
   private material for each deployment scope before that scope is enabled;
   Standalone and hosted custody may ship independently behind the same
   observable contract;
3. add persistence-first attempt drafts plus Identity-signed offer validation,
   final authorization-bundle freeze and idempotency;
4. switch UTXO, EVM, and Solana standard orders independently behind
   protocol-version and operation-level capability gates, with cross-repository
   contract tests;
5. prove for every rail that create/fund, confirm, cancel/refund, complete,
   dispute, restart, signer outage, reorg and retry preserve the same frozen
   bindings;
6. define and test the authenticated compromise-notice contract required
   before real-funds production;
7. reset development orders and remove the old participant-key paths. No
   legacy dual write, historical-order migration, or compatibility mode is
   required before production.

A new attempt is admitted only when every required participant and settlement
operation supports the same accepted authorization-protocol version. A new
attempt uses only attempt-scoped participant keys and never falls back to a
legacy or shared fund key. The development cutover deletes the legacy path
after zero-state/reset checks. Capability failure before freeze leaves the
draft non-actionable. Rollback during development disables the new path and
resets its data; it does not require a second public protocol.

Privacy-safe observability reports offer issue and validation outcomes, signer
latency and availability, protocol-version admission, and frozen-attempt
recovery state. It does not log secrets or raw payloads.
Release evidence identifies the exact chain/network/actions, protocol and
schema versions, custody implementations, development reset or zero-state
result, tests, and runtime capability gates that shipped.

## Documentation impact

- RFC-0008: its standard-order authorization gate and semantic fields are
  proposed for resolution here; link both directions while both remain Draft.
- RFC-0006, RFC-0007, RFC-0009, RFC-0010: add cross-links where typed signing,
  frozen terms, order outputs, Guest managed authority, or moderated flows are
  referenced without moving their authority here.
- RFC-0012 proposes a second, parallel participant-key provisioning path
  (buyer-vendor-custodied keys, not derived from a Settlement root) for
  buyers without a Mobazha node; link it without moving this RFC's
  Settlement-root key hierarchy or signing-domain authority.
- Publish the field-level offer, authorization-bundle, KDF and
  signing-domain specification plus per-chain conformance vectors when stable.
- Operator documentation: seller reachability requirement, moderator
  offer availability, compromise-notice handling, backup scope (settlement
  root plus order and key-reference state).
- Release evidence is published separately when an Accepted scope
  ships.

## Open questions

1. Exact field encodings, schema versions, extension rules, canonical bytes,
   and wire placement of offers, authorization contexts, and attempt
   authorization bundles
   (specification work).
2. The recovery anchor, authenticated transport, caching, and replay rules by
   which counterparties learn of an Identity- or Settlement-root compromise
   before real-funds production.
3. Exact order-scoped managed-escrow-owner semantics for EVM and Solana;
   long-lived contract administration and program upgrade authority remain
   outside this RFC. (A buyer key that a third-party embedded-wallet
   provider generates and holds, rather than one this RFC's Settlement root
   derives, is out of scope here and is addressed by RFC-0012.)

## Decision

Pending maintainer review. This Draft records the proposed
authorization-key protocol; current public interfaces, accepted order
terms, and tagged releases continue to govern actual behavior.
