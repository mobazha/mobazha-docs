---
title: Extend Mobazha through public contracts
summary: Choose the narrowest typed extension mechanism and preserve Core authority, capability gates, isolation, recovery, and audit.
status: Draft
audiences:
  - Extension developers
  - Architects
  - Security reviewers
evidenceLabel: Mobazha Open Core extension contracts
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/docs/extensions
reviewed: 2026-07-04
pageType: concept
outcome: Select the narrowest extension mechanism without transferring Core order, payment, settlement, key, or audit authority.
estimatedTime: 12 minutes
journey: build
primaryAction:
  label: Choose the mechanism
  href: /build/extensions#choose-the-mechanism
---

## Choose the mechanism

- Port: replace an implementation that Core requires.
- Module: assemble reviewed capabilities into a distribution.
- Function: customize a bounded deterministic business decision.
- Controller: reconcile an external system or perform external I/O.
- OrderExtension: bind a versioned resource or multi-stage domain process to an order.

Use the narrowest mechanism that matches one responsibility. A package may implement more than one role, but each public contract has one authority boundary. A callback is not automatically a Port, and a Module is not a service locator.

## Preserve Core authority

Extensions submit declarations, decisions, observations, or attestations. Core validates identity, authorization, schema and contract versions, resource binding, expected state, idempotency, freshness, and policy before creating a Core-owned command or durable fact.

```text
extension input
  -> Core validation
  -> Core command or durable fact
  -> Core state machine
  -> audit and external execution through a scoped adapter
```

- Do not add a generic hook when a typed domain contract can express the need.
- Core retains release policy, order state, payment verification, settlement gates, audit, and key custody.
- Third-party code must not import internal packages, receive the Core object, or access raw signing material.
- Extensions never write Core tables or directly invoke an internal state transition.
- Payment, refund, dispute, and settlement changes re-enter a versioned, idempotent Core command and state machine.

## Design rules

- Ports provide replaceability for narrow Core-owned capabilities.
- Modules provide immutable startup composition and declare identity, versions, dependencies, capabilities, configuration, runtime type, and lifecycle.
- Functions are bounded and deterministic; they do not receive network, database, key, clock, or state-transition authority.
- Controllers reconcile external systems from durable Core facts and return observations or attestations.
- Shared governance invariants apply across families, while domain managers, business contracts, and lifecycle semantics remain small, typed, and domain-specific.
- New extension points are deliberate and domain-scoped, with an owner, schema, authority boundary, failure semantics, idempotency, recovery, tests, and a removal plan.
- There is no global named hook bus, mutable runtime registry, or universal Core service locator.

## Target platform model under review

The Draft [Composable Extension Platform RFC](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0002-composable-extension-platform.md) organizes the long-term target as:

```text
Shared governance invariants
  -> Domain capability managers
  -> Typed Domain Contracts and Core Command Gate
  -> Core-owned Commerce Kernel

Runtime choice remains orthogonal:
  static in-process | isolated process or remote | restricted Wasm
```

Shared invariants cover identity, contract version, scope, provider binding, stable reasons, and audit. Payment, order-resource, and future domain managers apply those invariants through their own admission, runtime, recovery, and business semantics. Core alone decides whether an input may change Core-owned state. This is not one central control-plane service or universal `ModuleManager`.

Do not collapse these independent dimensions into one plugin taxonomy:

| Dimension | Examples |
|---|---|
| Packaging | Module |
| Business domain | Payment, order resource, inventory, fulfillment, tax, notification |
| Contract role | Port, Function, Controller, typed domain contract |
| Output authority | Declaration, decision, observation, attestation |
| Interaction | Synchronous call, durable event, reconciliation |
| Runtime | Static in-process, isolated process or remote, Wasm |
| Trust | First-party, reviewed partner, untrusted |
| Artifact lifecycle | Discovered, verified, rejected |
| Provider runtime lifecycle | Starting, ready, degraded, draining, stopped |
| Capability exposure | Allowed, configured, advertised, blocked |
| Work lifecycle | Reserved, funded, delivering, reconciling, completed |
| Data ownership | Core, module, or external system |

This model is a Draft direction, not evidence that every domain-manager gate or runtime is currently available.

## Keep capability families domain-specific

- Payment is a Core-owned bounded context. Escrow, directly observed payment, and provider checkout sessions may use different adapters, but payment, refund, dispute, and settlement state remains in Core.
- OrderExtension binds an order-associated resource or multi-stage domain process through only the declaration, reservation, durable delivery, observation, or attestation contracts it needs.
- Inventory, fulfillment, tax, notification, and other provider families retain narrow typed contracts and explicit owners.
- Content, messaging, keys, storage, and similar Core-required infrastructure remain Ports when their purpose is implementation replacement. They do not become arbitrary business Modules.

Shared governance invariants do not imply one universal descriptor, manager, lifecycle, or business interface.

## Capability and trust gates

Capability availability is a contextual decision, not one global boolean. Source presence, a known identifier, or linked code is not evidence that new work may be admitted.

```text
decide(distribution, tenant and resource, operation,
       contract and provider binding, configuration, provider state)
  -> allowed or denied with a stable reason
```

- New work requires the applicable distribution, compatibility, composition, authorization, configuration, and readiness checks.
- Existing work retains its persisted provider and contract binding. Disabling advertisement or new admission must not abandon settlement, delivery, compensation, or reconciliation.
- A domain manager may therefore decide differently for `admit-new`, `service-existing`, and `reconcile`.
- Reviewed first-party modules are statically linked by default.
- Independently distributed or third-party infrastructure runs out of process by default.
- Merchant-authored decision rules use a restricted sandbox such as Wasm when that runtime is introduced.
- Moving to a less isolated runtime requires threat analysis and an architecture decision.

## Current implementation boundary

Trusted payment modules currently have family-specific descriptors, dependency ordering, scoped runtime grants, readiness and health, setup-gated activation, reverse shutdown, and rollback. Static order-extension v1 separately validates exact contracts, immutable startup composition, dependencies and cycles, capability/interface agreement, and fail-closed invocation. It also provides append-only extension records, durable delivery, typed reservation binding, and settlement attestations that re-enter the Core settlement command.

These implemented slices do not form a universal module manager. Cross-family governance records, contextual tenant and resource admission, third-party process runtimes, and a Wasm Function runtime remain targets. Health, drain, and rollback apply only where a provider's runtime semantics require them.

## OrderExtension scope and the first provider

OrderExtension is not a Collectibles or NFT category. Use it when an order-associated binding must survive restarts and provider absence, scarce capacity must be reserved before funding, external work must be driven durably, or Core must validate evidence before a Core-owned transition.

Candidate resources include collectible Hub slots, limited inventory, gift-card redemption quotas, event tickets, regulated product lots, and made-to-order capacity. These are modeling candidates, not shipped providers. Each provider keeps a namespaced type and private domain payload and receives only the sub-capabilities it needs.

Collectibles is the first implemented provider:

- Signed NFT metadata becomes a versioned OrderExtension declaration produced by the Collectibles module.
- Token or inventory allocation is handled through a module-owned ReservationPort before funding.
- Minting and delivery are Controller work driven by durable extension events.
- Delivery evidence becomes a module-verified SettlementAttestation.
- Seller payout remains an existing Core conditional-settlement command.
- NFT, chain, mint, certificate, and provider vocabulary stays outside generic Core APIs.

Collectibles proves the first slice without defining the scope of OrderExtension or turning NFT concepts into universal Core abstractions. Product-specific hooks, settlement commands, queues, and FiatMetadata mirroring were removed during the direct development-time cutover.

## Review a new extension point

- Identify the domain owner, business purpose, caller, declarer, and authorizer.
- Version the input, output, descriptor, and compatibility behavior independently.
- Define synchronous or durable delivery, ordering, idempotency, timeout, retry, dead-letter, and reconciliation behavior.
- Declare capability gates, permissions, sensitive data, and the Core state-machine re-entry point.
- Provide migration, rollback, removal, observability, negative tests, and conformance evidence.

If those answers are not stable, keep the mechanism private to its implementation instead of publishing another generic extension point.

## Start with the normative documents

- [ADR-018: Open Core extension architecture](https://github.com/mobazha/mobazha/blob/main/docs/adr/018-open-core-extension-architecture.md) — Roles, authority boundaries, trust model, and architectural invariants.
- [Extension overview](https://github.com/mobazha/mobazha/blob/main/docs/extensions/README.md)
- [Capability and security model](https://github.com/mobazha/mobazha/blob/main/docs/extensions/CAPABILITY_AND_SECURITY_MODEL.md)
- [Module lifecycle](https://github.com/mobazha/mobazha/blob/main/docs/extensions/MODULE_LIFECYCLE.md)
- [Order extension contract](https://github.com/mobazha/mobazha/blob/main/docs/extensions/ORDER_EXTENSION_CONTRACT.md)
- [Collectibles order-extension evolution](https://github.com/mobazha/mobazha/blob/main/docs/extensions/ORDER_EXTENSION_EVOLUTION_PLAN.md)
- [Conformance](https://github.com/mobazha/mobazha/blob/main/docs/extensions/CONFORMANCE.md)
- [Payment plugin architecture](https://github.com/mobazha/mobazha/blob/main/docs/plugins/PAYMENT_PLUGIN_ARCHITECTURE.md)
- [Draft Composable Extension Platform RFC](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0002-composable-extension-platform.md) — Target platform model; not shipped-capability authority.
