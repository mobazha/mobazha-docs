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
---

## Choose the mechanism

- Port: replace an implementation that Core requires.
- Module: assemble reviewed capabilities into a distribution.
- Function: customize a bounded deterministic business decision.
- Controller: reconcile an external system or perform external I/O.
- OrderExtension: attach versioned domain data and lifecycle to an order.

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
- Governance is uniform across modules, while business contracts remain small, typed, and domain-specific.
- New extension points are deliberate and domain-scoped, with an owner, schema, authority boundary, failure semantics, idempotency, recovery, tests, and a removal plan.
- There is no global named hook bus, mutable runtime registry, or universal Core service locator.

## Capability and trust gates

An extension capability remains unavailable until every activation gate passes. Source presence, a known identifier, or linked code is not evidence that the capability is enabled.

```text
distribution allowlist
  ∩ contract compatible
  ∩ installed or statically composed
  ∩ authorized
  ∩ configured
  ∩ healthy
```

- Reviewed first-party modules are statically linked by default.
- Independently distributed or third-party infrastructure runs out of process by default.
- Merchant-authored decision rules use a restricted sandbox such as Wasm when that runtime is introduced.
- Moving to a less isolated runtime requires threat analysis and an architecture decision.

## Current implementation boundary

The static order-extension v1 path currently validates exact contract names, immutable startup composition, dependencies and cycles, capability/interface agreement, and fail-closed invocation. It also provides append-only extension records, durable lifecycle delivery, typed reservation binding, and settlement attestations that re-enter the Core settlement command.

Distribution allowlists, per-tenant authorization and configuration, structured module health, drain, upgrade, rollback, a third-party process runtime, and a Wasm Function runtime remain governance targets. Do not describe those targets as generally available capabilities.

## Collectibles as the first case

- Signed NFT metadata becomes a versioned OrderExtension declaration produced by the Collectibles module.
- Token or inventory allocation is handled through a module-owned ReservationPort before funding.
- Minting and delivery are Controller work driven by durable extension events.
- Delivery evidence becomes a module-verified SettlementAttestation.
- Seller payout remains an existing Core conditional-settlement command.
- NFT, chain, mint, certificate, and provider vocabulary stays outside generic Core APIs.

Collectibles proves the architecture without turning NFT concepts into universal Core abstractions. Product-specific hooks, settlement commands, queues, and FiatMetadata mirroring were removed during the direct development-time cutover.

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
