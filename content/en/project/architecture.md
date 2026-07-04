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

## Authority order

- Transaction state: the backend that owns the order.
- Available runtime features: that backend's advertised capabilities.
- Payment facts: the selected payment system and confirmed transaction records.
- Project-wide public policy: reviewed documents in the public project repository.
- Explanatory guidance: this documentation site, with source and review metadata.
