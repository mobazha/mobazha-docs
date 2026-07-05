# RFC-0005: Core-owned Resource Collateral Lifecycle

- Status: Draft
- Authors: Mobazha architecture and Collectibles maintainers
- Created: 2026-07-05
- Updated: 2026-07-05
- Decision owners: Mobazha Open Core and payment maintainers
- Affected surfaces: Node, payment rails, Order Extension, Collectibles Hosting, clients, docs
- Supersedes: None
- Superseded by: None

## Summary

Define a Core-owned collateral aggregate for resource-backed commerce. The
first required use is the independent seller guarantee `D` in the Collectibles
M2 source-custody model, where a seller retains the physical item while an NFT
represents redemption rights.

Collateral is not an Order Extension reservation, seller-sale proceeds, or a
provider-owned status field. It is a separately funded financial obligation
that may cover a resource across several orders and remain active after an
individual order settles. Extensions may declare a collateral requirement and
submit bounded evidence. Only Core may record funding, allocate coverage,
release funds, or execute a slash/compensation command through an authorized
payment rail.

## Problem and evidence

Collectibles Hosting currently records `guaranteeAmount` and
`guaranteeCurrency` on an M2 source deposit. Those fields are declarations;
they do not prove that funds were locked. Treating them as funded collateral
would create an unaudited financial state outside Core.

Order Extension v1 cannot safely fill this gap:

- its reservation contract reserves provider-owned capacity, not money;
- its settlement attestation gates one order's seller payout;
- its settlement command pays the seller or refunds the buyer from that
  order's escrow;
- M2 collateral is funded independently by the seller, can cover multiple
  transfers, and may survive the first-sale order;
- a collateral slash has a different authority, beneficiary, evidence,
  dispute, accounting, and reconciliation lifecycle.

Reusing the order settlement action would mix two financial aggregates and
could release or slash the wrong funds. Letting Hosting own the state would
bypass Core's payment, idempotency, audit, and state-machine invariants.

## Proposal

### 1. Introduce a separate Core aggregate

Core owns a `CollateralAccount` scoped by tenant, provider, resource,
principal, policy, and asset. Its minimum logical shape is:

```text
CollateralAccount {
  collateral_id
  tenant_id
  provider_id
  resource_id
  principal_id
  asset_id
  required_amount
  funded_amount
  available_amount
  policy_id
  policy_version
  revision
  state
  funding_reference
  activated_at
  expires_at
}
```

Amounts are canonical positive integer base units. Core never relies on a
provider-formatted decimal or an extension-supplied exchange rate. Initial
v1 coverage is single-asset. Cross-asset valuation and margin calls require a
later policy contract and are not implied by this RFC.

The initial states are `pending-funding`, `active`, `release-pending`,
`released`, `slash-pending`, `slashed`, and `failed`. State transitions use an
expected revision and idempotency key. Submitted and ambiguous payment actions
remain pending until the owning rail reconciles them; a timeout is not proof
of failure.

### 2. Separate account funding from order allocation

An active account may issue Core-owned `CollateralAllocation` records that
bind a bounded amount of available coverage to an order and Order Extension:

```text
CollateralAllocation {
  allocation_id
  collateral_id
  tenant_id
  order_id
  extension_id
  amount
  collateral_revision
  state
}
```

Allocation does not transfer funds. It prevents the same available collateral
from being promised to incompatible exposures. Release of an order allocation
returns coverage to the account but does not release the seller's collateral.
The account remains active until its resource policy permits final release.

### 3. Preserve the Order Extension v1 boundary

Order Extension v1 remains unchanged. Adding collateral authority or a
financial binding to its existing envelope would change financial semantics
and therefore cannot be treated as a harmless optional v1 field.

A future Order Extension v2 may carry a Core-issued allocation reference. Core
must load and validate that reference by tenant, resource, provider, principal,
asset, amount, state, and revision before admitting funding or a protected
resource transition. The provider cannot create the reference itself.

Disabling new provider admission does not erase an existing collateral account
or allocation. Core continues release, claim, compensation, and reconciliation
obligations using the persisted provider, policy, rail, and version bindings.

### 4. Limit extension authority

An extension may:

- declare a canonical collateral requirement for a resource;
- request allocation through a scoped Core command;
- report observations or submit a versioned claim attestation;
- reconcile its external resource state.

An extension may not:

- mark collateral funded, active, released, or slashed;
- write Core collateral records;
- select a funding source, payout destination, or beneficiary account;
- transfer, release, or slash funds;
- reuse seller proceeds as collateral without a separate explicit funding
  command and legal policy;
- change amount, asset, principal, resource, or policy after funding without a
  versioned Core transition.

Core derives the beneficiary from the affected order, dispute, and accepted
policy. Every claim binds tenant, collateral, allocation, order, extension,
issuer, condition version, evidence digest, expected collateral and allocation
revisions, the expected Core order-state version, freshness, and idempotency.
Evidence is untrusted until Core and the relevant verifier accept it.
Acceptance authorizes a Core command; it is not itself proof that the payment
rail completed the slash.

### 5. Use payment rails without merging state machines

Collateral funding, release, and slash use payment adapters that explicitly
advertise collateral support. The collateral aggregate owns the desired and
observed lifecycle; a rail owns external transaction execution and
reconciliation. Order settlement records may be referenced for evidence but
are never mutated to represent collateral.

The first implementation must fail closed when the selected asset or rail
cannot provide durable funding identity, confirmation depth, release/slash
execution, and reconciliation. Manual operator text fields are not a funding
rail.

### 6. Audit and privacy

Core stores an append-only action history for open, funding observation,
activation, allocation, allocation release, claim, slash, account release, and
reconciliation. Audit entries include actor, tenant, aggregate revision,
idempotency key, reason code, policy version, rail reference, and result.

Evidence payloads remain provider-owned and minimized. Core stores canonical
digests and only the fields needed for authorization, replay protection,
dispute handling, accounting, and legally required retention. Shipping
addresses, private item evidence, keys, and raw wallet secrets do not belong in
the generic collateral envelope.

## Collectibles M2 mapping

- `resource_id` is the M2 source-deposit identity, not the NFT mint or an order
  chosen opportunistically by a client.
- `principal_id` is the seller whose custody obligation is covered.
- `provider_id` is the persisted Collectibles provider identity.
- Hosting's current guarantee amount/currency remain an unfunded requirement
  until Core returns an active binding.
- Mint admission and protected first-sale funding require an active,
  sufficiently available allocation once the Order Extension v2 integration
  ships.
- A verified physical-delivery default may create a claim, but Core policy and
  dispute state determine whether and how much is slashed.
- Completing the first-sale payout does not release `D`; final resource
  redemption, custody transfer, expiry, open claims, and policy determine
  release eligibility.

M2 remains invitation-only and must not advertise funded buyer protection until
the Core state machine, payment rail, v2 allocation binding, reconciliation,
client disclosure, and legal gate are all complete.

## Rollout

| Stage | Outcome | Exit evidence |
|---|---|---|
| C0 contract freeze | Public Core types, canonical validation, RFC | Negative validation and authority-boundary tests |
| C1 Core aggregate | Durable account/allocation/action records and expected-revision commands | Transition, idempotency, crash, replay, and migration tests |
| C2 payment execution | Funding, release, slash, and ambiguous-result reconciliation through supported rails | Rail conformance and recovery tests |
| C3 Order Extension v2 | Core-issued allocation reference and admission gates | Missing/stale/wrong-tenant/wrong-resource negative tests |
| C4 Collectibles adapter | M2 requirement, allocation, claim evidence, and operator projection | Hosting/Node integration and Docker E2E |
| C5 product gate | Accurate client language, accounting, runbooks, monitoring, and legal approval | No declaration presented as funded protection; rollback drill |

### Implementation evidence as of 2026-07-05

C0 and the Core-local C1 state-machine slice are implemented. Core now stores
tenant-scoped accounts, funding-reference claims, allocations, claim evidence,
execution-reference claims, and append-only actions. The tested transitions
cover open, confirmed funding, allocation, allocation release, account release
request/confirmation, claim acceptance, and partial or full slash
confirmation. They use canonical base-unit amounts, expected revisions,
transactional compare-and-swap writes, tenant/resource/principal bindings,
attestation and execution replay fingerprints, and an expected Core
order-state version.

This evidence does not activate collateral. No payment adapter currently
submits or reconciles collateral funding/release/slash actions, no Order
Extension v2 allocation reference is admitted, and no Hosting or client API may
present a declared guarantee as funded protection. C2 through C5 remain open.

The existing Solana Anchor and EVM Safe implementations were reviewed for C2.
Both are order-scoped settlement adapters: they require persisted order escrow
data and define confirm/cancel/dispute outputs as seller payout, buyer refund,
or order dispute release. They cannot be reused as collateral rails. Open Core
now defines a separate `collateral.Rail` capability whose v1 descriptor fails
closed unless funding target creation, receipt-verified funding observation,
principal release, claim slash, status reconciliation, and receipt
verification are all supported. No provider currently satisfies that
descriptor; the first vault implementation and asset remain an open C2 choice.

Rollback blocks new accounts and allocations while continuing to reconcile and
service persisted obligations. No rollback may rewrite funded history or drop
pending release, slash, or claim work.

## Alternatives

- Reuse Order Extension reservation: rejected because it is provider-owned
  capacity, not Core-owned money.
- Reuse seller order escrow: rejected because collateral has a different
  funder, lifetime, beneficiary, and state machine.
- Let Hosting mark collateral locked: rejected because it bypasses Core
  financial authority and rail reconciliation.
- Put guarantee status only in NFT metadata: rejected because metadata is not
  custody or payment evidence and can become stale.
- Implement dynamic cross-currency margin immediately: rejected until the
  single-asset lifecycle is proven and a versioned valuation policy exists.

## Open questions

- Which initial rail and asset provide the smallest auditable C2 slice?
- Which Core dispute decisions can authorize a claim, and which require an
  external adjudication attestation?
- Does one source deposit need multiple collateral accounts for policy or
  jurisdiction isolation, or must v1 enforce exactly one active account?
- What release delay and claim window apply after final physical redemption?
- Which accounting and legal entity is the custodian for each deployment?

## Decision

Pending maintainer review. C0 types may be implemented for contract validation,
but no runtime may advertise or infer funded collateral until this RFC is
accepted and stages C1 through C5 provide the required evidence.
