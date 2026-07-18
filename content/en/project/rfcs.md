---
title: Requests for Comment
summary: Review substantial protocol, policy, economic, security, governance, and cross-repository proposals before treating them as commitments.
status: Current
audiences:
  - Contributors
  - Maintainers
  - Evaluators
  - Agents
evidenceLabel: Public Mobazha RFC registry
evidenceUrl: https://github.com/mobazha/mobazha-docs/tree/main/rfcs
reviewed: 2026-07-18
pageType: hub
outcome: Find or start a public proposal without presenting Draft design direction as accepted or shipped behavior.
estimatedTime: 5 minutes
journey: understand
primaryAction:
  label: Open the RFC registry
  href: /project/rfcs#current-registry
---

## When an RFC is required

- A public protocol or interoperability contract changes.
- Order, payment, settlement, dispute, identity, authorization, or custody boundaries change.
- A fee, recipient, reward, public fund, or economic policy changes.
- A new optional hosted dependency changes independent-operation assumptions.
- Governance, licensing, privacy, security, or cross-repository ownership changes materially.

## Status model

- Draft: authoring is incomplete.
- Review: ready for public technical and product review.
- Accepted or Rejected: the decision is recorded with rationale.
- Withdrawn: the author no longer proposes the change.
- Superseded: another RFC replaces the proposal.
- Implemented: release evidence confirms that the accepted proposal shipped within a stated scope.

## Current registry

- [RFC-0001: Founding whitepaper publication contract](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0001-whitepaper-publication-contract.md) — Review; defines the evidence and approvals needed to advance the whitepaper.
- [RFC-0002: Composable Extension Platform Model](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0002-composable-extension-platform.md) — Draft; separates domain, contract role, runtime, trust, lifecycle, and packaging while defining the target multi-runtime platform.
- [RFC-0003: Composable Frontend Product Model](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0003-composable-frontend-product-model.md) — Draft; separates deployment, experience, channel, code inclusion, and effective capability so public and private distributions can assemble coherent products without product-name branching.
- [RFC-0004: Deal Link Single-Level Attribution](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0004-deal-link-single-level-attribution.md) — Superseded by RFC-0007; retained as the earlier manual-review-only proposal.
- [RFC-0005: Core-owned Resource Collateral Lifecycle](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0005-core-owned-resource-collateral.md) — Draft; proposes a separate Core-owned collateral aggregate without merging collateral into Order Extension or order settlement state.
- [RFC-0006: Payment Kernel, Rails, and Trusted Distribution Modules](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0006-payment-kernel-rails-and-trusted-modules.md) — Draft; proposes typed payment rails, reviewed module composition, contribution-level routing, and durable payment recovery boundaries.
- [RFC-0007: Seller-funded Affiliate Attribution and Atomic Settlement](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0007-seller-funded-affiliate-atomic-settlement.md) — Draft; proposes seller-funded Affiliate outputs in the canonical order release without a second payout engine or commission balance.
- [RFC-0008: Node Key Domains and Receiving Architecture](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0008-node-key-domains-and-receiving-architecture.md) — Draft; proposes separate Identity, Wallet, and Settlement domains, generic receiving destinations, and a production gate for order authorization keys.
- [RFC-0009: Frozen Payment Attempt Settlement Terms](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0009-frozen-payment-attempt-settlement-terms.md) — Draft; proposes freezing seller payout, platform and cancellation fees, Affiliate and moderator terms, escrow timeout, and dispute policy into the immutable payment attempt before a funding target is payable.
- [RFC-0010: Guest Checkout Trust and Custody Model](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0010-guest-checkout-trust-and-custody.md) — Draft; proposes seller-custodied Guest Checkout, a strict per-chain closure gate, an order-scoped access credential, and buyer disclosure rules without introducing a separate Direct payment product.
- [RFC-0011: Order Settlement Authorization Keys](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0011-order-settlement-authorization-keys.md) — Draft; proposes deterministic hardened attempt-scoped settlement keys for all order participants, Identity-signed public-key offers without private-key exposure, and moderator selectability gated on obtaining a valid offer before payment.
- [RFC-0012: Embedded Wallet Buyer Settlement Keys and Onramp-Funded Attempts](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0012-embedded-wallet-buyer-settlement-keys.md) — Draft; proposes a buyer-vendor-custodied participant key class for moderated escrow, admits embedded-wallet providers as a reviewed trusted-module class, and defines onramp-funded attempts without changing the RFC-0010 guest-custodial default or the RFC-0011 Settlement-root key hierarchy.
- [RFC-0013: Peer-scoped Deal Link Hosting and Store Authority](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0013-peer-scoped-deal-link-hosting.md) — Draft; proposes Peer-scoped seller administration, optional hosted account association, and a bounded Hosting-to-Node authority split for Deal Links.
- [RFC-0014: Quote-bound Cross-currency Payment Attempt Authorization](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0014-quote-bound-cross-currency-payment-attempt-authorization.md) — Draft; specifies a buyer-proposed funding basis that the seller checks against a fresh local rate floor and authorizes by signing the exact basis hash with the attempt terms.
- [RFC-0015: Marketplace Operator Commission](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0015-marketplace-operator-commission.md) — Draft; proposes an operator-set, release-snapshotted, seller-visible commission on marketplace-attributed orders, phased from a hosted estimate ledger to seller-funded settlement outputs under the RFC-0007 model.
- [RFC-0016: Peer Handle Naming, Resolution, and Portability](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0016-peer-handle-naming-resolution-portability.md) — Draft; proposes one human-readable network handle per Peer, direct default-store routing, signed claim and lifecycle governance, and portability without replacing Peer-scoped business authority.
- [RFC template](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0000-template.md) — Required metadata and review questions.
- [Repository RFC guide](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/README.md)

> **Important:** Accepted and Implemented are different states. Only release evidence and effective runtime capability can establish shipped availability.
