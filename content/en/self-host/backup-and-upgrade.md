---
title: Back up and upgrade safely
summary: Treat upgrade readiness as a recoverability exercise, not only a package update.
status: Beta
audiences:
  - Operators
evidenceLabel: Mobazha operations guidance
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/docs/releases
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
outcome: Produce a verified backup and upgrade one reviewed release without losing a recoverable rollback point.
estimatedTime: 30–60 minutes
journey: operate
primaryAction:
  label: Prepare the recovery point
  href: /self-host/backup-and-upgrade#before-you-start
---

## Before you start

- Read release notes and identify schema, payment, capability, and configuration changes.
- Create a versioned backup and verify that it can be read.
- Record the running version and configuration; protect secrets separately.
- Plan rollback and a maintenance window before changing production.
- After upgrade, verify health, store access, order flows, and payment callbacks.

> **Warning:** A backup file is not a recovery plan until it has been inspected and restored in an isolated environment using a compatible release process.

## Backup and upgrade steps

1. Record the running binary version or commit, service arguments, data directory, configuration, and effective capabilities.
2. Read both Node and client release notes and identify migrations, removed flags, payment changes, and compatibility requirements.
3. Run diagnostics and resolve existing corruption, storage, or dependency failures before upgrading.
4. Stop or quiesce writes according to the release procedure and create a timestamped backup.
5. Copy the backup and required recovery material to a separately protected location.
6. Test the new release against representative data in an isolated environment.
7. Schedule a maintenance window, install the reviewed artifact, and start the service.
8. Verify diagnostics, storefront, administration, order reads, payment observation, webhook delivery, and backup creation.

## Built-in commands

Run diagnostics and create a compressed backup before a release change.

```text
./mobazha doctor --json
./mobazha backup --output mobazha-backup.tar.gz
```

The backup command reports the resolved source and output path, then the final
archive size. Paths and size are deployment-specific.

```text
Backing up <data-dir> → <absolute-output-path>/mobazha-backup.tar.gz
Backup complete: <absolute-output-path>/mobazha-backup.tar.gz (<size> MB)
```

## Expected result and verification

The backup command should finish without error and produce a non-empty archive at the requested path. Record its size, creation time, source version, and a cryptographic checksum. Keep secrets and recovery material under a separate access policy even when the archive contains encrypted data.

After upgrade, compare effective capabilities and complete a small testnet journey. Do not declare success from process health alone.

## Recovery and rollback

The current release candidate does not publish a universal one-command restore promise for every historical version. Use release-specific migration and restore guidance, preserve the original backup, and practice on a separate data directory first. Roll back only when the older binary supports the resulting data format.

- If startup fails after upgrade, stop repeated writes and preserve logs and the upgraded data copy.
- If a migration is one-way, restore the pre-upgrade backup rather than opening migrated data with an older binary.
- If orders or payments disagree, keep financial automation fail closed while reconciling state.
- Report missing restore instructions as a release blocker, not as an operator detail to improvise in production.
