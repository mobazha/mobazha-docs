# RFC-0010: Guest Checkout Trust and Custody Model

- Status: Draft
- Authors: Mobazha commerce, payment, and documentation maintainers
- Created: 2026-07-11
- Updated: 2026-07-11
- Decision owners: Mobazha Open Core, hosted service, Unified, clients, and documentation maintainers
- Affected surfaces: Guest checkout, Node order settlement, hosted service, buyer clients, custody disclosure, docs
- Supersedes: None
- Superseded by: None

## Summary

Define the trust and custody contract for Guest Checkout: a buyer without a
Mobazha node pays a funding target controlled by the seller's node. Guest
orders are seller-custodied orders, not moderated escrow orders, and must be
disclosed as such. An observed-address payment may be an internal rail
mechanism; this RFC does not introduce a separate Direct payment product.

The RFC fixes four public boundaries: what protection a guest buyer does and
does not receive; who holds funds at each stage; when a payment method may be
buyer-visible on a chain; and how an order-scoped guest access credential is
issued and limited. It builds on the receiving architecture of
[RFC-0008](./0008-node-key-domains-and-receiving-architecture.md), consumes
frozen attempt terms from
[RFC-0009](./0009-frozen-payment-attempt-settlement-terms.md), and supports the
Affiliate outputs of
[RFC-0007](./0007-seller-funded-affiliate-atomic-settlement.md) without changing
their authority.

## Problem and evidence

Guest Checkout exists so buyers can pay a store without installing a node or
holding a peer identity. In the public Core source at revision
[`b21ea986`](https://github.com/mobazha/mobazha/tree/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba),
the flow allocates a per-order
[payment address](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/internal/core/guest/direct_payment.go),
watches it with a
[payment monitor](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/internal/core/guest/payment_monitor.go),
and settles UTXO funds with an
[automatic sweep](https://github.com/mobazha/mobazha/blob/b21ea986698aad3c1165dbdd8ac7d4acc7f2afba/internal/core/guest/auto_sweep.go);
EVM guest orders fund a seller-owned managed escrow (Safe) target.

Three ambiguities need a public contract:

- buyers cannot see from the UI whether a guest payment enjoys escrow
  protection (it does not) or which recourse exists after funding;
- chains differ sharply in closure quality — some can only allocate an
  address without being able to settle the funds — and a single
  "guest checkout enabled" flag cannot express that safely;
- funds pass through seller-controlled addresses and, on hosted deployments,
  through operator-managed infrastructure, which raises custody-disclosure
  questions that no public record currently answers.

## Proposal

### 1. Trust model

A guest order is a seller-custodied sale:

- the funding target requests the quoted amount and is controlled through the
  seller node's Wallet or Settlement domain; actual receipts are classified
  under the overpayment and underpayment rules below;
- there is no moderated escrow, third-party arbiter, or protocol-level
  dispute release for guest orders;
- buyer recourse is the seller's published policies plus any applicable
  platform or legal remedy, and this must be disclosed before payment;
- digital entitlements issue from the funded order state; physical
  fulfillment follows the seller's stated process.

A client or storefront must not present a guest payment as protected,
escrowed, or refundable-by-protocol.

### 2. Custody boundaries

- Guest funding targets are owned by the Wallet Domain guest account or a
  Settlement Domain managed-escrow container defined in RFC-0008; identity
  keys never receive guest funds.
- On wallet-account rails, an unsplit receipt may become seller wallet balance
  at confirmation. If frozen terms require Affiliate or other recipient
  outputs, the receipt remains settlement input until the corresponding
  SettlementAction completes; only the settled seller remainder and later
  external payout transfer are ordinary wallet fund management.
- On managed-escrow rails, the container is seller-controlled custody, not a
  buyer-protection instrument, and must not be marketed as escrow.
- Hosted deployments that hold or operate seller key material must review and
  disclose their custody role before offering guest checkout on real funds.

### 3. Per-chain capability gate

A chain's guest support becomes buyer-visible only when all of the following
close end to end and survive restart:

1. quote and order creation;
2. funding-target allocation;
3. payment detection with defined overpay, underpay, and expiry behavior;
4. confirmation to the funded state with a disclosed finality rule;
5. funds are directly spendable through the Wallet Domain, or every output
   required by the frozen attempt terms can complete, confirm, and recover
   after restart;
6. watch and recovery restoration after restart.

Store configuration may list additional chains, but configuration alone must
not make a chain buyer-visible. Capability status is evaluated per chain and
network, not inferred from code presence.

### 4. Order-scoped guest access credential

A guest buyer receives a server-derived, unguessable order-scoped credential
(buyer portal token). The buyer does not choose or carry a peer identity, and
a guest buyer is never presented as a P2P order participant. Self-referral and
promoter checks that depend on verified peer identity are explicitly
unavailable for guest orders; policies that accept guest attribution accept
this boundary (RFC-0007).

### 5. Payment lifecycle

- Detection classifies exact payment, overpayment, underpayment, and
  expiration with published store-level rules for each;
- the funded state requires the chain's disclosed confirmation depth;
- guest orders consume the frozen attempt terms defined by RFC-0009 and may
  carry an Affiliate output that settles with the seller's funds under
  RFC-0007;
- unfinished watches, sweeps, and transfers must restore after a node or
  service restart without manual reconstruction.

### 6. Refunds

Guest refunds are seller-initiated payments, not protocol releases. A refund
needs a buyer-provided destination collected through the buyer portal, and the
refund destination is validated for the order's rail and network. The protocol
does not guarantee a refund; it guarantees that a refund, if made, is
attributable to the original attempt. A refund creates no new Affiliate output.

## Security, privacy, and abuse analysis

The buyer portal token is a bearer credential: it requires entropy, expiry,
transport protection, and scope limited to one order's status, entitlements,
and refund-destination submission. Funding targets must come from the
collision-safe accounts of RFC-0008 so a guest payment can never land on an
identity or wallet-main address.

Monitor health is part of the trust surface: if chain data sources are
unhealthy, detection must fail closed rather than fund orders on stale
evidence. Overpayment handling must be deterministic and disclosed, because
"send more than quoted" is a common user error and a known fraud vector.
Custodial receipt concentrates risk on the seller node and hosted key
infrastructure, which is why guest availability depends on the custody
boundaries of RFC-0008 rather than ad-hoc per-chain keys.

Anonymous buyers reduce collectable personal data; the flow must not
compensate by adding covert fingerprinting. Abuse controls operate on order,
payment, and token evidence.

## Economic and legal analysis

The buyer pays the quoted order total; guest checkout adds no buyer-side
protocol fee. The seller receives order funds directly and bears refund
obligations. Affiliate commissions, when present, are seller-funded under
RFC-0007.

Custodial direct sale without escrow changes the applicable consumer-and-
custody analysis compared with moderated orders: operators of hosted
deployments must review money-transmission, custody, and disclosure
obligations per jurisdiction before enabling guest checkout for real funds,
and buyer-facing text must accurately describe the absence of protocol
protection. This RFC requires that review; it does not perform it.

## Alternatives

### Require every buyer to run a node or wallet identity

Rejected. It removes the product's reason to exist; checkout friction is the
problem guest orders solve.

### Platform omnibus custody for guest funds

Rejected. Pooling guest funds in platform-held accounts creates a stronger
custodial and regulatory posture than seller-directed receipt, and contradicts
the seller-owned settlement model of RFC-0006/0007.

### Full tri-party escrow for guest orders

Rejected for the current scope. Without a buyer identity there is no
meaningful buyer signing party; simulating one server-side would misrepresent
who controls funds. A future buyer-wallet escrow product would be a separate
proposal.

### One global guest flag per store

Rejected. It hides per-chain closure differences and exposes buyers to chains
that can accept but not settle funds.

## Rollout and rollback

Implementation spans Open Core guest services and the hosted service. Rails
enable individually behind the capability gate of Proposal 3; a chain that
loses operational closure (for example, unhealthy chain sources) drops back to
buyer-invisible without affecting funded orders.

Required evidence per enabled rail: allocation, detection, confirmation,
Wallet Domain spendability or completion of every required settlement output,
restart recovery, overpay and expiry behavior, and refund-destination
validation, exercised by end-to-end tests. Rollback removes buyer visibility
for new orders while continuing to watch, settle, and service already-funded
orders; it never abandons funds already received at seller-controlled targets.

## Documentation impact

- Buyer-facing checkout and portal pages must state the custody model and the
  absence of escrow protection before payment.
- Seller and operator docs must cover custody responsibilities, refund
  process, and per-chain availability.
- Link this RFC from RFC-0007 (guest Affiliate boundary), RFC-0008 (guest
  account and managed-escrow custody), and RFC-0009 (frozen attempt terms)
  without moving their authority.
- Publish per-chain capability status as release evidence when scopes ship.

## Open questions

1. What refund-destination verification (and expiry) should the buyer portal
   require per rail?
2. Which confirmation depths and finality language should each chain disclose
   to buyers?
3. Under what conditions, if any, do account-based chains without a managed
   escrow container (for example TRON) become guest-visible?
4. Do fiat provider payments join guest checkout under the same disclosure
   contract or remain a separate provider product?
5. Which jurisdictions' custody or money-transmission review must complete
   before hosted deployments enable guest checkout for real funds?

## Decision

Pending maintainer review. This Draft records the proposed public trust,
custody, capability, and access-credential contract for Guest Checkout. Current
interfaces, effective runtime capability gates, and release evidence continue
to govern actual availability.
