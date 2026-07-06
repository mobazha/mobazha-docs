---
title: Agents, Skills, Tools, and approvals
summary: See how Mobazha turns an Agent suggestion into a scoped, reviewable commerce action without treating a model, prompt, or Skill as authority.
status: Beta
audiences:
  - Sellers
  - Operators
  - Agent builders
  - Developers
  - Security reviewers
evidenceLabel: Mobazha public Agent Kernel, MCP, identity, scope, capability, and extension contracts
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: Place an Agent, Skill, Tool, MCP transport, approval, and Core command at the correct authority boundary.
estimatedTime: 10 minutes
journey: understand
primaryAction:
  label: Build with MCP
  href: /build/mcp
featuredVisual: agent-commerce-boundary
---

## Assistance and authority are different products

An Agent can help a buyer compare offers, help a seller prepare listings, summarize an order, or propose the next operating action. None of those abilities makes the Agent the authority for identity, money, policy, or commerce state.

Mobazha separates reasoning from execution. A model or Skill may propose an intention. A typed Tool translates an allowed intention into a bounded request. The authenticated backend evaluates scope, capability, state, quote, policy, approval, and idempotency before it admits a protected command.

## Six distinct concepts

| Concept | Responsibility | It does not grant |
|---|---|---|
| Agent | Maintains a task conversation, gathers context, reasons, and presents choices | Store access, spending authority, or permission to change an order |
| Skill | Packages instructions and a reusable business workflow around abstract capabilities | Direct database, wallet, key, or state-machine access |
| Tool | Defines one typed executable operation, including input/output, risk, side effects, and capability requirements | Permission merely because the Tool is known or listed elsewhere |
| MCP or API transport | Carries discovery and calls across an authenticated interface | A bypass around gateway identity or domain scopes |
| Approval | Records a human decision bound to a specific proposed request | Permission for a different payload, expired quote, changed state, or unlimited retries |
| Core command gate | Validates the request and owns admitted business-state transitions | Trust in model output without independent checks |

- [Use the machine-readable documentation surface](/agents)
- [Review authentication and scopes](/build/authentication)
- [Understand typed extension boundaries](/build/extensions)

## The safe execution path

1. **Resolve context.** Identify the tenant, store, thread, actor, held roles, and one acting persona for the current task.
2. **Select a Skill.** Load only a Skill applicable to that persona, task, distribution, and effective capability set.
3. **Discover Tools.** Resolve concrete Tools from the current catalog instead of inventing a Tool name from prompt memory.
4. **Prepare a request.** Validate schema, summarize effects, expose recipients and amounts, and assign a stable idempotency key where required.
5. **Request approval.** For write, financial, or dangerous actions, bind the user's decision to the exact action and request hash.
6. **Revalidate and execute.** The backend checks identity, scope, capability, expected state, quote, policy, approval, and freshness again.
7. **Record the result.** Preserve request, approval, command, order, and result identifiers while redacting credentials and personal data.

This sequence is intentionally stricter than “the model called a function.” The same Tool request can be allowed for one actor and store, denied for another, or become stale before execution.

## Persona, scope, and capability solve different problems

- **Persona** says which role the user is acting as during this turn, such as buyer, seller, moderator, or operator. Holding several roles should not leak every role's Skills and Tools into one task.
- **Scope** says which domain actions the credential may request, such as reading listings, managing orders, reading a wallet, or writing chat.
- **Capability** says whether the connected distribution and backend can admit the product operation now.
- **Resource state and policy** say whether that operation is valid for this specific order, listing, payment session, or thread.

All four can be required. `ai:use` can admit an MCP session, while an individual Tool still needs its domain scope and the underlying resource checks.

## A Skill is a workflow, not a secret superpower

A Skill should name the business outcome, required abstract capabilities, inputs, expected artifacts, review points, and failure conditions. It should remain stable even when a concrete Tool implementation changes.

Skill delivery can vary by distribution:

- a local or embedded plain-text Skill can guide a self-hosted workflow;
- a reviewed first-party Skill can compose trusted Tools;
- a hosted commercial Skill can add private strategy, model routing, or data services;
- future remote or encrypted Skill delivery must remain labeled until its runtime and security evidence exist.

Source availability, a Skill identifier, or a prompt file does not prove that a connected backend licenses, enables, or safely supports the workflow.

## Approval binds intent to one action

Protected actions need more than a generic “yes.” The review surface should show the active store and persona, action, affected resource, recipient, amount or price impact, policy consequence, and whether the operation is reversible. The persisted approval should bind to the request payload and carry a stable identifier.

Execution must still fail closed when:

- the order or resource state changed after approval;
- a quote, payment target, or deadline expired;
- the authenticated actor or active store no longer matches;
- the Tool schema, capability, or policy changed;
- the idempotency and replay rules do not permit another attempt.

Approval makes a proposed action reviewable. It does not move Core authority into the Agent runtime.

## MCP is one execution surface, not the Agent product itself

The current Node MCP entry point uses authenticated Streamable HTTP at `/v1/mcp`. It is a machine interface for discovering and invoking permitted Tools. Human-facing workspaces, embedded assistants, scheduled workflows, webhooks, and direct API clients may use the same underlying business contracts without becoming MCP.

Conversely, an MCP connection is not automatically an autonomous Agent. Autonomy also requires an explicit task, credential lifetime, scopes, Tool policy, budget, confirmation policy, failure handling, and audit owner.

- [Initialize the current MCP transport](/build/mcp)
- [Handle conflicts and idempotency](/build/errors-and-idempotency)
- [Follow order and payment authority](/project/transaction-spine)

## Current contract and evolution direction

| Area | Public meaning now | Direction that must remain labeled |
|---|---|---|
| MCP | Authenticated `/v1/mcp` discovery and calls are additionally constrained by `ai:use` and Tool domain scopes | More clients, richer Tool coverage, and cross-surface orchestration |
| Agent Kernel | Context scope, persona, Tool metadata, risk, approval, run, memory, and provider interfaces define reusable boundaries | Broader production workflows, policy packs, and operator experiences |
| Skills | Plain-text and provider-loaded Skill contracts can describe reusable workflows | Commercial registries, licensed delivery, and third-party Skill ecosystems |
| Approval | Request-bound approval and idempotency primitives support human-in-the-loop writes | Richer risk policy, step-up identity, revocation, and multi-party approval |
| Commerce automation | Agents may read, draft, compare, summarize, prepare, and request actions allowed by current contracts | More proactive seller, buyer, support, and operator workflows after evidence gates |

Do not infer that every Skill, Tool, model provider, memory system, commercial workflow, or autonomous mode is available from the existence of the Kernel. The connected backend's Tool catalog, effective capabilities, applicable policy, and release evidence remain authoritative.
