# Mobazha Video Information Architecture

- Status: Accepted planning reference
- Started: 2026-07-18
- Scope: public product demos, contextual task clips, technical proof videos,
  discovery metadata, and R2-backed delivery across Mobazha public surfaces

## Repository ownership

The system is intentionally split by authority rather than copied between
repositories:

| Repository or service | Owns |
|---|---|
| `mobazha-docs` | Public video registry and schema, titles, summaries, maturity, chapters, transcripts, public provenance, search, sitemap, `/demos`, and detail routes |
| `mobazha_hosting/docs/demos` | Recording manifests, exact build revisions, checksums produced by the recording workflow, and private-to-public evidence review inputs |
| `mobazha/tests/e2e` and product repositories | Deterministic seed data, Playwright flows, outcome assertions, and recording implementation |
| R2 through `media.mobazha.org` | Approved video, cover, poster, caption, and derivative objects; no independent navigation or public claims |

This keeps public knowledge review in the documentation repository while the
code that proves and reproduces a recording remains next to the product and
E2E implementation.

## Decision

Mobazha may publish more videos than fit on one showcase page. Video quantity
is not the limiting principle; every recording must have a clear audience,
job, evidence boundary, canonical discovery record, and placement.

The public experience uses three layers:

1. **Entry layer** — a small set of representative stories on the Mobazha
   website and `/demos` helps a new visitor decide whether to continue.
2. **Scenario layer** — video detail pages and a filterable catalog help a
   reader find evidence for a role or outcome.
3. **Task layer** — short, contextual clips inside buyer, seller, operator,
   and developer guidance help a reader complete one job.

`media.mobazha.org` remains the delivery origin for approved media. It is not a
navigation or knowledge-authority surface. `mobazha-docs` owns public video
metadata, discovery, maturity labels, relationships, and transcripts.

## Goals

- Let a first-time visitor reach one representative story without scanning a
  long player list.
- Let a buyer, seller, operator, developer, or evaluator find a relevant video
  by the outcome they need.
- Reuse one approved recording or derivative across discovery and task
  surfaces without copying its public metadata into multiple Markdown pages.
- Keep real-product, test-network, Preview, and simulated-provider evidence
  visibly distinct.
- Make silent videos discoverable and accessible through chapters,
  transcripts, captions, and meaningful poster text alternatives.
- Permit many focused task and proof videos without lowering the production
  bar for flagship stories.

## Non-goals

- Do not turn the left navigation into a list of individual videos.
- Do not make R2 bucket paths or internal demo manifests the public catalog.
- Do not publish a video because a screen exists; a recording must show an
  observable outcome or answer one stable user question.
- Do not automatically ingest internal `mobazha_hosting` evidence into the
  public site. Public claims remain reviewed docs-owned knowledge.
- Do not duplicate the complete video library inside the application.

## Surface model

| Surface | Reader intent | Video treatment |
|---|---|---|
| `mobazha.org` | Decide whether Mobazha is relevant | One 30–45 second flagship derivative and a link to `/demos` |
| `docs.mobazha.org/demos` | Choose what to understand next | Outcome selector, three featured stories, and lightweight catalog cards |
| `/demos/<slug>` | Understand and verify one complete story | Full player, chapters, transcript, maturity, provenance, related tasks, and one next action |
| Buyer, seller, operator, and build pages | Complete one current task | One relevant 20–60 second clip or a poster link to the canonical detail page |
| Product concept pages | Understand a durable relationship | Representative story or proof linked near the claim it supports |
| Application onboarding and empty states | Resolve immediate uncertainty | Optional short contextual help; link back to the canonical docs page |
| GitHub READMEs and release notes | Verify developer or operator behavior | Link to technical proof pages; do not create a second catalog |
| `media.mobazha.org` | Fetch media efficiently | Video, poster, cover, caption, and derivative objects only |

## `/demos` hub contract

`/demos` is a discovery hub, not a chronological registry and not an inline
player wall. Its first decision is the reader's job:

- **Sell** — publish, quote, receive payment, deliver, and fulfill.
- **Buy safely** — check out, track, recover, refund, and dispute.
- **Grow and operate** — distribute through markets, links, promoters, and
  channels.
- **Run and build** — self-host, connect stores, integrate APIs, and use
  authority-limited automation.

The hub keeps at most three featured stories above the catalog. A featured
position is earned by a distinct promise and observable payoff, not by demo ID
or recency. Catalog cards display poster, title, one-sentence outcome, primary
persona, duration, maturity, and content type. They link to the canonical
detail or task page and do not preload every full video.

Individual video pages are excluded from the persistent left navigation. They
remain discoverable through the hub, documentation search, related links,
sitemap, and contextual embeds.

## Video types and production levels

### Story demo

- Typical duration: 60–120 seconds; a multi-persona flagship may be longer.
- Purpose: explain one pain, journey, and result to a new visitor.
- Required: hook, primary persona, coherent data, real end-to-end outcome,
  payoff hold, end card, provenance, poster, transcript, and maturity label.
- Placement: featured hub, detail page, marketing derivative, and related
  product concepts.

### Task clip

- Typical duration: 20–60 seconds.
- Purpose: help a reader complete or recognize one task.
- Required: named starting state, one action sequence, expected result,
  accessible description, source recording, and applicable build.
- Placement: the canonical task page and the catalog. A hook and branded end
  card are optional.

### Technical proof

- Typical duration: 45–120 seconds.
- Purpose: let an operator, developer, partner, or evaluator inspect a real
  boundary or transaction result.
- Required: precise claim, live-versus-simulated disclosure, observable
  result, applicable build, and provenance. Browser and terminal views are
  acceptable when they materially prove the claim.
- Placement: a detail or reference page, developer/operator documentation,
  and the catalog. It is featured only when the public audience needs that
  proof to understand the product.

### Release clip

- Typical duration: 15–45 seconds.
- Purpose: show a changed interaction in release context.
- Placement: release notes and the related current task page.
- Release clips are not automatically evergreen and must declare the version
  they demonstrate.

## Public video registry

Add one docs-owned registry, initially `content/videos.json`, as the canonical
public record. Internal demo manifests remain implementation and provenance
evidence; they do not publish themselves.

The implemented source is [`content/videos.json`](../content/videos.json),
validated by [`content/videos.schema.json`](../content/videos.schema.json) and
the cross-record checks in `scripts/video-files.mjs`. The generated public
contract is available at `/videos.json` with the schema at
`/videos.schema.json`.

The final schema should additionally validate:

- stable IDs and unique slugs;
- allowed personas, goals, types, maturity states, and product promises;
- HTTPS R2 URLs for approved public media;
- positive duration and valid recording/review dates;
- poster, transcript, provenance, and checksum presence for story demos;
- a visible disclosure when payment providers, rails, or external services
  are simulated;
- valid related documentation routes;
- language and translation relationships.

The publication generator should use the registry to build detail routes,
catalog data, sitemap entries, and searchable text. Markdown pages reference a
video by stable ID rather than repeating URL, duration, maturity, and evidence
metadata.

## Rendering and accessibility

The existing Markdown video block supports a source, poster, and caption. The
registry-backed renderer should add:

- stable video ID lookup;
- duration and maturity badges;
- optional WebVTT caption tracks;
- chapter navigation;
- expandable transcript;
- accessible poster alternative and player label;
- a lightweight poster-link mode for contextual task pages;
- `preload="metadata"` or `preload="none"` outside the active detail player.

Silent chapter-card videos still require a text transcript. Bilingual page
copy and translated transcripts are the initial localization baseline; a
localized master is required only when baked-in text prevents the primary
audience from understanding the recording.

## Initial portfolio placement

| Video or candidate | Type | Canonical placement | Secondary placement | Portfolio decision |
|---|---|---|---|---|
| 0001 Operator Commission Flywheel | Story | `/demos/operator-commission-flywheel` | Community-commerce and marketplace-participation pages | Keep featured |
| 0003 Seller Affiliate Loop | Story | `/demos/seller-affiliate-loop` | Seller growth or promoter task guidance | Keep featured while it is the strongest Grow proof |
| 0004 Storefront Makeover | Task | `/demos/storefront-makeover` | `/sell/store-setup` in VIDEO-2 | Keep in the Sell catalog, outside the featured set |
| Protected Deal Link plus digital delivery | Story | Future `/demos/protected-digital-sale` | Payments and digital-delivery tasks | Produce next and feature when evidence gates pass |
| Escrow dispute and resolution | Story/proof | Future detail page | Cancel/refund/dispute and transaction-spine pages | Second production priority; compete for a featured slot rather than adding a permanent fourth |
| Onramp-funded order | Technical proof | Checkout task or proof page | Catalog under Buy safely | Keep Preview while the fiat provider leg is simulated |
| Telegram entry to paid order | Story/task | Future sales-channel task | Catalog under Grow and operate | Record only after the full Telegram-to-order path is deterministic |
| SaaS buyer to self-hosted store | Technical proof | Self-host or connection guide | Catalog under Run and build | Record after cross-store order completion is a hard E2E assertion |
| Collectible sale to redemption | Vertical proof | Dedicated vertical page | Catalog under Trade | Produce only for a real partner or active vertical audience |
| MCP or Agent-assisted commerce | Technical proof | `/build/mcp` or `/agents` | Catalog under Run and build | Require real runtime discovery, approval, and audit evidence |

## Contextual placement rules

1. Embed or link a video where it reduces uncertainty for the current reader
   job; do not add a video merely because the page mentions the same noun.
2. A task page contains at most one primary clip above its verification or
   expected-result section. Additional videos use related links.
3. The surrounding page remains usable without playing the video. Required
   steps, risks, recovery, and verification stay in text.
4. A video claim may not outrank the maturity or applicability of the owning
   page and runtime authority.
5. Reuse derivatives from the same real run when possible. A short clip must
   preserve the original transaction, outcome, and disclosure.
6. Replacement media requires checksum and evidence review; an old route must
   not silently inherit a new claim.

## Implementation sequence

### VIDEO-0 — Registry and route contract

Status: implemented on 2026-07-18.

1. Define and validate `content/videos.json` and transcript locations.
2. Enter the current 0001, 0003, and 0004 public records without changing
   their current URLs or claims.
3. Generate catalog data and add video documents to search and sitemap output.
4. Add tests for duplicate IDs/slugs, broken R2 assets, missing provenance,
   stale review dates, and invalid related routes.

Exit condition: one record owns all public metadata for each existing video,
and generated outputs fail when that record is invalid or stale.

### VIDEO-1 — Discovery hub and detail page

Status: implemented on 2026-07-18 for the initial three-video catalog.

1. Refactor `/demos` into an outcome chooser with no more than three featured
   stories and lightweight catalog cards.
2. Implement `/demos/<slug>` from the registry with player, chapters,
   transcript, maturity, provenance, related guidance, and primary action.
3. Preserve `/demos` and current media URLs; do not break published links.
4. Verify 1280×720 and 390×844 layouts, keyboard use, reduced motion, player
   labels, and no page-level overflow.

Exit condition: a reader reaches a relevant video in at most two choices and
the hub does not preload every full recording.

### VIDEO-2 — Contextual task integration

1. Add the 0004 clip or poster link to `/sell/store-setup`.
2. Add 0001 to marketplace and community-commerce guidance.
3. Add 0003 to the canonical seller-growth guidance when that task page has a
   stable public owner.
4. Extend the Markdown renderer to support registry IDs, poster-link mode,
   captions, and transcripts without duplicating metadata.

Exit condition: each current video is discoverable through both the catalog
and the user journey it supports, while every task remains complete in text.

### VIDEO-3 — New high-value stories

1. Build and record Protected Deal Link plus real Safe payment plus automatic
   digital delivery as the next flagship candidate.
2. Build a live browser-to-backend-to-chain escrow dispute recording harness,
   then decide whether its trust value replaces a current featured slot.
3. Promote Onramp, Telegram, cross-store, Collectibles, or Agent proofs only
   when their stated end-to-end outcome is deterministic and honestly
   disclosed.

Exit condition: new recordings have a canonical destination before production
starts and do not expand the featured set by default.

## Quality gates

Every published story or proof must satisfy:

- one primary persona, one promise, and one observable payoff;
- a real, repeatable product run for every claimed outcome;
- no fabricated, mocked, or spliced financial or delivery result;
- explicit test-network, Preview, and simulated-provider disclosure;
- coherent synthetic demo data and privacy review;
- native-density public scenes and only scene-appropriate workflow zoom;
- no unexplained blank screen or loading hold;
- poster, transcript, chapters, alt text, provenance, applicable build, and
  media checksum;
- related documentation that states the task and recovery path in text;
- successful content generation, repository checks, responsive experience
  tests, and public media availability checks.

Task clips may omit a marketing hook and end card, but may not omit the
starting state, expected result, applicability, or accessible text equivalent.

## Ownership and publication flow

```text
repeatable product/E2E evidence
  -> internal recording manifest and approved R2 objects
  -> reviewed public video registry record
  -> detail page, catalog card, contextual task reference, and search document
  -> docs checks and human review
  -> GitHub push and Cloudflare production deployment
```

- Product repositories own implementation and repeatable E2E evidence.
- Recording manifests own how a particular media artifact was produced.
- R2 owns approved media bytes and delivery.
- `mobazha-docs` owns public meaning, maturity, discovery, transcript,
  placement, and related guidance.
- The Mobazha website and application consume links or approved derivatives;
  they do not fork public video metadata.

## Immediate next batch

The smallest useful implementation batch is VIDEO-0 plus one vertical slice of
VIDEO-1:

1. define the registry schema;
2. migrate metadata for 0001, 0003, and 0004;
3. render one detail page for 0001;
4. include that page in search and sitemap;
5. convert `/demos` from three inline players to featured/catalog cards that
   link to the canonical pages;
6. run repository and responsive experience checks without deploying;
7. only then begin production of the Protected Deal Link recording.

This order proves the placement and maintenance system before video volume
increases.
