---
title: Run a Mobazha Node under your control
summary: Evaluate requirements, install on testnet, define the network boundary, monitor health, and prepare recovery before production use.
status: Beta
audiences:
  - Operators
  - Developers
evidenceLabel: Mobazha deployment sources
evidenceUrl: https://github.com/mobazha/mobazha/tree/main
reviewed: 2026-07-06
pageType: hub
outcome: Decide whether self-hosting fits, then reach a healthy and recoverable evaluation Node.
estimatedTime: 6 minutes
journey: operate
primaryAction:
  label: Check the requirements
  href: /self-host/requirements
featuredVisual: self-host-trust-boundary
---

## Choose the operating path

- [Check host and release requirements](/self-host/requirements)
- [Install an evaluation node](/self-host/install)
- [Configure the node](/self-host/configure)
- [Set the network and TLS boundary](/self-host/network-and-tls)
- [Add monitoring and health checks](/self-host/monitoring)
- [Back up, upgrade, and recover](/self-host/backup-and-upgrade)
- [Apply the security model](/self-host/security)
- [Diagnose a node](/self-host/troubleshooting)

## Evaluation quick start

The current release candidate requires Go 1.26.4, Git, and a supported macOS or Linux environment. Use testnet while evaluating payment flows.

```text
git clone --branch main https://github.com/mobazha/mobazha.git
cd mobazha
go build -tags goolm -o mobazha .
./mobazha init --testnet
./mobazha start --testnet --open
```

> **Important:** v0.3 is for evaluation and testnet use. Stable binaries and signed release artifacts have not yet been published.

## What a ready evaluation Node looks like

| Boundary | Evidence to keep |
|---|---|
| Build and identity | Exact source commit, build command, version, service account, network, and data directory |
| Local health | Successful service status, `doctor --json`, embedded UI, and runtime-config checks |
| Exposure | Intended listener, firewall, proxy, DNS, and TLS configuration with no accidental public administrator surface |
| Commerce | One disposable listing, quote, payment-observation, fulfillment, and recovery journey on supported testnet rails |
| Recovery | Timestamped backup plus an isolated restore test using a compatible build |
| Operations | Named alert recipient, update owner, rollback owner, and a safe first response for storage, dependency, and payment failures |

Booting the process is only the first proof. A Node is not operationally ready when its only store copy is on the running host, when runtime capabilities are assumed from source code, or when no one owns an alert or rollback.

## Operator responsibilities

- Secure the host, administrator access, secrets, and network boundary.
- Back up data and recovery material before upgrades.
- Monitor storage, availability, payment integrations, and release notes.
- Expose only the interfaces your users and agents actually need.

## Operating loop

1. **Before accepting work:** confirm health, storage, backup age, effective capabilities, and external payment or delivery dependencies.
2. **During an incident:** stop advertising unavailable new work, preserve current order evidence, and isolate the failing boundary before retrying.
3. **Before an upgrade:** read release evidence, make and test a recovery point, and define the maintenance and rollback decision.
4. **After a change:** verify diagnostics and one representative buyer, seller, payment, webhook, and recovery path affected by the change.

- [Monitor the Node](/self-host/monitoring)
- [Back up and upgrade safely](/self-host/backup-and-upgrade)
- [Troubleshoot without destroying evidence](/self-host/troubleshooting)

## Optional hosted connection

An operator may bind a self-hosted node to an optional Mobazha account for hosted capabilities when offered. Binding does not transfer custody of local recovery material and is not required for independent operation.

- [Connect an optional hosted account](/self-host/bind-account)
