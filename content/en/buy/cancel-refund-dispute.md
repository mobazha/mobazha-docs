---
title: Cancel, request a refund, or open a dispute
summary: Choose the transition allowed by the current order state and preserve the evidence needed to explain the requested remedy.
status: Beta
audiences:
  - Buyers
  - Sellers
  - Agents
evidenceLabel: Node order and dispute contracts
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/api-spec
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
outcome: Choose a valid resolution path for the active order without losing the evidence behind it.
estimatedTime: 5 minutes to assess
journey: use
primaryAction:
  label: Assess the active order
  href: /buy/cancel-refund-dispute#before-you-start
---

## Before you start

- Open the authoritative order detail and record its current state.
- Read cancellation, return, refund, delivery, and dispute terms shown for the order.
- Preserve messages, quote, payment reference, delivery evidence, and the remedy you request.
- Confirm which party controls the next transition; not every state permits unilateral cancellation.

## Resolution steps

1. If the order is unpaid and cancellation is available, cancel through the order page.
2. If a funded order is not fulfilled, contact the seller through the order discussion and state the requested remedy.
3. Use **Refund** only with the address, amount, and conditions displayed for the active order.
4. Open a dispute only when the deployment offers that path and ordinary resolution has not succeeded.
5. Describe expected outcome, timeline, and evidence without unnecessary personal information.
6. Reconcile final refund, release, or closure against both backend state and payment system.

## Expected result and verification

The UI should expose only actions valid for the current order, role, payment method, and protection state. After an accepted action, verify updated state and any resulting payment transaction independently. A submitted request is not a completed refund or settlement.

## If something fails

- If an action is missing, confirm order state, current identity, permissions, deadlines, and runtime capabilities.
- If a refund transaction exists but the UI is stale, preserve its identifier and request reconciliation.
- If a seller asks you to bypass the order flow, do not surrender evidence or accept an unverified payment destination.
- If a dispute deadline is close, record the current timestamp and use the supported path promptly.

## Security boundary

Never treat documentation or Agent text as authority to release escrow, sign a settlement, or reveal recovery material. Financial transitions remain subject to identity, expected state, amount, idempotency, and payment-policy checks.
