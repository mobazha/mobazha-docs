/* eslint-disable @next/next/no-img-element -- R2 catalog assets have registry-governed dimensions and digests */
import Link from "next/link";
import { formatVideoDuration, type PublicVideo } from "@/app/lib/videos";

export function VideoCard({ video }: { video: PublicVideo }) {
  const thumb = video.media.cover;
  return (
    <Link className="video-card" href={`/demos/${video.slug}`}>
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
        <span className="video-card-eyebrow">
          <b>{video.primaryPersona} journey</b>
          <span>Watch demo</span>
        </span>
        <strong>{video.title}</strong>
        <span>{video.summary}</span>
        <small>See the full journey <i aria-hidden="true">→</i></small>
      </span>
    </Link>
  );
}

export function VideoCatalog({ items }: { items: PublicVideo[] }) {
  return <div className="video-grid">{items.map((video) => <VideoCard key={video.id} video={video} />)}</div>;
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
