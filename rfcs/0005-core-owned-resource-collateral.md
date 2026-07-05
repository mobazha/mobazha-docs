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

### 6. Define auditable records and minimize evidence

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

## Security, privacy, and abuse analysis

Collateral introduces financial authority that cannot be inferred from a
provider declaration or product label. The design therefore fails closed
unless Core can bind the tenant, provider, resource, principal, asset, amount,
policy, revisions, rail, beneficiary, and idempotency key for every command.
Extensions can submit declarations, observations, and attestations, but they
cannot mark collateral funded, choose a beneficiary, approve a claim, or
execute release or slash transitions.

The primary abuse cases are false funded-protection claims, replayed funding or
claim evidence, cross-tenant or cross-resource allocation, over-allocation,
beneficiary substitution, duplicate release or slash execution, and disclosure
of private custody evidence. Core counters them with canonical base-unit
amounts, expected revisions, immutable bindings, replay fingerprints,
append-only actions, receipt verification, least-privilege rail capabilities,
and reconciliation of ambiguous external effects.

Raw evidence remains provider-owned. Core stores only the canonical fields and
digests required for authorization, replay protection, dispute handling,
accounting, retention, and audit. Secrets, keys, shipping details, private item
evidence, and unrestricted provider payloads are excluded from the generic
collateral records and client projections.

## Economic and legal analysis

This section is applicable. Collateral changes who funds an obligation, who
may receive compensation, how long funds remain restricted, and which entity
may hold or execute them. This RFC defines state ownership and authority only;
it does not approve a custody model, fee, yield, guarantee, insurance claim,
exchange-rate policy, or legal characterization.

Before any deployment advertises funded protection, its concrete proposal must
identify the funder, custodian or signing entity, covered beneficiary, asset,
required amount, funding and release conditions, claim authority, dispute and
appeal path, partial-slash behavior, fees, accounting treatment, retention,
jurisdiction, sanctions or licensing review, and customer disclosures. Product
copy must distinguish a declared requirement, observed funding, active
coverage, pending claim, and completed compensation. Until those reviews and
runtime evidence exist, the capability remains unavailable.

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

## Rollout and rollback

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

The provider-neutral C2 execution substrate is implemented. Core persists
immutable funding-target and release/slash intents before external I/O, binds
them to a rail identity and version, repeats submission only through the
rail's create-or-retrieve idempotency contract, keeps ambiguous results
pending, and atomically applies receipt-verified reconciliation results to the
collateral aggregate. Conformance tests cover confirmed funding, ambiguous
release recovery, confirmed slash, terminal replay, persistence before
external calls, and process-restart recovery for incomplete target creation
and execution submission. Reconciliation receives the complete persisted
request rather than an action identifier alone; funding targets retain the
Core-resolved principal destination, tenant, and idempotency identity for
binding checks and remain observable after their funding deadline.

The first concrete C2 source slice is also implemented but is not activated.
`bsc-smart-contracts/contracts/collateral/CollateralVault.sol` defines a
dedicated, single-ERC-20 vault with principal-funded obligations, role-gated
release and slash, replay-safe action digests, pause control, strict token
balance-delta checks, and surplus-only recovery. Open Core's
`internal/collateral/evmvault` package binds version `1.0.0`, chain, token,
vault, operator, deployment start block, confirmations, calldata, canonical
receipt logs, and the complete Core request identity. Contract tests cover
obligation conflicts, funding, expiry, release, partial slash, pause, surplus,
replay, and unsupported fee-on-transfer behavior; Node tests cover immutable
target and execution bindings, expiry reconciliation, digest compatibility,
receipt-log integrity, and residual collateral invariants.

This source and test evidence still does not activate collateral. There is no
approved network/token choice, deployed vault address and deployment record,
operator key runbook, effective capability registration, tagged release, or
runtime evidence. No Collectibles runtime currently creates an Order Extension
v2 allocation binding, and no Hosting or client API may present a declared
guarantee as funded protection. C2 deployment/operations evidence and C4
through C5 remain open.

The first C3 contract and admission-gate slice is implemented in Open Core.
Order Extension v1 remains unchanged. A separate `OrderExtensionV2` projection
may carry a Core-issued `AllocationReference`; that reference now includes the
provider, resource, and principal scope in addition to tenant, order,
extension, asset, amount, state, and revisions. The read-only Core admission
gate reloads both the allocation and collateral account and rejects an absent
reference, a stale projection, a wrong tenant/order/provider/resource/
principal, a wrong asset or amount, a non-active allocation, or an inactive,
expired account or an account revision that precedes the allocation. A later
unrelated allocation may advance the account revision without invalidating an
existing active allocation. Tests cover these negative bindings and also prove
that the original v1 envelope remains independently valid.

The remaining generic C3 persistence and payment gate are implemented. Core
stores admitted v2 bindings as append-only records keyed by the exact Order
Extension revision, preserves earlier revisions for audit, and requires a new
admission before a changed extension revision becomes current. Both the
Payment Session service and the underlying Payment App service reload and
revalidate persisted v2 bindings before creating a fiat provider session or a
crypto funding target. A stale or invalid binding returns a stable policy
conflict and no payment adapter is called. Repository migration, multi-order
account-revision, immutable-binding, revision-refresh, API conflict, direct
payment, and policy ordering tests provide the C3 exit evidence.

C3 does not itself decide that a Collectibles order requires collateral. No
Collectibles module currently derives an M2 requirement, requests the Core
allocation, or persists the admitted v2 binding. That provider-specific
orchestration is C4 and remains required before any runtime capability is
advertised.

The first fail-closed C4 contract slice is implemented on the local integration
branches but is not activated. Open Core now defines a narrow
`order-extension.collateral-requirement/v1` module contract. A provider may
derive one canonical requirement from a detached signed order and persisted
extension, but receives no database, key, funding, allocation, release, or
slash authority. Payment provisioning passes the exact persisted extension
revision to that contract and rejects a required extension unless the current
Core tenant can reload and admit an exact v2 allocation binding. Existing v2
bindings remain revalidated even if a provider later stops admitting new
requirements.

The Collectibles payload contract now reserves source-deposit identity,
canonical collateral AssetID and base-unit amount, and policy identity/version
fields. For M2, the extension resource is the source-deposit identity rather
than the Hub slot. Hosting accepts a guarantee declaration only when amount and
asset are canonical, projects it explicitly as `unfunded-requirement`, emits
the signed-order optional features needed for that declaration, and compares a
source-custody declaration with the operator-owned source-deposit record. A
missing or altered requirement therefore fails closed. The commercial module
dependency publication, seller-Core account selection/allocation command,
cross-tenant verifiable transport, claim evidence, and Docker E2E remain open;
this slice does not advertise funded protection.

The existing Solana Anchor and EVM Safe implementations were reviewed for C2.
Both are order-scoped settlement adapters: they require persisted order escrow
data and define confirm/cancel/dispute outputs as seller payout, buyer refund,
or order dispute release. They cannot be reused as collateral rails. Open Core
now defines a separate `collateral.Rail` capability whose v1 descriptor fails
closed unless funding target creation, receipt-verified funding observation,
principal release, claim slash, status reconciliation, and receipt
verification are all supported. The dedicated EVM vault adapter implements
that source contract, but it is deliberately absent from runtime registration
until a reviewed deployment and asset configuration can satisfy the same
descriptor in the effective backend capability set.

Rollback blocks new accounts and allocations while continuing to reconcile and
service persisted obligations. No rollback may rewrite funded history or drop
pending release, slash, or claim work.

## Documentation impact

- Keep this RFC and the public RFC registry labeled Draft until decision owners
  accept the proposal; implementation evidence alone does not activate it.
- After acceptance, add public buyer and seller guidance that distinguishes a
  collateral requirement from funded and active protection.
- Document the Core collateral commands, rail capability contract, stable
  denial reasons, audit fields, and Order Extension v2 allocation reference
  before exposing an API or Agent action.
- Update the owning implementation repository's operator runbook, monitoring,
  accounting, claim handling, and evidence-retention guidance without copying
  private evidence or credentials into public documentation.
- Add translated task guidance, release notes, and tested recovery procedures
  only for a release whose capability gate and runtime evidence are identified.
- Preserve historical records and pending-obligation recovery instructions if
  a rail, provider, policy, or product surface is withdrawn.

## Open questions

- Which EVM network and ERC-20 asset provide the smallest auditable first C2
  deployment, and which operator/custodian owns its keys and accounting?
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
