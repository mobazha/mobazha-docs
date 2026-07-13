# RFC-0012: Embedded Wallet Buyer Settlement Keys and Onramp-Funded Attempts

- Status: Draft
- Authors: Mobazha payment, settlement, and documentation maintainers
- Created: 2026-07-12
- Updated: 2026-07-13
- Decision owners: Mobazha Open Core settlement, hosted service, Unified, clients, and documentation maintainers
- Affected surfaces: Order settlement, payment session API, hosted service, buyer clients, key provisioning, vendor/module trust boundary, docs
- Supersedes: None
- Superseded by: None

## Summary

Define a third buyer key-provisioning path for moderated escrow order
attempts, alongside the Settlement-root-derived attempt keys of
[RFC-0011](./0011-order-settlement-authorization-keys.md) and the
seller-custodied guest model of
[RFC-0010](./0010-guest-checkout-trust-and-custody.md): a buyer without a
Mobazha node or Identity key participates as a genuine, buyer-authorized
co-owner of a 2-of-3 moderated escrow (Safe or equivalent), using a signing
key generated and held under a third-party embedded-wallet provider's custody
model, not derived from any Mobazha-controlled root and not held by the seller
or platform on the buyer's behalf.

This RFC also defines the public contract for onramp-funded attempts: a
funding source in which the buyer's embedded wallet receives the settlement
asset through a fiat-to-asset purchase, either delivered directly to the
attempt's funding target or first delivered to the buyer's own wallet and
then forwarded to the target. It fixes what protection this buyer receives,
who may custody signing material, when a chain qualifies for this path, and
how the onramp leg is disclosed.

RFC-0010 named this scenario and deferred it explicitly: "A future
buyer-wallet escrow product would be a separate proposal." This is that
proposal. It does not change RFC-0010's guest-custodial default or RFC-0011's
Settlement-root key hierarchy for buyers who hold a Mobazha node; it adds a
parallel, opt-in path for buyers who do not.

## Problem and evidence

A buyer who has no Mobazha node or Identity key today has exactly one
checkout path: the RFC-0010 guest model, in which the funding target is
controlled by the seller's node (or, on managed-escrow rails, by a
platform/seller-held order-scoped signer). This is correct for its stated
scope, but it forecloses a distinct, common buyer population: someone who is
willing to authenticate to a hosted platform account and hold a real signing
key, but who does not want to install a node, manage a seed phrase, or
pre-acquire a settlement asset before checkout.

Two building blocks already make an independently-controlled buyer key
practical without custodial risk to Mobazha or the seller:

- [EIP-712 typed structured data signing](https://eips.ethereum.org/EIPS/eip-712)
  is the standard mechanism third-party embedded-wallet SDKs commonly expose
  to applications. A moderated-escrow implementation that admits such a
  provider must accept the exact typed-data signing method supported by the
  owning contract; accepting an arbitrary raw hash or a look-alike domain is
  not an equivalent authorization.
- [EIP-3009](https://eips.ethereum.org/EIPS/eip-3009), implemented by
  stablecoins including USDC, lets a token holder authorize a transfer
  off-chain with the recipient bound inside the signed data. A relayer may
  submit the authorization and pay gas, removing the assumption that the
  buyer must already hold the chain's native gas asset. Contract receivers
  must use `receiveWithAuthorization` or an equivalently atomic receiver
  contract: front-running `transferWithAuthorization` can bypass wrapper
  accounting even though it cannot redirect the signed recipient.

Neither RFC-0010 nor RFC-0011 defines how a key from this class of provider
is admitted as a real escrow participant:

- RFC-0010 defines only seller/platform-held managed-escrow custody for
  guest orders and states plainly that its container "is seller-controlled
  custody, not a buyer-protection instrument."
- RFC-0011 derives every attempt key, for every role including the
  "order-scoped managed-escrow owner," from a Mobazha-controlled Settlement
  root via `KDF(settlementRoot, ...)`. A third-party-generated key that
  Mobazha never derives, never sees, and cannot reconstruct does not fit this
  hierarchy, and RFC-0011 assumes custody is "the same observable signer
  contract defined in RFC-0008" operated by a standalone deployment or a
  hosted tenant — not by an external consumer-wallet vendor.

This RFC closes that gap without reopening either document's existing scope.

## Proposal

### 1. A third participant-key class

Alongside RFC-0011's Settlement-root-derived keys and RFC-0010's
seller/platform-held managed-escrow keys, this RFC defines:

**Buyer-vendor-custodied attempt key** — a signing key that:

- is generated and protected under a reviewed third-party embedded-wallet
  provider's custody model (see Proposal 4), not derived from any Mobazha
  Settlement root and not reconstructable by Mobazha or the seller;
- is bound to exactly one buyer-controlled account at the provider, which the
  buyer can independently authenticate to, export, or recover through the
  provider's own account-recovery path, without Mobazha or seller
  involvement;
- participates in the order's moderated escrow as a genuine co-owner with the
  same threshold semantics as any other participant key (for example, one
  signature of a 2-of-3 Safe); it is not a proxy, and its authority is never
  exercised by the platform or the seller. The provider remains part of the
  buyer's custody and availability boundary and must be disclosed as such.

A buyer using this path remains, in RFC-0010's terms, a buyer without a
Mobazha node or Identity key. This RFC does not grant such a buyer a protocol
Identity; it grants a real fund-authorization key for one order's moderated
escrow, provisioned through a different mechanism than RFC-0011's
Settlement-root hierarchy.

### 2. Custody boundary (what Mobazha and the seller may never hold)

- Mobazha's business services and the seller's node must never receive,
  request, cache, or be capable of unilaterally reconstructing the buyer's
  private signing material for this key class. There is no server-side
  signer and no standing delegated-signing grant to Mobazha or the seller.
- Any future feature that lets Mobazha or the seller request a signature
  without fresh buyer interaction (for example, a scoped automatic-completion
  authorization) is out of scope for this RFC and requires its own public
  proposal naming the exact scope, expiry, and revocation contract.
- The buyer must have a provider-native account-recovery or export path.
  A provider that cannot demonstrate this path does not qualify under Proposal 4.

### 3. Signature acceptance

A moderated-escrow settlement action must accept a participant signature
produced via EIP-712 typed-data signing (or the equivalent structured-signing
standard of a non-EVM chain family) as fully equivalent, for authorization
purposes, to a signature produced by a locally-held key under RFC-0011. The
signing domain requirements of RFC-0011 (protocol version, purpose,
participant role, chain family, network, authorization context, order and
attempt identifiers, action kind, and frozen-terms hash) apply unchanged; the
provenance of the private key does not relax the signing-domain contract.

### 4. Embedded-wallet provider as a trusted module

An embedded-wallet provider integration is a new class of Hosted dependency
under [RFC-0006](./0006-payment-kernel-rails-and-trusted-modules.md)'s
trusted-module lifecycle, not an ordinary library dependency. Before a
provider integration may hold real buyer funds, it must be reviewed against:

- the custody boundary of Proposal 2 (no Mobazha or seller server signer, no
  standing delegated access for either party, and a demonstrable buyer
  export/recovery path);
- failure isolation: provider outage or account suspension must not corrupt
  or block other participants' ability to complete, cancel, or dispute an
  already-frozen attempt through its existing signatures;
- a documented data-handling and jurisdiction posture, since the provider
  independently performs its own buyer authentication and, when onramp
  funding is used, its own buyer KYC.

A distribution may compose zero, one, or more reviewed provider modules
behind this contract (RFC-0006's distribution-profile composition policy); no chain or client may assume a specific
vendor is present.

### 5. Onramp-funded attempts

An onramp-funded attempt is a payment attempt whose buyer acquires the
settlement asset through a fiat purchase inside the checkout flow, via a
reviewed onramp module, rather than by holding the asset beforehand.

- The frozen settlement terms of
  [RFC-0009](./0009-frozen-payment-attempt-settlement-terms.md) govern the
  attempt exactly as for any other funding source: the settlement asset,
  network, and amount are fixed before the funding target is shown as
  payable, and an onramp purchase does not create a second, competing quote.
- Delivery may target the attempt's funding target directly, or the buyer's
  own embedded wallet first; either path is an ordinary funding observation
  against the same frozen target, not a new settlement mode.
- The onramp leg is a distinct commercial relationship between the buyer and
  the onramp provider (KYC, purchase fee, purchase failure and reversal are
  the provider's contract with the buyer); it is disclosed as such and is not
  represented as part of Mobazha's or the seller's payment terms.
- A chain or network qualifies for buyer-visible onramp funding only when the
  capability gate of Proposal 6 closes for it; store configuration alone does not
  make it buyer-visible, mirroring RFC-0010's per-chain capability-gate rule for guest
  rails.

### 6. Capability gate

This path becomes buyer-visible for a given chain and provider combination
only when all of the following close end to end and survive restart:

1. the embedded-wallet provider module is admitted under Proposal 4;
2. the escrow contract or program on that chain accepts the provider's
   structured-signature format for every settlement action it must perform
   (confirm, cancel, seller decline, dispute release, refund);
3. when onramp funding is offered, delivery to the frozen funding target (or
   to the buyer's wallet, forwarded to that target) is observed, confirmed,
   and recoverable after restart with the same guarantees RFC-0009 requires
   of any funding observation;
4. buyer-facing disclosure text distinguishes this path from both the
   RFC-0010 guest-custodial default and a fully self-held external wallet.

### 7. Disclosure

A client or storefront must not present this path as identical to a fully
self-custodied external wallet without qualification: the buyer's key
material is generated and held by a named third-party provider under that
provider's own terms and recovery mechanism, not by Mobazha, the seller, or
the buyer's own device exclusively. It must also not be presented as
seller-custodied or platform-custodied, since neither Mobazha nor the seller
can exercise this key. Onramp purchase terms (fees, KYC, purchase reversal
behavior) are disclosed before the buyer commits to the purchase.

## Security, privacy, and abuse analysis

The central risk this RFC manages is custody misrepresentation: an integration
that markets a vendor-custodied key as fully self-custodied, or quietly gives
Mobazha or the seller a server signer or standing delegated-signing grant.
Proposal 2's contract is written to be reviewable and testable — the audited
claim is that Mobazha and the seller have neither signing path, while the
provider's actual custody, recovery, and availability boundary is disclosed.

Front-running an EIP-3009-style authorization cannot substitute the signed
recipient, but it can still bypass a contract wrapper that was expected to
record the deposit. Contract funding therefore uses
`receiveWithAuthorization` or an equivalently atomic receiver, and tests prove
that successful token movement and attempt attribution cannot diverge. A
provider outage blocks new signatures from that buyer but does not
expose other participants' existing signatures or funds already at the
frozen target; per Proposal 4, it must not corrupt in-flight settlement using
signatures already collected.

The moderator key remains structurally weaker than buyer or seller keys, per
RFC-0011's analysis; this RFC does not change that balance. Provider-side
buyer authentication and any onramp KYC are the provider's abuse surface and
compliance obligation, not a new Mobazha-held data store; Mobazha and the
seller must not compensate for not holding this data by adding covert
buyer fingerprinting.

Mass low-value wallet creation is bounded by whatever quota or cost the
embedded-wallet provider and onramp provider themselves apply; this RFC does
not introduce a Mobazha-side rate limit beyond ordinary checkout abuse
controls.

## Economic and legal analysis

This RFC does not itself set a fee, recipient, or allocation rule; attempt
economics remain governed by RFC-0009 and RFC-0007. Two buyer-facing costs
are newly visible at checkout when this path is used: the embedded-wallet
provider's own terms (if any) and the onramp provider's purchase fee; both
are the buyer's costs to the respective third party, not a Mobazha or seller
fee, and must be disclosed before purchase.

Because the buyer genuinely holds one leg of a 2-of-3 moderated escrow,
dispute-and-refund handling for this path is the ordinary moderated-order
contract, not the guest-custodial contract of RFC-0010. Operators who offer
this path take on the review obligations of admitting a new class of Hosted
dependency (RFC-0006) and of accurately disclosing that a real, but
third-party-provisioned, buyer key protects the order; they do not take on
the omnibus-custody obligations RFC-0010 rejected for guest checkout, because
neither Mobazha nor the seller ever holds this key.

## Alternatives

### Treat the embedded-wallet buyer as an RFC-0010 guest with a nicer UI

Rejected. It would misrepresent a genuinely buyer-controlled, moderated
escrow participant as a seller-custodied sale, contradicting RFC-0010's own
disclosure requirement that a guest payment must not be presented as
protected or escrowed.

### Require every buyer to run a node or hold an Identity key before using moderated escrow

Rejected for the same reason RFC-0010 rejected it: it removes the product's
reason to exist for this buyer population.

### Mobazha or the seller derives and holds the buyer's key "on the buyer's behalf"

Rejected. This is the platform-omnibus-custody design RFC-0010 already
rejected for guest funds, applied to a key that is supposed to make the buyer
a real, independent participant. It would also make the "moderated" label
false, since a party who can be compelled or coerced to produce the buyer's
signature is not an independent participant.

### Require the buyer's key to be a Smart Account (ERC-4337) rather than an externally-owned account

Considered and deferred, not rejected. A smart-contract account can offer
gas sponsorship and batched approvals, but only when it is itself the escrow
co-owner does it change the escrow contract's signature-verification path
from ECDSA/EIP-712 to contract-based verification (for example EIP-1271),
which is a larger and separable change to the escrow's verification surface.
Proposal 5's onramp-funded, EIP-3009-based delivery removes the specific problem
(buyer holds no native gas asset) that motivates a smart-contract account,
without requiring that change. A future proposal may still add smart-account
participation; this RFC does not foreclose it and does not require it.

### One combined RFC covering both guest checkout and this path

Rejected as an amendment to RFC-0010. RFC-0010's core public promise — guest
orders are seller-custodied, not moderated escrow — would have to flip
conditionally, which is a change to the authorization and security model that
the repository's own revision rules route to a new or superseding proposal
rather than a silent amendment. RFC-0010 itself names this as a separate
proposal.

## Rollout and rollback

Implementation spans Open Core order settlement, the hosted service, and
buyer clients. Rollout gates:

1. freeze this key-class and signature-acceptance contract, and publish which
   structured-signing formats each chain family's escrow verification accepts
   (EIP-712 for EVM; the equivalent for any non-EVM chain family this path
   supports);
2. admit at least one embedded-wallet provider module under the Proposal 4 trusted-
   module review before any real-funds pilot;
3. when onramp funding is offered, prove funding-target delivery, restart
   recovery, and reconciliation against the frozen attempt exactly as RFC-
   0009 requires for any funding source, before that chain/provider pair is
   buyer-visible;
4. publish buyer-facing disclosure text distinguishing this path from both
   the RFC-0010 guest default and a fully self-held external wallet;
5. end-to-end tests covering confirm, cancel, seller decline, dispute
   release, and refund with a buyer-vendor-custodied key, including provider
   outage during an in-flight dispute.

Rollback removes buyer visibility for new attempts on the affected chain or
provider while continuing to service already-funded attempts from their
existing collected signatures; it never strands funds at a target that was
already payable.

## Documentation impact

- Link this RFC from RFC-0010 (as the deferred buyer-wallet escrow proposal
  its Alternatives section named) and RFC-0011 (as a second, parallel
  participant-key provisioning path alongside the Settlement-root hierarchy)
  without moving their authority.
- Link from RFC-0006 for the embedded-wallet and onramp module trust
  boundary, and from RFC-0009 for onramp-funded attempts consuming frozen
  terms, without moving their authority.
- Buyer-facing checkout copy must state, before purchase, who holds the
  signing key for this path and how the buyer can export or recover it.
- Publish per-chain, per-provider capability status as release evidence when
  scopes ship.

## Open questions

1. Does a buyer-vendor-custodied key receive an RFC-0011-shaped attempt-key
   offer and authorization-bundle entry, or a parallel provisioning record
   that the authorization bundle references by a different key-reference
   kind?
2. What audit or attestation is sufficient to verify a provider's Proposal 2
   claim (no Mobazha or seller server signer or standing delegated grant) on
   an ongoing basis, not only at initial review?
3. If the embedded-wallet provider ceases operation or becomes unreachable,
   what is the disclosed recovery path for an in-flight dispute awaiting that
   buyer's signature, and does it require chain-specific timeout releases
   beyond what RFC-0011 already defines for an unavailable moderator?
4. Does a buyer who repeatedly authenticates to the same hosted-platform
   account across orders create a persistent cross-order buyer identity that
   should interact with RFC-0007's self-referral checks, despite holding no
   protocol Identity key?
5. Should onramp/swap be modeled as a new `funding mode` enumeration value
   under RFC-0006's rail classification, or does it remain purely an
   implementation-level concern below the public rail contract?

## Decision

Pending maintainer review. This Draft records a proposed public contract for
a buyer-vendor-custodied participant key class and onramp-funded attempts.
Current interfaces, RFC-0010's guest-custodial default, and RFC-0011's
Settlement-root key hierarchy continue to govern actual behavior for buyers
who do not use this path.
