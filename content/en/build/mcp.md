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

## Non-bypassable boundaries

- Authenticate the human, service, or agent identity appropriate to the action.
- Request the narrowest scopes and make spend or settlement authority explicit.
- Require confirmation where the backend or policy requires it.
- Do not let prompt text override order state, quote terms, recipient amounts, or authorization checks.
- Keep auditable request, approval, and result identifiers without logging secrets.

## Audit and errors

The standalone server records structured MCP tool audit events with the tool name, result, duration, transport, resolved identity when available, and redacted arguments. Bridge errors preserve the API error boundary, including authentication, permission, conflict, rate-limit, and server failures.

> **Important:** Audit visibility supports review; it does not make a broad token safe. Create narrow, revocable tokens and keep secrets out of prompts and logs.
