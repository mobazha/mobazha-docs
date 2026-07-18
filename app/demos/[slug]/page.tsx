import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/app/components/DocsShell";
import { docsBySlug } from "@/app/lib/docs";
import { formatVideoDuration, videoKindLabel, videos, videosBySlug } from "@/app/lib/videos";

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

  return (
    <DocsShell activePath={`/demos/${video.slug}`}>
      <article className="doc-page video-detail">
        <div className="doc-breadcrumb"><Link href="/">Docs</Link><span>/</span><Link href="/demos">demos</Link><span>/</span><span>{video.id}</span></div>
        <header className="video-detail-header">
          <div className="doc-title-context">
            <span className={`doc-status status-${video.status.toLowerCase()}`}>{video.status}</span>
            <span>{videoKindLabel(video.kind)} · {formatVideoDuration(video.durationSeconds)}</span>
          </div>
          <h1>{video.title}</h1>
          <p>{video.summary}</p>
          <div className="doc-hero-actions">
            <Link className="doc-primary-action" href={video.primaryAction.href}>{video.primaryAction.label}<span aria-hidden="true">→</span></Link>
            <span className="doc-time"><b>Primary viewer</b>{video.primaryPersona}</span>
          </div>
        </header>

        <figure className="video-player">
          <video
            aria-label={`${video.title} product demo`}
            controls
            playsInline
            poster={video.media.poster.url}
            preload="metadata"
            src={video.media.video.url}
          >
            {video.media.captions?.map((caption) => (
              <track
                default={caption.default}
                key={`${caption.language}-${caption.kind}`}
                kind={caption.kind}
                label={caption.label}
                src={caption.url}
                srcLang={caption.language}
              />
            ))}
          </video>
          <figcaption>{video.disclosure}</figcaption>
        </figure>

        <section className="video-outcome" aria-labelledby="outcome">
          <span>Visible result</span>
          <h2 id="outcome">Outcome</h2>
          <p>{video.outcome}</p>
        </section>

        <dl className="video-metadata">
          <div><dt>Duration</dt><dd>{formatVideoDuration(video.durationSeconds)}</dd></div>
          <div><dt>Personas</dt><dd>{video.personas.join(" · ")}</dd></div>
          <div><dt>Recorded</dt><dd>{video.recordedAt}</dd></div>
          <div><dt>Applies to</dt><dd>{video.appliesTo}</dd></div>
          <div><dt>Evidence</dt><dd><a href={video.evidence.url}>{video.evidence.label} ↗</a></dd></div>
          <div><dt>Registry</dt><dd><a href="/videos.json">Video {video.id} metadata ↗</a></dd></div>
        </dl>

        <section className="video-detail-section" aria-labelledby="chapters">
          <span>What you will see</span>
          <h2 id="chapters">Chapters</h2>
          <ol className="video-chapters">
            {video.chapters.map((chapter, index) => (
              <li key={chapter.title}><b>{String(index + 1).padStart(2, "0")}</b><div><strong>{chapter.title}</strong><p>{chapter.description}</p></div></li>
            ))}
          </ol>
        </section>

        <details className="video-transcript">
          <summary>Read transcript</summary>
          <p>{video.transcript}</p>
        </details>

        <section className="video-detail-section" aria-labelledby="related-guidance">
          <span>Continue with the product</span>
          <h2 id="related-guidance">Related guidance</h2>
          <div className="video-related-grid">
            {video.relatedDocs.map((path) => {
              const doc = docsBySlug.get(path.slice(1));
              return <Link href={path} key={path}><strong>{doc?.title ?? path}<span aria-hidden="true">→</span></strong><span>{doc?.summary}</span></Link>;
            })}
          </div>
        </section>

        <footer className="video-detail-footer">
          <Link href="/demos">← Browse all product demos</Link>
          <span>Reviewed {video.reviewed}</span>
        </footer>
      </article>
    </DocsShell>
  );
}
