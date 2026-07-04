# Mobazha Documentation

This repository builds the curated documentation surface intended for
`docs.mobazha.org`. It serves people and agents who use, operate, integrate,
evaluate, or contribute to Mobazha.

## Information model

- Governing facts stay in the repository that owns the product, policy, or
  interface.
- This site provides task-first navigation, reviewed explanations, and source
  links. It does not silently override an owning repository.
- Every page declares status, audience, source, and last-reviewed date.
- Drafts are visibly different from current policy and shipped behavior.
- Internal forecasts, credentials, customer data, incident details, and
  unapproved commercial experiments must not enter this repository.

See [`sources.json`](./sources.json) for the public-source allowlist and
[`public/docs-index.json`](./public/docs-index.json) for the machine-readable
publication index.

## Local development

```bash
npm ci
npm run dev
```

Production validation:

```bash
npm run lint
npm run build
```

## Publishing contract

The English pages are canonical in the first public phase. Translations must
identify their canonical source and review date. Public changes should update
the human page and machine-readable index in the same pull request.

## Cloudflare deployment

The site runs as a Cloudflare Worker because its vinext routes use server-side
rendering. It intentionally uses Workers Builds rather than a Pages static
output directory.

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
stored in this repository. After the first successful deployment, add
`docs.mobazha.org` under **Settings → Domains & Routes**.

Local authenticated deployment is also available with `npm run deploy`. Use
`npm run deploy:dry-run` to validate packaging without publishing.

Cloudflare deploys only after the build command succeeds. A push to `main`
updates production; a non-production branch uses the preview upload command.
For normal collaboration, open a pull request and let the merge commit trigger
production rather than pushing unreviewed content directly to `main`.
