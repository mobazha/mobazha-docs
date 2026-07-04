---
title: Architecture Decision Records
summary: Preserve why durable technical and product decisions were made, what alternatives were rejected, and what would supersede them.
status: Current
audiences:
  - Contributors
  - Maintainers
  - Architects
  - Agents
evidenceLabel: Public Mobazha ADR registry
evidenceUrl: https://github.com/mobazha/mobazha-docs/tree/main/adrs
reviewed: 2026-07-04
pageType: hub
outcome: Find an accepted architectural decision and distinguish it from a proposal or repository-local implementation note.
estimatedTime: 5 minutes
journey: understand
primaryAction:
  label: Open the ADR registry
  href: /project/adrs#current-registry
---

## What belongs in an ADR

- A long-lived architecture, authority, ownership, compatibility, or publication decision.
- A choice whose rationale would otherwise be rediscovered repeatedly.
- A decision that affects more than one module, repository, deployment type, or public contract.

Editorial changes, routine implementation details, and temporary experiments usually do not need an ADR.

## Current registry

- [ADR-0001: Markdown files are the documentation content authority](https://github.com/mobazha/mobazha-docs/blob/main/adrs/0001-markdown-content-authority.md) — Accepted; generated registries and discovery artifacts are derived outputs.
- [ADR-0002: Mobazha Docs owns public knowledge](https://github.com/mobazha/mobazha-docs/blob/main/adrs/0002-public-knowledge-authority.md) — Accepted; public explanations live here while runtime facts and versioned contracts remain with their owners.
- [ADR template](https://github.com/mobazha/mobazha-docs/blob/main/adrs/0000-template.md)
- [Repository ADR guide](https://github.com/mobazha/mobazha-docs/blob/main/adrs/README.md)

## Repository-owned architecture decisions

Cross-repository indexes point to the repository that owns each decision. They do not copy or renumber the decision in this documentation repository.

- [Open Core ADR-018: Extension architecture](https://github.com/mobazha/mobazha/blob/main/docs/adr/018-open-core-extension-architecture.md) — Defines Ports, Modules, Functions, Controllers, Core authority, trust-dependent isolation, financial state-machine re-entry, and closed-by-default capabilities.
- [Open Core extension guide](/build/extensions) — Explains the decision, its current implementation boundary, and the Collectibles case for portal readers.

## Reading an ADR safely

An accepted ADR explains an intended durable decision. It does not by itself activate a capability, migrate a deployment, or prove that every repository has completed the decision. Check implementation, conformance tests, release notes, and effective runtime capability where applicable.
