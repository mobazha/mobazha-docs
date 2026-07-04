---
title: Configure a self-hosted node
summary: Make deployment mode, data location, network exposure, payments, and external dependencies explicit and recoverable.
status: Beta
audiences:
  - Operators
evidenceLabel: Mobazha Node command and deployment sources
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
outcome: Run one explicit Node profile whose data, listener, dependencies, backup, and rollback owner are known.
estimatedTime: 20–40 minutes
journey: operate
primaryAction:
  label: Record the deployment profile
  href: /self-host/configure#before-you-start
---

## Before you start

Use a dedicated data directory and testnet while learning the operational model. Record the exact binary commit, flags, configuration, and external dependencies alongside the backup procedure.

```text
./mobazha init --testnet --datadir /path/to/mobazha-data
./mobazha start --testnet --datadir /path/to/mobazha-data --open
```

Create a backup before changing a non-disposable profile. Record the binary commit, network, data directory, listener, reverse proxy, DNS, certificates, payment dependencies, and rollback owner.

## Configuration steps

1. Select one explicit data directory and restrict it to the service account.
2. Keep the administrative listener on loopback or a trusted private network.
3. Configure an authenticated TLS reverse proxy only when remote administration is required.
4. Enable payment and extension dependencies one at a time and inspect health after each change.
5. Configure backup destination, monitoring, log retention, and upgrade ownership.
6. Restart through the supported service command and re-run diagnostics.

## Security and dependency checklist

- Bind administrative interfaces to trusted networks unless an authenticated reverse proxy and TLS boundary are intentionally configured.
- Enable only payment methods reported by the effective runtime capability set and configured by the seller.
- Treat RPC, indexer, webhook, plugin, and remote media inputs as untrusted dependencies.
- Keep secrets outside source control and separate recovery material from ordinary service configuration.
- Document DNS, firewall, proxy, certificate, backup, monitoring, and rollback ownership before production use.

## Expected result and verification

A source file, recognized identifier, frontend component, or configuration field does not prove a capability is active. Effective availability is the intersection of distribution allowlist, contract compatibility, installation or composition, authorization, configuration, and health.

```bash
./mobazha service status
./mobazha doctor --json
curl -fsS http://127.0.0.1:5102/v1/runtime-config | jq
```

Confirm the process uses the intended data directory and network, the local UI is reachable, effective capabilities match configured dependencies, and no administrative interface is unintentionally public.

- [Runtime capabilities](/build/runtime-capabilities)
- [Compatibility policy](/project/compatibility)

## If something fails

- Roll back the last configuration change instead of changing several variables at once.
- If the Node reads another profile, stop it and verify service arguments before writing new data.
- If remote access fails, re-test loopback health before debugging proxy or DNS layers.
- If a capability becomes unhealthy, stop advertising new work and preserve recovery for existing orders.
- Restore from a verified backup only through a release-compatible procedure.
