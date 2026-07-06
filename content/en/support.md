---
title: Get help and report problems
summary: Use public support for reproducible product questions, repository issues for defects, and private reporting for security problems.
status: Current
audiences:
  - Everyone
evidenceLabel: Mobazha public support surfaces
evidenceUrl: https://mobazha.org/status
reviewed: 2026-07-06
pageType: hub
outcome: Route a product question, reproducible defect, documentation problem, or security concern to the correct public or private channel.
estimatedTime: 3 minutes
journey: community
primaryAction:
  label: Choose a support channel
  href: /support#choose-the-channel
---

## Choose the channel

- In Mobazha Unified, open Me → Help & Support → Documentation. The same canonical portal is linked from the desktop Footer.
- [Documentation issues](https://github.com/mobazha/mobazha-docs/issues) — Stale, missing, unclear, or conflicting documentation.
- [Node issues](https://github.com/mobazha/mobazha/issues) — Reproducible backend, deployment, API, payment, or operator defects.
- [Unified issues](https://github.com/mobazha/mobazha-unified/issues) — Buyer, seller, browser, responsive, or frontend defects.
- [Telegram](https://t.me/MobazhaHQ) — Community help and current service questions.
- [Discord](https://discord.gg/3KCPBYxXgb) — Community discussion and help.

## Start with the failing boundary

| Symptom | First check | Best route if reproducible |
|---|---|---|
| Hosted page or login is unavailable | [Service status](https://mobazha.org/status), browser network result, and whether another public page works | Community support for a current service question; repository issue only with a product reproduction |
| Local Node will not start | Exact commit, start flags, data directory ownership, port, disk, and `doctor --json` | Node issue |
| Storefront control is missing | Runtime-config readiness, capability, current identity, store context, and seller configuration | Unified issue for presentation; Node issue for an incorrect backend capability |
| Payment is not observed | Order ID, intended asset, address, amount, expiry, confirmations, and dependency health | Node issue after preserving sanitized evidence; do not send a second payment to test blindly |
| Order, refund, or dispute state looks wrong | Authoritative order state, payment record, recent action, and active policy | Node issue for state authority; Unified issue only when correct backend state is displayed incorrectly |
| Webhook or integration repeats work | Delivery or event identity, signature result, endpoint response, and reconciliation record | Node issue for delivery behavior; integration owner for consumer deduplication |
| Documentation conflicts with behavior | Page URL, reviewed date, deployment version, capability snapshot, and the conflicting result | Documentation issue |

Do not change several layers at once. Reproduce against the smallest local or disposable boundary first, then report the component that owns the incorrect state.

## Write a useful report

- Identify hosted or self-hosted deployment, exact version or commit, operating system, and relevant capability state.
- Describe the smallest reproducible steps, expected behavior, actual behavior, and sanitized evidence.
- Search existing issues and link related documentation or release notes.
- Do not include access tokens, private keys, seeds, wallet recovery material, customer data, or private infrastructure details.

For an order or payment problem, include only sanitized identifiers needed to correlate the record. State whether funds were merely instructed, observed, verified, settled, refunded, or still unknown; those are different conditions and require different recovery actions.

## Security exception

Suspected vulnerabilities, leaked credentials, signing-key concerns, and exploits must use private vulnerability reporting in the affected GitHub repository. Do not first disclose them through community chat or a public issue.
