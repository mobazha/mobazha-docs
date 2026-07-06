import type { ReactNode } from "react";
import Link from "next/link";
import {
  activeNavGroupForPath,
  docsBySlug,
  sidebarNavGroupsForPath,
  translationPathFor,
} from "@/app/lib/docs";
import { DocsSearch } from "@/app/components/DocsSearch";

function isChinesePath(activePath?: string): boolean {
  return activePath === "/zh" || (activePath?.startsWith("/zh/") ?? false);
}

export function SiteHeader({ activePath }: { activePath?: string }) {
  const isChinese = isChinesePath(activePath);
  const activeGroupLabel = activePath ? activeNavGroupForPath(activePath)?.label : undefined;
  const activeDoc = activePath && activePath !== "/" && activePath !== "/zh"
    ? docsBySlug.get(activePath.slice(1))
    : undefined;
  const languagePath = activeDoc
    ? translationPathFor(activeDoc) ?? (isChinese ? "/" : "/zh")
    : activePath === "/api-reference" ? "/zh/build/api"
    : isChinese ? "/" : "/zh";
  const primaryLinks = isChinese
    ? [["使用", "/zh/buy"], ["自行托管", "/zh/self-host"], ["开发", "/zh/build"], ["产品", "/zh/project/product-map"], ["白皮书", "/zh/project/whitepaper"], ["社区", "/zh/support"]]
    : [["Buy & sell", "/buy"], ["Operate", "/self-host"], ["Build", "/build"], ["Product", "/project/product-map"], ["Project", "/project/release-scope"], ["Community", "/support"]];
  const isPrimaryActive = (href: string) => {
    if (!activePath) return false;
    if (href.endsWith("/buy") || href === "/buy") return /\/(buy|sell)(\/|$)/.test(activePath);
    if (href.endsWith("/self-host")) return activePath.includes("/self-host");
    if (href.endsWith("/build")) return activePath.includes("/build") || activePath === "/reference" || activePath === "/api-reference";
    if (!isChinese && href === "/project/product-map") {
      return ["Product model", "Product foundations", "Vision & direction"].includes(activeGroupLabel ?? "");
    }
    if (!isChinese && href === "/project/release-scope") {
      return activeGroupLabel === "Trust & governance";
    }
    if (isChinese && href.endsWith("/project/whitepaper")) return activePath === href;
    if (isChinese && href.endsWith("/project/product-map")) {
      return activePath.includes("/project") && !activePath.endsWith("/project/whitepaper");
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
  const sidebarGroups = sidebarNavGroupsForPath(activePath);
  const hasProductKnowledgeGroups = !isChinese && sidebarGroups.length > 1;
  const activeLink = activeGroup?.links.find(([, href]) => href === activePath)
    ?? activeGroup?.links
      .filter(([, href]) => activePath.startsWith(`${href}/`))
      .sort(([, leftHref], [, rightHref]) => rightHref.length - leftHref.length)[0];
  const activeLabel = activeLink?.[0];
  const activeHref = activeLink?.[1];
  const isSidebarLinkActive = (href: string) => href === activeHref;

  return (
    <main id="main-content" lang={isChinese ? "zh-CN" : "en"} tabIndex={-1}>
      <a className="skip-link" href="#main-content">{isChinese ? "跳到主要内容" : "Skip to main content"}</a>
      <SiteHeader activePath={activePath} />
      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label={isChinese ? "文档导航" : "Documentation navigation"}>
          {activeGroup && sidebarGroups.length > 0 && (
            <details className="mobile-journey-menu">
              <summary><span>{hasProductKnowledgeGroups ? "Product" : activeGroup.label}</span><b>{activeLabel}</b></summary>
              <nav aria-label={hasProductKnowledgeGroups ? "Product knowledge" : activeGroup.label}>
                {sidebarGroups.map((group) => (
                  <div className="mobile-nav-group" key={group.label}>
                    {hasProductKnowledgeGroups && <p>{group.label}</p>}
                    {group.links.map(([label, href]) => (
                      <Link
                        aria-current={isSidebarLinkActive(href) ? "page" : undefined}
                        className={isSidebarLinkActive(href) ? "active" : ""}
                        href={href}
                        key={href}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </details>
          )}
          {hasProductKnowledgeGroups
            ? sidebarGroups.map((group) => {
              const isActiveGroup = group.label === activeGroup?.label;
              const isOpenByDefault = isActiveGroup || group.label === "Vision & direction";
              return (
                <details
                  className={`nav-group product-nav-group${isActiveGroup ? " active-group" : ""}`}
                  key={group.label}
                  open={isOpenByDefault}
                >
                  <summary><span>{group.label}</span></summary>
                  <nav aria-label={group.label}>
                    {group.links.map(([label, href]) => (
                      <Link
                        aria-current={isSidebarLinkActive(href) ? "page" : undefined}
                        className={isSidebarLinkActive(href) ? "active" : ""}
                        href={href}
                        key={href}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                </details>
              );
            })
            : sidebarGroups.map((group) => (
              <nav
                className={`nav-group${group.label === activeGroup?.label ? " active-group" : ""}`}
                aria-label={group.label}
                key={group.label}
              >
                <p>{group.label}</p>
                {group.links.map(([label, href]) => (
                  <Link
                    aria-current={isSidebarLinkActive(href) ? "page" : undefined}
                    className={isSidebarLinkActive(href) ? "active" : ""}
                    href={href}
                    key={href}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            ))}
        </aside>
        <div className="doc-article">{children}</div>
      </div>
    </main>
  );
}
