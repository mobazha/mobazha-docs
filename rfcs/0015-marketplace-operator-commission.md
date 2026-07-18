# RFC-0015: Marketplace Operator Commission

- Status: Draft
- Authors: Mobazha hosted commerce and documentation maintainers
- Created: 2026-07-17
- Updated: 2026-07-17
- Decision owners: Mobazha hosted commerce, Open Core settlement, Unified, and documentation maintainers
- Affected surfaces: Hosted Marketplace service, Unified operator and seller surfaces, public API, economics, docs; Node order settlement in the settlement phase
- Supersedes: None
- Superseded by: None

## Summary

Give a community marketplace operator a declared, seller-visible commission on
orders their marketplace demonstrably produced. The operator sets a take-rate
in basis points (0–3000) on the marketplace; the rate only becomes effective
when it is snapshotted into a published release; a prospective seller sees the
committed rate before applying or accepting an invite. Orders attributed to
the marketplace produce ledger rows that snapshot the published rate and the
computed operator amount, so later rate edits never rewrite recorded history.

The proposal is phased. Phase 1 (this RFC's hosted scope) is an estimate
ledger: rows are registered at checkout completion, gated by the buyer
journey's prior checkout handoff, and reported to the operator as estimates.
Phase 2 funds the operator amount from the seller's own settlement proceeds as
an additional output of the canonical release transaction, following the
settlement model of RFC-0007; no separate payout engine, balance, or
withdrawal workflow is created. A platform fee slot with identical mechanics
is defined but remains at zero and has no user surface until separately
proposed.

## Problem and evidence

A marketplace operator curates supply, recruits sellers, and brings buyer
demand, but has no revenue path: nothing in the hosted Marketplace model pays
the operator anything for a sale their marketplace produced. This makes the
operator role economically irrational beyond hobby scale and undermines the
recruitment story for community-run marketplaces.

Public evidence:

- The hosted Marketplace model (operator, stores, curation, releases) defines
  operator responsibilities but no operator compensation
  (`mobazha_hosting/db/marketplace.go`, `mobazha_hosting/api/marketplace_handlers.go`).
- The seller-funded Affiliate model (RFC-0007) already established the
  economic pattern this RFC reuses: a demand-bringing party is funded from the
  seller's own order proceeds under terms frozen before acceptance.
- Marketplace attribution events (impression, listing click, checkout
  handoff) already measure the demand the marketplace delivers
  (`mobazha_hosting/api/marketplace_attribution_handlers.go`).

## Proposal

Definitions: the **operator rate** is `operatorCommissionBps` on the
marketplace record; the **published rate** is the value inside the active
release snapshot; an **attributed order** is an order registered against a
marketplace under the gates below.

Behavior:

- The operator sets the rate through the existing marketplace update API.
  The rate rides the release snapshot: editing it marks the draft changed, and
  the change binds only after republish. Buyers and sellers therefore always
  see a committed rate, never a working draft.
- The published rate is public: it appears on the public marketplace
  projection and on invite-link resolution, so a seller reviews the terms
  before applying, accepting an invitation, or joining through an invite link.
- An attributed order is registered once per (order, seller) at checkout
  completion. Registration is refused unless the same buyer journey already
  recorded a checkout handoff for the same listing in that marketplace and the
  listing is currently live there. The row snapshots the published operator
  rate and platform rate and the computed amounts in integer minor units.
- Phase 1 reporting: the operator earnings endpoint aggregates rows per
  pricing currency and status. Rows are labeled estimates; they are not a
  balance, not a payable, and create no payment obligation by themselves.
- Phase 2 settlement: the operator amount becomes an output of the seller's
  canonical release transaction on supported rails, with terms frozen at order
  acceptance, following RFC-0007's single-transaction settlement model. Rows
  then transition to settled or void based on canonical order outcomes
  (refund, cancellation, dispute division), never on hosted-side bookkeeping.
- Compatibility: a marketplace with rate zero behaves exactly as today.
  Existing marketplaces default to zero. No buyer-side price change exists in
  either phase; the buyer pays the listed price.
- Ownership: the hosted Marketplace service owns rates, gates, and the
  estimate ledger; Open Core settlement owns Phase 2 release outputs; Unified
  owns the operator, seller, and buyer surfaces.

## Security, privacy, and abuse analysis

- Registration is a public endpoint and therefore treats the reported amount
  as untrusted. Abuse is bounded by the journey gate (a prior checkout handoff
  for the same listing), the live-listing check, one-row-per-order dedup, and
  the estimate label; Phase 2 replaces reported amounts with canonical
  settlement facts, at which point inflated registrations reconcile to void.
- A malicious operator cannot retroactively change a recorded row: rates are
  snapshotted per row, and rate edits require republish, which is visible to
  sellers.
- The ledger stores order identifiers, seller peer IDs, listing slugs, and
  journey UUIDs — the same identifiers the attribution funnel already stores.
  No buyer personal data is added. Interest-signup emails (a sibling hosted
  feature) are out of scope for this RFC's ledger.
- Operator earnings are visible only to marketplace operators through the
  existing operator authorization check.

## Economic and legal analysis

- Payer: the seller, from their own order proceeds — the buyer price is
  unchanged. Recipient: the marketplace operator. Basis: the attributed
  order's goods amount in its pricing currency, times the published rate,
  floor-rounded in minor units.
- Optionality: the rate is set by each operator (zero by default, capped at
  30%); a seller consents by joining or remaining in a marketplace whose
  published terms they can read. Leaving the marketplace ends future
  attribution.
- Refunds and disputes follow the canonical order in Phase 2: no release, no
  operator output; partial division follows the release outputs. Phase 1
  estimates carry no obligation, so no clawback path is needed.
- The platform fee slot (default zero, no UI) is defined so mechanics need no
  schema change later, but activating any nonzero platform fee requires its
  own RFC with its own economic and legal review.
- Legal review of operator compensation classification (marketplace
  facilitation vs. payment intermediation) is required before Phase 2 ships on
  any rail; Phase 1 records estimates only and moves no funds.

## Alternatives

- Platform-set global commission: rejected — it contradicts the zero-platform-
  fee positioning and removes the operator's pricing autonomy, which is the
  competitive wedge against centrally-priced marketplace platforms.
- Operator-as-affiliate reuse (register the operator as an RFC-0007 affiliate
  per order): attractive rail reuse, but affiliate terms are per-deal-link and
  promoter-scoped, not marketplace-scoped; encoding a marketplace-wide rate as
  thousands of per-order affiliate agreements distorts both records. The
  settlement mechanics are reused instead of the data model.
- Buyer-side service fee: rejected — it changes the buyer price, breaks price
  parity with the seller's own store, and taxes the buyer for the operator's
  service to the seller.
- Hosted payout engine (balance + withdrawal): rejected for the same reasons
  RFC-0007 rejected it — it duplicates facts the canonical order already owns
  and can disagree with refunds and disputes.

## Rollout and rollback

- Phase 1 implementation: `mobazha_hosting` (schema migrations, rate
  validation and release snapshot, gated order registration, earnings
  endpoint, attribution source breakdown) and `mobazha-unified` (operator rate
  setting and earnings dashboard, seller-facing rate disclosure, order
  registration call after submarket checkout). Covered by hosted API tests;
  release evidence is the hosted deployment exposing the new operations in the
  public OpenAPI contract.
- Phase 2 implementation: Open Core settlement and trusted distribution
  modules add the operator output to release transactions per RFC-0007
  mechanics; requires its own conformance vectors before any rail enables it.
- Capability gating: surfaces follow existing marketplace capability flags;
  a deployment that does not enable them keeps rate zero and shows no
  earnings surface.
- Rollback: Phase 1 is additive (new tables, zero-default columns); disabling
  registration stops new rows and existing rows remain inert estimates.
  Phase 2 rollback removes the extra output from future releases only.
- Observability: earnings and attribution summaries expose per-source counts;
  registration refusals are 4xx responses distinguishable by reason.

## Documentation impact

- Update `content/en/sell/marketplace-participation.md` and its `zh-CN`
  translation when the implementing releases ship: the committed commission
  rate is part of the terms a seller reviews before applying; product-group
  selection is no longer required to join any catalog mode; invite links are a
  new admission route for operator-invited marketplaces.
- Add an operator-facing task page for setting the rate and reading the
  earnings ledger (new page, release-gated).
- Registry updates in `rfcs/README.md` and `content/en/project/rfcs.md` ship
  with this RFC.
- RFC-0007 needs no change; this RFC references its settlement model and must
  track it if RFC-0007 is revised.

## Open questions

- Phase 2 rail scope and ordering: which rails ship the operator output
  first, and whether the frozen-terms record extends RFC-0009's attempt terms
  or defines a marketplace-scoped sibling.
- Whether Phase 1 estimates should decay to void after a bounded horizon
  without settlement confirmation, to keep dashboards honest on abandoned
  orders.
- Whether seller-side statements should itemize operator commission per order
  before Phase 2 (transparency vs. presenting an estimate as a charge).

## Decision

Pending. To be filled by decision owners when the RFC leaves Review.
