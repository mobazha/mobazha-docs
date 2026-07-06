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
reviewed: 2026-07-06
pageType: task
lastTested: 2026-07-04
outcome: Move one paid order through fulfillment using only actions valid for its current state.
estimatedTime: 5 minutes per review
journey: use
primaryAction:
  label: Review an incoming order
  href: /sell/orders#before-you-start
---

## Before you start

- Publish fulfillment and refund policies before taking orders.
- Monitor backend, payment dependencies, inventory, and buyer communication.
- Separate an order notification from authoritative order and payment state.

## Use the order workspace as four connected records

The current client exposes seller work at `/admin/orders` and the order detail at `/orders/{orderId}`. The detail can present separate Summary, Discussion, Dispute, and Evidence views; none of these should be treated as a substitute for the others.

| Record | Use it for | Authority rule |
|---|---|---|
| Order summary | Accepted listing snapshot, parties, amount, delivery obligation, current state, and valid actions | Reload after each consequential transition. |
| Payment Session | Funding target, observation, verification, expiry, settlement mode, and current capabilities | A receipt or chat claim is not payment authority. |
| Discussion | Buyer/seller coordination tied to the order | Preserve useful context, but do not execute protected state from message text alone. |
| Dispute and evidence | Requested remedy, submissions, fulfillment records, and applicable decision path | Keep original evidence and follow role-, policy-, and state-valid actions. |

## Order handling steps

1. Open **Admin → Orders** (`/admin/orders`) and select the intended store and order.
2. Confirm seller identity, item revision, quantity, options, delivery obligation, total, and buyer instructions.
3. Review the order-bound Payment Session and verify funding from backend-owned state; never rely on a screenshot or chat message.
4. Accept or confirm only when inventory, policy, and fulfillment capacity remain valid.
5. Fulfill the exact order and record carrier, tracking, digital-delivery, service, or other supported evidence.
6. Use the Discussion, Dispute, and Evidence views for their separate purposes; respond to cancellation, refund, or dispute only through the action admitted for the current state and role.
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
- If Discussion, Payment Session, and order summary disagree, preserve identifiers and reload the authoritative order before acting.

## Agent boundary

An Agent may summarize and prepare an action, but it must not confirm, refund, settle, or complete without required identity, scope, state, policy, and human confirmation.
