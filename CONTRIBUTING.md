# Contributing to Mobazha Documentation

Documentation changes are product changes when they affect capabilities,
operations, fees, policy, security, or agent behavior.

## Before proposing a change

1. Identify the repository that owns the fact.
2. Update the governing source first when behavior or policy changes.
3. Mark the page Current, Beta, Draft, Deprecated, or Historical.
4. Record the public source and review date.
5. Update `docs-index.json` and `sitemap.xml` with route changes.

Do not publish credentials, recovery material, customer or production data,
private incident details, internal forecasts, or unapproved commercial rates.

## Validate locally

```bash
npm ci
npm run check
npm audit --audit-level=low
npm run deploy:dry-run
```

## Pull requests

Use a focused branch and describe the governing source, audience, lifecycle
status, and user or agent impact. Policy and protocol changes need review in
their owning repository; this site must not silently create a competing rule.
