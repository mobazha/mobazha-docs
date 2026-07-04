---
title: Operate your own Mobazha Node
summary: Self-hosting keeps store data and operations under the operator's control and does not require an optional managed-service subscription.
status: Beta
audiences:
  - Operators
  - Developers
sourceLabel: Mobazha deployment sources
sourceUrl: https://github.com/mobazha/mobazha/tree/main
reviewed: 2026-07-04
---

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
