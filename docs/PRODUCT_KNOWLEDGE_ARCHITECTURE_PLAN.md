# Mobazha Product Knowledge Architecture

- Status: Active product and editorial plan
- Started: 2026-07-06
- Scope: public product narrative, information architecture, product concepts,
  visual evidence, and the path from internal evidence to public knowledge

## Decision

The public documentation will not turn an inventory of feature names into a
navigation tree. It will explain one evolving product system:

> Mobazha is an open commerce network of independently operated commerce
> units. A store keeps an explicit operator, backend, policy, and transaction
> authority while storefronts, communities, services, and Agents help it
> reach and serve buyers through bounded contracts.

Buyer, seller, operator, and developer tasks remain important, but they sit on
top of this product model instead of becoming four unrelated documentation
silos.

## Narrative spine

The public product story uses four connected promises:

| Promise | Durable meaning | Representative domains |
|---|---|---|
| Own | Store identity, policy, data, and operating choice remain explicit | identity, stores, storefronts, domains, self-hosting |
| Connect | Independent stores can participate in discovery and distribution without surrendering transaction authority | community markets, direct links, social and embedded channels, curation |
| Trade | Orders advance through inspectable state, payment facts, fulfillment, and recovery rules | orders, payment rails, protection, disputes, shipping |
| Extend | Services and automation compose through typed, authority-limited boundaries | API, events, webhooks, messaging, MCP, Agents, Skills, extensions |

This spine can absorb future product evolution without promoting every new
provider, channel, or implementation name into the top-level taxonomy.

## Topic selection rule

A term becomes a public page only when it passes all of these tests:

1. It answers a stable user question or explains a durable product boundary.
2. It has an anonymously reviewable authority or an approved public policy.
3. Its current, Beta, proposed, and historical meanings can be separated.
4. The reader can take a next action or understand a concrete consequence.
5. It is not better represented as one section, worked example, capability
   row, generated reference, RFC, or internal design document.

The working topic inventory is therefore evidence for editorial discovery,
not a promised sitemap. Different-granularity terms are intentionally grouped:

| Knowledge domain | Concepts gathered here | Preferred public shape |
|---|---|---|
| Independent commerce system | whitepaper, P2P topology, hosted/self-hosted/hybrid, identity, multi-store, storefront | product map plus architecture and operating-path concepts |
| Transaction spine | product types, collections, discounts, orders, payment, protection, disputes, shipping | one commerce model with role-specific tasks and generated references |
| Distribution network | marketplace, verticals, direct/deal links, TMA, Discord, visibility, own domains | distribution concept plus concrete channel guides only when publicly supported |
| Operations and supply | launcher, updates, delivery, supply chain, external services | operator guides and provider-neutral extension concepts |
| Automation and integration | chat, Matrix, webhooks, AI, Agents, Skills, browser surfaces | integration map, bounded-automation concept, and contract reference |
| Economics and participation | fees, commissions, attribution, network participation | public fee policy, transaction quote rules, whitepaper principles, and reviewed RFCs |

## Public knowledge layers

Every subject is published through the smallest appropriate layer:

1. **Product narrative** — why the system exists and how its durable pieces fit.
2. **Current capability** — what the applicable backend and release can do.
3. **Journey or task** — how a person completes and verifies one outcome.
4. **Contract reference** — exact API, schema, event, and compatibility facts.
5. **Project direction** — whitepaper, RFC, roadmap, and historical decisions.

These layers share facts but not presentation hierarchy. A roadmap does not
become a task guide, and an internal implementation plan does not become a
public capability claim.

## Initial flagship set

The first editorial sequence is deliberately smaller than the source inventory:

| Priority | Public outcome | Initial route or owner |
|---|---|---|
| P0 | Explain the full product in one view | `/project/product-map` |
| P0 | Choose an independent or hosted operating path | `/start/choose-deployment` |
| P0 | Explain authority and trust boundaries | `/project/architecture` |
| P1 | Explain identity, store, storefront, and channel separation | `/project/identity-and-stores` |
| P1 | Explain the order, payment, fulfillment, and recovery spine | `/project/transaction-spine` plus linked task guides |
| P1 | Explain community distribution and marketplace operation | Evidence-gated distribution concept and operator journeys |
| P1 | Explain Agent, Skill, Tool, and approval boundaries | Existing MCP/extension guidance plus a product concept |
| P2 | Explain supply, delivery, messaging, and browser surfaces | Publish only as current capability or clearly labeled direction |

## Visual language

The visual system prefers explanatory line diagrams over dark poster cards or
decorative illustration:

- product maps show ownership and composition;
- topology diagrams show operator and trust boundaries;
- state diagrams show normal, exceptional, and terminal transitions;
- swimlanes show responsibility and evidence across actors;
- reviewed product screenshots show observable UI states;
- tables carry exact capability and cost comparisons.

Conceptual diagrams use code-reviewed SVG with desktop and mobile layouts.
Screenshots come from representative public test builds with seeded data,
version, viewport, role, privacy review, and capture date. Generative imagery
may support brand atmosphere but never represents architecture, financial
state, security, or shipped capability.

## Source and publication flow

```text
internal evidence or implementation
  -> public claim candidate
  -> authority and maturity review
  -> human page and visual
  -> Agent projection and golden questions
  -> release and freshness checks
```

`mobazha_hosting` remains an internal evidence source and is never ingested
automatically. Public claims must resolve to an approved public owner or be
published as a reviewed docs-owned policy. Internal prices, vulnerabilities,
customer data, operational playbooks, and unapproved market assumptions stay
outside the public surface.

## Completion signals

- A new visitor can explain Mobazha's difference from a conventional commerce
  SaaS within 30 seconds.
- A reader reaches a role-specific task within three choices.
- Every material capability claim exposes maturity, applicability, and authority.
- Every flagship domain has one useful relationship, topology, lifecycle, or
  observable-state visual rather than a decorative image quota.
- Search, Agent evaluations, and support questions converge on the same
  canonical product model.
