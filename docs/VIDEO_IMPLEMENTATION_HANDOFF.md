# Video implementation handoff

- Updated: 2026-07-19
- Repository: `mobazha/mobazha-docs`
- Branch: `main`
- Previous deployment checkpoint: `303e4dd`
- Planning authority: [`VIDEO_INFORMATION_ARCHITECTURE_PLAN.md`](./VIDEO_INFORMATION_ARCHITECTURE_PLAN.md)

## Completed

- VIDEO-0: public `content/videos.json` registry, schema, validation, generated
  `/videos.json`, freshness and external-link checks.
- VIDEO-1: lightweight `/demos` discovery hub, registry-backed detail pages,
  search, sitemap, responsive and accessibility coverage.
- VIDEO-2: registry-backed `!video-ref[NNNN]` Markdown references,
  lightweight contextual poster links, optional caption-track schema support,
  and user-journey placement for all three current videos.
- Published media currently referenced by the registry:
  - 0001 Operator Commission Flywheel: v9, 112 seconds.
  - 0003 Seller Affiliate Loop: v8, 69 seconds.
  - 0004 Storefront Makeover: v2, 63 seconds.
- Production verification on 2026-07-19 confirmed that
  `https://docs.mobazha.org/videos.json` and the three detail routes expose the
  current registry.
- Production verification after `303e4dd` confirmed contextual video cards on
  `/sell`, `/sell/store-setup`, `/sell/marketplace-participation`, and
  `/project/community-commerce`, plus the caption-capable public video schema.

## Repository authority split

- `mobazha-docs` owns public meaning, placement, maturity, transcript,
  chapters, discovery, and related guidance.
- product repositories and `/Users/mingfeng/dev/mobazha/tests/e2e` own the
  repeatable behavior and recording assertions.
- recording manifests own build and capture provenance.
- R2 through `media.mobazha.org` owns approved media bytes only.

## Website derivative (2026-07-19)

- 0001 cut45-v9 (36.2s) is live on R2 and embedded on `mobazha.org`
  (`DemoHighlight` below the hero).
- Identity-first open ("Your community. Your market."); payoff poster is the
  earnings attribution frame. Docs gallery still serves the v9 master.
- Media:
  - https://media.mobazha.org/demos/0001-operator-commission-flywheel/operator-commission-flywheel-cut45-v9.mp4
  - https://media.mobazha.org/demos/0001-operator-commission-flywheel/cut45-cover-v9.jpg
  - https://media.mobazha.org/demos/0001-operator-commission-flywheel/cut45-poster-v9.jpg
- Hosting manifest: `docs/demos/0001-operator-commission-flywheel/demo.md`.
- VIDEO-3A/3B are now independent full masters; the website derivative remains
  0001 cut45-v9 unless a later marketing review deliberately replaces it.

## Captions (2026-07-19)

- English WebVTT tracks are published for 0001 v9, 0003 v8, and 0004 v2.
- Cue text mirrors on-screen hook, chapter chips, and end cards on the silent
  masters; detail players load them as the default `captions` track.
- Media:
  - https://media.mobazha.org/demos/0001-operator-commission-flywheel/operator-commission-flywheel-en-v9.vtt
  - https://media.mobazha.org/demos/0003-seller-affiliate-loop/seller-affiliate-loop-en-v8.vtt
  - https://media.mobazha.org/demos/0004-storefront-makeover/storefront-makeover-en-v2.vtt

## Current work

VIDEO-3 is complete in source. It adds two public records, canonical detail
routes, one Buy/delivery featured story, one Buy/recovery catalog proof, and
lightweight task references without increasing the featured set beyond three.

- 0005 Protected Digital Sale — 61.13s, v1, 1920×1080, local-Anvil payment
  plus a deterministic fetchable launch-kit artifact.
- 0006 Escrow Dispute Resolution — 66.57s, v1, 1920×1080, buyer evidence,
  moderator 60/40 ruling, buyer acceptance, and local-Anvil Safe release.
- Both are labeled Preview and describe their local test-network boundary.
- Both have chapters and full text transcripts. Caption tracks remain optional
  schema fields and can be added as a later accessibility derivative without
  changing the canonical records.

## VIDEO-3 evidence audit

The audit and implementation completed on 2026-07-19 against:

- `mobazha@44d212c9367d65337b01f8fc048a49346af6a31f`;
- `mobazha-commercial-node@a9296b850b54d94975c83eea1ef46fa8c7dbdf83`;
- `mobazha-unified@db149cb125fbfc9b2c155124100a130dcd825a77`
  and `574feba430fae51e31514646fcbec71b62dffff5`;
- `mobazha-e2e@1804c81457310af4250ee7c79f2b27988e7f3cd6`.

Findings:

1. 0005 replaced the `example.com` placeholder with a local deterministic
   delivery endpoint and a visibly reviewable Access verified artifact.
2. Its live Playwright run creates the order from the public Deal Link, creates
   the buyer-owned Payment Session, pays the exact target, observes automatic
   advancement, and opens the granted delivery link.
3. 0006 prepares one fresh funded moderated order with uploaded buyer evidence,
   then records buyer and moderator views over that same backend transaction.
4. The moderator's 60/40 ruling, buyer acceptance, `safe_deploy` when needed,
   `dispute_release`, transaction hash, and final resolved projection all remain
   observable.
5. Recording exposed two real correctness issues that were fixed before the
   masters were accepted: settlement-message ACKs were not retired, and a
   provider head race could degrade the Safe monitor on a stale `BalanceAt`.

Decision: publish 0005 as the featured Buy story; publish 0006 under Buy safely
and the dispute task page without adding a fourth featured slot.

## VIDEO-3 public media

- 0005:
  - https://media.mobazha.org/demos/0005-protected-digital-sale/protected-digital-sale-demo-v1.mp4
  - https://media.mobazha.org/demos/0005-protected-digital-sale/cover-v1.jpg
  - https://media.mobazha.org/demos/0005-protected-digital-sale/poster-v1.jpg
- 0006:
  - https://media.mobazha.org/demos/0006-escrow-dispute-resolution/escrow-dispute-resolution-demo-v1.mp4
  - https://media.mobazha.org/demos/0006-escrow-dispute-resolution/cover-v1.jpg
  - https://media.mobazha.org/demos/0006-escrow-dispute-resolution/poster-v1.jpg

All six public downloads match their registry SHA-256 digests. The MP4s return
byte ranges and immutable cache headers from `media.mobazha.org`.

## VIDEO-2 and VIDEO-3 verification

- `npm run generate:content`: passed.
- `npm run check`: passed, including content, records, freshness, visual
  evidence, OpenAPI, lint, and production build.
- Targeted desktop/mobile Playwright checks: 14 passed, 2 expected skips,
  including both new detail routes and both new contextual references.
- `npm run check:external-links`: passed, including all six new R2 objects.
- Human responsive review at 1280×720 and 390×844: the five-video hub remains
  scannable, featured stories stay capped at three, both detail pages retain
  useful native-density content, and no page-level overflow or blank content
  block appears.

## Guardrails for a new session

1. Fetch `origin/main` and inspect the worktree before editing; another demo
   session may publish new media revisions.
2. Do not copy media URL, duration, transcript, maturity, or provenance into
   contextual Markdown. Reference the stable four-digit registry ID.
3. Keep `/demos/<slug>` as the canonical player and transcript page.
4. Contextual task pages use poster-link mode unless playing inline materially
   improves task completion.
5. Do not add an unverified video candidate to `content/videos.json`.
6. Run `npm run generate:content` before validation and require zero stale
   generated outputs.

## Verification commands

```bash
npm run generate:content
npm run check
npx playwright test tests/experience.spec.ts --grep 'video|store setup|marketplace|demos|protected|dispute'
npm run check:external-links
```

## Git checkpoints

- `0f3f078` — public commission and Peer-handle Draft RFCs.
- `479517c` — VIDEO-0 and VIDEO-1 registry/discovery implementation.
- `199fb65` — 0003 v8 and 0004 v2 focused films.
- `ec0b367` — stabilized search and full-page accessibility checks.
- `303e4dd` — VIDEO-2 contextual integration and VIDEO-3 evidence audit.
