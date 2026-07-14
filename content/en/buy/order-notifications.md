---
title: Respond to order and dispute notifications
summary: Use a notification to reach the related order or case, then refresh authoritative state before paying, fulfilling, refunding, or disputing.
status: Beta
audiences:
  - Buyers
  - Sellers
  - Support
  - Agents
evidenceLabel: Unified notification routing, grouping, and state tests
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/apps/web/src/app/notifications/page.tsx
reviewed: 2026-07-14
pageType: task
lastTested: 2026-07-14
outcome: Route a notification to the intended business record, verify current backend state, and avoid acting on a stale or incomplete event.
estimatedTime: 3–5 minutes
journey: use
primaryAction:
  label: Check a notification safely
  href: /buy/order-notifications#before-you-start
---

## Before you start

- Use the account, store context, or Guest Order recovery link that owns the related record.
- Keep the order identifier, case identifier, or Guest Order token private.
- Remember that read status, grouping, sound, and the notification text are presentation state. They do not change the order, payment, fulfillment, refund, dispute, or market-membership state.

> **Warning:** Never pay, ship, refund, release funds, or disclose evidence solely because a notification requests it. Open the related record and verify the action there.

## Check the notification

1. Open the notification bell or `/notifications`. Use the available order, transaction, system, or other filters only to narrow the list.
2. Read the source, event type, time, counterparty label, and order or case context. Grouped notifications may show the latest event while retaining several event identities.
3. Open the notification. Current routing sends ordinary order events to order detail, dispute events to the order's dispute tab, seller Guest Order events to the Admin order view, and marketplace-review events to the applicable market seller page when context exists.
4. On the target page, confirm the order, case, seller, buyer, asset, amount, and current state. Refresh from the owning backend before taking an irreversible or financial action.
5. Marking one item or a group as read may update the unread count; it does not acknowledge fulfillment, accept a decision, or approve a transaction.
6. Preserve the relevant business evidence in the order or dispute flow, not only in the notification list or an external chat.

## Expected result and verification

| Notification kind | Expected destination | What to verify there |
|---|---|---|
| Order created, funded, confirmed, shipped, completed, canceled, or expired | `/orders/{orderID}` or the seller Guest Order view | Current backend order and Payment Session state |
| Payment received or payment-state event | Related order detail | Asset, target, amount, observation, confirmations, and funded state |
| Dispute opened or case update | `/orders/{orderOrCaseID}?tab=dispute` when an identifier exists | Claim, response, evidence references, deadline, moderator, and current dispute state |
| Marketplace seller review | `/marketplace/{slug}/sell` when market context exists | Current membership record and decision reason |
| Chat message | Chat interface or drawer | Sender, room or order context, and whether an order action is separately available |

The destination should preserve the related identifier and show a current record. Duplicate notification identities should not create duplicate local items, but a missing or stale notification is still possible; the business record remains authoritative.

## If something fails

- If a dispute notification has no order or case identifier, it may have no safe route. Open the relevant order or cases view manually and do not guess an identifier.
- If marking as read or deleting a notification fails, leave the business action unchanged and retry only the presentation operation later.
- If a notification opens the wrong store, order, or market context, stop and report the routing defect with sanitized notification and target identifiers.
- If the notification is newer than the displayed order state, refresh through the product or authenticated API; do not replay the underlying mutation.
- If the record no longer permits the suggested action, follow the current state rather than the old notification text.

## Continue

- [Track payment and order status](/buy/order-status)
- [Cancel, refund, or dispute](/buy/cancel-refund-dispute)
- [Get help with sanitized evidence](/support)
