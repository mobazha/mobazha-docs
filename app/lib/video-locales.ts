import zhCN from "@/content/video-locales/zh-CN.json";
import type { PublicVideo, VideoCaption, VideoChapter } from "@/app/lib/videos";

export type VideoLocaleCopy = {
  title: string;
  summary: string;
  outcome: string;
  disclosure: string;
  appliesTo: string;
  evidenceLabel: string;
  primaryAction: { label: string; href: string };
  relatedDocs: string[];
  chapters: VideoChapter[];
  transcript: string;
};

const locales: Record<"zh-CN", Record<string, VideoLocaleCopy>> = {
  "zh-CN": zhCN as Record<string, VideoLocaleCopy>,
};

export function demoHubPath(language: "en" | "zh-CN" = "en"): string {
  return language === "zh-CN" ? "/zh/demos" : "/demos";
}

export function demoDetailPath(slug: string, language: "en" | "zh-CN" = "en"): string {
  return `${demoHubPath(language)}/${slug}`;
}

export function demoTranslationPath(activePath?: string): string | undefined {
  if (!activePath) return undefined;
  if (activePath === "/demos") return "/zh/demos";
  if (activePath === "/zh/demos") return "/demos";
  const english = activePath.match(/^\/demos\/([^/]+)$/);
  if (english) return `/zh/demos/${english[1]}`;
  const chinese = activePath.match(/^\/zh\/demos\/([^/]+)$/);
  if (chinese) return `/demos/${chinese[1]}`;
  return undefined;
}

export function localizeVideo(
  video: PublicVideo,
  language: "en" | "zh-CN" = "en",
): PublicVideo {
  if (language === "en") {
    return {
      ...video,
      media: {
        ...video.media,
        captions: preferCaptionLanguage(video.media.captions, "en"),
      },
    };
  }

  const copy = locales["zh-CN"][video.id];
  if (!copy) {
    return {
      ...video,
      language: "zh-CN",
      media: {
        ...video.media,
        captions: preferCaptionLanguage(video.media.captions, "zh-CN"),
      },
      primaryAction: {
        ...video.primaryAction,
        href: chineseDocPath(video.primaryAction.href),
      },
      relatedDocs: video.relatedDocs.map(chineseDocPath),
    };
  }

  return {
    ...video,
    language: "zh-CN",
    title: copy.title,
    summary: copy.summary,
    outcome: copy.outcome,
    disclosure: copy.disclosure,
    appliesTo: copy.appliesTo,
    evidence: {
      ...video.evidence,
      label: copy.evidenceLabel,
    },
    primaryAction: copy.primaryAction,
    relatedDocs: copy.relatedDocs,
    chapters: copy.chapters,
    transcript: copy.transcript,
    media: {
      ...video.media,
      captions: preferCaptionLanguage(video.media.captions, "zh-CN"),
    },
  };
}

function preferCaptionLanguage(
  captions: VideoCaption[] | undefined,
  language: "en" | "zh-CN",
): VideoCaption[] | undefined {
  if (!captions?.length) return captions;
  const hasPreferred = captions.some((caption) => caption.language === language);
  if (!hasPreferred) return captions;
  return captions.map((caption) => ({
    ...caption,
    default: caption.language === language,
  }));
}

function chineseDocPath(path: string): string {
  if (path.startsWith("/zh/") || path === "/zh") return path;
  if (path.startsWith("/")) return `/zh${path}`;
  return path;
}
