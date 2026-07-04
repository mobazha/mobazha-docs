import Link from "next/link";

const journeys = [
  {
    title: "Use Mobazha",
    description: "Buy from independent stores or run a seller workflow.",
    links: [
      { label: "Buy", href: "/buy", description: "Checkout, tracking, refunds" },
      { label: "Sell", href: "/sell", description: "Store setup, listings, orders" },
      { label: "Guest checkout", href: "/buy/guest-checkout", description: "Recoverable anonymous orders" },
    ],
  },
  {
    title: "Operate",
    description: "Install, configure, and maintain a Node you control.",
    links: [
      { label: "Self-host overview", href: "/self-host", description: "Choose an operating path" },
      { label: "Install", href: "/self-host/install", description: "Evaluation quick start" },
      { label: "Backup and upgrade", href: "/self-host/backup-and-upgrade", description: "Recovery planning" },
    ],
  },
  {
    title: "Build",
    description: "Integrate through HTTP, events, MCP, and webhooks.",
    links: [
      { label: "Developer overview", href: "/build", description: "Public integration surfaces" },
      { label: "Quickstart", href: "/build/quickstart", description: "First authenticated API call" },
      { label: "API reference", href: "/api-reference", description: "Search operations and schemas" },
    ],
  },
  {
    title: "Understand",
    description: "Architecture, economics, security, and release scope.",
    links: [
      { label: "Project overview", href: "/project", description: "How the stack fits together" },
      { label: "Whitepaper", href: "/project/whitepaper", description: "Long-term principles" },
      { label: "Fees and economics", href: "/project/fees", description: "Cost categories and policy" },
    ],
  },
];

const quickLinks = [
  { label: "Hosted app", href: "https://app.mobazha.org" },
  { label: "Agent guide", href: "/agents" },
  { label: "llms.txt", href: "/llms.txt" },
  { label: "Docs index", href: "/docs-index.json" },
  { label: "OpenAPI JSON", href: "/openapi.json" },
];

export function PortalHome() {
  return (
    <div className="portal-home">
      <header className="portal-home-header">
        <p className="portal-eyebrow">Mobazha documentation</p>
        <h1>Trusted guides for buyers, sellers, operators, and developers.</h1>
        <p>
          Choose a journey below. Task pages expose outcomes, primary actions, and source-backed guidance
          without hiding lifecycle or applicability details.
        </p>
        <div className="portal-home-actions">
          <Link className="doc-primary-action" href="/buy">
            Start buying<span aria-hidden="true">→</span>
          </Link>
          <a className="portal-secondary-action" href="https://app.mobazha.org">
            Open hosted app
          </a>
        </div>
      </header>

      <div className="portal-journey-grid">
        {journeys.map((journey) => (
          <section className="portal-journey-card" key={journey.title}>
            <h2>{journey.title}</h2>
            <p>{journey.description}</p>
            <ul>
              {journey.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span>{link.label}</span>
                    <small>{link.description}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="portal-quick-links" aria-label="Quick links">
        <h2>Quick links</h2>
        <div>
          {quickLinks.map((link) => (
            link.href.startsWith("/")
              ? <Link href={link.href} key={link.href}>{link.label}</Link>
              : <a href={link.href} key={link.href}>{link.label} ↗</a>
          ))}
        </div>
      </section>
    </div>
  );
}
