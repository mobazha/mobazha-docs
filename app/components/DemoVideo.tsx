"use client";

import { useState } from "react";

type DemoVideoProps = {
  src: string;
  poster?: string;
  alt: string;
};

export function DemoVideo({ src, poster, alt }: DemoVideoProps) {
  const [playing, setPlaying] = useState(false);

  if (playing || !poster) {
    return (
      <video
        controls
        autoPlay={playing}
        playsInline
        preload={playing ? "auto" : "metadata"}
        poster={poster}
        src={src}
        aria-label={alt}
      />
    );
  }

  return (
    <button
      type="button"
      className="doc-video-cover"
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${alt}`}
    >
      <img src={poster} alt={alt} />
      <span className="doc-video-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M8 5.14v13.72L19 12 8 5.14z" />
        </svg>
      </span>
    </button>
  );
}
