---
title: From offer to fulfillment
summary: Connect product shape, listing revisions, collections, discounts, supply facts, delivery choices, and fulfillment evidence without confusing presentation with a seller's accepted obligation.
status: Beta
audiences:
  - Sellers
  - Buyers
  - Operators
  - Developers
  - Evaluators
evidenceLabel: Mobazha public listing, collection, discount, shipping, supply, fulfillment, quote, and order contracts
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: Model a sellable offer and its fulfillment path while preserving the facts accepted by an existing order.
estimatedTime: 10 minutes
journey: use
primaryAction:
  label: Create a listing
  href: /sell/listings
featuredVisual: offer-to-fulfillment
---

## One sellable promise, several supporting models

A buyer experiences a product page as one offer. Behind it, Mobazha keeps several concerns separate so that merchandising, supply automation, and fulfillment changes do not silently rewrite a seller's obligation.

| Concern | What it owns | What it does not own |
|---|---|---|
| Product or service shape | Buyer-visible description, options, media, and the nature of the promised item or outcome | Payment state or fulfillment completion |
| Listing revision | Seller's current retail terms, price, availability, policies, and eligible fulfillment paths | Terms already accepted into an existing order |
| Collection or presentation | Grouping, ordering, filtering, and discovery context | A second copy of the listing or another inventory ledger |
| Discount | A bounded pricing rule and its eligibility | The base listing, payment verification, or historical order total |
| Supply binding | Relationship to seller stock, capacity, or an external source | Authority to publish seller drafts or change retail terms without policy |
| Fulfillment plan | How the accepted obligation will be delivered and evidenced | Permission to advance the order outside admitted state transitions |

The durable unit is not a product-type label. It is a seller-owned promise that can be quoted, accepted into an order, fulfilled, and later explained from preserved evidence.

## Product shape, supply source, and fulfillment path are independent

“Physical,” “digital,” “service,” or a vertical category can help choose fields and buyer language, but one label should not determine the entire transaction. Three questions need separate answers:

1. **What is promised?** An item, access right, file, license, appointment, capacity, or another supported outcome.
2. **Where does availability come from?** Seller-held inventory, seller-managed capacity, or an explicitly configured external source.
3. **How is it fulfilled?** Seller shipping, pickup, digital delivery, service completion, an external fulfillment provider, or another versioned contract.

This separation supports more than one operating model without creating a new universal “product type” for every provider or vertical.

| Example shape | Possible supply fact | Possible fulfillment fact |
|---|---|---|
| Physical item | Seller quantity or external supplier availability | Seller shipment, pickup, or provider shipment |
| Digital item | License, entitlement, or bounded availability | Download, key, account grant, or another supported delivery record |
| Service or capacity | Time, quota, seat, or operator availability | Appointment, completion, redemption, or attestation |
| Collectible or specialized vertical | Physical, digital, tokenized, or mixed facts | Only the explicitly supported shipping, delivery, or extension contract |

These examples are a modeling guide, not a claim that every deployment supports every combination.

## The listing is the seller's current offer

A useful listing makes the sellable promise inspectable:

- seller and store identity;
- title, description, media, options, and buyer-visible condition;
- retail price, currency, taxes, and seller-defined charges;
- quantity, capacity, or another availability signal;
- eligible shipping, delivery, redemption, or service conditions;
- return, refund, warranty, eligibility, and other applicable policies;
- publication status and revision evidence.

Publishing a listing does not prove that it can be purchased. Checkout still needs a compatible store context, available supply, delivery path, payment capability, and valid quote.

- [Create and validate a listing](/sell/listings)
- [Prepare a store for its first order](/sell/store-setup)

## Collections and storefronts change discovery, not ownership

A Collection can group and order seller listings for browsing. A Storefront can apply a catalog filter or presentation rule to the same store. A community market can project selected offers from several consenting stores.

These are composable views over authoritative listings:

- removing an item from a Collection does not delete the listing;
- changing a Storefront filter does not change the parent store's accepted orders;
- featuring an item in a market does not transfer seller or payment authority;
- a missing projection should be repaired from the listing source rather than treated as a new inventory truth.

Manual and rule-driven organization, sort modes, visibility, and filtering remain capability-dependent. When a view changes price presentation, the final quote must identify the applied rule and accepted amount.

- [Understand stores, storefronts, and channels](/project/identity-and-stores)
- [Understand community markets and curation](/project/community-commerce)

## Discounts become quote facts before they become order facts

A discount can be automatic or require an explicit code or condition when supported. It may target particular products, Collections, stores, quantities, buyers, or time windows. The effective rule must be evaluated before confirmation and shown in the final cost breakdown.

The safe sequence is:

1. evaluate eligibility against the current cart, identity, store, time, and rule state;
2. calculate the discount with defined currency and rounding behavior;
3. identify the discount and recipient impact in the quote;
4. snapshot the accepted result into the order;
5. enforce usage, expiry, cancellation, refund, and reversal rules without rewriting history.

A later promotion edit must not change an existing order total. A frontend label is not sufficient evidence that a discount was accepted.

## Supply automation informs the offer; it does not own it

An external supply or fulfillment provider can contribute catalog data, availability, supplier cost, shipping estimates, production status, and tracking. Mobazha can bind a provider product to a store listing and bind supplier work back to the store's order.

The boundaries remain explicit:

- the provider owns its external catalog, job, and observations;
- the seller owns retail selection, markup, policies, and publication decisions;
- Core owns the quote, order, admitted business transitions, and audit trail;
- credentials, webhooks, retries, provider failures, and reconciliation stay inside the configured integration boundary.

If external availability becomes uncertain, new purchases should fail closed or the affected offer should become unavailable according to policy. Automation must not publish a seller draft merely because supplier stock returned.

## Fulfillment preserves the accepted obligation

At checkout, the buyer selects only a delivery option valid for the item, destination, and active capability. The accepted order preserves the selected service, amount, address or delivery target, and applicable terms.

After payment and seller acceptance, fulfillment may involve one seller-managed shipment or several explicit provider/location groups. External provider status is operational evidence; Core decides whether it is sufficient to advance the order. Tracking, delivery, digital access, service completion, pickup, or attestation should be recorded through the supported fulfillment path.

- [Configure shipping and delivery](/sell/shipping)
- [Operate incoming orders](/sell/orders)
- [Follow the order and payment transaction spine](/project/transaction-spine)

Do not attach physical shipping to a digital or service flow merely to satisfy a UI requirement. If the connected distribution lacks the required delivery contract, the offer is not ready to sell through that path.

## Change safety after an order exists

Once a buyer accepts a quote, later changes to a listing, Collection, discount, supplier cost, shipping profile, provider, or Storefront must not silently alter that order. Preserve the accepted snapshot and bind later fulfillment and recovery evidence to the same order identity.

| Change | New buyers | Existing orders |
|---|---|---|
| Listing price or description | Use the new admitted revision | Keep the accepted item and price snapshot |
| Collection or featured position | Use the new discovery projection | No effect on the order obligation |
| Discount rule | Re-evaluate for a new quote | Keep the accepted discount and total |
| Supply availability or cost | Re-evaluate admission and seller policy | Reconcile the accepted obligation; do not rewrite it |
| Shipping or provider configuration | Offer only currently valid paths | Service the persisted binding or use an explicit recovery action |

## Current contract and evolution direction

| Area | Public meaning now | Direction that must remain labeled |
|---|---|---|
| Listings | Versioned seller offers carry buyer-visible item, price, availability, policy, and fulfillment data | Richer product schemas and vertical-specific authoring |
| Collections and discounts | Store-scoped merchandising and bounded pricing contracts exist where enabled | More rule builders, targeting, analytics, and cross-surface editing |
| Shipping | Profiles and buyer-selected options bind delivery eligibility and cost to the order | More carrier, pickup, and regional integrations |
| External supply and fulfillment | Provider contracts and durable listing/order mappings can isolate external work from Core state | More providers, reconciliation tooling, and seller controls |
| Digital, service, and specialized fulfillment | The offer must use an explicitly supported delivery or extension contract | Additional typed delivery and order-resource providers |

The connected backend's effective capabilities, applicable release, quote, and order evidence remain authoritative. A product label, provider package, configuration field, or internal plan does not activate a sellable fulfillment path.
