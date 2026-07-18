/* eslint-disable @next/next/no-img-element -- documentation images have source-defined dimensions */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CopyCodeButton } from "@/app/components/CopyCodeButton";
import { DocumentHero, FeaturedVisual, PageTableOfContents, sectionId, TrustPanel } from "@/app/components/DocumentExperience";
import { DocsShell } from "@/app/components/DocsShell";
import { PageToolbar } from "@/app/components/PageToolbar";
import { activeNavGroupForPath, docs, docsBySlug, translationPathFor, type DocBlock } from "@/app/lib/docs";

type PageProps = { params: Promise<{ slug: string[] }> };

function InlineMarkdown({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*)/g;
  let cursor = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index));
    if (match[2] && match[3]) {
      const href = match[3];
      parts.push(href.startsWith("/")
        ? <Link href={href} key={`${match.index}-${href}`}>{match[2]}</Link>
        : <a href={href} key={`${match.index}-${href}`}>{match[2]}</a>);
    } else if (match[4]) {
      parts.push(<code key={`${match.index}-code`}>{match[4]}</code>);
    } else if (match[5]) {
      parts.push(<strong key={`${match.index}-strong`}>{match[5]}</strong>);
    }
    cursor = pattern.lastIndex;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

const calloutLabels = {
  en: { important: "Important", warning: "Warning", note: "Note", tip: "Tip" },
  zh: { important: "重要", warning: "警告", note: "说明", tip: "提示" },
};

function DocumentBlock({ block, isChinese }: { block: DocBlock; isChinese: boolean }) {
  if (block.type === "paragraph") return <p><InlineMarkdown text={block.text} /></p>;
  if (block.type === "heading") return <h3><InlineMarkdown text={block.text} /></h3>;
  if (block.type === "unordered-list") {
    return <ul>{block.items.map((item, index) => <li key={`${index}-${item}`}><InlineMarkdown text={item} /></li>)}</ul>;
  }
  if (block.type === "ordered-list") {
    return <ol>{block.items.map((item, index) => <li key={`${index}-${item}`}><InlineMarkdown text={item} /></li>)}</ol>;
  }
  if (block.type === "code") {
    return <div className="doc-code"><div><span>{block.language}</span><CopyCodeButton code={block.code} language={block.language} /></div><pre aria-label={isChinese ? "可横向滚动的代码示例" : "Scrollable code example"} tabIndex={0}><code>{block.code}</code></pre></div>;
  }
  if (block.type === "callout") {
    const label = calloutLabels[isChinese ? "zh" : "en"][block.tone];
    return <aside className={`doc-callout callout-${block.tone}`}><b>{label}</b><p><InlineMarkdown text={block.text} /></p></aside>;
  }
  if (block.type === "table") {
    return (
      <div className="doc-table-wrap" aria-label={isChinese ? "可横向滚动的数据表" : "Scrollable data table"} role="region" tabIndex={0}>
        <table>
          <thead><tr>{block.headers.map((header, index) => <th key={`${index}-${header}`}><InlineMarkdown text={header} /></th>)}</tr></thead>
          <tbody>{block.rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row.join("-")}`}>{row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`}><InlineMarkdown text={cell} /></td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  if (block.type === "image") {
    return <figure className="doc-figure"><img src={block.src} alt={block.alt} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
  }
  if (block.type === "video") {
    return (
      <figure className="doc-figure doc-video">
        <video controls playsInline preload="none" poster={block.poster} src={block.src} aria-label={block.alt} />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  }
  if (block.type === "links") {
    return (
      <div className="doc-links">
        {block.items.map((item, index) => {
          const content = <>
            <b>{item.label}<span>→</span></b>
            {item.description && <small>{item.description}</small>}
          </>;
          return item.href.startsWith("/")
            ? <Link href={item.href} key={`${index}-${item.href}`}>{content}</Link>
            : <a href={item.href} key={`${index}-${item.href}`}>{content}</a>;
        })}
      </div>
    );
  }
  return <hr />;
}

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
    version: "文档版本",
    lastTested: "最后验证",
    authority: "公共知识权威",
    evidence: "实现与政策证据",
    important: "重要",
    previous: "上一页",
    next: "下一页",
    stale: "发现内容过期、不清楚或互相冲突？",
    issue: "提交文档问题 ↗",
    navigation: "文档页面",
    trust: "适用范围与来源",
    estimatedTime: "预计用时",
    onThisPage: "本页内容",
    agentResources: "Agent 资源",
    agentGuide: "指南",
  } : {
    docs: "Docs",
    audience: "Audience",
    appliesTo: "Applies to",
    reviewed: "Last reviewed",
    version: "Document version",
    lastTested: "Last tested",
    authority: "Knowledge authority",
    evidence: "Implementation evidence",
    important: "Important",
    previous: "Previous",
    next: "Next",
    stale: "Found something stale or unclear?",
    issue: "Open a documentation issue ↗",
    navigation: "Documentation pages",
    trust: "Trust, applicability, and sources",
    estimatedTime: "Estimated time",
    onThisPage: "On this page",
    agentResources: "Agent resources",
    agentGuide: "Guide",
  };
  const statusLabel = isChinese
    ? { Current: "当前", Beta: "测试版", Draft: "草案", Deprecated: "已弃用", Historical: "历史" }[doc.status]
    : doc.status;
  const orderedLinks = activeNavGroupForPath(path)?.links ?? [];
  const navigationIndex = orderedLinks.findIndex(([, href]) => href === path);
  const previous = navigationIndex > 0 ? orderedLinks[navigationIndex - 1] : undefined;
  const next = navigationIndex >= 0 && navigationIndex < orderedLinks.length - 1
    ? orderedLinks[navigationIndex + 1]
    : undefined;
  return (
    <DocsShell activePath={path}>
      <div className={`doc-page doc-page-${doc.pageType}`}>
        <div className="doc-page-grid">
          <div className="doc-page-main">
            <div className="doc-breadcrumb"><Link href="/">{labels.docs}</Link><span>/</span><span>{key}</span></div>
            <PageToolbar doc={doc} isChinese={isChinese} />
            <DocumentHero doc={doc} isChinese={isChinese} labels={labels} statusLabel={statusLabel} />
            <TrustPanel doc={doc} labels={labels} />
            <FeaturedVisual doc={doc} isChinese={isChinese} />

            <div className="doc-content">
              {doc.sections.map((section, sectionIndex) => (
                <section id={sectionId(section.heading, sectionIndex)} key={`${sectionIndex}-${section.heading}`}>
                  <h2>{section.heading}</h2>
                  {section.blocks.map((block, index) => <DocumentBlock block={block} isChinese={isChinese} key={`${section.heading}-${index}`} />)}
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
              <div><span>{labels.stale}</span><a href="https://github.com/mobazha/mobazha-docs/issues/new">{labels.issue}</a></div>
              <div><span>{labels.agentResources}</span><a href={isChinese ? "/zh/agents" : "/agents"}>{labels.agentGuide}</a><a href="/llms.txt">llms.txt</a><a href="/docs-index.json">Index</a></div>
            </footer>
          </div>
          <PageTableOfContents doc={doc} label={labels.onThisPage} />
        </div>
      </div>
    </DocsShell>
  );
}
