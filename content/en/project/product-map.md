---
title: How Mobazha fits together
summary: Mobazha connects independently operated stores, a Core-owned commerce state machine, optional services, community distribution, and bounded automation without turning them into one opaque platform.
status: Beta
audiences:
  - Buyers
  - Sellers
  - Operators
  - Developers
  - Evaluators
evidenceLabel: Mobazha public architecture, release, and policy documents
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: Understand the durable product model, the authority boundaries, and where current release evidence ends.
estimatedTime: 8 minutes
journey: start
primaryAction:
  label: Choose an operating path
  href: /start/choose-deployment
featuredVisual: mobazha-product-atlas
---

## The independent commerce unit

Mobazha starts with an independently operated commerce unit: an identity, one or more stores, their policies and catalog, and the backend that owns their business state. A storefront, hosted application, community market, social channel, browser surface, or Agent can present and assist that unit, but it does not become the authority for its orders or money.

This is the central product distinction. Mobazha is neither only a marketplace nor only self-hosted shop software. It is a way for independently operated stores to participate in a wider network without giving one presentation channel unrestricted control.

- [Understand identity, stores, storefronts, and channels](/project/identity-and-stores)
- [Follow the order, payment, fulfillment, and recovery spine](/project/transaction-spine)

## Four connected product promises

| Promise | Product meaning | Authority boundary |
|---|---|---|
| Own | Keep store identity, policy, data, and operating choices explicit | The selected backend and operator own store and business state |
| Connect | Reach buyers through storefronts, discovery, communities, direct links, and integrations | A channel may narrow access or presentation but cannot invent backend capability |
| Trade | Create, pay, fulfill, recover, and resolve an order against inspectable state | Core owns order, payment-verification, refund, dispute, settlement, and audit transitions |
| Extend | Add payment rails, delivery services, tools, and Agent workflows through typed contracts | Extensions return bounded input; Core validates protected changes |

These are organizing principles, not a claim that every channel, rail, provider, or automation is available in every distribution.

## One Core, several operating paths

The same public contracts can be used through different operating paths:

- An independent operator can run a Node and choose its network exposure, integrations, backups, and policies.
- A hosted distribution can operate Nodes and shared infrastructure while keeping tenant and store boundaries explicit.
- A client can render only the effective capabilities advertised by the backend it is connected to.
- Optional discovery, payment, delivery, messaging, AI, and managed services remain separately named dependencies.

- [Choose hosted or self-hosted Mobazha](/start/choose-deployment)
- [Run a Mobazha Node under your control](/self-host)
- [Review architecture and trust boundaries](/project/architecture)

## The transaction spine

The product becomes concrete around one transaction spine:

1. A buyer reaches a seller-owned offer through a storefront or distribution channel.
2. The order-owning backend creates the quote and order identity.
3. The selected payment system reports observations or provider state; Core decides what those facts mean for the order.
4. Fulfillment, cancellation, refund, dispute, and completion follow the active state and applicable policy.
5. Historical bindings and evidence remain available for recovery and reconciliation.

- [Buy from an independent store](/buy)
- [Operate incoming orders](/sell/orders)
- [Track payment and order status](/buy/order-status)
- [Cancel, request a refund, or open a dispute](/buy/cancel-refund-dispute)
- [Understand why order, payment, and protection states stay separate](/project/transaction-spine)

## Distribution and automation are product surfaces

Community markets, social entry points, direct links, marketplace curation, messaging, webhooks, MCP, and Agent workflows are not miscellaneous add-ons. They are ways to connect demand, supply, and operations to the independent commerce unit.

They still obey three limits:

- presentation does not override transaction authority;
- configuration or source presence does not prove runtime availability;
- an Agent may prepare, compare, or request an action, but identity, scope, state, quote, and confirmation still govern execution.

- [Build on advertised capabilities](/build)
- [Use MCP and Agent integrations](/build/mcp)
- [Extend Mobazha through public contracts](/build/extensions)

## Read current, Beta, and future direction separately

This page explains the product model. Exact availability comes from the connected backend, versioned public contracts, release scope, and transaction evidence.

| Evidence | What it can establish |
|---|---|
| Effective runtime capability | What the connected backend can admit now |
| Tagged contract and release evidence | Which interface and behavior a release supports |
| Current policy page | The public rule for fees, security, compatibility, or governance |
| Draft RFC or roadmap | A reviewed direction, not shipped availability |
| Internal design or implementation plan | Evidence for maintainers, not a public product promise |

- [Review release scope and maturity](/project/release-scope)
- [Review runtime capabilities](/build/runtime-capabilities)
- [Read public decisions and proposals](/project/decisions)

> **Important:** A diagram, roadmap, RFC, linked package, or documentation page cannot activate a capability. When availability matters, use the connected backend and the evidence for the applicable release.
