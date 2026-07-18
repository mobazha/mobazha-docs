import catalog from "@/content/videos.json";

export type VideoKind = "story" | "task" | "proof" | "release";
export type VideoStatus = "Current" | "Beta" | "Preview";
export type VideoPersona = "Buyer" | "Seller" | "Operator" | "Promoter" | "Developer" | "Evaluator";
export type VideoGoal = "Sell" | "Buy" | "Pay" | "Deliver" | "Recover" | "Grow" | "Operate" | "Build";
export type ProductPromise = "Own" | "Connect" | "Trade" | "Extend";

export type VideoAsset = {
  url: string;
  sha256: string;
  width?: number;
  height?: number;
};

export type VideoChapter = {
  startSeconds?: number;
  title: string;
  description: string;
};

export type PublicVideo = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  kind: VideoKind;
  status: VideoStatus;
  language: "en" | "zh-CN";
  primaryPersona: VideoPersona;
  personas: VideoPersona[];
  goals: VideoGoal[];
  productPromises: ProductPromise[];
  durationSeconds: number;
  featured: boolean;
  outcome: string;
  disclosure: string;
  media: {
    video: VideoAsset;
    cover: VideoAsset;
    poster: VideoAsset;
  };
  recordedAt: string;
  reviewed: string;
  appliesTo: string;
  evidence: { label: string; url: string };
  primaryAction: { label: string; href: string };
  relatedDocs: string[];
  chapters: VideoChapter[];
  transcript: string;
};

export type VideoCatalog = {
  schema_version: "1.0";
  reviewed: string;
  videos: PublicVideo[];
};

export const videoCatalog = catalog as VideoCatalog;
export const videos = videoCatalog.videos;
export const videosBySlug = new Map(videos.map((video) => [video.slug, video]));
export const featuredVideos = videos.filter((video) => video.featured);

export function formatVideoDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function videoKindLabel(kind: VideoKind): string {
  return {
    story: "Story demo",
    task: "Task walkthrough",
    proof: "Technical proof",
    release: "Release clip",
  }[kind];
}
