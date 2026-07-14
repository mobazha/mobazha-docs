# RFC-0014: Quote-bound Cross-currency Payment Attempt Authorization

- Status: Draft
- Authors: Mobazha payment, order, security, and documentation maintainers
- Created: 2026-07-14
- Updated: 2026-07-15
- Decision owners: Mobazha Open Core payment and order maintainers, Unified maintainers, and documentation maintainers
- Affected surfaces: payment selection quote, payment attempt, settlement authorization wire protocol, payment rails, Unified, hosted Deal acceptance, persistence, recovery, docs
- Supersedes: None
- Superseded by: None

## Summary

Extend the frozen payment-attempt and settlement-authorization model from
same-currency orders to orders whose signed pricing currency differs from the
selected payment asset. A buyer-proposed and seller-authorized immutable funding basis binds the
signed order price, exact payment amount, conversion rate and orientation,
rounding policy, quote identity, policy version, and validity window into the
same attempt that owns settlement terms, participant authorization, and the
funding target.

Cross-currency is a product capability, not an invalid order shape. During
development it has one settlement path: quote-bound authorization v2. Missing
quote state or exact-rail v2 capability fails before starting settlement
authorization; it does not fall through to the legacy conversion setup path.

This RFC extends RFC-0009 and RFC-0011. It does not make `SettlementKeyOffer`
an economic quote. A buyer proposal is non-actionable: only seller validation
and a seller signature over its funding-basis hash authorize the amount. This
RFC does not mark cross-currency authorization as released while it remains
Draft.

## Problem and evidence

RFC-0009 requires the payment attempt to be the sole immutable owner of the
economic allocation and forbids a second mutable quote or intent from
disagreeing after the target becomes actionable. RFC-0011 keeps participant
key offers free of economic data and requires unsupported product features to
select another admitted route before an authorization draft exists.

The first settlement-authorization rollout admitted only same-currency
attempts. A rail-scoped capability gate subsequently treated every runtime
eligible rail as authorization eligible, then rejected a standard order when
`pricingCurrency != paymentCurrency`. The existing conversion path and
exchange-rate service remained available, but the new gate returned an error
instead of falling through to that admitted path. Consequently ordinary orders
such as USD-priced goods paid with ETH, BTC, or a token became blocked based on
an implementation-scope condition that was not a product invariant.

Simply deleting the check is not the final protocol fix. The current v1
authorization snapshot freezes a payment-asset amount but does not prove how
that amount was derived from the signed pricing amount. A peer could therefore
observe an amount without being able to verify the quote, orientation,
rounding, expiry, or issuer authority that produced it.

## Proposal

### Capability admission and immediate blocker behavior

Payment-session route admission evaluates order shape and effective rail
capability before creating an authorization draft:

- same-currency orders may enter settlement authorization v1 where the rail's
  attempt owner and funding-target projector are effective;
- cross-currency orders may enter settlement authorization only where the rail
  has an exact funding-target projector and a resolved quote-bound v2 writer;
- missing quote ID, unresolved quote amount, unsupported exact rail, or
  unsupported economic policy fails with a stable
  capability error before creating an attempt, publishing participant offers,
  reserving a target, or exposing an address.

### Canonical funding basis

Every cross-currency v2 attempt owns one immutable
`PaymentAttemptFundingBasis`. Its canonical representation contains at least:

- schema version, order ID, attempt ID, authorization context ID, and hash of
  the signed `OrderOpen`;
- signed pricing currency, amount, and divisibility;
- canonical payment rail/asset ID, payment currency, exact atomic subtotal,
  explicit provider/network cost, explicit platform payment cost, and exact
  buyer payment total;
- `conversionRequired`, exchange-rate value, base currency, quote currency,
  quote divisibility, rate-source update time, and the normative rounding rule;
- quote ID, quote policy version, buyer issuer identity,
  issue time, and expiry time.

Amounts are unsigned canonical base-10 integers without signs, whitespace, or
leading zeros except the value `0`. Currency and asset identifiers use their
canonical registries. Conversion orientation is explicit: implementations may
not infer whether a displayed rate is pricing-per-payment or
payment-per-pricing. Fractional payment atomic units round up so the accepted
funding target cannot underfund the signed price; all implementations must
produce the same integer.

The funding-basis canonical hash is stored on the `PaymentAttempt` and bound by
the seller's settlement-terms authorization. A retry may reuse byte-identical
facts; any change requires a new attempt and, when conversion is required, a
new quote.

### Quote proposal and seller authority

The buyer Core that creates the payment session loads its immutable
`PaymentSelectionQuote` and publishes the resulting canonical funding basis as
a non-actionable proposal. `QuoteIssuer` is the signed `OrderOpen` buyer PeerID
and must equal the outer signed-message sender. v2 does not accept a delegated
quote issuer; delegation requires a later protocol and quote-policy version.

The seller remains the authority that accepts the payment amount. Before it
creates its local attempt or signs terms, seller Core verifies the complete
order, attempt, rail, quote, lifetime, orientation, rounding, and zero-fee
policy bindings. It then refreshes its own exchange-rate snapshot for the same
payment-base/pricing-quote pair and computes the seller-local minimum atomic
payment with the normative round-up rule. The proposal is rejected if it is
below that minimum or the seller snapshot is stale. A proposal above the
minimum may be accepted; this preserves the buyer's selected amount without
allowing underpayment.

The seller signs settlement terms that bind the exact funding-basis hash. That
signature, rather than the buyer's local rate or the proposal message alone,
makes the amount authoritative for the attempt.

### Protocol separation and sequence

`SettlementKeyOffer` remains a public-key capability offer and carries no
price, rate, fee, or funding amount. Cross-currency economics travel in a
separate attempt funding-basis proposal correlated by order ID, attempt ID,
authorization context, and rail ID.

The normative sequence is:

1. Buyer selects a canonical payment asset and, when required, supplies an
   opaque quote ID.
2. Buyer Core loads its signed order and immutable local quote, validates its
   order, rail, amount derivation, and freshness, creates the non-actionable
   attempt, and sends the complete canonical funding-basis proposal to the
   seller in a signed order message.
3. Seller durably retains the proposal, verifies that the issuer is the signed
   buyer, refreshes its own rate, and admits only a proposal at or above its
   local atomic minimum. Required participants then exchange and durably retain
   valid key offers for the same authorization context.
4. Seller resolves payout, fee, Affiliate, moderator, dispute, and timeout
   facts, constructs settlement terms binding the funding-basis hash, and signs
   the terms.
5. The final authorization snapshot carries or references the complete
   canonical funding basis, terms, target commitment, participant bundle, and
   all matching hashes.
6. Buyer validates every signature and binding and durably retains the same
   snapshot before the funding target becomes actionable.

No participant may refresh the rate, recalculate the amount, swap the quote,
or change the payment asset after step 4. Such a change abandons the draft and
starts a new attempt.

### Expiry and recovery semantics

The quote must be unexpired when Core admits the attempt and when the seller
signs the funding-basis-bound settlement terms. Those checks use a bounded
clock-skew policy and are auditable.

After valid seller authorization is frozen and retained, later quote expiry
does not invalidate the attempt, funding target, restart recovery, or adoption
of an already submitted transaction. Expiry prevents creating or authorizing a
new attempt; it is not a mutable cancellation switch for an authorized one.
An attempt that reaches quote expiry before seller authorization becomes
terminally expired and cannot expose a target.

### Versioning and development migration

Same-currency attempts use authorization v1 because they have no conversion
funding basis. Cross-currency attempts use v2. Readers dispatch by explicit
version and never reinterpret v1 as v2; this separation is part of the current
protocol, not compatibility with old nodes.

The database stores immutable funding-basis bytes and hash on the attempt and
uses a durable seller proposal inbox. Development environments migrate or
reset to the current schema. Mixed-version peer negotiation, legacy-node
fallback, and synthetic backfill of historical cross-currency attempts are out
of scope.

## Security, privacy, and abuse analysis

Canonical hashing and seller authorization protect against amount, rate,
orientation, rounding, fee, quote, order, revision, rail, and attempt
substitution. Quote IDs are opaque references, not bearer authority. Core must
load the quote by tenant/order scope and use constant semantic checks before
accepting caller-controlled identifiers.

Replay is rejected across order ID, attempt ID, authorization context, rail,
signed-order hash, quote ID, buyer issuer, and policy version. A quote for one
Deal revision, asset, tenant, or buyer cannot authorize another. Implementations
fail closed on unknown versions, issuer policies, currencies, divisibility,
rounding rules, malformed atomic values, expired pre-authorization quotes, or
hash disagreement.

Exchange-rate source details may reveal commercial routing and should be no
more public than needed for verification. Private provider credentials,
internal risk signals, and buyer payment instruments never enter the public
funding basis. Logs may record IDs, hashes, policy versions, and reason codes,
but not secrets or full private provider payloads.

## Economic and legal analysis

The funding basis makes the payer amount, seller pricing basis, conversion
rate, rounding, network/provider cost, and platform payment cost reviewable. It
does not approve a new fee or spread. Every non-zero cost requires an accepted
policy and explicit recipient/basis documentation; zero-fee pilot policy must
remain versioned rather than implied.

Quoted conversion can create consumer-disclosure, money-transmission, payment
service, tax, refund, and price-expiry obligations that vary by provider and
jurisdiction. Product UI must disclose the pricing currency, payment asset,
exact payment total, rate, included costs, expiry, and who supplies conversion.
Refund and dispute calculations use frozen attempt facts and may not silently
refresh the rate at refund time.

## Alternatives

### Require pricing and payment currency to match

Rejected. This is an implementation limitation presented as a product rule and
would remove supported crypto payment choices from fiat-priced and
crypto-cross-priced orders.

### Put conversion facts in `SettlementKeyOffer`

Rejected. Key offers establish participant public-key capability before the
seller freezes economics. Combining them would create multiple economic
proposals, couple key reuse safety to quote refresh, and violate RFC-0011's
separation.

### Trust the buyer or API caller's proposed amount without seller validation

Rejected. The buyer may propose a canonical amount derived from its local
quote, but an unsigned API amount or proposal below the seller-local fresh-rate
minimum cannot become actionable. Seller validation and signature are
mandatory.

### Keep the conversion route permanently outside payment attempts

Rejected as the final design. It restores availability but preserves two
economic authorities and denies cross-currency orders the immutable attempt,
participant binding, and recovery guarantees of RFC-0009 and RFC-0011.

## Rollout and rollback

1. Require every cross-currency crypto session to resolve a quote-bound v2
   writer before draft creation; remove the legacy conversion fallback.
2. Add canonical funding-basis validation, hashing, persistence, quote loading,
   and order/rail/amount/expiry checks without exposing a target. Implemented
   in Open Core on 2026-07-15; release evidence remains pending.
3. Add a signed funding-basis proposal wire message and authorization v2 final
   snapshot while retaining v1 readers. Persist inbound funding basis and
   offers before seller finalization. Implemented in Open Core on 2026-07-15;
   release evidence remains pending.
4. Implement seller-local fresh-rate floor validation, seller construction,
   and byte-identical buyer validation for the exact rail. Base EVM/token and
   finalization/adoption coverage is implemented; UTXO, Solana, moderated,
   Affiliate, and platform-term release conformance remains required.
5. Run conformance tests for USD-to-BTC/ETH/token, crypto-to-crypto,
   divisibility and round-up edges, stale quote, tamper, replay, wrong order,
   wrong revision, wrong rail, wrong amount, and valid-then-expired recovery.
6. Enable `quote_bound_authorization_v2` per rail only after restart,
   idempotency, funding observation, refund, and dispute tests pass.
7. Advance the RFC status only with review, tagged release evidence, effective
   capability output, and public user documentation.

During development, disabling a rail's v2 writer makes new cross-currency
sessions fail before draft creation. It does not redirect them to a legacy
conversion path.

## Documentation impact

- Add this RFC to English and Chinese public registries and cross-link it from
  RFC-0006, RFC-0009, and RFC-0011.
- Keep a code-near v2 authorization contract in the Open Core repository,
  including canonical fields, state transitions, capability names, and test
  vectors.
- Update payment selection, payment session, Deal checkout, fees, refunds,
  dispute, recovery, capability, API, and release-note pages when effective
  behavior ships.
- UI documentation must distinguish quote expiry before authorization from the
  continued validity of an already frozen attempt.

## Open questions

Resolved for v2: delegated quote issuers are not accepted, and both the
proposal message and final authorization transport the complete canonical
funding basis.

1. What bounded clock-skew value and trusted-time evidence apply at admission
   and seller authorization?
2. Which provider/network costs are estimable before target creation, and what
   policy handles a later chain fee without mutating buyer payment total?
3. Which stable capability and denial codes are exposed to Unified and other
   clients for missing quote or exact-rail v2 capability?

## Decision

Pending maintainer review. The Open Core v2 writer, signed proposal transport,
seller-local rate-floor validation, and final authorization reader are
implemented but not yet release evidence. Cross-currency development traffic
uses only this v2 path; same-currency authorization v1 remains a distinct
current protocol. Pricing and payment currency equality is not a protocol
invariant.
