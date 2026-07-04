---
title: HTTP API and OpenAPI
summary: Use the generated Mobazha Node OpenAPI contract as the operation and schema reference, then verify runtime capabilities before calling optional features.
status: Beta
audiences:
  - Developers
evidenceLabel: Generated Mobazha Node OpenAPI contract
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json
reviewed: 2026-07-04
pageType: reference
lastTested: 2026-07-04
outcome: Identify the current Node contract and confirm a capability before building against its versioned route.
estimatedTime: 7 minutes
journey: build
primaryAction:
  label: Run the capability call
  href: /build/api#first-capability-call
---

## Contract and entry points

Mobazha Node exposes versioned HTTP routes under /v1/ and WebSocket connections under /ws. The generated OpenAPI document describes request methods, paths, schemas, response envelopes, and declared authentication mechanisms for the current main branch.

The specification is a release-candidate contract, not proof that every optional operation is enabled by a particular backend. Read /v1/runtime-config and capability endpoints before exposing optional UI or automation.

- [OpenAPI JSON](/openapi.json) — Canonical redirect to the generated specification in mobazha/mobazha.
- [API source and generator](https://github.com/mobazha/mobazha/tree/main/api-spec) — Inspect the generated artifact and its owning repository.

## First capability call

A local Node publishes its frontend runtime snapshot without requiring an authenticated business operation. Use it to verify schema version, deployment composition, readiness, features, and capabilities before constructing optional UI or automation.

```text
curl -sS http://127.0.0.1:5102/v1/runtime-config | jq
```

> **Important:** The example assumes the default local listener. Do not disable authentication or expose an administrative listener merely to make an example work.

## Expected result

The runtime call should return a successful JSON envelope describing the Node
schema, deployment composition, readiness, and effective capabilities. Record
the Node version and capability you intend to use. A missing or unavailable
capability is a decision to stop or degrade the integration—not a reason to
enable a frontend-only switch.

A default standalone store currently returns this representative projection
when the response is narrowed to the composition fields. Capability and
feature values vary by the connected Node and remain authoritative.

```bash
curl -fsS http://127.0.0.1:5102/v1/runtime-config |
  jq '.data | {schemaVersion, authMode, deployment, experience, capabilitiesReady}'
```

```json
{
  "schemaVersion": 3,
  "authMode": "standalone",
  "deployment": {
    "mode": "standalone",
    "allowExternalResources": true
  },
  "experience": {
    "kind": "store"
  },
  "capabilitiesReady": true
}
```

## Authentication choices

- HTTP Basic authentication is available for the standalone administrator boundary.
- Bearer JWTs represent hosted identities where the deployment supports them.
- Scoped mbz_ API tokens are the preferred automation credential for supported standalone integrations.
- Choose the narrowest credential and scope set, store it outside source code, and rotate or revoke it after exposure.

## Client requirements

- Choose the authentication mechanism required by the connected deployment; do not copy credentials into URLs or logs.
- Treat non-success responses and stable error codes as part of the state machine, not only as transport failures.
- Use idempotency and reconciliation for operations that may be retried or have financial effects.
- Pin integrations to a tested Node version and re-run contract tests before upgrades.
- Never infer support from an endpoint appearing in source or OpenAPI when the effective capability is absent.

## Request and response workflow

```bash
BASE_URL=http://127.0.0.1:5102
curl -fsS "$BASE_URL/v1/runtime-config" | jq
curl -fsS -H "Authorization: Bearer $MBZ_API_TOKEN" "$BASE_URL/v1/webhooks" | jq
```

Inspect HTTP status before consuming the success envelope. Exact inner response schemas belong to the generated OpenAPI contract. Keep base URL, Node version, credential type, and expected capability explicit in client configuration.

## Errors, retries, and compatibility

- Handle `401`, `403`, `404`, `409`, `429`, and `5xx` as distinct classes.
- Reconcile authoritative state after a timeout on an order, payment, refund, or settlement operation.
- Do not retry a financial mutation unless the endpoint contract provides idempotency or reconciliation.
- Test generated clients and hand-written integrations against the exact release tag before upgrades.

- [Authentication and scopes](/build/authentication)
- [Errors, retries, and idempotency](/build/errors-and-idempotency)
