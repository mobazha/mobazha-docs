---
title: Call your local Mobazha Node API in five minutes
summary: Discover runtime capabilities, use the declared authentication boundary, and make one read-only request against a local evaluation Node.
status: Beta
audiences:
  - Developers
  - Agent builders
evidenceLabel: Generated Node OpenAPI and runtime contract
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json
reviewed: 2026-07-06
pageType: task
lastTested: 2026-07-04
outcome: Confirm the Node you reached and complete one scoped, read-only API request.
estimatedTime: 5 minutes
journey: build
primaryAction:
  label: Run the first call
  href: /build/quickstart#first-call
---

## First call

With a local evaluation Node running and a scoped `MBZ_API_TOKEN` set in the environment, discover the runtime before calling a protected read-only endpoint.

The token is not a public signup key. A standalone administrator creates it through the supported Admin surface or token API, assigns only the scopes required by the integration, and stores the one-time secret outside source code. [Review token creation and revocation](/build/authentication) before running the protected call.

```bash
BASE_URL=http://127.0.0.1:5102

curl -fsS "$BASE_URL/v1/runtime-config" | jq

curl -fsS \
  -H "Authorization: Bearer $MBZ_API_TOKEN" \
  "$BASE_URL/v1/webhooks" | jq
```

## Before you start

- Run a v0.3 release-candidate Node on the default loopback listener.
- Install `curl` and `jq` and keep credentials in environment variables rather than shell history.
- Use a disposable test profile and the narrowest identity appropriate to the operation.
- Read the current OpenAPI security declaration; public runtime discovery does not make administrative routes public.

## First-call steps

1. Read the public runtime snapshot and record schema, deployment, readiness, and advertised capabilities.
2. Confirm the Node version and operation exist in the generated OpenAPI contract.
3. Choose standalone Basic Auth, hosted Bearer JWT, or a scoped `mbz_` API token as declared for that operation.
4. Call a read-only endpoint first and inspect both HTTP status and response envelope.
5. Remove credentials from terminal output, logs, screenshots, and support evidence.

## Expected result and verification

Runtime discovery should return a success envelope without requiring an administrative credential. The protected call should succeed only when the token is valid and has the required scope. Confirm the response belongs to the intended Node before building automation around it.

Also test one route outside the token's scope in a disposable environment. It should return `403`; if it succeeds, the credential is broader than the quickstart requires and should be replaced before automation is deployed.

## If something fails

- `401` indicates missing or invalid authentication; do not retry rapidly with guessed credentials.
- `403` indicates the resolved identity lacks the required permission or scope.
- `404` may mean wrong base URL, version, route, or unavailable composition; check OpenAPI and runtime capabilities.
- `409` usually requires state reconciliation before retry.
- `429` requires bounded backoff and respect for server guidance.
- A transport success with an application error still requires error handling.

## Continue

- [Authentication and scopes](/build/authentication)
- [Errors, retries, and idempotency](/build/errors-and-idempotency)
- [HTTP API and OpenAPI](/build/api)
