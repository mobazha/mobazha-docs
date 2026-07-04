---
title: Build on advertised capabilities
summary: Integrations should discover what a backend supports instead of assuming every Mobazha deployment exposes the same surface.
status: Beta
audiences:
  - Developers
  - Agent builders
evidenceLabel: Mobazha public source organization
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-04
pageType: hub
---

## Integration rule

Use the connected backend's capability response and version information as runtime truth. Documentation describes interfaces and intent, but a client must handle unavailable, disabled, or differently versioned features.

## Surfaces

- HTTP and WebSocket interfaces for commerce operations and live updates.
- Webhooks for operator-controlled event delivery.
- MCP and agent-oriented interfaces with explicit identity and authorization boundaries.
- Plugins and contracts only where the connected deployment advertises them.

> **Important:** The current Node entry points are HTTP under /v1/, WebSocket under /ws, and MCP Streamable HTTP under /v1/mcp. Exact operations remain version- and capability-dependent.

## Start building

- [First authenticated API call](/build/quickstart) — Discover capabilities and call a protected read.
- [Authentication and scopes](/build/authentication) — Select Basic, hosted JWT, or scoped API token.
- [Errors, retries, and idempotency](/build/errors-and-idempotency) — Preserve business correctness across unknown outcomes.
- [HTTP API and OpenAPI](/build/api) — Use the generated operation and schema contract.
- [Webhooks](/build/webhooks) — Verify signatures, deduplicate, and reconcile.
- [WebSocket](/build/websocket) — Treat events as refresh signals.
- [MCP and agents](/build/mcp) — Initialize a scoped Streamable HTTP client.
