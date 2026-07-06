---
title: Surfaces, channels, and integration contracts
summary: Place Web, mobile, desktop, community, Agent, domain, chat, API, WebSocket, webhook, and MCP concerns at the right layer while keeping one commerce authority.
status: Beta
audiences:
  - Operators
  - Developers
  - Client maintainers
  - Agent builders
  - Evaluators
evidenceLabel: Mobazha public frontend-composition, routing, HTTP, WebSocket, webhook, MCP, chat, and capability contracts
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: Choose a product surface and integration contract without turning a channel, notification, domain, or client shell into a second state authority.
estimatedTime: 10 minutes
journey: build
primaryAction:
  label: Build an integration
  href: /build
featuredVisual: surfaces-and-integrations
---

## Many surfaces, one commerce authority

Mobazha can be used through a hosted Web application, a self-hosted storefront, a mobile or desktop client, a community entrance, an embedded view, a direct link, or an Agent. These surfaces can look and behave differently while consuming the same store, catalog, quote, order, payment, fulfillment, and policy contracts.

The durable product rule is simple: a surface presents and requests; the backend with the active store or order context validates and owns admitted business state.

## Five layers that should not be collapsed

| Layer | Examples | Responsibility |
|---|---|---|
| Experience shell | Web, mobile, desktop, embedded, community, browser, Agent workspace | Navigation, layout, local interaction, device integration, and user explanation |
| Entry and context | Domain, Storefront slug, marketplace, direct link, tenant, store, role, persona | Resolve which business and policy boundary the request is about |
| Interaction contract | HTTP, WebSocket, webhook, MCP, chat | Carry commands, reads, notifications, tools, or conversation with defined delivery semantics |
| Capability and authorization | Backend version, effective capabilities, identity, scopes, resource state | Decide whether the operation exists and whether this actor may request it now |
| Commerce authority | Core-owned quote, order, payment verification, fulfillment, recovery, and audit | Admit durable facts and protected state transitions |

A new client does not require a new order model. A new transport does not activate a product capability. A new domain does not grant authorization. A new notification does not become transaction state.

## Resolve context before rendering an action

Every surface needs enough server-validated context to answer:

1. Which deployment and backend is connected?
2. Which tenant, store, Storefront, or marketplace is active?
3. Which identity is authenticated, and which role or persona is acting?
4. Which capability snapshot is authoritative and ready?
5. Which resource state and policy control the requested action?

Domains, subdomains, slugs, direct links, social start parameters, and embedded configuration can help locate this context. They are routing input, not proof of ownership. Server-side resolution must reject unknown context and prevent client-supplied routing hints from forging another store or Storefront.

- [Understand identity, stores, storefronts, and channels](/project/identity-and-stores)
- [Understand community and operator markets](/project/community-commerce)
- [Build on effective runtime capabilities](/build/runtime-capabilities)

## Choose the contract by delivery semantics

| Need | Prefer | Required behavior |
|---|---|---|
| Read current state or request a protected change | Versioned HTTP API | Authenticate, validate schema and state, use idempotency where required, return the authoritative result |
| Refresh an interactive client quickly | Authenticated WebSocket | Treat events as hints, tolerate gaps and unknown additions, then reload protected state |
| Deliver events to an operator-controlled service | Signed webhook | Durably accept, verify signature, deduplicate, tolerate retry and reordering, reconcile through the API |
| Let an Agent discover and invoke permitted Tools | MCP Streamable HTTP | Require `ai:use`, Tool domain scopes, current discovery, approval policy, and underlying command validation |
| Exchange human or Agent conversation | Chat contract, currently backed by enabled messaging services such as Matrix | Preserve room and message identity, membership and privacy; do not treat a message as order or payment authority |
| Reconcile an external business system | Typed extension or controller contract | Consume durable Core facts and return bounded observations or attestations |

These contracts can cooperate. A Web client may issue an HTTP command and receive a WebSocket refresh hint. A webhook consumer may respond to an event by reading the referenced order. An Agent may discover a Tool over MCP that calls the same protected HTTP business operation.

## HTTP is the authoritative read-and-command surface

The current Node exposes versioned business routes under `/v1/`. OpenAPI describes reviewed methods, paths, schemas, response envelopes, and authentication mechanisms. Exact route availability still depends on the connected distribution, version, capability, and identity.

Use HTTP to confirm important state after a reconnect, notification, chat message, provider callback, or uncertain timeout. A successful client-side animation, push event, or external callback is not a substitute for the latest authoritative resource.

- [Use the HTTP API and OpenAPI contract](/build/api)
- [Handle errors, retries, and idempotency](/build/errors-and-idempotency)

## WebSocket and webhooks are different event products

The current WebSocket surface under `/ws` supports timely authenticated client updates. Connections can break and transient events can be missed. After reconnecting, reload the resources needed to make a business decision.

Webhooks are outbound, signed deliveries to operator-controlled endpoints. They are designed for durable acceptance, retry, delivery history, and integration workflows. Duplicates and reordering are expected. The receiver must verify the exact signed body, deduplicate identifiers, and reconcile referenced state through HTTP.

Neither event surface defines business-state order by arrival time.

- [Consume WebSocket events](/build/websocket)
- [Implement a webhook consumer](/build/webhooks)

## Chat communicates; it does not settle

Chat can carry buyer and seller questions, negotiation context, fulfillment coordination, media, typing state, and read receipts. An enabled Matrix-backed service can preserve room, membership, message, and event identities behind the public chat contract.

Chat evidence may help explain a dispute, but a message saying “paid,” “shipped,” “refund approved,” or “complete” does not perform that transition. Protected actions still use the order, payment, refund, dispute, or fulfillment contract.

Keep credentials, recovery material, full payment secrets, and unnecessary customer data out of messages. A community support room is not a private transaction channel unless its membership and data policy say so.

## MCP is a machine surface over the same boundaries

MCP at `/v1/mcp` provides authenticated Tool discovery and invocation. It does not replace the HTTP business contracts, capability response, scope checks, request-bound approval, or Core command gate beneath a Tool.

An MCP client is not necessarily an autonomous Agent, and an Agent experience does not have to use MCP for every read. Select the narrowest interface that preserves identity, schema, risk, confirmation, and audit.

- [Understand Agent, Skill, Tool, and approval boundaries](/project/agent-commerce)
- [Initialize the current MCP transport](/build/mcp)

## Client shells and update channels do not define capability

Web, mobile, desktop, an installed launcher, a browser-oriented shell, or a community mini application can package the same product contracts for different devices and distribution contexts. Each shell still owns its local navigation, storage, rendering, permissions, deep-link handling, update policy, and release compatibility.

An update channel can deliver a newer client; it cannot make an older backend support a missing operation. A browser extension or launcher source tree does not become a public plugin runtime merely because it can render Mobazha data. Named shells and auto-update behavior require their own signed release, compatibility, rollback, privacy, and support evidence.

> **Important:** Browser-extension shell adoption, a universal launcher contract, remote UI plugins, and every social or embedded channel are not current universal public capabilities. Treat them as distribution-specific or future direction until the applicable release says otherwise.

## Current contract and evolution direction

| Area | Public meaning now | Direction that must remain labeled |
|---|---|---|
| Experience composition | Hosted, standalone, store, marketplace, and embedded concerns compose from explicit profiles and effective capabilities | More independently proven mobile, desktop, browser, community, and sovereign shells |
| Context routing | Server-resolved store, Storefront, marketplace, identity, and capability context controls the experience | More portable domains, deep links, and channel bindings |
| HTTP | Versioned `/v1/` API and reviewed OpenAPI are the authoritative integration surface | Broader contract coverage and conformance evidence |
| WebSocket | Authenticated `/ws` events support live refresh with reconnect reconciliation | A more complete versioned event contract |
| Webhooks | Signed CloudEvents-style deliveries support retryable operator integrations | More event coverage, tooling, and managed consumers |
| Chat | Capability-gated chat and Matrix-backed messaging contracts can carry rooms, messages, media, and live events | Richer cross-client conversation, moderation, and commerce context |
| MCP | Authenticated `/v1/mcp` exposes only permitted Tool operations | More clients and Tool coverage without weakening command gates |

The connected backend's routes, effective capabilities, authentication result, applicable release, and current resource state remain authoritative. Documentation and client packaging explain the surface; they do not activate it.
