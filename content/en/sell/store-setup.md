---
title: Prepare a store for its first order
summary: Configure store identity, policies, fulfillment, payments, and a complete test journey before accepting buyer funds.
status: Beta
audiences:
  - Sellers
  - Operators
evidenceLabel: Unified seller administration routes
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin
reviewed: 2026-07-18
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

## Know which surface you are changing

| Admin surface | Current route | What it controls |
|---|---|---|
| Store profile | `/admin/settings/profile` | Public operator identity and profile information. |
| Storefront editor | `/admin/storefront` | Brand, presentation, sections, and public storefront experience. |
| Store policies | `/admin/settings/policies` | Buyer-visible fulfillment, return, refund, privacy, and protection terms. |
| Shipping profiles | `/admin/settings/shipping` | Destination eligibility, rates, estimates, and listing coverage. |
| Payments | `/admin/payments` | Crypto receiving accounts, available providers, guest-checkout behavior, and payment policy where supported. |
| Products | `/admin/products` and `/listing/new` | Listing revisions, options, availability, price, and fulfillment assignment. |

The **store / Node** owns identity, policy, capabilities, and orders. A **storefront** is a presentation surface over that commerce state. Confirm the active store context before editing either one, especially when one account can reach more than one store.

## See the storefront change

The following walkthrough shows one seller changing a generic live
storefront into a coherent brand, reviewing the exact draft through a private
buyer link, and publishing the same design. The written readiness steps below
remain the operating checklist.

!video-ref[0004]

## Store setup steps

1. Open **Admin → Settings → Profile** and verify the active store identity, public operator name, contact route, locale, and currency display.
2. Open **Admin → Storefront** and publish only the brand and sections intended for this store; preview the public view before continuing.
3. Open **Admin → Settings → Policies** and publish shipping, return, refund, privacy, and buyer-protection terms appropriate to this operator and payment model.
4. Open **Admin → Settings → Shipping** and create a profile that covers at least one real destination and the listing type you intend to sell.
5. Open **Admin → Payments** and enable only receiving accounts or providers that report ready and that the operator can monitor, reconcile, and refund when applicable.
6. Open **Admin → Products** or `/listing/new`, create one complete listing, and attach valid availability and fulfillment.
7. Open `/store/{peerId}` in a separate buyer context. Verify store identity, policies, listing, quote, delivery, and payment choices.
8. Complete a testnet order through seller acceptance, payment verification, fulfillment evidence, and buyer completion or the intended terminal state.

## Expected result and verification

The public storefront should show the intended store identity, storefront presentation, policies, listing revision, total price components, valid destination-specific delivery, and only ready payment methods. The administrator should receive the test order under the same store context and inspect payment and fulfillment state without hidden tooling.

## If something fails

- If the public store differs from Admin, confirm the store or storefront context and refresh authoritative settings.
- If checkout has no delivery option, verify the listing is assigned to an eligible shipping profile or digital path.
- If payment is absent, inspect runtime readiness rather than adding a frontend-only identifier.
- If buyer and seller routes share credentials unexpectedly, stop using material funds and report the isolation defect.
- If the wrong store changed, stop and verify account, store / Node, storefront, and `peerId` context before making another edit.

## Continue

- [Create and validate a listing](/sell/listings)
- [Configure shipping](/sell/shipping)
- [Prepare payments](/sell/payments)
- [Operate incoming orders](/sell/orders)
