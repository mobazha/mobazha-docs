---
title: Choose hosted or self-hosted Mobazha
summary: Choose the backend operator from control and responsibility, then decide whether bounded hosted or third-party services should complement that backend.
status: Beta
audiences:
  - Sellers
  - Operators
  - Evaluators
  - Agents
evidenceLabel: Mobazha public product and release boundaries
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/README.md
reviewed: 2026-07-06
pageType: concept
outcome: Choose hosted or self-hosted operation from the control you need, and understand when a hybrid composition adds services without changing order authority.
estimatedTime: 5 minutes
journey: start
primaryAction:
  label: Apply the decision rule
  href: /start/choose-deployment#decision-rule
---

## Hosted service

Use the hosted application when you want to evaluate Mobazha or operate a store without maintaining the underlying server. The service operator manages availability, deployment, and the hosted account boundary; current Beta pricing and limits are published separately.

- Fastest path to the current buyer and seller experience.
- Service availability, data handling, limits, and future pricing depend on the hosted terms.
- Runtime capabilities still determine which commerce and payment paths are available.

- [Open Mobazha](https://app.mobazha.org)
- [Current pricing](https://mobazha.org/pricing)
- [Privacy policy](https://mobazha.org/privacy)

## Self-hosted node

Use the open-source Node when you need direct control over deployment, store data, domain, availability, backup, and enabled integrations. You operate the machine and remain responsible for security, recovery, upgrades, and third-party costs.

- No mandatory central Mobazha transaction fee is created merely by running the software.
- The current v0.3 line is a release candidate intended for evaluation and testnet use.
- BTC, BCH, and LTC are enabled by the default release boundary, subject to runtime and seller configuration.

- [Install a node](/self-host/install)
- [Review operator security](/self-host/security)

## Responsibility comparison

| Decision area | Hosted service | Self-hosted Node |
|---|---|---|
| Server availability and updates | Managed by the hosted service operator under its published terms | Owned by your operator, including maintenance windows and rollback |
| Domain and network boundary | Use the service's supported public entry points | You own DNS, TLS, reverse proxy, firewall, and exposure decisions |
| Store data and recovery | Governed by the hosted service's export, retention, privacy, and recovery terms | You own backup frequency, off-host copies, restore tests, and recovery access |
| Integrations | Limited to capabilities exposed by the hosted deployment | Configurable within the Node's released contracts and effective capabilities |
| Service cost | Use the current hosted pricing and applicable provider charges | No mandatory Mobazha transaction fee merely for running the software; infrastructure and third-party costs remain yours |
| Best first proof | Complete a disposable buyer-and-seller journey and inspect service terms | Start locally on testnet, then prove diagnostics, backup, restore, and one complete commerce journey |

Neither model makes every payment rail, extension, or marketplace capability available. The connected backend's runtime response, the seller's configuration, and the current release contract remain authoritative.

## Hybrid use is composition, not a third owner

Hybrid use means an independently or commercially operated store backend participates in the wider store network or calls selected external capabilities. It is not a third deployment type and it does not split one order across several authoritative databases.

Examples include:

- a self-hosted store appearing in a community or hosted discovery surface;
- an independently operated Node using a named payment, delivery, messaging, index, AI, or support service;
- hosted and self-hosted stores exchanging permitted discovery, signed-content, messaging, or commerce protocol requests;
- a hosted storefront or direct link resolving a buyer to the seller backend that actually owns the order.

For every connection, record the provider, exchanged data, price, capability, outage behavior, exit path, and the backend that remains responsible for store and order state. A convenient channel or gateway must not silently become a second transaction authority.

- [Compare direct P2P and Hybrid topologies](/project/architecture)
- [Review costs by recipient and operating path](/project/fees)

## Decision rule

- Choose hosted when reducing operational work matters more than controlling every infrastructure boundary.
- Choose self-hosted when control, portability, custom operation, or independent availability justifies the operating responsibility.
- Add a hybrid service only when its bounded value, exchanged data, cost, failure behavior, and exit path are clearer than operating the capability yourself.
- Start on testnet and validate backup, payment, fulfillment, and recovery before depending on either path for material transactions.
- Re-evaluate from current terms and capabilities; the deployment choice does not permanently lock the product model.

## Validate the choice before committing

1. Name the person or provider responsible for availability, updates, security, backups, and incident response.
2. Confirm where the store's data lives, how it can be exported, and how service is recovered after a failed update or unavailable provider.
3. Inspect the actual payment, shipping, Agent, API, and marketplace capabilities on the deployment you will use.
4. Complete one test order from listing and quote through payment observation, fulfillment, refund or dispute routing, and evidence review.
5. Record recurring costs and transaction-specific charges by recipient; do not compare only a headline subscription or commission.

If any owner, recovery path, capability, or charge is still unknown, remain in evaluation rather than treating the deployment as ready.
