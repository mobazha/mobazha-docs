---
title: Compatibility policy
summary: Compatibility covers wire contracts, state semantics, capabilities, versioning, extensions, migration, and conformance—not matching names alone.
status: Current
audiences:
  - Developers
  - Operators
  - Distributors
  - Agents
evidenceLabel: Node public contracts and conformance sources
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-04
pageType: policy
outcome: Determine whether two versions, packages, contracts, capabilities, or distributions can safely operate together.
estimatedTime: 8 minutes
journey: understand
primaryAction:
  label: Review compatibility surfaces
  href: /project/compatibility#compatibility-surfaces
---

## Compatibility surfaces

- Public HTTP methods, paths, schemas, response envelopes, and stable error codes.
- Public events, webhooks, order and payment states, refunds, disputes, and settlement semantics.
- Runtime capability schema and effective-set negotiation.
- Canonical asset and payment identifiers.
- Persisted public data, migration behavior, and documented configuration required for upgrades.
- Public packages and extension contracts explicitly identified as supported surfaces.

Matching JSON names is insufficient. State transitions, authorization, idempotency, confirmation, recovery, and financial invariants are part of the contract.

## Source and package boundary

Code under an internal directory, concrete constructors, database internals, application hooks, and composition-root details are not public contracts merely because another repository can reach them. Extensions use documented Ports, modules, typed functions, controllers, or versioned out-of-process protocols and do not receive raw signing material.

## Effective capability compatibility

Recognition, source presence, installation, authorization, operator configuration, health, and release policy are separate concerns. Clients render and call only effective capabilities advertised by the backend, fail closed without a valid snapshot, tolerate additive unknown fields, and never infer support from an identifier or dormant adapter.

## Versioning and change process

- Patch releases carry compatible fixes and security updates.
- Minor releases add backward-compatible APIs, capability fields, events, or extension points.
- Major releases may break wire, state-machine, persisted-data, or supported-package contracts.
- Removing a field, changing a state's meaning, weakening an invariant, or requiring a formerly optional capability is breaking even if the transport still parses.
- Breaking proposals require an RFC or ADR, migration and downgrade guidance, updated conformance tests, a support window, release notes, and documentation impact review.

## Conformance evidence

Compatibility is established through implementation tests, standalone E2E, hosted-distribution E2E, and shared black-box conformance. A distribution records the Mobazha commit or tag and contract version it implements. Undeclared capabilities are skipped by policy; mocks cannot prove production compatibility.

- [Runtime capabilities](/build/runtime-capabilities)
- [HTTP API and OpenAPI](/build/api)
- [Open Core extensions](/build/extensions)
