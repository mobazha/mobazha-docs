# Human Documentation Experience Audit

- Status: Historical baseline with current follow-up
- Scope: `docs.mobazha.org` human-facing English experience
- Baseline date: 2026-07-04
- Follow-up review: 2026-07-14

## Executive verdict

The documentation is substantially stronger as a knowledge system than as a
human product. It has reliable authorities, lifecycle metadata, structured
content, Agent publications, validation, and useful task coverage. A person can
find correct material, but the interface does little to create interest,
explain why Mobazha matters, or build momentum toward a completed task.

This is not primarily a page-count problem. The central design problem is that
hub, task, reference, concept, and policy content all use one authority-first
presentation. The same facts should serve people and Agents, but they should
not be forced through the same information hierarchy.

## 2026-07-14 follow-up

The baseline measurements below are retained for change history; they no
longer describe the complete current portal. Role- and journey-scoped
navigation, page-type presentation, visible primary actions, local section
navigation, readable type scales, conceptual evidence, and responsive checks
have since been implemented. English and Chinese now have 64 same-path pages.

The remaining human-product gap is evidence, not another general renderer
redesign. Released buyer, seller, hosted-operator, self-hosted-operator,
developer, and Agent journeys still need representative product states that
show success, denial, dependency failure, unknown financial outcome, and safe
recovery. Product screenshots or route-specific guides remain gated on stable
synthetic data, privacy review, source revision, capability truth, responsive
review, and release evidence.

A localization follow-up also found that file and metadata parity had masked
substantial summary-only Chinese pages. Fourteen priority pages were expanded
on 2026-07-14 and a loose severe-gap validation floor was added. Human review
remains necessary; the heuristic is a regression guard, not a quality score.

## Audit method

The baseline combines source review with rendered desktop inspection of the
documentation home, `/start`, `/buy`, `/sell`, `/self-host`, and
`/build/quickstart`. The inspection measured navigation density, first useful
content position, visible actions, media and structured blocks, and the order
of product, task, and trust information.

This audit evaluates whether a reader can answer four questions quickly:

1. Is this for me?
2. What useful outcome can I get?
3. What should I do next?
4. Why should I trust the instruction at the point where trust matters?

## Baseline evidence

| Observation | Baseline |
|---|---|
| Desktop sidebar links shown on each inspected document | 58 |
| First content section on a 720px-high viewport | 530–597px from the top |
| Product images on `/start`, `/buy`, `/sell`, and `/self-host` | 0 |
| Primary action buttons inside inspected document pages | 0 |
| Code visible above the fold on `/build/quickstart` | No |
| Metadata shown before the first task or decision | Audience, applicability, review date, test date when present, authority, and evidence |
| Human and Agent source of truth | Shared, correctly |
| Human and Agent presentation hierarchy | Also shared, incorrectly |

The documentation home has a stronger visual hero and journey cards, but it
still relies on generic open-commerce language and contains no product proof.
Its primary action leads to `/start`, which presents a second, weaker landing
experience whose “Choose a path” choices are ordinary list items rather than
actions.

## Severity-one problems

### The first screen prioritizes governance over progress

Status, breadcrumb, title, summary, and a complete trust-metadata grid consume
most of the first viewport. On the developer quickstart, the first real
instruction begins near the bottom of the viewport and the first code example
appears later. On buyer and seller hubs, the reader sees no primary action.

Trust metadata is valuable, but its current position makes readers pay an
administrative cost before receiving value. Only the lifecycle warning and
critical applicability boundary need to remain immediately visible. Full
authority and evidence belong in progressive disclosure or near the claim they
support.

### Every page type uses one visual contract

A role hub should help a reader choose a journey. A task should get to an
observable result. A reference should expose the contract and an example. A
policy should make scope and current rules easy to inspect. Rendering all four
as the same article weakens each one.

The current `pageType` metadata improves validation and Agent indexing but does
not yet produce a distinct human experience.

### Navigation exposes the repository taxonomy

Every desktop reader receives the full cross-role tree. A buyer sees seller,
operator, developer, project, and Agent navigation. The primary header gives
Self-host, Build, Reference, and Project more prominence than Buy and Sell.

This communicates the size of the repository, not the reader's next decision.
It also makes the current location harder to understand because local and
global choices have nearly equal visual weight.

### Human pages contain no product proof

The major role hubs contain no interface screenshots, annotated states,
timelines, diagrams, example cost allocations, or observable completion
states. Text explains what to inspect but does not show the reader what success
looks like.

Visual evidence must come from the real product or a clearly labeled
conceptual model. Decorative illustration alone would not solve this problem.

## Severity-two problems

### The editorial voice is dominated by defensive language

Repeated use of “verify,” “inspect,” “retain,” “do not,” “never,” “authority,”
and “evidence” correctly protects important boundaries but makes the product
sound like a compliance exercise. Safety guidance often appears before the
reader understands the benefit or action it protects.

The preferred sequence is outcome, action, confirmation, and then contextual
risk. Warnings should remain strong at irreversible or financial decisions.

### Titles describe abstractions instead of user outcomes

Titles such as “Buy with inspectable terms” and “Start with the job you need to
do” are accurate but do not sound like the reader's language. They describe a
documentation property rather than a result.

Titles should name an action and outcome, for example “Buy from an independent
store” or “Call your local Node API in five minutes.”

### There is no dominant next action

Useful links exist, but they usually appear as equal-weight cards at the bottom
of the page. The hosted application, first checkout, store setup, install, and
first API call need a visible primary action or start point.

### Typography creates spectacle at the top and strain below it

The baseline home hero reaches 84px while navigation, task-card descriptions,
metadata, captions, code, and table text frequently fall between 8px and 13px.
This makes the first screen feel oversized but the material a reader must
actually follow feel compressed. The contrast is especially costly on dense
task pages and high-resolution laptop displays.

The correction caps the home display at 72px, keeps document titles at
38–52px, and establishes 16px article text, 14px navigation and actions,
12–13px supporting text, and 11px as the smallest category label. Mobile
preserves readable body and action sizes instead of scaling the entire system
down uniformly.

### Product differentiation is implicit

The visual system is clean but could describe many API or Web3 projects.
Pages do not visibly demonstrate independent store ownership, seller-owned
checkout, inspectable cost allocation, operator control, runtime capability
boundaries, or Agent assistance without transaction authority.

## Severity-three problems

- Long pages have no local table of contents or progress cue.
- Tasks do not expose estimated effort, expected output, or a compact starting state.
- Code blocks lack copy actions and request/response pairing.
- Related links are not prioritized by the most likely next user decision.
- Repeated Beta treatment can make every surface feel equally unstable.
- The English and Chinese human experiences will drift if layout is improved
  without a translation and asset strategy.

## Root causes

1. The first portal release optimized authority, completeness, and machine
   publication before human motivation and task momentum.
2. A single generic document renderer ignores the semantics already available
   in `pageType`.
3. Navigation is generated from the complete publication taxonomy instead of a
   role-scoped journey model.
4. Trust metadata has no compact or expandable presentation.
5. The repository has no governed product-screenshot or diagram workflow.
6. Content quality gates test structure and safety but not above-the-fold value,
   primary actions, visual evidence, or human comprehension.
7. “Same facts for people and Agents” was implemented too literally as “same
   hierarchy and emphasis.”

## Product principles for the correction

1. Keep one canonical fact source, but generate audience-appropriate views.
2. Put the reader's outcome and next action before full governance metadata.
3. Reveal global complexity progressively; show the current role and journey first.
4. Use real product states as evidence and diagrams only when they clarify a model.
5. Place safety guidance at the decision it protects.
6. Make completion observable: show expected UI, response, state, or artifact.
7. Preserve stable URLs, lifecycle meaning, authority, and Agent contracts while
   changing the human presentation.
8. Measure task starts and completions, not visual novelty or page count.

## What must remain

The redesign must not remove the features that already make the knowledge
surface trustworthy:

- one authority for each public fact;
- visible lifecycle and applicability when material;
- generated Agent indexes and evaluation cases;
- versioned evidence and source-contract checks;
- deterministic builds, link checks, accessibility, and stable routes;
- explicit financial, authorization, payment, and order-state boundaries.

## Exit criteria for this baseline

This audit can be superseded when the flagship human journeys use distinct page
templates, role-scoped navigation, above-the-fold actions, real visual evidence,
and tested completion states, while Agent outputs and authority checks continue
to pass. The implementation contract is maintained in
[`HUMAN_EXPERIENCE_IMPLEMENTATION_PLAN.md`](./HUMAN_EXPERIENCE_IMPLEMENTATION_PLAN.md).
