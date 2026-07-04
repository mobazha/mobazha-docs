---
title: Operate incoming orders
summary: Reconcile payment, confirm the obligation, record fulfillment evidence, and use only state-valid cancellation, refund, dispute, and completion actions.
status: Beta
audiences:
  - Sellers
  - Operators
  - Agents
evidenceLabel: Unified order administration and Node order state contracts
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/orders
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
---

## Before you start

- Publish fulfillment and refund policies before taking orders.
- Monitor backend, payment dependencies, inventory, and buyer communication.
- Separate an order notification from authoritative order and payment state.

## Order handling steps

1. Open **Admin → Orders** and select the intended store and order.
2. Confirm seller identity, item revision, quantity, options, delivery obligation, total, and buyer instructions.
3. Verify payment from backend-owned state; never rely on a screenshot or chat message.
4. Accept or confirm only when inventory, policy, and fulfillment capacity remain valid.
5. Fulfill the exact order and record carrier, tracking, digital-delivery, service, or other supported evidence.
6. Respond to cancellation, refund, or dispute through the action available for current state.
7. Complete only after implemented delivery and payment gates are satisfied.
8. Retain order, quote, payment, fulfillment, and communication references according to policy.

## Expected result and verification

Every seller action should produce a new authoritative state or a clear error without losing the previous recoverable state. Reopen the order after each financial or fulfillment transition and verify state, timestamps, evidence, and resulting payment action.

## If something fails

- If duplicate notifications arrive, deduplicate by order and event identity and reload current state.
- If payment and order disagree, stop fulfillment or settlement automation and reconcile payment reference.
- If fulfillment evidence fails to save, preserve it securely and retry through the supported transition.
- If an action reports conflict, reload state before deciding another actor already completed it.
- If an extension is unhealthy, keep Core financial transitions fail closed and follow recovery.

## Agent boundary

An Agent may summarize and prepare an action, but it must not confirm, refund, settle, or complete without required identity, scope, state, policy, and human confirmation.
