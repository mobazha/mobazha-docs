/* eslint-disable @next/next/no-img-element -- R2 catalog assets have registry-governed dimensions and digests */
import Link from "next/link";
import { formatVideoDuration, type PublicVideo, videoKindLabel } from "@/app/lib/videos";

export function VideoCard({ video }: { video: PublicVideo }) {
  return (
    <Link className="video-card" href={`/demos/${video.slug}`}>
      <span className="video-card-media">
        <img
          alt=""
          height={video.media.cover.height}
          loading="lazy"
          src={video.media.cover.url}
          width={video.media.cover.width}
        />
        <span className="video-duration">{formatVideoDuration(video.durationSeconds)}</span>
      </span>
      <span className="video-card-body">
        <span className="video-card-eyebrow">
          <b>{videoKindLabel(video.kind)}</b>
          <span>{video.status}</span>
        </span>
        <strong>{video.title}</strong>
        <span>{video.summary}</span>
        <small>{video.primaryPersona} · {video.goals.join(" · ")}</small>
      </span>
    </Link>
  );
}

export function VideoCatalog({ items }: { items: PublicVideo[] }) {
  return <div className="video-grid">{items.map((video) => <VideoCard key={video.id} video={video} />)}</div>;
}
