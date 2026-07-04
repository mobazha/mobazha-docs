# Phase DOCS: Mobazha Knowledge Surface

- Status: Waves 2–4 in progress
- Public surface: <https://docs.mobazha.org>
- Last reviewed: 2026-07-04

## Mission

Build one trusted, task-oriented knowledge product for buyers, sellers,
self-hosted operators, developers, contributors, evaluators, and software
Agents. A reader should be able to determine what Mobazha supports now, how to
use it safely, which costs apply, and which source governs an answer.

Success is measured by time-to-trusted-answer and task completion, not page
count.

## Product principles

1. Start from a reader's job, not the repository layout.
2. Keep one authority for each fact and link to its public owner.
3. Separate current behavior, Beta behavior, proposals, and history.
4. Give humans and Agents the same facts without requiring the same presentation hierarchy; machine indexes add structure, not authority.
5. Publish from an allowlist and exclude secrets, private operations, and unapproved commercial assumptions.
6. Test navigation, metadata, examples, generated contracts, and deployment as release artifacts.
7. Use implementation as evidence only after identifying the public contract and applicability.

## Workstreams

| Track | Outcome |
|---|---|
| DOCS-0 | Governance, authority, metadata, URL, and source contracts |
| DOCS-1 | Portal, navigation, search, SEO, accessibility, and deployment |
| DOCS-2 | Buyer, seller, product, and task-first help |
| DOCS-3 | Self-host installation, configuration, security, upgrade, and recovery |
| DOCS-4 | Runtime capabilities, OpenAPI, WebSocket, MCP, webhooks, and extensions |
| DOCS-5 | Architecture, whitepaper, economics, security, governance, and legal navigation |
| DOCS-6 | Agent indexes, examples, and golden-question evaluation |
| DOCS-7 | Localization, redirects, freshness, analytics, and contribution workflow |
| DOCS-8 | Human-first information architecture, page templates, product evidence, and task completion |

## Delivery waves

### Wave 0 — Governance and inventory: complete

- Established the public source allowlist and denied-content boundary.
- Defined Current, Beta, Draft, Deprecated, and Historical lifecycle semantics.
- Assigned runtime, transaction, policy, source repository, and documentation authorities.
- Reserved stable task URLs and machine-discovery endpoints.

### Wave 1 — Trusted portal: complete

- Published the independent documentation repository and Cloudflare Worker.
- Connected `docs.mobazha.org` and automatic production deployment from `main`.
- Added task navigation, source and review metadata, sitemap, search, and compatibility routes.
- Published `llms.txt`, `llms-full.txt`, `docs-index.json`, `sources.json`, and the well-known manifest.
- Added deterministic generation and stale-artifact validation.

### Wave 2 — User, operator, and developer depth: in progress

- Published task-level buyer journeys for checkout, anonymous order recovery,
  order status, cancellation, refunds, and disputes.
- Published task-level seller journeys for store setup, listings, shipping,
  payment readiness, and order handling.
- Expanded operator guidance across requirements, install, configuration,
  network and TLS boundaries, monitoring, backup, upgrade, and troubleshooting.
- Expanded the developer path from first API call through authentication,
  errors, retries, idempotency, WebSocket, MCP, and webhook verification.
- Added typed content blocks and page-specific quality gates so guides can use
  ordered steps, tables, repeated code examples, callouts, and verification
  without losing structure in Agent publications.
- Maintain a bilingual Open Core extension guide covering mechanism selection,
  Core authority, trust levels, capability gates, and proposal review.
- Publish an explicit current-versus-target matrix so static v1 behavior is not
  confused with planned allowlist, health, upgrade, third-party, or Wasm runtimes.
- Present Order Extension as a generic order-associated resource lifecycle
  contract and use Collectibles as its first worked provider without promoting
  NFT vocabulary into Core or claiming candidate resource providers are shipped.
- Maintain tested first-call examples and link the generated API specification without forking it.
- Connect repository READMEs and in-product Help entry points back to the portal.
- Unified Footer and Help & Support now route to canonical task pages; release
  notes in Node and Unified link the corresponding public guidance.

### Wave 2H — Human-first documentation experience: in progress

- Recorded the rendered-experience baseline, including navigation density,
  first-useful-content position, missing actions, and missing product evidence.
- Approved one canonical content source with distinct human and Agent projections.
- Replaced full-taxonomy navigation with global journey choices and role-scoped local navigation.
- Added page-type-aware human presentation, outcome, estimated-time, primary-action,
  local-TOC, section-anchor, and copyable-code foundations.
- Moved full trust metadata into progressive disclosure while preserving visible
  lifecycle and material applicability.
- Migrated `/`, `/start`, `/buy`, `/sell`, `/self-host`, and
  `/build/quickstart`; reviewed product visuals remain before the flagship exit gate.
- Govern real product screenshots, expected outputs, and conceptual diagrams as evidence.

The baseline and execution contract are maintained in
[`HUMAN_EXPERIENCE_AUDIT.md`](./HUMAN_EXPERIENCE_AUDIT.md) and
[`HUMAN_EXPERIENCE_IMPLEMENTATION_PLAN.md`](./HUMAN_EXPERIENCE_IMPLEMENTATION_PLAN.md).

### Wave 3 — Trust and project knowledge: in progress

- Review and version the Founding Whitepaper in English, then maintain a Chinese translation.
- Keep economics separate from current price lists and transaction quotes.
- Publish architecture, compatibility, security, governance, ADR, RFC, license, privacy, and release indexes.
- Add a visible history and supersession path for replaced proposals.
- Established public RFC, ADR, whitepaper-versioning, and history registries;
  RFC-0001 now tracks the whitepaper publication gates.
- Keep the Draft Composable Extension Platform RFC explicit about independent
  classification axes, Core authority, domain-specific contracts, and the
  current-versus-target boundary for multiple runtimes.

### Wave 4 — Agent and localization quality: in progress

- Published a bilingual machine-readable golden-question evaluation contract
  with required claims, forbidden claims, and authority paths.
- Published English and Chinese core journeys with per-page translation,
  canonical-source, lifecycle, and review metadata.
- Test code samples, internal links, public source links, and structured data continuously.
- Moved page authority from inline TypeScript into reviewable Markdown with
  deterministic generated registries and stale-output validation.
- Measure zero-result searches, repeated support questions, and stale-page reports.

### Wave 5 — Release-integrated maintenance: in progress

- Require affected documentation and compatibility notes in release checklists.
- Node and Unified tag workflows now require a versioned release note, live
  guidance, and an exact reviewed source revision before release creation.
- Record source commit or tag applicability for versioned pages. The public
  source manifest now records reviewed revisions and includes an explicit
  upstream contract check.
- Generate API reference from approved tagged specifications.
- Add freshness ownership, review reminders, redirects, and deprecation windows.
- Accepted ADR-0002 and promoted docs.mobazha.org from a routing surface to the canonical public knowledge authority.
- Migrated fees, compatibility, release maturity, public history, distribution, runtime-composition meaning, token identifiers, and public product outcomes out of duplicate repository prose.
- Keep implementation contracts, code-near design, and tagged release evidence in their owning repositories with machine-checked canonical links.

## Quality gates

- Every navigation target and machine endpoint exists and is internally consistent.
- Every page has a lifecycle state, audience, applicability, public source, and review date.
- Public API facts come from generated or versioned contracts.
- Commands and examples are tested where practical and identify release maturity.
- No public artifact includes credentials, private customer data, internal Hosting plans, or unapproved percentages.
- Fee answers distinguish software, infrastructure, networks, providers, optional services, referrals, and public-good funding.
- Capability answers fail closed when runtime authority or version applicability is missing.
- Security reports are routed privately.

## Current completion definition

Phase DOCS is not “done” when the initial pages exist. It reaches a sustainable
baseline when a new public release can update source contracts, task guidance,
machine indexes, translations, examples, and links through one reviewed and
tested workflow.
