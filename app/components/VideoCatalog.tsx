/* eslint-disable @next/next/no-img-element -- R2 catalog assets have registry-governed dimensions and digests */
import Link from "next/link";
import { demoDetailPath } from "@/app/lib/video-locales";
import { formatVideoDuration, type PublicVideo } from "@/app/lib/videos";

type CatalogVariant = "default" | "featured";
type CatalogLanguage = "en" | "zh-CN";

const contextualCopy = {
  en: {
    watch: "Watch the walkthrough",
    see: "See it in action",
    next: "Watch the journey and see what happens next",
  },
  "zh-CN": {
    watch: "观看演示",
    see: "看实际流程",
    next: "观看完整旅程，并了解下一步",
  },
} as const;

export function VideoCard({
  video,
  variant = "default",
  language = "en",
}: {
  video: PublicVideo;
  variant?: CatalogVariant;
  language?: CatalogLanguage;
}) {
  const thumb = video.media.poster;
  return (
    <Link
      className={`video-card${variant === "featured" ? " video-card-featured" : ""}`}
      href={demoDetailPath(video.slug, language)}
    >
      <span className="video-card-media">
        <img
          alt=""
          height={thumb.height}
          loading="lazy"
          src={thumb.url}
          width={thumb.width}
        />
        <span className="video-play" aria-hidden="true">▶</span>
        <span className="video-duration">{formatVideoDuration(video.durationSeconds)}</span>
      </span>
      <span className="video-card-body">
        <strong>{video.title}</strong>
        <span>{video.outcome}</span>
      </span>
    </Link>
  );
}

export function VideoCatalog({
  items,
  variant = "default",
  language = "en",
}: {
  items: PublicVideo[];
  variant?: CatalogVariant;
  language?: CatalogLanguage;
}) {
  return (
    <div className={`video-grid${variant === "featured" ? " video-grid-featured" : ""}`}>
      {items.map((video) => (
        <VideoCard key={video.id} video={video} variant={variant} language={language} />
      ))}
    </div>
  );
}

export function ContextualVideo({
  video,
  language = "en",
}: {
  video: PublicVideo;
  language?: CatalogLanguage;
}) {
  const thumb = video.media.poster;
  const copy = contextualCopy[language];
  return (
    <aside className="contextual-video" aria-label={language === "zh-CN" ? `相关视频：${video.title}` : `Related video: ${video.title}`}>
      <Link href={demoDetailPath(video.slug, language)}>
        <span className="contextual-video-media">
          <img
            alt=""
            height={thumb.height}
            loading="lazy"
            src={thumb.url}
            width={thumb.width}
          />
          <span className="video-play" aria-hidden="true">▶</span>
          <span className="video-duration">{formatVideoDuration(video.durationSeconds)}</span>
        </span>
        <span className="contextual-video-copy">
          <span><b>{copy.watch}</b><em>{copy.see}</em></span>
          <strong>{video.title}</strong>
          <span>{video.outcome}</span>
          <small>{copy.next} <i aria-hidden="true">→</i></small>
        </span>
      </Link>
    </aside>
  );
}
