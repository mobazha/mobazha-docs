# Human Documentation Experience Implementation Plan

- Status: Active
- Depends on: [`HUMAN_EXPERIENCE_AUDIT.md`](./HUMAN_EXPERIENCE_AUDIT.md)
- Public surface: <https://docs.mobazha.org>
- Last reviewed: 2026-07-04

## Current progress

| Work package | Status | Current evidence |
|---|---|---|
| HX-0 | Complete | Baseline audit, contracts, and acceptance criteria are recorded |
| HX-1 | Implemented locally | Journey-first global navigation, role-scoped sidebars, compact first screen, and `TrustPanel` |
| HX-2 | Implemented locally | Human-experience metadata, page-type styling, section anchors, local TOC, and copyable code |
| HX-3 | In progress | `/`, `/start`, `/buy`, `/sell`, `/self-host`, and `/build/quickstart` migrated; governed product visuals remain |
| HX-4–HX-6 | Planned | Follow-on task/reference migration, localization, and measurement |

Local implementation is not considered delivered until the complete build,
route checks, desktop and mobile walkthroughs, staged review, and production
deployment verification have passed.

## Outcome

Turn the existing authoritative knowledge system into a human-first product
without creating a second source of truth. A buyer, seller, operator, or
developer should understand the value, choose a journey, begin the task, and
recognize success before they need to inspect repository ownership or complete
authority metadata.

The target is not a marketing site with documentation attached. It is a
task-oriented product surface with enough product evidence and narrative to
make correct guidance understandable and worth following.

## Decisions

1. `mobazha-docs` remains the canonical public knowledge source.
2. Human pages and Agent artifacts use the same content facts but different
   projection and emphasis.
3. `pageType` selects a distinct renderer and quality contract.
4. The global header exposes human journeys; the sidebar exposes only the
   current role or reference family.
5. Full trust metadata moves into an accessible disclosure panel, while status
   and critical applicability remain visible.
6. Product visuals must be captured from reviewed public builds or committed as
   clearly labeled conceptual diagrams.
7. The initial redesign covers five flagship journeys before the pattern is
   applied to all 68 pages.

## Target information architecture

### Global navigation

Use no more than five primary choices:

- **Use** — Buy and Sell
- **Operate** — Self-host and maintain a Node
- **Build** — API, events, MCP, webhooks, and extensions
- **Understand** — Architecture, economics, security, releases, and governance
- **Community** — Support and contribution

Search and language selection remain global utilities. Reference is available
inside Build rather than competing with Buy and Sell in the primary header.

### Local navigation

The desktop sidebar shows the current family, normally no more than 7–12
links, plus a compact family switcher. A page-level table of contents appears
for long references and policies. Agent endpoints move out of the primary
human navigation and remain linked from the Agent guide and footer.

### Entry route

The documentation home becomes the canonical human journey chooser. `/start`
remains a stable compatibility route but must not create a second generic
landing experience. It should resolve to the home journey chooser or a focused
orientation block without duplicating the entire entry decision.

## Page-type experience contracts

| Page type | First-screen promise | Primary body | Trust treatment |
|---|---|---|---|
| `hub` | Role outcome, short value statement, one primary action | 3–5 journey cards, product proof, common decisions | Compact status; full evidence in disclosure |
| `task` | Observable result, estimated effort, prerequisites, start action | Numbered steps with screenshots or outputs, verification, recovery | Contextual warnings and expandable evidence |
| `reference` | Contract name, tested version, copyable first example | Request/response, scopes, errors, compatibility, local TOC | Version and source visible; ownership details disclosed |
| `concept` | One question answered and why it matters | Diagram, relationships, examples, consequences | Authority near material claims |
| `policy` | Current rule and who it applies to | Scope, rule, rationale, exceptions, examples, history | Lifecycle, review date, and authority visible |

## Content model changes

Add optional human-experience frontmatter while preserving current metadata:

```yaml
outcome: Create a recoverable guest order without attaching an account.
estimatedTime: 5 minutes
primaryAction:
  label: Open Guest Checkout
  href: https://app.mobazha.org
journey: buy
featuredVisual: /images/buy/guest-checkout-order.png
```

Required validation after the migration:

- every `hub` has a primary action and at least three prioritized journeys;
- every flagship `task` has an outcome, expected result, and either a reviewed
  product visual or a concrete command/response artifact;
- every `reference` exposes a copyable example before long explanatory text;
- external actions identify their destination;
- visuals have alt text, source revision, capture date, and applicability;
- Agent publications include the facts but omit purely decorative presentation.

The first implementation should avoid a general-purpose page-builder schema.
Add only fields used by at least two page families, and keep rich content in
ordered Markdown blocks.

## Component and rendering plan

Introduce small, page-semantic components instead of one growing generic page:

| Component | Responsibility |
|---|---|
| `HubDocument` | Outcome hero, primary action, journey cards, product proof |
| `TaskDocument` | Task summary, effort, prerequisites, steps, expected result |
| `ReferenceDocument` | Code-first contract view, local TOC, copy controls |
| `ConceptDocument` | Question-led explanation, diagram, examples, consequences |
| `PolicyDocument` | Scope, current rule, exceptions, history |
| `TrustPanel` | Accessible disclosure for authority, evidence, dates, and applicability |
| `JourneyNavigation` | Role-scoped navigation and family switching |
| `ProductVisual` | Reviewed screenshot or conceptual diagram with provenance |
| `CodeExample` | Language label, copy action, request/response pairing |

`app/[...slug]/page.tsx` should select the renderer from `pageType`. Shared
blocks remain reusable, but their placement and prominence are controlled by
the page contract rather than by source order alone.

## Visual evidence policy

Store public visual assets under `public/images/docs/<journey>/`. Every asset
must have a nearby manifest entry or sidecar record containing:

- source repository and revision or public build identifier;
- capture date and viewport;
- applicable release or status;
- alt text and a short statement of what the image proves;
- redaction confirmation.

Prefer these forms in order:

1. annotated real interface state;
2. real terminal or API output with secrets removed;
3. code-native sequence, state, or architecture diagram;
4. decorative illustration only when it reinforces identity without pretending
   to prove behavior.

Never publish customer information, real delivery data, credentials, wallet
secrets, production identifiers, or private Hosting surfaces.

## Editorial correction

Use this order for human task writing:

1. State the useful outcome.
2. Give the shortest safe starting action.
3. Show what success looks like.
4. Explain choices at the step where they occur.
5. Put warnings beside irreversible, financial, identity, or privacy decisions.
6. Move exhaustive authority and compatibility detail into disclosure or a
   reference page.

Prefer action and result titles. Avoid using “inspectable,” “authority,”
“evidence,” or “scope” as the main value proposition unless the reader is
explicitly evaluating those properties.

## Flagship migration order

| Priority | Route | Human job | Required improvement |
|---|---|---|---|
| 1 | `/` and `/start` | Understand Mobazha and choose a path | Remove double landing, show Buy/Sell first, add product proof and direct actions |
| 2 | `/buy` | Start buying or resolve an order issue | Hosted-app CTA, three-step purchase model, cost example, order-state visual |
| 3 | `/sell` | Open and operate a store | Store outcome preview, setup CTA, lifecycle journey, seller-owned order explanation |
| 4 | `/self-host` | Decide whether and how to run a Node | Requirements summary, install CTA, topology diagram, observable health result |
| 5 | `/build/quickstart` | Make the first authenticated API call | Code above the fold, copy action, expected response, version and auth context |

After these five establish the system, migrate checkout, guest checkout, order
status, store setup, install, webhooks, fees, and whitepaper entry pages in that
order. Do not mechanically apply visual components to every policy page.

## Work packages

### HX-0 — Baseline and contracts

- Maintain the audit and this plan.
- Add human-experience acceptance criteria to content governance.
- Capture before-state screenshots and measurements.

**Exit:** baseline is reproducible and the five page-type contracts are agreed.

### HX-1 — Navigation and trust hierarchy

- Replace the cross-role header with the target global navigation.
- Generate role-scoped sidebar groups.
- Add a local table of contents for long pages.
- Implement `TrustPanel` and keep lifecycle/applicability warnings visible only
  when they change the reader's decision.

**Exit:** an inspected page exposes no more than 12 local sidebar links, and the
first useful section or action begins within the first 420px at a 1280×720
viewport unless a product visual intentionally occupies that space.

### HX-2 — Page-type renderers

- Add typed frontmatter for outcome, effort, journey, primary action, and visual.
- Implement Hub, Task, Reference, Concept, and Policy presentation contracts.
- Preserve existing blocks, stable routes, canonical URLs, and generated Agent artifacts.
- Add parser, renderer, and validation tests for each page type.

**Exit:** fixture pages demonstrate visibly different hierarchy without
forking facts or breaking `docs-index.json` and `llms-full.txt`.

### HX-3 — Flagship human journeys

- Migrate the five routes in the flagship order.
- Capture reviewed product states and expected results.
- Rewrite titles and introductions around actions and outcomes.
- Keep financial and authorization warnings at the protected decision.

**Exit:** each flagship page has a visible primary action, product or output
proof, a clear next step, and passes desktop and mobile task walkthroughs.

### HX-4 — Developer and operator depth

- Add copyable request/response examples and version context.
- Add install, health, backup, and recovery result visuals.
- Introduce a compact local TOC for long references.
- Migrate the remaining high-use task and reference pages.

**Exit:** first API call and first Node health check can be completed from the
documentation without repository browsing.

### HX-5 — Trust, project, and localization surfaces

- Apply policy and concept templates to fees, architecture, security,
  whitepaper, governance, and releases.
- Add diagrams only where relationships or state cannot be understood quickly in prose.
- Produce Chinese counterparts for the redesigned core journeys and shared visuals.

**Exit:** translated core journeys preserve facts, actions, hierarchy, and
visual applicability without introducing a second policy authority.

### HX-6 — Measurement and continuous quality

- Measure journey-card selection, primary-action use, search exits, zero-result
  searches, next-step navigation, and stale-content reports without collecting
  sensitive order or identity data.
- Add screenshot provenance checks and human-experience fixtures to CI.
- Review high-exit pages and repeated support questions each release cycle.

**Exit:** the team can identify where readers fail to start or complete a task
and can improve that path from privacy-safe evidence.

## Acceptance tests

Every migrated flagship page must pass:

### Human comprehension

- A reader can identify the page outcome and next action in the first viewport.
- A role hub presents no more than five primary choices.
- A task shows prerequisites, steps, expected result, and recovery distinctly.
- Trust information is available without displacing the primary task.

### Visual and responsive behavior

- 1280×720 desktop and 390×844 mobile views have no page-level horizontal overflow.
- Mobile journey navigation is understandable without truncated mystery labels.
- Tables and code scroll within their containers.
- Screenshots remain legible at their intended breakpoint and include alt text.

### Accessibility

- Actions use semantic links or buttons with explicit names.
- Disclosure, copy, and navigation controls are keyboard operable.
- Focus states, contrast, headings, landmarks, and reduced-motion behavior pass review.

### Knowledge integrity

- Human and Agent outputs resolve to the same canonical facts.
- Existing content, record, route, external-link, and source-contract checks pass.
- Product visuals identify applicability and do not imply an unavailable capability.
- No warning, authority boundary, or failure recovery is lost during rewriting.

## Success measures

The program succeeds when evidence shows improvement in behavior, not merely a
new appearance:

- more readers select a role journey from the entry page;
- more readers reach a task's primary action or expected-result section;
- fewer readers bounce between unrelated role families;
- search exits and repeated support questions decline;
- first API call and first Node health check completion improve;
- no regression occurs in Agent evaluation, source authority, accessibility,
  or security reporting.

Analytics are not required to begin HX-1 through HX-3. Initial acceptance uses
structured walkthroughs and viewport measurements; privacy-safe aggregate
measurement is introduced in HX-6.

## Implementation rules

- Complete work packages in order; content migration may overlap only after the
  corresponding renderer contract is tested.
- Use real reviewed assets before requesting decorative artwork.
- Keep changes small enough to compare before and after on one flagship journey.
- Do not convert governance metadata into hidden or missing facts; use
  progressive disclosure.
- Do not duplicate human copy in a separate Agent source.
- Update this plan when a decision changes, and record durable architectural
  choices in an ADR when implementation makes them expensive to reverse.

## Definition of done

The human-experience phase is complete when all flagship routes and the
high-use follow-on tasks use their page-type contracts; global and local
navigation are progressive; real product or output evidence is governed and
maintained; desktop, mobile, accessibility, and knowledge-integrity checks pass;
and Agent publications retain the same authority and safety quality as the
baseline.
