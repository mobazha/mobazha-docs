# Documentation Quality and Measurement

- Status: Active
- Scope: `docs.mobazha.org` human and Agent publications
- Last reviewed: 2026-07-04

## Quality gates

The repository enforces four layers before a documentation change is treated
as complete:

1. Knowledge integrity: content, decision records, generated publications,
   translation parity, source contracts, and public links remain valid.
2. Human experience: representative English and Chinese journeys retain a
   visible outcome and action, readable body type, and no page-level overflow
   at 1280×720 and 390×844.
3. Accessibility: every published page is checked at desktop size,
   representative English and Chinese journeys are also checked on mobile,
   and keyboard users can bypass repeated navigation and operate search.
4. Evidence and freshness: visual assets match their manifest dimensions and
   accessibility metadata, and reviewed SHA-256 digests prevent silent asset
   replacement; reviewed and last-tested dates stay within budget.

`npm run check` covers deterministic repository checks. `npm run
test:experience` starts the public surface in Chromium and covers rendered
behavior. The scheduled workflow additionally checks external links and exact
upstream source revisions.

Visual evidence schema 1.2 accepts reviewed SVG models and PNG product or
terminal captures. Dimensions and SHA-256 digests must match the manifest;
conceptual SVGs additionally require an internal title and description, and
every record requires English and Chinese copyable transcripts.

## Freshness budgets

| Record | Maximum age |
|---|---:|
| Beta page | 90 days |
| Current policy or fact | 180 days |
| Draft, Deprecated, or visual evidence | 180 days |
| Historical page | 365 days |
| Executable task `lastTested` | 90 days |
| Public source catalog and reviewed source | 90 days |
| Agent evaluation contract | 180 days |

A failed freshness check is a review request, not evidence that the content is
automatically false. The reviewer must inspect the authority and implementation
evidence, update the page if necessary, and only then advance the date.

## Privacy-safe measurement boundary

No custom behavioral telemetry is collected by this repository today. Do not
add a beacon, session replay, fingerprint, user identifier, order identifier,
wallet address, search text, or raw URL query without an accepted measurement
decision and matching public privacy disclosure.

The first approved measurement design should use aggregate counters for a
small event vocabulary:

- journey selected;
- primary action used;
- next-page navigation used;
- search completed with zero results;
- stale-content report opened.

Events must contain only the stable page route, language, event name, and a
coarse UTC day bucket. Search terms, referrers, IP-derived location, account or
device identifiers, and transaction context are out of scope. Retention,
access, deletion, processor, opt-out, and deployment ownership must be decided
before collection begins. Until then, repository issues, support questions,
structured walkthroughs, and CI results are the measurement evidence.

## Failure artifacts

Browser checks retain a screenshot and execution trace only when a test fails.
They run against repository content and synthetic conceptual visuals; they must
not load authenticated sessions or private customer data. A real product
screenshot remains subject to the publication gate in
[`HUMAN_EXPERIENCE_IMPLEMENTATION_PLAN.md`](./HUMAN_EXPERIENCE_IMPLEMENTATION_PLAN.md).
