---
title: OEM, appliance, and VPS distribution policy
summary: Distributors may package Mobazha with services while preserving source obligations, capability boundaries, secure first run, user control, and honest branding.
status: Current
audiences:
  - Operators
  - Distributors
  - Security reviewers
  - Agents
evidenceLabel: Standalone packaging and distribution checks
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/deploy/standalone
reviewed: 2026-07-04
pageType: policy
outcome: Package or operate a Mobazha distribution without weakening license, attribution, security, capability, or recovery boundaries.
estimatedTime: 10 minutes
journey: understand
primaryAction:
  label: Review permitted distribution
  href: /project/distribution#permitted-distribution
---

## Permitted distribution

An operator may package the default standalone deployment in hardware, an appliance, a VPS marketplace image, a container image, or a pre-installed server and may sell installation, hosting, support, or other identified services around it. Packaging does not silently widen the enabled capability set or create a new official Mobazha product.

## Required boundaries

- Do not include unapproved payment capabilities, provider credentials, private control-plane code, hidden support tooling, customer data, or pre-generated secrets.
- Preserve applicable licenses, notices, corresponding-source obligations, and third-party attribution for the exact artifact.
- Record the source commit or tag, capability manifest, SBOM, checksums, provenance, upgrade, backup, restore, reset, and export path.
- Generate seller identity, administrator credentials, and signing material on the user's system during first-run setup.
- Disclose update channels, signing keys, external endpoints, data handling, optional services, and how to disable them.
- Preserve local administration, listing management, data export, and supported standalone payment operation without requiring a Mobazha Hosting account.

## Branding and certification

Open-source licensing does not grant rights to Mobazha names, logos, or certification claims. Do not describe an image as Official or Mobazha Certified without separate written authorization. A future certification program may verify provenance, release material, capability boundaries, first-run security, updates, and recovery, but certification is not required to run or join the network.

## Operational evidence

The code repository owns the executable source-tree and artifact checks because they must run against an exact revision and release bundle. This page owns the public distribution policy; the scripts own whether an artifact satisfies their machine-verifiable requirements.

- [Self-host installation](/self-host/install)
- [Backup and upgrade](/self-host/backup-and-upgrade)
- [Legal, privacy, license, and trademark boundaries](/project/legal-and-privacy)
