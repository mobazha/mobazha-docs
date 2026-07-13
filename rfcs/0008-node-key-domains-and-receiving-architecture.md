# RFC-0008: Node Key Domains and Receiving Architecture

- Status: Draft
- Authors: Mobazha identity, wallet, settlement, and documentation maintainers
- Created: 2026-07-11
- Updated: 2026-07-13
- Decision owners: Mobazha Open Core, distributions, hosted service, clients, and documentation maintainers
- Affected surfaces: Node identity and wallets, Profile, order protocol, settlement signers, hosted service, clients, recovery, docs
- Supersedes: None
- Superseded by: None

## Summary

Separate Node keys into Identity, Wallet, and Settlement domains; define stable
Main, Guest, and Affiliate wallet accounts; publish generic versioned receiving
destinations; and require new chains to integrate through wallet capabilities
instead of adding coin-specific business fields.

Identity keys authenticate nodes and published statements. Wallet keys control
single-party balances. Settlement keys authorize multi-party order or managed
escrow actions. Business services receive addresses, public references, and
typed signing results, never raw seeds, extended private keys, or private-key
objects.

The exact replacement protocol for existing standard-order participant keys is
an unresolved production gate; RFC-0011 now records a concrete Draft proposal
for that gate. Neither RFC is Accepted, and this RFC does not claim the target
key domains or every listed chain are implemented.

## Problem and evidence

The current Node architecture grew several chain integrations before defining
one durable receiving and signing boundary. A review of the public Core source
at revision
[`b21ea986`](https://github.com/mobazha/mobazha/tree/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba)
shows:

- Main and Guest UTXO addresses allocated from the same BIP44 account while
  using a
  [separate counter](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/pkg/models/payment_address_counter.go#L3-L10)
  and an account-0
  [Guest derivation path](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/internal/core/guest/key_deriver.go#L38-L59);
- standard EVM and Solana orders project participant addresses directly from
  [profile public keys](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/pkg/payment/order_escrow_info.go#L55-L80);
- a Solana private key derived directly from the first 32 seed bytes without a
  distinct derivation domain and then
  [stored as raw key bytes](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/internal/repo/repo.go#L297-L324),
  as shown by
  [`CreateHDKeys`](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/internal/repo/repo.go#L478-L517);
- a business-facing
  [`KeyProvider`](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/pkg/contracts/key_provider.go#L8-L48)
  returning master private-key objects.

These patterns create address collisions, incomplete wallet discovery,
identity/financial authority confusion, broad compromise impact, weak recovery,
and cross-repository changes for every new chain.

[RFC-0006](./0006-payment-kernel-rails-and-trusted-modules.md) already requires
Core-owned key custody and typed signing admission for payment actions, but it
does not define wallet accounts, receiving destinations, or settlement-key
hierarchies. This RFC defines that separate boundary.

## Proposal

### 1. Establish three key domains

```text
Node / tenant root
├─ Identity Domain
│  └─ authenticate identity and published statements
├─ Wallet Domain
│  ├─ main
│  ├─ guest
│  └─ affiliate
└─ Settlement Domain
   ├─ standard-order participant keys
   └─ managed escrow, Safe, or program authority
```

The following invariants apply:

- Identity keys do not receive payouts or directly control order funds.
- Wallet keys control only single-party balances and do not participate in
  multi-party order protocols.
- Settlement keys authorize order-fund actions and are not ordinary payout
  destinations.
- Business code cannot retrieve raw private keys or derivation paths.

Existing EVM and Solana standard-order participant keys are known exceptions,
not permanent exemptions. The three-domain target is not complete until their
replacement protocol is reviewed and implemented.

### 2. Define stable wallet account roles

Business contracts use three initial account roles:

```text
main | guest | affiliate
```

For UTXO BIP44 adapters, the portable derivation contract is:

```text
main       m/44'/coin'/0'/0/index
guest      m/44'/coin'/1'/0/index
affiliate  m/44'/coin'/2'/0/index
```

These paths are recovery and conformance contracts for that adapter family,
not a universal cryptographic algorithm. EVM-family, Solana, shielded Zcash,
Monero subaddress, memo/tag, and provider-account adapters use their native
standards while preserving the same business roles where supported.

A new business role requires separate review. A new coin must not expand the
role enum merely to expose chain-specific behavior.

### 3. Publish generic receiving destinations

A receiving destination has these public semantics:

```text
Destination {
  rail_id
  address
  tag?
  version
}
```

`rail_id` identifies the canonical chain and network rather than a ticker.
`tag` carries a memo, destination tag, or equivalent routing value. The owning
wallet adapter validates encoding and network.

Profile publishes an identity-signed set of destinations. The signature proves
that the node published the set; it does not prove independent custody of each
address. The hosted service validates rail, network, format, and version, then
freezes the selected destination into the applicable link and order terms.

Profile rotation affects new work only. A destination already frozen into an
accepted order never follows later Profile changes.

Affiliate link rotation uses successor-generation semantics: a newer
Destination version may reuse the logical link ID, but it rotates the bearer
token and routing generation used for new sessions. A superseded token stops
issuing sessions without rewriting already issued sessions or accepted
attempts. The initial development slice freezes destinations in sessions and
orders but does not yet expose an explicit destination-generation field;
adding that field remains contract work rather than being inferred from
timestamps or address comparison.

The first Affiliate release may use one stable destination per rail and accept
the resulting public linkability. Per-seller or per-link privacy and external
user-entered destinations require a separately reviewed publication and
proof-of-control contract.

### 4. Separate wallet and payment registries

The Wallet Adapter Registry allocates accounts and destinations, watches and
rescans them, reports balances, validates destinations, and performs typed
wallet transfers. It is an evolution of chain-wallet infrastructure.

The Payment Rail Contribution Registry in RFC-0006 selects payment semantics,
funding, observation, verification, and order settlement operations. A wallet
adapter does not authorize an order release merely because it can spend the
same asset; a payment rail does not become a general wallet administration API.

Tokens on one address-bearing chain may share the chain's address domain. A
new token must not duplicate Profile addresses or create a new wallet account
unless its protocol genuinely requires one.

### 5. Require capability-complete chain adapters

An adapter declares narrow capabilities such as receiving, watching, spending,
automatic transfer, Guest, Affiliate, and escrow support. Capability presence
is not inferred from source code or address parsing.

A chain may support Main wallet use without supporting Guest or Affiliate. A
role becomes publicly available only after allocation, monitoring, restart
recovery, spending, fee handling, confirmation, network isolation, and the
required order-settlement operations close end to end.

Consumers must query the effective role/rail capability set. Publishing one
Affiliate destination does not imply every token, network, order kind, or
settlement action on that address-bearing chain can pay an Affiliate output.

[RFC-0010](./0010-guest-checkout-trust-and-custody.md) applies this gate to
Guest buyer visibility and defines the associated custody disclosure. A
documented inability to spend or complete required settlement outputs is not a
capability and cannot satisfy this gate.

Adding a chain requires:

1. canonical asset-to-rail registration;
2. a native wallet adapter or an explicit reuse decision;
3. declared capabilities and effective runtime gates;
4. deterministic address, signing, recovery, and network-isolation vectors;
5. conformance and negative tests for each advertised role.

Core business services and Profile must not add a chain-specific `switch` or a
fixed field merely because a new adapter is registered.

### 6. Put keys behind opaque signers

Standalone deployments use an encrypted local keystore. Hosted multi-tenant
deployments use tenant-scoped Vault/HSM-equivalent custody. Both expose the same
public behavior: resolve a public key or sign a typed, policy-checked request
without returning raw private material.

Signing admission binds tenant, rail, network, purpose, order or account
reference, transaction plan, expiry, and idempotency. The signer or adapter
owns chain-specific derivation and signature encoding. Logs, API responses,
descriptors, and ordinary business tables never contain seeds or extended
private keys.

Wallet and Settlement signers use separate derivation domains. In particular,
a Solana wallet account and Solana settlement authority must not reuse a key
created directly from unscoped seed bytes.

### 7. Gate the standard-order authorization protocol

Before this RFC can advance to Accepted, the project must select and publicly
specify how buyer, seller, moderator, and managed-escrow authorization keys are
published and frozen for UTXO, EVM, and Solana orders.

The selected protocol must ensure:

- disclosure of one order-level private key cannot recover a node, wallet,
  another order, or the Settlement root;
- chain and network enter the signing domain to prevent cross-chain replay;
- each order freezes complete key identity and version semantics;
- Profile rotation cannot reinterpret an accepted order;
- key loss, rotation, and recovery are explicit before real-funds release;
  RFC-0011's first production scope does not require multi-device or delegated
  moderator authority;
- Standalone and hosted custody implement the same observable protocol.

Candidate mechanisms considered for this gate included hardened per-order
keys, short-lived settlement epoch fund keys, and signed prekey pools or order
handshakes. Existing public non-hardened derivation is the rejection baseline,
not an acceptable target. [RFC-0011](./0011-order-settlement-authorization-keys.md)
proposes hardened attempt-scoped participant keys and Identity-signed key
offers, with no shared epoch fund key or weaker fallback path.

## Security, privacy, and abuse analysis

Domain separation limits the effect of a compromised receiving or order key.
Hardened or otherwise isolated settlement derivation must prevent a leaked
child private key plus public parent material from recovering a broader root.
Encrypted storage and opaque signing reduce the number of services that can
exfiltrate long-lived secrets.

Destination publication remains sensitive metadata. Stable Affiliate addresses
allow public transaction linking; rotating too frequently without freezing and
versioning can instead redirect funds or break recovery. Hosting therefore
must not claim cryptographic custody verification from an identity signature,
and clients must not substitute a newer Profile destination after acceptance.

Wallet allocation must be atomic and preserve role, rail, reference, index,
address, and high-water marks. Recovery requires seed or keystore material plus
wallet state sufficient to restore used addresses, watches, unfinished
transfers, and gaps. Seed-only recovery must not be promised when state is
required.

Typed transfers require idempotency, UTXO/input reservation, fee policy,
replacement tracking, bounded retries, confirmation, and reorg handling.
Settlement signatures require equivalent purpose, payload, order, network, and
replay validation.

## Economic and legal analysis

This RFC changes key custody and receiving architecture; it does not by itself
change a payer, recipient, fee, refund, dispute outcome, or legal classification.
Concrete economic behavior remains in its owning RFC, including Affiliate
settlement in
[RFC-0007](./0007-seller-funded-affiliate-atomic-settlement.md).

Custodial hosted deployment may carry security, disclosure, licensing, recovery,
and operational obligations that differ by jurisdiction. Those obligations
must be reviewed before representing Vault/HSM-backed service as a generally
available custody product.

## Alternatives

### Reuse one identity or master key for every purpose

Rejected because compromise crosses identity, receiving, and multi-party order
authority and makes rotation or recovery inseparable.

### Force every chain into one BIP44 layout

Rejected because Solana, shielded Zcash, Monero, memo/tag systems, and provider
accounts have different native derivation and destination semantics.

### Keep coin-specific Profile fields

Rejected because every new chain changes public models and hosted business
logic, while tags, versions, and non-address destinations remain awkward.

### Derive receiving addresses from escrow or profile public keys

Rejected because it makes identity or Settlement keys ordinary funded wallet
accounts and prevents the wallet from owning discovery, recovery, and spending.

### Let Payment Rail Registry replace the wallet registry

Rejected because checkout/settlement semantics and wallet account management
have different authority, lifecycle, and recovery responsibilities.

## Rollout and rollback

This RFC remains Draft until the standard-order authorization protocol and
public destination contract resolve their material open questions. Internal
ADRs and implementation may explore the target but do not activate public
availability.

Implementation proceeds in bounded gates:

1. freeze account roles, destination fields, rail identity, capabilities, and
   deterministic vectors;
2. establish encrypted Standalone custody and tenant-scoped hosted opaque
   signers;
3. implement wallet accounts, address state, restore, and typed transfers;
4. move Guest and Affiliate receiving to wallet-owned accounts;
5. replace standard-order participant keys under the reviewed authorization
   protocol;
6. remove raw-key business interfaces only after balance, authority, and
   unfinished-work checks pass;
7. complete cross-repository conformance, restore, isolation, and end-to-end
   tests before enabling each role or rail.

Development data may be reset without dual write. Real balances, contract or
program authority, accepted orders, and submitted actions must be explicitly
migrated or reconciled before an old key path is removed. Rollback blocks new
admission but preserves the signer and implementation needed to service frozen
obligations; it never redirects an accepted destination automatically.

## Documentation impact

- Link this RFC from RFC-0006 and RFC-0007 while preserving their separate
  payment and economic authority; link RFC-0010 for the Guest trust, custody,
  and buyer-visibility contract.
- Publish the final Destination schema, rail identifiers, account-role recovery
  vectors, Profile binding, and order participant-key protocol when stable.
- Update operator backup/recovery and hosted custody disclosures before public
  enablement.
- Add per-chain capability and conformance evidence without claiming that an
  adapter's source presence makes it available.
- Publish release evidence separately when an Accepted scope ships.

## Open questions

1. Which per-order, epoch, or prekey protocol should each supported settlement
   chain use? Proposed resolution in
   [RFC-0011](./0011-order-settlement-authorization-keys.md).
2. Which exact key-reference, version, and binding semantics belong
   to Profile, Listing, Order, and Payment Attempt messages? Proposed
   resolution in
   [RFC-0011](./0011-order-settlement-authorization-keys.md); exact
   encodings remain specification work, and its first production scope does
   not add a key-offer TTL or availability lease.
3. Which exact wire encoding, schema version, extension rules, and canonical
   rail-identifier registry should realize the Destination semantics above?
4. What minimum wallet-state backup is required for each adapter family, and
   how is restore completeness tested?
5. When external payout destinations are supported, which rail-specific
   proof-of-control and rotation rules are required?
6. Which hosted custody disclosures and operational evidence are required
   before public availability?

## Decision

Pending maintainer review. This Draft records the proposed domain and receiving
boundary plus the unresolved standard-order authorization gate. Current public
interfaces, effective runtime capabilities, accepted order terms, confirmed
chain evidence, and tagged releases continue to govern actual behavior.
