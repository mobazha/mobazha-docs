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

The framework-neutral resolver kernel is published through
`@mobazha/commerce-kit/composition`. It accepts a host-owned product profile,
readiness, supported-profile matrix, build-included feature catalog, and
capability and policy predicates. Unified adapts validated Runtime Config,
presentation channel, and storefront request context to that kernel. The
kernel returns `pending`, `ready`, or `invalid`, enabled and excluded feature
IDs, and structured diagnostics; applications still own routing, providers,
authorization, and final materialization.

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

Product actions are the second Commerce Kit dogfood slice. The shared
`CommerceProductActionButtons` contract owns stable `add-to-cart` and `buy-now`
identity, disabled state, callback wiring, and an optional host-rendering
adapter. Unified consumes it in desktop detail, mobile detail, and the
responsive bottom bar while retaining its own buttons, layout, localization,
inventory, payment, and asset policy.

Cart summary is the next dogfood slice. Shared summary content normalizes item
count, total, checkout-disabled state, checkout action, and optional host
rendering. Unified consumes it in the drawer, desktop seller-group footer,
multi-seller total, and mobile fixed bar while seller grouping, authentication
and registration routing, currency display, channel-native calls to action,
cart storage, and checkout navigation remain host-owned.

The current application projections still use resolved feature eligibility
only for routes and navigation. Entity-scoped product policy is not a global capability, and the
product-action and cart-summary APIs remain provisional until a second
independent application proves the same boundaries. Generic provider,
workflow, and action contribution,
browser-extension shell adoption, dynamic plugins, remote UI, and a universal
product manifest are not current public contracts.

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
- [Commerce Kit composition kernel](https://github.com/mobazha/mobazha-unified/blob/main/packages/commerce-kit/src/composition.ts)
- [Frontend product composition implementation](https://github.com/mobazha/mobazha-unified/blob/main/docs/architecture/FRONTEND_PRODUCT_COMPOSITION.md)
