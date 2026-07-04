---
title: Configure a self-hosted node
summary: Make deployment mode, data location, network exposure, payments, and external dependencies explicit and recoverable.
status: Beta
audiences:
  - Operators
sourceLabel: Mobazha Node command and deployment sources
sourceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-04
---

## Start with an isolated profile

Use a dedicated data directory and testnet while learning the operational model. Record the exact binary commit, flags, configuration, and external dependencies alongside the backup procedure.

```text
./mobazha init --testnet --datadir /path/to/mobazha-data
./mobazha start --testnet --datadir /path/to/mobazha-data --open
```

## Configuration checklist

- Bind administrative interfaces to trusted networks unless an authenticated reverse proxy and TLS boundary are intentionally configured.
- Enable only payment methods reported by the effective runtime capability set and configured by the seller.
- Treat RPC, indexer, webhook, plugin, and remote media inputs as untrusted dependencies.
- Keep secrets outside source control and separate recovery material from ordinary service configuration.
- Document DNS, firewall, proxy, certificate, backup, monitoring, and rollback ownership before production use.

## Capability truth

A source file, recognized identifier, frontend component, or configuration field does not prove a capability is active. Effective availability is the intersection of distribution allowlist, contract compatibility, installation or composition, authorization, configuration, and health.

- [Runtime capabilities](/build/runtime-capabilities)
- [Compatibility policy](https://github.com/mobazha/mobazha/blob/main/docs/project/COMPATIBILITY.md)
