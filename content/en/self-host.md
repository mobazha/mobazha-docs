---
title: Run a Mobazha Node under your control
summary: Evaluate requirements, install on testnet, define the network boundary, monitor health, and prepare recovery before production use.
status: Beta
audiences:
  - Operators
  - Developers
evidenceLabel: Mobazha deployment sources
evidenceUrl: https://github.com/mobazha/mobazha/tree/main
reviewed: 2026-07-04
pageType: hub
outcome: Decide whether self-hosting fits, then reach a healthy and recoverable evaluation Node.
journey: operate
primaryAction:
  label: Check the requirements
  href: /self-host/requirements
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

## Operator responsibilities

- Secure the host, administrator access, secrets, and network boundary.
- Back up data and recovery material before upgrades.
- Monitor storage, availability, payment integrations, and release notes.
- Expose only the interfaces your users and agents actually need.

## Optional hosted connection

An operator may bind a self-hosted node to an optional Mobazha account for hosted capabilities when offered. Binding does not transfer custody of local recovery material and is not required for independent operation.

- [Connect an optional hosted account](/self-host/bind-account)
