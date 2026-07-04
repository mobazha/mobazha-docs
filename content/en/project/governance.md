---
title: Documentation and policy governance
summary: Important project claims need an owner, source, review date, status, and visible change path.
status: Draft
audiences:
  - Contributors
  - Maintainers
  - Agents
evidenceLabel: Mobazha public governance and documentation policy
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/GOVERNANCE.md
reviewed: 2026-07-04
---

## Change classes

- Editorial: clarifies wording without changing behavior or policy.
- Operational: changes installation, recovery, compatibility, or integration guidance.
- Policy: changes rights, responsibilities, fees, governance, privacy, or security expectations.
- Protocol: changes interoperable behavior, state transitions, or machine contracts.

## Review expectation

Project-wide public policy and explanation change in this repository. Operational and protocol implementations change in their owning repositories and must update affected documentation, machine-readable indexes, tests, contracts, and release notes. Neither layer silently overrides runtime state or a versioned interface contract.

## Documentation publication workflow

- Wave 0 inventories authorities, public sources, lifecycle states, and stable URLs.
- Wave 1 keeps the portal, compatibility routes, source mapping, link checks, and deployment healthy.
- Wave 2 turns implementation and public contracts into task-first user, operator, and developer guidance.
- Wave 3 publishes reviewed trust, security, economic, governance, ADR, RFC, and whitepaper material.
- Wave 4 evaluates Agent answers, adds maintained translations, and measures freshness and support outcomes.

- [Phase DOCS roadmap](https://github.com/mobazha/mobazha-docs/blob/main/docs/PHASE_DOCS_ROADMAP.md) — Public delivery waves, gates, and progress record.
- [Content governance](https://github.com/mobazha/mobazha-docs/blob/main/docs/CONTENT_GOVERNANCE.md) — Authority, source, lifecycle, and review rules.
