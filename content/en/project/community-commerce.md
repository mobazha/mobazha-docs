---
title: Community markets and distributed discovery
summary: Understand how communities and operator markets curate independent stores without becoming the owner of their catalog, orders, funds, or reputation.
status: Beta
audiences:
  - Buyers
  - Sellers
  - Community operators
  - Marketplace operators
  - Evaluators
evidenceLabel: Mobazha public product boundaries and capability-gated marketplace contracts
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: Choose a store, storefront, community market, or operator market without moving transaction authority into the discovery layer.
estimatedTime: 9 minutes
journey: understand
primaryAction:
  label: Review the product map
  href: /project/product-map
featuredVisual: community-commerce-network
---

## Discovery can be shared without centralizing commerce

Mobazha separates the place where a buyer discovers an offer from the backend that owns the resulting transaction. A community or marketplace operator can build an audience, select participating stores, organize a catalog projection, and provide a recognizable entry point. Each admitted seller still owns its store context, live listing facts, order, payment configuration, fulfillment obligations, and reputation.

This produces a network of markets rather than one mandatory marketplace. A store can appear through its own domain, one or more storefronts, a community entrance, an operator-curated vertical, a direct link, or an Agent-facing catalog while preserving the same business-state boundary.

## Four distribution boundaries

| Boundary | Product responsibility | It must not silently become |
|---|---|---|
| Store and Node | Own live catalog facts, policies, orders, payments, fulfillment, and reputation | A tenant of every market that presents it |
| Storefront | Present one store through a theme, filter, visibility rule, or channel route | A separate seller, wallet, ledger, or reputation boundary |
| Community or operator market | Curate multiple consenting stores, buyer access, catalog presentation, discovery, and attribution | The seller of record, payment custodian, or owner of every order |
| Channel | Carry a market or storefront through Web, domain, embedded, social, direct-link, or Agent context | Permission to forge store context or bypass capability checks |

- [Understand identity, stores, and storefronts](/project/identity-and-stores)
- [Follow the transaction spine](/project/transaction-spine)

## Membership is a consent-bearing relationship

A market should not scrape a store into a commercial relationship and then imply endorsement. The durable relationship needs an explicit store identity and a reviewable lifecycle such as invitation, application, acceptance, rejection, leaving, or removal. Visibility is separate from membership: an accepted store may still be hidden while a market is being prepared or while a policy issue is resolved.

An operator may own:

- the market name, description, theme, domain, and public narrative;
- buyer access and discoverability settings;
- seller entry and review policy;
- open, filtered, or curated catalog presentation;
- ordered featured items, collections, or product-group projections;
- disclosed attribution and operator-service terms.

The seller retains its store identity and the authority to change or withdraw its own live listing and transaction terms. A market projection should refresh those facts rather than copy them into an unaccountable second source of truth.

## One engine can support different market shapes

“Community,” “private,” “vertical,” and “public operator market” are useful product descriptions, but they do not require unrelated commerce stacks. Several independent dimensions can compose a market:

| Dimension | Examples |
|---|---|
| Entry context | Web domain, embedded surface, community link, Telegram or Discord context |
| Buyer access | Open, invited, or approved when supported |
| Seller entry | Operator invited, reviewed application, or another explicit policy |
| Catalog mode | Open projection, filtered projection, or operator curation |
| Discoverability | Public, unlisted, or restricted |
| Vertical | General commerce or an operator-defined category and presentation preset |

These settings describe presentation and governance. They do not change who owns an order. Exact combinations remain distribution-, version-, policy-, and capability-dependent.

## Discovery hands off to one seller-owned transaction

The safe handoff is explicit:

1. The market helps the buyer find an offer and identifies the participating store.
2. Live product, availability, price components, delivery, payment, refund, and protection terms are resolved for that store.
3. The buyer confirms one seller context and the applicable quote.
4. The seller's order-owning backend creates and advances the order.
5. The market may retain disclosed attribution and an observable handoff result, but it does not rewrite payment or order state.

A multi-store discovery page does not imply a cross-store cart, combined settlement, pooled escrow, shared refund authority, or one operator order desk. Each of those would require an explicit product and accounting contract.

- [Review checkout responsibilities](/buy/checkout)
- [Understand fees, attribution, and recipients](/project/fees)

## Operator value comes from audience and curation

The operator's durable contribution is not possession of seller funds. It is audience, context, trust-building, moderation, catalog organization, and channel operation. Commercial terms can charge for real services, but the payer, recipient, trigger, reversal rules, and attribution must be visible before they affect a transaction.

Direct and Deal links can shorten the path from a known offer to checkout. They still need immutable quote and seller bindings. Referral or promotion attribution must remain disclosed and auditable; it cannot make a promoter or market the order owner.

> **Important:** A market-branded page, featured position, community badge, or Agent recommendation is not payment verification or a universal buyer-protection guarantee. Inspect the seller, accepted terms, active protection model, and order-owning backend.

## Current contract and evolution direction

| Area | Public meaning now | Direction that must remain labeled |
|---|---|---|
| Marketplace identity | A market can have its own operator, name, slug, status, presentation, access, catalog, and discoverability settings | More self-service creation, domain, analytics, and partner operations |
| Seller membership | Store participation and visibility are explicit, reviewable relationships | Richer seller applications, portable reputation signals, and moderation workflows |
| Curation | Operators may project selected stores, groups, or ordered items when enabled | More vertical presets, editorial tools, and Agent-readable catalogs |
| Transaction handoff | A selected store remains the authority for live terms and resulting orders | More consistent cross-channel handoff and attribution evidence |
| Channels | Web and other enabled contexts can present the same market or storefront model | Additional embedded, social, browser, and community surfaces |

The connected distribution's effective capabilities and applicable public release are the availability authority. Internal starter plans, configuration fields, or source presence do not prove that a named market type, channel, domain flow, fee model, or vertical is publicly enabled.
