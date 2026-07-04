---
title: Design the network and TLS boundary
summary: Keep Node administration private by default and expose only intentionally authenticated, encrypted, and monitored routes.
status: Beta
audiences:
  - Operators
  - Security reviewers
evidenceLabel: Node listener and API surfaces
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-04
pageType: concept
---

## Recommended boundary

```text
public client
  -> TLS reverse proxy or trusted private network
  -> authenticated allowed routes
  -> Node on loopback or a private interface
```

Do not expose the default administrative listener directly to the internet. A reverse proxy does not make an unauthenticated route safe; preserve Node authentication, request limits, body limits, timeouts, WebSocket upgrade handling, and security headers.

## Route considerations

| Surface | Default path | Boundary |
|---|---|---|
| Embedded UI and HTTP API | `http://127.0.0.1:5102`, API under `/v1/` | Administrative and commerce authorization vary by operation |
| WebSocket | `/ws` | Authenticate connection and preserve reconnect limits |
| MCP Streamable HTTP | `/v1/mcp` | Requires gateway identity, `ai:use`, and tool scopes |
| Webhooks | outbound from Node | Validate destination, TLS, signature, timeout, and retry behavior |

## Exposure checklist

- Terminate TLS with a maintained configuration and automate certificate renewal safely.
- Bind Node to loopback or a private interface and restrict host firewall ingress.
- Forward the original scheme and host only through trusted proxy headers.
- Apply rate, connection, request-size, and timeout limits without breaking WebSocket or MCP streaming.
- Separate public storefront access from administrator, token-minting, wallet, and system operations.
- Monitor authentication failures and unexpected route exposure.

## Verification

From outside the trusted boundary, enumerate only the intended public routes and confirm administrative operations reject unauthenticated requests. From inside, verify UI, API, WebSocket, and MCP paths required by the deployment. Re-test after proxy or certificate changes.
