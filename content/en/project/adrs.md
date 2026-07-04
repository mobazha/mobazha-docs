---
title: Architecture Decision Records
summary: Preserve why durable technical and product decisions were made, what alternatives were rejected, and what would supersede them.
status: Current
audiences:
  - Contributors
  - Maintainers
  - Architects
  - Agents
sourceLabel: Public Mobazha ADR registry
sourceUrl: https://github.com/mobazha/mobazha-docs/tree/main/adrs
reviewed: 2026-07-04
---

## What belongs in an ADR

- A long-lived architecture, authority, ownership, compatibility, or publication decision.
- A choice whose rationale would otherwise be rediscovered repeatedly.
- A decision that affects more than one module, repository, deployment type, or public contract.

Editorial changes, routine implementation details, and temporary experiments usually do not need an ADR.

## Current registry

- [ADR-0001: Markdown files are the documentation content authority](https://github.com/mobazha/mobazha-docs/blob/main/adrs/0001-markdown-content-authority.md) — Accepted; generated registries and discovery artifacts are derived outputs.
- [ADR template](https://github.com/mobazha/mobazha-docs/blob/main/adrs/0000-template.md)
- [Repository ADR guide](https://github.com/mobazha/mobazha-docs/blob/main/adrs/README.md)

## Reading an ADR safely

An accepted ADR explains an intended durable decision. It does not by itself activate a capability, migrate a deployment, or prove that every repository has completed the decision. Check implementation, conformance tests, release notes, and effective runtime capability where applicable.
