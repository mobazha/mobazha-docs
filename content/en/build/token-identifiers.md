---
title: Token and on-chain asset identifiers
summary: Use a versioned, parseable identifier across clients while treating exact parsing behavior and supported standards as release-scoped contracts.
status: Beta
audiences:
  - Developers
  - Integrators
  - Agent builders
evidenceLabel: Unified token identifier implementation and tests
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/packages/core/utils/tokenIdentifier.ts
reviewed: 2026-07-04
pageType: concept
outcome: Parse and compare a token identifier without treating recognition as ownership, price, transfer authority, or runtime support.
estimatedTime: 6 minutes
journey: build
primaryAction:
  label: Review the identifier shape
  href: /build/token-identifiers#public-identifier-shape
---

## Public identifier shape

New identifiers encode the uppercase network, lowercase contract address, token standard, and token or slot identifier. Examples include `SEPOLIA_0x1234..._ERC721_42`, `SEPOLIA_0x1234..._ERC1155_1`, and `SEPOLIA_0x1234..._ERC3525_1`.

The exact parser, normalization, supported standards, legacy forms, and serialized field remain versioned implementation contracts. Do not create an identifier by concatenating unvalidated user input or infer that an asset is enabled merely because its identifier parses.

## Identity semantics

- ERC-721 and ERC-1155 assets use contract address plus token ID as the asset identity.
- ERC-3525 integrations may use a slot identifier for the asset class while individual holdings retain their own token identity.
- Network identity is part of the identifier; the same contract address on another network is a different namespace.
- Contract addresses are normalized before comparison.
- Human symbols are display metadata and are not sufficient unique identifiers.

## Compatibility and safety

- Parse legacy forms only through the maintained parser and preserve the original value for migration evidence.
- Treat unknown standards and malformed identifiers as unsupported rather than guessing.
- Resolve network, contract, and token metadata through trusted configuration or verified chain data.
- Keep identifier recognition separate from runtime capability, authorization, ownership, pricing, and settlement support.
- Agents must not turn a parseable identifier into a purchase or transfer without an effective capability and user confirmation.

## Implementation evidence

- [Identifier implementation](https://github.com/mobazha/mobazha-unified/blob/main/packages/core/utils/tokenIdentifier.ts)
- [RWA type contracts](https://github.com/mobazha/mobazha-unified/blob/main/packages/core/types/rwa.ts)
- [Runtime capability rules](/build/runtime-capabilities)
