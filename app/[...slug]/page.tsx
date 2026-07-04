import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/app/components/DocsShell";
import { docApplicability, docs, docsBySlug, navGroupsForPath, translationPathFor } from "@/app/lib/docs";

type PageProps = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = docsBySlug.get(slug.join("/"));
  if (!doc) return {};
  const translationPath = translationPathFor(doc);
  const isChinese = doc.language === "zh-CN";
  return {
    title: doc.title,
    description: doc.summary,
    alternates: {
      canonical: `/${doc.slug}`,
      languages: translationPath
        ? { [isChinese ? "en" : "zh-CN"]: translationPath, [isChinese ? "zh-CN" : "en"]: `/${doc.slug}` }
        : undefined,
    },
    openGraph: {
      title: doc.title,
      description: doc.summary,
      url: `/${doc.slug}`,
      type: "article",
    },
  };
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug } = await params;
  const key = slug.join("/");
  const doc = docsBySlug.get(key);
  if (!doc) notFound();

  const path = `/${key}`;
  const isChinese = doc.language === "zh-CN";
  const labels = isChinese ? {
    docs: "文档",
    audience: "适用读者",
    appliesTo: "适用范围",
    reviewed: "最后审阅",
    source: "来源",
    important: "重要",
    previous: "上一页",
    next: "下一页",
    stale: "发现内容过期、不清楚或互相冲突？",
    issue: "提交文档问题 ↗",
    navigation: "文档页面",
  } : {
    docs: "Docs",
    audience: "Audience",
    appliesTo: "Applies to",
    reviewed: "Last reviewed",
    source: "Source",
    important: "Important",
    previous: "Previous",
    next: "Next",
    stale: "Found something stale or unclear?",
    issue: "Open a documentation issue ↗",
    navigation: "Documentation pages",
  };
  const statusLabel = isChinese
    ? { Current: "当前", Beta: "测试版", Draft: "草案" }[doc.status]
    : doc.status;
  const navGroups = navGroupsForPath(path);
  const orderedLinks = navGroups.flatMap((group) => group.links);
  const navigationIndex = orderedLinks.findIndex(([, href]) => href === path);
  const previous = navigationIndex > 0 ? orderedLinks[navigationIndex - 1] : undefined;
  const next = navigationIndex >= 0 && navigationIndex < orderedLinks.length - 1
    ? orderedLinks[navigationIndex + 1]
    : undefined;
  return (
    <DocsShell activePath={path}>
      <div className="doc-breadcrumb"><Link href="/">{labels.docs}</Link><span>/</span><span>{key}</span></div>
      <header className="doc-title-block">
        <div className={`doc-status status-${doc.status.toLowerCase()}`}>{statusLabel}</div>
        <h1>{doc.title}</h1>
        <p>{doc.summary}</p>
      </header>

      <div className="doc-metadata">
        <div><span>{labels.audience}</span><b>{doc.audiences.join(" · ")}</b></div>
        <div><span>{labels.appliesTo}</span><b>{docApplicability(doc)}</b></div>
        <div><span>{labels.reviewed}</span><b>{doc.reviewed}</b></div>
        <div>
          <span>{labels.source}</span>
          {doc.sourceUrl ? <a href={doc.sourceUrl}>{doc.sourceLabel} ↗</a> : <b>{doc.sourceLabel}</b>}
        </div>
      </div>

      <div className="doc-content">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && (
              <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            )}
            {section.code && <pre><code>{section.code}</code></pre>}
            {section.links && (
              <div className="doc-links">
                {section.links.map((link) => (
                  <Link href={link.href} key={link.href}>
                    <b>{link.label}<span>→</span></b>
                    {link.description && <small>{link.description}</small>}
                  </Link>
                ))}
              </div>
            )}
            {section.note && <aside className="doc-note"><b>{labels.important}</b>{section.note}</aside>}
          </section>
        ))}
      </div>

      {(previous || next) && (
        <nav className="doc-pagination" aria-label={labels.navigation}>
          {previous ? <Link href={previous[1]}><small>{labels.previous}</small><b>← {previous[0]}</b></Link> : <span />}
          {next ? <Link href={next[1]}><small>{labels.next}</small><b>{next[0]} →</b></Link> : <span />}
        </nav>
      )}

      <footer className="doc-footer">
        <span>{labels.stale}</span>
        <a href="https://github.com/mobazha/mobazha-docs/issues/new">{labels.issue}</a>
      </footer>
    </DocsShell>
  );
}
