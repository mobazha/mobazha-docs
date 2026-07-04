---
title: Runtime capabilities and product composition
summary: Discover effective behavior from the connected backend and keep deployment, experience, capabilities, permissions, and experiments separate.
status: Beta
audiences:
  - Developers
  - Agent builders
  - Operators
evidenceLabel: Unified runtime configuration implementation
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/packages/core/config
reviewed: 2026-07-04
pageType: concept
outcome: Decide whether a feature is effectively available without confusing code presence, product profile, capability, permission, or readiness.
estimatedTime: 8 minutes
journey: build
primaryAction:
  label: Review effective availability
  href: /build/runtime-capabilities#effective-availability
---

## Effective availability

Every gate must pass before a capability is advertised and used. Recognition, source presence, UI code, or a configured name is descriptive only.

```text
distribution allowlist
  ∩ contract compatible
  ∩ installed or statically composed
  ∩ authorized
  ∩ configured
  ∩ healthy
```

## Runtime configuration roles

- The bootstrap shell owns deployment mode, product experience, authentication transport, brand, and initial external-resource policy.
- GET /v1/runtime-config supplies backend-owned feature and capability state.
- capabilitiesReady distinguishes an authoritative denial from a placeholder that has not loaded.
- Capabilities control availability, permissions control the current actor, and feature flags control experiments or kill switches.
- Clients may narrow availability for safety or session validity but must never widen the backend response.

## Product composition axes

- Authentication mode selects the authentication transport; it does not enable a product capability.
- Deployment describes hosted, standalone, or sovereign operation.
- Experience selects a platform, store, or marketplace shell.
- Capabilities describe backend-implemented product behavior.
- Permissions describe what the current actor may do.
- Feature flags describe experiments or kill switches and cannot replace authorization.

## Current frontend composition slice

The current Unified main branch implements a pure frontend feature resolver
over the validated Runtime Config, its readiness state, the presentation
channel, storefront request context, a supported-profile matrix, and the
features physically included in the build. It returns `pending`, `ready`, or
`invalid`, enabled and excluded feature IDs, and structured diagnostics.

The first resolved feature slices are:

- Guest Checkout, gated by the effective `commerce.checkout` capability;
- marketplace operator routes and navigation, limited to a supported hosted
  profile outside storefront request context;
- marketplace seller-review routes and navigation under the same composition
  boundary.

Pending capability state remains a loading state rather than an authoritative
denial. Unsupported profiles, duplicate feature IDs, absent capabilities,
restricted external resources, and features missing from the build fail
closed. Backend authorization remains authoritative after a route is visible.

This slice resolves feature eligibility for routes and navigation. Provider,
workflow, and action contributions, browser-extension shell adoption, dynamic
plugins, remote UI, and a universal product manifest are not current public
contracts.

A downstream sovereign distribution also validates its build-local catalog
against the complete runtime profile and backend capability snapshot. Local UI
policy can hide an included feature, but it cannot expose that feature when the
backend capability is absent. Distribution-local source and vocabulary remain
outside the public frontend.

## Fail-closed client behavior

- Do not render or call an optional feature until an authoritative capability snapshot is ready.
- Tolerate additive unknown fields but reject malformed or incompatible contract versions safely.
- Apply the same capability keys to navigation, route boundaries, action controls, and Agent tools.
- Keep server-side authorization even when the client hides unavailable controls.

- [Compatibility policy](/project/compatibility)
- [Unified runtime configuration code](https://github.com/mobazha/mobazha-unified/tree/main/packages/core/config)
- [Frontend product composition implementation](https://github.com/mobazha/mobazha-unified/blob/main/docs/architecture/FRONTEND_PRODUCT_COMPOSITION.md)
