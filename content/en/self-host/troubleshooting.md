---
title: Troubleshoot a Mobazha Node
summary: Diagnose version, process, health, capability, configuration, and dependency failures without exposing sensitive data.
status: Beta
audiences:
  - Operators
  - Support
evidenceLabel: Mobazha Node operations commands
evidenceUrl: https://github.com/mobazha/mobazha#operations
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
outcome: Isolate one failing boundary and preserve a reproducible, sanitized test before making recovery changes.
estimatedTime: 10–30 minutes
journey: operate
primaryAction:
  label: Capture the starting state
  href: /self-host/troubleshooting#before-you-start
---

## Before you start

Create or locate a current backup before changing data, flags, versions, or payment configuration. Record the exact symptom, first occurrence, recent changes, version, platform, network mode, and intended data directory.

## Diagnostic steps

1. Confirm binary version, start flags, data directory, network mode, system time, and available disk space.
2. Check service status and diagnostics without exposing secrets.
3. Test the local UI and runtime endpoint before external DNS, proxy, or browser layers.
4. Compare advertised runtime capabilities with the failing operation.
5. Separate Node failure from RPC, indexer, network, payment provider, webhook consumer, or browser failure.
6. Reproduce one smallest failing request or UI journey and preserve its sanitized identifiers.

## First checks

- Confirm the binary version, start flags, data directory, network mode, and system clock.
- Check that the local UI and health endpoint respond before testing external DNS or proxies.
- Compare the advertised runtime capabilities with the operation that is failing.
- Separate node failure from RPC, indexer, network, payment provider, webhook consumer, or browser failure.

```text
./mobazha service status
./mobazha doctor
./mobazha doctor --json
```

| Symptom | First boundary to check | Avoid |
|---|---|---|
| Process will not start | data-directory ownership, port, disk, prior process | deleting the profile |
| Local UI unavailable | loopback listener and process health | changing public DNS first |
| Capability missing | runtime snapshot, configuration, dependency health | enabling frontend-only flags |
| Payment not detected | order, asset, address, amount, expiry, RPC health | sending a second payment |
| Webhook delayed | delivery history, endpoint response, signature handling | treating duplicates as new state |

## Safe evidence for support

- Record the exact version or commit, operating system, reproduction steps, expected result, and sanitized error.
- Include request, event, or order identifiers only when they do not expose customer data or secrets.
- Remove tokens, private endpoints, seeds, keys, wallet recovery material, raw customer data, and full production databases.
- For a suspected security issue, stop public discussion and use private vulnerability reporting.

## Recovery before experimentation

Create and verify a backup before changing data, flags, versions, or payment configuration. Prefer a reproducible rollback over repeated manual mutation of the only copy of a store.

```text
./mobazha backup --output mobazha-backup.tar.gz
```

## Expected result and verification

A diagnosis should identify the failing boundary and a reproducible test, not merely make the symptom disappear. After a change, rerun diagnostics and the smallest affected journey, then confirm unrelated order and payment paths remain stable.

## If something fails

- Stop after two unexplained retries and preserve the original evidence.
- Revert the last known configuration change when the rollback is understood.
- Do not edit Core order or payment tables to force a state transition.
- Escalate security concerns privately and operational defects through the Node issue tracker.

## Get help

- [Public support paths](/support)
- [Node issues](https://github.com/mobazha/mobazha/issues)
