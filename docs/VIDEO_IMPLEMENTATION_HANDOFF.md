# Video implementation handoff

- Updated: 2026-07-19
- Repository: `mobazha/mobazha-docs`
- Branch: `main`
- Current deployed implementation baseline: `303e4dd`
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

## Current work

VIDEO-2 is implemented in the working tree. Its vertical slice:

1. resolves `!video-ref[NNNN]` against the public registry and defaults to a
   lightweight poster link without repeating an R2 URL in a task page;
2. places 0004 on `/sell/store-setup`;
3. places 0001 on `/sell/marketplace-participation` and
   `/project/community-commerce`;
4. places 0003 on the stable `/sell` seller journey hub until a dedicated
   seller-growth task has a reviewed owner;
5. preserves complete text instructions when video playback is unavailable;
6. supports optional validated WebVTT caption tracks on the canonical detail
   player without claiming that captions already exist.

The read-only VIDEO-3 evidence audit is complete. Do not create a registry
record, media file, or R2 URL until the remaining live-browser and delivered-
artifact gates below establish a recordable observable payoff.

## VIDEO-3 evidence audit

Audit completed on 2026-07-19 against:

- `mobazha-e2e@bcbc8ef641dfb759155cc07090bda875770edb92`;
- `mobazha-unified@afb94e26410d60fe760e96e48c779261cbd36a54`;
- the current `mobazha_hosting/docs/demos` portfolio, which contains no new
  Protected Deal or dispute manifest.

Findings:

1. `TestE2E_DealLink_SafeFinalSettlementAction` is the strongest next-story
   foundation. It combines Deal acceptance, an exact Safe payment on local
   Anvil, confirmed `safe_deploy` and `confirm` settlement actions, automatic
   digital entitlement, `SHIPPED`, and buyer completion.
2. Its digital asset is still seeded as an `example.com` link. The entitlement
   and shipment facts are real, but the viewer cannot yet inspect a meaningful,
   deterministic delivered artifact.
3. Unified has public Deal, payment, order, and buyer digital-asset surfaces,
   but there is no live browser recording harness that drives the same backend
   transaction. Current Deal administration visual coverage uses mocked APIs.
4. `TestE2E_SafeModerated_DisputeAndResolve` proves a real local-chain Safe
   deposit, buyer evidence, moderator 60/40 ruling, dispute-release settlement
   action, and final `RESOLVED` projections.
5. Unified has dispute and moderator ruling UI, but current browser dispute
   capture coverage is primarily fixture-backed rather than the same live
   transaction. There is no recording manifest or live multi-role harness.

Decision: VIDEO-3 does not advance to recording yet. The next implementation
slice is one Protected Deal live browser harness plus a deterministic delivered
artifact. Only after it passes should a hosting manifest be allocated and a
recording brief approved. The dispute story remains second priority.

## VIDEO-2 verification

- `npm run generate:content`: passed.
- `npm run check`: passed, including content, records, freshness, visual
  evidence, OpenAPI, lint, and production build.
- Targeted desktop/mobile Playwright checks: 14 passed, 2 expected skips.
- `npm run check:external-links`: 113 checked, 0 failed.
- Human responsive review at 1280×720 and 390×844: the contextual card is
  readable, has no page-level overflow, links to the canonical detail page,
  and adds no inline `<video>` element.

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
npx playwright test tests/experience.spec.ts --grep 'video|store setup|marketplace'
npm run check:external-links
```

## Git checkpoints

- `0f3f078` — public commission and Peer-handle Draft RFCs.
- `479517c` — VIDEO-0 and VIDEO-1 registry/discovery implementation.
- `199fb65` — 0003 v8 and 0004 v2 focused films.
- `ec0b367` — stabilized search and full-page accessibility checks.
- `303e4dd` — VIDEO-2 contextual integration and VIDEO-3 evidence audit.
