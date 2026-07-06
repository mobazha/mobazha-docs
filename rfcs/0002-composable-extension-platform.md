# RFC-0002: Composable Extension Platform Model

- Status: Draft
- Authors: Mobazha architecture and documentation maintainers
- Created: 2026-07-04
- Updated: 2026-07-06
- Decision owners: Mobazha Open Core and distribution maintainers
- Affected surfaces: Node, distributions, extension SDKs, hosted service, docs
- Supersedes: None
- Superseded by: None

## Summary

Define Mobazha's target extension platform as a Core-owned commerce kernel,
typed domain contracts, domain capability managers, shared governance
invariants, and trust-appropriate runtime choices. The model supports multiple
payment rails, service providers, and multi-stage resource integrations
without mixing packaging, business domain, contract role, runtime, trust, or
lifecycle into one plugin taxonomy or one universal module manager.

This RFC consolidates the long-term direction. It does not claim that every
governance invariant, domain-manager gate, or runtime described here is
implemented. The current family-specific payment module lifecycle and static
Order Extension v1 path are implemented slices.

## Problem and evidence

Open Core already contains narrow Ports, statically composed Modules, payment
plugins, policy Functions, Controllers, and a typed Order Extension path. They
solve different problems. Treating them as peer “plugin types” obscures who
owns state, which domain contract applies, how code is isolated, and whether a
capability is actually available.

The same ambiguity becomes dangerous as the platform adds:

- payment rails with escrow, observed direct payment, or provider-session
  lifecycles;
- inventory, fulfillment, tax, messaging, content, key, and other services;
- order-associated resources whose reservation, delivery, and evidence span
  several stages;
- first-party, reviewed partner, and untrusted implementations with different
  runtime requirements.

ADR-018 in Open Core establishes authority and extension-role boundaries. The
implemented Order Extension contract demonstrates durable declarations,
resource reservations, lifecycle delivery, and settlement attestations with
Collectibles as the first provider. This RFC defines how those pieces fit into
one platform and how the target should mature.

## Proposal

### 1. Stable platform boundary

Adopt this target model:

```text
Shared governance invariants
  identity · contract version · scope · provider binding · reason · audit
                         |
                         v
Domain capability managers
  payment manager · order-resource manager · future domain managers
                         |
                         v
Typed domain contracts and Core command gate
  payment · order resource · inventory · fulfillment · tax · notification
                         |
                         v
Core-owned commerce kernel
  order · payment · refund · dispute · settlement · durable facts · audit

Runtime choice is orthogonal:
  reviewed static module · isolated process/remote · restricted Wasm
```

Shared invariants define what every family must prove, but each domain manager
owns its capability semantics, runtime lifecycle, admission rules, and
recovery behavior. Typed contracts decide what may be exchanged. Runtime
drivers decide where and how an implementation executes. The Core command
gate alone decides whether extension input may affect Core-owned state.

This is deliberately not a proposal for one central control-plane service, one
universal descriptor, or one `ModuleManager`. Payment providers and
order-resource bindings live at different lifecycle levels and must not be
forced through the same runtime interface.

### 2. Keep classification axes independent

Every extension is described across independent dimensions instead of being
placed in one overloaded plugin hierarchy:

| Dimension | Examples |
|---|---|
| Packaging and release | Module |
| Business domain | Payment, order resource, inventory, fulfillment, tax, notification |
| Contract role | Port, Function, Controller, typed domain contract |
| Authority of output | Declaration, decision, observation, attestation |
| Interaction | Synchronous call, durable event, reconciliation |
| Runtime | Static in-process, isolated process or remote, Wasm |
| Trust | First-party, reviewed partner, untrusted |
| Artifact lifecycle | Discovered, verified, rejected |
| Provider runtime lifecycle | Starting, ready, degraded, draining, stopped |
| Capability exposure | Allowed, configured, advertised, blocked |
| Work lifecycle | Reserved, funded, delivering, reconciling, completed |
| Data ownership | Core-owned, module-owned, external-system-owned |
| Tenant scope | Distribution, tenant, store, order, or resource |

A Collectibles package, for example, is a first-party Module in the order
resource domain. It implements declaration, reservation, Controller, and
attestation contracts and currently runs in the static runtime. “Module,”
“Controller,” “static,” and “Collectibles” are therefore answers on different
axes, not competing types.

### 3. Keep lifecycle and state ownership separate

The platform does not have one lifecycle state machine. At least four
different state owners exist:

1. **Artifact lifecycle** verifies source, signature, provenance, and
   compatibility before an implementation may be considered.
2. **Provider runtime lifecycle** starts, reports readiness, degrades, drains,
   stops, or rolls back a long-lived provider when that runtime has those
   concepts.
3. **Capability exposure** decides whether a specific operation may be
   advertised or admitted for a distribution, tenant, resource, and time.
4. **Work lifecycle** records and recovers an order, payment, reservation,
   delivery, or reconciliation obligation already accepted by Core.

A provider can be closed to new work while remaining required to service or
reconcile existing bindings. A pure statically composed declaration codec may
need composition validation but no `Start` or `Stop`. A payment observer
may require readiness and continuous health. Domain managers map shared
governance invariants onto these different lifecycle needs.

### 4. Preserve domain-specific capability families

Shared governance invariants must not produce one universal business
interface.

Payment is a Core-owned bounded context with rail-specific adapters and a
normalized Core lifecycle. At minimum, its model distinguishes escrow,
direct-observed payment, and provider-session payment. A payment capability
descriptor states supported networks and assets, lifecycle operations,
execution authority, confirmation semantics, runtime, and trust. Adding a
payment method never grants settlement authority or bypasses the payment state
machine.

Every rail contribution declares a narrow operation set validated against its
rail contract. Escrow, direct-observed, and provider-session rails all require
setup, observation, verification, and reconciliation. Escrow may additionally
declare settlement and dispute operations; provider-session may declare
capture/confirm, cancellation, and refund; direct-observed may not claim
escrow-only settlement authority. Distribution repositories consume Core's
descriptor and contribution validators rather than copying these rules.

Provider-session payment also separates a statically composed driver from an
immutable tenant-scoped provider binding. The binding contains only an
external account reference and a credential-generation reference. Credential
material belongs in an append-only encrypted store behind a versioned key
provider contract; it never belongs in a manifest, binding, route, attempt, or
generic extension payload. Recovery resolves the exact credential generation
captured by the original attempt instead of silently using the tenant's current
configuration.

Provider-side commands that may move or release value use a durable,
Core-owned execution record separate from the normalized settlement model.
Core persists the immutable intent, original attempt and binding, and a stable
idempotency key before external I/O. Retries and reconciliation reuse that
same route and credential generation; a repeated key with a different intent
fails closed. This execution record is adapter infrastructure, not a new
extension authority or a universal lifecycle for every payment rail.

Every durable external action also captures an immutable route identity:
contribution, module, implementation generation, rail, network, concrete
asset, protocol version, and state-schema version. Incremental status writes
may omit that identity, but they cannot replace it. Restart recovery and
historical dispatch select from the captured identity rather than whichever
implementation is currently the default.

Address-based direct-observed orders capture the same route identity together
with their immutable observation grace policy. The runtime catalog separates
the implementation admitted for new work from implementations retained only
for historical recovery. If the captured implementation is unavailable,
recovery fails closed instead of falling back to the current default.

Address allocation itself follows the same persistence-first rule. Core owns
a typed attempt and immutable route binding committed before runtime I/O, and
the runtime must implement create-or-retrieve using Core's stable idempotency
key. Core persists the returned address, opaque index, and confirmation target
before linking the result to an order. The order write and attempt transition
to `linked` are one Core transaction. If that transaction fails, the durable
attempt remains `external_created`; after its deadline, reconciliation moves it
through replayable `abandoning` cleanup to terminal `abandoned`. Runtime cleanup
must be idempotent because a process can stop after cleanup but before the final
state write. Scheduled recovery reuses the captured route and key for both
allocation and cleanup; an expired unfinished claim cannot allocate new
external work. This closes both external-I/O crash windows without moving
provider-specific wallet state into Core or introducing a second payment state
machine.

Every synchronous caller and background reconciler for a leased value-moving
execution record must acquire the same tenant-scoped compare-and-swap lease
before provider I/O. Completion and retry writes are accepted only from the
current lease owner; expired work may be reclaimed with the original
idempotency key. Operational metrics use
bounded labels and never expose order, action, account, or credential IDs.
An authenticated tenant operations surface may expose only a redacted action
projection. Manual retry can override scheduled backoff but cannot preempt a
live lease or replace the original route, binding, credential generation, or
idempotency key. Authenticated operator interventions are appended to a
tenant-scoped audit log before execution and fail closed if audit persistence
fails. Independent-database-connection tests must cover contention and process
loss after the external effect but before local completion.

Order resource extensions bind a provider-owned resource or multi-stage domain
process to an order through versioned declarations and, only when needed,
reservation, durable delivery, observation, or attestation contracts. They do
not replace the order or payment domain.

Inventory, fulfillment, tax, notification, content, messaging, and key access
retain separate typed contracts and owners. Shared infrastructure adapters
that Core requires remain Ports; they are not promoted into arbitrary business
Modules merely to fit a plugin model.

### 5. Define Order Extension by lifecycle need, not product name

`OrderExtension` is appropriate when an order-associated binding must survive
restart and provider absence, scarce capacity must be reserved before funding,
external work must be driven from durable facts, or Core must validate evidence
before a Core-owned transition.

Candidate resources include collectible Hub slots, limited inventory,
gift-card redemption quotas, event tickets, regulated product lots, and
made-to-order production capacity. These are modeling candidates, not claims
of shipped providers. Each provider uses a namespaced type and private domain
payload and receives only the sub-capabilities it needs.

Collectibles is the first implementation of this broader contract. NFT, chain,
mint, collection, and Hub vocabulary remains in the Collectibles module. A
future ticket, quota, lot, or production provider does not inherit that
vocabulary. Cross-product taxonomies should be introduced only after another
implementation proves a stable shared concept.

### 6. Admit only typed, authority-limited interactions

Extensions may submit four kinds of input:

- declaration: versioned intent or resource binding for Core to persist;
- decision: bounded deterministic policy output;
- observation: a report about an external fact;
- attestation: signed or otherwise verifiable evidence for a declared
  condition.

Core validates identity, tenant and resource binding, authorization, contract
version, expected state, idempotency, freshness, and policy. Any accepted
financial effect re-enters a versioned Core command and state machine. An
extension cannot write Core tables, mutate an order directly, choose a payout
destination, or obtain a complete Core service locator.

### 7. Make admission contextual and preserve existing obligations

Capability availability is a decision over context rather than one global
boolean:

```text
decide(
  distribution,
  tenant and resource scope,
  requested operation,
  contract and provider binding,
  configuration and current provider state
) -> allowed or denied with a stable reason
```

For new work, the applicable domain manager requires distribution permission,
contract compatibility, composition or installation, authorization,
configuration, and sufficient readiness. Source presence, a registered
identifier, or static linkage alone does not establish availability.

For reviewed in-process modules, each distribution snapshots a versioned
composition profile before Node construction. The profile selects stable module
IDs from the statically available set, preserves declaration order, distinguishes
required from optional modules, and fails closed on missing required modules,
duplicates, or invalid descriptors. A factory or linked package makes a module
available; it never enables the module implicitly. Unselected modules do not
enter registration, binding, startup, health publication, or shutdown.

For existing work, the persisted provider, contract version, resource binding,
and Core state determine the continuing obligation. Disabling advertisement or
new admission must not silently abandon settlement, delivery, compensation, or
reconciliation. Domain managers may therefore return different decisions for
`admit-new`, `service-existing`, and `reconcile`.

### 8. Match runtime isolation to trust and behavior

- Reviewed first-party capabilities use static in-process composition by
  default when low latency and transactional coordination justify it.
- Independently distributed or partner infrastructure uses an isolated
  process or remote runtime by default, with authenticated versioned protocols,
  bounded credentials, deadlines, backpressure, and reconciliation.
- Merchant-authored deterministic policy uses a restricted Wasm runtime when
  introduced, with explicit fuel, memory, host-call, and output limits.

Runtime is a deployment choice constrained by the same typed domain contract.
Static and process implementations may share contract semantics without
sharing lifecycle transport or trust assumptions. Financial modules are not
hot-swapped mid-operation; draining and recovery preserve the provider and
contract binding of existing work.

### 9. Evolve by proven slices

The stages below separate the already implemented static baselines from target
governance. “Implemented” is deliberately scoped to the named slice; it does
not imply that the complete control plane or every domain family is shipped.

| Stage | Scope and outcome | Current state | Exit evidence |
|---|---|---|---|
| Current static slices | Family-specific payment module lifecycle plus typed Order Extension v1 | Implemented for the named slices | Existing payment-module, authority-negative, recovery, conformance, and Collectibles cutover tests |
| Governance hardening | Shared identity, scope, binding, reason, and audit invariants applied by domain managers | In progress | Negative tests and cross-family decision fixtures |
| Domain lifecycle hardening | Family-specific admission, readiness, drain, recovery, and rollback where applicable | Partial | Upgrade, obligation-preservation, process-loss, and recovery drills |
| Second resource provider | Validate Order Extension generality | Planned | No NFT vocabulary in Core; only evidence-backed shared concepts |
| Process runtime | Isolated reviewed-partner or third-party Controller/provider | Deferred | Protocol compatibility, credential isolation, retry, reconciliation, and termination tests |
| Wasm runtime | Untrusted deterministic Functions | Deferred | Sandbox limits, deterministic fixtures, and security review |
| Ecosystem readiness | Stable SDK, compatibility kit, provenance, operator tooling, and support policy | Deferred | Version policy, default conformance gate, provenance report, and support/removal policy |

Payment-specific current/target gaps and rollout stages are maintained in
[RFC-0006](./0006-payment-kernel-rails-and-trusted-modules.md). That RFC
specializes this model without turning its trusted payment manager into a
universal extension manager. Process and Wasm runtimes remain architectural
reservations rather than prerequisites for current first-party hardening.

No stage requires building a universal workflow engine, public marketplace, or
dynamic hot-reload system. New abstractions are extracted only after repeated
domain evidence.

## Security, privacy, and abuse analysis

Domain managers fail closed on unknown contracts, missing authorization, and
incompatible versions, and reject new work when the required provider state is
insufficient. They do not erase persisted obligations merely because a
provider becomes degraded. Runtime credentials are least-privilege,
tenant-scoped, rotatable, and unavailable to pure Functions. Secrets and raw
signing material are never placed in module manifests or generic extension
payloads.

Credential rotation creates a new immutable generation. Removing a provider
blocks new admission but retains the minimum historical credential generations
required to reconcile in-flight work. Stored credential payloads are encrypted
with a domain-separated, versioned key source; bindings expose only opaque
references and keyed fingerprints. Missing or undecryptable historical
material denies recovery rather than falling back to current credentials.

Core remains the sole authority for order, payment, refund, dispute, and
settlement state. Durable events are at-least-once, replay-safe, tenant-bound,
observable, and recoverable. Observations and attestations are untrusted input
until verified against issuer, resource, state version, freshness, replay, and
policy. Third-party runtimes require authenticated transport, bounded payloads,
timeouts, backpressure, provenance, audit, and a kill path.

Order-extension payloads may contain provider or regulated-product data. Each
contract must minimize persisted fields, classify sensitivity, define
retention and deletion behavior, and prevent one extension from reading
another provider's opaque data.

## Economic and legal analysis

This RFC defines architecture, not fees, provider economics, or legal
classification. Payment providers, gift-card issuers, event operators, and
regulated-product sellers retain their applicable commercial and legal
obligations. A module manifest or capability declaration does not establish
licensing, compliance, availability, or endorsement. Later provider RFCs must
identify payer, recipient, fee basis, refunds, data controller, jurisdiction,
and required legal review where applicable.

## Alternatives

- One global hook bus: rejected because ordering, authority, compatibility,
  and recovery become implicit.
- One universal plugin or service interface: rejected because it creates a
  service locator and erases domain ownership.
- Model runtime types as business capability types: rejected because static,
  process, and Wasm are execution choices rather than payment or fulfillment
  semantics.
- Put product taxonomies in Core: rejected until repeated implementations
  establish stable cross-domain concepts.
- Run every extension out of process: rejected as a default for reviewed
  first-party transactional composition, while retained for lower-trust or
  independently distributed infrastructure.
- Build a universal workflow engine now: rejected because the current evidence
  supports typed lifecycle contracts, not arbitrary workflow programmability.

## Rollout and rollback

ADR-018 and the Open Core extension contracts remain the normative authority
for implemented behavior. This RFC is Draft and changes no runtime capability.
Implementation proceeds stage by stage behind explicit composition and
capability gates. Each stage requires contract fixtures, authority-negative
tests, failure and recovery tests, observability, migration notes, and a
rollback or drain plan.

Implemented first-party slices must be merge-gated at their ownership
boundary: Core validates shared contracts and durable recovery against the
real persistence engine, distribution repositories validate their concrete
module vectors and profiles against Core, and cross-repository E2E validates
the assembled product. A test that is not part of a default CI or release gate
does not count as completing a stage.

Remote cross-repository release gates pin every behavior-bearing repository to
an immutable audited revision, including protocol and chain-program sources.
Moving default branches or mutable tool downloads cannot silently change the
composition under test. A new audited composition updates the pins explicitly
after its local full-stack gate passes.

Existing in-flight operations retain their persisted provider, contract
version, resource binding, and state version. A provider removal first blocks
new declarations, then drains or reconciles existing work. If a new runtime or
domain-manager gate fails, operators disable new admission and return to the
last compatible implementation without rewriting Core financial history or
abandoning existing obligations.

## Compatibility and migration

Pre-release implementations do not preserve compatibility with earlier
development-only attempt states or internal contracts. Existing
`external_created` rows are classified deterministically: a matching durable
order transitions them to `linked`; an expired row without an order completes
idempotent cleanup and transitions to `abandoned`. No provider-specific state
is inferred or copied into Core during migration.

## Documentation impact

- Keep ADR-018 and Open Core extension contracts authoritative for shipped
  implementation boundaries.
- State explicitly that Order Extension is generic and Collectibles is its
  first provider.
- Add the independent classification axes, separate lifecycle owners, and
  domain-manager model to the public extension guide.
- Keep current-versus-target capability language in human and Agent surfaces.
- Add domain-specific specifications only when their contracts and owners are
  stable; do not turn this RFC into one universal API specification.

## Open questions

- Which resource category should be the second implementation used to validate
  or revise the generic Order Extension contract?
- Which authenticated protocol and compatibility window should the first
  process runtime standardize?
- Which identity, scope, provider-binding, reason, and audit fields are stable
  enough to share across domain managers without creating a universal module
  interface?
- Which lifecycle states and health signals belong specifically to the next
  payment, order-resource, or other domain manager?
- What review and provenance requirements distinguish reviewed partners from
  untrusted third parties?
- Which tenant and operator surfaces distinguish new-work admission,
  existing-work service, and reconciliation without leaking sensitive
  configuration?

## Decision

Pending maintainer review. Until accepted, this RFC is an organizing model and
roadmap; ADR-018 and versioned Open Core contracts govern implemented behavior.
