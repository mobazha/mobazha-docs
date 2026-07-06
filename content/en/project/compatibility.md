---
title: Will these Mobazha components work together?
summary: Check client, backend, contract, capability, extension, data, and distribution compatibility before connecting systems or upgrading a store.
status: Current
audiences:
  - Sellers
  - Operators
  - Developers
  - Distributors
  - Agents
evidenceLabel: Node public contracts, runtime capabilities, migrations, and conformance sources
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-06
pageType: policy
outcome: Decide whether two Mobazha components can safely exchange data and preserve business meaning, then identify the evidence required before deployment.
estimatedTime: 9 minutes
journey: understand
primaryAction:
  label: Run the compatibility check
  href: /project/compatibility#quick-compatibility-check
---

## Where this page fits

Compatibility is narrower than product architecture and broader than “the request returned JSON.” Use the surrounding pages for different questions:

| Question | Source |
|---|---|
| Which system owns the request or state? | [System architecture](/project/architecture) |
| What can the connected backend do now? | [Runtime capabilities](/build/runtime-capabilities) |
| What exact HTTP operation or schema exists? | [API and OpenAPI](/build/api) |
| Is the feature part of the current release? | [Release scope](/project/release-scope) |
| Can these versions and components safely work together? | This page and the applicable release evidence |

## Direct answers

- **The client and backend both recognize the same field name. Are they compatible?** Not necessarily. Authorization, state meaning, idempotency, confirmation, recovery, and failure behavior are also part of the contract.
- **An adapter exists in source. Can a client use it?** Only when the distribution includes it, the contract version matches, the operator authorizes and configures it, dependencies are healthy, and the backend advertises the effective capability.
- **Can a newer client connect to an older Node?** Only within the versions and additive behavior tested by that client. It must fail closed when required schema or capability information is missing.
- **Can hosted and self-hosted stores use the same clients and integrations?** They may share public contracts, but authentication, deployment composition, enabled capabilities, external services, and operating responsibility can differ.
- **Does a successful happy-path test prove compatibility?** No. Conflicts, retries, duplicate events, timeouts, old data, migrations, downgrade, and recovery paths also matter.

## Quick compatibility check

Before connecting or upgrading two components, answer all seven questions:

1. **Identity:** Which exact client, backend, package, adapter, or distribution versions are involved?
2. **Contract:** Which generated HTTP, event, webhook, MCP, extension, or data contract do both sides claim?
3. **Capability:** Does the connected backend advertise the required effective capability as ready?
4. **Authorization:** Does the current identity have the required role, scope, store context, and permission?
5. **Semantics:** Do both sides agree on state transitions, amounts, identifiers, idempotency, finality, and recovery?
6. **Migration:** Can existing data, configuration, credentials, and provider bindings be upgraded and restored safely?
7. **Evidence:** Is there a conformance, integration, or release test covering this exact combination?

If any answer is unknown, the combination remains unverified even when it compiles or renders.

## Compatibility surfaces

| Surface | What must remain compatible | Evidence to inspect |
|---|---|---|
| HTTP API | Methods, paths, schemas, envelopes, authentication, stable errors, idempotency, and state effects | Generated OpenAPI, negative tests, release notes |
| Events and WebSocket | Event identity, payload version, ordering assumptions, reconnect behavior, and refresh semantics | Event contract, duplicate and reconnect tests |
| Webhooks | Signature, delivery identity, retries, deduplication, payload version, and reconciliation | Webhook contract, delivery history, consumer tests |
| Runtime configuration | Schema version, readiness, deployment profile, feature and capability meaning | `/v1/runtime-config`, client resolver tests |
| Commerce state | Order, payment, fulfillment, refund, dispute, settlement, and protection meanings | State-machine and transaction conformance tests |
| Identifiers | Canonical asset, chain, payment, store, order, and capability identity | Public identifier contract and normalization tests |
| Extensions and packages | Supported public port, module, function, controller, or out-of-process protocol | Versioned package contract and composition tests |
| Persisted data | Schema migration, retained provider bindings, backup, restore, rollback, and export | Migration tests, restored representative data |

Database internals, concrete constructors, private hooks, composition-root details, and code reachable through an internal import are not public compatibility promises.

## Common scenarios

### A newer client meets an older backend

The client should first read runtime schema and capability readiness. Additive unknown fields may be tolerated, but missing required state, malformed capabilities, or an incompatible schema must not be converted into assumed support. Optional UI stays unavailable rather than calling a guessed route.

### An integration sees a known payment identifier

Recognition only proves that the identifier can be parsed or displayed. It does not prove the distribution includes the adapter, the seller enabled it, credentials exist, the dependency is healthy, or the current order mode supports it.

### A provider is disabled while old orders still exist

New-work admission may close while persisted orders retain their provider binding and still require observation, refund, settlement, or reconciliation. Compatibility includes the ability to service those historical obligations; silently selecting a new provider is not safe fallback.

### Hosted and self-hosted distributions share an API

The operation shape may match while authentication, multi-store routing, limits, managed dependencies, and available capabilities differ. An integration must discover context and capability rather than branch only on a product name.

### Hosted and self-hosted stores share a network

Shared discovery, signed-content, messaging, or commerce protocols do not create a shared order database. Resolve the selected store and backend before acting, then reconcile state with that backend. A Hosting gateway may route hosted store context, but it does not become a compatibility proxy or recovery authority for an independent Node by implication.

Hybrid compatibility therefore requires evidence at both boundaries: the peer or service protocol must interoperate, and the selected backend must still admit the requested business capability, identity, and state transition.

## Version and change rules

- Patch releases should preserve supported contracts while fixing defects and security issues.
- Minor releases may add backward-compatible operations, fields, events, capabilities, or extension points.
- Major releases may intentionally break supported wire, state, package, or persisted-data contracts with migration guidance.
- During release-candidate development, even minor-looking changes require explicit review because stable compatibility has not yet been declared.

Changing a state's meaning, making an optional service mandatory, removing a field, weakening a financial invariant, or changing retry safety is breaking even when the transport still parses.

A breaking change requires public decision evidence, migration and downgrade guidance, updated conformance tests, a support window, release notes, and documentation impact review.

## Safe upgrade workflow

1. Record the running backend, client, distribution, contract, capability schema, configuration, and provider versions.
2. Read release notes for migrations, removed behavior, capability changes, and known issues.
3. Create a verified backup and preserve the prior runnable artifact and configuration.
4. Test representative store, order, payment, webhook, Agent, and recovery flows against restored data.
5. Upgrade in a controlled environment, then verify runtime readiness and every capability the deployment advertises.
6. Reconcile existing orders and provider bindings before admitting new work.
7. Roll back only through the documented data-compatible path; a previous binary may not understand migrated data.

- [Back up and upgrade safely](/self-host/backup-and-upgrade)
- [Handle errors, retries, and idempotency](/build/errors-and-idempotency)

## What proves compatibility

The strongest evidence is a test against the exact released combination and representative data:

- generated contract validation;
- unit and state-machine invariants;
- standalone and hosted-distribution integration tests;
- shared black-box conformance tests;
- migration, backup, restore, and downgrade exercises;
- duplicate, timeout, conflict, dependency-failure, and recovery tests.

Mocks help development but do not prove that a production distribution, external provider, or historical dataset is compatible. Record the exact versions and keep the evidence with the release or deployment decision.
