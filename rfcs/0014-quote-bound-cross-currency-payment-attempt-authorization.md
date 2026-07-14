# RFC-0014: Quote-bound Cross-currency Payment Attempt Authorization

- Status: Draft
- Authors: Mobazha payment, order, security, and documentation maintainers
- Created: 2026-07-14
- Updated: 2026-07-14
- Decision owners: Mobazha Open Core payment and order maintainers, Unified maintainers, and documentation maintainers
- Affected surfaces: payment selection quote, payment attempt, settlement authorization wire protocol, payment rails, Unified, hosted Deal acceptance, persistence, recovery, docs
- Supersedes: None
- Superseded by: None

## Summary

Extend the frozen payment-attempt and settlement-authorization model from
same-currency orders to orders whose signed pricing currency differs from the
selected payment asset. A seller-authorized, immutable funding basis binds the
signed order price, exact payment amount, conversion rate and orientation,
rounding policy, quote identity, policy version, and validity window into the
same attempt that owns settlement terms, participant authorization, and the
funding target.

Cross-currency is a product capability, not an invalid order shape. Until the
new protocol is implemented for a rail, route admission must select an already
supported conversion path before starting settlement authorization. It must not
enter the authorization ceremony and fail later merely because pricing and
payment currency differ.

This RFC extends RFC-0009 and RFC-0011. It does not make `SettlementKeyOffer`
an economic quote, does not authorize buyer-computed amounts, and does not mark
cross-currency authorization as released while this RFC remains Draft.

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
  advertises quote-bound authorization v2;
- until v2 is effective for that rail, an existing supported conversion route
  remains admissible and must be selected before the ceremony starts;
- if neither route exists, session creation fails with a stable unsupported
  capability error before creating an attempt, publishing participant offers,
  reserving a target, or exposing an address.

The temporary admitted conversion route is a rollback and continuity measure,
not a second long-term authority. It may be removed per rail only after v2
conformance, recovery, and migration gates pass.

### Canonical funding basis

Every cross-currency v2 attempt owns one immutable
`PaymentAttemptFundingBasis`. Its canonical representation contains at least:

- schema version, order ID, attempt ID, and hash of the signed `OrderOpen`;
- signed pricing currency, amount, and divisibility;
- canonical payment rail/asset ID, payment currency, exact atomic subtotal,
  explicit provider/network cost, explicit platform payment cost, and exact
  buyer payment total;
- `conversionRequired`, exchange-rate value, base currency, quote currency,
  quote divisibility, rate-source update time, and the normative rounding rule;
- quote ID, quote policy version, issuer identity or delegated issuer identity,
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

### Quote authority

The seller is the authority that accepts the payment amount for an order. The
funding basis must therefore be seller-authored or issued by a quote service
whose exact authority the seller explicitly delegates under a versioned
policy. Hosting may produce a Deal payment-selection quote, but Core must load
and verify that immutable quote from its trusted boundary; API callers and
buyers may submit only its opaque ID, never an authoritative amount or rate.

The seller signs settlement terms that bind the funding-basis hash. This
signature means the seller accepts the exact conversion facts and allocation
for the attempt. A buyer-computed quote, unsigned API amount, exchange ticker,
or locally refreshed rate is insufficient authority.

### Protocol separation and sequence

`SettlementKeyOffer` remains a public-key capability offer and carries no
price, rate, fee, or funding amount. Cross-currency economics travel in a
separate attempt funding-basis proposal correlated by order ID, attempt ID,
authorization context, and rail ID.

The normative sequence is:

1. Buyer selects a canonical payment asset and, when required, supplies an
   opaque quote ID.
2. Core loads the signed order and authoritative immutable quote, validates
   issuer policy, order and revision binding, rail, amount derivation, and
   freshness, then creates the non-actionable attempt and canonical funding
   basis.
3. Required participants exchange and durably retain valid key offers for the
   same authorization context.
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

### Versioning and migration

Authorization v1 bytes and hashes remain unchanged and recoverable for
same-currency attempts already created. New cross-currency attempts use v2.
Readers dispatch by explicit version and never reinterpret v1 as v2.

The database adds immutable funding-basis bytes and hash to the attempt. A
deployment first ships readers and persistence, then writers behind a
rail-scoped `quote_bound_authorization_v2` capability. Mixed-version peers
negotiate the effective route before draft creation. There is no synthetic
backfill for historical attempts because their original quote authority cannot
be proven retroactively.

## Security, privacy, and abuse analysis

Canonical hashing and seller authorization protect against amount, rate,
orientation, rounding, fee, quote, order, revision, rail, and attempt
substitution. Quote IDs are opaque references, not bearer authority. Core must
load the quote by tenant/order scope and use constant semantic checks before
accepting caller-controlled identifiers.

Replay is rejected across order ID, attempt ID, authorization context, rail,
signed-order hash, quote ID, and policy version. A quote for one Deal revision,
asset, tenant, or seller delegation cannot authorize another. Implementations
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

### Trust the buyer or API caller's authorized amount

Rejected. The seller cannot verify the signed price conversion and an attacker
could substitute a lower amount, stale rate, or different asset.

### Keep the conversion route permanently outside payment attempts

Rejected as the final design. It restores availability but preserves two
economic authorities and denies cross-currency orders the immutable attempt,
participant binding, and recovery guarantees of RFC-0009 and RFC-0011.

## Rollout and rollback

1. Restore route admission so cross-currency orders outside v2 fall through to
   the already admitted conversion path; add regression coverage proving an
   eligible rail does not enter v1 and still derives the correct atomic amount.
2. Add canonical funding-basis validation, hashing, persistence, quote loading,
   and order/rail/amount/expiry checks without exposing a target.
3. Add authorization v2 wire messages and signatures while retaining v1
   readers. Persist inbound funding basis and offers before seller finalization.
4. Implement seller construction and buyer validation for UTXO, EVM, Solana,
   tokens, moderated orders, Affiliate allocation, and platform terms.
5. Run conformance tests for USD-to-BTC/ETH/token, crypto-to-crypto,
   divisibility and round-up edges, stale quote, tamper, replay, wrong order,
   wrong revision, wrong rail, wrong amount, and valid-then-expired recovery.
6. Enable `quote_bound_authorization_v2` per rail only after restart,
   idempotency, mixed-version, funding observation, refund, dispute, and
   rollback tests pass. Then remove that rail's temporary conversion fallback.
7. Advance the RFC status only with review, tagged release evidence, effective
   capability output, and public user documentation.

Rollback disables new v2 admission per rail. Existing authorized v2 attempts
remain readable and recoverable; authorized targets are never invalidated by a
feature-flag rollback. New cross-currency sessions return to the admitted
conversion path where it is still supported. Rollback must not reintroduce the
same-currency hard-stop.

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

1. What public key or policy document expresses seller delegation to each
   hosted or local quote issuer?
2. Is the full canonical funding basis transported in every final
   authorization, or may peers resolve a content-addressed value with an
   offline-complete retention requirement?
3. What bounded clock-skew value and trusted-time evidence apply at admission
   and seller authorization?
4. Which provider/network costs are estimable before target creation, and what
   policy handles a later chain fee without mutating buyer payment total?
5. Which stable capability and denial codes are exposed to Unified and other
   clients during mixed-version rollout?

## Decision

Pending maintainer review. Until Accepted and implemented with release
evidence, same-currency authorization v1 and any explicitly admitted
cross-currency conversion route remain the effective behavior. Pricing and
payment currency equality is not a protocol invariant.
