---
title: How Mobazha systems and store networks fit together
summary: Compare direct peer-to-peer and hybrid store networks, then follow a request to the backend that owns store and transaction state.
status: Beta
audiences:
  - Buyers
  - Sellers
  - Operators
  - Developers
  - Evaluators
  - Agents
evidenceLabel: Mobazha public product, Node, runtime, and distribution contracts
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: Distinguish direct peer-to-peer and hybrid store networks, identify which backend owns each decision, and trace authority across surfaces and services.
estimatedTime: 10 minutes
journey: understand
primaryAction:
  label: Compare the two topologies
  href: /project/architecture#read-the-topologies
featuredVisual: store-network-topologies
---

## Read the topologies

Mobazha is peer-to-peer because independently operated store backends can participate in shared discovery, signed-content, messaging, and commerce protocols without moving every store or order into one central platform database. It does **not** mean every buyer must run a Node, every request connects directly at the transport layer, or every peer receives a copy of every order.

The selected seller backend is the stable authority boundary in both topologies:

| Question | Direct P2P store network | Hybrid store network |
|---|---|---|
| Where does the store run? | On a Node operated for that independent store | On either an independently operated Node or a hosted Commercial Node |
| How does a buyer reach it? | A storefront, app, direct link, or Agent resolves the seller Node and requests the action | The entry surface resolves seller context; a Hosting gateway routes hosted context, while independent context continues to its own Node |
| What may cross the network? | Published profiles and offers, discovery signals, messages, and explicit protocol requests | The same public protocol relationships plus separately enabled hosted, index, payment, delivery, messaging, or automation services |
| What does not spread by implication? | Private store data, recovery material, credentials, and the authoritative order record | Independent Node data and orders do not move into Hosting merely because the store uses a hosted channel or optional service |
| Who decides whether an order changes state? | The selected seller backend that created and owns that order | The selected seller backend—independent or hosted—not the entry channel, gateway, index, or another peer |

**Direct P2P** describes independent Nodes as peers, not one shared database. **Hybrid** describes coexistence and bounded service composition, not a third kind of order owner. A store still has one active backend context for a given order.

- [Choose hosted or self-hosted operation](/start/choose-deployment)
- [Understand community markets and distributed discovery](/project/community-commerce)
- [Check what the connected backend can do](/build/runtime-capabilities)

## Use the right architecture view

The topology deliberately does not place every actor, client, chain, contract, and Node component on one canvas. Those are different architectural dimensions. Combining them can make a possible integration look mandatory or make a shared service look authoritative.

| View | Question it should answer | Use this source |
|---|---|---|
| Store network topology | How do independent and hosted stores coexist, and which backend owns an order? | The topology above and this page |
| Transaction and protection flow | How do buyer, seller, payment evidence, fulfillment, refund, dispute, and arbitration responsibilities interact? | [Orders, payments, and recovery](/project/transaction-spine) and [cancel, refund, or dispute](/buy/cancel-refund-dispute) |
| Experience and channel topology | How do Web, desktop, mobile, community, embedded, messaging, and Agent entry points reach the same commerce context? | [Channels and integrations](/project/surfaces-and-integrations) |
| Node composition | How do Core services, local data, content storage, messaging, wallet, and provider adapters fit inside one backend? | The six-part model below, [self-hosting](/self-host), and public implementation contracts |
| Payment and settlement topology | Which rail, wallet, provider, chain, escrow, or settlement controller applies to one order? | [Seller payments](/sell/payments), the order-bound Payment Session, runtime capabilities, and the applicable provider contract |

A named blockchain, smart contract, social client, hosted service, or arbitration mechanism belongs in a more specific view only when current capability and policy evidence supports it. Its appearance in a concept diagram must never imply universal availability.

## Where this page fits

Mobazha can appear as a storefront, hosted application, self-hosted Node, community market, direct link, API, or Agent workflow. Those are not separate explanations of the product. They are surfaces and operating paths around one commerce model.

Use each overview for a different question:

| Page | Question it answers |
|---|---|
| [Product map](/project/product-map) | What are Mobazha's main product concepts and ways to use them? |
| **This architecture page** | Which systems handle a request, where does state live, and which system is authoritative? |
| [Transaction spine](/project/transaction-spine) | How does one order move through payment, fulfillment, completion, and recovery? |
| [Runtime capabilities](/build/runtime-capabilities) | What can the backend I am connected to do right now? |
| [Release scope](/project/release-scope) | Which capabilities are current release evidence, conditional, or still Draft? |

If you only need to buy or sell, follow the task guides. Use this page when you need to understand why two screens disagree, choose an operating model, integrate a service, or determine who is responsible for a failure.

## The system in six parts

| Part | What users see or depend on | What it may decide |
|---|---|---|
| Presentation surfaces | Storefront, Admin, hosted app, web or desktop client, direct link, community entry, Agent, API client | How information is presented and which supported action is requested |
| Selected backend | The hosted or self-hosted Node serving the active store and order context | Store data, identity context, effective capabilities, authorization, and admitted business operations |
| Open Core | Order, payment-verification, refund, dispute, settlement, protection, and audit state machines inside the backend | Whether a protected transition is valid and what the next authoritative state is |
| Adapters and controllers | Payment, delivery, messaging, search, webhook, and other bounded integrations | Translate requests, observations, and provider results; they do not directly invent Core state |
| External systems | Blockchain, wallet, payment provider, carrier, messaging network, indexer, AI provider, or another named service | Facts and actions within that provider's own boundary |
| Public knowledge and release evidence | Canonical docs, generated contracts, capability responses, conformance tests, and tagged releases | What a public policy means and what a particular release can claim |

The durable rule is simple: a surface may request an action, and an external provider may report a fact, but the backend that owns the order decides whether that input creates a valid business-state change.

## One request through the system

Consider a buyer opening an offer and paying for an order:

1. **The surface resolves context.** A storefront, application, or Agent identifies the store and backend it is acting against.
2. **The client discovers availability.** It reads runtime configuration and effective capabilities instead of assuming every Mobazha deployment is identical.
3. **The backend creates the business record.** It validates identity, store policy, listing revision, quote, authorization, and current state before creating the order.
4. **Core binds the transaction.** The order receives durable identity and a snapshot of accepted terms. A Payment Session binds the intended rail, amount, funding target or provider state, expiry, and verification rules.
5. **An external system reports evidence.** A chain observer, wallet, payment provider, webhook, or operator reports what it observed. That report is evidence, not permission to skip the state machine.
6. **Core admits or rejects the transition.** It checks the expected order, amount, asset, confirmations, identity, policy, and idempotency before advancing payment or order state.
7. **Surfaces refresh authoritative state.** Buyer, seller, webhook consumer, and Agent render or act from the latest backend state rather than from a notification alone.

The same structure applies to shipping, pickup, cancellation, refund, dispute, and settlement: an integration supplies bounded input; the owning backend validates the protected change.

## Hosted, self-hosted, and optional services

| Operating path | Who runs the backend? | Who owns operations? | What remains separate? |
|---|---|---|---|
| Hosted | A hosted service operates the applicable commercial distribution and routes the active account or store context | The service operator manages deployment and availability under its terms; the store operator still owns its catalog, policies, and order responsibilities | Payment rails, delivery, AI, messaging, and other providers remain named dependencies |
| Self-hosted | The seller or independent operator runs a released Node distribution | That operator owns host security, data, backup, network exposure, updates, monitoring, and recovery | Optional Mobazha or third-party services are enabled separately and must disclose exchanged data and price |
| Hybrid use | A self-hosted or hosted backend calls selected external capabilities | Responsibility remains split by the published service and transaction contracts | Connecting a service does not transfer order authority or local recovery material by implication |

Hosted and self-hosted deployments can share public contracts and Core behavior without being the same distribution or operational boundary. The buyer should not need to understand repository topology, but the operator must know which backend owns the store and who is accountable for each dependency.

- [Choose hosted or self-hosted operation](/start/choose-deployment)
- [Run and recover a self-hosted Node](/self-host)
- [Review distribution and packaging policy](/project/distribution)

## Where to find the authoritative answer

| User question | Authority to inspect first |
|---|---|
| What is the current order state? | The backend that owns the order |
| Where should this order be paid, and what has been verified? | The order-bound Payment Session and backend payment records |
| Is this feature available here? | The connected backend's ready runtime-capability response |
| May this person or Agent perform the action? | Backend authorization, role, scope, store context, and current state |
| Did a payment, delivery, or provider event occur? | The applicable provider evidence plus the backend record that reconciles it |
| What exact request and response shape is supported? | The generated contract and tagged release evidence |
| What is the public fee, security, or compatibility rule? | The canonical policy page on docs.mobazha.org |
| What amount and recipient apply to this order? | The accepted quote and transaction record, within public policy |

Documentation explains these authorities; it cannot activate a capability, change an order, or replace transaction evidence.

## Authority and recovery boundaries

Mobazha avoids competing sources of truth by keeping authority with the system responsible for each kind of state. A presentation surface may request an action and an external provider may report evidence, but neither silently replaces the backend that owns the store or order.

- **Store and order state remains backend-owned.** A cached page, notification, community channel, gateway, or Agent does not independently advance a protected transaction.
- **Provider evidence is reconciled, not copied into Core by assumption.** Payment, delivery, messaging, and other observations are checked against the intended order, policy, and current state.
- **Optional services remain bounded dependencies.** Their availability can narrow a workflow without transferring order authority or changing recovery ownership.
- **Protected actions require current proof.** A client presents payment, shipment, refund, dispute, or settlement as complete only after the owning backend confirms the applicable capability, permission, and state transition.

This design prevents a delayed channel or dependency response from becoming an unverified business-state change. Task-level guidance remains with the person performing the task:

- Buyers can [track payment and order status](/buy/order-status) or [choose a cancellation, refund, or dispute path](/buy/cancel-refund-dispute).
- Sellers can [verify payment readiness and recovery](/sell/payments).
- Operators and integrators can [check effective runtime capabilities](/build/runtime-capabilities), review [channels and integrations](/project/surfaces-and-integrations), or [route a reproducible problem](/support).

## Extensions cannot bypass Core

Mobazha uses typed ports, modules, deterministic policy functions, and controllers to compose integrations. The mechanism depends on the job, but the authority limit is consistent:

- an extension receives the minimum data and capability it needs;
- source presence or a recognized identifier does not make it active;
- a controller may observe or request work but cannot write protected order or payment state directly;
- every financial or order change returns through an authorized Core command;
- clients and distributions may narrow advertised behavior but cannot widen backend capability.

- [Build against public extension contracts](/build/extensions)
- [Use API, WebSocket, webhooks, and MCP surfaces](/project/surfaces-and-integrations)

## Current boundary and evolution

Current public behavior is established by the connected backend, generated contracts, effective capabilities, and release evidence. The v0.3 line remains release-candidate software, so exact compositions and enabled integrations are conditional.

Draft RFCs explore more reusable Core services and frontend composition. Generic dynamic plugins, remote UI code, a universal product manifest, and unrestricted runtime extension are not current public contracts. Architecture direction must remain labeled separately from the software a user can operate today.

- [Review current release maturity](/project/release-scope)
- [Read compatibility and conformance policy](/project/compatibility)
- [Inspect public RFCs and ADRs](/project/decisions)
