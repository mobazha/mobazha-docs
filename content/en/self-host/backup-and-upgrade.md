---
title: Back up and upgrade safely
summary: Treat upgrade readiness as a recoverability exercise, not only a package update.
status: Beta
audiences:
  - Operators
sourceLabel: Mobazha operations guidance
sourceUrl: https://github.com/mobazha/mobazha/tree/main/docs/releases
reviewed: 2026-07-04
---

## Minimum upgrade gate

- Read release notes and identify schema, payment, capability, and configuration changes.
- Create a versioned backup and verify that it can be read.
- Record the running version and configuration; protect secrets separately.
- Plan rollback and a maintenance window before changing production.
- After upgrade, verify health, store access, order flows, and payment callbacks.

## Built-in operational commands

Run diagnostics and create a compressed backup before a release change.

```text
./mobazha doctor --json
./mobazha backup --output mobazha-backup.tar.gz
```
