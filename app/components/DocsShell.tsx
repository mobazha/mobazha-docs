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
  const currentPath = activePath ?? (isChinese ? "/zh" : "/");
  const englishPath = isChinese ? languagePath : currentPath;
  const chinesePath = isChinese ? currentPath : languagePath;
  const primaryLinks = isChinese
    ? [["买卖", "/zh/buy"], ["运营", "/zh/self-host"], ["开发", "/zh/build"], ["产品", "/zh/project/product-map"], ["项目", "/zh/project"], ["社区", "/zh/support"]]
    : [["Buy & sell", "/buy"], ["Operate", "/self-host"], ["Build", "/build"], ["Product", "/project/product-map"], ["Project", "/project/release-scope"], ["Community", "/support"]];
  const isPrimaryActive = (href: string) => {
    if (!activePath) return false;
    if (href.endsWith("/buy") || href === "/buy") return /\/(buy|sell)(\/|$)/.test(activePath);
    if (href.endsWith("/self-host")) return activePath.includes("/self-host");
    if (href.endsWith("/build")) return activePath.includes("/build") || activePath === "/reference" || activePath === "/api-reference";
    if (href.endsWith("/project/product-map")) {
      const productGroups = isChinese
        ? ["产品模型", "产品基础", "愿景与方向"]
        : ["Product model", "Product foundations", "Vision & direction"];
      return productGroups.includes(activeGroupLabel ?? "");
    }
    if (href === "/project/release-scope" || href === "/zh/project") {
      return activeGroupLabel === (isChinese ? "信任与治理" : "Trust & governance");
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
      <nav className="primary-nav" aria-label="Primary navigation">
        {primaryLinks.map(([label, href]) => (
          <Link aria-current={isPrimaryActive(href) ? "page" : undefined} href={href} key={href}>{label}</Link>
        ))}
      </nav>
      <div className="header-actions">
        <DocsSearch language={isChinese ? "zh-CN" : "en"} variant="header" />
        <details className="language-menu" suppressHydrationWarning>
          <summary aria-label={isChinese ? "切换语言，当前为中文" : "Change language, currently English"}>
            {isChinese ? "中文" : "English"}
          </summary>
          <div className="language-menu-options" aria-label={isChinese ? "语言" : "Language"} role="group">
            <Link aria-current={!isChinese ? "page" : undefined} href={englishPath} hrefLang="en">English</Link>
            <Link aria-current={isChinese ? "page" : undefined} href={chinesePath} hrefLang="zh-CN">简体中文</Link>
          </div>
        </details>
        <a
          aria-label={isChinese ? "在 GitHub 查看 Mobazha 文档" : "Mobazha Docs on GitHub"}
          className="github-link"
          href="https://github.com/mobazha/mobazha-docs"
          title={isChinese ? "文档仓库" : "Docs repository"}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.02-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0 1 12 6.1c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
          </svg>
        </a>
      </div>
    </header>
  );
}

export function DocsShell({ activePath, children }: { activePath: string; children: ReactNode }) {
  const isChinese = isChinesePath(activePath);
  const activeGroup = activeNavGroupForPath(activePath);
  const sidebarGroups = sidebarNavGroupsForPath(activePath);
  const hasProductKnowledgeGroups = sidebarGroups.length > 1;
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
              <summary><span>{hasProductKnowledgeGroups ? (isChinese ? "产品" : "Product") : activeGroup.label}</span><b>{activeLabel}</b></summary>
              <nav aria-label={hasProductKnowledgeGroups ? (isChinese ? "产品知识" : "Product knowledge") : activeGroup.label}>
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
              return (
                <details
                  className={`nav-group product-nav-group${isActiveGroup ? " active-group" : ""}`}
                  key={group.label}
                  open
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
