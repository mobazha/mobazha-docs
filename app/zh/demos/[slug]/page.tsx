import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/app/components/DocsShell";
import { InteractiveVideo } from "@/app/components/InteractiveVideo";
import { docsBySlug } from "@/app/lib/docs";
import { demoDetailPath, demoHubPath, localizeVideo } from "@/app/lib/video-locales";
import { formatVideoDuration, videos, videosBySlug } from "@/app/lib/videos";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return videos.map((video) => ({ slug: video.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const source = videosBySlug.get((await params).slug);
  if (!source) return {};
  const video = localizeVideo(source, "zh-CN");
  return {
    title: video.title,
    description: video.summary,
    alternates: {
      canonical: demoDetailPath(video.slug, "zh-CN"),
      languages: {
        en: demoDetailPath(video.slug, "en"),
        "zh-CN": demoDetailPath(video.slug, "zh-CN"),
      },
    },
    openGraph: {
      title: video.title,
      description: video.summary,
      type: "video.other",
      url: demoDetailPath(video.slug, "zh-CN"),
      images: [{ url: video.media.poster.url, width: video.media.poster.width, height: video.media.poster.height }],
      videos: [{ url: video.media.video.url }],
    },
  };
}

export default async function ChineseVideoDetailPage({ params }: PageProps) {
  const source = videosBySlug.get((await params).slug);
  if (!source) notFound();
  const video = localizeVideo(source, "zh-CN");
  const nextSteps = video.relatedDocs.slice(0, 2);

  return (
    <DocsShell activePath={demoDetailPath(video.slug, "zh-CN")}>
      <article className="doc-page video-detail">
        <div className="doc-breadcrumb">
          <Link href="/zh">文档</Link>
          <span>/</span>
          <Link href={demoHubPath("zh-CN")}>产品演示</Link>
          <span>/</span>
          <span>{video.title}</span>
        </div>

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

        <InteractiveVideo video={video} language="zh-CN" />

        <details className="video-transcript">
          <summary>阅读完整故事</summary>
          <p>{video.transcript}</p>
        </details>

        {nextSteps.length > 0 && (
          <section className="video-detail-section" aria-labelledby="related-guidance">
            <span>下一步</span>
            <h2 id="related-guidance">继续了解</h2>
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
          <Link href={demoHubPath("zh-CN")}>← 浏览全部产品演示</Link>
        </footer>
      </article>
    </DocsShell>
  );
}
