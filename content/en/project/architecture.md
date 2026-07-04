---
title: Architecture and trust boundaries
summary: Mobazha separates user clients, independently operated backends, optional hosted services, and external payment or delivery systems.
status: Beta
audiences:
  - Operators
  - Developers
  - Evaluators
evidenceLabel: Mobazha public repositories
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-04
---

## Core boundary

A client connects to a backend chosen by the user or operator. That backend controls its data, enabled capabilities, integrations, and policies. Optional hosted services are separate dependencies and should be disclosed as such.

## Open Core composition boundary

Open Core owns order, payment, refund, dispute, settlement, key-custody, and audit state machines. Optional products and integrations compose through public typed contracts instead of adding product vocabulary, arbitrary hooks, database access, or a complete Core service locator.

- Ports replace narrow Core-required implementations.
- Modules assemble reviewed capabilities before the Node starts serving traffic.
- Functions customize deterministic decisions without I/O or mutation authority.
- Controllers reconcile external systems and report observations or attestations.
- Every financial change returns through a validated Core command and state machine.
- Effective capabilities remain closed until distribution, compatibility, composition, authorization, configuration, and health gates all pass.

- [Open Core extension guide](/build/extensions) — Mechanism selection, authority flow, trust levels, current implementation, and Collectibles as the first case.

## Authority order

- Transaction state: the backend that owns the order.
- Available runtime features: that backend's advertised capabilities.
- Payment facts: the selected payment system and confirmed transaction records.
- Project-wide public policy and public explanation: the canonical page on docs.mobazha.org.
- Exact interfaces and released behavior: versioned contracts, conformance tests, and tagged release evidence in their owning repositories.
- Transaction-specific amounts and recipients: the quote accepted for that order within public policy.

Evidence links support a public explanation but do not create a second policy authority. Documentation cannot activate a capability or override runtime and contract facts.
