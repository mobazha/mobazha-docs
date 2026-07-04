---
title: Webhook integration contract
summary: Design consumers for authentication, retries, duplication, reordering, and version change before depending on event delivery.
status: Beta
audiences:
  - Developers
  - Operators
sourceLabel: Mobazha webhook engine and OpenAPI contract
sourceUrl: https://github.com/mobazha/mobazha/tree/main/pkg/webhook
reviewed: 2026-07-04
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

- [Signing implementation](https://github.com/mobazha/mobazha/blob/main/pkg/webhook/signer.go)
- [CloudEvent envelope](https://github.com/mobazha/mobazha/blob/main/pkg/webhook/events.go)

## Standalone defaults

The current standalone defaults are five total delivery attempts, exponential backoff beginning at 30 seconds and capped at one hour, a 10-second request timeout, five-second polling, and seven-day completed-delivery retention. Deployments may override these values, so consumers must not infer a guaranteed retry schedule from the defaults.

> **Important:** Delivery is at least once in practice: duplicates and reordering are expected integration conditions, not exceptional bugs.
