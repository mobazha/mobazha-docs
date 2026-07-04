import generatedDocuments from "@/app/lib/generated-docs.json";
import navigation from "@/content/navigation.json";
import visualEvidence from "@/visual-evidence.json";

export type DocStatus = "Current" | "Beta" | "Draft" | "Deprecated" | "Historical";

export type DocBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 3; text: string }
  | { type: "unordered-list" | "ordered-list"; items: string[] }
  | { type: "code"; language: string; code: string }
  | { type: "callout"; tone: "important" | "warning" | "note" | "tip"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; alt: string; src: string; caption?: string }
  | {
      type: "links";
      items: Array<{ label: string; href: string; description?: string }>;
    }
  | { type: "separator" };

export type DocSection = {
  heading: string;
  blocks: DocBlock[];
};

export type DocPage = {
  slug: string;
  title: string;
  summary: string;
  status: DocStatus;
  audiences: string[];
  authorityKind: "public-knowledge";
  authorityLabel: string;
  authorityUrl: string;
  evidenceLabel: string;
  evidenceUrl?: string;
  reviewed: string;
  version?: string;
  appliesTo?: string;
  pageType: "concept" | "hub" | "task" | "reference" | "policy";
  lastTested?: string;
  outcome?: string;
  estimatedTime?: string;
  journey?: "start" | "use" | "operate" | "build" | "understand" | "community";
  primaryAction?: {
    label: string;
    href: string;
  };
  featuredVisual?: string;
  language: "en" | "zh-CN";
  translationOf?: string;
  sections: DocSection[];
};

export type NavGroup = {
  label: string;
  links: Array<[label: string, href: string]>;
};

export type VisualEvidence = {
  id: string;
  src: string;
  mobile_src?: string;
  kind: "product-screenshot" | "terminal-output" | "conceptual";
  width: number;
  height: number;
  mobile_width?: number;
  mobile_height?: number;
  alt: string;
  caption: string;
  claim: string;
  privacy_review: "synthetic-only" | "redacted" | "public-demo-reviewed";
  source: string;
  source_revision: string;
  applies_to: string;
  reviewed: string;
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

export function activeNavGroupForPath(path: string): NavGroup | undefined {
  return navGroupsForPath(path).find((group) => group.links.some(([, href]) => href === path));
}

export const docs = generatedDocuments as DocPage[];
export const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));
export const visuals = visualEvidence.visuals as VisualEvidence[];
export const visualsById = new Map(visuals.map((visual) => [visual.id, visual]));

export function translationPathFor(doc: DocPage): string | undefined {
  if (doc.language === "zh-CN") return doc.translationOf ? `/${doc.translationOf}` : undefined;
  const translation = docs.find((candidate) =>
    candidate.translationOf === doc.slug && candidate.language === "zh-CN",
  );
  return translation ? `/${translation.slug}` : undefined;
}
