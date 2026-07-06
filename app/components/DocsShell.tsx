import type { ReactNode } from "react";
import Link from "next/link";
import { activeNavGroupForPath, docsBySlug, translationPathFor } from "@/app/lib/docs";
import { DocsSearch } from "@/app/components/DocsSearch";

function isChinesePath(activePath?: string): boolean {
  return activePath === "/zh" || (activePath?.startsWith("/zh/") ?? false);
}

function isNavLinkActive(activePath: string, href: string): boolean {
  return activePath === href
    || activePath.startsWith(`${href}/`)
    || (href === "/" && activePath === "/")
    || (href === "/zh" && activePath === "/zh");
}

export function SiteHeader({ activePath }: { activePath?: string }) {
  const isChinese = isChinesePath(activePath);
  const activeDoc = activePath && activePath !== "/" && activePath !== "/zh"
    ? docsBySlug.get(activePath.slice(1))
    : undefined;
  const languagePath = activeDoc
    ? translationPathFor(activeDoc) ?? (isChinese ? "/" : "/zh")
    : activePath === "/api-reference" ? "/zh/build/api"
    : isChinese ? "/" : "/zh";
  const primaryLinks = isChinese
    ? [["使用", "/zh/buy"], ["自行托管", "/zh/self-host"], ["开发", "/zh/build"], ["产品", "/zh/project/product-map"], ["社区", "/zh/support"]]
    : [["Buy & sell", "/buy"], ["Operate", "/self-host"], ["Build", "/build"], ["Product", "/project/product-map"], ["Community", "/support"]];
  const isPrimaryActive = (href: string) => {
    if (!activePath) return false;
    if (href.endsWith("/buy") || href === "/buy") return /\/(buy|sell)(\/|$)/.test(activePath);
    if (href.endsWith("/self-host")) return activePath.includes("/self-host");
    if (href.endsWith("/build")) return activePath.includes("/build") || activePath === "/reference" || activePath === "/api-reference";
    if (href.endsWith("/project/product-map")) {
      return activePath.includes("/project") || activePath === "/releases";
    }
    if (href.endsWith("/support")) return activePath.includes("/support") || activePath.includes("/contribute");
    return activePath === href;
  };

  return (
    <header className="site-header">
      <Link className="brand" href={isChinese ? "/zh" : "/"} aria-label="Mobazha documentation home">
        <span className="brand-mark">M</span>
        <span>Mobazha Docs</span>
      </Link>
      <nav aria-label="Primary navigation">
        {primaryLinks.map(([label, href]) => (
          <Link aria-current={isPrimaryActive(href) ? "page" : undefined} href={href} key={href}>{label}</Link>
        ))}
      </nav>
      <div className="header-actions">
        <DocsSearch language={isChinese ? "zh-CN" : "en"} variant="header" />
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
  const isChinese = isChinesePath(activePath);
  const activeGroup = activeNavGroupForPath(activePath);
  const activeLabel = activeGroup?.links.find(([, href]) => href === activePath)?.[0]
    ?? activeGroup?.links.find(([, href]) => activePath.startsWith(`${href}/`))?.[0];

  return (
    <main id="main-content" lang={isChinese ? "zh-CN" : "en"} tabIndex={-1}>
      <a className="skip-link" href="#main-content">{isChinese ? "跳到主要内容" : "Skip to main content"}</a>
      <SiteHeader activePath={activePath} />
      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label={isChinese ? "文档导航" : "Documentation navigation"}>
          {activeGroup && (
            <details className="mobile-journey-menu">
              <summary><span>{activeGroup.label}</span><b>{activeLabel}</b></summary>
              <nav aria-label={activeGroup.label}>
                {activeGroup.links.map(([label, href]) => (
                  <Link
                    aria-current={isNavLinkActive(activePath, href) ? "page" : undefined}
                    className={isNavLinkActive(activePath, href) ? "active" : ""}
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
                  aria-current={isNavLinkActive(activePath, href) ? "page" : undefined}
                  className={isNavLinkActive(activePath, href) ? "active" : ""}
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </aside>
        <div className="doc-article">{children}</div>
      </div>
    </main>
  );
}
