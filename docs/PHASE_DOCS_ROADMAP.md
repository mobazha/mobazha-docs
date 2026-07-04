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
4. Give humans and Agents the same facts; machine indexes add structure, not authority.
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

- Expand hosted-versus-self-hosted selection, seller, buyer, and support journeys.
- Maintain executable installation, configuration, backup, security, and troubleshooting guidance.
- Curate runtime capabilities, OpenAPI, WebSocket, MCP, webhook, and extension guidance from public contracts and code.
- Add tested first-call examples and link the generated API specification without forking it.
- Connect repository READMEs and in-product Help entry points back to the portal.

### Wave 3 — Trust and project knowledge: in progress

- Review and version the Founding Whitepaper in English, then maintain a Chinese translation.
- Keep economics separate from current price lists and transaction quotes.
- Publish architecture, compatibility, security, governance, ADR, RFC, license, privacy, and release indexes.
- Add a visible history and supersession path for replaced proposals.

### Wave 4 — Agent and localization quality: in progress

- Published a bilingual machine-readable golden-question evaluation contract
  with required claims, forbidden claims, and authority paths.
- Published English and Chinese core journeys with per-page translation,
  canonical-source, lifecycle, and review metadata.
- Test code samples, internal links, public source links, and structured data continuously.
- Measure zero-result searches, repeated support questions, and stale-page reports.

### Wave 5 — Release-integrated maintenance: in progress

- Require affected documentation and compatibility notes in release checklists.
- Record source commit or tag applicability for versioned pages. The public
  source manifest now records reviewed revisions and includes an explicit
  upstream contract check.
- Generate API reference from approved tagged specifications.
- Add freshness ownership, review reminders, redirects, and deprecation windows.

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
