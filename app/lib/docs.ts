export type DocStatus = "Current" | "Beta" | "Draft";

export type DocSection = {
  heading: string;
  body?: string[];
  bullets?: string[];
  code?: string;
  note?: string;
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
  sections: DocSection[];
};

export const navGroups = [
  { label: "Start", links: [["Overview", "/start"]] },
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
      ["Bind an account", "/self-host/bind-account"],
      ["Backup and upgrade", "/self-host/backup-and-upgrade"],
    ],
  },
  {
    label: "Build",
    links: [
      ["Developer overview", "/build"],
      ["API", "/build/api"],
      ["MCP and agents", "/build/mcp"],
      ["Webhooks", "/build/webhooks"],
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
      ["Release scope", "/project/release-scope"],
      ["Governance", "/project/governance"],
      ["Releases", "/releases"],
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
    ],
  },
  {
    slug: "buy",
    title: "Buy with inspectable terms",
    summary: "Confirm the seller, item, delivery terms, payment route, and complete cost breakdown before committing funds.",
    status: "Beta",
    audiences: ["Buyers", "Agents"],
    sourceLabel: "Curated product flow; anonymous public client source pending",
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
    title: "Bind a self-hosted node to an account",
    summary: "Connect a node only when you intentionally choose an optional hosted capability that requires account association.",
    status: "Beta",
    audiences: ["Operators"],
    sourceLabel: "Curated account-binding flow; anonymous public client source pending",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Before you bind",
        bullets: [
          "Confirm that you are administering the intended node and account.",
          "Create a fresh backup and keep recovery material outside the browser session.",
          "Check which hosted capability needs the binding and what data it exchanges.",
          "Do not paste seed phrases, wallet private keys, or database credentials into an account-binding form.",
        ],
      },
      {
        heading: "Binding flow",
        bullets: [
          "Sign in to the Mobazha application and open My Stores.",
          "Choose the self-hosted store and start Bind account.",
          "Review the node identity and requested permissions, then approve.",
          "Return to the store page and confirm that the expected capability—not merely a success message—is available.",
        ],
      },
      {
        heading: "If binding fails",
        body: [
          "Verify the node is reachable, the application is connected to the correct backend, the session has not expired, and system clocks are accurate. Preserve the request ID and sanitized logs when asking for help.",
        ],
        note: "Never publish tokens, private keys, recovery phrases, raw customer data, or unsanitized production logs in an issue.",
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
    title: "API documentation policy",
    summary: "The API reference will be generated from versioned interface definitions; examples must not become a second, conflicting specification.",
    status: "Draft",
    audiences: ["Developers"],
    sourceLabel: "Mobazha backend source",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Current entry point",
        body: [
          "Mobazha Node exposes HTTP routes under /v1/ and WebSocket connections under /ws. Until a reviewed public OpenAPI artifact is published, inspect the backend version and source repository for the deployment you target. This site intentionally does not invent endpoint signatures or authentication guarantees.",
        ],
      },
      {
        heading: "Publication gate",
        bullets: [
          "A versioned source schema is public and reviewable.",
          "Authentication, scopes, errors, pagination, idempotency, and rate limits are documented.",
          "Generated reference and tested examples point to the same version.",
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
    sourceUrl: "https://github.com/mobazha",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Current transport",
        body: [
          "Mobazha Node exposes MCP over Streamable HTTP at /v1/mcp. Treat discovery, authentication, scopes, tool availability, and errors as properties of the connected Node version—not of this prose page.",
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
    ],
  },
  {
    slug: "build/webhooks",
    title: "Webhook integration contract",
    summary: "Design consumers for authentication, retries, duplication, reordering, and version change before depending on event delivery.",
    status: "Draft",
    audiences: ["Developers", "Operators"],
    sourceLabel: "Mobazha backend source",
    sourceUrl: "https://github.com/mobazha/mobazha/tree/main",
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
          "The cross-platform client implementation owns user flows and capability handling; link it only after anonymous public access is verified.",
          "mobazha/mobazha.org: public website, positioning, and high-level disclosures.",
          "mobazha/docs site: curated navigation and derived guidance; it links back to governing sources.",
        ],
        note: "Internal Hosting plans, credentials, operational playbooks, forecasts, and unapproved commercial experiments are not public documentation sources.",
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
    summary: "A public, evolving account of Mobazha's problem framing, principles, architecture, and approach to sustainable open commerce.",
    status: "Draft",
    audiences: ["Community", "Contributors", "Evaluators"],
    sourceLabel: "Public-review edition prepared for the Mobazha project",
    reviewed: "2026-07-04",
    sections: [
      {
        heading: "Thesis",
        body: [
          "Commerce infrastructure should be usable by people and agents without forcing every participant through one operator, one custody model, or one opaque fee schedule. Independence must remain practical, while optional services may charge clearly for value they provide.",
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
        heading: "Publication status",
        body: [
          "This page is the public-review summary. The complete whitepaper should move into the public project repository only after security, legal, economic, and release-scope review. Internal forecasts and experimental percentages are deliberately excluded.",
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
    ],
  },
  {
    slug: "project/governance",
    title: "Documentation and policy governance",
    summary: "Important project claims need an owner, source, review date, status, and visible change path.",
    status: "Draft",
    audiences: ["Contributors", "Maintainers", "Agents"],
    sourceLabel: "Mobazha documentation governance plan",
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
    ],
  },
];

export const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));
