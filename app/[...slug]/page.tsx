import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/app/components/DocsShell";
import { docs, docsBySlug } from "@/app/lib/docs";

type PageProps = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = docsBySlug.get(slug.join("/"));
  if (!doc) return {};
  return { title: `${doc.title} · Mobazha Docs`, description: doc.summary };
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug } = await params;
  const key = slug.join("/");
  const doc = docsBySlug.get(key);
  if (!doc) notFound();

  const path = `/${key}`;
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
            {section.note && <aside className="doc-note"><b>Important</b>{section.note}</aside>}
          </section>
        ))}
      </div>

      <footer className="doc-footer">
        <span>Found something stale or unclear?</span>
        <a href="https://github.com/mobazha/mobazha/issues">Open a documentation issue ↗</a>
      </footer>
    </DocsShell>
  );
}
