import { readFileSync } from "node:fs";
import { docApplicability, docs, publicationNavGroups as navGroups } from "./load-docs.mjs";
import { renderPublication } from "./publication.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const failures = [];
const fail = (message) => failures.push(message);

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
  if (!doc.slug || !doc.title || !doc.summary || !doc.sourceLabel || !doc.audiences.length || !doc.sections.length) {
    fail(`incomplete document metadata on /${doc.slug}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(doc.reviewed)) fail(`invalid review date on /${doc.slug}`);
  if (!new Set(["Current", "Beta", "Draft"]).has(doc.status)) fail(`unsupported status on /${doc.slug}`);
  if (!docApplicability(doc)) fail(`missing applicability on /${doc.slug}`);
  if (!new Set(["en", "zh-CN"]).has(doc.language ?? "en")) fail(`unsupported language on /${doc.slug}`);
  if (doc.language === "zh-CN") {
    if (!doc.translationOf) fail(`Chinese document /${doc.slug} is missing translationOf`);
    const canonical = doc.translationOf ? docs.find((candidate) => candidate.slug === doc.translationOf) : undefined;
    if (!canonical) fail(`Chinese document /${doc.slug} points to missing canonical document`);
    if (canonical && canonical.status !== doc.status) fail(`translation status mismatch on /${doc.slug}`);
    const canonicalPath = `/${doc.translationOf}`;
    const linksCanonical = doc.sections.some((section) =>
      section.links?.some((link) => link.href === canonicalPath),
    );
    if (!linksCanonical) fail(`Chinese document /${doc.slug} does not link to ${canonicalPath}`);
  }

  for (const section of doc.sections) {
    for (const link of section.links ?? []) {
      if (link.href.startsWith("/") && !allowedInternal.has(link.href)) {
        fail(`/${doc.slug} links to unknown internal path ${link.href}`);
      }
      if (!link.href.startsWith("/") && !link.href.startsWith("https://")) {
        fail(`/${doc.slug} has a non-HTTPS external link ${link.href}`);
      }
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
