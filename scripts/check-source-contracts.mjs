import { readFileSync } from "node:fs";

const sources = JSON.parse(readFileSync(new URL("../sources.json", import.meta.url), "utf8"));
const failures = [];
const drift = [];
const fail = (message) => failures.push(message);
const requireCurrent = process.argv.includes("--require-current");
const githubHeaders = {
  accept: "application/vnd.github+json",
  "user-agent": "mobazha-docs-source-contract-check/1.0",
  "x-github-api-version": "2022-11-28",
};

async function fetchJson(url, label) {
  const response = await fetch(url, { headers: githubHeaders, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
  return response.json();
}

function githubRepository(source) {
  const match = source.repository.match(/^https:\/\/github\.com\/([^/]+)\/([^/#]+)(?:\/.*)?$/);
  return match ? `${match[1]}/${match[2]}` : undefined;
}

for (const source of sources.sources) {
  const repository = githubRepository(source);
  if (!repository || !source.revision) continue;
  try {
    const current = await fetchJson(`https://api.github.com/repos/${repository}/commits/main`, repository);
    if (current.sha !== source.revision) {
      const message = `${source.id} moved from reviewed revision ${source.revision.slice(0, 12)} to ${current.sha.slice(0, 12)}`;
      if (requireCurrent) fail(`${message}; review and update sources.json`);
      else {
        drift.push(message);
        console.warn(`source revision drift (non-blocking): ${message}`);
      }
    } else {
      console.log(`source revision current: ${source.id} ${current.sha.slice(0, 12)}`);
    }
  } catch (error) {
    fail(error.message);
  }
}

const backend = sources.sources.find((source) => source.id === "community-backend");
if (!backend?.revision) fail("community-backend reviewed revision is missing");
else {
  try {
    const openapi = await fetchJson(
      `https://raw.githubusercontent.com/mobazha/mobazha/${backend.revision}/api-spec/openapi.json`,
      "Mobazha Node OpenAPI",
    );
    if (openapi.openapi !== "3.1.0") fail(`unexpected OpenAPI version ${openapi.openapi}`);
    if (openapi.info?.title !== "Mobazha Node API") fail(`unexpected OpenAPI title ${openapi.info?.title}`);
    for (const path of ["/v1/runtime-config", "/v1/system/health", "/v1/webhooks"]) {
      if (!openapi.paths?.[path]) fail(`OpenAPI is missing critical path ${path}`);
    }
    for (const scheme of ["apiToken", "basicAuth", "bearerJWT", "nodeAuth"]) {
      if (!openapi.components?.securitySchemes?.[scheme]) fail(`OpenAPI is missing security scheme ${scheme}`);
    }
    console.log(`OpenAPI contract current: ${Object.keys(openapi.paths ?? {}).length} paths`);
  } catch (error) {
    fail(error.message);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`source contract check failed: ${failure}`);
  process.exit(1);
}

const driftSummary = drift.length ? `; ${drift.length} upstream revision(s) pending review` : "";
console.log(`source contract check passed: ${sources.sources.length} public sources${driftSummary}`);
