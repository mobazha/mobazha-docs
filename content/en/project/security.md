---
title: Project security model
summary: Security depends on explicit authority, fail-closed capabilities, protected signing material, hostile-input assumptions, and private disclosure.
status: Beta
audiences:
  - Operators
  - Developers
  - Security reviewers
  - Evaluators
sourceLabel: Mobazha public security sources
sourceUrl: https://github.com/mobazha/mobazha/blob/main/SECURITY.md
reviewed: 2026-07-04
---

## Trust boundaries

- The backend that owns an order is authoritative for its state and protected transitions.
- The client is untrusted input and a presentation layer; hiding a control never replaces server authorization.
- Payment rails, RPCs, indexers, plugins, webhooks, media, and delivery systems are external dependencies with their own failure and threat models.
- Extensions receive minimum typed projections and scoped handles, not general database or Core access.
- Sensitive actions remain auditable without placing secrets or unnecessary personal data in logs.

## Release and supply chain

The current release is a pre-release candidate. Final artifacts require vulnerability scanning, dependency and license review, SBOM generation, checksums, provenance, reproducibility evidence, secret scans, and platform-specific validation.

- [Node supply-chain audit](https://github.com/mobazha/mobazha/blob/main/docs/security/SUPPLY_CHAIN_AUDIT.md)
- [Unified supply-chain audit](https://github.com/mobazha/mobazha-unified/blob/main/docs/security/SUPPLY_CHAIN_AUDIT.md)
- [Operator security](/self-host/security)

## Security reporting

Use the affected repository's GitHub private vulnerability reporting. Do not publish exploit details, leaked credentials, signing-key concerns, or customer data in issues, chat, or documentation feedback.
