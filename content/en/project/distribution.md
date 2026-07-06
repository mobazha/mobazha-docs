---
title: How Mobazha can be packaged and operated
summary: Compare source-built Nodes, hosted services, standalone packaging, and third-party appliances without confusing packaging with capability or official status.
status: Current
audiences:
  - Sellers
  - Operators
  - Distributors
  - Security reviewers
  - Evaluators
  - Agents
evidenceLabel: Standalone packaging, distribution policy, release, and supply-chain checks
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/deploy/standalone
reviewed: 2026-07-06
pageType: policy
outcome: Choose or publish a Mobazha distribution while preserving capability truth, secure first run, user control, recovery, licensing, and honest branding.
estimatedTime: 10 minutes
journey: understand
primaryAction:
  label: Compare distribution forms
  href: /project/distribution#distribution-forms
---

## Where this page fits

A **distribution** is a tested assembly of Mobazha Core, adapters, frontend, configuration, packaging, update channel, and operating assumptions. It is not a new commerce protocol merely because it has a different installer, brand, host, or feature set.

| Question | Source |
|---|---|
| Should I use hosted or self-hosted operation? | [Choose a deployment](/start/choose-deployment) |
| Which systems own state and dependencies? | [System architecture](/project/architecture) |
| Is this package allowed and honestly described? | This page |
| Is the artifact ready and compatible? | [Release scope](/project/release-scope), release evidence, and [compatibility](/project/compatibility) |
| How do I install and recover a Node? | [Self-host guide](/self-host) |

## Distribution forms

| Form | Who operates it? | Current meaning | Main responsibility |
|---|---|---|---|
| Community source build | Independent seller or operator | Public release-candidate source can be built and evaluated on supported environments | Host, secrets, network, data, backup, updates, integrations, and incident response |
| Mobazha hosted service | Mobazha or the named hosted operator | A Beta service operates the applicable commercial distribution and managed infrastructure | Service terms, availability, tenant isolation, data handling, pricing, export, and support |
| Standalone installer or launcher | Independent operator after installation | Packaging and update mechanisms may exist in pre-release form; stable signed artifacts require release evidence | Artifact integrity, first run, update approval, rollback, and local recovery |
| Container, VPS image, or appliance | Independent distributor or operator | Permitted packaging when licenses, security, capability, provenance, and recovery rules are preserved | Secure image construction, disclosures, updates, support, and source obligations |
| Branded or vertical distribution | Its named operator | May select a profile, brand, integrations, and service bundle without creating new Core authority | Honest branding, compatible contracts, explicit local features, and no false official claim |

The current v0.3 line is intended for evaluation and testnet use. Packaging source or an installation script does not prove that stable signed binaries, automatic updates, or production support have been released.

## What may differ and what must not

| A distribution may choose | A distribution must preserve |
|---|---|
| Hosted or self-hosted operating model | Order-owning backend and Core state authority |
| Included public adapters and build-time features | Effective capability discovery and fail-closed behavior |
| Store, marketplace, embedded, or vertical presentation | Backend authorization and protected state transitions |
| Brand, domain, theme, support, and pricing | Honest provider, payer, recipient, data, and responsibility disclosure |
| Infrastructure providers and update channel | Artifact provenance, secret safety, backup, restore, export, and rollback |
| Distribution-local features | Public contract compatibility and clear separation from Mobazha project policy |

A frontend switch, bundled adapter, or product name cannot widen what the backend safely implements. A distributor may add services, but it must name the provider and must not hide external dependencies or move financial authority into presentation code.

## Choose a distribution as a user

Before trusting a package or hosted service, ask:

1. Who publishes and operates it, and is it claiming to be official?
2. Which exact Mobazha version, source revision, capability manifest, and frontend does it contain?
3. Which services are local, hosted, third-party, optional, or required?
4. Where are store data, identity keys, payment credentials, and recovery material held?
5. How are first-run credentials generated, updates verified, backups created, data exported, and failures rolled back?
6. Which fees, limits, support terms, and external endpoints apply?
7. What happens to the store and existing orders if the distributor or an optional service disappears?

If the publisher cannot answer those questions, the convenience of an installer does not establish trust.

## Requirements for distributors

### Build and provenance

- Record the exact source commit or tag, build inputs, capability manifest, frontend revision, licenses, SBOM, checksums, provenance, and test results.
- Do not include unapproved payment capabilities, private control-plane code, hidden support access, customer data, provider credentials, or pre-generated user secrets.
- Preserve corresponding-source, notice, attribution, and third-party-license obligations for the exact artifact.

### Secure first run

- Generate administrator credentials, store identity, signing material, and local secrets on the user's system or through an explicitly disclosed managed boundary.
- Start with the smallest network exposure and require deliberate TLS, proxy, firewall, domain, and remote-administration configuration.
- Make external endpoints, telemetry, update checks, and optional hosted connections visible and disable-able where the contract allows.

### Updates and recovery

- Sign and publish update metadata through a documented channel; verify integrity before replacement.
- Explain whether updates are automatic, prompted, operator-controlled, or unavailable.
- Back up before migration, preserve a compatible rollback point, test restore, and document reset and export paths.
- Keep historical provider bindings and existing-order recovery serviceable when a new capability is disabled.

### Product truth

- Advertise only effective capabilities included, configured, authorized, healthy, and tested in that distribution.
- Separate Mobazha project policy from distributor terms, pricing, privacy, support, and local feature commitments.
- Do not call a package Official, Certified, audited, production-ready, or compatible without the evidence and authorization required by that claim.

## Branding and certification

Open-source licensing does not grant rights to Mobazha names, logos, or certification claims. A third-party image can accurately say that it includes Mobazha and identify its source revision, but it cannot imply that Mobazha operates, endorses, audits, or supports the package without separate authorization.

A future certification program may check provenance, release material, capability truth, first-run security, update behavior, recovery, and compatibility. Certification is not required to run compatible software or participate through public contracts; until such a program is published, “Mobazha Certified” is not a valid public status.

## Verify before material use

1. Install into a disposable or testnet environment.
2. Verify artifact identity, local listeners, runtime profile, advertised capabilities, and external connections.
3. Create a store and complete one representative listing, quote, payment, fulfillment, and recovery journey.
4. Create and restore a backup using the documented compatible release.
5. Exercise an update and rollback decision without deleting the only store copy.
6. Record the operator, support route, recurring costs, and incident owner before accepting material transactions.

- [Install a self-hosted Node](/self-host/install)
- [Monitor a Node](/self-host/monitoring)
- [Back up and upgrade](/self-host/backup-and-upgrade)
- [Review legal, privacy, license, and trademark boundaries](/project/legal-and-privacy)
