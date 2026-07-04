import type { ReactNode } from "react";
import Link from "next/link";
import { docsBySlug, navGroupsForPath, translationPathFor } from "@/app/lib/docs";
import { DocsSearch } from "@/app/components/DocsSearch";

export function SiteHeader({ activePath }: { activePath?: string }) {
  const isChinese = activePath?.startsWith("/zh/") ?? false;
  const activeDoc = activePath ? docsBySlug.get(activePath.slice(1)) : undefined;
  const languagePath = activeDoc
    ? translationPathFor(activeDoc) ?? (isChinese ? "/start" : "/zh/start")
    : "/zh/start";
  const primaryLinks = isChinese
    ? [["自行托管", "/zh/self-host"], ["开发", "/zh/build"], ["项目", "/zh/project/whitepaper"], ["支持", "/zh/support"]]
    : [["Self-host", "/self-host"], ["Build", "/build"], ["Reference", "/reference"], ["Project", "/project"]];

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Mobazha documentation home">
        <span className="brand-mark">M</span>
        <span>Mobazha Docs</span>
      </Link>
      <nav aria-label="Primary navigation">
        {primaryLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <Link className="language-link" href={languagePath} hrefLang={isChinese ? "en" : "zh-CN"}>
          {isChinese ? "English" : "中文"}
        </Link>
        <a className="github-link" href="https://github.com/mobazha/mobazha-docs">
          {isChinese ? "文档仓库 ↗" : "Docs repo ↗"}
        </a>
      </div>
    </header>
  );
}

export function DocsShell({ activePath, children }: { activePath: string; children: ReactNode }) {
  const isChinese = activePath.startsWith("/zh/");
  const navGroups = navGroupsForPath(activePath);
  return (
    <main lang={isChinese ? "zh-CN" : "en"}>
      <SiteHeader activePath={activePath} />
      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label={isChinese ? "文档导航" : "Documentation navigation"}>
          <DocsSearch language={isChinese ? "zh-CN" : "en"} />
          {navGroups.map((group) => {
            const isActiveGroup = group.links.some(([, href]) => href === activePath);
            return (
              <div className={`nav-group${isActiveGroup ? " active-group" : ""}`} key={group.label}>
                <p>{group.label}</p>
                {group.links.map(([label, href]) => (
                  <Link className={activePath === href ? "active" : ""} href={href} key={href}>
                    {label}
                  </Link>
                ))}
              </div>
            );
          })}
          <div className="agent-links">
            <p>{isChinese ? "供 Agent 使用" : "For agents"}</p>
            <a href="/llms.txt">llms.txt ↗</a>
            <a href="/llms-full.txt">llms-full.txt ↗</a>
            <a href="/docs-index.json">docs-index.json ↗</a>
            <a href="/agent-evals.json">agent-evals.json ↗</a>
          </div>
        </aside>
        <article className="doc-article">{children}</article>
      </div>
    </main>
  );
}
