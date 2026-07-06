---
title: The Mobazha transaction spine
summary: Follow one trade across order authority, payment evidence, fulfillment, and policy-gated recovery without collapsing them into one misleading status.
status: Beta
audiences:
  - Buyers
  - Sellers
  - Operators
  - Developers
  - Evaluators
evidenceLabel: Mobazha public order, payment-session, capability, and recovery contracts
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: Read a transaction correctly and know which state, evidence, policy, and actor authorize the next action.
estimatedTime: 9 minutes
journey: start
primaryAction:
  label: Track an order
  href: /buy/order-status
featuredVisual: transaction-spine
---

## One trade, three state surfaces

A Mobazha transaction moves through one durable spine: review terms, create an order, establish and verify payment, fulfill, and complete. Recovery can branch into cancellation, decline, refund, or dispute when the active state and policy permit it.

The interface may present that journey as one timeline, but three state surfaces remain separate:

| Surface | What it answers | Authority |
|---|---|---|
| Order | What have buyer and seller committed to, and what action is legal next? | The order-owning Core backend and its state machine |
| Payment session | Where should funds go, what has been observed, and what has been verified? | A durable session binds the order, quote, rail, observations, and verification result |
| Protection and recovery | Which cancellation, refund, dispute, or settlement path applies? | The accepted product terms, current state, roles, and effective capabilities |

No surface should silently stand in for another. A wallet event is payment evidence, not an order transition. A completed order does not by itself describe the settlement rail. A dispute button does not prove that every order has the same protection model.

## The normal path

1. **Review terms.** The buyer reviews one seller's item, price, shipping, payment, refund, and protection terms. Volatile values should be bound to a quote or equivalent evidence.
2. **Create the order.** The order-owning backend assigns the durable identity, stores the accepted snapshot, and admits the first order state.
3. **Establish payment.** A payment session binds the order to a funding target or provider session, amount, asset or currency, expiry, confirmation policy, and applicable settlement semantics.
4. **Observe and verify.** Wallet, chain, or provider events refresh payment information. Core evaluates those facts and decides whether the order may advance.
5. **Accept and fulfill.** The seller takes only actions exposed by the current order state and capability, then records fulfillment or pickup evidence.
6. **Complete.** The backend records the terminal business outcome while preserving the bindings needed for reconciliation and recovery.

- [Review checkout responsibilities](/buy/checkout)
- [Track payment and order status](/buy/order-status)
- [Operate incoming orders](/sell/orders)
- [Configure accepted payment methods](/sell/payments)

## Events prompt a refresh; backend state is authoritative

Clients can receive a message, webhook, provider callback, or wallet observation before or after another surface updates. Treat those events as prompts to reload the affected resource. Render the backend's latest order and payment-session state, not a locally inferred transition.

This rule protects both sides from several dangerous shortcuts:

- do not mark an order paid from a transaction identifier alone;
- do not fulfill because a notification arrived without verified backend state;
- do not infer refund completion from a requested refund;
- do not infer settlement finality from order completion;
- do not retry a protected command without its current idempotency and state rules.

## Protection is a product term, not a universal badge

Payment rail and protection model are independent choices. A direct-observed payment, an escrow-like flow, and a provider-hosted session may expose different actions. Product terms can further determine who may cancel, when funds can move, what evidence a dispute accepts, and which actor or mechanism resolves it.

Before calling a transaction “protected,” identify:

1. the accepted order and payment terms;
2. the active protection or settlement model;
3. the party or mechanism that controls funds at each stage;
4. the available recovery actions and their deadlines;
5. the evidence and finality rules for the applicable rail.

Mobazha should describe these concrete properties instead of implying that one generic “buyer protection” promise covers every distribution, seller, rail, and order.

## Recovery branches preserve the original spine

Cancellation, decline, refund, and dispute are not interchangeable labels:

| Branch | Typical meaning | What must be checked |
|---|---|---|
| Cancel | Stop an order before the applicable commitment or fulfillment boundary | Actor, current state, payment progress, and cancellation policy |
| Decline | Seller refuses an order before acceptance or fulfillment | Seller authority, reason, and required payment recovery |
| Refund | Return some or all value after payment evidence exists | Refund destination, amount, rail capability, authorization, and finality |
| Dispute | Preserve and evaluate conflicting claims under an applicable protection model | Eligibility window, evidence, resolver, decision, and settlement effect |

The original order, payment binding, and evidence remain part of the audit trail. A recovery action should not manufacture a new, disconnected history.

- [Cancel, request a refund, or open a dispute](/buy/cancel-refund-dispute)
- [Review public security and recovery guidance](/project/security)

## Current contract and evolution direction

| Area | Public meaning now | Direction that must remain labeled |
|---|---|---|
| Order state | Core owns admitted business transitions and clients render current state | Richer cross-client timelines and operator diagnostics |
| Payment session | Durable order binding, funding target or provider state, observations, and verification are modeled separately | More rail adapters and recovery automation |
| Protection | Available actions depend on accepted terms, state, role, and effective capability | Additional product modes, resolvers, and evidence workflows |
| Fulfillment | Shipping, pickup, or other fulfillment facts advance the order only through admitted actions | Broader delivery and supply-chain integrations |
| Automation | Webhooks and Agents may observe, prepare, or request bounded actions | More policy-aware automation with explicit approval and audit |

The connected backend, applicable release, accepted transaction evidence, and effective capabilities remain the availability authority. An RFC, diagram, configuration key, or source package does not activate a rail or protection mode.
