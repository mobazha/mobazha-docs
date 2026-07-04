# RFC-0003: Composable Frontend Product Model

- Status: Draft
- Authors: Mobazha architecture and documentation maintainers
- Created: 2026-07-04
- Updated: 2026-07-04
- Decision owners: Mobazha Unified, distribution, and documentation maintainers
- Affected surfaces: Unified, frontend distributions, Commerce Kit, embedded clients, docs
- Supersedes: None
- Superseded by: None

## Summary

Define Mobazha frontend products as validated compositions across independent
deployment, experience, authentication, presentation-channel, network-policy,
branding, code-inclusion, and effective-capability dimensions.

The public frontend supplies product-neutral contracts, shared application
foundations, and reusable commerce feature packages. Distribution owners select
the build-time code composition and product profile. At runtime, the client
intersects that composition with authoritative backend capabilities, current
authorization, and readiness before resolving routes, navigation, providers,
workflows, and actions.

This RFC is about product composition, not a third-party extension platform. It
does not propose dynamic plugins, remote React code, micro-frontends, an Agent
surface protocol, or a plugin marketplace.

## Problem and evidence

Mobazha serves hosted platforms and stores, standalone stores, marketplace
experiences, embedded clients, browser extensions, and sovereign distributions.
These are not peer values on one product-type axis:

- hosted and standalone are deployment choices;
- platform, store, and marketplace are root experiences;
- Web, embedded clients, and browser extensions are presentation channels;
- authentication selects a transport and identity boundary;
- backend capabilities describe effective business availability;
- a private distribution may include code that is physically absent from the
  public frontend.

When those dimensions are collapsed into product-name checks, feature code
accumulates branches such as `isHosted`, `isStandalone`, `isMarketplace`, or a
distribution-specific build flag. Routes, navigation, providers, and actions
then interpret the same product differently, invalid combinations remain
representable, and a frontend toggle can appear to enable behavior the backend
does not provide.

The public implementation already contains two useful foundations:

- Runtime Config separates deployment, experience, authentication, readiness,
  branding, external-resource policy, and backend capabilities.
- `@mobazha/commerce-kit` defines a product-neutral public package boundary with
  typed ports, workflows, capability-aware route/navigation/slot descriptors,
  and packed Next.js/Vite consumer tests.

Those foundations establish the current slice but do not yet define the
cross-repository product-composition constitution, invalid-combination policy,
single resolved output, or migration away from scattered product identity
checks. [RFC-0002](./0002-composable-extension-platform.md) governs the backend
extension platform; this RFC governs how frontend products are assembled from
the capabilities that a backend and distribution make available.

## Proposal

### 1. Stable product-composition boundary

Adopt this target model:

```text
Distribution-owned Product Profile
  deployment · experience · auth · channel · egress · brand
                         |
                         v
Frontend Composition Resolver
  code presence · compatibility · requirements · conflicts · readiness
                         |
                         v
Feature Catalog
  routes · navigation · providers · workflows · surfaces · adapters
                         |
                         v
Host-owned Application Kernel
  router · provider graph · auth boundary · i18n · theme · error handling
                         |
                         v
Backend Effective Capabilities
  authoritative business availability and operational readiness
```

The product profile describes the intended shell. The build decides which code
exists. The backend decides which business capabilities are effectively
available. The composition resolver may narrow those inputs but may never
manufacture a capability or bypass backend authorization.

### 2. Keep composition dimensions independent

Every frontend product is described across independent dimensions:

| Dimension | Examples | Authority |
|---|---|---|
| Deployment | hosted, standalone, sovereign | distribution profile and runtime config |
| Root experience | platform, store, marketplace | distribution profile and runtime config |
| Authentication | hosted OAuth, standalone identity, local administration | host application |
| Presentation channel | Web, embedded client, browser extension | application shell |
| Network policy | external resources allowed, restricted egress, same-origin only | distribution and CSP |
| Branding | platform, store, distribution | host application |
| Code inclusion | public features, application-local features, private features | build composition |
| Business capability | storefront, checkout, marketplace, payment, administration | backend effective capability |
| Authorization | public, buyer, seller, operator, administrator | backend and host auth boundary |
| Readiness | pending, ready, invalid, degraded | authoritative runtime snapshot and resolver |

A named product is a reviewed profile over these axes, not a value that feature
components switch on. A marketplace experience can run on more than one valid
deployment. An embedded channel can render a store or marketplace experience.
A sovereign distribution may combine public commerce features with private
code without exposing a private product identity to the public repository.

### 3. Separate build-time and runtime composition

Build-time composition decides whether code is present:

```text
public application foundations
  + selected public feature packages
  + distribution-local features
  + optional private feature packages
  = deployable frontend artifact
```

Runtime composition decides whether included code may be exposed:

```text
build-included feature
  ∩ product-profile permission
  ∩ authoritative backend capability
  ∩ supported experience and channel
  ∩ current authorization
  ∩ runtime readiness
  = resolved frontend feature
```

A runtime value cannot activate code that was not included in the artifact.
Physical absence is the boundary for private implementation. Feature flags and
capabilities are not substitutes for source or artifact separation.

### 4. Keep product identity out of feature behavior

Feature packages declare requirements rather than product names. A requirement
may identify backend capabilities, supported experiences, authorization,
rendering support, or network constraints. The resolver evaluates those
requirements once and produces a shared result for every consumer.

Feature components must not inspect a private distribution identity or use a
named product as a proxy for payment, authentication, or network behavior. A
private feature may implement the same public composition contract from its
own repository, but the public application must not import, enumerate, or
describe that implementation.

### 5. Preserve host ownership

The host application owns:

- top-level router materialization and error boundaries;
- provider graph and concrete API adapters;
- authentication transport and authorization rendering;
- localization, theme, branding, and accessibility integration;
- runtime-config loading, schema validation, and pending/invalid states;
- action execution, confirmation, idempotency, and audit;
- distribution build entrypoints and private feature inclusion.

Public feature packages may contribute typed descriptors, workflows, ports,
policies, and surfaces. They do not own the complete application shell or read
application globals to infer product identity.

`@mobazha/commerce-kit` is one public feature-catalog provider. It is not the
product composer, router, provider graph, design system, or complete frontend.
Generic visual foundations remain in `@mobazha/ui`; Unified-specific API,
state, and provider implementation remain internal to Unified.

### 6. Resolve one coherent frontend product

Routes, navigation, providers, workflows, and actions must be projected from
one resolved composition. They must not use parallel condition sets that can
drift.

The target resolver conceptually accepts:

```text
product profile
  + authoritative runtime snapshot
  + build-included feature catalog
  + host auth and renderer support
```

and returns:

```text
status: pending | ready | invalid
resolved routes, navigation, providers, workflows, and actions
structured diagnostics for every excluded or conflicting feature
```

The exact TypeScript API is not frozen by this RFC. It should be extracted
from current Runtime Config and Commerce Kit behavior, then validated by real
product slices before becoming a public contract.

### 7. Fail closed and make invalid composition observable

The resolver fails closed when:

- the runtime capability snapshot is absent, invalid, or not ready;
- an included feature requires an unsupported authentication boundary;
- route, navigation, provider, or feature identifiers conflict;
- a required capability or renderer is unavailable;
- a profile combines dimensions that the host does not support;
- restricted-egress policy rejects a required external resource;
- a public feature attempts to depend on application or private source.

Pending capability state is not equivalent to authoritative denial and must not
silently become a 404. Invalid composition produces structured diagnostics for
tests and operators without leaking credentials or private implementation
details.

### 8. Preserve the public/private code boundary

The public frontend defines neutral composition axes and public feature
contracts. A private distribution owns its named product profile, private
feature packages, brand, build entrypoint, release process, and final embedded
artifact.

Private modules may contribute through compatible route, navigation, provider,
workflow, or surface contracts, but:

- their source and product vocabulary remain outside public repositories;
- the public catalog does not reserve identifiers for private implementation;
- public packages never import private packages or branch on private identity;
- private composition cannot widen backend capability or bypass the host kernel;
- public conformance fixtures use neutral sovereign/distribution terminology.

### 9. Evolve by representative product slices

Implementation proceeds through representative compositions rather than by
designing a universal product manifest upfront:

| Stage | Product evidence | Exit condition |
|---|---|---|
| Current foundation | Runtime Config dimensions and Commerce Kit Guest Checkout | Existing products continue to build and run |
| Composition inventory | Hosted, standalone, marketplace, embedded, and sovereign condition audit | Every condition classified by an independent dimension |
| Resolver baseline | Shared route/navigation/provider/action projection | Pending, invalid, and excluded reasons are deterministic |
| Public vertical slices | Guest Checkout, product actions, cart summary | At least two real applications consume equivalent contracts |
| Private composition | Public kit plus private distribution-local feature | Private code remains physically absent from public artifacts |
| Release governance | Versioned profile/schema and product matrix | Packed artifacts and final binaries prove claimed compositions |

Adding provider contributions, dependency metadata, compatibility ranges, or
conflict policies to the public composition API requires evidence from these
slices. The RFC does not require those abstractions before they are needed.

### 10. Explicit non-goals

This RFC does not introduce:

- a third-party frontend extension or plugin SDK;
- dynamic module loading, Module Federation, or micro-frontends;
- remotely supplied React components, JavaScript, HTML, or arbitrary CSS;
- a global hook or event bus;
- an Agent surface descriptor protocol;
- a plugin marketplace or runtime package installer;
- a universal workflow engine;
- publication of Unified's internal `@mobazha/core` package;
- migration of private product modules into the public frontend.

Agent-generated surfaces and lower-trust runtime UI require their own evidence
and security review. They must not expand this product-composition RFC by
implication.

## Security, privacy, and abuse analysis

Frontend composition never grants backend authority. The backend validates
every operation and remains authoritative for effective capabilities,
authorization, order state, payment state, and policy. The client may hide or
disable behavior but cannot use a product profile, build flag, route presence,
or bundled adapter as proof that an operation is allowed.

Private code is protected by artifact separation rather than obscurity or a
runtime flag. Public artifacts and diagnostics must not reveal private module
names, credentials, internal endpoints, or release configuration.

Restricted distributions enforce CSP and external-resource policy at both
configuration and browser boundaries. Branding and asset URLs are validated
against the active network policy. Authentication, tokens, private keys, API
secrets, and recovery material are never placed in product profiles or feature
descriptors.

This RFC does not allow runtime code injection. Any later proposal for remote
or Agent-provided surfaces requires a separate untrusted-data contract,
sanitized trusted renderers, bounded payloads, capability checks, explicit
confirmation for writes, anti-replay, audit, and a kill path.

## Economic and legal analysis

This RFC changes architecture and product composition, not fees, recipients,
licensing, or provider economics. A product profile does not establish feature
availability, endorsement, legal compliance, or a commercial entitlement.

Named private distributions retain their own licensing, delivery, support,
branding, and applicable legal obligations. Public documentation describes
neutral composition behavior without disclosing private implementation or
turning source presence into a release commitment.

## Alternatives

- One global product enum: rejected because deployment, experience, channel,
  authentication, capability, and code inclusion are independent axes.
- Product-name conditionals inside features: rejected because public features
  would acquire private identity knowledge and duplicate policy.
- Feature flags as the composition system: rejected because flags do not prove
  code presence, backend capability, authorization, health, or compatibility.
- Separate complete frontend forks for every product: rejected because shared
  commerce behavior would drift and fixes would require repeated migration.
- Put every private feature in the public frontend behind a flag: rejected
  because a disabled flag is not a source, artifact, or commercial boundary.
- Build a dynamic plugin platform now: rejected because current evidence is
  product composition across reviewed builds, not third-party runtime code.
- Make Commerce Kit the application shell: rejected because routing, providers,
  identity, branding, and runtime policy remain host responsibilities.

## Rollout and rollback

1. Inventory existing product and build-flag conditions and classify each by
   deployment, experience, auth, channel, network policy, capability,
   authorization, brand, or code-presence responsibility.
2. Document the supported profile matrix and invalid combinations without
   changing current runtime behavior.
3. Introduce a pure composition resolver around existing Runtime Config and
   feature descriptors, returning structured pending/ready/invalid diagnostics.
4. Move route, navigation, provider, and action projection onto the same
   resolved result one vertical slice at a time.
5. Validate Guest Checkout, marketplace handoff, and a private sovereign
   composition as the representative public/shared/private slices.
6. Add cross-product contract tests, packed-artifact builds, restricted-egress
   tests, and final embedded-binary smoke before freezing a public profile API.

Each migration remains reversible at the slice boundary. The existing route or
provider path stays available until its replacement passes the same product
matrix. A resolver regression rolls back to the prior compatible artifact; it
must not be bypassed with product-name branches. No rollback may expose a
capability absent from the authoritative backend snapshot.

## Documentation impact

- Keep this RFC as the public cross-repository composition proposal.
- Keep implementation-local package and Runtime Config details with Unified.
- Keep private product motivation, private modules, and release procedures in
  their owning repositories.
- Update frontend architecture and roadmap documents to distinguish deployment,
  experience, channel, capability, and code inclusion.
- Describe Commerce Kit as a public feature provider within product composition,
  not as the entire composition platform.
- Keep RFC status distinct from implementation and release evidence.

## Open questions

- Which existing product conditions should be the first mandatory migration to
  a single resolver?
- Which deployment/experience/channel combinations are explicitly supported,
  and which must fail composition?
- Does the first resolver need provider contributions, or can applications keep
  the provider graph static until a second implementation proves the contract?
- Which structured diagnostic fields are safe and useful across public and
  private distributions?
- When should profile and feature requirement schemas receive independent
  versions and compatibility windows?
- Should browser-extension application-source aliases remain an internal build
  technique or migrate to stable public packages after more slices are proven?

## Decision

Pending maintainer review. Until accepted, this RFC records the target model
and implementation plan. Current Runtime Config, application guards, package
contracts, tests, and released artifacts govern shipped behavior.
