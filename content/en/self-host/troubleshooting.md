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
---

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

## Get help

- [Public support paths](/support)
- [Node issues](https://github.com/mobazha/mobazha/issues)
