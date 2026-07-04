---
title: Errors, retries, and idempotency
summary: Preserve business correctness across transport failures, duplicate delivery, conflicts, timeouts, and unknown outcomes.
status: Beta
audiences:
  - Developers
  - Agent builders
evidenceLabel: Node API error contracts and state-machine implementation
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json
reviewed: 2026-07-04
pageType: reference
lastTested: 2026-07-04
outcome: Decide whether to stop, correct, reconcile, or retry without duplicating a protected business action.
estimatedTime: 8 minutes
journey: build
primaryAction:
  label: Review the retry decision
  href: /build/errors-and-idempotency#retry-decision
---

## Error classes

| Status | Interpretation | Default response |
|---|---|---|
| `400` | Request is invalid for the declared contract | Correct the request; do not blind retry |
| `401` | Authentication is missing or invalid | Refresh or replace the intended credential |
| `403` | Identity lacks permission or scope | Stop and request narrower authorized access |
| `404` | Resource, route, or deployment surface is absent | Verify identity, version, path, and capability |
| `409` | Current state conflicts with the attempted transition | Reload authoritative state before deciding |
| `429` | Rate boundary was exceeded | Back off and honor server guidance |
| `5xx` | Server or dependency failed | Retry only when the operation is safe and reconcilable |

Read the structured error response and stable code where the contract defines one. Do not parse human messages as machine state.

## Retry decision

```text
request outcome known success -> record result
request outcome known rejection -> correct or stop
request outcome unknown -> reconcile authoritative state
safe idempotent read -> bounded retry with jitter
financial or state transition -> retry only with contract-supported idempotency
```

## Idempotency and reconciliation

- Assign a stable client operation identity when the endpoint supports it.
- Persist request intent before sending a financial or order transition.
- On timeout, read the order, payment, webhook delivery, or action status before resubmitting.
- Deduplicate webhooks by delivery and event identity.
- Treat WebSocket events as refresh signals rather than commands.
- Keep retry budgets finite and surface unknown outcomes for review.

```javascript
async function reconcileBeforeRetry(orderId) {
  const order = await api.get(`/v1/orders/${orderId}`);
  if (order.state !== 'AWAITING_ACTION') return order;
  throw new Error('State still requires an explicitly idempotent retry');
}
```

## Authentication and information safety

Error logs may include route, status, stable error code, correlation identifier, and sanitized resource identity. They must not include Bearer tokens, Basic credentials, seeds, private keys, customer payloads, or unredacted webhook secrets.

## Compatibility

Re-run negative, timeout, duplicate, and conflict tests against every supported Node version. A successful happy path does not establish retry safety.
