import type { ReactNode } from "react";
import Link from "next/link";
import { activeNavGroupForPath, docsBySlug, translationPathFor } from "@/app/lib/docs";
import { DocsSearch } from "@/app/components/DocsSearch";

export function SiteHeader({ activePath }: { activePath?: string }) {
  const isChinese = activePath?.startsWith("/zh/") ?? false;
  const activeDoc = activePath ? docsBySlug.get(activePath.slice(1)) : undefined;
  const languagePath = activeDoc
    ? translationPathFor(activeDoc) ?? (isChinese ? "/start" : "/zh/start")
    : "/zh/start";
  const primaryLinks = isChinese
    ? [["使用", "/zh/buy"], ["自行托管", "/zh/self-host"], ["开发", "/zh/build"], ["了解", "/zh/project/whitepaper"], ["社区", "/zh/support"]]
    : [["Buy & sell", "/buy"], ["Operate", "/self-host"], ["Build", "/build"], ["Understand", "/project"], ["Community", "/support"]];
  const isPrimaryActive = (href: string) => {
    if (!activePath) return false;
    if (href.endsWith("/buy") || href === "/buy") return /\/(buy|sell)(\/|$)/.test(activePath);
    if (href.endsWith("/self-host")) return activePath.includes("/self-host");
    if (href.endsWith("/build")) return activePath.includes("/build") || activePath === "/reference";
    if (href.endsWith("/project") || href.endsWith("/project/whitepaper")) {
      return activePath.includes("/project") || activePath === "/releases";
    }
    if (href.endsWith("/support")) return activePath.includes("/support") || activePath.includes("/contribute");
    return activePath === href;
  };

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Mobazha documentation home">
        <span className="brand-mark">M</span>
        <span>Mobazha Docs</span>
      </Link>
      <nav aria-label="Primary navigation">
        {primaryLinks.map(([label, href]) => (
          <Link aria-current={isPrimaryActive(href) ? "page" : undefined} href={href} key={href}>{label}</Link>
        ))}
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
  const activeGroup = activeNavGroupForPath(activePath);
  const activeLabel = activeGroup?.links.find(([, href]) => href === activePath)?.[0];
  return (
    <main lang={isChinese ? "zh-CN" : "en"}>
      <SiteHeader activePath={activePath} />
      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label={isChinese ? "文档导航" : "Documentation navigation"}>
          <DocsSearch language={isChinese ? "zh-CN" : "en"} />
          {activeGroup && (
            <details className="mobile-journey-menu">
              <summary><span>{activeGroup.label}</span><b>{activeLabel}</b></summary>
              <nav aria-label={activeGroup.label}>
                {activeGroup.links.map(([label, href]) => (
                  <Link
                    aria-current={activePath === href ? "page" : undefined}
                    className={activePath === href ? "active" : ""}
                    href={href}
                    key={href}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
          )}
          {activeGroup && (
            <nav className="nav-group active-group" aria-label={activeGroup.label}>
              <p>{activeGroup.label}</p>
              {activeGroup.links.map(([label, href]) => (
                <Link
                  aria-current={activePath === href ? "page" : undefined}
                  className={activePath === href ? "active" : ""}
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </aside>
        <article className="doc-article">{children}</article>
      </div>
    </main>
  );
}
