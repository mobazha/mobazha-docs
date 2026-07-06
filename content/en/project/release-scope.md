---
title: Release scope and maturity
summary: The documentation distinguishes current release-candidate behavior from previews and future design.
status: Beta
audiences:
  - Everyone
evidenceLabel: Mobazha releases and repository documentation
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/docs/releases
reviewed: 2026-07-06
pageType: policy
outcome: Separate current v0.3 release-candidate behavior from stable guarantees, optional composition, proposals, and future targets.
estimatedTime: 8 minutes
journey: understand
primaryAction:
  label: Review the current release boundary
  href: /project/release-scope#current-v0-3-release-candidate-boundary
---

## Status vocabulary

- Current: reviewed public policy or stable project fact.
- Beta: available or being validated; compatibility and behavior may change.
- Draft: proposal or documentation contract; do not depend on it as shipped behavior.
- Historical: retained for context and explicitly superseded.

## Current v0.3 release-candidate boundary

- Mobazha Node and Mobazha Unified are release candidates for evaluation and testnet use.
- The default open-source Node enables BTC, BCH, and LTC payment methods, subject to effective runtime capabilities and seller configuration.
- Identifiers or adapters present in source do not enable a payment method or create a compatibility commitment.
- Stable signed binaries and reproducibility attestations remain pending final release approval.
- Clients must fail closed when a valid runtime-capability snapshot is unavailable.
- English is the default repository-documentation language unless a maintained translation is explicitly identified.

- [Community capability manifest](https://github.com/mobazha/mobazha/blob/main/config/editions/community.json) — Machine-readable release evidence.
- [Node v0.3.0-rc.1 notes](https://github.com/mobazha/mobazha/blob/main/docs/releases/v0.3.0-rc.1.md)
- [Unified v0.3.0-rc.1 notes](https://github.com/mobazha/mobazha-unified/blob/main/docs/releases/v0.3.0-rc.1.md)

## Reliance guide

| Question | Current answer | What to verify |
|---|---|---|
| Can I evaluate the open-source Node? | Yes, from reviewed public source on a supported environment | Exact commit, build prerequisites, testnet profile, diagnostics, and backup |
| Can I use the hosted application? | Yes, as a Beta service | Current terms, privacy, pricing, service status, and deployment capabilities |
| Are BTC, BCH, and LTC always available? | No. They are in the default release boundary, but effective availability remains conditional | Runtime capability, seller configuration, dependency health, quote, and payment instruction |
| Is every API or UI element a supported feature? | No | Generated contract, runtime capability, authorization, configuration, and release notes |
| Are stable installers and unattended updates a current guarantee? | No | Signed artifact, checksum, provenance, platform validation, rollback, and final release notice |
| Is optional Node-to-account binding stable? | No; its public contract remains Draft | Published permissions, exchanged data, revocation, tests, and version compatibility |

For material use, require a tagged release and its evidence rather than inferring readiness from a `main` branch, screenshot, design document, or feature name.

## What remains version-specific

Exact checksums, artifacts, known issues, migration steps, SBOMs, provenance, and implementation commits belong to each tagged repository release. This page governs shared maturity language and the current public boundary; it does not replace release evidence.
