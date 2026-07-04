---
title: Webhook integration contract
summary: Design consumers for authentication, retries, duplication, reordering, and version change before depending on event delivery.
status: Beta
audiences:
  - Developers
  - Operators
evidenceLabel: Mobazha webhook engine and OpenAPI contract
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/pkg/webhook
reviewed: 2026-07-04
pageType: reference
lastTested: 2026-07-04
outcome: Authenticate, durably accept, deduplicate, and safely reconcile one webhook delivery.
estimatedTime: 15 minutes
journey: build
primaryAction:
  label: Implement delivery verification
  href: /build/webhooks#delivery-envelope-and-verification
---

## Consumer checklist

- Verify authenticity before parsing or acting on a payload.
- Use stable event identifiers for idempotency.
- Return success only after durable acceptance.
- Reconcile state through the authoritative API instead of treating delivery order as state order.
- Redact credentials and personal data from logs and dead-letter tooling.

## Current management surface

The Node OpenAPI contract includes webhook registration, update, deletion, test delivery, and delivery-history operations under /v1/webhooks. Event names and payload schemas remain version-dependent during the release-candidate period.

- [Webhook source](https://github.com/mobazha/mobazha/tree/main/pkg/webhook) — Signing, event, persistence, retry, and delivery contracts.
- [OpenAPI JSON](/openapi.json) — Find the current /v1/webhooks operations and schemas.

## Delivery envelope and verification

Current events use a CloudEvents 1.0 structured JSON envelope. Each delivery includes X-Webhook-ID, X-Webhook-Timestamp, and X-Webhook-Signature headers. The signature is HMAC-SHA256 over the delivery ID, Unix timestamp, and exact request body, with the sha256= prefix.

- Verify the signature using the endpoint secret and the unmodified raw body.
- Reject timestamps outside the current five-minute replay window.
- Use the CloudEvent ID and delivery ID as deduplication evidence; do not assume arrival order is business-state order.
- Return a 2xx response only after the event is durably accepted.

```javascript
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyMobazhaWebhook({ secret, webhookId, timestamp, signature, rawBody }) {
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const message = `${webhookId}.${timestamp}.${rawBody}`;
  const expected = `sha256=${createHmac('sha256', secret).update(message).digest('hex')}`;
  return expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
```

Use the exact raw request bytes. Parsing and re-serializing JSON before verification can change the signed body.

- [Signing implementation](https://github.com/mobazha/mobazha/blob/main/pkg/webhook/signer.go)
- [CloudEvent envelope](https://github.com/mobazha/mobazha/blob/main/pkg/webhook/events.go)

## Verification exercise

Register a non-production endpoint, trigger one test delivery, and preserve its
delivery ID. Confirm that a valid request is durably accepted once, the exact
same delivery is deduplicated, an altered body fails signature verification,
and a timestamp outside the replay window is rejected. Then reconcile the
referenced resource through the HTTP API instead of trusting event order.

## Standalone defaults

The current standalone defaults are five total delivery attempts, exponential backoff beginning at 30 seconds and capped at one hour, a 10-second request timeout, five-second polling, and seven-day completed-delivery retention. Deployments may override these values, so consumers must not infer a guaranteed retry schedule from the defaults.

> **Important:** Delivery is at least once in practice: duplicates and reordering are expected integration conditions, not exceptional bugs.

## Authentication, errors, and recovery

Webhook management operations require an accepted administrator, hosted, or scoped API-token identity. The receiver authenticates deliveries with the endpoint secret and signature headers.

- Return `2xx` only after durable acceptance; a transient failure should produce a retryable non-success response.
- Deduplicate before executing business effects.
- Reconcile order or payment state through the API after every important event.
- Inspect delivery history and dead-letter state before manually replaying.
- Rotate an exposed endpoint secret and reject signatures outside the replay window.
