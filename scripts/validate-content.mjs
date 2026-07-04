import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const fail = (message) => {
  console.error(`content validation failed: ${message}`);
  process.exitCode = 1;
};

const source = read("app/lib/docs.ts");
const index = JSON.parse(read("public/docs-index.json"));
const sitemap = read("public/sitemap.xml");
const sources = JSON.parse(read("sources.json"));

const sourceSlugs = [...source.matchAll(/\n\s+slug: "([^"]+)",/g)].map((match) => match[1]);
const indexedSlugs = index.documents.map((doc) => doc.path.replace(/^\//, ""));

for (const slug of sourceSlugs) {
  if (!indexedSlugs.includes(slug)) fail(`/${slug} is missing from docs-index.json`);
  if (!sitemap.includes(`https://docs.mobazha.org/${slug}`)) fail(`/${slug} is missing from sitemap.xml`);
}

for (const slug of indexedSlugs) {
  if (!sourceSlugs.includes(slug)) fail(`docs-index.json contains unknown /${slug}`);
}

for (const doc of index.documents) {
  if (!doc.id || !doc.path || !doc.status || !doc.source || !doc.audiences?.length) {
    fail(`incomplete index record: ${JSON.stringify(doc)}`);
  }
  if (!new Set(["current", "beta", "draft", "deprecated", "historical"]).has(doc.status)) {
    fail(`unsupported status ${doc.status} on ${doc.path}`);
  }
}

const serializedPublicInputs = JSON.stringify({ index, sources });
for (const forbidden of ["github.com/mobazha/mobazha-unified", "gitlab.mobazha.com", "private-archive"]) {
  if (serializedPublicInputs.includes(forbidden)) fail(`non-public source leaked into publication metadata: ${forbidden}`);
}

if (new Set(sourceSlugs).size !== sourceSlugs.length) fail("duplicate document slug");
if (new Set(indexedSlugs).size !== indexedSlugs.length) fail("duplicate docs-index path");

if (!process.exitCode) {
  console.log(`content validation passed: ${sourceSlugs.length} documents`);
}
