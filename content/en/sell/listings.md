---
title: Create and validate a listing
summary: Publish an accurate item with explicit options, price, availability, fulfillment, and buyer-visible terms.
status: Beta
audiences:
  - Sellers
evidenceLabel: Unified listing editor and Node listing API
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/listing
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
---

## Before you start

- Prepare a truthful title, description, media, price, quantity or service capacity, and delivery conditions.
- Decide whether the item is physical, digital, a service, or another supported listing type.
- Configure required shipping or delivery support before publication.
- Do not describe a Token or payment capability as available merely because its identifier parses.

## Listing steps

1. Open **Admin → Products** or the supported **New Listing** entry point.
2. Choose listing type and enter title, description, category, and buyer-visible media.
3. Enter price and currency with correct divisibility; verify the rendered amount before saving.
4. Add options or variants and ensure every purchasable combination has meaningful availability.
5. Assign shipping, digital delivery, or service fulfillment appropriate to the item.
6. Add clear return, refund, warranty, eligibility, or redemption conditions where applicable.
7. Save the draft, preview the public page, then publish after buyer-visible validation.

## Expected result and verification

Open the public product URL in a buyer context. Verify title, media, options, price, fulfillment, availability, seller identity, policies, and checkout eligibility. Add the item to a cart and request a supply quote; publication alone does not prove it can be purchased.

## If something fails

- If the item saves but is not public, inspect publication state, storefront context, indexing, and runtime capabilities.
- If an option cannot be purchased, check variant completeness and availability.
- If price renders incorrectly, stop publication and verify amount units, currency, and divisibility.
- If shipping is unavailable, assign the listing to a compatible profile and retest the buyer destination.

## Change safety

When editing a listing with active orders, preserve the version and terms accepted by existing buyers. A new listing revision must not silently rewrite an already created order.
