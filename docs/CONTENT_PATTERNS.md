# Mobazha Content Patterns

- Status: Current
- Last reviewed: 2026-07-04

Use the smallest page type that lets a reader complete a job or answer a
question safely. A page should not mix a long tutorial, a full contract, and a
policy decision simply because they share a noun.

One canonical source may produce different human and Agent projections. Human
pages lead with outcome, action, and observable completion; Agent publications
retain the same facts with explicit authority and applicability. The active
renderer and navigation migration is defined in
[`HUMAN_EXPERIENCE_IMPLEMENTATION_PLAN.md`](./HUMAN_EXPERIENCE_IMPLEMENTATION_PLAN.md).

## Choose a page type

| Type | Reader outcome | Required shape |
|---|---|---|
| `hub` | Choose the next journey | Brief orientation and links to task or reference pages |
| `task` | Complete and verify one job | Prerequisites, numbered steps, verification, and recovery |
| `reference` | Integrate against a contract | Authentication or scope, examples, errors, retries, and compatibility |
| `concept` | Understand a model or boundary | Definition, applicability, relationships, and consequences |
| `policy` | Know the current public rule | Scope, normative statement, exceptions, authority, and review date |

Declare the type in frontmatter. Task and reference pages also declare the date
on which their commands, examples, or contract assumptions were last tested.

```yaml
pageType: task
lastTested: 2026-07-04
```

## Task pattern

Use an observable starting state and one primary outcome. Prefer user language
over internal service names.

````markdown
## Before you start

- State permissions, release maturity, irreversible effects, and required data.

## Complete the task

1. Start from a named screen, command, or API state.
2. Make one decision per step.
3. Record any recovery handle before leaving the flow.

## Expected result and verification

Describe what the reader can inspect. Do not treat a request acknowledgement as
proof of payment, delivery, settlement, or another later state.

## If something fails

- Map likely symptoms to safe recovery actions.
- For an unknown financial outcome, reconcile authoritative state before retry.
````

## Reference pattern

A reference page explains the public contract without becoming a second copy
of a generated schema. Link the versioned contract, then add usage decisions
that the schema cannot express clearly.

````markdown
## Authentication and scope

Identify the credential, narrowest scope, and runtime capability gate.

## Example

```text
Use a complete, redacted, and reproducible request.
```

## Errors and retries

Separate invalid requests, authorization failure, state conflict, throttling,
dependency failure, and unknown outcome. State when retry is unsafe.

## Compatibility

Name the tested version or review date and link the generated contract.
````

## Blocks and rendering

The content renderer preserves document order and supports level-two and
level-three headings, paragraphs, ordered and unordered lists, fenced code
blocks, tables, standalone images, separators, and callouts beginning with
`Important`, `Warning`, `Note`, or `Tip`. Inline links, code, and bold text are
supported. A list made only of Markdown links is rendered as related-link
cards.

Use a table for compact comparisons, not long prose. Use a callout for a risk
or applicability boundary, not as a substitute for a section. Never put a
credential, customer payload, recovery secret, or production endpoint in an
example.

## Definition of ready

Before publication, confirm that:

1. The page answers one reader job and links the next likely job.
2. Status, audience, evidence, review date, page type, and applicability agree.
3. Shipped behavior, Beta behavior, proposals, and history are distinguishable.
4. Commands and examples were tested where practical and use placeholders for secrets.
5. Success is observable and failures have a safe recovery path.
6. Runtime and transaction claims point to their owning contract or system.
7. The page does not duplicate policy owned by another page or repository.
8. Generated human and Agent outputs are refreshed with `npm run generate:content`.
9. `npm run check` passes and affected routes are inspected in the rendered site.
