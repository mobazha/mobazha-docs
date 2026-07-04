---
title: WebSocket events
summary: Use authenticated WebSocket events for timely UI updates, then reconcile important state through the authoritative HTTP API.
status: Beta
audiences:
  - Developers
  - Client maintainers
evidenceLabel: Mobazha WebSocket gateway and event registry
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/internal/api/ws.go
reviewed: 2026-07-04
---

## Current connection boundary

The default Node WebSocket endpoint is /ws. Deployments that route multiple nodes may also use a node-specific path. The gateway authenticates the connection before it joins the node event hub.

> **Important:** A complete versioned AsyncAPI-style event contract has not yet been published. Treat current event envelopes as release-candidate behavior and test against the exact Node and client versions you deploy.

## Client behavior

- Use the supported client authentication path and avoid tokens in URLs when a safer protocol or header mechanism is available.
- Reconnect with bounded backoff and assume a connection gap can lose transient events.
- Deduplicate persistent notifications and tolerate additive unknown event types.
- Treat an event as a signal to refresh protected state; do not settle, refund, or complete an order solely from an unverified push payload.
- Keep route capability and authorization checks even when an event announces a feature or action.

## Implementation evidence

- [WebSocket gateway](https://github.com/mobazha/mobazha/blob/main/internal/api/ws.go)
- [Event registry](https://github.com/mobazha/mobazha/blob/main/pkg/events/registry.go)
- [Shared client](https://github.com/mobazha/mobazha-unified)
