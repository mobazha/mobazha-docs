import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/app/components/DocsShell";
import { docApplicability, docs, docsBySlug, navGroups } from "@/app/lib/docs";

type PageProps = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = docsBySlug.get(slug.join("/"));
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/${doc.slug}` },
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
  const orderedLinks = navGroups.flatMap((group) => group.links);
  const navigationIndex = orderedLinks.findIndex(([, href]) => href === path);
  const previous = navigationIndex > 0 ? orderedLinks[navigationIndex - 1] : undefined;
  const next = navigationIndex >= 0 && navigationIndex < orderedLinks.length - 1
    ? orderedLinks[navigationIndex + 1]
    : undefined;
  return (
    <DocsShell activePath={path}>
      <div className="doc-breadcrumb"><Link href="/">Docs</Link><span>/</span><span>{key}</span></div>
      <header className="doc-title-block">
        <div className={`doc-status status-${doc.status.toLowerCase()}`}>{doc.status}</div>
        <h1>{doc.title}</h1>
        <p>{doc.summary}</p>
      </header>

      <div className="doc-metadata">
        <div><span>Audience</span><b>{doc.audiences.join(" · ")}</b></div>
        <div><span>Applies to</span><b>{docApplicability(doc)}</b></div>
        <div><span>Last reviewed</span><b>{doc.reviewed}</b></div>
        <div>
          <span>Source</span>
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
            {section.note && <aside className="doc-note"><b>Important</b>{section.note}</aside>}
          </section>
        ))}
      </div>

      {(previous || next) && (
        <nav className="doc-pagination" aria-label="Documentation pages">
          {previous ? <Link href={previous[1]}><small>Previous</small><b>← {previous[0]}</b></Link> : <span />}
          {next ? <Link href={next[1]}><small>Next</small><b>{next[0]} →</b></Link> : <span />}
        </nav>
      )}

      <footer className="doc-footer">
        <span>Found something stale or unclear?</span>
        <a href="https://github.com/mobazha/mobazha-docs/issues/new">Open a documentation issue ↗</a>
      </footer>
    </DocsShell>
  );
}
