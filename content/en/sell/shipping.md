---
title: Configure shipping and delivery
summary: Define where an item can be delivered, how the buyer is charged, and what evidence the seller records after fulfillment.
status: Beta
audiences:
  - Sellers
  - Operators
evidenceLabel: Unified shipping profiles and Node listing contracts
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/settings/shipping
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
outcome: Offer only delivery methods that apply to the buyer destination and remain attached to the created order.
estimatedTime: 15–30 minutes
journey: use
primaryAction:
  label: Map delivery requirements
  href: /sell/shipping#before-you-start
---

## Before you start

- List origin locations, supported destinations, delivery methods, estimated times, and pricing rules.
- Decide which listings use each shipping profile.
- Document exclusions, customs responsibility, tracking availability, and return handling.

## Shipping setup steps

1. Open **Admin → Settings → Shipping**.
2. Create or select a profile representing one coherent fulfillment policy.
3. Add destination zones and keep overlaps intentional and understandable.
4. Add rates with buyer-visible names, amounts, currency, conditions, and estimated delivery.
5. Assign eligible listings to the profile and remove items requiring another delivery path.
6. Save and test addresses inside, outside, and at the edge of every supported zone.
7. Complete a test order and record carrier, tracking, or delivery evidence through the order flow.

## Expected result and verification

Checkout should show only delivery methods valid for the item and destination. The selected shipping amount must appear in the final cost breakdown and remain associated with the created order. Seller order view should preserve selected service and obligation.

## If something fails

- If no option appears, check destination normalization, profile assignment, listing type, and zone coverage.
- If duplicate options appear, inspect overlapping zones and duplicate profile assignment.
- If checkout amount differs from configuration, stop accepting orders and verify currency and calculation basis.
- If tracking cannot be saved, preserve the reference privately and report the transition defect.

## Digital goods and services

Do not attach physical shipping charges to digital or service flows merely to satisfy checkout. Use the supported delivery contract and explain access, scheduling, redemption, or evidence separately.
