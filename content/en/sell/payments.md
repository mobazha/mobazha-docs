---
title: Prepare payment methods for selling
summary: Advertise only payment methods that are allowed, configured, healthy, and operationally monitored by the store backend.
status: Beta
audiences:
  - Sellers
  - Operators
evidenceLabel: Node payment capabilities and Unified payment administration
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/payments
reviewed: 2026-07-13
pageType: task
lastTested: 2026-07-13
outcome: Enable one payment method only after its configuration, health, observation, and recovery path are proven.
estimatedTime: 20–40 minutes
journey: use
primaryAction:
  label: Begin the payment readiness check
  href: /sell/payments#before-you-start
---

## Before you start

- Use testnet and a disposable order while evaluating the release candidate.
- Confirm the method is permitted by the distribution and implemented by the backend.
- Understand key custody, observation, confirmations, refund path, fees, and dependencies.
- Back up recovery material and never enter seeds or private keys into documentation, chat, or an unrelated provider form.

## Read payment readiness as a session, not a logo

The order detail resolves a Payment Session from `/v1/orders/{orderID}/payment-session`. A payment-method logo or enabled Admin switch does not replace these order-bound facts:

| Payment Session field | Question it answers |
|---|---|
| `paymentCoin` | Which canonical crypto asset or fiat provider/currency is expected? |
| `settlementMode` | Is this address monitoring, provider checkout, escrow, or another supported settlement path? |
| `productMode` | Is the order direct, cancelable, or moderated? |
| `fundingTarget` | Which exact address or provider session, amount, asset, memo, and QR payload apply? |
| `paymentProgress` | What has been observed, what remains, how many observations exist, and what funding state is current? |
| `expiresAt` | When must the buyer request refreshed instructions instead of reusing this target? |
| `capabilities` | Which refresh, cancel, confirm, refund, or completion action is currently admitted? |
| `userActionRequest` | Which explicit wallet or provider action still requires the user? |

Do not collapse **payment readiness**, **funding observation**, **verification**, and **settlement** into one status. They answer different operational questions.

## See a first crypto-paid physical order

The following walkthrough shows one seller taking a verified ETH payment for a
physical good on a dressed SaaS storefront, then shipping and completing the
same order. The readiness checklist below remains the operating guide.

!video-ref[0007]

## Payment readiness steps

1. Open **Admin → Payments** (`/admin/payments`) and inspect receiving accounts, providers, guest-checkout policy, and methods reported ready by the backend.
2. Select one method and complete only its documented setup requirements.
3. Verify configuration and health without relying on a frontend toggle alone.
4. Set or review confirmation and payment-expiry behavior appropriate to the method.
5. Create a small testnet order and compare the displayed Payment Session ID, order ID, canonical asset, settlement mode, funding target, expected amount, and expiry with backend state.
6. Broadcast or authorize the test payment, then distinguish observed progress from the backend-owned funded state.
7. Reopen the order detail and confirm that capabilities expose only state-valid actions.
8. Exercise the applicable cancellation or refund path before accepting material orders.

For an attempt-scoped standard crypto payment, the funding target becomes
actionable only after the required seller and moderator offers, frozen
settlement terms, and authorization bundle agree. If Affiliate attribution or
another order feature is not supported by that exact route, the backend must
keep the route unavailable before creating a draft; a frontend must not infer
support from the coin or rail alone.

## Expected result and verification

The method should appear in checkout only when the full effective-capability intersection is ready. Payment observation must bind to intended order, asset, address, amount, expected state, and confirmation policy. A recognized code or installed adapter is not enough.

## If something fails

- If setup is incomplete, keep the method unavailable rather than falling back silently.
- If health becomes unknown, stop advertising new checkout work while preserving existing recovery.
- If payment is observed for the wrong amount or destination, do not settle automatically.
- If a session says `awaiting_seller_receipt`, do not present it as buyer payment delay; the seller-side funding target is not ready yet.
- Do not ask the buyer to pay an address retained from an abandoned or
  incompatible attempt. Refresh the Payment Session and use only its current
  actionable target.
- If a provider checkout or wallet action fails, keep the order and Payment Session identifiers before retrying.
- If a refund path is unavailable, disclose that limitation before accepting the method.

## Current release boundary

The public client and backend contain several payment adapters and compatibility paths, but availability is decided at runtime by distribution policy, backend implementation, store configuration, health, order mode, and Payment Session capabilities. A Token identifier or source module does not create a release commitment. See [release scope](/project/release-scope) and [fees](/project/fees).

A provider-session payment can expose a moderated product mode only when the
provider route can keep seller disbursement pending (or preserve an equivalent
reversible funds state) and supports the required recovery operations. The
provider's own payment dispute or chargeback process remains separate from a
Mobazha moderator's order decision.
