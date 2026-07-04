---
title: Founding whitepaper
summary: A public-review account of Mobazha's problem framing, trust model, human-and-Agent interfaces, and approach to sustainable open commerce.
status: Draft
audiences:
  - Community
  - Contributors
  - Evaluators
sourceLabel: Public-review edition prepared for the Mobazha project
reviewed: 2026-07-04
version: 0.1-review
---

## Thesis

Commerce infrastructure should be usable by people and agents without forcing every participant through one operator, one custody model, or one opaque fee schedule. Independence must remain practical, while optional services may charge clearly for value they provide.

The project therefore treats self-hosting, portable interfaces, backend-authoritative capabilities, and explicit economic disclosure as product requirements rather than marketing claims.

## The problem

- Centralized commerce bundles identity, discovery, data, checkout, policy, and distribution into one operator-controlled dependency.
- Self-hosted software often exists in name but remains impractical because upgrades, discovery, payments, or integrations depend on undocumented central services.
- Agent-mediated commerce increases the cost of ambiguity: an Agent needs machine-readable authority, scopes, prices, recipients, and state transitions before it can act safely.
- A durable alternative must support independent operation and sustainable optional services without hiding one inside the other.

## Durable principles

- Operator choice and meaningful self-hosting.
- Portable, inspectable interfaces instead of undocumented platform privilege.
- Explicit identity, capability, consent, and audit boundaries for agents.
- Charges tied to a named service, recipient, calculation basis, and confirmation step.
- Sustainability through optional services and ecosystem value—not a hidden universal commission.

## System model

A Mobazha client connects to a backend selected by the user or operator. The backend owns order state, capability advertisement, payment verification, settlement gates, and audit. The shared client renders only the effective capabilities it receives. Discovery, hosted operations, payment rails, delivery, and other services are separate dependencies with separately disclosed trust and price boundaries.

- Clients are replaceable views over versioned contracts, not the authority for business state.
- Capabilities are available only when distribution policy, contract compatibility, installation, authorization, configuration, and health all permit them.
- Extensions submit bounded declarations, decisions, observations, or attestations; Core validates them before changing protected state.
- Independent operators choose which external services and network exposure their deployment accepts.

## Humans and Agents

Mobazha is designed for interfaces used directly by people and through software Agents. Both must observe the same price, capability, policy, and state facts. Machine-readable discovery improves access to those facts but does not grant authority or bypass confirmation.

- Identity and authorization belong to the actor and action, not to persuasive prompt text.
- Spending, settlement, publication, and destructive operations require explicit scopes and applicable confirmation.
- Agent recommendations must disclose paid attribution or referral relationships where applicable.
- Auditable request, approval, quote, order, and result identifiers support review without logging secrets.

## Sustainable economics

The open-source Node can be operated independently without a mandatory central Mobazha transaction fee. Operators still incur their own infrastructure, network, processor, tax, support, and extension costs. Mobazha or another provider may charge for clearly named hosting, automation, distribution, transaction, support, or other optional services.

This boundary does not promise that every service is free. It requires the provider, payer, recipient, calculation basis, amount, optionality, expiry, and refund treatment to be visible before a charge is accepted.

- [Fees and Paid Services policy](/project/fees) — The current public economic boundary and quote requirements.
- [Current public pricing status](https://mobazha.org/pricing) — Current service offers and effective pricing disclosures.

## Evolution and governance

Mobazha is a release candidate. The whitepaper describes durable direction, while release scope, compatibility policy, OpenAPI, runtime capabilities, and transaction evidence describe what can be relied on now. Changes to public contracts, payment models, security boundaries, licensing, or governance require an ADR or equivalent public design review.

## Publication status

This is version 0.1-review, maintained as a public review draft by the documentation project. It intentionally excludes internal forecasts, experimental percentages, confidential operating plans, and claims not supported by the public release boundary. Version 1.0 requires community, security, legal, economic, architecture, and release-scope review.

- [Whitepaper maintenance contract](https://github.com/mobazha/mobazha-docs/blob/main/whitepaper/README.md)
- [RFC-0001 publication contract](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0001-whitepaper-publication-contract.md)
- [Public decision system](/project/decisions)

> **Important:** Draft direction is not shipped behavior, a financial product, a revenue guarantee, or an obligation on independent operators.
