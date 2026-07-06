---
title: Identity, stores, and storefronts
summary: Separate access accounts, store and Node identity, storefront presentation, and channel context so ownership and transaction authority stay understandable.
status: Beta
audiences:
  - Buyers
  - Sellers
  - Operators
  - Developers
  - Evaluators
evidenceLabel: Mobazha public identity, profile, capability, and architecture contracts
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: Decide which boundary should change when a person needs another login, store, storefront, or distribution channel.
estimatedTime: 8 minutes
journey: start
primaryAction:
  label: Prepare a store
  href: /sell/store-setup
featuredVisual: identity-storefront-model
---

## Four different product concepts

Mobazha keeps four concepts separate because they carry different authority:

| Concept | What it does | What it does not prove |
|---|---|---|
| Account or credential | Authenticates a person, service, or Agent and associates allowed store contexts | Ownership of every store visible in a client |
| Store and Node identity | Names the independently operated commerce unit and the backend that owns its business state | That one hosted account, domain, or channel is permanently required |
| Storefront | Presents a filtered, themed, or differently routed view of one store | A separate wallet, order ledger, reputation, or legal entity |
| Channel | Brings a storefront into Web, embedded, social, direct-link, or integration contexts | Permission to change the store or bypass backend capability |

An interface may display all four together. They remain separate in the product model.

## The store is the business-state boundary

In Open Core, a Node exposes a profile and per-node commerce services. The store context owns or serves the catalog, policies, orders, messages, payment observations, fulfillment records, and reputation associated with that independently operated unit.

A hosted control plane may associate an authenticated account with one or more registered stores and resolve the active store for an administration request. That association is an access and routing fact. Moving between accounts or clients must not silently rewrite the store's peer identity, transaction history, or accepted obligations.

- [Review architecture and trust boundaries](/project/architecture)
- [Prepare a store for its first order](/sell/store-setup)
- [Choose hosted or self-hosted Mobazha](/start/choose-deployment)

## A storefront is a view, not another store

A storefront can give the same store another public name, slug, theme, catalog filter, visibility rule, pricing presentation, or channel entry. The parent store still owns the shared business state.

Use a storefront when the requirement is presentation or distribution:

- a campaign or seasonal catalog;
- a community-specific entry point;
- a public, unlisted, or restricted presentation;
- a different theme or product subset;
- a Web, embedded, or direct-link route to the same operating store.

Use a separate store or Node when the requirement is independent business state, such as a different operator, wallet or payment configuration, order ledger, reputation boundary, legal responsibility, infrastructure, or recovery plan.

> **Important:** Storefront support is capability-gated. A model or route described here does not mean the connected backend enables named storefronts, every visibility mode, channel binding, or price rule.

## Roles are resolved in context

A person may browse, buy, administer a store, moderate a case, or operate an integration at different times. These are action contexts, not a reason to give one session every permission.

Before a protected action, the system resolves:

1. the authenticated identity or credential;
2. the active store and, when relevant, storefront context;
3. the required scope or role for that action;
4. the backend capability and current resource state;
5. any quote, policy, confirmation, or step-up requirement.

Changing the visible view cannot grant a missing scope. Hiding an Admin route cannot replace server-side authorization.

- [Authentication, identities, and scopes](/build/authentication)
- [Runtime capabilities and product composition](/build/runtime-capabilities)

## Current model and evolution direction

| Area | Public meaning now | Direction that must remain labeled |
|---|---|---|
| Node profile and store policy | Per-node identity and commerce configuration are part of the Core model | Richer portable or externally anchored identity proofs |
| Hosted account association | A hosted identity may be authorized for an explicit store context | Broader multi-identity and multi-operator administration |
| Storefront | A lightweight presentation model may be enabled by a distribution | More channel bindings, scoped analytics, richer access and pricing rules |
| Multiple stores | Registered stores remain independent commerce units | Easier creation, switching, staff delegation, and cross-store reporting |
| Channel composition | Clients and distributions select experiences and narrow capabilities | Additional social, embedded, browser, and Agent surfaces |

The connected backend's effective capabilities and the applicable release remain the availability authority. Internal design phases and future identity models are not current product guarantees.

## Choose the smallest boundary that fits

| Need | Prefer |
|---|---|
| Different theme, catalog subset, campaign, or community entrance | Storefront when the backend supports it |
| Different domain pointing to the same operating store | Domain or channel routing with explicit store context |
| Independent orders, wallet configuration, reputation, or operator responsibility | Separate store or Node |
| Another person or Agent helping with limited duties | A narrow account, token, or delegated scope when supported |
| Strong privacy separation that must not be linked by the operator | A genuinely separate identity and operating boundary, not a cosmetic storefront |

Start with the lightest boundary that preserves the required trust, accounting, and recovery model. Do not use a new storefront to imitate isolation it cannot provide.
