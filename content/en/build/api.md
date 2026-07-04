---
title: HTTP API and OpenAPI
summary: Use the generated Mobazha Node OpenAPI contract as the operation and schema reference, then verify runtime capabilities before calling optional features.
status: Beta
audiences:
  - Developers
evidenceLabel: Generated Mobazha Node OpenAPI contract
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json
reviewed: 2026-07-04
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
