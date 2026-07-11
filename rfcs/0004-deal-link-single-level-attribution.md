# RFC-0004: Deal Link Single-Level Attribution

- Status: Superseded
- Authors: Mobazha product, architecture, and documentation maintainers
- Created: 2026-07-05
- Updated: 2026-07-11
- Decision owners: Mobazha hosted commerce, Open Core, Unified, and documentation maintainers
- Affected surfaces: hosted service, Deal Link checkout, Unified, public API, economics, abuse operations
- Supersedes: None
- Superseded by: RFC-0007

> Superseded by
> [RFC-0007](./0007-seller-funded-affiliate-atomic-settlement.md). This record
> preserves the earlier manual-review-only proposal; it is not the current
> target for Affiliate settlement.

## Summary

Add one explicit, auditable attribution source to a Deal Link order without
creating a referral tree, multi-touch marketing system, automatic commission
balance, or new payment rail.

The proposed sequence is:

```text
seller promotion program
  -> promoter direct link
  -> short-lived signed attribution claim
  -> Deal Link order acceptance consumes the claim once
  -> later eligibility and settlement review
```

The attribution claim records evidence and an immutable policy snapshot. It is
not money, a guaranteed commission, a payable balance, or proof that funds have
been reserved. Initial API projections must describe settlement as
`manual_review_only`.

## Problem and evidence

Deal Link provides a focused route from an agreed offer to an immutable quote,
order, payment, fulfillment, refund, and dispute flow. Sellers also need to
learn whether a named promoter can produce completed transactions. Reusing
anonymous impression or click analytics for money would make browser events a
financial authority and would not provide one-time consumption, stable order
binding, or an immutable rate snapshot.

Building a multi-level referral system before direct-link conversion is proven
would add identity graphs, recursive liability, payout obligations, and abuse
paths without validating the primary user problem. The smallest useful proof is
one promoter, one direct link, and at most one claim on one order.

## Proposal

### Boundaries

This RFC proposes:

- seller-owned promotion programs bound to a Deal Link;
- immutable program economics after creation, with pause and activation as the
  only lifecycle changes;
- one reusable random direct link per promoter and program;
- a short-lived server-signed claim created only from an active direct link;
- at most one claim on an order, consumed through the same database transaction
  that finalizes the Deal acceptance record;
- an immutable claim snapshot containing the Deal revision and terms hash,
  policy version, basis-point rate, calculation base, cap, currency, and
  declared funding source;
- explicit self-referral rejection;
- automatic creation of a non-payable provisional observation when the claim
  and authoritative order are atomically bound;
- manual eligibility review before any payable balance, promoter statement,
  settlement ledger entry, or payout.

This RFC does not propose:

- first-level or second-level downstream relationships;
- recruitment rewards or commission on another promoter's activity;
- multi-touch, last-click, cookie, fingerprint, or cross-device attribution;
- automatic payable commission creation, payout, Provider transfer, or escrow
  split; the provisional observation is audit evidence only;
- a change to the canonical order, refund, dispute, or payment state machines;
- selecting Stripe, PayPal, cryptocurrency, or any other payment method from a
  Deal Link or promotion link;
- strict liability for a promoter who did not know of, participate in, or
  conspire in seller fraud.

### Authority model

The hosted commerce database owns promotion programs, direct links, claims, and
their binding to the Deal acceptance audit record. The canonical Node order
continues to own commerce state. Anonymous marketplace attribution events remain
analytics-only and must never mint a financial claim.

The seller may create and pause a program for a Deal Link they own. A promoter
may create or reuse only their own direct link. A buyer may present a signed
claim during authenticated Deal acceptance. The server, not the browser,
decides whether that claim matches the immutable Deal revision and whether it is
eligible to reserve.

### Program contract

A promotion program records:

- owning seller tenant and seller peer;
- Deal Link identity;
- immutable schema and policy versions;
- commission rate in basis points;
- `gross_order_amount` as the first calculation base;
- optional maximum commission amount and exact currency;
- attribution window between one hour and 30 days;
- declared funding source;
- `draft`, `active`, or `paused` lifecycle state.

A currency change on the underlying Deal invalidates activation and public
resolution of the old program. The seller creates a new program rather than
rewriting the meaning of existing claims.

### Claim contract

The server signs a compact claim reference with a dedicated HMAC-SHA-256 key.
The key must not be shared with authentication, stream, payment Provider, or
webhook signing domains. Deployments without at least 32 bytes of dedicated key
material fail closed for claim issuance and verification.

The persisted claim snapshots the direct link, promoter, seller, Deal Link,
Deal revision, terms hash, policy version, rate, calculation base, cap,
currency, funding declaration, issue time, and expiry. The client receives a
signed opaque reference, not authority to change those fields.

During Deal acceptance, the hosted service:

1. verifies the HMAC and expiry;
2. loads the persisted claim;
3. rejects seller, promoter, or buyer identity overlap;
4. validates the exact Deal Link, revision, and terms hash;
5. atomically changes `issued` to `reserved` with the acceptance record;
6. changes `reserved` to `consumed` with the authoritative order ID when order
   creation is verified;
7. releases the reservation only after a known-safe pre-order failure;
8. leaves uncertain post-order outcomes reserved for reconciliation.

Step 6 may also create a non-payable provisional commission observation in the
same transaction. That row records what the immutable policy would calculate;
it is not a balance, statement item, settlement instruction, or promise to pay.
Only the separately gated manual eligibility decision may promote it toward a
payable ledger state.

A consumed or reserved claim cannot be attached to another order. A buyer may
still accept a Deal without any attribution claim.

### API shape

The first hosted-service contract uses the `/platform/v1` namespace:

```text
POST /platform/v1/deal-promotion-programs
GET  /platform/v1/deal-promotion-programs
POST /platform/v1/deal-promotion-programs/{id}/activate
POST /platform/v1/deal-promotion-programs/{id}/pause
POST /platform/v1/deal-promotion-programs/{id}/links

GET  /platform/v1/public/deal-promotion-links/{token}
POST /platform/v1/public/deal-promotion-links/{token}/claims
POST /platform/v1/public/deal-links/{token}/accept
```

The acceptance request adds an optional `attributionClaim`. Existing clients
remain compatible because unattributed checkout is unchanged.

## Security, privacy, and abuse analysis

Random public tokens prevent enumeration but are bearer links and may be
shared. HMAC signing prevents clients from manufacturing a claim ID or expiry;
database state provides revocation and one-time consumption. The service uses a
constant-time MAC comparison and does not store raw signing keys or raw
authentication credentials in claim rows.

Self-referral checks compare both hosted user identity and Node peer identity.
Related-account, test-order, sanctions, geography, collusion, and device-risk
signals require separately reviewed rules. Until those rules exist, consumed
claims remain evidence for manual review and must not become guaranteed payable
balances.

Claims reveal a program's rate and cap to the buyer who opened the link. The
public API must not reveal promoter user IDs, private contact information,
internal risk scores, or seller credentials. Retention and data-subject handling
for claims require a policy before broad availability.

Program pause prevents new claims. Emergency operations may also disable the
dedicated signing key. Already consumed evidence remains append-only; correction
uses an explicit later reversal or rejection record rather than deletion.

## Economic and legal analysis

The seller is the proposed payer and the direct promoter is the proposed
recipient. The first calculation base is the gross order amount, with a rate in
basis points and an optional cap in the Deal currency. This is a policy snapshot,
not a settlement calculation.

No commission is eligible merely because a claim is consumed. Eligibility must
later account for authoritative payment, acceptance or completion, refunds,
chargebacks, disputes, fraud review, test orders, related accounts, regional
rules, tax documentation, and the actual availability of seller-funded money.

The initial `seller_manual_budget` value is a declared source for review. It does
not assert that funds are locked. The product must not display "guaranteed",
"available", or "withdrawable" until a reviewed ledger and funding control prove
those statements.

Promoter responsibility should be based on evidence of knowledge,
participation, or conspiracy, not automatic equal liability for every seller
misrepresentation. Consumer protection, advertising, affiliate disclosure,
tax, money transmission, payout eligibility, and jurisdiction-specific rules
need legal review before general availability.

## Alternatives

### Put a promoter code directly on the order

Rejected because a guessable or user-authored code has no issuance evidence,
expiry, revocation, or one-time-consumption state.

### Reuse impression and click analytics

Rejected because analytics are anonymous, mutable in interpretation, and not a
financial authority.

### Store the claim only in a browser cookie

Rejected because it creates ambient tracking, weak cross-client behavior, and
no durable one-order binding. Explicit claim presentation is easier to inspect
and consent to.

### Add two-level commission now

Rejected because it changes the product from direct distribution evidence to a
recruitment graph before direct-link conversion and seller funding are proven.

### Split commission during Stripe or escrow payment

Rejected for this gate. Attribution is independent of the buyer's selected
payment method, and automatic split settlement would couple an unproven
economics policy to Provider and escrow state machines.

## Rollout and rollback

The first implementation slice belongs to the hosted-service repository and
includes additive database migration, program/link/claim services, public API,
OpenAPI coverage, HMAC configuration, and transaction tests. It is foundation
evidence only; it does not advance this RFC beyond Draft or activate payable
commissions.

Rollout gates are:

1. migration and API contract tests pass on SQLite and PostgreSQL;
2. concurrency tests prove one claim cannot bind two acceptances;
3. end-to-end tests prove exact Deal revision binding and safe failure release;
4. a pilot has explicit operator review and no automatic payout;
5. funding, eligibility, refund, dispute, and reversal policy is accepted before
   ledger implementation;
6. Unified exposes a promoter or seller page only after the API and language are
   reviewed.

Rollback pauses all programs or removes the attribution signing key. Additive
tables and consumed audit evidence remain readable. Existing unattributed Deal
checkout continues to work.

## Documentation impact

Before public launch, add seller and promoter task pages, buyer disclosure,
abuse-reporting guidance, API reference examples, configuration guidance, and
release evidence. Public pages must distinguish Draft policy, Beta evidence, and
current runtime capability. The hosted implementation checklist remains the
authority for code-level completion.

## Open questions

1. Which funded mechanism makes seller commission promises enforceable?
2. Which order event starts the 15-30 day eligibility delay for each Deal type?
3. How are partial refunds, full refunds, chargebacks, disputes, and late fraud
   represented as pending, reversed, or disputed ledger movements?
4. Which signals define related accounts without unsafe fingerprinting or false
   positives?
5. How are test orders explicitly marked and excluded?
6. What retention, export, deletion, tax, identity, and regional eligibility
   rules apply to promoter records?
7. Which pilot metrics justify proceeding from attribution evidence to a
   commission ledger?

## Decision

Superseded on 2026-07-11 by RFC-0007. The successor retains single-level,
auditable attribution but replaces manual eligibility and a future payout
ledger with seller-funded Affiliate outputs in the canonical order settlement.
This status does not claim that RFC-0007 is Accepted or Implemented.
