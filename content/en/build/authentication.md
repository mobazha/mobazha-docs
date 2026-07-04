---
title: Authentication, identities, and scopes
summary: Select the identity and credential model declared by the connected deployment and grant only the scopes required for one integration.
status: Beta
audiences:
  - Developers
  - Operators
  - Agent builders
evidenceLabel: OpenAPI security schemes and Node auth token API
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json
reviewed: 2026-07-04
pageType: reference
lastTested: 2026-07-04
---

## Authentication models

| Credential | Intended boundary | Transport |
|---|---|---|
| Standalone administrator | Local operator administration | HTTP Basic over a trusted TLS or loopback boundary |
| Hosted identity | Hosted user or service identity | Bearer JWT issued by the hosted authentication flow |
| Scoped standalone token | Automation against a standalone Node | Bearer token with `mbz_` prefix and explicit scopes |

The operation's OpenAPI `security` declaration is authoritative for accepted credential types. A token accepted by one route is not permission for every route.

## Scoped API tokens

Minting and listing local API tokens requires an administrator identity. Use the supported Admin surface or `/v1/auth/tokens`, record purpose and owner, show the secret only through the supported creation response, and store it in a secret manager.

```bash
BASE_URL=http://127.0.0.1:5102

curl -fsS \
  -u "$MBZ_ADMIN_USER:$MBZ_ADMIN_PASSWORD" \
  "$BASE_URL/v1/auth/tokens" | jq

curl -fsS \
  -H "Authorization: Bearer $MBZ_API_TOKEN" \
  "$BASE_URL/v1/webhooks" | jq
```

## Authorization and scope rules

- Grant read scopes separately from create, manage, spend, settlement, or administrative scopes.
- MCP requires `ai:use` at the transport boundary and each tool's domain scope.
- Keep buyer-anonymous Guest Checkout requests free of seller or administrator credentials.
- Resolve the current role and store context explicitly in multi-store or hosted deployments.
- Rotate and revoke tokens after exposure, role change, integration retirement, or unexplained use.

## Errors and safe handling

- Treat `401` as an authentication failure and `403` as an authorization failure; do not collapse them into retry loops.
- Never put tokens in URL query strings, documentation examples, browser storage outside the product contract, or support reports.
- Redact authorization headers and token-creation responses from logs.
- If a broad token was exposed, revoke it before investigating downstream use.

## Compatibility

Pin automation to a tested Node version and re-read OpenAPI security and scope requirements during upgrades. A frontend login cookie, old Basic credential, or internal hosted token is not automatically a supported public integration credential.
