import { readFileSync } from "node:fs";
import { docApplicability, docs, navGroups } from "./load-docs.mjs";
import { renderPublication } from "./publication.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const failures = [];
const fail = (message) => failures.push(message);

const sources = JSON.parse(read("sources.json"));
const sourceSchema = read("sources.schema.json");
const expectedFiles = renderPublication({ docs, navGroups, docApplicability, sources, sourceSchema });
const paths = new Set(docs.map((doc) => `/${doc.slug}`));
const allowedInternal = new Set([
  "/",
  ...paths,
  "/llms.txt",
  "/llms-full.txt",
  "/docs-index.json",
  "/sources.json",
  "/sources.schema.json",
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

const serializedPublicInputs = JSON.stringify({ docs, sources });
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

if (failures.length) {
  for (const failure of failures) console.error(`content validation failed: ${failure}`);
  process.exit(1);
}

console.log(`content validation passed: ${docs.length} documents, ${navGroups.length} navigation groups`);
