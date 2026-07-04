---
title: Prepare a store for its first order
summary: Configure store identity, policies, fulfillment, payments, and a complete test journey before accepting buyer funds.
status: Beta
audiences:
  - Sellers
  - Operators
evidenceLabel: Unified seller administration routes
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
outcome: Publish a store that can complete one representative buyer journey without hidden operator steps.
estimatedTime: 30–60 minutes
journey: use
primaryAction:
  label: Begin the readiness check
  href: /sell/store-setup#before-you-start
---

## Before you start

- Choose hosted or self-hosted operation and confirm the backend is healthy.
- Use an administrator identity for the intended store, not a buyer session from another deployment.
- Prepare public store name, contact path, currency display, fulfillment regions, return terms, and payment methods.
- Keep recovery material outside the browser and create a backup before material configuration changes.

## Store setup steps

1. Open **Admin** and review the store identity under profile or general settings.
2. Set the public name, description, contact route, locale, currency display, and storefront presentation.
3. Publish shipping, return, refund, privacy, and buyer-protection terms appropriate to the operator.
4. Configure at least one shipping or delivery path for the products you intend to sell.
5. Enable only payment methods that the backend reports as ready and that you can monitor operationally.
6. Create one complete test listing with media, availability, price, options, and fulfillment eligibility.
7. Open the public storefront in a separate buyer context and complete a testnet checkout through fulfillment.

## Expected result and verification

The public storefront should show the intended identity, policies, listing, total price components, available delivery, and only ready payment methods. The administrator should receive the test order and inspect payment and fulfillment state without hidden tooling.

## If something fails

- If the public store differs from Admin, confirm the store or storefront context and refresh authoritative settings.
- If checkout has no delivery option, verify the listing is assigned to an eligible shipping profile or digital path.
- If payment is absent, inspect runtime readiness rather than adding a frontend-only identifier.
- If buyer and seller routes share credentials unexpectedly, stop using material funds and report the isolation defect.

## Continue

- [Create and validate a listing](/sell/listings)
- [Configure shipping](/sell/shipping)
- [Prepare payments](/sell/payments)
- [Operate incoming orders](/sell/orders)
