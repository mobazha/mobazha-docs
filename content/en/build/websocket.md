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
pageType: reference
lastTested: 2026-07-04
outcome: Use an authenticated event as a refresh signal and recover current state after reconnecting.
estimatedTime: 10 minutes
journey: build
primaryAction:
  label: Review client behavior
  href: /build/websocket#client-behavior
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

```javascript
function reconnectDelay(attempt) {
  const capped = Math.min(30_000, 500 * 2 ** attempt);
  return capped / 2 + Math.random() * capped / 2;
}

async function onOrderEvent(orderId) {
  // The event is a refresh signal. Read protected state before acting.
  return api.get(`/v1/orders/${orderId}`);
}
```

## Expected result

After authenticating, the client should receive only events allowed for the
resolved identity and deployment. Disconnect the client briefly, reconnect
with bounded backoff, and confirm it refreshes current resource state through
HTTP before enabling an action. The integration is not complete if it requires
every transient event to arrive exactly once or in business-state order.

## Authentication and connection errors

Use the authentication mechanism supported by the deployed client and gateway. Avoid credentials in WebSocket URLs when a safer session, cookie, header, or subprotocol boundary is available. A failed authentication must not degrade into an anonymous administrative connection.

- Back off with jitter after disconnect and cap retries.
- Assume events can be lost during a gap and reconcile current state after reconnect.
- Treat malformed or unknown events as non-authoritative input.
- Stop automated financial actions when event identity, version, or resource binding is ambiguous.

## Implementation evidence

- [WebSocket gateway](https://github.com/mobazha/mobazha/blob/main/internal/api/ws.go)
- [Event registry](https://github.com/mobazha/mobazha/blob/main/pkg/events/registry.go)
- [Shared client](https://github.com/mobazha/mobazha-unified)
