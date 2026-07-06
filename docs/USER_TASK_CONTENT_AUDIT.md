# User Task Content Audit

- Status: Active editorial audit
- First review: 2026-07-06
- Scope: English public pages first; Chinese navigation and existing translations remain aligned but are not expanded mechanically
- Success measure: time to a correct next action and a verifiable answer, not page count

## Audit method

Review the portal as six different users. For each question, verify that the reader can:

1. find one canonical route without knowing repository terminology;
2. distinguish current, Beta, conditional, proposed, and historical claims;
3. identify the responsible store, backend, operator, provider, or policy owner;
4. take a safe next action;
5. recognize success, failure, and recovery;
6. follow exact runtime or release evidence when availability matters.

Severity is based on the consequence of a missing answer:

- **P0** — can cause a wrong authority, payment, security, or operating decision;
- **P1** — blocks task completion or makes the product model materially unclear;
- **P2** — creates avoidable support work, navigation cost, or editorial inconsistency.

## Current user-question matrix

| User | Primary question | Canonical route | Current result | Remaining gap |
|---|---|---|---|---|
| New visitor or evaluator | What is Mobazha, and how is it different from a conventional commerce platform? | `/project/product-map` | Product model and Own, Connect, Trade, Extend narrative are explicit | Validate comprehension with first-time readers; add real product proof only after the public demo and fee language pass the evidence gate |
| Buyer | Who operates this store, what will I pay, and how do I recover the order? | `/buy`, `/buy/checkout`, `/buy/order-status`, `/buy/cancel-refund-dispute` | Quote, seller-owned order, state, and recovery paths are connected | Replace conceptual-only proof with reviewed representative states when stable synthetic demo data exists |
| Seller | Can I publish, receive payment evidence, fulfill, and support an order? | `/sell` and seller task routes | Complete operating sequence and verification outcomes are documented | Cross-check every step against one released hosted and one released self-hosted journey; record differences by capability rather than product name |
| Operator | Should I use hosted, self-hosted, or selected managed services? | `/start/choose-deployment`, `/self-host`, `/project/architecture` | Control and responsibility are explicit; direct P2P and Hybrid topologies are now separated | Publish release-linked install, update, backup-restore, and incident evidence for each supported distribution |
| Developer | Which contract is callable here, and how do retries and unknown outcomes work? | `/build`, `/build/quickstart`, `/build/runtime-capabilities`, `/build/errors-and-idempotency` | Contract discovery, authentication, denial, retry, and capability gates are documented | Keep examples and observable responses pinned to tagged public contracts; add conformance evidence for hosted/self-hosted combinations |
| Agent builder | What may an Agent discover, propose, approve, execute, and audit? | `/project/agent-commerce`, `/build/mcp`, `/agents` | Identity, scope, Tool discovery, approval, Core validation, and audit boundaries are explicit | Publish real Tool and Skill availability only from runtime discovery; avoid a static catalog that overstates enabled capabilities |

## First correction batch

The first batch closes the highest-impact architecture comprehension gap:

- replace the reused product-map visual on `/project/architecture` with a dedicated direct P2P and Hybrid store-network topology;
- state that P2P does not require every buyer to run a Node, does not guarantee direct transport for every request, and does not replicate every order to every peer;
- show that a Hosting gateway routes hosted store context but does not become the authority for independent Node orders;
- explain Hybrid as bounded service composition rather than a third backend owner;
- carry the same distinction into deployment choice, fees, and compatibility guidance.

## Next correction batches

### Batch 2 — Current capability and product proof

- Walk one buyer, seller, hosted operator, self-hosted operator, developer, and Agent path against released public builds.
- Record the first point where the docs, runtime capability response, UI, and release evidence disagree.
- Prefer observable outputs and synthetic states over decorative screenshots.
- Publish a compact hosted-versus-self-hosted capability comparison only where exact release evidence exists.

### Batch 3 — Whitepaper and project narrative

- Tighten the executive summary around the problem, product mechanism, economic loops, constraints, and current validation boundary.
- Map major whitepaper claims to Product model, Architecture, Fees, Roadmap, RFC, or historical evidence instead of repeating them on every page.
- Remove repeated defensive language where status and applicability already communicate the limit.

### Batch 4 — Support and continuous evidence

- Review zero-result searches, repeated support questions, stale reports, and next-page exits after a privacy-safe measurement decision exists.
- Convert repeated questions into direct answers or task recovery, not an ever-growing FAQ taxonomy.
- Re-run the six-user audit for each public release and any material payment, identity, order, distribution, or Agent change.

## Publication guardrails

- Do not publish internal Hosting prices, customer data, credentials, vulnerabilities, or private operating procedures.
- Do not infer shipped capability from source presence, an identifier, a roadmap, or a diagram.
- Do not describe a market, channel, gateway, provider, Agent, or peer as the order authority unless the applicable public contract explicitly assigns that role.
- Do not add a new public page merely because a feature term exists; use the smallest product, task, reference, policy, or direction layer that answers the user question.
