---
title: Release scope and maturity
summary: The documentation distinguishes current release-candidate behavior from previews and future design.
status: Beta
audiences:
  - Everyone
evidenceLabel: Mobazha releases and repository documentation
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/docs/releases
reviewed: 2026-07-04
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

## What remains version-specific

Exact checksums, artifacts, known issues, migration steps, SBOMs, provenance, and implementation commits belong to each tagged repository release. This page governs shared maturity language and the current public boundary; it does not replace release evidence.
