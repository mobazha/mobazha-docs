export type DocStatus = "Current" | "Beta" | "Draft";

export type DocSection = {
  heading: string;
  body?: string[];
  bullets?: string[];
  code?: string;
  note?: string;
  links?: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
};

export type DocPage = {
  slug: string;
  title: string;
  summary: string;
  status: DocStatus;
  audiences: string[];
  sourceLabel: string;
  sourceUrl?: string;
  reviewed: string;
  appliesTo?: string;
  sections: DocSection[];
};

export function docApplicability(doc: DocPage): string {
  if (doc.appliesTo) return doc.appliesTo;
  if (doc.status === "Draft") return "Design direction; not a shipped guarantee";
  if (doc.status === "Beta") return "Mobazha v0.3 release candidate";
  return "Current public project policy or service surface";
}

export const navGroups = [
  {
    label: "Start",
    links: [
      ["Overview", "/start"],
      ["Choose a deployment", "/start/choose-deployment"],
      ["For agents", "/agents"],
    ],
  },
  {
    label: "Use Mobazha",
    links: [
      ["Sell", "/sell"],
      ["Buy", "/buy"],
    ],
  },
  {
    label: "Operate",
    links: [
      ["Self-host", "/self-host"],
      ["Install", "/self-host/install"],
      ["Configure", "/self-host/configure"],
      ["Backup and upgrade", "/self-host/backup-and-upgrade"],
      ["Security", "/self-host/security"],
      ["Troubleshoot", "/self-host/troubleshooting"],
      ["Optional hosted connection", "/self-host/bind-account"],
    ],
  },
  {
    label: "Build",
    links: [
      ["Developer overview", "/build"],
      ["Runtime capabilities", "/build/runtime-capabilities"],
      ["API", "/build/api"],
      ["WebSocket events", "/build/websocket"],
      ["MCP and agents", "/build/mcp"],
      ["Webhooks", "/build/webhooks"],
      ["Extensions", "/build/extensions"],
      ["Reference", "/reference"],
    ],
  },
  {
    label: "Project",
    links: [
      ["Project overview", "/project"],
      ["Architecture", "/project/architecture"],
      ["Whitepaper", "/project/whitepaper"],
      ["Fees and economics", "/project/fees"],
      ["Security model", "/project/security"],
      ["Legal and privacy", "/project/legal-and-privacy"],
      ["Release scope", "/project/release-scope"],
      ["Governance", "/project/governance"],
      ["Releases", "/releases"],
    ],
  },
  {
    label: "Community",
    links: [
      ["Contribute", "/contribute"],
      ["Get help", "/support"],
    ],
  },
] as const;

export const docs: DocPage[] = [
  {
    slug: "start",
    title: "Start with the job you need to do",
    summary: "Mobazha is an open commerce stack for running, using, and extending independent marketplaces and stores.",
    status: "Beta",
    audiences: ["Everyone", "Agents"],
    sourceLabel: "Mobazha public repositories",
    sourceUrl: "https://github.com/mobazha",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Choose a path",
        bullets: [
          "Sell: create a store, publish products, receive orders, and fulfill them.",
          "Buy: understand checkout, payment, evidence, refunds, and disputes.",
          "Operate: run a Mobazha Node under your own control.",
          "Build: integrate through the interfaces exposed by the backend you connect to.",
          "Evaluate: inspect architecture, release scope, economics, governance, and security assumptions.",
        ],
      },
      {
        heading: "Read status before instructions",
        body: [
          "Mobazha is currently release-candidate software. A page marked Current describes reviewed behavior; Beta may change; Draft communicates direction and is not a promise.",
          "The connected backend is authoritative for runtime capabilities. A document never grants a capability that the backend does not advertise.",
        ],
      },
      {
        heading: "Current public surfaces",
        links: [
          {
            label: "Use the hosted application",
            href: "https://app.mobazha.org",
            description: "Explore the current hosted buyer and seller experience.",
          },
          {
            label: "Run the open-source node",
            href: "https://github.com/mobazha/mobazha",
            description: "Build the release candidate from source and operate it yourself.",
          },
          {
            label: "Inspect the shared frontend",
            href: "https://github.com/mobazha/mobazha-unified",
            description: "Review the client used by hosted and self-hosted deployments.",
          },
        ],
      },
    ],
  },
  {
    slug: "sell",
    title: "Sell through a Mobazha store",
    summary: "A practical map from store setup to settlement, with costs and responsibilities visible before an order is accepted.",
    status: "Beta",
    audiences: ["Sellers", "Operators"],
    sourceLabel: "Mobazha README and release scope",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Before opening a store",
        bullets: [
          "Choose self-hosted operation or an optional managed service.",
          "Configure payment methods supported by your backend and region.",
          "Publish delivery, return, refund, and dispute terms that buyers can inspect.",
          "Review the final quote and all recipient amounts before accepting an order.",
        ],
      },
      {
        heading: "What Mobazha does not decide for you",
        body: [
          "A seller remains responsible for product legality, tax, fulfillment, customer support, and any seller-defined charges. Mobazha provides commerce software and verifiable transaction flows; it does not make every operator one legal entity.",
        ],
        note: "Cost labels must identify the recipient and reason. A generic hidden service charge is not an acceptable substitute.",
      },
      {
        heading: "Store readiness checklist",
        bullets: [
          "Set a recognizable store identity, operator contact path, locale, currency display, and domain where applicable.",
          "Create complete listings with accurate variants, inventory or availability, media, price, and shipping eligibility.",
          "Configure shipping profiles, delivery estimates, return conditions, and fulfillment evidence before accepting orders.",
          "Enable only payment methods that the backend advertises and that the store is operationally ready to monitor and settle.",
          "Test the full buyer journey on the same deployment, capability set, and device classes customers will use.",
        ],
      },
      {
        heading: "Order operations",
        bullets: [
          "Review the order, quote, payment state, buyer instructions, and fulfillment obligation before confirming.",
          "Do not infer payment completion from a screenshot, message, or Agent statement; use the backend's verified payment state.",
          "Record shipment or delivery evidence using the order flow rather than relying on an external chat alone.",
          "Handle cancellation, refund, dispute, and completion through the allowed state transition for the current order.",
          "Retain policy, quote, payment, fulfillment, and communication references needed for support or dispute review.",
        ],
      },
      {
        heading: "Choose how to operate",
        links: [
          { label: "Use the hosted application", href: "https://app.mobazha.org" },
          { label: "Choose a deployment", href: "/start/choose-deployment" },
          { label: "Install a self-hosted node", href: "/self-host/install" },
          { label: "Understand fees", href: "/project/fees" },
        ],
      },
    ],
  },
  {
    slug: "buy",
    title: "Buy with inspectable terms",
    summary: "Confirm the seller, item, delivery terms, payment route, and complete cost breakdown before committing funds.",
    status: "Beta",
    audiences: ["Buyers", "Agents"],
    sourceLabel: "Mobazha Unified public client",
    sourceUrl: "https://github.com/mobazha/mobazha-unified",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Before confirmation",
        bullets: [
          "Verify the store identity and the backend or operator serving it.",
          "Inspect subtotal, shipping, taxes, network costs, service charges, discounts, and the final total.",
          "Read cancellation, refund, evidence, and dispute rules.",
          "Treat an agent recommendation as assistance, not as authority to bypass confirmation or spending scopes.",
        ],
      },
      {
        heading: "Keep evidence",
        body: [
          "Retain the order identifier, quote, payment reference, messages, fulfillment evidence, and the policy version shown at checkout. These records make support and dispute handling more reliable.",
        ],
      },
      {
        heading: "Checkout and payment",
        bullets: [
          "Confirm the item, quantity, variant, seller, shipping destination, and delivery method before requesting a quote.",
          "Read the full cost allocation: item subtotal, delivery, taxes, discounts, network or provider costs, optional services, and final total.",
          "Use only the payment method, asset, address, amount, expiry, and confirmation instructions shown for the active order.",
          "Do not reuse an expired quote or payment destination from another order, message, screenshot, or Agent response.",
          "Wait for authoritative payment and order state instead of treating broadcast, a pending transaction, or a receipt image as final settlement.",
        ],
      },
      {
        heading: "Delivery, cancellation, and disputes",
        bullets: [
          "Follow the cancellation and refund actions currently available for the order rather than assuming a universal deadline.",
          "Inspect seller delivery evidence and preserve buyer evidence in its original form.",
          "Use the in-product dispute path when offered and describe the requested remedy clearly.",
          "A payment rail or escrow can enforce only its implemented conditions; it does not guarantee product quality or a preferred dispute result.",
          "Escalate suspected fraud or security issues without publishing private order, identity, or payment data.",
        ],
      },
      {
        heading: "Continue",
        links: [
          { label: "Open the hosted application", href: "https://app.mobazha.org" },
          { label: "Review fees and economics", href: "/project/fees" },
          { label: "Get help", href: "/support" },
        ],
      },
    ],
  },
  {
    slug: "self-host",
    title: "Operate your own Mobazha Node",
    summary: "Self-hosting keeps store data and operations under the operator's control and does not require an optional managed-service subscription.",
    status: "Beta",
    audiences: ["Operators", "Developers"],
    sourceLabel: "Mobazha deployment sources",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Evaluation quick start",
        body: [
          "The current release candidate requires Go 1.26.4, Git, and a supported macOS or Linux environment. Use testnet while evaluating payment flows.",
        ],
        code: "git clone --branch main https://github.com/mobazha/mobazha.git\ncd mobazha\ngo build -tags goolm -o mobazha .\n./mobazha init --testnet\n./mobazha start --testnet --open",
        note: "v0.3 is for evaluation and testnet use. Stable binaries and signed release artifacts have not yet been published.",
      },
      {
        heading: "Operator responsibilities",
        bullets: [
          "Secure the host, administrator access, secrets, and network boundary.",
          "Back up data and recovery material before upgrades.",
          "Monitor storage, availability, payment integrations, and release notes.",
          "Expose only the interfaces your users and agents actually need.",
        ],
      },
      {
        heading: "Optional hosted connection",
        body: [
          "An operator may bind a self-hosted node to an optional Mobazha account for hosted capabilities when offered. Binding does not transfer custody of local recovery material and is not required for independent operation.",
        ],
      },
    ],
  },
  {
    slug: "self-host/bind-account",
    title: "Connect optional hosted capabilities",
    summary: "Keep local node ownership separate from any optional account or hosted service connection.",
    status: "Draft",
    audiences: ["Operators"],
    sourceLabel: "Mobazha public release boundary",
    sourceUrl: "https://github.com/mobazha/mobazha/blob/main/README.md",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "What is stable today",
        body: [
          "A local standalone store remains usable for administration, listings, data export, and supported UTXO payment flows without a Mobazha Hosting account. Optional services may later add discovery, search, routing, managed updates, or support.",
        ],
        note: "There is not yet a stable public node-to-account binding contract. Do not treat internal endpoints, old screenshots, or historical design documents as a supported procedure.",
      },
      {
        heading: "Before connecting any service",
        bullets: [
          "Confirm that you are administering the intended node and account.",
          "Create a fresh backup and keep recovery material outside the browser session.",
          "Require a clear explanation of the capability, data exchange, permissions, revocation, and price.",
          "Do not paste seed phrases, wallet private keys, or database credentials into an account-binding form.",
        ],
      },
      {
        heading: "Publication gate for a supported flow",
        bullets: [
          "The public node and client repositories describe the same versioned contract.",
          "The UI shows the node identity, requested permissions, exchanged data, and revocation path.",
          "Authentication does not expose node recovery material or silently widen runtime capabilities.",
          "Automated tests cover connection, denial, expiry, revocation, and recovery.",
        ],
      },
    ],
  },
  {
    slug: "self-host/backup-and-upgrade",
    title: "Back up and upgrade safely",
    summary: "Treat upgrade readiness as a recoverability exercise, not only a package update.",
    status: "Beta",
    audiences: ["Operators"],
    sourceLabel: "Mobazha operations guidance",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main/docs/releases",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Minimum upgrade gate",
        bullets: [
          "Read release notes and identify schema, payment, capability, and configuration changes.",
          "Create a versioned backup and verify that it can be read.",
          "Record the running version and configuration; protect secrets separately.",
          "Plan rollback and a maintenance window before changing production.",
          "After upgrade, verify health, store access, order flows, and payment callbacks.",
        ],
      },
      {
        heading: "Built-in operational commands",
        body: ["Run diagnostics and create a compressed backup before a release change."],
        code: "./mobazha doctor --json\n./mobazha backup --output mobazha-backup.tar.gz",
      },
    ],
  },
  {
    slug: "build",
    title: "Build on advertised capabilities",
    summary: "Integrations should discover what a backend supports instead of assuming every Mobazha deployment exposes the same surface.",
    status: "Beta",
    audiences: ["Developers", "Agent builders"],
    sourceLabel: "Mobazha public source organization",
    sourceUrl: "https://github.com/mobazha",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Integration rule",
        body: [
          "Use the connected backend's capability response and version information as runtime truth. Documentation describes interfaces and intent, but a client must handle unavailable, disabled, or differently versioned features.",
        ],
      },
      {
        heading: "Surfaces",
        bullets: [
          "HTTP and WebSocket interfaces for commerce operations and live updates.",
          "Webhooks for operator-controlled event delivery.",
          "MCP and agent-oriented interfaces with explicit identity and authorization boundaries.",
          "Plugins and contracts only where the connected deployment advertises them.",
        ],
        note: "The current Node entry points are HTTP under /v1/, WebSocket under /ws, and MCP Streamable HTTP under /v1/mcp. Exact operations remain version- and capability-dependent.",
      },
    ],
  },
  {
    slug: "build/api",
    title: "HTTP API and OpenAPI",
    summary: "Use the generated Mobazha Node OpenAPI contract as the operation and schema reference, then verify runtime capabilities before calling optional features.",
    status: "Beta",
    audiences: ["Developers"],
    sourceLabel: "Generated Mobazha Node OpenAPI contract",
    sourceUrl: "https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Contract and entry points",
        body: [
          "Mobazha Node exposes versioned HTTP routes under /v1/ and WebSocket connections under /ws. The generated OpenAPI document describes request methods, paths, schemas, response envelopes, and declared authentication mechanisms for the current main branch.",
          "The specification is a release-candidate contract, not proof that every optional operation is enabled by a particular backend. Read /v1/runtime-config and capability endpoints before exposing optional UI or automation.",
        ],
        links: [
          {
            label: "OpenAPI JSON",
            href: "/openapi.json",
            description: "Canonical redirect to the generated specification in mobazha/mobazha.",
          },
          {
            label: "API source and generator",
            href: "https://github.com/mobazha/mobazha/tree/main/api-spec",
            description: "Inspect the generated artifact and its owning repository.",
          },
        ],
      },
      {
        heading: "First capability call",
        body: [
          "A local Node publishes its frontend runtime snapshot without requiring an authenticated business operation. Use it to verify schema version, deployment composition, readiness, features, and capabilities before constructing optional UI or automation.",
        ],
        code: "curl -sS http://127.0.0.1:5102/v1/runtime-config | jq",
        note: "The example assumes the default local listener. Do not disable authentication or expose an administrative listener merely to make an example work.",
      },
      {
        heading: "Authentication choices",
        bullets: [
          "HTTP Basic authentication is available for the standalone administrator boundary.",
          "Bearer JWTs represent hosted identities where the deployment supports them.",
          "Scoped mbz_ API tokens are the preferred automation credential for supported standalone integrations.",
          "Choose the narrowest credential and scope set, store it outside source code, and rotate or revoke it after exposure.",
        ],
      },
      {
        heading: "Client requirements",
        bullets: [
          "Choose the authentication mechanism required by the connected deployment; do not copy credentials into URLs or logs.",
          "Treat non-success responses and stable error codes as part of the state machine, not only as transport failures.",
          "Use idempotency and reconciliation for operations that may be retried or have financial effects.",
          "Pin integrations to a tested Node version and re-run contract tests before upgrades.",
          "Never infer support from an endpoint appearing in source or OpenAPI when the effective capability is absent.",
        ],
      },
    ],
  },
  {
    slug: "build/mcp",
    title: "MCP and agent integrations",
    summary: "Agents can discover and invoke permitted commerce capabilities, but cannot replace user consent, policy, or backend authorization.",
    status: "Beta",
    audiences: ["Agent builders", "Security reviewers"],
    sourceLabel: "Mobazha agent-capability sources",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main/pkg/mcp",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Current transport",
        body: [
          "Mobazha Node exposes MCP over Streamable HTTP at /v1/mcp. GET and POST share this endpoint. Treat discovery, authentication, scopes, tool availability, and errors as properties of the connected Node version—not of this prose page.",
        ],
      },
      {
        heading: "Current authentication and scope contract",
        bullets: [
          "Every /v1/mcp request first passes the Node gateway authentication boundary.",
          "The Streamable HTTP front door resolves the caller identity and requires the ai:use scope.",
          "Administrator identities receive the applicable administrative scope set; API tokens must be minted with ai:use explicitly.",
          "Individual tools also require their domain scopes, such as listings:read, orders:manage, wallet:read, or chat:write.",
          "A tool missing its required scope must remain unavailable or return permission denied; MCP does not bypass the underlying HTTP authorization.",
        ],
        links: [
          { label: "MCP scope guard", href: "https://github.com/mobazha/mobazha/blob/main/pkg/mcp/scope_guard.go" },
          { label: "Tool scope mapping", href: "https://github.com/mobazha/mobazha/blob/main/pkg/mcp/auth.go" },
        ],
      },
      {
        heading: "Non-bypassable boundaries",
        bullets: [
          "Authenticate the human, service, or agent identity appropriate to the action.",
          "Request the narrowest scopes and make spend or settlement authority explicit.",
          "Require confirmation where the backend or policy requires it.",
          "Do not let prompt text override order state, quote terms, recipient amounts, or authorization checks.",
          "Keep auditable request, approval, and result identifiers without logging secrets.",
        ],
      },
      {
        heading: "Audit and errors",
        body: [
          "The standalone server records structured MCP tool audit events with the tool name, result, duration, transport, resolved identity when available, and redacted arguments. Bridge errors preserve the API error boundary, including authentication, permission, conflict, rate-limit, and server failures.",
        ],
        note: "Audit visibility supports review; it does not make a broad token safe. Create narrow, revocable tokens and keep secrets out of prompts and logs.",
      },
    ],
  },
  {
    slug: "build/webhooks",
    title: "Webhook integration contract",
    summary: "Design consumers for authentication, retries, duplication, reordering, and version change before depending on event delivery.",
    status: "Beta",
    audiences: ["Developers", "Operators"],
    sourceLabel: "Mobazha webhook engine and OpenAPI contract",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main/pkg/webhook",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Consumer checklist",
        bullets: [
          "Verify authenticity before parsing or acting on a payload.",
          "Use stable event identifiers for idempotency.",
          "Return success only after durable acceptance.",
          "Reconcile state through the authoritative API instead of treating delivery order as state order.",
          "Redact credentials and personal data from logs and dead-letter tooling.",
        ],
      },
      {
        heading: "Current management surface",
        body: [
          "The Node OpenAPI contract includes webhook registration, update, deletion, test delivery, and delivery-history operations under /v1/webhooks. Event names and payload schemas remain version-dependent during the release-candidate period.",
        ],
        links: [
          {
            label: "Webhook source",
            href: "https://github.com/mobazha/mobazha/tree/main/pkg/webhook",
            description: "Signing, event, persistence, retry, and delivery contracts.",
          },
          {
            label: "OpenAPI JSON",
            href: "/openapi.json",
            description: "Find the current /v1/webhooks operations and schemas.",
          },
        ],
      },
      {
        heading: "Delivery envelope and verification",
        body: [
          "Current events use a CloudEvents 1.0 structured JSON envelope. Each delivery includes X-Webhook-ID, X-Webhook-Timestamp, and X-Webhook-Signature headers. The signature is HMAC-SHA256 over the delivery ID, Unix timestamp, and exact request body, with the sha256= prefix.",
        ],
        bullets: [
          "Verify the signature using the endpoint secret and the unmodified raw body.",
          "Reject timestamps outside the current five-minute replay window.",
          "Use the CloudEvent ID and delivery ID as deduplication evidence; do not assume arrival order is business-state order.",
          "Return a 2xx response only after the event is durably accepted.",
        ],
        links: [
          { label: "Signing implementation", href: "https://github.com/mobazha/mobazha/blob/main/pkg/webhook/signer.go" },
          { label: "CloudEvent envelope", href: "https://github.com/mobazha/mobazha/blob/main/pkg/webhook/events.go" },
        ],
      },
      {
        heading: "Standalone defaults",
        body: [
          "The current standalone defaults are five total delivery attempts, exponential backoff beginning at 30 seconds and capped at one hour, a 10-second request timeout, five-second polling, and seven-day completed-delivery retention. Deployments may override these values, so consumers must not infer a guaranteed retry schedule from the defaults.",
        ],
        note: "Delivery is at least once in practice: duplicates and reordering are expected integration conditions, not exceptional bugs.",
      },
    ],
  },
  {
    slug: "reference",
    title: "Reference and source map",
    summary: "Find the repository that owns a fact before proposing or automating a change.",
    status: "Current",
    audiences: ["Developers", "Contributors", "Agents"],
    sourceLabel: "Mobazha GitHub organization",
    sourceUrl: "https://github.com/mobazha",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Source ownership",
        bullets: [
          "mobazha/mobazha: community backend, deployment, project policies, and release notes.",
          "mobazha/mobazha-unified: public cross-platform client, user flows, and runtime-capability handling.",
          "mobazha/mobazha.org: public website, positioning, and high-level disclosures.",
          "mobazha/mobazha-docs: curated navigation, derived guidance, publication metadata, and Agent discovery.",
        ],
        note: "Internal Hosting plans, credentials, operational playbooks, forecasts, and unapproved commercial experiments are not public documentation sources.",
      },
      {
        heading: "Public repositories",
        links: [
          { label: "Mobazha Node", href: "https://github.com/mobazha/mobazha" },
          { label: "Mobazha Unified", href: "https://github.com/mobazha/mobazha-unified" },
          { label: "Mobazha website", href: "https://github.com/mobazha/mobazha.org" },
          { label: "Mobazha documentation", href: "https://github.com/mobazha/mobazha-docs" },
        ],
      },
    ],
  },
  {
    slug: "project",
    title: "Understand the Mobazha project",
    summary: "Separate what ships now from project principles, reviewed policy, historical proposals, and long-term direction.",
    status: "Current",
    audiences: ["Everyone", "Contributors", "Evaluators"],
    sourceLabel: "Mobazha public project documents",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main/docs/project",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "How to read project documents",
        bullets: [
          "Release scope describes the current product boundary.",
          "Architecture explains component and trust boundaries.",
          "Fee policy governs how charges must be disclosed and who may set them.",
          "The whitepaper expresses durable design principles and direction, not a promise that every described capability exists today.",
          "Governance explains how public policy and protocol decisions change.",
        ],
      },
    ],
  },
  {
    slug: "project/architecture",
    title: "Architecture and trust boundaries",
    summary: "Mobazha separates user clients, independently operated backends, optional hosted services, and external payment or delivery systems.",
    status: "Beta",
    audiences: ["Operators", "Developers", "Evaluators"],
    sourceLabel: "Mobazha public repositories",
    sourceUrl: "https://github.com/mobazha",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Core boundary",
        body: [
          "A client connects to a backend chosen by the user or operator. That backend controls its data, enabled capabilities, integrations, and policies. Optional hosted services are separate dependencies and should be disclosed as such.",
        ],
      },
      {
        heading: "Authority order",
        bullets: [
          "Transaction state: the backend that owns the order.",
          "Available runtime features: that backend's advertised capabilities.",
          "Payment facts: the selected payment system and confirmed transaction records.",
          "Project-wide public policy: reviewed documents in the public project repository.",
          "Explanatory guidance: this documentation site, with source and review metadata.",
        ],
      },
    ],
  },
  {
    slug: "project/whitepaper",
    title: "Founding whitepaper",
    summary: "A public-review account of Mobazha's problem framing, trust model, human-and-Agent interfaces, and approach to sustainable open commerce.",
    status: "Draft",
    audiences: ["Community", "Contributors", "Evaluators"],
    sourceLabel: "Public-review edition prepared for the Mobazha project",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Thesis",
        body: [
          "Commerce infrastructure should be usable by people and agents without forcing every participant through one operator, one custody model, or one opaque fee schedule. Independence must remain practical, while optional services may charge clearly for value they provide.",
          "The project therefore treats self-hosting, portable interfaces, backend-authoritative capabilities, and explicit economic disclosure as product requirements rather than marketing claims.",
        ],
      },
      {
        heading: "The problem",
        bullets: [
          "Centralized commerce bundles identity, discovery, data, checkout, policy, and distribution into one operator-controlled dependency.",
          "Self-hosted software often exists in name but remains impractical because upgrades, discovery, payments, or integrations depend on undocumented central services.",
          "Agent-mediated commerce increases the cost of ambiguity: an Agent needs machine-readable authority, scopes, prices, recipients, and state transitions before it can act safely.",
          "A durable alternative must support independent operation and sustainable optional services without hiding one inside the other.",
        ],
      },
      {
        heading: "Durable principles",
        bullets: [
          "Operator choice and meaningful self-hosting.",
          "Portable, inspectable interfaces instead of undocumented platform privilege.",
          "Explicit identity, capability, consent, and audit boundaries for agents.",
          "Charges tied to a named service, recipient, calculation basis, and confirmation step.",
          "Sustainability through optional services and ecosystem value—not a hidden universal commission.",
        ],
      },
      {
        heading: "System model",
        body: [
          "A Mobazha client connects to a backend selected by the user or operator. The backend owns order state, capability advertisement, payment verification, settlement gates, and audit. The shared client renders only the effective capabilities it receives. Discovery, hosted operations, payment rails, delivery, and other services are separate dependencies with separately disclosed trust and price boundaries.",
        ],
        bullets: [
          "Clients are replaceable views over versioned contracts, not the authority for business state.",
          "Capabilities are available only when distribution policy, contract compatibility, installation, authorization, configuration, and health all permit them.",
          "Extensions submit bounded declarations, decisions, observations, or attestations; Core validates them before changing protected state.",
          "Independent operators choose which external services and network exposure their deployment accepts.",
        ],
      },
      {
        heading: "Humans and Agents",
        body: [
          "Mobazha is designed for interfaces used directly by people and through software Agents. Both must observe the same price, capability, policy, and state facts. Machine-readable discovery improves access to those facts but does not grant authority or bypass confirmation.",
        ],
        bullets: [
          "Identity and authorization belong to the actor and action, not to persuasive prompt text.",
          "Spending, settlement, publication, and destructive operations require explicit scopes and applicable confirmation.",
          "Agent recommendations must disclose paid attribution or referral relationships where applicable.",
          "Auditable request, approval, quote, order, and result identifiers support review without logging secrets.",
        ],
      },
      {
        heading: "Sustainable economics",
        body: [
          "The open-source Node can be operated independently without a mandatory central Mobazha transaction fee. Operators still incur their own infrastructure, network, processor, tax, support, and extension costs. Mobazha or another provider may charge for clearly named hosting, automation, distribution, transaction, support, or other optional services.",
          "This boundary does not promise that every service is free. It requires the provider, payer, recipient, calculation basis, amount, optionality, expiry, and refund treatment to be visible before a charge is accepted.",
        ],
        links: [
          {
            label: "Fees and Paid Services policy",
            href: "/project/fees",
            description: "The current public economic boundary and quote requirements.",
          },
          {
            label: "Current public pricing status",
            href: "https://mobazha.org/pricing",
            description: "Current service offers and effective pricing disclosures.",
          },
        ],
      },
      {
        heading: "Evolution and governance",
        body: [
          "Mobazha is a release candidate. The whitepaper describes durable direction, while release scope, compatibility policy, OpenAPI, runtime capabilities, and transaction evidence describe what can be relied on now. Changes to public contracts, payment models, security boundaries, licensing, or governance require an ADR or equivalent public design review.",
        ],
      },
      {
        heading: "Publication status",
        body: [
          "This is the public-review edition maintained by the documentation project. It intentionally excludes internal forecasts, experimental percentages, confidential operating plans, and claims not supported by the public release boundary. A future versioned whitepaper artifact may be published after community, security, legal, economic, and release-scope review.",
        ],
        note: "Draft direction is not shipped behavior, a financial product, a revenue guarantee, or an obligation on independent operators.",
      },
    ],
  },
  {
    slug: "project/fees",
    title: "Fees and sustainable economics",
    summary: "Mobazha does not define one unavoidable commission for every transaction. Each actual charge must identify its owner, purpose, basis, and point of consent.",
    status: "Current",
    audiences: ["Buyers", "Sellers", "Operators", "Evaluators", "Agents"],
    sourceLabel: "Fees and Paid Services policy",
    sourceUrl: "https://github.com/mobazha/mobazha/blob/main/docs/project/FEES_AND_PAID_SERVICES.md",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Do not collapse every flow into ‘commission’",
        body: [
          "A referral reward, delivery charge, payment-network cost, operator service fee, tax, and protocol contribution have different recipients and reasons. Combining them into a headline percentage hides who receives value and whether the charge is optional.",
        ],
      },
      {
        heading: "Economic model",
        bullets: [
          "Self-hosted software: independent operation does not require an optional managed-service subscription or a universal central-platform commission.",
          "Managed services: may charge for hosting, reliability, support, automation, or other named services; price and renewal terms must be shown before purchase.",
          "Payment and network costs: belong to the selected rail or provider and should be passed through or disclosed separately.",
          "Operator or seller charges: may be configured where lawful, but the responsible party and calculation basis must be visible.",
          "Referral or ecosystem rewards: must be funded, capped, attributable, and distinguishable from the seller's proceeds.",
          "Protocol/public-good funding: should be explicit, governed, and never implied by a draft percentage.",
        ],
      },
      {
        heading: "Required quote contract",
        bullets: [
          "Name every charge and recipient.",
          "Show fixed and percentage components and the amount they apply to.",
          "State whether it is required, optional, refundable, or condition-dependent.",
          "Show the final total and settlement allocation before confirmation.",
          "Record the policy and quote version used by the order.",
        ],
        note: "Illustrative allocations in old discussions are not defaults. A percentage becomes policy only through public review, implementation, tests, disclosure, and release notes.",
      },
    ],
  },
  {
    slug: "project/release-scope",
    title: "Release scope and maturity",
    summary: "The documentation distinguishes current release-candidate behavior from previews and future design.",
    status: "Beta",
    audiences: ["Everyone"],
    sourceLabel: "Mobazha releases and repository documentation",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main/docs/releases",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Status vocabulary",
        bullets: [
          "Current: reviewed public policy or stable project fact.",
          "Beta: available or being validated; compatibility and behavior may change.",
          "Draft: proposal or documentation contract; do not depend on it as shipped behavior.",
          "Historical: retained for context and explicitly superseded.",
        ],
      },
      {
        heading: "Current v0.3 release-candidate boundary",
        bullets: [
          "Mobazha Node and Mobazha Unified are release candidates for evaluation and testnet use.",
          "The default open-source Node enables BTC, BCH, and LTC payment methods, subject to effective runtime capabilities and seller configuration.",
          "Identifiers or adapters present in source do not enable a payment method or create a compatibility commitment.",
          "Stable signed binaries and reproducibility attestations remain pending final release approval.",
          "Clients must fail closed when a valid runtime-capability snapshot is unavailable.",
        ],
        links: [
          { label: "Node release scope", href: "https://github.com/mobazha/mobazha/blob/main/docs/project/RELEASE_SCOPE.md" },
          { label: "Node v0.3.0-rc.1 notes", href: "https://github.com/mobazha/mobazha/blob/main/docs/releases/v0.3.0-rc.1.md" },
          { label: "Unified v0.3.0-rc.1 notes", href: "https://github.com/mobazha/mobazha-unified/blob/main/docs/releases/v0.3.0-rc.1.md" },
        ],
      },
    ],
  },
  {
    slug: "project/governance",
    title: "Documentation and policy governance",
    summary: "Important project claims need an owner, source, review date, status, and visible change path.",
    status: "Draft",
    audiences: ["Contributors", "Maintainers", "Agents"],
    sourceLabel: "Mobazha public governance and documentation policy",
    sourceUrl: "https://github.com/mobazha/mobazha/blob/main/GOVERNANCE.md",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Change classes",
        bullets: [
          "Editorial: clarifies wording without changing behavior or policy.",
          "Operational: changes installation, recovery, compatibility, or integration guidance.",
          "Policy: changes rights, responsibilities, fees, governance, privacy, or security expectations.",
          "Protocol: changes interoperable behavior, state transitions, or machine contracts.",
        ],
      },
      {
        heading: "Review expectation",
        body: [
          "Operational, policy, and protocol changes require review by the owning repository and must update affected documentation, machine-readable indexes, tests where applicable, and release notes. The docs site is a publication surface, not an authority that silently overrides source owners.",
        ],
      },
      {
        heading: "Documentation publication workflow",
        bullets: [
          "Wave 0 inventories authorities, public sources, lifecycle states, and stable URLs.",
          "Wave 1 keeps the portal, compatibility routes, source mapping, link checks, and deployment healthy.",
          "Wave 2 turns implementation and public contracts into task-first user, operator, and developer guidance.",
          "Wave 3 publishes reviewed trust, security, economic, governance, ADR, RFC, and whitepaper material.",
          "Wave 4 evaluates Agent answers, adds maintained translations, and measures freshness and support outcomes.",
        ],
        links: [
          {
            label: "Phase DOCS roadmap",
            href: "https://github.com/mobazha/mobazha-docs/blob/main/docs/PHASE_DOCS_ROADMAP.md",
            description: "Public delivery waves, gates, and progress record.",
          },
          {
            label: "Content governance",
            href: "https://github.com/mobazha/mobazha-docs/blob/main/docs/CONTENT_GOVERNANCE.md",
            description: "Authority, source, lifecycle, and review rules.",
          },
        ],
      },
    ],
  },
  {
    slug: "releases",
    title: "Releases",
    summary: "Use repository releases for exact versions, migration notes, checksums, and known issues.",
    status: "Current",
    audiences: ["Operators", "Developers"],
    sourceLabel: "Mobazha GitHub releases",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main/docs/releases",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Current release candidate",
        body: [
          "v0.3 is intended for evaluation and testnet use. Stable binaries and signed release artifacts have not been published yet. The first release enables BTC, BCH, and LTC by default, subject to the full effective-capability intersection and seller configuration.",
        ],
      },
      {
        heading: "Before adopting a release",
        bullets: [
          "Confirm the repository, version, publication date, and artifact integrity.",
          "Read breaking changes, migrations, capability changes, and known issues.",
          "Test backup and rollback procedures in an environment representative of production.",
        ],
      },
      {
        heading: "Release sources",
        links: [
          { label: "Mobazha Node release notes", href: "https://github.com/mobazha/mobazha/tree/main/docs/releases" },
          { label: "Mobazha Unified release notes", href: "https://github.com/mobazha/mobazha-unified/tree/main/docs/releases" },
          { label: "Published GitHub releases", href: "https://github.com/mobazha/mobazha/releases" },
        ],
      },
    ],
  },
  {
    slug: "start/choose-deployment",
    title: "Choose hosted or self-hosted Mobazha",
    summary: "Choose the operating model from control, responsibility, integrations, and service needs—not from a false free-versus-paid shortcut.",
    status: "Beta",
    audiences: ["Sellers", "Operators", "Evaluators", "Agents"],
    sourceLabel: "Mobazha public product and release boundaries",
    sourceUrl: "https://github.com/mobazha/mobazha/blob/main/README.md",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Hosted service",
        body: [
          "Use the hosted application when you want to evaluate Mobazha or operate a store without maintaining the underlying server. The service operator manages availability, deployment, and the hosted account boundary; current Beta pricing and limits are published separately.",
        ],
        bullets: [
          "Fastest path to the current buyer and seller experience.",
          "Service availability, data handling, limits, and future pricing depend on the hosted terms.",
          "Runtime capabilities still determine which commerce and payment paths are available.",
        ],
        links: [
          { label: "Open Mobazha", href: "https://app.mobazha.org" },
          { label: "Current pricing", href: "https://mobazha.org/pricing" },
          { label: "Privacy policy", href: "https://mobazha.org/privacy" },
        ],
      },
      {
        heading: "Self-hosted node",
        body: [
          "Use the open-source Node when you need direct control over deployment, store data, domain, availability, backup, and enabled integrations. You operate the machine and remain responsible for security, recovery, upgrades, and third-party costs.",
        ],
        bullets: [
          "No mandatory central Mobazha transaction fee is created merely by running the software.",
          "The current v0.3 line is a release candidate intended for evaluation and testnet use.",
          "BTC, BCH, and LTC are enabled by the default release boundary, subject to runtime and seller configuration.",
        ],
        links: [
          { label: "Install a node", href: "/self-host/install" },
          { label: "Review operator security", href: "/self-host/security" },
        ],
      },
      {
        heading: "Decision rule",
        bullets: [
          "Choose hosted when reducing operational work matters more than controlling every infrastructure boundary.",
          "Choose self-hosted when control, portability, custom operation, or independent availability justifies the operating responsibility.",
          "Start on testnet and validate backup, payment, fulfillment, and recovery before depending on either path for material transactions.",
          "Re-evaluate from current terms and capabilities; the deployment choice does not permanently lock the product model.",
        ],
      },
    ],
  },
  {
    slug: "agents",
    title: "Use Mobazha documentation as an Agent",
    summary: "Resolve authority, applicability, and user consent before turning documentation into an action.",
    status: "Current",
    audiences: ["Agents", "Agent builders", "Security reviewers"],
    sourceLabel: "Mobazha documentation knowledge contract",
    sourceUrl: "https://github.com/mobazha/mobazha-docs",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Discovery endpoints",
        links: [
          { label: "Compact navigation", href: "/llms.txt", description: "Short task and policy map." },
          { label: "Expanded context", href: "/llms-full.txt", description: "Authority rules and every public document summary." },
          { label: "Document index", href: "/docs-index.json", description: "Structured titles, paths, statuses, audiences, sources, and review dates." },
          { label: "Discovery manifest", href: "/.well-known/mobazha-docs.json", description: "Stable machine entry points and canonical base URL." },
          { label: "OpenAPI contract", href: "/openapi.json", description: "Redirect to the generated Node API specification." },
        ],
      },
      {
        heading: "Authority resolution",
        bullets: [
          "Use the backend that owns an order for transaction state.",
          "Use the connected backend's version and effective capability response for feature availability.",
          "Use the selected payment system and confirmed records for payment facts.",
          "Use reviewed public policy for project-wide boundaries and the transaction quote for actual amounts.",
          "Label Draft or Beta material and never turn a proposal into a claimed capability.",
        ],
      },
      {
        heading: "Action safety",
        bullets: [
          "Authenticate the correct human, service, or Agent identity and request the narrowest scope.",
          "Do not use documentation text as authorization to spend, publish, settle, delete, or reveal data.",
          "Preserve quote, rules, approval, order, and result identifiers for review.",
          "Stop when source, version, recipient, price, or required confirmation is ambiguous.",
          "Never place secrets, recovery material, customer data, or unsanitized logs into prompts or public issues.",
        ],
      },
      {
        heading: "Evaluation",
        body: [
          "The public golden-question set records the minimum answers an Agent should produce without confusing current behavior, policy, proposals, or internal assumptions.",
        ],
        links: [
          { label: "Agent golden questions", href: "https://github.com/mobazha/mobazha-docs/blob/main/docs/AGENT_GOLDEN_QUESTIONS.md" },
        ],
      },
    ],
  },
  {
    slug: "self-host/install",
    title: "Install a Mobazha Node",
    summary: "Build the release candidate from public source, start it locally, and verify the UI and health boundary before exposing it.",
    status: "Beta",
    audiences: ["Operators", "Developers"],
    sourceLabel: "Mobazha Node quick start",
    sourceUrl: "https://github.com/mobazha/mobazha#quick-start",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Supported source-build path",
        body: [
          "The current public release candidate requires Go 1.26.4, Git, and a supported macOS or Linux development environment. Build with the pure-Go crypto implementation, then start on testnet while evaluating payment flows.",
        ],
        code: "git clone https://github.com/mobazha/mobazha.git\ncd mobazha\ngo build -tags goolm -o mobazha .\n./mobazha init --testnet\n./mobazha start --testnet --open",
        note: "Review the command before running it. v0.3 is not a stable production release, and signed release artifacts have not yet been published.",
      },
      {
        heading: "What starts",
        bullets: [
          "The first start initializes the default data directory when needed.",
          "The embedded Web UI and HTTP API listen on http://127.0.0.1:5102 by default.",
          "Versioned HTTP routes live under /v1/, WebSocket under /ws, and MCP Streamable HTTP under /v1/mcp.",
          "Local-only listening is the safe default; do not expose the API to the internet until authentication, TLS, firewall, and update plans are reviewed.",
        ],
      },
      {
        heading: "Optional background service",
        body: ["After validating an interactive start, install and inspect the supported background service."],
        code: "./mobazha service install\n./mobazha service status\n./mobazha doctor --json",
      },
      {
        heading: "Pre-release packaging",
        body: [
          "Docker, standalone, and appliance packaging exists in the public repository, but it remains pre-release. Inspect the image tag, downloaded scripts, configuration, update behavior, and recovery path before using it outside a disposable environment.",
        ],
        links: [
          { label: "Standalone packaging source", href: "https://github.com/mobazha/mobazha/tree/main/deploy/standalone" },
          { label: "Node source and release status", href: "https://github.com/mobazha/mobazha" },
        ],
      },
    ],
  },
  {
    slug: "self-host/configure",
    title: "Configure a self-hosted node",
    summary: "Make deployment mode, data location, network exposure, payments, and external dependencies explicit and recoverable.",
    status: "Beta",
    audiences: ["Operators"],
    sourceLabel: "Mobazha Node command and deployment sources",
    sourceUrl: "https://github.com/mobazha/mobazha",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Start with an isolated profile",
        body: [
          "Use a dedicated data directory and testnet while learning the operational model. Record the exact binary commit, flags, configuration, and external dependencies alongside the backup procedure.",
        ],
        code: "./mobazha init --testnet --datadir /path/to/mobazha-data\n./mobazha start --testnet --datadir /path/to/mobazha-data --open",
      },
      {
        heading: "Configuration checklist",
        bullets: [
          "Bind administrative interfaces to trusted networks unless an authenticated reverse proxy and TLS boundary are intentionally configured.",
          "Enable only payment methods reported by the effective runtime capability set and configured by the seller.",
          "Treat RPC, indexer, webhook, plugin, and remote media inputs as untrusted dependencies.",
          "Keep secrets outside source control and separate recovery material from ordinary service configuration.",
          "Document DNS, firewall, proxy, certificate, backup, monitoring, and rollback ownership before production use.",
        ],
      },
      {
        heading: "Capability truth",
        body: [
          "A source file, recognized identifier, frontend component, or configuration field does not prove a capability is active. Effective availability is the intersection of distribution allowlist, contract compatibility, installation or composition, authorization, configuration, and health.",
        ],
        links: [
          { label: "Runtime capabilities", href: "/build/runtime-capabilities" },
          { label: "Compatibility policy", href: "https://github.com/mobazha/mobazha/blob/main/docs/project/COMPATIBILITY.md" },
        ],
      },
    ],
  },
  {
    slug: "self-host/security",
    title: "Secure a self-hosted node",
    summary: "Protect the host, administrative boundary, signing material, payment integrations, backups, and recovery path as one system.",
    status: "Beta",
    audiences: ["Operators", "Security reviewers"],
    sourceLabel: "Mobazha security policy and extension security model",
    sourceUrl: "https://github.com/mobazha/mobazha/blob/main/SECURITY.md",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Minimum operator baseline",
        bullets: [
          "Use a dedicated, patched host and least-privilege service account.",
          "Keep admin APIs private by default; add TLS, authentication, rate limits, and network policy before remote exposure.",
          "Protect seed phrases, private keys, API tokens, webhook secrets, and backups independently.",
          "Review every chain RPC, indexer, plugin, webhook, and delivery integration as a hostile input boundary.",
          "Monitor health, storage, failed authentication, payment observation, webhook delivery, and unexpected capability changes.",
          "Test restore and rollback before a release or infrastructure change.",
        ],
      },
      {
        heading: "Financial boundaries",
        bullets: [
          "Only Core policy may change payment, refund, dispute, or settlement state.",
          "Extensions and external services must not receive raw seed phrases or private keys.",
          "A payment observation is not permission to settle; expected state, identity, amount, confirmations, and idempotency still apply.",
          "Disabling an unhealthy capability must fail closed rather than silently select a different financial behavior.",
        ],
      },
      {
        heading: "Report vulnerabilities privately",
        body: [
          "Do not open a public issue for a suspected vulnerability, leaked credential, signing-key concern, or exploit. Use GitHub private vulnerability reporting from the affected repository's Security tab.",
        ],
        links: [
          { label: "Node security policy", href: "https://github.com/mobazha/mobazha/security/policy" },
          { label: "Supply-chain audit baseline", href: "https://github.com/mobazha/mobazha/blob/main/docs/security/SUPPLY_CHAIN_AUDIT.md" },
        ],
      },
    ],
  },
  {
    slug: "self-host/troubleshooting",
    title: "Troubleshoot a Mobazha Node",
    summary: "Diagnose version, process, health, capability, configuration, and dependency failures without exposing sensitive data.",
    status: "Beta",
    audiences: ["Operators", "Support"],
    sourceLabel: "Mobazha Node operations commands",
    sourceUrl: "https://github.com/mobazha/mobazha#operations",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "First checks",
        code: "./mobazha service status\n./mobazha doctor\n./mobazha doctor --json",
        bullets: [
          "Confirm the binary version, start flags, data directory, network mode, and system clock.",
          "Check that the local UI and health endpoint respond before testing external DNS or proxies.",
          "Compare the advertised runtime capabilities with the operation that is failing.",
          "Separate node failure from RPC, indexer, network, payment provider, webhook consumer, or browser failure.",
        ],
      },
      {
        heading: "Safe evidence for support",
        bullets: [
          "Record the exact version or commit, operating system, reproduction steps, expected result, and sanitized error.",
          "Include request, event, or order identifiers only when they do not expose customer data or secrets.",
          "Remove tokens, private endpoints, seeds, keys, wallet recovery material, raw customer data, and full production databases.",
          "For a suspected security issue, stop public discussion and use private vulnerability reporting.",
        ],
      },
      {
        heading: "Recovery before experimentation",
        body: [
          "Create and verify a backup before changing data, flags, versions, or payment configuration. Prefer a reproducible rollback over repeated manual mutation of the only copy of a store.",
        ],
        code: "./mobazha backup --output mobazha-backup.tar.gz",
      },
      {
        heading: "Get help",
        links: [
          { label: "Public support paths", href: "/support" },
          { label: "Node issues", href: "https://github.com/mobazha/mobazha/issues" },
        ],
      },
    ],
  },
  {
    slug: "build/runtime-capabilities",
    title: "Runtime capabilities and product composition",
    summary: "Discover effective behavior from the connected backend and keep deployment, experience, capabilities, permissions, and experiments separate.",
    status: "Beta",
    audiences: ["Developers", "Agent builders", "Operators"],
    sourceLabel: "Mobazha compatibility and Unified runtime contracts",
    sourceUrl: "https://github.com/mobazha/mobazha-unified/blob/main/docs/architecture/RUNTIME_CAPABILITIES.md",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Effective availability",
        code: "distribution allowlist\n  ∩ contract compatible\n  ∩ installed or statically composed\n  ∩ authorized\n  ∩ configured\n  ∩ healthy",
        body: [
          "Every gate must pass before a capability is advertised and used. Recognition, source presence, UI code, or a configured name is descriptive only.",
        ],
      },
      {
        heading: "Runtime configuration roles",
        bullets: [
          "The bootstrap shell owns deployment mode, product experience, authentication transport, brand, and initial external-resource policy.",
          "GET /v1/runtime-config supplies backend-owned feature and capability state.",
          "capabilitiesReady distinguishes an authoritative denial from a placeholder that has not loaded.",
          "Capabilities control availability, permissions control the current actor, and feature flags control experiments or kill switches.",
          "Clients may narrow availability for safety or session validity but must never widen the backend response.",
        ],
      },
      {
        heading: "Fail-closed client behavior",
        bullets: [
          "Do not render or call an optional feature until an authoritative capability snapshot is ready.",
          "Tolerate additive unknown fields but reject malformed or incompatible contract versions safely.",
          "Apply the same capability keys to navigation, route boundaries, action controls, and Agent tools.",
          "Keep server-side authorization even when the client hides unavailable controls.",
        ],
        links: [
          { label: "Node compatibility policy", href: "https://github.com/mobazha/mobazha/blob/main/docs/project/COMPATIBILITY.md" },
          { label: "Unified runtime composition", href: "https://github.com/mobazha/mobazha-unified/blob/main/docs/architecture/RUNTIME_CAPABILITIES.md" },
        ],
      },
    ],
  },
  {
    slug: "build/extensions",
    title: "Extend Mobazha through public contracts",
    summary: "Choose the narrowest typed extension mechanism and preserve Core authority, capability gates, isolation, recovery, and audit.",
    status: "Draft",
    audiences: ["Extension developers", "Architects", "Security reviewers"],
    sourceLabel: "Mobazha Open Core extension contracts",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main/docs/extensions",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Choose the mechanism",
        bullets: [
          "Port: replace an implementation that Core requires.",
          "Module: assemble reviewed capabilities into a distribution.",
          "Function: customize a bounded deterministic business decision.",
          "Controller: reconcile an external system or perform external I/O.",
          "OrderExtension: attach versioned domain data and lifecycle to an order.",
        ],
      },
      {
        heading: "Non-negotiable boundaries",
        bullets: [
          "Do not add a generic hook when a typed domain contract can express the need.",
          "Core retains release policy, order state, payment verification, settlement gates, audit, and key custody.",
          "Third-party code must not import internal packages, receive the Core object, or access raw signing material.",
          "Every public contract needs version negotiation, permissions, health, idempotency, recovery, rollback, and conformance tests.",
          "An extension capability remains unavailable until every activation gate passes.",
        ],
      },
      {
        heading: "Start with the normative documents",
        links: [
          { label: "Extension overview", href: "https://github.com/mobazha/mobazha/blob/main/docs/extensions/README.md" },
          { label: "Capability and security model", href: "https://github.com/mobazha/mobazha/blob/main/docs/extensions/CAPABILITY_AND_SECURITY_MODEL.md" },
          { label: "Module lifecycle", href: "https://github.com/mobazha/mobazha/blob/main/docs/extensions/MODULE_LIFECYCLE.md" },
          { label: "Conformance", href: "https://github.com/mobazha/mobazha/blob/main/docs/extensions/CONFORMANCE.md" },
          { label: "Payment plugin architecture", href: "https://github.com/mobazha/mobazha/blob/main/docs/plugins/PAYMENT_PLUGIN_ARCHITECTURE.md" },
        ],
      },
    ],
  },
  {
    slug: "build/websocket",
    title: "WebSocket events",
    summary: "Use authenticated WebSocket events for timely UI updates, then reconcile important state through the authoritative HTTP API.",
    status: "Beta",
    audiences: ["Developers", "Client maintainers"],
    sourceLabel: "Mobazha WebSocket gateway and event registry",
    sourceUrl: "https://github.com/mobazha/mobazha/blob/main/internal/api/ws.go",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Current connection boundary",
        body: [
          "The default Node WebSocket endpoint is /ws. Deployments that route multiple nodes may also use a node-specific path. The gateway authenticates the connection before it joins the node event hub.",
        ],
        note: "A complete versioned AsyncAPI-style event contract has not yet been published. Treat current event envelopes as release-candidate behavior and test against the exact Node and client versions you deploy.",
      },
      {
        heading: "Client behavior",
        bullets: [
          "Use the supported client authentication path and avoid tokens in URLs when a safer protocol or header mechanism is available.",
          "Reconnect with bounded backoff and assume a connection gap can lose transient events.",
          "Deduplicate persistent notifications and tolerate additive unknown event types.",
          "Treat an event as a signal to refresh protected state; do not settle, refund, or complete an order solely from an unverified push payload.",
          "Keep route capability and authorization checks even when an event announces a feature or action.",
        ],
      },
      {
        heading: "Implementation evidence",
        links: [
          { label: "WebSocket gateway", href: "https://github.com/mobazha/mobazha/blob/main/internal/api/ws.go" },
          { label: "Event registry", href: "https://github.com/mobazha/mobazha/blob/main/pkg/events/registry.go" },
          { label: "Shared client", href: "https://github.com/mobazha/mobazha-unified" },
        ],
      },
    ],
  },
  {
    slug: "project/security",
    title: "Project security model",
    summary: "Security depends on explicit authority, fail-closed capabilities, protected signing material, hostile-input assumptions, and private disclosure.",
    status: "Beta",
    audiences: ["Operators", "Developers", "Security reviewers", "Evaluators"],
    sourceLabel: "Mobazha public security sources",
    sourceUrl: "https://github.com/mobazha/mobazha/blob/main/SECURITY.md",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Trust boundaries",
        bullets: [
          "The backend that owns an order is authoritative for its state and protected transitions.",
          "The client is untrusted input and a presentation layer; hiding a control never replaces server authorization.",
          "Payment rails, RPCs, indexers, plugins, webhooks, media, and delivery systems are external dependencies with their own failure and threat models.",
          "Extensions receive minimum typed projections and scoped handles, not general database or Core access.",
          "Sensitive actions remain auditable without placing secrets or unnecessary personal data in logs.",
        ],
      },
      {
        heading: "Release and supply chain",
        body: [
          "The current release is a pre-release candidate. Final artifacts require vulnerability scanning, dependency and license review, SBOM generation, checksums, provenance, reproducibility evidence, secret scans, and platform-specific validation.",
        ],
        links: [
          { label: "Node supply-chain audit", href: "https://github.com/mobazha/mobazha/blob/main/docs/security/SUPPLY_CHAIN_AUDIT.md" },
          { label: "Unified supply-chain audit", href: "https://github.com/mobazha/mobazha-unified/blob/main/docs/security/SUPPLY_CHAIN_AUDIT.md" },
          { label: "Operator security", href: "/self-host/security" },
        ],
      },
      {
        heading: "Security reporting",
        body: [
          "Use the affected repository's GitHub private vulnerability reporting. Do not publish exploit details, leaked credentials, signing-key concerns, or customer data in issues, chat, or documentation feedback.",
        ],
      },
    ],
  },
  {
    slug: "project/legal-and-privacy",
    title: "Legal, privacy, license, and trademark boundaries",
    summary: "Separate software licenses, hosted-service terms, privacy commitments, third-party obligations, and trademark rights.",
    status: "Current",
    audiences: ["Users", "Operators", "Contributors", "Evaluators"],
    sourceLabel: "Mobazha public policies and repository notices",
    sourceUrl: "https://mobazha.org/terms",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Which document applies",
        bullets: [
          "Repository LICENSE, NOTICE, attribution, and third-party notices govern source use and redistribution.",
          "Mobazha.org Terms and Privacy Policy govern the current hosted service as described there.",
          "An independent operator is responsible for its own terms, privacy disclosures, lawful products, taxes, data handling, and service providers.",
          "The source-code license does not grant rights to Mobazha names, logos, or visual identity; consult the trademark policy.",
          "A transaction-specific quote and seller policy may add applicable terms but cannot silently override project-wide public boundaries.",
        ],
      },
      {
        heading: "Canonical public links",
        links: [
          { label: "Terms of Service", href: "https://mobazha.org/terms" },
          { label: "Privacy Policy", href: "https://mobazha.org/privacy" },
          { label: "Fees and Paid Services", href: "https://mobazha.org/fees" },
          { label: "Node license", href: "https://github.com/mobazha/mobazha/blob/main/LICENSE" },
          { label: "Node attribution", href: "https://github.com/mobazha/mobazha/blob/main/docs/project/ATTRIBUTION.md" },
          { label: "Trademark policy", href: "https://github.com/mobazha/mobazha/blob/main/TRADEMARKS.md" },
        ],
      },
      {
        heading: "Documentation boundary",
        body: [
          "This page is navigation and product explanation, not legal advice. When documents conflict, use the effective policy or license from its owning public source and report the inconsistency.",
        ],
      },
    ],
  },
  {
    slug: "contribute",
    title: "Contribute to Mobazha",
    summary: "Choose the owning repository, agree on large changes early, preserve public contracts, add tests, update documentation, and sign off commits.",
    status: "Current",
    audiences: ["Contributors", "Maintainers", "Agents"],
    sourceLabel: "Mobazha contribution and governance policies",
    sourceUrl: "https://github.com/mobazha/mobazha/blob/main/CONTRIBUTING.md",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Choose the repository",
        bullets: [
          "Node business logic, deployment, public APIs, extensions, and project policy: mobazha/mobazha.",
          "Buyer, seller, responsive UI, and runtime-capability client behavior: mobazha/mobazha-unified.",
          "Brand website, pricing, service terms, and public marketing: mobazha/mobazha.org.",
          "Task guidance, knowledge navigation, Agent discovery, and documentation quality: mobazha/mobazha-docs.",
        ],
      },
      {
        heading: "Contribution contract",
        bullets: [
          "Open an issue or discussion before a large architecture, protocol, payment, security, or governance change.",
          "Keep the change focused and update tests, schemas, docs, migration guidance, and release notes together.",
          "Do not include credentials, private endpoints, customer data, proprietary code, or generated release binaries.",
          "Use DCO sign-off for source contributions where required by the owning repository.",
          "Report vulnerabilities privately rather than through a public pull request or issue.",
        ],
      },
      {
        heading: "Repository guides",
        links: [
          { label: "Contribute to Mobazha Node", href: "https://github.com/mobazha/mobazha/blob/main/CONTRIBUTING.md" },
          { label: "Contribute to Mobazha Unified", href: "https://github.com/mobazha/mobazha-unified/blob/main/CONTRIBUTING.md" },
          { label: "Improve this documentation", href: "https://github.com/mobazha/mobazha-docs/blob/main/CONTRIBUTING.md" },
        ],
      },
    ],
  },
  {
    slug: "support",
    title: "Get help and report problems",
    summary: "Use public support for reproducible product questions, repository issues for defects, and private reporting for security problems.",
    status: "Current",
    audiences: ["Everyone"],
    sourceLabel: "Mobazha public support surfaces",
    sourceUrl: "https://mobazha.org/status",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Choose the channel",
        links: [
          { label: "Documentation issues", href: "https://github.com/mobazha/mobazha-docs/issues", description: "Stale, missing, unclear, or conflicting documentation." },
          { label: "Node issues", href: "https://github.com/mobazha/mobazha/issues", description: "Reproducible backend, deployment, API, payment, or operator defects." },
          { label: "Unified issues", href: "https://github.com/mobazha/mobazha-unified/issues", description: "Buyer, seller, browser, responsive, or frontend defects." },
          { label: "Telegram", href: "https://t.me/MobazhaHQ", description: "Community help and current service questions." },
          { label: "Discord", href: "https://discord.gg/3KCPBYxXgb", description: "Community discussion and help." },
        ],
      },
      {
        heading: "Write a useful report",
        bullets: [
          "Identify hosted or self-hosted deployment, exact version or commit, operating system, and relevant capability state.",
          "Describe the smallest reproducible steps, expected behavior, actual behavior, and sanitized evidence.",
          "Search existing issues and link related documentation or release notes.",
          "Do not include access tokens, private keys, seeds, wallet recovery material, customer data, or private infrastructure details.",
        ],
      },
      {
        heading: "Security exception",
        body: [
          "Suspected vulnerabilities, leaked credentials, signing-key concerns, and exploits must use private vulnerability reporting in the affected GitHub repository. Do not first disclose them through community chat or a public issue.",
        ],
      },
    ],
  },
];

export const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));
