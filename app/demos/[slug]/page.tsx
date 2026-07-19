import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/app/components/DocsShell";
import { InteractiveVideo } from "@/app/components/InteractiveVideo";
import { docsBySlug } from "@/app/lib/docs";
import { formatVideoDuration, videos, videosBySlug } from "@/app/lib/videos";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return videos.map((video) => ({ slug: video.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const video = videosBySlug.get((await params).slug);
  if (!video) return {};
  return {
    title: video.title,
    description: video.summary,
    alternates: { canonical: `/demos/${video.slug}` },
    openGraph: {
      title: video.title,
      description: video.summary,
      type: "video.other",
      url: `/demos/${video.slug}`,
      images: [{ url: video.media.poster.url, width: video.media.poster.width, height: video.media.poster.height }],
      videos: [{ url: video.media.video.url }],
    },
  };
}

export default async function VideoDetailPage({ params }: PageProps) {
  const video = videosBySlug.get((await params).slug);
  if (!video) notFound();

  const nextSteps = video.relatedDocs.slice(0, 2);

  return (
    <DocsShell activePath={`/demos/${video.slug}`}>
      <article className="doc-page video-detail">
        <div className="doc-breadcrumb"><Link href="/">Docs</Link><span>/</span><Link href="/demos">Product demos</Link><span>/</span><span>{video.title}</span></div>

        <header className="video-detail-header video-detail-header-compact">
          <div className="doc-title-context">
            <span>{formatVideoDuration(video.durationSeconds)}</span>
          </div>
          <h1>{video.title}</h1>
          <p>{video.outcome}</p>
          <div className="doc-hero-actions">
            <Link className="doc-primary-action" href={video.primaryAction.href}>
              {video.primaryAction.label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <InteractiveVideo video={video} />

        <details className="video-transcript">
          <summary>Read the full story</summary>
          <p>{video.transcript}</p>
        </details>

        {nextSteps.length > 0 && (
          <section className="video-detail-section" aria-labelledby="related-guidance">
            <span>Next</span>
            <h2 id="related-guidance">Keep going</h2>
            <div className="video-related-grid">
              {nextSteps.map((path) => {
                const doc = docsBySlug.get(path.slice(1));
                return (
                  <Link href={path} key={path}>
                    <strong>{doc?.title ?? path}<span aria-hidden="true">→</span></strong>
                    <span>{doc?.summary}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <footer className="video-detail-footer">
          <Link href="/demos">← Browse all product demos</Link>
        </footer>
      </article>
    </DocsShell>
  );
}
