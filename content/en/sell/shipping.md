---
title: Configure shipping and delivery
summary: Define where an item can be delivered, how the buyer is charged, and what evidence the seller records after fulfillment.
status: Beta
audiences:
  - Sellers
  - Operators
evidenceLabel: Unified shipping profiles and Node listing contracts
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/settings/shipping
reviewed: 2026-07-06
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

## How shipping enters a Mobazha order

| Stage | Authoritative fact | Failure to avoid |
|---|---|---|
| Shipping profile | Zones, services, rates, estimates, and conditions configured under `/admin/settings/shipping` | Treating one global rate as valid for every listing and destination. |
| Listing assignment | The physical listing revision is attached to an eligible profile in the listing Shipping section | Publishing a product that has no route to the buyer destination. |
| Quote | Destination and selected service produce the buyer-visible shipping amount and estimate | Reusing a catalog estimate after address, quantity, or profile changes. |
| Order snapshot | The accepted delivery service, amount, destination obligation, and seller promise remain with the order | Letting a later profile edit silently change an existing order. |
| Fulfillment evidence | Carrier, tracking, handoff, digital proof, service completion, or another supported record | Marking an order fulfilled with no evidence appropriate to its product type. |

## Shipping setup steps

1. Open **Admin → Settings → Shipping** (`/admin/settings/shipping`).
2. Create or select a profile representing one coherent fulfillment policy.
3. Add destination zones and keep overlaps intentional and understandable.
4. Add rates with buyer-visible names, amounts, currency, conditions, and estimated delivery.
5. Open each physical listing's **Shipping** section and assign the appropriate profile; remove digital goods, services, or items requiring another delivery path.
6. Save and test addresses inside, outside, and at the edge of every supported zone.
7. Complete a test order and record carrier, tracking, or delivery evidence through the order flow.

## Expected result and verification

Checkout should show only delivery methods valid for the item and destination. The selected shipping amount must appear in the final cost breakdown and remain associated with the created order. Seller order view should preserve selected service and obligation.

After changing a profile, test a new quote and confirm that an already accepted order still shows its original delivery commitment.

## If something fails

- If no option appears, check destination normalization, profile assignment, listing type, and zone coverage.
- If duplicate options appear, inspect overlapping zones and duplicate profile assignment.
- If checkout amount differs from configuration, stop accepting orders and verify currency and calculation basis.
- If tracking cannot be saved, preserve the reference privately and report the transition defect.

## Digital goods and services

Do not attach physical shipping charges to digital or service flows merely to satisfy checkout. Use the supported delivery contract and explain access, scheduling, redemption, or evidence separately.
