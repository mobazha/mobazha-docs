---
title: Secure a self-hosted node
summary: Protect the host, administrative boundary, signing material, payment integrations, backups, and recovery path as one system.
status: Beta
audiences:
  - Operators
  - Security reviewers
evidenceLabel: Mobazha security policy and extension security model
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/SECURITY.md
reviewed: 2026-07-04
---

## Minimum operator baseline

- Use a dedicated, patched host and least-privilege service account.
- Keep admin APIs private by default; add TLS, authentication, rate limits, and network policy before remote exposure.
- Protect seed phrases, private keys, API tokens, webhook secrets, and backups independently.
- Review every chain RPC, indexer, plugin, webhook, and delivery integration as a hostile input boundary.
- Monitor health, storage, failed authentication, payment observation, webhook delivery, and unexpected capability changes.
- Test restore and rollback before a release or infrastructure change.

## Financial boundaries

- Only Core policy may change payment, refund, dispute, or settlement state.
- Extensions and external services must not receive raw seed phrases or private keys.
- A payment observation is not permission to settle; expected state, identity, amount, confirmations, and idempotency still apply.
- Disabling an unhealthy capability must fail closed rather than silently select a different financial behavior.

## Report vulnerabilities privately

Do not open a public issue for a suspected vulnerability, leaked credential, signing-key concern, or exploit. Use GitHub private vulnerability reporting from the affected repository's Security tab.

- [Node security policy](https://github.com/mobazha/mobazha/security/policy)
- [Supply-chain audit baseline](https://github.com/mobazha/mobazha/blob/main/docs/security/SUPPLY_CHAIN_AUDIT.md)
