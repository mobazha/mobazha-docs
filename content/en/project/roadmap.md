---
title: What Mobazha is proving next
summary: Follow the product outcomes Mobazha is validating now, the evidence required to advance them, and the ideas that remain exploration rather than promises.
status: Draft
audiences:
  - Users
  - Contributors
  - Operators
  - Developers
  - Evaluators
  - Agents
evidenceLabel: Public release scope, repository milestones, audits, and reviewed product roadmaps
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: Understand what the project is trying to prove next, why each outcome matters to users, and what evidence must exist before direction becomes a release commitment.
estimatedTime: 8 minutes
journey: understand
primaryAction:
  label: Review the current proof
  href: /project/roadmap#the-current-proof
---

## Where this page fits

The roadmap describes desired user and product outcomes. It is not a list of every feature under discussion, a delivery calendar, or evidence that a capability exists.

| Need | Source |
|---|---|
| What is available in the current release? | [Release scope](/project/release-scope) and the connected backend |
| Why is Mobazha being built? | [Founding whitepaper](/project/whitepaper) |
| What outcome is the project trying to prove next? | This roadmap |
| What exact change is proposed or accepted? | [RFCs, ADRs, and decisions](/project/decisions) |
| What implementation work is active? | Public repository issues, projects, tests, and release notes |

No date or item on an internal plan becomes a public commitment unless it is accepted, implemented, tested, documented, and released.

## The current proof

The immediate goal is not feature count. It is a trustworthy release-candidate loop that different users can complete and verify:

| User | Outcome to prove | Evidence of success |
|---|---|---|
| Buyer | Understand the seller, final total, payment instruction, order state, and recovery path | One complete test order with inspectable quote, Payment Session, fulfillment, and recovery state |
| Seller | Configure a recognizable store, publish an offer, receive payment evidence, fulfill, and support the order | Repeatable store-to-order operation without hidden administrator repair |
| Operator | Run or provide a healthy, secure, recoverable backend | Diagnostics, monitoring, backup restore, upgrade decision, and incident ownership |
| Developer or Agent builder | Discover capability, authenticate narrowly, call public contracts, and reconcile unknown outcomes | Versioned contract tests covering denial, retry, duplicates, conflicts, and recovery |
| Evaluator | Distinguish current behavior, optional services, fees, dependencies, and future direction | Public release, policy, compatibility, and source evidence that agree |

Until this loop is dependable, a broader marketplace, additional rails, or more automation increases surface area without proving the core value.

## Near-term outcome lanes

| Outcome lane | User problem being solved | Evidence required to advance |
|---|---|---|
| Buyer and seller journey | Important state and recovery information is fragmented or ambiguous | Tested desktop and mobile journeys with clear totals, payment progress, fulfillment, refund, and dispute behavior |
| Standalone operation | Installation is easier than safe long-term operation | Signed release evidence, secure first run, monitoring, backup restore, migration, rollback, and support guidance |
| Hosted and independent consistency | Product behavior can drift across compositions | Shared contracts, runtime capability truth, cross-distribution conformance, and explicit service differences |
| Payment and protection clarity | A payment event, verified payment, order state, settlement, and buyer protection are easily confused | Order-bound Payment Sessions, rail-specific recovery, auditable state transitions, and honest terms |
| Public integration surfaces | API, events, webhooks, MCP, extensions, and Agents can imply more authority than they have | Scoped credentials, stable contracts, idempotency, capability gates, approval, and failure tests |
| Store and distribution quality | A published listing is not yet a complete commercial experience | Better identity, storefront, fulfillment, visibility, accessibility, internationalization, and operator evidence |
| Release trust | Source presence is mistaken for supported availability | Checksums, provenance, SBOM, compatibility, migration, known issues, and release-linked documentation |

These lanes can progress in parallel, but none should bypass the applicable security, economic, legal, capability, and release gates.

## Exploration that remains gated

| Exploration area | Potential value | What must be proven first |
|---|---|---|
| Richer community markets and verticals | Connect focused demand and independent supply | Operator responsibility, moderation, discovery quality, attribution, and sustainable unit economics |
| Deal Links and embedded or social entry | Shorten the path from known demand to an attributable order | Immutable seller and quote binding, privacy, channel context, fee disclosure, and recovery |
| More payment and protection models | Serve additional regions, assets, and risk preferences | Custody, verification, finality, refund, dispute, compliance, dependency, and failure semantics |
| AI, Agents, and reusable Skills | Reduce setup and operating work | Scoped identity, approval, traceability, deterministic policy, cost control, and human accountability |
| Multi-store and richer storefronts | Let one operator separate brands, catalogs, policies, and audiences | Store context, authorization, data ownership, routing, analytics, and migration boundaries |
| Browser, messaging, TMA, or other channel surfaces | Meet users where demand already exists | Secure origin, authenticated context, capability discovery, privacy, and consistent order authority |
| Launcher and managed updates | Reduce self-hosting friction | Signed artifacts, platform validation, update consent, health checks, backup, rollback, and recovery |
| Broader extension runtime | Allow more providers and distribution-specific capabilities | Stable typed contracts, isolation, least authority, compatibility, review, and revocation |

Exploration is not scheduled availability. A useful prototype can still fail product, security, compliance, operating-cost, or maintenance tests.

## What the roadmap does not promise

- that every repository design or adapter will ship;
- that all deployments will expose the same capability set;
- stable dates before release evidence exists;
- permanent free service, zero external cost, or one universal commission model;
- Token value, transaction mining, recruitment rewards, buybacks, or investment returns;
- automatic compatibility between old data, new binaries, private distributions, and third-party providers;
- that an Agent, plugin, marketplace, or hosted service may bypass store, order, payment, or user authority.

## How an outcome becomes current

1. A real user problem and target outcome are documented.
2. Product, security, economic, legal, and operational boundaries are reviewed.
3. The public contract and capability behavior are defined.
4. Implementation and migration paths are tested in the relevant distributions.
5. User journeys, failure recovery, documentation, and support evidence agree.
6. The release publishes scope, artifacts, known issues, and compatibility evidence.

Repository issues and projects track execution detail. RFCs and ADRs record decisions. Release notes state what shipped. This page remains the public outcome map and should change when evidence changes, not when an internal task is renamed.

- [Review release scope and maturity](/project/release-scope)
- [Inspect runtime capabilities](/build/runtime-capabilities)
- [Read public decisions and proposals](/project/decisions)
