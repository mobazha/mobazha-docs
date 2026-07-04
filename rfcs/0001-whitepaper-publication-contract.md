# RFC-0001: Founding Whitepaper Publication Contract

- Status: Review
- Authors: Mobazha documentation maintainers
- Created: 2026-07-04
- Updated: 2026-07-04
- Decision owners: Mobazha project maintainers and public source owners
- Affected surfaces: project policy, documentation, Node, Unified, hosted service
- Supersedes: None
- Superseded by: None

## Summary

Define the evidence and review gates required to advance the Founding
Whitepaper from `0.1-review` Draft to version `1.0`.

## Problem and evidence

A whitepaper can clarify durable project direction, but it can also create
false expectations when product scope, economic policy, governance, and
runtime behavior are mixed together. Mobazha needs a public narrative that is
ambitious without turning proposals into guarantees or reviving historical
illustrative percentages as policy.

The current review draft deliberately defers to public release scope, fee
policy, generated contracts, runtime capabilities, and transaction evidence.

## Proposal

Version `1.0` may be published only after reviewers confirm:

1. the problem statement and durable principles match public project intent;
2. the system model matches Node, Unified, and optional hosted-service boundaries;
3. independent operation and optional-service dependencies are described accurately;
4. Agent identity, authorization, consent, audit, and failure boundaries are explicit;
5. economic language identifies service categories without asserting unapproved percentages;
6. governance and amendment rules identify owners and decision thresholds;
7. security, privacy, licensing, trademark, and regulatory wording receives appropriate review;
8. every current-behavior claim links to a reviewed public authority;
9. the Chinese translation is reviewed against the approved English source;
10. unresolved disagreements are recorded rather than hidden by ambiguous wording.

## Publication semantics

- The whitepaper states durable direction and principles.
- Release documents and generated contracts state versioned product scope.
- Effective runtime capabilities state what a connected backend exposes.
- A transaction quote and authoritative state state what applies to an order.
- No whitepaper version grants an Agent permission or activates a feature.

## Security, privacy, and abuse analysis

The public artifact must not reveal credentials, recovery material, private
infrastructure, customer data, confidential incidents, or exploitable details
outside the coordinated security process. Agent guidance must fail closed when
identity, scope, authority, price, recipient, state, or confirmation is unclear.

## Economic and legal analysis

The whitepaper may describe categories and principles but not invent prices,
returns, financial products, legal classifications, or obligations for
independent operators. Effective prices and terms remain in their owning
public sources.

## Alternatives

- Publish the current draft as final: rejected because review ownership,
  amendment rules, and open questions are not resolved.
- Keep the whitepaper internal: rejected because public principles need a
  reviewable source and Agents need a clear authority boundary.
- Avoid a whitepaper and rely only on implementation documents: rejected
  because implementation contracts do not explain durable product and trust
  principles.

## Rollout and rollback

Publication updates the canonical English page, Chinese translation,
machine-readable index, Agent context, version metadata, and release note. If
a material error is found, version `1.0` remains archived with a correction or
supersession link; it is not silently rewritten.

## Documentation impact

Update the English and Chinese whitepaper pages, version metadata, decision and
history indexes, Agent context, public source references, and release notes.
Any claim about current behavior must continue linking to the narrower release
or runtime authority.

## Open questions

- Which maintainers provide final product, architecture, security, economic,
  and legal review?
- What public amendment threshold should apply after version `1.0`?
- Should a signed PDF snapshot accompany each major version, or is a tagged
  Markdown source with reproducible rendering sufficient initially?

## Decision

Pending public and maintainer review.
