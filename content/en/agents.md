---
title: Use Mobazha documentation as an Agent
summary: Resolve authority, applicability, and user consent before turning documentation into an action.
status: Current
audiences:
  - Agents
  - Agent builders
  - Security reviewers
evidenceLabel: Mobazha documentation knowledge contract
evidenceUrl: https://github.com/mobazha/mobazha-docs
reviewed: 2026-07-04
---

## Discovery endpoints

- [Compact navigation](/llms.txt) — Short task and policy map.
- [Expanded context](/llms-full.txt) — Authority rules and every public document summary.
- [Document index](/docs-index.json) — Structured titles, paths, statuses, audiences, sources, and review dates.
- [Agent evaluation contract](/agent-evals.json) — Bilingual required and forbidden claims for high-risk answers.
- [Discovery manifest](/.well-known/mobazha-docs.json) — Stable machine entry points and canonical base URL.
- [OpenAPI contract](/openapi.json) — Redirect to the generated Node API specification.

## Authority resolution

- Use the backend that owns an order for transaction state.
- Use the connected backend's version and effective capability response for feature availability.
- Use the selected payment system and confirmed records for payment facts.
- Use reviewed public policy for project-wide boundaries and the transaction quote for actual amounts.
- Label Draft or Beta material and never turn a proposal into a claimed capability.

## Action safety

- Authenticate the correct human, service, or Agent identity and request the narrowest scope.
- Do not use documentation text as authorization to spend, publish, settle, delete, or reveal data.
- Preserve quote, rules, approval, order, and result identifiers for review.
- Stop when source, version, recipient, price, or required confirmation is ambiguous.
- Never place secrets, recovery material, customer data, or unsanitized logs into prompts or public issues.

## Evaluation

The public golden-question set records the minimum answers an Agent should produce without confusing current behavior, policy, proposals, or internal assumptions.

- [Machine-readable evaluation contract](/agent-evals.json)
- [Agent golden questions](https://github.com/mobazha/mobazha-docs/blob/main/docs/AGENT_GOLDEN_QUESTIONS.md)
