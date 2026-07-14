# RFC-0013: Peer-scoped Deal Link Hosting and Store Authority

- Status: Draft
- Authors: Mobazha product, hosted commerce, and documentation maintainers
- Created: 2026-07-14
- Updated: 2026-07-14
- Decision owners: Mobazha hosted commerce, Open Core order, Unified, and documentation maintainers
- Affected surfaces: hosted Deal Link service, store identity and authorization, standalone administration, Unified, public API, Node order creation, docs
- Supersedes: None
- Superseded by: None

## Summary

Define Deal Link as a hosted distribution artifact bound to one seller store
Peer, one immutable offer revision, and one canonical seller-owned order path.
The store Peer ID is the administration and seller-identity boundary. A hosted
account association is optional access and routing metadata; it neither owns
the link nor becomes a prerequisite for an independently registered store.

Hosting may own the public token, lifecycle, immutable Deal revision, Fee Quote,
acceptance idempotency record, and recovery saga. The store Node remains the
authority for the signed listing, live availability, order, payment,
fulfillment, dispute, and reputation. This proposal does not mark Deal Link as
released; effective capability and release evidence remain authoritative.

## Problem and evidence

The development implementation records both `tenant_id` and `seller_peer_id`,
but seller administration historically queried only by the Casdoor tenant.
That creates two failures:

- two independent stores associated with one account can list or mutate each
  other's links;
- a valid standalone store without an owner association cannot establish the
  tenant context needed to manage a link, even though the platform already
  knows its Peer ID and store credential.

The same ambiguity makes “Connect to Platform” look like a commerce
prerequisite instead of an optional control-plane enhancement. Public Mobazha
identity guidance already defines the store as the business-state boundary and
the hosted account association as access and routing metadata. Deal Link needs
an explicit contract consistent with that boundary.

RFC-0004 discussed an earlier Affiliate proposal attached to Deal Link and is
now Superseded by RFC-0007. It is not an active specification for base Deal Link
ownership, standalone behavior, or hosted/store authority.

## Proposal

### Store and account identity

Every Deal Link binds immutably to a non-empty `sellerPeerID`. Seller admin
reads, updates, lifecycle transitions, order-history views, and future exports
authorize the active store Peer, not the account alone. A caller authenticated
as one account must still select and prove the relevant store context.

A registered standalone store credential may administer that store's Deal
Links before optional owner association. Connecting an account may add SSO,
multi-store switching, recovery, aggregation, branded routing, or other hosted
features, but it does not rewrite `sellerPeerID`, transfer order history, or
change link ownership. Account reassociation therefore does not orphan a link.

### Hosted Deal Link aggregate

Hosting may persist:

- an opaque public token and mutable `draft`, `active`, `paused`, or terminal
  `closed` lifecycle;
- immutable seller-authored Deal revisions, each carrying an exact listing
  reference, quantity/options, displayed price, delivery/acceptance terms,
  expiry, schema version, and terms hash;
- an immutable platform-authored Fee Quote for the accepted revision;
- an idempotent acceptance/recovery record and a seller-safe order reference;
- channel and attribution metadata whose authority is explicitly defined by
  its owning RFC.

`tenant_id` is not a Deal Link ownership or authorization field. Before release,
the catalog namespace moves directly to the store Peer and development rows
may be reset. Implementations must not add dual reads, account-wide fallback,
or compatibility aliases to preserve the current development schema.

### Store-authoritative transaction handoff

Activation and purchase must verify that the referenced signed listing belongs
to `sellerPeerID` and is currently usable under the store's effective
capabilities. Acceptance freezes the exact revision and Fee Quote, then creates
one canonical Node order using the existing order contract. Hosting's
`acceptanceStatus=completed` means only that the Node order was created; it
must not be presented as payment, fulfillment, or order completion.

Pausing, closing, expiry, or later Deal edits affect new purchases only.
Existing accepted orders keep their frozen revision and continue through the
Node lifecycle. Closing is a soft terminal transition; it preserves order and
audit history rather than physically deleting commercial records.

### Capability and failure behavior

Clients must distinguish local/store capability from optional platform
enhancements. A missing owner association must not itself disable Peer-scoped
Deal Link administration. Conversely, a known store credential must not grant
account-wide marketplace, billing, or other control-plane authority.

If the catalog projection, seller binding, Fee Quote, order runtime, or
idempotent recovery state is unavailable or inconsistent, activation or
acceptance fails closed with an explicit retryable or terminal error. The UI
must not infer success from an OAuth popup closing or from a partially completed
create-and-activate sequence.

## Security, privacy, and abuse analysis

Store credentials are bearer secrets and require secure generation, hashed or
otherwise protected storage, rotation, revocation, rate limiting, and audit.
Initial store registration must prove possession of the Peer identity before a
credential can claim that Peer; accepting an arbitrary Peer ID string is not a
sufficient production contract. JWT plus store credential must reject an
account/store mismatch rather than silently selecting either identity.

All seller admin queries include `seller_peer_id`, return not-found across
store boundaries, and receive same-account multi-store negative tests. Public
tokens remain unguessable and disclose only buyer-safe fields. Immutable terms,
seller binding, idempotency keys, expiry, request hashes, and recovery leases
prevent token substitution, revision confusion, duplicate orders, and retries
that escape the accepted contract.

Buyer contact, shipping, payment, and private order facts remain outside the
public Deal projection. Seller order lists expose only fields authorized for
that store and must not treat a public token as seller-admin authority.

## Economic and legal analysis

Deal Link does not itself approve a permanent platform fee. Every buyer charge,
seller deduction, payment/network cost, tax/external cost, discount, and
estimated seller net must be explicit in the immutable Fee Quote and reconcile
with the canonical order. A bootstrap zero-fee policy is an implementation
constraint, not a public pricing promise.

The seller remains the seller of record for the resulting order. Hosting may
provide a disclosed distribution service but does not become the seller,
payment custodian, or fulfillment obligor merely by hosting the link. Delivery,
refund, consumer-protection, tax, advertising, and jurisdiction-specific review
must follow the underlying offer and enabled payment/protection model.

## Alternatives

### Make the Casdoor account the Deal Link owner

Rejected because one account can control several independent stores and a
store can operate without an account binding. Account ownership would merge
business boundaries and make reassociation a data migration.

### Move the complete Deal Link aggregate into every Node immediately

Deferred rather than rejected. It improves independence but duplicates hosted
short-link, quote, idempotency, and recovery infrastructure before their public
contracts stabilize. The proposed split preserves Node authority for catalog
and orders while allowing a clearly bounded hosted distribution artifact.

### Treat a product URL as the Deal Link

Rejected because an ordinary listing URL cannot freeze a custom revision,
price and acceptance terms, platform Fee Quote, lifecycle, expiry, or
idempotent order-creation evidence. Deal Link must explain this added value in
the seller UI rather than appearing as another copy button.

## Rollout and rollback

1. Change Hosting seller-admin lookups and transitions from account-only to
   active `sellerPeerID`; add same-account multi-store isolation tests.
2. Permit a valid registered standalone store credential to establish only the
   Deal Link store context before owner association. Keep account-only surfaces
   unavailable without account authentication.
3. Add proof-of-possession, credential rotation/revocation, JWT/store mismatch,
   and audit coverage before production enablement.
4. Replace the development `tenant_id` catalog namespace with a Peer-keyed
   namespace, reset current development Deal rows and fixtures, and remove the
   superseded ownership path in the same change. No legacy backfill or
   compatibility fallback is required before release.
5. Publish capability and conformance tests for SaaS, connected standalone,
   unbound standalone, account reassociation, same-account multi-store, hosted
   outage, activation failure, acceptance retry, and history after close.
6. Update Unified to present custom terms, price, expiry, edit, pause, close,
   order-created status, and optional Connect enhancements honestly.

Rollback disables new link creation or activation while retaining public
denial, idempotent acceptance recovery, immutable revisions, and order history.
It must not re-enable account-only authorization or hard-delete accepted Deal
records.

## Documentation impact

- Add this RFC to the public registry and link it from identity, community
  commerce, fees, roadmap, and future Deal Link task/API pages where relevant.
- Document product URL versus Deal Link behavior, lifecycle, custom terms,
  immutable quote, seller identity, and order-history semantics.
- Document Connect as optional enhancement and distinguish store API-key scope
  from account scope.
- Add English and Chinese user/task content only when effective capability and
  release evidence support it; Draft text must not be described as shipped.

## Open questions

1. What exact Peer proof-of-possession challenge and credential-rotation
   protocol should replace arbitrary first-registration claims?
2. What is the exact Peer-keyed catalog projection key and signed-listing
   verification contract used by activation and acceptance?
3. Which Deal Link functions must remain available during a Hosting outage, and
   would that require an exportable or seller-hosted public route?
4. Which stable capability and denial codes should Unified use for unbound,
   connected, unavailable-catalog, and unsupported-order cases?
5. What retention and seller export contract applies to closed links and their
   acceptance audit records?

## Decision

Pending maintainer review. Until Accepted, this RFC records the proposed
identity, hosted-service, and transaction-authority boundaries. Effective
runtime capabilities, signed listings, canonical Node orders, and tagged
release evidence remain authoritative for current behavior.
