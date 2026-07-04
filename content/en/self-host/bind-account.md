---
title: Connect optional hosted capabilities
summary: Keep local node ownership separate from any optional account or hosted service connection.
status: Draft
audiences:
  - Operators
sourceLabel: Mobazha public release boundary
sourceUrl: https://github.com/mobazha/mobazha/blob/main/README.md
reviewed: 2026-07-04
---

## What is stable today

A local standalone store remains usable for administration, listings, data export, and supported UTXO payment flows without a Mobazha Hosting account. Optional services may later add discovery, search, routing, managed updates, or support.

> **Important:** There is not yet a stable public node-to-account binding contract. Do not treat internal endpoints, old screenshots, or historical design documents as a supported procedure.

## Before connecting any service

- Confirm that you are administering the intended node and account.
- Create a fresh backup and keep recovery material outside the browser session.
- Require a clear explanation of the capability, data exchange, permissions, revocation, and price.
- Do not paste seed phrases, wallet private keys, or database credentials into an account-binding form.

## Publication gate for a supported flow

- The public node and client repositories describe the same versioned contract.
- The UI shows the node identity, requested permissions, exchanged data, and revocation path.
- Authentication does not expose node recovery material or silently widen runtime capabilities.
- Automated tests cover connection, denial, expiry, revocation, and recovery.
