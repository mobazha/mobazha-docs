import { SiteHeader } from "@/app/components/DocsShell";
import Link from "next/link";

const paths = [
  {
    eyebrow: "BUY",
    title: "Buy from an independent store",
    description:
      "See the seller, total cost, payment instructions, order state, and available recovery path.",
    href: "/buy",
  },
  {
    eyebrow: "SELL",
    title: "Start and operate a store",
    description:
      "Publish products, choose supported payments, fulfill orders, and keep control of store operations.",
    href: "/sell",
  },
  {
    eyebrow: "OPERATE",
    title: "Run your own node",
    description:
      "Install, bind, configure, back up, upgrade, and troubleshoot a self-hosted Mobazha Node.",
    href: "/self-host",
  },
  {
    eyebrow: "BUILD",
    title: "Integrate and extend",
    description:
      "Use HTTP, WebSocket, webhook, MCP, runtime-capability, plugin, and contract interfaces.",
    href: "/build",
  },
  {
    eyebrow: "PROJECT",
    title: "Understand Mobazha",
    description:
      "Read the architecture, release scope, whitepaper, fee policy, governance, and security model.",
    href: "/project",
  },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="status-pill"><span /> Open-source commerce stack</div>
        <h1>Open commerce, operated by<br /><em>the people who use it.</em></h1>
        <p>
          Buy from independent stores, run a store or Node under your control,
          or build on public interfaces without one marketplace owning every path.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="#choose-path">Choose your path <span>→</span></a>
          <a className="secondary-action" href="https://app.mobazha.org">Explore the hosted app</a>
        </div>
      </section>

      <section className="path-section" aria-labelledby="choose-path">
        <div className="section-heading">
          <div>
            <p>CHOOSE YOUR PATH</p>
            <h2 id="choose-path">Start from what you need to accomplish.</h2>
          </div>
          <span>Choose one outcome now. Architecture, policy, and source evidence stay available when you need them.</span>
        </div>
        <div className="path-grid">
          {paths.map((path, index) => (
            <Link className={`path-card path-card-${index + 1}`} href={path.href} key={path.href}>
              <span className="card-number">0{index + 1}</span>
              <p className="card-eyebrow">{path.eyebrow}</p>
              <h3>{path.title}</h3>
              <p className="card-description">{path.description}</p>
              <span className="card-arrow">Explore <b>→</b></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="truth-strip">
        <div>
          <p>CONTROL WITHOUT GUESSWORK</p>
          <h2>Know who operates each part.</h2>
        </div>
        <div className="truth-items">
          <span><b>Stores</b> are operated by their seller or chosen operator.</span>
          <span><b>Capabilities</b> come from the backend you are connected to.</span>
          <span><b>Transaction costs</b> come from the quote you review before confirmation.</span>
          <span><b>Current software</b> is release-candidate quality and should be evaluated accordingly.</span>
        </div>
      </section>

      <footer>
        <span>Mobazha Documentation · Beta knowledge surface</span>
        <div><a href="https://mobazha.org">mobazha.org</a><a href="https://mobazha.org/fees">Fees</a><a href="https://github.com/mobazha">GitHub</a></div>
      </footer>
    </main>
  );
}
