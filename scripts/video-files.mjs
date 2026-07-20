import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const digestPattern = /^[a-f0-9]{64}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const mediaPrefix = "https://media.mobazha.org/";
const captionPrefixes = [mediaPrefix, "https://docs.mobazha.org/captions/"];
const allowedKinds = new Set(["story", "task", "proof", "release"]);
const allowedStatuses = new Set(["Current", "Beta", "Preview"]);
const allowedLanguages = new Set(["en", "zh-CN"]);
const allowedPersonas = new Set(["Buyer", "Seller", "Moderator", "Operator", "Promoter", "Developer", "Evaluator"]);
const allowedGoals = new Set(["Sell", "Buy", "Pay", "Deliver", "Recover", "Grow", "Operate", "Build"]);
const allowedPromises = new Set(["Own", "Connect", "Trade", "Extend"]);

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isUniqueStringArray = (value) =>
  Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString) && new Set(value).size === value.length;

function validateEnumArray(value, allowed, label, fail) {
  if (!isUniqueStringArray(value)) {
    fail(`${label} must be a non-empty array of unique strings`);
    return;
  }
  for (const item of value) if (!allowed.has(item)) fail(`${label} contains unsupported value ${item}`);
}

function validateAsset(asset, label, requireDimensions, fail) {
  if (!asset || typeof asset !== "object" || Array.isArray(asset)) {
    fail(`${label} is missing`);
    return;
  }
  if (!asset.url?.startsWith(mediaPrefix)) fail(`${label} must use ${mediaPrefix}`);
  if (!digestPattern.test(asset.sha256 ?? "")) fail(`${label} has an invalid sha256`);
  if (requireDimensions) {
    if (!Number.isInteger(asset.width) || asset.width < 1) fail(`${label} has an invalid width`);
    if (!Number.isInteger(asset.height) || asset.height < 1) fail(`${label} has an invalid height`);
  }
}

export function validateVideoCatalog(catalog, { knownDocPaths } = {}) {
  const failures = [];
  const fail = (message) => failures.push(message);
  if (!catalog || typeof catalog !== "object" || Array.isArray(catalog)) {
    return ["video catalog must be an object"];
  }
  if (catalog.schema_version !== "1.0") fail("video catalog schema_version must be 1.0");
  if (!datePattern.test(catalog.reviewed ?? "")) fail("video catalog reviewed date is invalid");
  if (!Array.isArray(catalog.videos) || catalog.videos.length === 0) {
    fail("video catalog must contain at least one video");
    return failures;
  }

  const ids = new Set();
  const languageSlugs = new Set();
  let featuredCount = 0;
  for (const [index, video] of catalog.videos.entries()) {
    const label = `video[${index}]${video?.id ? ` ${video.id}` : ""}`;
    if (!video || typeof video !== "object" || Array.isArray(video)) {
      fail(`${label} must be an object`);
      continue;
    }
    if (!/^\d{4}$/.test(video.id ?? "") || ids.has(video.id)) fail(`${label} has a duplicate or invalid id`);
    ids.add(video.id);
    const languageSlug = `${video.language ?? "en"}:${video.slug ?? ""}`;
    if (!slugPattern.test(video.slug ?? "") || languageSlugs.has(languageSlug)) {
      fail(`${label} has a duplicate or invalid slug`);
    }
    languageSlugs.add(languageSlug);
    if (video.translationOf !== undefined) {
      if (!/^\d{4}$/.test(video.translationOf)) fail(`${label} has an invalid translationOf`);
    }

    for (const field of ["title", "summary", "outcome", "disclosure", "appliesTo", "transcript"]) {
      if (!isNonEmptyString(video[field])) fail(`${label} is missing ${field}`);
    }
    if ((video.transcript ?? "").trim().length < 80) fail(`${label} transcript is too short`);
    if (!allowedKinds.has(video.kind)) fail(`${label} has unsupported kind ${video.kind ?? "<missing>"}`);
    if (!allowedStatuses.has(video.status)) fail(`${label} has unsupported status ${video.status ?? "<missing>"}`);
    if (!allowedLanguages.has(video.language)) fail(`${label} has unsupported language ${video.language ?? "<missing>"}`);
    if (!allowedPersonas.has(video.primaryPersona)) fail(`${label} has unsupported primaryPersona ${video.primaryPersona ?? "<missing>"}`);
    validateEnumArray(video.personas, allowedPersonas, `${label} personas`, fail);
    validateEnumArray(video.goals, allowedGoals, `${label} goals`, fail);
    validateEnumArray(video.productPromises, allowedPromises, `${label} productPromises`, fail);
    if (Array.isArray(video.personas) && !video.personas.includes(video.primaryPersona)) {
      fail(`${label} primaryPersona must be included in personas`);
    }
    if (!Number.isInteger(video.durationSeconds) || video.durationSeconds < 1) fail(`${label} has an invalid durationSeconds`);
    if (typeof video.featured !== "boolean") fail(`${label} has an invalid featured flag`);
    if (video.featured) featuredCount += 1;

    validateAsset(video.media?.video, `${label} video asset`, false, fail);
    validateAsset(video.media?.cover, `${label} cover asset`, true, fail);
    validateAsset(video.media?.poster, `${label} poster asset`, true, fail);
    if (video.media?.captions !== undefined) {
      if (!Array.isArray(video.media.captions) || video.media.captions.length === 0) {
        fail(`${label} captions must be a non-empty array when present`);
      } else {
        let defaultCaptionCount = 0;
        const captionKeys = new Set();
        for (const [captionIndex, caption] of video.media.captions.entries()) {
          const captionLabel = `${label} caption[${captionIndex}]`;
          if (!captionPrefixes.some((prefix) => caption?.url?.startsWith(prefix))) {
            fail(`${captionLabel} must use ${captionPrefixes.join(" or ")}`);
          }
          if (!allowedLanguages.has(caption?.language)) fail(`${captionLabel} has an unsupported language`);
          if (!isNonEmptyString(caption?.label)) fail(`${captionLabel} is missing label`);
          if (!new Set(["captions", "subtitles"]).has(caption?.kind)) fail(`${captionLabel} has an unsupported kind`);
          if (caption?.default === true) defaultCaptionCount += 1;
          const captionKey = `${caption?.language}:${caption?.kind}`;
          if (captionKeys.has(captionKey)) fail(`${captionLabel} duplicates ${captionKey}`);
          captionKeys.add(captionKey);
        }
        if (defaultCaptionCount > 1) fail(`${label} has more than one default caption track`);
      }
    }
    if (!datePattern.test(video.recordedAt ?? "")) fail(`${label} recordedAt is invalid`);
    if (!datePattern.test(video.reviewed ?? "")) fail(`${label} reviewed is invalid`);
    if (datePattern.test(video.recordedAt ?? "") && datePattern.test(video.reviewed ?? "") && video.recordedAt > video.reviewed) {
      fail(`${label} was reviewed before it was recorded`);
    }
    if (datePattern.test(video.reviewed ?? "") && datePattern.test(catalog.reviewed ?? "") && video.reviewed > catalog.reviewed) {
      fail(`${label} is newer than the catalog review`);
    }

    if (!isNonEmptyString(video.evidence?.label) || !video.evidence?.url?.startsWith("https://")) {
      fail(`${label} has invalid evidence`);
    }
    if (!isNonEmptyString(video.primaryAction?.label) || !video.primaryAction?.href?.startsWith("/")) {
      fail(`${label} has an invalid primaryAction`);
    }
    if (!isUniqueStringArray(video.relatedDocs) || video.relatedDocs.some((path) => !path.startsWith("/"))) {
      fail(`${label} has invalid relatedDocs`);
    } else if (knownDocPaths) {
      for (const path of video.relatedDocs) if (!knownDocPaths.has(path)) fail(`${label} points to unknown related document ${path}`);
      if (!knownDocPaths.has(video.primaryAction.href)) fail(`${label} primaryAction points to unknown document ${video.primaryAction.href}`);
    }

    if (!Array.isArray(video.chapters) || video.chapters.length === 0) {
      fail(`${label} must contain chapters`);
    } else {
      let previousStart = -1;
      for (const [chapterIndex, chapter] of video.chapters.entries()) {
        if (!isNonEmptyString(chapter?.title) || !isNonEmptyString(chapter?.description)) {
          fail(`${label} chapter[${chapterIndex}] is incomplete`);
        }
        if (chapter?.startSeconds !== undefined) {
          if (!Number.isInteger(chapter.startSeconds) || chapter.startSeconds < 0 || chapter.startSeconds <= previousStart) {
            fail(`${label} chapter[${chapterIndex}] has an invalid startSeconds`);
          }
          if (chapter.startSeconds >= video.durationSeconds) fail(`${label} chapter[${chapterIndex}] starts after the video ends`);
          previousStart = chapter.startSeconds;
        }
      }
    }
  }
  if (featuredCount > 3) fail(`video catalog has ${featuredCount} featured videos; maximum is 3`);
  return failures;
}

export function loadVideoCatalog(options = {}) {
  const catalog = JSON.parse(readFileSync(new URL("content/videos.json", root), "utf8"));
  const failures = validateVideoCatalog(catalog, options);
  if (failures.length) throw new Error(`invalid video catalog:\n- ${failures.join("\n- ")}`);
  return catalog;
}

export function videoPath(video, language = video.language ?? "en") {
  return language === "zh-CN" ? `/zh/demos/${video.slug}` : `/demos/${video.slug}`;
}

export function loadVideoLocales() {
  return JSON.parse(readFileSync(new URL("content/video-locales/zh-CN.json", root), "utf8"));
}

export function localizeVideoForPublication(video, language, locales = loadVideoLocales()) {
  if (language !== "zh-CN") return video;
  const copy = locales[video.id];
  if (!copy) {
    return {
      ...video,
      language: "zh-CN",
      primaryAction: {
        ...video.primaryAction,
        href: video.primaryAction.href.startsWith("/zh")
          ? video.primaryAction.href
          : `/zh${video.primaryAction.href}`,
      },
      relatedDocs: video.relatedDocs.map((path) => (path.startsWith("/zh") ? path : `/zh${path}`)),
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
  };
}

export function videoSearchText(video) {
  return [
    video.title,
    video.summary,
    video.outcome,
    video.disclosure,
    video.primaryPersona,
    ...video.personas,
    ...video.goals,
    ...video.productPromises,
    ...video.chapters.flatMap((chapter) => [chapter.title, chapter.description]),
    video.transcript,
  ].join(" ");
}
