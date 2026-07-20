"use client";

import { useRef } from "react";
import type { PublicVideo } from "@/app/lib/videos";

type InteractiveVideoProps = {
  video: Pick<PublicVideo, "title" | "media" | "chapters">;
  language?: "en" | "zh-CN";
};

function formatChapterTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function InteractiveVideo({ video, language = "en" }: InteractiveVideoProps) {
  const player = useRef<HTMLVideoElement>(null);
  const isChinese = language === "zh-CN";

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
          aria-label={isChinese ? `${video.title} 产品演示` : `${video.title} product demo`}
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
              srcLang={caption.language === "zh-CN" ? "zh-CN" : caption.language}
            />
          ))}
        </video>
      </figure>

      <section className="video-detail-section video-chapters-section" aria-labelledby="chapters">
        <span>{isChinese ? "章节" : "Chapters"}</span>
        <h2 id="chapters">{isChinese ? "跳到某一刻" : "Jump to a moment"}</h2>
        <ol className="video-chapters">
          {video.chapters.map((chapter) => (
            <li key={chapter.title}>
              {chapter.startSeconds === undefined ? (
                <strong>{chapter.title}</strong>
              ) : (
                <button type="button" onClick={() => jumpTo(chapter.startSeconds!)}>
                  <time dateTime={`PT${chapter.startSeconds}S`}>{formatChapterTime(chapter.startSeconds)}</time>
                  <strong>{chapter.title}</strong>
                </button>
              )}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
