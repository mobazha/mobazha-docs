---
title: Architecture and trust boundaries
summary: Mobazha separates user clients, independently operated backends, optional hosted services, and external payment or delivery systems.
status: Beta
audiences:
  - Operators
  - Developers
  - Evaluators
evidenceLabel: Mobazha public repositories
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-04
pageType: concept
outcome: Identify which system owns client presentation, runtime capability, transaction state, extension authority, and public policy.
estimatedTime: 10 minutes
journey: understand
primaryAction:
  label: Review the authority order
  href: /project/architecture#authority-order
---

## Core boundary

A client connects to a backend chosen by the user or operator. That backend controls its data, enabled capabilities, integrations, and policies. Optional hosted services are separate dependencies and should be disclosed as such.

## Open Core composition boundary

Open Core owns order, payment, refund, dispute, settlement, key-custody, and audit state machines. Optional products and integrations compose through public typed contracts instead of adding product vocabulary, arbitrary hooks, database access, or a complete Core service locator.

- Ports replace narrow Core-required implementations.
- Modules assemble reviewed capabilities before the Node starts serving traffic.
- Functions customize deterministic decisions without I/O or mutation authority.
- Controllers reconcile external systems and report observations or attestations.
- Every financial change returns through a validated Core command and state machine.
- Effective capabilities remain closed until distribution, compatibility, composition, authorization, configuration, and health gates all pass.

- [Open Core extension guide](/build/extensions) — Mechanism selection, authority flow, trust levels, current implementation, and Collectibles as the first Order Extension provider.
- [Draft Composable Extension Platform RFC](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0002-composable-extension-platform.md) — Target control-plane and multi-runtime model; it does not expand current runtime capability.

## Frontend product composition boundary

Frontend products are compositions rather than values in one product-type enum. Deployment, root experience, authentication, presentation channel, network policy, branding, build-time code inclusion, and backend capability remain independent dimensions.

- Public frontend packages define product-neutral contracts and reusable commerce behavior.
- Distribution owners select the shell, build-time feature set, product profile, brand, and any distribution-local code.
- Private feature code can participate through compatible composition contracts while remaining physically absent from public artifacts.
- At runtime, routes, navigation, providers, workflows, and actions resolve from the same composition and can only narrow authoritative backend capabilities.
- Hosted, standalone, marketplace, embedded, extension, and sovereign concerns must not be collapsed into scattered product-name checks.

The first Unified implementation slice now resolves Guest Checkout,
marketplace-operator, and marketplace-seller-review route and navigation
eligibility from one fail-closed result. It does not yet compose providers,
workflows, or actions, and it does not turn the browser-extension shell or
private distributions into public runtime plugins.

[Draft RFC-0003](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0003-composable-frontend-product-model.md) defines the target model and explicitly excludes dynamic plugins, remote React code, Agent surfaces, and a plugin marketplace.

## Authority order

- Transaction state: the backend that owns the order.
- Available runtime features: that backend's advertised capabilities.
- Payment facts: the selected payment system and confirmed transaction records.
- Project-wide public policy and public explanation: the canonical page on docs.mobazha.org.
- Exact interfaces and released behavior: versioned contracts, conformance tests, and tagged release evidence in their owning repositories.
- Transaction-specific amounts and recipients: the quote accepted for that order within public policy.

Evidence links support a public explanation but do not create a second policy authority. Documentation cannot activate a capability or override runtime and contract facts.
