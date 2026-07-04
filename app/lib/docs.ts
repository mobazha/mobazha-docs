import generatedDocuments from "@/app/lib/generated-docs.json";
import navigation from "@/content/navigation.json";

export type DocStatus = "Current" | "Beta" | "Draft" | "Deprecated" | "Historical";

export type DocSection = {
  heading: string;
  body?: string[];
  bullets?: string[];
  code?: string;
  note?: string;
  links?: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
};

export type DocPage = {
  slug: string;
  title: string;
  summary: string;
  status: DocStatus;
  audiences: string[];
  sourceLabel: string;
  sourceUrl?: string;
  reviewed: string;
  version?: string;
  appliesTo?: string;
  language: "en" | "zh-CN";
  translationOf?: string;
  sections: DocSection[];
};

export type NavGroup = {
  label: string;
  links: Array<[label: string, href: string]>;
};

export function docApplicability(doc: DocPage): string {
  if (doc.appliesTo) return doc.appliesTo;
  if (doc.language === "zh-CN") {
    if (doc.status === "Historical") return "历史背景，不代表当前行为或政策";
    if (doc.status === "Deprecated") return "已弃用，请使用页面链接的替代内容";
    if (doc.status === "Draft") return "设计方向，不代表已交付承诺";
    if (doc.status === "Beta") return "Mobazha v0.3 候选版本";
    return "当前公开项目政策或服务界面";
  }
  if (doc.status === "Historical") return "Historical context; not current behavior or policy";
  if (doc.status === "Deprecated") return "Deprecated; use the replacement linked from this page";
  if (doc.status === "Draft") return "Design direction; not a shipped guarantee";
  if (doc.status === "Beta") return "Mobazha v0.3 release candidate";
  return "Current public project policy or service surface";
}

export const englishNavGroups = navigation.en as NavGroup[];
export const chineseNavGroups = navigation["zh-CN"] as NavGroup[];
export const navGroups = englishNavGroups;
export const publicationNavGroups = [...englishNavGroups, ...chineseNavGroups];

export function navGroupsForPath(path: string): NavGroup[] {
  return path.startsWith("/zh/") ? chineseNavGroups : englishNavGroups;
}

export const docs = generatedDocuments as DocPage[];
export const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));

export function translationPathFor(doc: DocPage): string | undefined {
  if (doc.language === "zh-CN") return doc.translationOf ? `/${doc.translationOf}` : undefined;
  const translation = docs.find((candidate) =>
    candidate.translationOf === doc.slug && candidate.language === "zh-CN",
  );
  return translation ? `/${translation.slug}` : undefined;
}
