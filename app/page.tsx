import { SiteHeader } from "@/app/components/DocsShell";
import Link from "next/link";

const paths = [
  {
    eyebrow: "SELL",
    title: "Start and operate a store",
    description:
      "Create a store, publish products, accept supported payments, fulfill orders, and understand costs.",
    href: "/sell",
  },
  {
    eyebrow: "BUY",
    title: "Buy with clear terms",
    description:
      "Understand payment, buyer protection, cancellation, refund, evidence, and dispute paths.",
    href: "/buy",
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
        <div className="status-pill"><span /> Release candidate documentation</div>
        <h1>One trusted path into<br /><em>open commerce.</em></h1>
        <p>
          Guides, references, policies, and project knowledge for people and
          agents using, operating, or extending Mobazha.
        </p>
        <div className="hero-actions">
          <Link className="primary-action" href="/start">Get started <span>→</span></Link>
          <Link className="secondary-action" href="/self-host">Run your own node</Link>
        </div>
      </section>

      <section className="path-section" aria-labelledby="choose-path">
        <div className="section-heading">
          <div>
            <p>CHOOSE YOUR PATH</p>
            <h2 id="choose-path">Start from what you need to accomplish.</h2>
          </div>
          <span>Current facts are separated from drafts, history, and long-term direction.</span>
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
          <p>AUTHORITATIVE BY DESIGN</p>
          <h2>Know which answer governs.</h2>
        </div>
        <div className="truth-items">
          <span><b>Capabilities</b> come from the connected backend.</span>
          <span><b>Policies</b> come from reviewed public sources.</span>
          <span><b>Transaction costs</b> come from the quote shown before confirmation.</span>
        </div>
      </section>

      <footer>
        <span>Mobazha Documentation · Beta knowledge surface</span>
        <div><a href="https://mobazha.org">mobazha.org</a><a href="https://mobazha.org/fees">Fees</a><a href="https://github.com/mobazha">GitHub</a></div>
      </footer>
    </main>
  );
}
