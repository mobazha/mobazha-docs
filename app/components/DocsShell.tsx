import type { ReactNode } from "react";
import Link from "next/link";
import { navGroups } from "@/app/lib/docs";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Mobazha documentation home">
        <span className="brand-mark">M</span>
        <span>Mobazha Docs</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/self-host">Self-host</Link>
        <Link href="/build">Build</Link>
        <Link href="/reference">Reference</Link>
        <Link href="/project">Project</Link>
      </nav>
      <a className="github-link" href="https://github.com/mobazha">
        GitHub ↗
      </a>
    </header>
  );
}

export function DocsShell({ activePath, children }: { activePath: string; children: ReactNode }) {
  return (
    <main>
      <SiteHeader />
      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label="Documentation navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.links.map(([label, href]) => (
                <Link className={activePath === href ? "active" : ""} href={href} key={href}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
          <div className="agent-links">
            <p>For agents</p>
            <a href="/llms.txt">llms.txt ↗</a>
            <a href="/docs-index.json">docs-index.json ↗</a>
          </div>
        </aside>
        <article className="doc-article">{children}</article>
      </div>
    </main>
  );
}
