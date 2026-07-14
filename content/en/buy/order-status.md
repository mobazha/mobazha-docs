---
title: Track payment and order status
summary: Reconcile wallet evidence with the backend-owned order state before deciding that an order is funded, shipped, refundable, or complete.
status: Beta
audiences:
  - Buyers
  - Support
  - Agents
evidenceLabel: Unified order milestones and Node order API
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/apps/web/src/components/orders/guestOrderStages.ts
reviewed: 2026-07-14
pageType: task
lastTested: 2026-07-14
outcome: Decide what the current order state proves and which recovery action is safe to take next.
estimatedTime: 3 minutes
journey: use
primaryAction:
  label: Reconcile an order
  href: /buy/order-status#before-you-start
---

## Before you start

- Keep the order identifier or Guest Order token and the payment transaction ID.
- Use the same store and backend that created the order.
- Never paste private keys, recovery phrases, authenticated tracking URLs, or full customer details into support chat.

## Tracking steps

1. Open **Orders** for an authenticated purchase or the saved Guest Order tracking link.
2. Confirm seller, item, amount, payment asset, and creation time before interpreting state.
3. Open the order-bound Payment Session and compare its session ID, canonical asset, funding target, expected amount, settlement mode, and expiry with your wallet or provider record.
4. Read observed amount, remaining amount, observations, confirmations where applicable, and the backend funding state separately.
5. Refresh through the product UI or `GET /v1/orders/{orderID}/payment-session` when an event announces a change.
6. Preserve fulfillment, cancellation, refund, or dispute evidence before taking the next available action.

## Expected result and verification

The order page should show a monotonic business-state view owned by the backend. A WebSocket event or wallet notification is only a refresh signal. For important decisions, verify the current order through the authenticated HTTP API or tracking endpoint.

| Observation | Safe conclusion |
|---|---|
| Payment target ready | The order has an address or provider session the buyer may use before expiry |
| Transaction broadcast | A wallet attempted to publish a transaction |
| Transaction detected | The payment system observed a candidate transaction |
| Required confirmations reached | The configured confirmation gate may be satisfied |
| Backend state is funded | The order backend accepted the payment evidence for this order |
| Seller marked shipped | Fulfillment evidence was recorded; inspect it |

The Payment Session capability set—not a static button list—indicates whether refresh, cancel, confirm, refund, or completion is currently available.

## If something fails

- **No transaction detected:** verify asset, network, destination, amount, and expiry without sending a second payment.
- **Confirmations stalled:** inspect the payment network independently and preserve the transaction ID.
- **Wallet confirmed but order awaiting payment:** report exact order and transaction identifiers privately to the operator.
- **State conflicts across screens:** stop automated actions and report a consistency defect.
- **Tracking link does not open:** confirm it belongs to this deployment and was not truncated.

## Recovery and escalation

Do not attempt database edits or direct settlement calls to repair a buyer order. Use actions offered by the order state, then [get help](/support) with sanitized evidence.
