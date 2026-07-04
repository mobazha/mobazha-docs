---
title: Use Guest Checkout safely
summary: Create an anonymous buyer order while preserving the store routing context and a recoverable tracking link.
status: Beta
audiences:
  - Buyers
  - Sellers
  - Agents
evidenceLabel: Unified Guest Checkout implementation and Node public guest APIs
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/packages/core/services/api/guestCheckout.ts
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
---

## Before you start

- The store must advertise Guest Checkout and at least one ready payment method.
- Complete the cart on one store; Guest Checkout does not combine unrelated store contexts.
- Be ready to save the generated order token or tracking link. Losing both may make order recovery difficult.
- Guest Checkout is anonymous transport, not an exemption from store policies, payment confirmation, or lawful delivery information.

## Guest Checkout steps

1. Add an eligible item to the cart and continue to checkout.
2. Choose **Guest Checkout** when the store presents it.
3. Review any delivery fields and the seller's policies before submitting personal information.
4. Let the application request a supply quote; this is advisory and does not itself reserve inventory.
5. Select one payment method from those currently advertised by the backend.
6. Create the order and immediately save the order token or buyer tracking link outside the current tab.
7. Pay only the displayed address and amount before the displayed expiry.
8. Reopen the tracking link to follow confirmations, shipping evidence, and completion.

## Expected result and verification

The buyer request should not carry an administrator, seller, or previously stored user credential. It may retain same-origin store routing context so the request reaches the correct store. The tracking page should show the order token, payment asset, payment destination, required confirmations, expiry, and milestone state.

| Milestone | What it means | What it does not prove |
|---|---|---|
| Awaiting payment | Order exists and waits for the displayed payment | Funds have settled |
| Funded | Required payment evidence was accepted by the backend | Physical delivery is complete |
| Shipped | Seller recorded shipping or delivery evidence | Buyer received or accepted the item |
| Completed | The order reached its completion transition | Every external claim or warranty is guaranteed |

## If something fails

- If Guest Checkout is missing, the backend may have disabled it, failed readiness checks, or require account checkout.
- If the tracking link is lost, do not create repeated funded orders; contact the seller with sanitized payment evidence.
- If an existing login appears to affect the guest request, stop and report a reproducible client defect.
- If the payment expires, do not pay without a refreshed order instruction.

## Security and privacy

Share the tracking link only with parties who need it. Do not post order tokens, delivery details, or transaction evidence publicly. An Agent may help explain the flow but must not create or fund the order without explicit confirmation.
