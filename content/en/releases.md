---
title: Releases
summary: Use repository releases for exact versions, migration notes, checksums, and known issues.
status: Current
audiences:
  - Operators
  - Developers
evidenceLabel: Mobazha GitHub releases
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/docs/releases
reviewed: 2026-07-04
---

## Current release candidate

v0.3 is intended for evaluation and testnet use. Stable binaries and signed release artifacts have not been published yet. The first release enables BTC, BCH, and LTC by default, subject to the full effective-capability intersection and seller configuration.

## Before adopting a release

- Confirm the repository, version, publication date, and artifact integrity.
- Read breaking changes, migrations, capability changes, and known issues.
- Test backup and rollback procedures in an environment representative of production.

## Documentation release gate

Node and Unified tag workflows verify that a versioned release note exists,
required public guidance is reachable, and the documentation source manifest
reviews the exact commit being tagged. A tag must not create a release while
its public instructions still describe a different source revision.

This gate establishes documentation readiness; it does not replace tests,
artifact provenance, signatures, SBOM review, migration validation, or runtime
capability checks.

## Release sources

- [Mobazha Node release notes](https://github.com/mobazha/mobazha/tree/main/docs/releases)
- [Mobazha Unified release notes](https://github.com/mobazha/mobazha-unified/tree/main/docs/releases)
- [Published GitHub releases](https://github.com/mobazha/mobazha/releases)
- [Reviewed public source revisions](/sources.json)
