import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const sources = JSON.parse(readFileSync(new URL("sources.json", root), "utf8"));
const backend = sources.sources.find((source) => source.id === "community-backend");

if (!backend?.revision || !/^[a-f0-9]{40}$/.test(backend.revision)) {
  throw new Error("community-backend must declare a full reviewed Git revision in sources.json");
}

const revision = backend.revision;
const sourceUrl = `https://raw.githubusercontent.com/mobazha/mobazha/${revision}/api-spec/openapi.json`;
const publicPath = `/openapi/revisions/${revision}.json`;
const output = new URL(`public${publicPath}`, root);
const metadataOutput = new URL("app/lib/generated-openapi-metadata.json", root);
const checkOnly = process.argv.includes("--check");

function digest(content) {
  return createHash("sha256").update(content).digest("hex");
}

function inspect(content) {
  const document = JSON.parse(content);
  if (!document.openapi?.startsWith("3.") || !document.info?.title || !document.info?.version) {
    throw new Error("reviewed artifact is not a supported OpenAPI 3 document");
  }

  const paths = Object.keys(document.paths ?? {});
  const operationCount = paths.reduce((count, path) => count + Object.keys(document.paths[path] ?? {})
    .filter((key) => ["get", "put", "post", "delete", "options", "head", "patch", "trace"].includes(key))
    .length, 0);

  return {
    schemaVersion: "1.0",
    title: document.info.title,
    openapiVersion: document.openapi,
    apiVersion: document.info.version,
    revision,
    shortRevision: revision.slice(0, 12),
    reviewed: backend.reviewed,
    sourceUrl,
    sourceRepository: "https://github.com/mobazha/mobazha/tree/main/api-spec",
    publicPath,
    sha256: digest(content),
    pathCount: paths.length,
    operationCount,
    schemaCount: Object.keys(document.components?.schemas ?? {}).length,
  };
}

if (checkOnly) {
  const content = readFileSync(output, "utf8");
  const expected = inspect(content);
  const actual = JSON.parse(readFileSync(metadataOutput, "utf8"));
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("OpenAPI snapshot metadata is stale; run npm run sync:openapi");
  }
  console.log(`OpenAPI snapshot verified: ${expected.shortRevision} ${expected.sha256.slice(0, 12)}`);
} else {
  const response = await fetch(sourceUrl, {
    headers: { "user-agent": "mobazha-docs-openapi-sync/1.0" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`OpenAPI source returned HTTP ${response.status}`);
  const downloaded = await response.text();
  const content = downloaded.endsWith("\n") ? downloaded : `${downloaded}\n`;
  const metadata = inspect(content);

  mkdirSync(new URL("./", output), { recursive: true });
  writeFileSync(output, content);
  writeFileSync(metadataOutput, `${JSON.stringify(metadata, null, 2)}\n`);
  console.log(`synced ${publicPath} from ${metadata.shortRevision}`);
}
