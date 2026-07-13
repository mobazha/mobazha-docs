# RFC-0009: Frozen Payment Attempt Settlement Terms

- Status: Draft
- Authors: Mobazha payment, settlement, and documentation maintainers
- Created: 2026-07-11
- Updated: 2026-07-13
- Decision owners: Mobazha Open Core settlement, hosted commerce, Unified, and documentation maintainers
- Affected surfaces: Node order settlement, payment session API, hosted service, Unified, clients, economics, docs
- Supersedes: None
- Superseded by: None

## Summary

Freeze every economic allocation term of an order payment attempt before the
buyer sees an actionable funding target. The frozen terms name the seller
payout destination, platform release fee, buyer cancellation fee, Affiliate
terms, moderator payout and fee, escrow timeout, and dispute allocation policy,
bound together by a canonical terms hash and the required participant
signatures.

Settlement actions such as completion, cancellation, seller decline, dispute
release, and refund expand their concrete outputs from the frozen terms of the
paid attempt. No later state — fulfillment, shipment, operator action, retry,
or adapter execution — may recompute who is paid, how much, or to where.

This RFC defines when economic terms bind and who authorizes them. It does not
define commission economics
([RFC-0007](./0007-seller-funded-affiliate-atomic-settlement.md)), receiving
destinations
([RFC-0008](./0008-node-key-domains-and-receiving-architecture.md)), or
payment-rail admission
([RFC-0006](./0006-payment-kernel-rails-and-trusted-modules.md)).
[RFC-0010](./0010-guest-checkout-trust-and-custody.md) separately defines the
Guest Checkout trust and custody contract that consumes these frozen terms.
[RFC-0011](./0011-order-settlement-authorization-keys.md) proposes how standard
order participant keys and their attempt authorization bundle are certified,
validated, and frozen; this RFC remains authoritative for economic content.

## Problem and evidence

A buyer-visible payment target and the economic terms behind it are created at
different times by different components. In the public Core source at revision
[`b21ea986`](https://github.com/mobazha/mobazha/tree/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba),
release fees, cancellation fees, payout addresses, and Affiliate data appear
across order records and
[order model fields](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/pkg/models/orders.go),
while the
[payment session](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/pkg/payment/payment_session.go)
projects payment progress without owning allocation terms.

When allocation is recomputed at settlement time, the same order can produce
different outcomes:

- terms can change after the buyer already saw and paid a funding target;
- a retry or a second signer can rebuild a settlement transaction with
  different outputs than the first attempt;
- disputes and refunds have no stable original basis to scale from;
- fee or commission configuration changes silently apply to in-flight orders;
- each rail (UTXO script, Safe, contract, provider) grows its own source of
  truth for the same economic facts.

## Proposal

### 1. Bind terms to the payment attempt

A payment session may hold multiple attempts. Each attempt permanently binds
one asset, rail, amount, funding target, and one set of settlement terms.
Changing any of these creates a new attempt; an existing attempt and its
funding target are never rewritten in place.

An attempt becomes actionable only after its settlement terms are validated,
signed as required, and durably persisted. A funding target must not be shown
as payable before that point.

### 2. Frozen term content

At minimum the frozen terms identify:

- the order, attempt, asset, rail/network, and amount they govern;
- the settlement asset as the sole unit of account for every allocation and
  reversal under this attempt: refunds, cancellations, and dispute reversals
  return quantities of the frozen settlement asset, not a value recomputed
  against the order's pricing currency, a later exchange rate, or the
  settlement asset's price movement during the attempt's holding period;
- the seller payout destination and destination version;
- the platform release fee basis and amount rules;
- the buyer cancellation fee basis and amount rules;
- Affiliate terms as defined by RFC-0007, when an attribution exists,
  including an explicit zero allocation when calculation rounded to zero;
- the moderator payout destination and fee amount for moderated attempts;
- the escrow timeout agreed by the participant offers;
- the dispute allocation policy used to scale outputs from a verdict;
- a canonical terms hash and the signatures or signed configuration
  references that authorize each funded leg.

### 3. Authorization boundary

- The seller authorizes seller-funded legs: the seller payout destination and
  any seller-funded Affiliate terms.
- The moderator's Identity-signed offer authorizes its payout destination and
  fee amount. Seller-built terms must copy both values exactly; the seller
  cannot replace the recipient, lower the fee, or use the moderator's genuine
  offer as proof for different terms.
- The frozen escrow timeout must equal the timeout accepted by the required
  participant offers. It is not a seller-selected free field merely because
  the seller assembles the final terms object.
- Platform fees bind through a platform signature or an immutable, versioned
  platform configuration reference; they cannot silently track later
  configuration changes.
- The buyer accepts an attempt by paying its funding target. A buyer cannot
  select or alter another participant's destination or amount.
- Rail adapters and relays execute only outputs already validated against the
  frozen terms. They cannot read business stores or reprice at execution time.
- Standard-order participant public keys and authorization proofs bind through
  the attempt authorization bundle proposed by RFC-0011. A funding target is
  not actionable when any required participant or rail lacks the same accepted
  authorization-protocol version.

Validation occurs where the order facts, terms, and signed offers are visible
together. A value object's local checks (non-empty address, amount bounds, and
canonical encoding) are necessary but cannot prove that a recipient, fee,
timeout, or Affiliate allocation matches the external authority that supplied
it. The final authorization bundle must perform those cross-object checks
before the terms hash gains financial meaning.

### 4. Action expansion

A settlement action references the paid attempt and its terms hash, then
expands outputs for its kind:

| Action | Allocation rule |
|---|---|
| seller confirm / complete | seller gross minus platform release fee and Affiliate output, released atomically |
| buyer cancel | buyer refund minus the frozen buyer cancellation fee; no Affiliate output |
| seller decline | full buyer refund; no cancellation fee; no Affiliate output |
| dispute release | verdict first, then frozen policy scales remaining legs from the seller basis |
| refund | reversal derived from the original attempt and refund policy; not a buyer cancel; denominated in the frozen settlement asset per Proposal 2 |

Retries rebuild or reconcile the same logical action. Value conservation and
per-rail fee handling follow the owning rail's rules under RFC-0006 and
RFC-0007.

### 5. Facts that are never frozen

Terms freeze policy, not chain facts. Transaction inputs and outpoints, actual
network fees or gas, dispute verdict amounts, transaction hashes, broadcast
attempts, and observed confirmations are recorded by the settlement action
when they occur. Frozen terms may define who bears a cost, but must not
fabricate values that have not happened.

### 6. One authority

Fulfillment and shipment records carry no economic allocation terms. Legacy
payment metadata does not gain new fee or Affiliate fields. There is no
second quote, intent, or plan aggregate that can disagree with the attempt.

## Security, privacy, and abuse analysis

The canonical terms hash must bind order, attempt, asset, amount, rail, and
every economic term, using a stable encoding, so that no participant, relay,
retry worker, or operator can substitute a destination or amount after the
buyer paid. Signature verification failures fail closed before a funding
target is shown.

Duplicate expansion is prevented by action-level idempotency; a rebuilt
transaction must reproduce the same logical outputs or be rejected. Terms
records reference published destinations and policy versions rather than
embedding secrets; they contain no private keys and no buyer network identity
beyond what the order already holds.

A frozen attempt is also an audit object: disputes, refunds, and statements can
cite the exact terms the participants accepted, which narrows repudiation and
support fraud claims.

## Economic and legal analysis

This RFC does not itself set any fee level, commission rate, or recipient; it
fixes when such terms bind and who must authorize them. The buyer-visible
consequence is that the accepted total and the participant allocation cannot
change between payment and settlement.

Freezing fees before payment supports consumer-protection expectations that
disclosed charges do not change retroactively. Jurisdictions may impose
disclosure or receipt requirements on the fee terms themselves; the owning fee
and commission policies remain responsible for that review.

## Alternatives

### Recompute allocation at settlement time

Rejected. Settlement-time computation lets configuration changes, retries, and
different signers produce different outcomes for the same accepted order, and
gives disputes no stable basis.

### A separate settlement-plan aggregate and state machine

Rejected. A parallel plan object duplicates facts the order and its settlement
actions already own, and can disagree with them. Terms are an immutable value
object inside the attempt, not a second lifecycle.

### Mutable quotes with expiry

Rejected for accepted attempts. Quotes may change freely before an attempt is
actionable; after a funding target is payable, expiry-based mutation would
still allow the paid terms to drift from the executed terms.

## Rollout and rollback

Implementation lands in the Open Core order and payment repositories with the
hosted service consuming frozen terms. The project is pre-production; hard cut
is acceptable for development data, without dual write or backfill.

Gates before any rail relies on frozen terms:

1. canonical encoding with deterministic cross-implementation test vectors;
2. signature and configuration-reference verification tests;
3. per-action expansion tests including dispute scaling and refund reversal;
4. value-conservation and idempotent-retry tests on each enabled rail;
5. removal of duplicate term sources only after the attempt path is
   authoritative.

Rollback stops issuing new actionable attempts under the new contract while
continuing to settle already-paid attempts from their frozen terms. A rollback
never reprices or redirects a paid attempt.

## Documentation impact

- Link this RFC from RFC-0006 (attempt and route immutability), RFC-0007
  (Affiliate terms content), and RFC-0010 (Guest trust and custody) without
  moving their authority; link RFC-0011 for participant authorization without
  moving economic-term authority; link RFC-0012 for onramp-funded attempts
  consuming these frozen terms without moving economic-term authority.
- Publish the terms field contract, canonical encoding, and signature rules as
  a public spec once stable.
- Update buyer and seller task pages to state that displayed payment terms are
  final for that attempt.
- Record release evidence separately when an Accepted scope ships.

## Open questions

1. Which canonical encoding (and versioning rule) should the terms hash use?
2. Should platform fees bind by live platform signature, by signed
   configuration generation, or both?
3. How are partial refunds expressed against frozen terms — per-line reversal
   policy or a single scaled reversal?
4. Which parts of the frozen terms are disclosed to the buyer versus only
   hashed and disclosed on demand?
5. Do provider (fiat) attempts adopt the same terms object immediately or
   after the provider split contract in RFC-0007's open questions resolves?

## Decision

Pending maintainer review. This Draft records a proposed public contract for
when order economic terms bind. Runtime behavior continues to be governed by
current interfaces, accepted order terms, and release evidence.
