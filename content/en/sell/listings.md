---
title: Create and validate a listing
summary: Publish an accurate item with explicit options, price, availability, fulfillment, and buyer-visible terms.
status: Beta
audiences:
  - Sellers
evidenceLabel: Unified listing editor and Node listing API
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/listing
reviewed: 2026-07-06
pageType: task
lastTested: 2026-07-04
outcome: Publish one listing that a buyer can understand, quote, and purchase through its intended fulfillment path.
estimatedTime: 15–30 minutes
journey: use
primaryAction:
  label: Prepare the listing inputs
  href: /sell/listings#before-you-start
---

## Before you start

- Prepare a truthful title, description, media, price, quantity or service capacity, and delivery conditions.
- Decide whether the item is physical, digital, a service, or another supported listing type.
- Configure required shipping or delivery support before publication.
- Do not describe a Token or payment capability as available merely because its identifier parses.

## Choose the correct creation path

| Path | Use it for | Availability note |
|---|---|---|
| `/admin/products` | Review publication state, availability, price, and existing listings. | Primary administration surface. |
| `/listing/new` | Build a complete listing with product-type fields, media, options, pricing, and fulfillment. | Preferred path for a first representative listing. |
| `/listing/quick` | Create from a smaller field set, then complete the listing before relying on it. | Use only when this entry point is present in the active distribution. |
| `/listing/import` or Admin import | Normalize external catalog data into Mobazha listing and supply facts. | Imported data still requires seller review and publication. |
| `/admin/collections` | Curate published listings into buyer-visible groups. | Merchandising; does not change order authority. |
| `/admin/discounts` | Define eligible price adjustments and codes. | The accepted quote must show the applied result. |

## Keep product shape, option, and supply separate

| Fact | Example | Why it is separate |
|---|---|---|
| Product type | Physical good, digital good, service, collectible, or another supported type | Determines required fulfillment and buyer-visible fields. |
| Option | Color, size, license tier, session length | A buyer-selected property of the offer. |
| Variant / SKU | Blue + large, or Pro + annual | Identifies a purchasable combination; it is not a supplier identity. |
| Availability | Inventory, provider supply, service capacity, or eligibility | Answers whether the combination can be fulfilled now. |
| Fulfillment | Shipping profile, digital delivery, booking, redemption, or provider path | Answers how the accepted promise will be completed. |

## Listing steps

1. Open **Admin → Products**, confirm the active store, and choose the complete `/listing/new` path for the first representative offer.
2. Select the product type first; then enter the title, description, category, buyer-visible media, and type-specific facts.
3. Enter price and currency with correct divisibility. Verify the rendered amount rather than trusting stored integer units.
4. Add option dimensions and variants. Give each purchasable combination a meaningful SKU or identity only where supported and useful.
5. Attach availability separately from the option labels: local inventory, service capacity, provider supply, or another supported source.
6. Assign shipping, digital delivery, service fulfillment, redemption, or another valid path appropriate to the type and destination.
7. Add return, refund, warranty, eligibility, or redemption conditions that the seller can actually honor.
8. Save the draft, preview `/product/{slug}` in a buyer context, then publish.
9. If applicable, place the listing in a Collection or attach a Discount, then request a fresh quote and verify the result rather than assuming merchandising changed the order correctly.

## Expected result and verification

Open the public product URL in a buyer context. Verify title, media, product type, options, variant availability, displayed price, seller identity, policies, and destination-appropriate fulfillment. Add the item to a cart and request a fresh quote. Continue until checkout presents a valid delivery and payment path; publication alone does not prove the offer can become an order.

## If something fails

- If the item saves but is not public, inspect publication state, storefront context, indexing, and runtime capabilities.
- If an option cannot be purchased, check variant completeness and availability.
- If price renders incorrectly, stop publication and verify amount units, currency, and divisibility.
- If shipping is unavailable, assign the listing to a compatible profile and retest the buyer destination.
- If an imported or provider-backed item is public but unavailable, inspect the normalized supply record instead of inventing inventory in the listing option fields.

## Change safety

When editing a listing with active orders, preserve the version and terms accepted by existing buyers. A new listing revision must not silently rewrite an already created order.
