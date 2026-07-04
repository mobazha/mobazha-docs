---
title: Extend Mobazha through public contracts
summary: Choose the narrowest typed extension mechanism and preserve Core authority, capability gates, isolation, recovery, and audit.
status: Draft
audiences:
  - Extension developers
  - Architects
  - Security reviewers
sourceLabel: Mobazha Open Core extension contracts
sourceUrl: https://github.com/mobazha/mobazha/tree/main/docs/extensions
reviewed: 2026-07-04
---

## Choose the mechanism

- Port: replace an implementation that Core requires.
- Module: assemble reviewed capabilities into a distribution.
- Function: customize a bounded deterministic business decision.
- Controller: reconcile an external system or perform external I/O.
- OrderExtension: attach versioned domain data and lifecycle to an order.

## Non-negotiable boundaries

- Do not add a generic hook when a typed domain contract can express the need.
- Core retains release policy, order state, payment verification, settlement gates, audit, and key custody.
- Third-party code must not import internal packages, receive the Core object, or access raw signing material.
- Every public contract needs version negotiation, permissions, health, idempotency, recovery, rollback, and conformance tests.
- An extension capability remains unavailable until every activation gate passes.

## Start with the normative documents

- [Extension overview](https://github.com/mobazha/mobazha/blob/main/docs/extensions/README.md)
- [Capability and security model](https://github.com/mobazha/mobazha/blob/main/docs/extensions/CAPABILITY_AND_SECURITY_MODEL.md)
- [Module lifecycle](https://github.com/mobazha/mobazha/blob/main/docs/extensions/MODULE_LIFECYCLE.md)
- [Conformance](https://github.com/mobazha/mobazha/blob/main/docs/extensions/CONFORMANCE.md)
- [Payment plugin architecture](https://github.com/mobazha/mobazha/blob/main/docs/plugins/PAYMENT_PLUGIN_ARCHITECTURE.md)
