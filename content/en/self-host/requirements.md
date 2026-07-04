---
title: Self-hosting requirements and readiness
summary: Confirm platform, ownership, recovery, network, and operational capacity before installing a Mobazha Node.
status: Beta
audiences:
  - Operators
  - Evaluators
evidenceLabel: Node build and standalone deployment sources
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-04
pageType: policy
---

## Current software baseline

| Requirement | Release-candidate baseline | Why it matters |
|---|---|---|
| Operating system | Supported macOS or Linux environment | Current source-build and service paths are validated there |
| Go | 1.26.4 | Matches the public build workflow |
| Git | Current supported client | Records exact source revision |
| Network | Testnet during evaluation | Avoids treating pre-release behavior as production-ready |
| Listener | Loopback by default | Keeps the administrative boundary private |

Exact CPU, memory, storage, and bandwidth depend on listings, media, order volume, retained data, integrations, and uptime goals. Measure representative load instead of treating a minimum boot configuration as production sizing.

## Operational ownership

- Name who patches the host, controls administrator access, monitors health, and responds to payment or order incidents.
- Define data retention, backup frequency, restore testing, recovery objectives, and off-host storage.
- Identify DNS, TLS, reverse proxy, firewall, RPC, indexer, webhook, and payment-provider owners.
- Maintain a test environment representative of the production deployment.
- Keep recovery material accessible to authorized operators without placing it in source control or routine logs.

## Readiness decision

Use hosted evaluation when you cannot yet own host security, backup, monitoring, updates, and incident response. Use self-hosting when control and portability justify those responsibilities and the team can prove recovery before accepting material transactions.

- [Install a Node](/self-host/install)
- [Configure securely](/self-host/configure)
- [Back up and upgrade](/self-host/backup-and-upgrade)
