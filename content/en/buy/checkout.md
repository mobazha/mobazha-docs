---
title: Complete a buyer checkout
summary: Review one store, one quote, and one payment instruction set before creating or funding an order.
status: Beta
audiences:
  - Buyers
  - Agents
evidenceLabel: Unified checkout routes and Node order contracts
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/checkout
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
---

## Before you start

- Confirm the store identity, item, quantity, variant, fulfillment method, and return policy.
- Use a current browser session connected to the intended store and backend.
- Decide whether you are using account checkout or the store's optional Guest Checkout path.
- Have the exact payment asset available, but do not send funds before the order displays an address, amount, and expiry.

> **Warning:** Never reuse an address, QR code, quote, or amount from another order, message, screenshot, or Agent response.

## Checkout steps

1. Open the product page, select required options, and add the item to the cart.
2. Open **Cart** and confirm every line belongs to the intended seller. A marketplace may curate discovery and record attribution, but the approved seller—not the marketplace projection—must own the checkout handoff and resulting order.
3. Continue to **Checkout** and enter only the delivery and contact data required for this order.
4. Review subtotal, shipping, discounts, taxes, network or provider costs, optional services, and final total.
5. Select an available payment method. Availability comes from the connected backend, not from a static list in this guide.
6. Confirm the order only after the seller, recipient, amount, payment asset, expiry, and applicable policies are visible.
7. Save the order identifier and tracking link before leaving the confirmation page.

## Expected result and verification

The application should display a newly created order with an authoritative state and payment instructions. Confirm that the order item, seller, seller-owned backend, total, payment asset, amount, destination, and expiry match the final confirmation you approved. A marketplace page or referral label is not the seller and must not silently become the order owner.

Do not treat a wallet broadcast, a screenshot, or a pending transaction as completed payment. Wait for the order page to report the required confirmations and funded state.

## If something fails

- If the quote expires, return to checkout and request a new quote; do not send the old amount.
- If an item becomes unavailable, return to the cart and re-evaluate the order rather than repeatedly submitting it.
- If the payment asset or destination changes unexpectedly, stop and verify the store and backend identity.
- If you created an order but lost the page, use the saved order identifier or Guest Order tracking link.
- If funds were sent but state does not advance, preserve the transaction ID and order ID and follow [order-status troubleshooting](/buy/order-status).

## Continue

- [Guest Checkout](/buy/guest-checkout) — Buy without attaching a seller or administrator session.
- [Track payment and order state](/buy/order-status) — Understand what the current state proves.
- [Cancellation, refund, and dispute](/buy/cancel-refund-dispute) — Use only transitions available for the active order.
