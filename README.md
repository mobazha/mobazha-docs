# Mobazha Documentation

This repository builds the curated documentation surface intended for
`docs.mobazha.org`. It serves people and agents who use, operate, integrate,
evaluate, or contribute to Mobazha.

## Information model

- This repository is the canonical public knowledge surface for product
  meaning, user guidance, project-wide policy, economics, governance,
  cross-repository architecture explanations, and public decisions.
- Runtime state, generated contracts, tagged releases, and implementation-local
  design remain with the systems and repositories that produce them.
- Every page identifies its canonical knowledge authority separately from the
  implementation, policy, release, or service evidence supporting it.
- Every page declares status, audience, source, and last-reviewed date.
- Drafts are visibly different from current policy and shipped behavior.
- Internal forecasts, credentials, customer data, incident details, and
  unapproved commercial experiments must not enter this repository.

See [`sources.json`](./sources.json) for the public-source allowlist and
[`public/docs-index.json`](./public/docs-index.json) for the machine-readable
publication index.

The public delivery sequence and quality gates are tracked in
[`docs/PHASE_DOCS_ROADMAP.md`](./docs/PHASE_DOCS_ROADMAP.md). Authority,
lifecycle, and review rules live in
[`docs/CONTENT_GOVERNANCE.md`](./docs/CONTENT_GOVERNANCE.md).
Page-type templates, supported Markdown blocks, and the definition of ready
live in [`docs/CONTENT_PATTERNS.md`](./docs/CONTENT_PATTERNS.md).

## Local development

```bash
npm ci
npm run dev
```

Production validation:

```bash
npm run generate:content
npm run lint
npm run build
```

Markdown under `content/<language>/` owns page content and YAML frontmatter.
The path beneath the language directory defines the public URL; for example,
`content/en/self-host/install.md` publishes `/self-host/install`, while
`content/zh-CN/self-host/install.md` publishes `/zh/self-host/install`.

`content/navigation.json` owns navigation. `app/lib/generated-docs.json` and
all files under `public/` that are produced by the publication scripts are
generated artifacts and must not be edited independently. `npm run
generate:content` refreshes the application registry, document index, sitemap,
Agent context, source manifest, and well-known discovery file. `npm run check`
fails when committed output is stale.

Public proposals live under `rfcs/`, durable decisions under `adrs/`, replaced
public material under `history/`, and the whitepaper maintenance contract under
`whitepaper/`.

ADR-0002 defines the authority boundary. Do not copy public policy into a code
repository. Keep a non-normative moved notice only when an existing GitHub path
needs a compatibility window.

## Language and publishing contract

English is the policy-authoring language in the first public phase. The core
Chinese task and trust paths live under `/zh/`; each identifies its English
canonical page, shares lifecycle status, and carries its own review date. A
translation never creates a separate policy authority. Public changes update
human pages and generated machine-readable indexes in the same commit.

`agent-evals.json` is the machine-readable answer-safety contract behind the
human golden-question set. `sources.json` records the last reviewed public
source revision when one exists. `npm run check:source-contracts` reports
upstream branch drift without requiring a hash-only documentation commit and
still verifies the critical Node API contract. Use
`npm run check:source-contracts:strict` when an explicit source review or
release gate requires every recorded revision to match the current branch.

## Cloudflare deployment

The site runs as a Cloudflare Worker because its vinext routes use server-side
rendering. It intentionally uses Workers Builds rather than a Pages static
output directory.

Production is available at <https://docs.mobazha.org>; the underlying Worker is
<https://mobazha-docs.526567244.workers.dev>.

Connect `mobazha/mobazha-docs` from Cloudflare **Workers & Pages → Create →
Import a repository** and use:

| Setting | Value |
|---|---|
| Worker name | `mobazha-docs` |
| Production branch | `main` |
| Build command | `npm run check` |
| Deploy command | `npm run deploy:built` |
| Preview deploy command | `npm run deploy:preview:built` |
| Root directory | `/` |

The Worker name must match `wrangler.jsonc`. Cloudflare creates and retains the
build credential when the Git repository is connected; no Cloudflare token is
stored in this repository. The `docs.mobazha.org` custom domain is managed from
the Worker's **Domains** tab.

Local authenticated deployment is also available with `npm run deploy`. Use
`npm run deploy:dry-run` to validate packaging without publishing.

Cloudflare deploys only after the build command succeeds. A push to `main`
updates production. Maintainers may currently commit and push reviewed changes
directly to `main`; pull requests remain available for community contributions
or changes that benefit from wider review, but are not a deployment requirement.
Non-production branch previews are currently disabled and can be enabled later
without changing the production contract.
