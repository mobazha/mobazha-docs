---
title: Build on advertised capabilities
summary: Integrations should discover what a backend supports instead of assuming every Mobazha deployment exposes the same surface.
status: Beta
audiences:
  - Developers
  - Agent builders
sourceLabel: Mobazha public source organization
sourceUrl: https://github.com/mobazha
reviewed: 2026-07-04
---

## Integration rule

Use the connected backend's capability response and version information as runtime truth. Documentation describes interfaces and intent, but a client must handle unavailable, disabled, or differently versioned features.

## Surfaces

- HTTP and WebSocket interfaces for commerce operations and live updates.
- Webhooks for operator-controlled event delivery.
- MCP and agent-oriented interfaces with explicit identity and authorization boundaries.
- Plugins and contracts only where the connected deployment advertises them.

> **Important:** The current Node entry points are HTTP under /v1/, WebSocket under /ws, and MCP Streamable HTTP under /v1/mcp. Exact operations remain version- and capability-dependent.
