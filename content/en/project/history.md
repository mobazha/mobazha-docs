---
title: History and supersession
summary: Preserve replaced public proposals and guidance without allowing historical text to masquerade as current behavior or policy.
status: Current
audiences:
  - Community
  - Contributors
  - Evaluators
  - Agents
evidenceLabel: Mobazha public history registry
evidenceUrl: https://github.com/mobazha/mobazha-docs/tree/main/history
reviewed: 2026-07-04
---

## Preservation rule

Historical material remains useful when it explains an old link, percentage, protocol idea, or product assumption. It must be moved or copied into a clearly historical location with its original date, former status, reason for replacement, and current authoritative successor.

## What must not happen

- Do not silently delete a widely cited public proposal when a supersession record can preserve context.
- Do not leave an obsolete percentage or capability claim in a current task page.
- Do not present a historical design as a supported API, payment method, fee, or governance rule.
- Do not use history storage to publish previously private material.

## Current registry

No superseded public artifact has been imported in the initial content registry. Candidates require source review and a safe public provenance check before publication.

## Public source-history invariants

- A publication repository has one reviewed public root and contains only publishable commits, trees, paths, messages, and blobs.
- Private provenance trailers, source-to-public commit maps, Git notes, replace refs, private refs, and private-only commits do not belong in public history.
- Attribution is carried by licenses, notices, and preserved publishable authorship.
- Repository scripts may verify topology and metadata hygiene without exposing private source lineage.
- Content safety, secrets, licenses, architecture boundaries, and tests remain separate gates.

- [History registry and template](https://github.com/mobazha/mobazha-docs/blob/main/history/README.md)
- [Current fees and economics](/project/fees) — Governs interpretation of old illustrative percentages.
- [Current runtime capabilities](/build/runtime-capabilities) — Governs interpretation of code and historical feature claims.
