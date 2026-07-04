# Mobazha Documentation Governance

- Status: Current
- Last reviewed: 2026-07-04

## Authority order

Use the narrowest applicable authority:

1. The backend that owns an order governs its transaction state.
2. The connected backend's version and effective capabilities govern runtime availability.
3. The selected payment system and confirmed records govern payment facts.
4. A transaction quote governs disclosed amounts for that transaction within public policy.
5. The canonical page on docs.mobazha.org governs project-wide public policy and explanation.
6. Tagged release documents and generated contracts govern a released version.
7. Draft ADRs, RFCs, and whitepapers describe proposals or direction.
8. Implementation-local documentation governs only its named code or package boundary.

Documentation never activates a capability, authorizes an action, changes an
order, or overrides a versioned contract. Evidence supports the canonical
public explanation; it does not create a second policy authority.

## One authority per fact

Use `mobazha-docs` for product meaning, user and operator guidance,
project-wide policy, economics, governance, cross-repository architecture,
public roadmaps, RFCs, and project-level ADRs. Use implementation repositories
for generated contracts, tagged release notes, required legal and security
files, package documentation, and code-near design.

Do not maintain the same policy paragraph in both places. After migration, an
old repository path may contain only a clearly non-normative moved notice and
the canonical docs URL. Release and implementation evidence may be linked but
must not be labeled as a second public knowledge source.

## Content and decision records

Markdown under `content/<language>/` is the authority for rendered page
content. Navigation is authoritative in `content/navigation.json`; application
registries and public discovery files are generated outputs.

Use RFCs for material proposals still under evaluation, ADRs for durable
decisions, and the history registry for superseded public material. Accepted
design is not the same as implemented behavior. Runtime and release claims
still require implementation, tests, contracts, capability gates, and release
evidence.

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

Every public page declares or deterministically emits:

- title and concise summary;
- intended audiences;
- lifecycle status;
- version or policy applicability;
- its canonical public knowledge authority;
- implementation, release, policy, or service evidence;
- last-reviewed date.

Pages also declare a `hub`, `task`, `reference`, `concept`, or `policy` type.
Task and reference pages carry a `lastTested` date and follow the executable
quality patterns in [`CONTENT_PATTERNS.md`](./CONTENT_PATTERNS.md).

Current describes reviewed policy or a stable fact. Beta describes available or
actively validated behavior that may change. Draft describes direction or a
publication contract and is not a shipped guarantee. Deprecated and Historical
content must identify its replacement.

## Using code as documentation evidence

Public code is useful when prose is missing or stale, but implementation is not
automatically a supported contract.

When using code as evidence for a page:

1. Start with the owning public repository and current main or a release tag.
2. Prefer generated schemas, public interfaces, conformance tests, commands, and release notes over internal helpers.
3. Check capability gates, configuration, authorization, health, and negative tests.
4. Distinguish code presence from release enablement and runtime availability.
5. Link the public evidence and state its version or review date.
6. Test user-facing commands or examples where practical.
7. Escalate a conflict to the owning repository instead of copying its exact contract into prose.

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

Core translations must point to their English canonical page, match its
lifecycle status, and carry a translation review date. The English source is
the policy-authoring authority during the first public phase; a translation
may clarify language but must not introduce a separate product promise.

When a public source revision is recorded in `sources.json`, run
`npm run check:source-contracts` before a source-driven review. A changed
revision is a review trigger, not proof that the published guidance is wrong.

## Corrections and conflicts

Open an issue in `mobazha/mobazha-docs` for unclear, missing, or stale guidance.
If the governing source is wrong, open the correction in that source repository
and make this portal explicitly note the temporary conflict. Suspected security
issues must use private vulnerability reporting.
