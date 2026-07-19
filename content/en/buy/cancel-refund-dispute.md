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
reviewed: 2026-07-19
pageType: task
lastTested: 2026-07-19
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

## Choose the path by order mode and current capability

| Path | Typical purpose | What must be verified |
|---|---|---|
| Cancel | Stop an eligible order before its current commitment or payment path closes cancellation | Current order state, actor, Payment Session capability, expiry, and refund destination if funds may already exist. |
| Refund | Return an eligible amount through the supported payment path | Recipient or refund address, amount, asset, prior observations, idempotency, and resulting transaction or provider reference. |
| Dispute | Ask the supported protection or moderation path to examine evidence and a requested remedy | Order mode, deadline, dispute capability, roles, policy version, evidence, and settlement consequences. |
| Complete or release | Accept fulfillment or release protected funds where the model supports it | Delivery evidence, actor authority, expected state, amount, and irreversibility. |

The order detail may expose Summary, Discussion, Dispute, and Evidence views. Discussion coordinates; Evidence supports a claim; only an admitted Core action changes protected order or payment state.

## Resolution steps

1. If the order is unpaid and cancellation is available, cancel through the order page.
2. If a funded order is not fulfilled, use the order Discussion view and state the requested remedy without exposing unnecessary private data.
3. Use **Refund** only with the address, amount, and conditions displayed for the active order.
4. Open the order Dispute view only when the deployment, order mode, deadline, and current capabilities offer that path and ordinary resolution has not succeeded.
5. Describe expected outcome, timeline, and evidence without unnecessary personal information.
6. Add or reference original material in the Evidence view where supported; do not replace evidence with a summary that loses timestamps or provenance.
7. Reconcile final refund, release, or closure against both backend state and the payment system or provider.

For an attempt-scoped crypto payment, settlement recipients, fees, the
moderator allocation, and the settlement asset are frozen before its funding
target becomes actionable. A refund or dispute allocation is derived from
that paid attempt; it is not repriced from the order currency or a later
exchange rate. Always verify the asset and destination shown for the current
action rather than reusing a previous attempt's address.

## Expected result and verification

The UI should expose only actions valid for the current order, role, payment method, and protection state. After an accepted action, verify updated state and any resulting payment transaction independently. A submitted request is not a completed refund or settlement.

!video-ref[0006]

## If something fails

- If an action is missing, confirm order state, current identity, permissions, deadlines, and runtime capabilities.
- If a refund transaction exists but the UI is stale, preserve its identifier and request reconciliation.
- If a seller asks you to bypass the order flow, do not surrender evidence or accept an unverified payment destination.
- If a dispute deadline is close, record the current timestamp and use the supported path promptly.

## Security boundary

Never treat documentation or Agent text as authority to release escrow, sign a settlement, or reveal recovery material. Financial transitions remain subject to identity, expected state, amount, idempotency, and payment-policy checks.
