# RFC-0016: Peer Handle Naming, Resolution, and Portability

- Status: Draft
- Authors: Mobazha identity, hosted commerce, client, and documentation maintainers
- Created: 2026-07-18
- Updated: 2026-07-18
- Decision owners: Mobazha Open Core identity, hosted service, Unified, standalone operators, and documentation maintainers
- Affected surfaces: Peer identity and Profile, hosted handle registry, standalone registration, store and promoter routes, search and mentions, DNS, Unified, public API, docs
- Supersedes: None
- Superseded by: None

## Summary

Define a human-readable Peer handle that resolves to exactly one Peer ID in a
canonical Mobazha network namespace. The handle is the primary public locator
for people, stores, promoters, clients, and Agents; the Peer ID remains the
stable cryptographic identity, authorization boundary, and business-record
key.

A handle may route directly to the Peer's default public store, while named
Storefronts retain separate slugs and transactions continue to freeze Peer IDs.
The initial canonical registry may be hosted, but handle availability is an
optional discovery and routing service: a standalone store keeps operating by
Peer ID and custom domain when that registry is unavailable.

This RFC proposes the public naming contract. It does not claim that a
network-wide registry, signed claims, cross-deployment portability, promoter
pages, or every route described here is released.

## Problem and evidence

Mobazha exposes Peer IDs as stable store and participant identities. They are
appropriate machine and cryptographic identifiers but are hard for people to
remember, distinguish, search, mention, or say aloud. Public store URLs that
contain a Peer ID are poor brand and distribution surfaces.

The hosted implementation already contains a narrower predecessor. The
[`store_domains` model](https://github.com/mobazha/mobazha_hosting/blob/main/db/store_domain.go)
stores a globally unique handle beside a Peer-keyed tenant, and the
[`SaaS Store Brand Independence` design](https://github.com/mobazha/mobazha_hosting/blob/main/docs/product/SAAS_STORE_BRAND_INDEPENDENCE.md)
defines `/store/{handle}`, `{handle}.mymbz.org`, permanent Peer-ID URL
compatibility, and SaaS-to-standalone brand continuity. That design was written
when one Peer was commonly presented as one store and did not define a public
identity protocol, signed claim, recovery model, or disconnected-deployment
behavior.

The later
[`Identity Model Design`](https://github.com/mobazha/mobazha_hosting/blob/main/docs/IDENTITY_MODEL_DESIGN.md)
separates the private hosted account, the public Peer Identity, and one or more
Storefronts. A handle therefore needs one stable subject and one authority
boundary before Affiliate pages, search, chat mentions, Agents, stores, and
standalone deployments create incompatible namespaces.

Without a reviewed contract, the project risks:

- separate store, promoter, and account handles that collide or disagree;
- using a mutable name as an order, reputation, commission, or authorization
  key;
- exposing that several intentionally separate Peers share one hosted account;
- allowing rename, release, or recovery to transfer accumulated trust to a
  different Peer without disclosure;
- claiming network-wide uniqueness when only one hosted database enforced it;
- making independently operated stores depend on Hosting for local commerce.

## Proposal

### 1. Define one Peer handle

A Peer handle is a normalized, human-readable name with this active mapping:

```text
(namespace, handle) -> peerID
```

Within the canonical Mobazha network namespace:

- one active handle resolves to exactly one Peer ID;
- one Peer ID has at most one active primary handle;
- the Peer ID remains the canonical identity and business-state boundary;
- a Peer may claim a handle without operating a store;
- a hosted account may administer several Peers and their handles, but that
  common account association is private and is not inferred or published by
  the handle service.

The handle is not a replacement Peer ID, account username, wallet address,
Storefront ID, product slug, or transaction key. Clients may display it as the
preferred public name, but signed statements and durable records identify the
Peer ID.

### 2. Make the default store directly reachable

The same handle may be consumed by several explicit surfaces:

```text
@alice                    human display and mention
/store/alice              default public store
alice.mymbz.org           branded default-store host
/p/alice                  promoter or distribution profile
handle lookup API         search, client, and Agent resolution
```

Resolution first returns the Peer ID. The selected surface then applies its
own authorization and visibility contract. A store route opens the Peer's
default public Storefront; a promoter route projects that promoter Peer's
valid Affiliate relationships; a mention names the Peer Identity.

Named Storefronts remain presentation objects under one Peer and use their own
Storefront slugs. Product slugs continue to name content. The intended
distinction is:

```text
handle          who
Peer ID         which cryptographic identity
Storefront slug which presentation surface
product slug    what content
```

`/store/{peerID}` remains permanently resolvable where the store is public.
Clients may redirect it to the current handle URL for canonical presentation,
but a rename must never break a shared Peer-ID URL.

### 3. Keep business facts Peer-scoped

Orders, listings, reputation, messages, Affiliate programs and statements,
wallets, settlement terms, and authorization remain keyed by Peer ID or their
own immutable identifiers. A resolver translates a handle before an operation;
the accepted operation stores or signs the resolved Peer ID rather than the
mutable handle.

A handle rename changes future presentation and resolution only. It does not
rewrite an accepted order, transfer reputation, redirect a frozen Affiliate
recipient, change store ownership, or merge records across Peers.

### 4. Establish claim and registry authority

The canonical registry enforces uniqueness and records versioned binding
history. A production claim must combine:

1. registrar admission under the published naming and abuse policy;
2. proof that the claimant is authorized to administer the selected Peer; and
3. an Identity-key signature over a domain-separated, versioned handle claim.

The exact payload, encoding, nonce, sequence, expiry, signature algorithm, and
verification vectors belong in a subsequent specification. An account session
or arbitrary Peer-ID string alone is not sufficient proof for a new production
claim.

The initial canonical registry may be operated by the hosted service so the
network has one short bare-handle namespace. It must expose auditable binding
history and must not become a prerequisite for local store, order, payment, or
recovery correctness. Disconnected or non-participating deployments may use a
domain-qualified local name, but cannot claim that a bare local alias is unique
in the canonical network until the canonical registrar accepts it.

Future transparency-log, DNS, wallet, or chain anchoring may strengthen
registrar accountability. Such anchoring does not silently change current
ownership or make a Draft mechanism authoritative.

### 5. Define lifecycle operations separately

The public lifecycle distinguishes:

- **claim**: assign an available handle to a Peer after admission and proof;
- **rename**: assign a new handle to the same Peer and protect the former name;
- **retire**: stop active resolution without immediately releasing the name;
- **Peer migration**: move a handle to a replacement Peer under a reviewed
  key-rotation or recovery procedure;
- **administrative suspension**: disable unsafe public resolution without
  transferring the name or rewriting Peer-owned facts.

Ordinary unbinding must not make a trusted name immediately available to an
unrelated Peer. Retired and renamed handles enter a tombstone or quarantine
state. Redirect behavior is explicit: a normal rename may redirect for a
bounded period, while a privacy-motivated retirement must not automatically
reveal another Peer.

Moving a handle to a different Peer is an identity migration, not an ordinary
edit. It requires proof from the old and new Peer or a separately reviewed
recovery path with delay, notification, audit history, and challenge. The new
Peer does not inherit the old Peer's orders, reputation, balances, Affiliate
statements, or cryptographic claims.

### 6. Preserve deployment portability

A handle follows the Peer rather than a SaaS tenant row or server location. A
store moving between hosted and standalone operation keeps its Peer ID and may
keep the same canonical handle after the registry verifies the new routing and
administration proof.

The `.mymbz.org` branded host is one store-routing projection of the registry,
not the name's identity authority. A custom domain remains independently
portable through DNS. If Hosting or the canonical registry is unavailable, a
standalone operator continues to serve its custom domain and Peer-ID routes;
only optional handle discovery or branded-host resolution may degrade.

### 7. Migrate the existing store-handle implementation explicitly

Existing `store_domains.handle` rows remain valid implementation facts for the
current branded-store service. Migration to the Peer-handle contract must:

- preserve working store and Peer-ID URLs;
- associate each existing handle with the exact current Peer ID;
- record whether the binding has a new Identity-signed proof rather than
  silently labeling an account-authorized legacy row as cryptographically
  verified;
- detect conflicts with reserved names and any already admitted canonical
  claim;
- retain rename and routing history needed for safe redirects;
- keep current custom-domain verification separate from Peer-handle proof.

The implementation ADR decides whether `store_domains` remains a routing
projection, is migrated into a generic handle registry, or is joined to one.
That storage choice does not change this RFC's public identity boundary.

### 8. Make consumers depend on resolution, not ownership

Storefront, Affiliate, search, chat, Agent, QR, and short-link features consume
the handle resolver. They do not create independent handle ownership tables or
define separate first-claim rules.

Affiliate public pages remain projections of Peer-scoped seller and promoter
facts governed by RFC-0007. A memorable promoter handle cannot authorize a
commission, replace a referral token, or turn an account-level aggregation
into a financial fact.

## Security, privacy, and abuse analysis

Short global names create squatting, impersonation, trademark, harassment,
confusable-character, scanning, and resale risks. The registrar requires
normalization before uniqueness checks, reserved infrastructure and policy
names, claim and rename rate limits, protected-brand review, reporting,
appeal, and auditable administrative action. The first release should prefer a
narrow ASCII label policy unless internationalized-name confusable handling is
reviewed and tested.

Registry compromise could redirect users even though it cannot forge the
Peer's Identity signature. Clients must show the resolved Peer ID or a
verification affordance where trust matters, and high-risk actions must bind
the resolved Peer ID. Binding history and signed claims make reassignment
detectable; they do not remove the registrar's power to deny or suspend a name.

Account ownership and common-control relationships are private. The registry
does not enumerate all Peers managed by one account. A user who intentionally
creates separate Peers for wallet, reputation, community, or privacy isolation
receives separate handles and no automatic public aggregation.

Recovery is the hardest authority boundary. Allowing hosted-account recovery
without Peer proof makes the platform the effective identity owner; requiring
only the old Peer key makes loss irreversible. The accepted recovery policy
must state this tradeoff, delay exceptional transfers, notify prior control
channels, retain public history, and prevent recovery from transferring
Peer-scoped reputation by presentation alone.

## Economic and legal analysis

The initial primary handle should be free so naming improves discovery rather
than creating an adoption tax. This RFC does not authorize auctions,
tokenization, speculative resale, annual rent, paid ranking, or preferential
resolution. Those mechanisms would change allocation incentives and require
separate economic and abuse review.

Custom domains, verified-business review, organization administration,
enhanced recovery, analytics, and brand-protection services may become paid
hosted capabilities under separately disclosed policy. Payment must not let a
buyer acquire another Peer's reputation or bypass an active trademark or abuse
case.

Trademark, sanctions, impersonation, consumer-protection, and intermediary
obligations vary by jurisdiction. A registrar policy and appeal process require
legal review before broad public registration. Administrative action must
distinguish disabling a hosted route from claiming ownership of Peer-controlled
business records.

## Alternatives

### Bind the handle directly to one Storefront

Rejected as the identity contract because a Peer can exist without a store and
can own several Storefronts. It also prevents search, mentions, promoter pages,
and Agents from sharing one public Peer name. The selected model retains the
desired direct-store experience by making the default store a handle-resolved
surface.

### Bind one public persona to a hosted account and aggregate all its Peers

Rejected because the hosted account is a private access and recovery container,
while separate Peers intentionally isolate wallets, reputation, roles, and
privacy. Automatic aggregation would expose common control and blur Peer-owned
business facts.

### Create separate store and promoter handle namespaces

Rejected because one Peer may be both seller and promoter. Separate registries
create collisions, duplicate governance, inconsistent rename behavior, and a
future migration when search or chat needs a general identity name.

### Use only domain-qualified local handles

Retained as the independent-deployment fallback but not selected as the only
Mobazha network name. Domain qualification avoids a central uniqueness service
but weakens the short, portable `@alice` network address and permits several
unrelated identities to use the same visible local label.

### Launch an ENS-style on-chain registry immediately

Deferred because fees, chain choice, recovery, trademark action, key loss,
name speculation, renewals, and disconnected operation would dominate the
initial readability problem. A later RFC may anchor claims or registrar roots
after usage demonstrates that the network namespace is valuable.

### Continue using only Peer IDs, short links, and custom domains

Rejected as the long-term naming model because those mechanisms do not provide
one searchable, mentionable, portable public identity. They remain required
fallbacks and may satisfy near-term distribution while this Draft is reviewed.

## Rollout and rollback

1. Review and accept the public subject, namespace, authority, privacy,
   lifecycle, and compatibility decisions before advertising a network name
   service.
2. Write an implementation ADR and signed-claim specification. Add a capability
   gate that distinguishes current branded store handles from canonical
   Peer-handle registration.
3. Inventory existing `store_domains` rows, reserved-name conflicts, route and
   DNS dependencies, and proof level. Preserve current URLs during migration.
4. Add versioned claim, resolve, rename, retire, migration, suspension, history,
   and audit operations with negative authorization and collision tests.
5. Enable store routing first, then search and mentions, then Affiliate and
   other projections. Each consumer resolves to a Peer ID and keeps its own
   visibility and authorization checks.
6. Publish standalone claim and outage conformance, registry observability,
   abuse operations, and release evidence before broad registration.

Rollback stops new claims, renames, and migrations while preserving existing
resolution long enough to avoid link takeover. Peer-ID URLs, custom domains,
local store operation, orders, payment, and settlement remain available. A
rollback must not release quarantined names, redirect them to another Peer, or
rewrite business facts.

## Documentation impact

- Add this RFC to the public registry and cross-link RFC-0007, RFC-0008, and
  RFC-0013 without changing their economic, key-domain, or store-authority
  ownership.
- Mark the current SaaS store-brand design as implementation-local predecessor
  evidence and distinguish its existing branded-route behavior from this
  proposed network identity contract.
- Update the identity model to show a proposed handle in the public Peer layer,
  not in the private account layer.
- Update domain, multi-store, Storefront, Affiliate, search, chat, Agent, and
  standalone documentation as each consumer adopts the resolver.
- Publish registrar policy, name syntax, lifecycle, recovery, protected-brand,
  reporting, appeal, and operator guidance before broad registration.
- Publish release evidence separately; Draft, Accepted, existing database rows,
  and partial route code do not prove that the network service is available.

## Open questions

1. What exact ASCII or internationalized syntax, normalization, confusable, and
   reserved-name rules apply?
2. How long are rename redirects, quarantine, and retired-name tombstones, and
   can a high-trust name ever be released to an unrelated Peer?
3. What recovery evidence can move a handle when the old Identity key is lost,
   and who can approve or appeal that exceptional action?
4. Which transparency-log or anchoring mechanism makes registrar
   reassignment observable without making one chain a local-commerce
   prerequisite?
5. How are existing branded store handles grandfathered, challenged, and
   upgraded to signed Peer claims?
6. What should `/@handle` show for a Peer with no public default store, and
   which explicit route is the canonical identity profile?
7. What cache, expiry, stale-read, and outage behavior must clients and
   standalone deployments implement?
8. Which operator owns trademark review, appeals, sanctions compliance, and
   protected organization names before broad registration?

## Decision

Pending maintainer review. This Draft proposes a network naming and resolution
contract without activating registration, migration, recovery, or consumer
routes. Current Peer-ID URLs, branded store handles, custom domains, runtime
capabilities, and tagged releases remain authoritative for available behavior.
