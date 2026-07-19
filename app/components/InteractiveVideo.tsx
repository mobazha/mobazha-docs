"use client";

import { useRef } from "react";
import type { PublicVideo } from "@/app/lib/videos";

type InteractiveVideoProps = {
  video: Pick<PublicVideo, "title" | "media" | "chapters">;
};

export function InteractiveVideo({ video }: InteractiveVideoProps) {
  const player = useRef<HTMLVideoElement>(null);

  function jumpTo(seconds: number) {
    const element = player.current;
    if (!element) return;
    element.currentTime = seconds;
    void element.play();
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <figure className="video-player">
        <video
          ref={player}
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
        <figcaption>Watch the complete story, or jump straight to the part that matters to you.</figcaption>
      </figure>

      <section className="video-detail-section" aria-labelledby="chapters">
        <span>Follow the story</span>
        <h2 id="chapters">What happens</h2>
        <ol className="video-chapters">
          {video.chapters.map((chapter, index) => (
            <li key={chapter.title}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <div>
                {chapter.startSeconds === undefined ? (
                  <strong>{chapter.title}</strong>
                ) : (
                  <button type="button" onClick={() => jumpTo(chapter.startSeconds!)}>
                    {chapter.title}<span>Jump to moment <i aria-hidden="true">→</i></span>
                  </button>
                )}
                <p>{chapter.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
