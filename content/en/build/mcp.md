---
title: MCP and agent integrations
summary: Agents can discover and invoke permitted commerce capabilities, but cannot replace user consent, policy, or backend authorization.
status: Beta
audiences:
  - Agent builders
  - Security reviewers
evidenceLabel: Mobazha agent-capability sources
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/pkg/mcp
reviewed: 2026-07-04
pageType: reference
lastTested: 2026-07-04
outcome: Initialize an authenticated MCP session and discover only the tools permitted for its resolved scopes.
estimatedTime: 10 minutes
journey: build
primaryAction:
  label: Initialize the transport
  href: /build/mcp#initialize-the-transport
---

## Current transport

Mobazha Node exposes MCP over Streamable HTTP at /v1/mcp. GET and POST share this endpoint. Treat discovery, authentication, scopes, tool availability, and errors as properties of the connected Node version—not of this prose page.

## Current authentication and scope contract

- Every /v1/mcp request first passes the Node gateway authentication boundary.
- The Streamable HTTP front door resolves the caller identity and requires the ai:use scope.
- Administrator identities receive the applicable administrative scope set; API tokens must be minted with ai:use explicitly.
- Individual tools also require their domain scopes, such as listings:read, orders:manage, wallet:read, or chat:write.
- A tool missing its required scope must remain unavailable or return permission denied; MCP does not bypass the underlying HTTP authorization.

- [MCP scope guard](https://github.com/mobazha/mobazha/blob/main/pkg/mcp/scope_guard.go)
- [Tool scope mapping](https://github.com/mobazha/mobazha/blob/main/pkg/mcp/auth.go)

## Initialize the transport

Use an MCP SDK that supports Streamable HTTP and preserve the session information returned by the server. The initial request is standard JSON-RPC over the authenticated `/v1/mcp` endpoint.

```bash
curl -i -sS http://127.0.0.1:5102/v1/mcp \
  -H "Authorization: Bearer $MBZ_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"example","version":"0.1.0"}}}'
```

After initialization, complete the SDK's initialized notification, list available tools, and call only a tool returned for the current identity and scope set.

## Expected result

Initialization should return an MCP session compatible with the requested
protocol version. Tool discovery should expose only tools permitted by
`ai:use`, the resolved identity, domain scopes, runtime capabilities, and the
connected Node version. Repeat discovery with a narrower disposable token and
confirm protected tools disappear or reject access rather than relying on
prompt instructions to constrain them.

## Non-bypassable boundaries

- Authenticate the human, service, or agent identity appropriate to the action.
- Request the narrowest scopes and make spend or settlement authority explicit.
- Require confirmation where the backend or policy requires it.
- Do not let prompt text override order state, quote terms, recipient amounts, or authorization checks.
- Keep auditable request, approval, and result identifiers without logging secrets.

## Audit and errors

The standalone server records structured MCP tool audit events with the tool name, result, duration, transport, resolved identity when available, and redacted arguments. Bridge errors preserve the API error boundary, including authentication, permission, conflict, rate-limit, and server failures.

> **Important:** Audit visibility supports review; it does not make a broad token safe. Create narrow, revocable tokens and keep secrets out of prompts and logs.

## Failure handling and compatibility

- Authentication and permission errors require credential or scope correction, not prompt retries.
- A tool conflict requires re-reading underlying order or resource state.
- Rate limits and transient server failures require bounded backoff.
- Unknown tool or schema versions require rediscovery; do not call a cached tool definition blindly.
- A successful tool response does not replace user confirmation, payment evidence, or backend-owned state.
