/* eslint-disable @next/next/no-img-element -- R2 catalog assets have registry-governed dimensions and digests */
import Link from "next/link";
import { formatVideoDuration, type PublicVideo } from "@/app/lib/videos";

type CatalogVariant = "default" | "featured";

export function VideoCard({ video, variant = "default" }: { video: PublicVideo; variant?: CatalogVariant }) {
  const thumb = video.media.poster;
  return (
    <Link className={`video-card${variant === "featured" ? " video-card-featured" : ""}`} href={`/demos/${video.slug}`}>
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

export function VideoCatalog({ items, variant = "default" }: { items: PublicVideo[]; variant?: CatalogVariant }) {
  return (
    <div className={`video-grid${variant === "featured" ? " video-grid-featured" : ""}`}>
      {items.map((video) => <VideoCard key={video.id} video={video} variant={variant} />)}
    </div>
  );
}

export function ContextualVideo({ video }: { video: PublicVideo }) {
  const thumb = video.media.poster;
  return (
    <aside className="contextual-video" aria-label={`Related video: ${video.title}`}>
      <Link href={`/demos/${video.slug}`}>
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
          <span><b>Watch the walkthrough</b><em>See it in action</em></span>
          <strong>{video.title}</strong>
          <span>{video.outcome}</span>
          <small>Watch the journey and see what happens next <i aria-hidden="true">→</i></small>
        </span>
      </Link>
    </aside>
  );
}
