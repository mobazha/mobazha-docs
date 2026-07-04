---
title: Public decisions and proposals
summary: Use RFCs for changes still being evaluated, ADRs for decisions already made, and history records for superseded public material.
status: Current
audiences:
  - Contributors
  - Maintainers
  - Agents
  - Evaluators
sourceLabel: Mobazha documentation decision process
sourceUrl: https://github.com/mobazha/mobazha-docs/blob/main/docs/CONTENT_GOVERNANCE.md
reviewed: 2026-07-04
---

## Choose the right record

- RFC: a substantial public proposal that still needs review, evidence, or a decision.
- ADR: a durable architecture or product decision, including context, alternatives, consequences, and supersession.
- History record: a replaced or withdrawn public statement retained so old links and discussions remain interpretable.
- Task documentation: instructions and explanations derived from current authorities; it is not a substitute for a decision record.

## Lifecycle rules

- A Draft or Review RFC is not shipped behavior.
- An Accepted RFC authorizes implementation work but does not prove implementation or release.
- An ADR records a decision; runtime behavior still requires implementation, tests, capability gates, and release evidence.
- A superseded record remains readable and links to its replacement.
- Security-sensitive details, credentials, private operations, customer data, forecasts, and unapproved commercial assumptions do not enter public records.

## Start or inspect a record

- [RFC index](/project/rfcs) — Proposals, review state, and the RFC template.
- [ADR index](/project/adrs) — Accepted decisions and the ADR template.
- [History and supersession](/project/history) — Rules for preserving replaced public material.
- [Documentation governance](/project/governance) — Change classes, ownership, and publication workflow.

> **Important:** A record's status must remain explicit. Agents and readers must not infer availability from a proposal, an accepted design, or code presence alone.
