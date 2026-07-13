# RFC-0007: Seller-funded Affiliate Attribution and Atomic Settlement

- Status: Draft
- Authors: Mobazha product, settlement, and documentation maintainers
- Created: 2026-07-11
- Updated: 2026-07-13
- Decision owners: Mobazha hosted commerce, Open Core settlement, Unified, and documentation maintainers
- Affected surfaces: Node order settlement, hosted Affiliate service, Unified, public API, economics, supported payment rails, docs
- Supersedes: RFC-0004
- Superseded by: None

## Summary

Define a single-level Affiliate model in which a seller freezes commission
terms before order acceptance and funds the promoter from the seller's own
order-settlement proceeds. On a supported rail, the seller and promoter receive
their outputs in the same canonical release transaction.

The model does not create a commission balance, independent payout engine,
manual eligibility queue, claim button, withdrawal workflow, or operations
console. Affiliate business data records only `pending` or `reversed`;
`settling` and `paid` are statement projections derived from Core settlement
actions and confirmed chain outputs.

This RFC supersedes RFC-0004's manual-review-only proposal. It does not claim
that every rail or client described here is released or enabled.

## Problem and evidence

RFC-0004 established useful single-level attribution, immutable terms, and
one-order binding, but intentionally stopped before funded settlement. That
left the project needing a second eligibility decision, payable ledger, payout
worker, withdrawal lifecycle, and operational recovery path before a promoter
could receive funds.

Those components duplicate facts already owned by the canonical order:
whether payment completed, whether funds were refunded or cancelled, how a
dispute divided the release, whether a settlement action was submitted, and
whether its outputs confirmed. A separate payout lifecycle can disagree with
the order, pay after a refund, or require the seller to fund the same obligation
again outside escrow.

The smaller public contract is to freeze the Affiliate output as part of the
order settlement plan, deduct it from the seller leg, and let the existing
settlement and chain evidence govern payment status.

## Proposal

### 1. Preserve single-level attribution

The hosted Affiliate service owns seller programs, promoter links, signed
referral sessions, attribution evidence, and the immutable policy snapshot used
to prepare an order. One order accepts at most one direct promoter attribution.

The model excludes referral trees, recruitment rewards, multi-touch
attribution, ambient cookies, fingerprinting, and commission on another
promoter's activity. Anonymous analytics never create financial authority.

### 2. Freeze payable terms before settlement

Before an attributed order is accepted, the system freezes at least:

- seller and promoter identities;
- program, link, referral-session, and attribution references;
- policy/schema version, calculation basis, rate, cap, asset, and amount;
- canonical rail/network identity;
- promoter payout destination and destination version;
- the order and settlement-term binding used by participant signatures.

The seller-side order-open path prepares this immutable attribution snapshot
before accepting the order and commits the order and snapshot atomically. A
prepare failure rejects the order; a commit failure leaves neither an accepted
order without attribution nor an independently payable commission. Recovery
of an older accepted order may repair a missing snapshot only from the signed,
order-bound referral evidence that originally authorized it; it may not read
current program or payout-profile defaults.

An attribution whose calculation rounds to zero remains an explicit frozen
zero allocation. Omitting it would lose the order's attribution and reversal
semantics and let later code reinterpret zero as “no Affiliate terms.”

A later program pause, destination rotation, profile change, or default-policy
change affects only new links or orders. Missing, invalid, stale, wrong-network,
or unsupported payout terms fail closed; they are not repaired after order
acceptance by silently selecting another destination.

[RFC-0009](./0009-frozen-payment-attempt-settlement-terms.md) governs when
these terms bind to a payment attempt, their authorization boundary, and how a
settlement action references them. This RFC remains authoritative for the
Affiliate payer, recipient, calculation, reversal, and output rules.
[RFC-0011](./0011-order-settlement-authorization-keys.md) proposes how the
buyer, seller, and moderator keys authorizing those frozen attempt terms are
certified and isolated; it does not change the Affiliate amount or recipient.

### 3. Make the seller the payer

The seller is the commission payer and the direct promoter is the recipient.
Commission is deducted from the seller's order-settlement amount, never added
to the buyer's quoted amount after acceptance and never paid from an unrelated
platform balance.

For each release, value conservation must hold under the rail's native fee
model. Output-value rails such as UTXO satisfy:

```text
buyer refund + seller output + promoter output + declared platform output
  + network fee = consumed input value
```

Contract rails satisfy the equivalent escrow-value equation across released
recipient legs; transaction gas is accounted under the rail's disclosed fee
policy rather than silently removed from escrow value. The frozen Affiliate
amount is deducted from the seller leg. Network-fee allocation, fee and dust
rules must be validated before constructing the action. No output may be
reduced below a rail's valid minimum, and rounding must not create or destroy
value.

### 4. Settle atomically with the order

On an admitted UTXO, Safe, or Solana scope, the promoter output is part of the
same canonical transaction that releases seller funds:

- moderated completion pays seller and promoter;
- cancelable seller confirmation pays seller and promoter;
- buyer cancellation and buyer refund pay no Affiliate commission;
- dispute release reduces the promoter amount according to the seller's final
  release entitlement, never below zero or above the frozen maximum;
- retries rebuild or reconcile the same logical action and must not create a
  second promoter payment.

For a dispute, the promoter amount is the floor of the frozen Affiliate amount
multiplied by the seller award and divided by the frozen seller-gross basis,
capped by both the frozen Affiliate amount and the seller-funded value
available for release. A zero seller award produces no promoter output. This
same rule applies across admitted rails; an adapter cannot invent a different
rounding or denominator.

An unpaid buyer cancellation or seller decline reverses the pending Affiliate
business record as an invalid order outcome. It does not wait for a settlement
transaction that will never contain a promoter output.

The exact output encoding is rail-specific, but the amount, destination,
idempotency, value-conservation, and confirmation semantics are Core-owned.
New rails remain closed until their required settlement operations, output
validation, confirmation, reorg, and retry behavior pass capability gates.
Guest orders use these output rules only within the trust, custody, and
buyer-visibility boundary defined by
[RFC-0010](./0010-guest-checkout-trust-and-custody.md).

### 5. Keep business and settlement state separate

Affiliate commission data has only these business states:

- `pending`: frozen attribution exists and has not been invalidated;
- `reversed`: the attribution or commission is no longer payable under the
  canonical order outcome.

It does not store `earned`, `settling`, or `paid`. Statements and clients derive:

- `pending` from Affiliate business data without an active submitted action;
- `settling` from the matching planned or submitted Core settlement action;
- `paid` only from confirmed chain evidence containing the frozen Affiliate
  output;
- `reversed` from the Affiliate business state and canonical order outcome.

A wallet consolidation or later transfer of the promoter's received balance is
not commission settlement and cannot change these projections.

### 6. Separate destination publication from settlement

The promoter publishes a rail-specific receiving destination through the
Wallet/Receiving model proposed by
[RFC-0008](./0008-node-key-domains-and-receiving-architecture.md). Hosting
validates the rail, network, format, and version, then freezes the destination;
an identity signature proves publication, not independent custody of the
address.

The Core order and payment kernel remain authoritative for settlement command
admission under
[RFC-0006](./0006-payment-kernel-rails-and-trusted-modules.md). Hosting does not
sign order funds, mark a commission paid, or maintain a second settlement state
machine.

### 7. Exclude a separate payout product

This proposal does not add:

- an independent payout engine or provider transfer queue;
- manual eligibility review or an operator approval state;
- promoter claim, withdrawal, or cash-out actions;
- an Affiliate balance ledger presented as withdrawable money;
- a Direct payment product or compatibility with retired escrow contracts;
- multi-level or recurring recruitment commissions.

## Security, privacy, and abuse analysis

Referral tokens and signed sessions are bearer artifacts and require entropy,
expiry, replay protection, one-order consumption, and exact seller/link/order
binding. Self-referral checks must compare the authoritative hosted and Node
identities available to the flow. Broader related-account or collusion rules
need separately reviewed evidence and must not depend on covert fingerprinting.

Payout terms must be included in the signed order settlement contract. A
seller, promoter, client, relay, or retry worker must not replace the frozen
destination or amount after acceptance. Chain/network validation, output-count
fee estimation, dust checks, input reservation, idempotency, replacement
tracking, confirmation, and reorg handling are mandatory for each enabled rail.

A confirmed statement requires evidence of the original Affiliate output, not
merely a transaction hash or a successful later wallet transfer. Public pages
must not expose private contact data, internal risk scores, wallet secrets, or
unnecessary cross-linking between promoter receipts.

## Economic and legal analysis

The seller is the payer, the direct promoter is the recipient, and the frozen
commission is denominated in the order settlement asset. The buyer's accepted
total does not increase because a seller elected to use Affiliate distribution.
Refund and cancellation rules preserve buyer funds; dispute outcomes limit the
commission to value released from the seller leg.

Atomic order settlement avoids a separate platform-held payable balance, but
it does not remove advertising disclosure, tax reporting, sanctions, consumer
protection, affiliate-marketing, or jurisdiction-specific review. Promoters and
sellers need clear disclosure of calculation basis, reversals, network fees,
finality, and the fact that Draft policy is not a guaranteed payout product.

The project must not describe a commission as guaranteed, available, or paid
before the applicable order and chain evidence support that statement.

## Alternatives

### Keep manual review and add a payout ledger

Rejected because it duplicates canonical order outcomes and introduces a
second financial lifecycle, funding source, retry system, and operations path.

### Let promoters claim or withdraw after completion

Rejected because a claim action does not improve funding certainty and creates
new authorization, UX, fee, recovery, and dormant-balance obligations.

### Pay from a platform or seller operating wallet later

Rejected because it separates the obligation from the order funds and can fail
or double-pay after the canonical release is final.

### Derive payout addresses from identity or order-escrow public keys

Rejected because identity, wallet receiving, and multi-party settlement are
different key domains. RFC-0008 defines the replacement boundary.

### Add multi-level Affiliate relationships

Rejected because recruitment graphs, downstream liability, and recursive
economics are outside the validated single-level product.

## Rollout and rollback

This RFC remains Draft until public review resolves its open questions. Code,
tests, or an internal ADR do not by themselves advance its status or prove
release availability.

Implementation may proceed during development without historical-data dual
write, but every enabled rail must provide evidence for:

1. frozen destination and amount validation;
2. moderated complete, cancelable seller confirm, buyer cancel/refund, seller
   decline, and dispute release across each admitted UTXO, Safe, or Solana
   scope;
3. dust, fee, value-conservation, and output-count handling;
4. idempotent retries, replacement tracking, confirmation, and reorg;
5. statement projection from planned/submitted/confirmed actions and outputs;
6. cross-repository contract and end-to-end tests;
7. public seller/promoter disclosure and applicable legal review.

Rollback disables new Affiliate links or per-rail admission. It must continue
to service and reconcile already accepted orders, preserve confirmed history,
and never silently redirect a frozen output. Development records without real
funds may be reset; any real balance or unsettled order requires explicit
owner-directed resolution.

## Documentation impact

- Mark RFC-0004 Superseded and retain it for historical interpretation.
- Link this RFC from RFC-0006 and RFC-0008 without copying their authority;
  link RFC-0009 for frozen attempt terms and RFC-0010 for the Guest custody
  boundary, and RFC-0011 for participant authorization keys.
- Add public seller and promoter task pages, calculation and reversal examples,
  disclosures, supported-rail capability language, and abuse reporting before
  broad release.
- Publish API and statement field contracts only after their schema is stable.
- Add release evidence separately when an Accepted scope actually ships.

## Open questions

1. Which public calculation basis and rounding examples are required before
   Review?
2. Which self-referral and related-account controls are proportionate for the
   first public release?
3. Which jurisdictions require promoter identity, tax, sanctions, or specific
   affiliate disclosures before a rail can be enabled?
4. Should provider-session or fiat rails ever support atomic Affiliate outputs,
   or remain unsupported until a concrete provider contract is proposed?
5. What confirmation depth and reorg language should statements expose across
   supported chains?

## Decision

Pending maintainer review. Until Accepted, this RFC records a proposed public
economic and settlement contract. Effective backend capabilities, signed order
terms, confirmed transaction evidence, and tagged release records remain the
authority for runtime behavior and availability.
