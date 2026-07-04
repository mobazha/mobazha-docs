import { existsSync, readFileSync } from "node:fs";
import { docApplicability, docs, publicationNavGroups as navGroups } from "./load-docs.mjs";
import { renderPublication } from "./publication.mjs";
import { documentLinks, documentText, loadContentDocuments, renderDocumentRegistry } from "./content-files.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const failures = [];
const fail = (message) => failures.push(message);
const canonicalBaseUrl = "https://docs.mobazha.org";
const sectionId = (heading, index) => {
  const normalized = heading
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || `section-${index + 1}`;
};
const retiredPolicyEvidence = new Set([
  "https://github.com/mobazha/mobazha/blob/main/docs/project/COMPATIBILITY.md",
  "https://github.com/mobazha/mobazha/blob/main/docs/project/FEES_AND_PAID_SERVICES.md",
  "https://github.com/mobazha/mobazha/blob/main/docs/project/FEES_AND_PAID_SERVICES_ZH.md",
  "https://github.com/mobazha/mobazha/blob/main/docs/project/OEM_DISTRIBUTION.md",
  "https://github.com/mobazha/mobazha/blob/main/docs/project/PUBLIC_HISTORY.md",
  "https://github.com/mobazha/mobazha/blob/main/docs/project/RELEASE_SCOPE.md",
  "https://github.com/mobazha/mobazha-unified/blob/main/docs/architecture/RUNTIME_CAPABILITIES.md",
  "https://github.com/mobazha/mobazha-unified/blob/main/docs/TOKEN_STANDARD_GUIDE.md",
]);

const expectedRegistry = renderDocumentRegistry(loadContentDocuments());
if (read("app/lib/generated-docs.json") !== expectedRegistry) {
  fail("app/lib/generated-docs.json is stale; run npm run generate:content");
}

const sources = JSON.parse(read("sources.json"));
const sourceSchema = read("sources.schema.json");
const agentEvals = JSON.parse(read("agent-evals.json"));
const agentEvalSchema = read("agent-evals.schema.json");
const visualEvidence = JSON.parse(read("visual-evidence.json"));
const visualEvidenceSchema = read("visual-evidence.schema.json");
const expectedFiles = renderPublication({ docs, navGroups, docApplicability, sources, sourceSchema, agentEvals, agentEvalSchema, visualEvidence, visualEvidenceSchema });
const paths = new Set(docs.map((doc) => `/${doc.slug}`));
const allowedInternal = new Set([
  "/",
  "/zh",
  ...paths,
  "/llms.txt",
  "/llms-full.txt",
  "/docs-index.json",
  "/sources.json",
  "/sources.schema.json",
  "/agent-evals.json",
  "/agent-evals.schema.json",
  "/visual-evidence.json",
  "/visual-evidence.schema.json",
  "/.well-known/mobazha-docs.json",
  "/openapi.json",
  "/api-reference",
  "/sitemap.xml",
]);

for (const [path, expected] of Object.entries(expectedFiles)) {
  let actual;
  try {
    actual = read(path);
  } catch {
    fail(`${path} is missing; run npm run generate:content`);
    continue;
  }
  if (actual !== expected) fail(`${path} is stale; run npm run generate:content`);
}

if (new Set(docs.map((doc) => doc.slug)).size !== docs.length) fail("duplicate document slug");

const portalNavRoutes = new Set(["/", "/zh"]);
const redirectedHubSlugs = new Set(["start", "zh/start"]);

const navPaths = navGroups.flatMap((group) => group.links.map(([, path]) => path));
if (new Set(navPaths).size !== navPaths.length) fail("duplicate navigation path");
for (const path of navPaths) {
  if (portalNavRoutes.has(path)) continue;
  if (!paths.has(path)) fail(`navigation points to unknown document ${path}`);
}
for (const doc of docs) {
  if (redirectedHubSlugs.has(doc.slug)) continue;
  if (!navPaths.includes(`/${doc.slug}`)) fail(`/${doc.slug} is missing from navigation`);
}

for (const doc of docs) {
  if (!doc.slug || !doc.title || !doc.summary || !doc.evidenceLabel || !doc.audiences.length || !doc.sections.length) {
    fail(`incomplete document metadata on /${doc.slug}`);
  }
  if (doc.authorityKind !== "public-knowledge") fail(`invalid knowledge authority kind on /${doc.slug}`);
  if (doc.authorityUrl !== `${canonicalBaseUrl}/${doc.slug}`) fail(`non-canonical knowledge authority on /${doc.slug}`);
  if (retiredPolicyEvidence.has(doc.evidenceUrl)) fail(`/${doc.slug} cites a retired duplicate policy as evidence`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(doc.reviewed)) fail(`invalid review date on /${doc.slug}`);
  if (doc.version !== undefined && (typeof doc.version !== "string" || !doc.version.trim())) {
    fail(`invalid document version on /${doc.slug}`);
  }
  if (!new Set(["concept", "hub", "task", "reference", "policy"]).has(doc.pageType)) {
    fail(`unsupported page type on /${doc.slug}`);
  }
  if (doc.lastTested !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(doc.lastTested)) {
    fail(`invalid last-tested date on /${doc.slug}`);
  }
  if (typeof doc.outcome !== "string" || !doc.outcome.trim()) {
    fail(`invalid outcome on /${doc.slug}`);
  }
  if (typeof doc.estimatedTime !== "string" || !doc.estimatedTime.trim()) {
    fail(`invalid estimated time on /${doc.slug}`);
  }
  if (!new Set(["start", "use", "operate", "build", "understand", "community"]).has(doc.journey)) {
    fail(`unsupported journey on /${doc.slug}`);
  }
  if (doc.primaryAction === undefined) {
    fail(`missing primary action on /${doc.slug}`);
  } else {
    if (typeof doc.primaryAction !== "object" || !doc.primaryAction.label?.trim() || !doc.primaryAction.href?.trim()) {
      fail(`invalid primary action on /${doc.slug}`);
    } else {
      const actionPath = doc.primaryAction.href.split("#")[0];
      if (actionPath.startsWith("/") && actionPath && !allowedInternal.has(actionPath)) {
        fail(`/${doc.slug} has a primary action to unknown path ${doc.primaryAction.href}`);
      }
      if (!doc.primaryAction.href.startsWith("/") && !doc.primaryAction.href.startsWith("https://")) {
        fail(`/${doc.slug} has a non-HTTPS primary action ${doc.primaryAction.href}`);
      }
      const [targetPath, fragment] = doc.primaryAction.href.split("#", 2);
      if (targetPath.startsWith("/") && fragment) {
        const target = docs.find((candidate) => `/${candidate.slug}` === targetPath);
        const targetSections = new Set(target?.sections.map((section, index) => sectionId(section.heading, index)) ?? []);
        if (!targetSections.has(fragment)) fail(`/${doc.slug} has a primary action to unknown section ${doc.primaryAction.href}`);
      }
    }
  }
  if (doc.featuredVisual !== undefined && (typeof doc.featuredVisual !== "string" || !doc.featuredVisual.trim())) {
    fail(`invalid featured visual on /${doc.slug}`);
  }
  if (!new Set(["Current", "Beta", "Draft", "Deprecated", "Historical"]).has(doc.status)) {
    fail(`unsupported status on /${doc.slug}`);
  }
  if (!docApplicability(doc)) fail(`missing applicability on /${doc.slug}`);
  if (!new Set(["en", "zh-CN"]).has(doc.language ?? "en")) fail(`unsupported language on /${doc.slug}`);
  if (doc.language === "zh-CN") {
    if (!doc.translationOf) fail(`Chinese document /${doc.slug} is missing translationOf`);
    const canonical = doc.translationOf ? docs.find((candidate) => candidate.slug === doc.translationOf) : undefined;
    if (!canonical) fail(`Chinese document /${doc.slug} points to missing canonical document`);
    if (canonical && canonical.status !== doc.status) fail(`translation status mismatch on /${doc.slug}`);
    if (canonical && canonical.version !== doc.version) fail(`translation version mismatch on /${doc.slug}`);
    if (canonical && canonical.pageType !== doc.pageType) fail(`translation page type mismatch on /${doc.slug}`);
    if (canonical && canonical.journey !== doc.journey) fail(`translation journey mismatch on /${doc.slug}`);
    if (canonical && canonical.featuredVisual !== doc.featuredVisual) fail(`translation featured visual mismatch on /${doc.slug}`);
    const canonicalPath = `/${doc.translationOf}`;
    const linksCanonical = documentLinks(doc).includes(canonicalPath);
    if (!linksCanonical) fail(`Chinese document /${doc.slug} does not link to ${canonicalPath}`);
  }

  const headings = doc.sections.map((section) => section.heading).join("\n");
  const sectionIds = doc.sections.map((section, index) => sectionId(section.heading, index));
  if (new Set(sectionIds).size !== sectionIds.length) fail(`duplicate rendered section id on /${doc.slug}`);
  const blocks = doc.sections.flatMap((section) => section.blocks ?? []);
  if (doc.pageType === "task") {
    if (!doc.lastTested) fail(`task page /${doc.slug} is missing lastTested`);
    if (!/Before you start|Prerequisites|Requirements|开始前|前置条件|要求/i.test(headings)) fail(`task page /${doc.slug} is missing prerequisites`);
    if (!blocks.some((block) => block.type === "ordered-list")) fail(`task page /${doc.slug} is missing ordered steps`);
    if (!/Verify|Expected result|Success criteria|验证|预期结果|成功标准/i.test(headings)) fail(`task page /${doc.slug} is missing verification`);
    if (!/Troubleshoot|Recovery|Rollback|If something fails|故障排查|恢复|回滚|失败/i.test(headings)) fail(`task page /${doc.slug} is missing failure or recovery guidance`);
  }
  if (doc.pageType === "reference") {
    const text = documentText(doc);
    if (!blocks.some((block) => block.type === "code")) fail(`reference page /${doc.slug} is missing a code example`);
    if (!/Authentication|Authorization|Scope/i.test(text)) fail(`reference page /${doc.slug} is missing authentication guidance`);
    if (!/Error|Failure|Retry/i.test(text)) fail(`reference page /${doc.slug} is missing error guidance`);
  }

  for (const link of documentLinks(doc)) {
    if (link.startsWith("/") && !allowedInternal.has(link)) {
      fail(`/${doc.slug} links to unknown internal path ${link}`);
    }
    if (!link.startsWith("/") && !link.startsWith("https://")) {
      fail(`/${doc.slug} has a non-HTTPS external link ${link}`);
    }
  }
}

if (!visualEvidence || visualEvidence.schema_version !== "1.1" || !/^\d{4}-\d{2}-\d{2}$/.test(visualEvidence.reviewed) || !Array.isArray(visualEvidence.visuals)) {
  fail("invalid visual evidence catalog");
} else {
  const visualIds = new Set();
  for (const visual of visualEvidence.visuals) {
    if (!visual.id || visualIds.has(visual.id)) fail(`duplicate or missing visual evidence id ${visual.id ?? "<unknown>"}`);
    visualIds.add(visual.id);
    if (!new Set(["product-screenshot", "terminal-output", "conceptual"]).has(visual.kind)) fail(`invalid visual kind on ${visual.id}`);
    if (!visual.src?.startsWith("/images/docs/") || !existsSync(new URL(`../public${visual.src}`, import.meta.url))) fail(`missing visual asset ${visual.src ?? "<unknown>"}`);
    if (!/^[a-f0-9]{64}$/.test(visual.sha256 ?? "")) fail(`invalid visual digest on ${visual.id}`);
    if (!Number.isInteger(visual.width) || visual.width < 1 || !Number.isInteger(visual.height) || visual.height < 1) fail(`invalid visual dimensions on ${visual.id}`);
    if (visual.mobile_src !== undefined) {
      if (!visual.mobile_src.startsWith("/images/docs/") || !existsSync(new URL(`../public${visual.mobile_src}`, import.meta.url))) fail(`missing mobile visual asset ${visual.mobile_src}`);
      if (!/^[a-f0-9]{64}$/.test(visual.mobile_sha256 ?? "")) fail(`invalid mobile visual digest on ${visual.id}`);
      if (!Number.isInteger(visual.mobile_width) || visual.mobile_width < 1 || !Number.isInteger(visual.mobile_height) || visual.mobile_height < 1) fail(`invalid mobile visual dimensions on ${visual.id}`);
    } else if (visual.mobile_sha256 !== undefined || visual.mobile_width !== undefined || visual.mobile_height !== undefined) {
      fail(`mobile visual metadata without an asset on ${visual.id}`);
    }
    if (!visual.alt?.trim() || !visual.caption?.trim() || !visual.claim?.trim()) fail(`incomplete visual description on ${visual.id}`);
    if (!new Set(["synthetic-only", "redacted", "public-demo-reviewed"]).has(visual.privacy_review)) fail(`invalid visual privacy review on ${visual.id}`);
    if (!visual.source?.startsWith("https://") || !visual.source_revision?.trim() || !visual.applies_to?.trim()) fail(`incomplete visual provenance on ${visual.id}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(visual.reviewed)) fail(`invalid visual review date on ${visual.id}`);
  }
  for (const doc of docs) {
    if (doc.featuredVisual && !visualIds.has(doc.featuredVisual)) fail(`/${doc.slug} references unknown visual ${doc.featuredVisual}`);
  }
  const referencedVisuals = new Set(docs.map((doc) => doc.featuredVisual).filter(Boolean));
  for (const visual of visualEvidence.visuals) if (!referencedVisuals.has(visual.id)) fail(`unreferenced visual evidence ${visual.id}`);
}

const serializedPublicInputs = JSON.stringify({ docs, sources, agentEvals, visualEvidence });
for (const forbidden of [
  "github.com/mobazha/mobazha_hosting",
  "gitlab.mobazha.com",
  "private-archive",
  "CLOUDFLARE_API_TOKEN",
  "526567244@qq.com",
]) {
  if (serializedPublicInputs.includes(forbidden)) fail(`non-public source or secret marker leaked: ${forbidden}`);
}

if (!sources.sources.some((source) => source.id === "community-backend")) fail("community backend source is missing");
if (!sources.sources.some((source) => source.id === "public-client")) fail("public client source is missing");
if (!sources.sources.some((source) => source.id === "docs-curation")) fail("documentation source is missing");

if (new Set(agentEvals.cases.map((testCase) => testCase.id)).size !== agentEvals.cases.length) {
  fail("duplicate agent evaluation id");
}
for (const testCase of agentEvals.cases) {
  if (!testCase.id || !testCase.question?.en || !testCase.question?.["zh-CN"]) {
    fail(`incomplete agent evaluation ${testCase.id ?? "<unknown>"}`);
  }
  if (!testCase.required_claims?.length || !testCase.forbidden_claims?.length || !testCase.sources?.length) {
    fail(`agent evaluation ${testCase.id} has incomplete assertions`);
  }
  for (const source of testCase.sources ?? []) {
    if (!paths.has(source)) fail(`agent evaluation ${testCase.id} points to unknown source ${source}`);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`content validation failed: ${failure}`);
  process.exit(1);
}

console.log(`content validation passed: ${docs.length} documents, ${navGroups.length} navigation groups`);
