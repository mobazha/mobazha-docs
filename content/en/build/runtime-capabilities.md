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

## Fail-closed client behavior

- Do not render or call an optional feature until an authoritative capability snapshot is ready.
- Tolerate additive unknown fields but reject malformed or incompatible contract versions safely.
- Apply the same capability keys to navigation, route boundaries, action controls, and Agent tools.
- Keep server-side authorization even when the client hides unavailable controls.

- [Compatibility policy](/project/compatibility)
- [Unified runtime configuration code](https://github.com/mobazha/mobazha-unified/tree/main/packages/core/config)
