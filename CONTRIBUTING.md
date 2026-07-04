# Contributing to Mobazha Documentation

Documentation changes are product changes when they affect capabilities,
operations, fees, policy, security, or agent behavior.

## Before proposing a change

1. Identify the fact type and its single authority: public knowledge, runtime state, versioned contract, release evidence, or implementation-local design.
2. Change project-wide public policy and explanation here; change runtime, contract, release, or implementation evidence in its owning system or repository.
3. Mark the page Current, Beta, Draft, Deprecated, or Historical.
4. Record implementation or policy evidence and the review date; the canonical docs URL is emitted as the page's public knowledge authority.
5. Run `npm run generate:content` after page or route changes; do not hand-edit generated publication files.

Public pages are Markdown files under `content/en/` or `content/zh-CN/`. Use a
stable task-oriented path, complete YAML frontmatter, level-two section
headings, ordinary paragraphs, bullet lists, fenced code blocks, and
`> **Important:**` notes. Markdown link bullets become the page's related-link
cards. The constrained syntax is intentional so people, Agents, search, and
generated indexes receive the same structure.

Use an RFC for an unresolved material protocol, policy, economic, security,
governance, or cross-repository proposal. Use an ADR to preserve a durable
decision and its consequences. Do not use either record as evidence that a
capability has shipped.

Do not publish credentials, recovery material, customer or production data,
private incident details, internal forecasts, or unapproved commercial rates.

## Validate locally

```bash
npm ci
npm run generate:content
npm run check
npm audit --audit-level=low
npm run deploy:dry-run
```

## Publishing workflow

Maintainers may currently commit and push reviewed documentation directly to
`main`. Community contributions can use a focused pull request and should
describe the authority class, evidence, audience, lifecycle status, and human
or Agent impact. Project-wide public policy changes here. Protocol and
implementation changes need review in their owning repository and must not
create a competing public explanation.
