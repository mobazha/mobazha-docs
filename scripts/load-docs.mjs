import { readFileSync } from "node:fs";

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));

export const docs = readJson("app/lib/generated-docs.json");
const navigation = readJson("content/navigation.json");
export const navGroups = navigation.en;
export const publicationNavGroups = [...navigation.en, ...navigation["zh-CN"]];

export function docApplicability(doc) {
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
