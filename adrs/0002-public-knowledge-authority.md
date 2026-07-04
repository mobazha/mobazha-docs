# ADR-0002: Mobazha Docs Owns Public Knowledge

- Status: Accepted
- Date: 2026-07-04
- Decision owners: Mobazha project and documentation maintainers
- Affected surfaces: docs.mobazha.org, public repository documentation, Agent indexes, release checks
- Supersedes: The portal-only authority model in the initial documentation launch
- Superseded by: None

## Context

Public explanations of fees, compatibility, release maturity, runtime
composition, distribution, and product direction were split across the Node,
Unified, and documentation repositories. The portal often summarized a second
repository document and called that document its source. Readers and Agents
could not know which near-duplicate governed, and every change needed several
coordinated prose edits.

Code, generated contracts, runtime responses, transaction records, and tagged
releases still need to remain with the systems that create them. Moving those
artifacts into a prose repository would weaken versioning and operational
truth rather than improve it.

## Decision

`mobazha-docs` is the canonical public knowledge surface for product meaning,
user and operator guidance, project-wide policy, economics, governance,
cross-repository architecture explanations, public roadmaps, RFCs, and
project-level ADRs.

Each rendered page is the only public knowledge authority for its topic. Its
evidence links point to implementation, contracts, tests, releases, service
terms, or transaction systems; an evidence link is not a parallel prose
authority.

More specific operational authorities remain in place:

- the backend that owns an order governs its state;
- the connected backend's effective capability response governs availability;
- a generated or versioned interface contract governs exact API and schema details;
- confirmed payment records govern payment facts;
- a transaction quote governs disclosed amounts for that transaction within public policy;
- tagged releases, checksums, SBOMs, and conformance results govern a released artifact;
- implementation-local design and package documentation stay beside the code.

Public repositories keep short README entry points, required security and
legal files, release notes, versioned contracts, and code-near design. A
retired duplicate policy may remain temporarily only as a non-normative moved
notice that links to its canonical docs page.

## Alternatives considered

- Keep every public explanation in its implementation repository and use the portal only as an index: preserves local ownership but continues duplicate summaries, fragmented discovery, and ambiguous Agent answers.
- Move every contract and technical document into `mobazha-docs`: creates one repository but separates exact schemas, release evidence, and implementation design from the code versions they govern.
- Generate all public prose from code comments: reduces some drift but cannot adequately govern economics, product meaning, user journeys, governance, or cross-repository decisions.
- Mirror repository documents into the portal: improves discovery while retaining two editable copies and therefore does not satisfy one authority per fact.

## Consequences

- Public policy changes are reviewed once in `mobazha-docs` and deploy through one tested pipeline.
- Repository READMEs route readers by task instead of restating project policy.
- Agent indexes distinguish knowledge authority from implementation evidence and runtime authority.
- A code or runtime conflict is surfaced as an applicability problem; docs never fabricate implementation support.
- Cross-repository standards use a docs RFC or ADR, while code-specific contracts remain versioned with code.
- Migration requires compatibility notices for old GitHub links and automated guards against reintroducing duplicate policy.

## Validation

The docs build requires every page to emit its canonical knowledge authority
and evidence separately. Repository CI validates known moved notices and
canonical links. Release checks continue to require an exact reviewed source
revision so authoritative guidance cannot claim an unreviewed build.

## Supersession conditions

Replace this decision only with a model that still provides one canonical
public answer, deterministic public builds, anonymous access, machine-readable
authority, exact implementation evidence, and version-aware runtime safety.
