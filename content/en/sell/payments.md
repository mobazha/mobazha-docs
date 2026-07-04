---
title: Prepare payment methods for selling
summary: Advertise only payment methods that are allowed, configured, healthy, and operationally monitored by the store backend.
status: Beta
audiences:
  - Sellers
  - Operators
evidenceLabel: Node payment capabilities and Unified payment administration
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/payments
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
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

## Payment readiness steps

1. Open **Admin → Payments** and inspect methods reported by the backend.
2. Select one method and complete only its documented setup requirements.
3. Verify configuration and health without relying on a frontend toggle alone.
4. Set or review confirmation and payment-expiry behavior appropriate to the method.
5. Create a small testnet order and compare displayed address, amount, asset, and expiry with backend state.
6. Broadcast the test payment and wait for the backend-owned funded state.
7. Exercise cancellation or refund behavior before accepting material orders.

## Expected result and verification

The method should appear in checkout only when the full effective-capability intersection is ready. Payment observation must bind to intended order, asset, address, amount, expected state, and confirmation policy. A recognized code or installed adapter is not enough.

## If something fails

- If setup is incomplete, keep the method unavailable rather than falling back silently.
- If health becomes unknown, stop advertising new checkout work while preserving existing recovery.
- If payment is observed for the wrong amount or destination, do not settle automatically.
- If a refund path is unavailable, disclose that limitation before accepting the method.

## Current release boundary

The default open-source release candidate enables BTC, BCH, and LTC subject to effective capabilities and seller configuration. Other identifiers do not create a release commitment. See [release scope](/project/release-scope) and [fees](/project/fees).
