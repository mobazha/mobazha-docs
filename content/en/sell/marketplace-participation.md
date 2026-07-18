---
title: Apply to sell in a community market
summary: Read a market's seller-entry, review, and catalog rules before applying, withdrawing, or reapplying with selected product groups.
status: Beta
audiences:
  - Sellers
  - Market operators
evidenceLabel: Unified native marketplace seller policy and tests
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/apps/web/src/app/marketplace/%5Bslug%5D/sell/page.tsx
reviewed: 2026-07-18
pageType: task
lastTested: 2026-07-14
outcome: Submit one eligible market application, understand its current membership state, and take only the transition that state allows.
estimatedTime: 5–10 minutes
journey: use
primaryAction:
  label: Check seller eligibility
  href: /sell/marketplace-participation#before-you-start
---

## Before you start

- Sign in as the seller responsible for the intended store and product groups.
- Open the selected market and confirm its identity, operator, seller-entry mode, seller-review mode, and catalog mode.
- Treat market membership as a discovery and curation relationship. Approval does not transfer store, listing, quote, payment, or order authority to the market.
- Continue only when the deployment exposes the market's seller page and the market allows self-service applications.

> **Important:** An `operator_invited` market does not accept a self-service application. The absence of a submit control is a policy result, not a reason to call a hidden route.

## Apply to the market

1. Open the market's **Sell** entry, normally `/marketplace/{slug}/sell`.
2. Read the displayed seller-entry, review, buyer-access, and catalog rules before selecting products.
3. For a curated catalog, select at least one product group owned by the current seller. A group may be eligible even when it currently contains zero items. An open catalog can permit submission without a selected group.
4. Review the selected groups and submit once. The submit control remains visible but disabled while the request is in flight.
5. Read the returned membership state. Automatic review may approve immediately; manual review normally records an applied state pending an operator decision.
6. Return to the same seller page for review updates. A notification can lead to this page, but the current application and membership record determine the status.

## Understand the current state

| State | What the seller can conclude | Available next action |
|---|---|---|
| No application | No current self-service application is recorded | Select required groups and submit if the market permits self-service |
| `applied` | The application exists and is awaiting a decision | Keep selection locked; withdraw if the product offers that action |
| `approved` | The market accepted the seller under its current policy | Inspect which groups and listings are visible; market approval does not prove order readiness |
| `rejected` | The application was declined | Read the decision reason where provided; reapply only when the current policy exposes submission |
| `left` | The seller withdrew or left | Reapply when the current policy permits it |
| `suspended` | The operator has suspended participation | Do not reapply through self-service; follow the market operator's published review route |

Selections remain locked while the application is applied, approved, or suspended. This prevents a local draft from silently changing the groups attached to an active membership state.

## See the complete market loop

This journey follows an operator, seller, and buyer from market
publication through one real test-network order and its attributed operator
estimate. It illustrates the surrounding outcome; the application states and
seller-authority checks above remain authoritative for this task.

!video-ref[0001]

## Expected result and verification

The seller page should show one current application and membership state for the selected market and seller context. Verify the market identifier, store or seller identity, selected product-group identifiers, review mode, and current status after a refresh.

For an approved seller, separately verify that the intended groups or listings are visible in the market and that a buyer handoff still resolves to the correct seller-owned backend. Membership alone does not prove availability, price, payment readiness, or fulfillment readiness.

## If something fails

- If submission is disabled in a curated market, select at least one eligible product group and verify it belongs to the current seller.
- If the market is invite-controlled, do not repeatedly submit API requests; use the operator's published admission route.
- If submission or withdrawal returns an unknown result, refresh the current application before retrying. A delayed response may already have changed membership state.
- After rejection or `left`, submit a new application only when the page makes it available. A suspended seller cannot self-serve a new application.
- If the notification and seller page disagree, use the refreshed membership record and report the stale notification with sanitized identifiers.

## Continue

- [Understand markets and discovery](/project/community-commerce)
- [Maintain product groups and supply](/sell/catalog-operations)
- [Verify the buyer checkout boundary](/buy/checkout)
