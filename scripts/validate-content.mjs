import { readFileSync } from "node:fs";
import { docApplicability, docs, publicationNavGroups as navGroups } from "./load-docs.mjs";
import { renderPublication } from "./publication.mjs";
import { documentLinks, documentText, loadContentDocuments, renderDocumentRegistry } from "./content-files.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const failures = [];
const fail = (message) => failures.push(message);
const canonicalBaseUrl = "https://docs.mobazha.org";
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
const expectedFiles = renderPublication({ docs, navGroups, docApplicability, sources, sourceSchema, agentEvals, agentEvalSchema });
const paths = new Set(docs.map((doc) => `/${doc.slug}`));
const allowedInternal = new Set([
  "/",
  ...paths,
  "/llms.txt",
  "/llms-full.txt",
  "/docs-index.json",
  "/sources.json",
  "/sources.schema.json",
  "/agent-evals.json",
  "/agent-evals.schema.json",
  "/.well-known/mobazha-docs.json",
  "/openapi.json",
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

const navPaths = navGroups.flatMap((group) => group.links.map(([, path]) => path));
if (new Set(navPaths).size !== navPaths.length) fail("duplicate navigation path");
for (const path of navPaths) if (!paths.has(path)) fail(`navigation points to unknown document ${path}`);
for (const path of paths) if (!navPaths.includes(path)) fail(`${path} is missing from navigation`);

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
  if (doc.outcome !== undefined && (typeof doc.outcome !== "string" || !doc.outcome.trim())) {
    fail(`invalid outcome on /${doc.slug}`);
  }
  if (doc.estimatedTime !== undefined && (typeof doc.estimatedTime !== "string" || !doc.estimatedTime.trim())) {
    fail(`invalid estimated time on /${doc.slug}`);
  }
  if (doc.journey !== undefined && !new Set(["start", "use", "operate", "build", "understand", "community"]).has(doc.journey)) {
    fail(`unsupported journey on /${doc.slug}`);
  }
  if (doc.primaryAction !== undefined) {
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
    }
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
    const canonicalPath = `/${doc.translationOf}`;
    const linksCanonical = documentLinks(doc).includes(canonicalPath);
    if (!linksCanonical) fail(`Chinese document /${doc.slug} does not link to ${canonicalPath}`);
  }

  const headings = doc.sections.map((section) => section.heading).join("\n");
  const blocks = doc.sections.flatMap((section) => section.blocks ?? []);
  if (doc.pageType === "task") {
    if (!doc.lastTested) fail(`task page /${doc.slug} is missing lastTested`);
    if (!/Before you start|Prerequisites|Requirements/i.test(headings)) fail(`task page /${doc.slug} is missing prerequisites`);
    if (!blocks.some((block) => block.type === "ordered-list")) fail(`task page /${doc.slug} is missing ordered steps`);
    if (!/Verify|Expected result|Success criteria/i.test(headings)) fail(`task page /${doc.slug} is missing verification`);
    if (!/Troubleshoot|Recovery|Rollback|If something fails/i.test(headings)) fail(`task page /${doc.slug} is missing failure or recovery guidance`);
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

const serializedPublicInputs = JSON.stringify({ docs, sources, agentEvals });
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
