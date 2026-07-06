---
title: What you pay and who receives it
summary: Read the buyer total, seller proceeds, service charges, external costs, and refund rules without hiding them inside one vague commission number.
status: Current
audiences:
  - Buyers
  - Sellers
  - Operators
  - Evaluators
  - Agents
evidenceLabel: Mobazha public fee policy, quote requirements, and release evidence
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-06
pageType: policy
outcome: Determine what an order or service costs, who pays and receives each amount, when the amount becomes binding, and how cancellation or refund changes it.
estimatedTime: 9 minutes
journey: understand
primaryAction:
  label: Read a fee quote
  href: /project/fees#read-a-fee-quote
---

## Where this page fits

This page defines how Mobazha fees and costs must be explained. It is not a price list and does not invent a rate for a particular hosted plan, payment rail, seller, or transaction.

| Need | Source to use |
|---|---|
| Understand the durable fee and disclosure rules | This page |
| See currently published hosted plans or service prices | [Mobazha pricing](https://mobazha.org/pricing) and [fees](https://mobazha.org/fees) |
| Know the exact total and recipients for one order | The final Fee Quote or equivalent checkout quote accepted before payment |
| Understand item, delivery, payment, and order state | [Checkout guide](/buy/checkout) and [transaction spine](/project/transaction-spine) |
| Understand long-term economic principles | [Founding whitepaper](/project/whitepaper) |

## Direct answers

- **Does every Mobazha order pay a central commission?** No. Running the Community software on infrastructure you control does not by itself create a mandatory Mobazha transaction fee.
- **Does open source mean everything is free?** No. Servers, storage, payment networks, providers, delivery, plugins, AI, support, taxes, and optional managed services have real costs.
- **Is every deduction a Mobazha fee?** No. The recipient may be the seller, carrier, blockchain network, payment provider, tax authority, operator, referrer, or another named service.
- **When should the buyer know the total?** Before final confirmation and before funds are committed. A later screen should not silently add a new required charge.
- **When should the seller know net proceeds?** Before accepting the applicable service or order terms, including seller-paid charges and refund treatment.
- **Can a seller, market, operator, or Agent earn a fee?** Yes, where lawful and explicitly funded, attributable, capped, disclosed, and handled correctly after refunds or fraud.
- **Where are current rates?** On the applicable provider or service pricing surface and in the transaction quote—not in an old screenshot, discussion, or illustrative percentage.

## Read a Fee Quote

The following is an illustration of structure, not a Mobazha rate or current offer:

| Line | Illustrative amount | Payer | Recipient | Why it exists |
|---|---:|---|---|---|
| Item | $100.00 | Buyer | Seller | The product or service being purchased |
| Delivery | $8.00 | Buyer | Seller or carrier | The selected fulfillment method |
| Managed transaction service | $2.00 | Buyer | Named operator | A disclosed checkout, evidence, dispute, or operating service |
| Payment or network cost | $1.00 estimated | Buyer | Payment provider or network | Cost of the selected rail; finality and variability must be stated |
| Tax | $5.00 | Buyer | Seller, merchant, or tax authority as applicable | A disclosed tax obligation |
| **Buyer total** | **$116.00** |  |  | The amount approved before payment |

The quote must also show seller proceeds separately. Buyer total and seller net are not interchangeable: delivery may be passed to a carrier, a service may be seller-paid instead, a network estimate may change within stated rules, and taxes may be collected by a different party.

Before accepting the example, a real quote would still need to state:

- currency or asset, exchange-rate source and time, and quote expiry;
- fixed and percentage components, minimums, caps, and the amount each percentage applies to;
- whether each line is required, optional, estimated, refundable, or condition-dependent;
- who controls funds and when each recipient is paid;
- what happens after cancellation, partial refund, full refund, dispute, expiry, or failed payment;
- the policy and quote version stored with the order.

If the product cannot produce this information, it should not silently deduct a newly introduced charge.

## Five different kinds of amount

| Category | Value being paid for | Typical recipient | Required disclosure |
|---|---|---|---|
| Hosting subscription | Availability, management, quotas, updates, backup, domain, or support | Hosted-service operator | Billing period, included capacity, renewal, cancellation, export, and overage terms |
| Transaction service | Payment execution, order operations, delivery coordination, evidence, dispute handling, or a defined risk responsibility | The operator actually providing the service | Payer, amount or rate, cap, covered service, settlement, and refund treatment |
| Usage or professional service | AI, storage, CDN, notifications, API use, migration, implementation, training, or SLA | The named service provider | Meter, included quantity, overage price, term, and exit path |
| Distribution or referral compensation | Attributable incremental demand, curation, or sales assistance | Referrer, market operator, Agent publisher, or another disclosed participant | Funding source, beneficiary, attribution window, cap, conflict disclosure, and reversal rule |
| External cost | Network gas, processor charge, exchange cost, tax, carrier fee, or third-party plugin | Network, provider, authority, carrier, or plugin operator | Original cost or estimation rule, recipient, variability, and any disclosed markup |

“The seller received less than the order total” does not prove a platform commission. The settlement record must preserve the separate reason and recipient for each difference.

## Costs depend on the operating path

### Self-hosted Community software

- Independent operation does not require a managed subscription or universal central Mobazha transaction commission.
- The operator pays its own infrastructure, administration, backup, network, payment, and selected third-party costs.
- Optional Mobazha or third-party services may charge separately after the provider, price, exchanged data, renewal, and exit path are disclosed.

### Hosted service

- Hosted plans may charge for operation, reliability, storage, domain, updates, automation, AI, analytics, or support.
- Free Beta access or a free tier is a current service policy, not a permanent right.
- The applicable pricing page and service terms must state the plan, effective date, limits, renewal, cancellation, and export path.

### Deal Link or managed transaction

- A transaction-related fee is justified only by a named service or responsibility such as execution, delivery coordination, evidence, dispute operations, or risk handling.
- Low-touch automated delivery and high-touch human operations do not have to use the same pricing model.
- The transaction quote—not this policy page—owns the actual rate and amount.

### Distribution, referrals, and Agents

- Compensation is optional and must have a real funding source, normally chosen by the seller or responsible operator.
- It applies only to attributable, settled value under the disclosed window and cap.
- Refunds, fraud, and attribution corrections must reverse or adjust compensation under the accepted rule.
- Paid recommendations and Agent conflicts must be disclosed before they influence a paid decision.
- Registration counts, recruitment layers, and unlimited downstream percentages are outside current Mobazha policy.

## How money moves through an order

1. **Policy is configured.** The seller, operator, and providers publish eligible item, delivery, service, referral, tax, and external-cost rules.
2. **A quote is calculated.** The backend binds the current item revision, payer, recipients, amounts, currency or asset, expiry, and applicable rules.
3. **The buyer confirms.** The final total and material conditions are visible before payment instruction or provider authorization.
4. **The order preserves the snapshot.** A later policy or price change does not silently rewrite the accepted transaction.
5. **Payment and settlement are reconciled.** The system records what was instructed, observed, verified, paid to each recipient, and still pending.
6. **Recovery adjusts explicit lines.** Cancellation, refund, dispute, failure, or fraud changes only the amounts authorized by the accepted policy and current state, with an auditable record.

An Agent can compare or explain a quote, but it cannot replace the user's required confirmation, invent a recipient, or treat an estimate as final.

## What each user should check

### Buyer

- Confirm item, delivery, tax, service, and external costs add up to the displayed total.
- Identify the seller, order-owning backend, payment recipient or funding target, and refund route.
- Do not pay a second instruction merely because the first status is delayed; reconcile the existing order first.

### Seller

- Confirm which charges the buyer pays, which are deducted from proceeds, and which remain the seller's external operating costs.
- Review settlement timing, refund and dispute exposure, provider costs, attribution compensation, and tax responsibility.
- Test a complete quote, payment, settlement, refund, and accounting journey before enabling a new paid service.

### Operator or evaluator

- Separate revenue from pass-through external costs and from amounts held for other recipients.
- Measure whether the service fee corresponds to delivered value, support load, risk, and sustainable unit economics.
- Reject pricing that depends on hidden spread, forced enrollment, unclear custody, or irreversible exit costs.

## How Mobazha can be sustainable

Mobazha commercial entities may earn revenue from services that users can identify and evaluate: managed hosting, transaction operations, metered AI or infrastructure, professional implementation and support, and optional distribution tools. The project should test willingness to pay against real transaction outcomes and operating costs rather than subsidize activity to manufacture registration or volume.

The durable economic boundary is:

- Community Core remains independently operable without a mandatory central Mobazha fee on ordinary self-hosted orders;
- commercial revenue corresponds to a named service, provider, payer, and responsibility;
- network and third-party costs remain separately visible;
- transaction and referral compensation is funded, attributable, capped, and reversible where required;
- no Token price, recruitment position, or speculative future value substitutes for product revenue.

Introducing a mandatory central service or fee for ordinary self-hosted orders requires a public decision, migration and exit analysis, explicit product and API behavior, updated release scope, and applicable legal review.

> **Important:** Old percentages, internal pilots, and illustrative allocations are not current rates. A price becomes effective only through the applicable public service surface and transaction quote with scope and effective date.
