# Mobazha Documentation Governance

- Status: Current
- Last reviewed: 2026-07-04

## Authority order

Use the narrowest applicable authority:

1. The backend that owns an order governs its transaction state.
2. The connected backend's version and effective capabilities govern runtime availability.
3. The selected payment system and confirmed records govern payment facts.
4. A transaction quote governs disclosed amounts for that transaction within public policy.
5. Reviewed public policy governs project-wide boundaries.
6. Tagged release documents and generated contracts govern a released version.
7. Draft ADRs, RFCs, and whitepapers describe proposals or direction.
8. This portal explains and routes readers to those authorities.

Documentation never activates a capability, authorizes an action, changes an
order, or silently overrides its owning repository.

## Public source policy

The machine-readable allowlist is [`sources.json`](../sources.json). A source
must be anonymously readable, owned by the Mobazha project or explicitly
approved, and suitable for the fact being published.

Never publish:

- credentials, recovery material, private endpoints, or signing information;
- customer, production, incident, or unsanitized log data;
- private Hosting plans, operating playbooks, forecasts, or unit economics;
- unapproved prices, percentages, legal claims, or release commitments;
- text copied from a private repository merely because a similar public feature exists.

## Page contract

Every public page declares:

- title and concise summary;
- intended audiences;
- lifecycle status;
- version or policy applicability;
- public source owner and URL;
- last-reviewed date.

Current describes reviewed policy or a stable fact. Beta describes available or
actively validated behavior that may change. Draft describes direction or a
publication contract and is not a shipped guarantee. Deprecated and Historical
content must identify its replacement.

## Using code as documentation evidence

Public code is useful when prose is missing or stale, but implementation is not
automatically a supported contract.

When deriving a page from code:

1. Start with the owning public repository and current main or a release tag.
2. Prefer generated schemas, public interfaces, conformance tests, commands, and release notes over internal helpers.
3. Check capability gates, configuration, authorization, health, and negative tests.
4. Distinguish code presence from release enablement and runtime availability.
5. Link the public evidence and state its version or review date.
6. Test user-facing commands or examples where practical.
7. Escalate a conflict to the owning repository instead of inventing a second contract here.

## Change workflow

Maintainers may currently push reviewed documentation directly to `main`; a
pull request is optional, not a production requirement. Community changes,
cross-repository contracts, policy changes, security boundaries, and disputed
facts benefit from wider review in the owning repository.

Every content change should:

1. update the human page and its metadata;
2. run `npm run generate:content`;
3. run `npm run check`;
4. review the generated index and Agent context;
5. verify affected public links and routes;
6. commit the page, generated artifacts, and source-policy changes together.

## Corrections and conflicts

Open an issue in `mobazha/mobazha-docs` for unclear, missing, or stale guidance.
If the governing source is wrong, open the correction in that source repository
and make this portal explicitly note the temporary conflict. Suspected security
issues must use private vulnerability reporting.
