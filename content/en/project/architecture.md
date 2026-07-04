---
title: Architecture and trust boundaries
summary: Mobazha separates user clients, independently operated backends, optional hosted services, and external payment or delivery systems.
status: Beta
audiences:
  - Operators
  - Developers
  - Evaluators
sourceLabel: Mobazha public repositories
sourceUrl: https://github.com/mobazha
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
- Project-wide public policy: reviewed documents in the public project repository.
- Explanatory guidance: this documentation site, with source and review metadata.
