import { readFileSync, writeFileSync } from "node:fs";
import { docApplicability, docs, publicationNavGroups as navGroups } from "./load-docs.mjs";
import { renderPublication } from "./publication.mjs";

const sources = JSON.parse(readFileSync(new URL("../sources.json", import.meta.url), "utf8"));
const sourceSchema = readFileSync(new URL("../sources.schema.json", import.meta.url), "utf8");
const agentEvals = JSON.parse(readFileSync(new URL("../agent-evals.json", import.meta.url), "utf8"));
const agentEvalSchema = readFileSync(new URL("../agent-evals.schema.json", import.meta.url), "utf8");
const visualEvidence = JSON.parse(readFileSync(new URL("../visual-evidence.json", import.meta.url), "utf8"));
const visualEvidenceSchema = readFileSync(new URL("../visual-evidence.schema.json", import.meta.url), "utf8");
const files = renderPublication({ docs, navGroups, docApplicability, sources, sourceSchema, agentEvals, agentEvalSchema, visualEvidence, visualEvidenceSchema });

for (const [path, content] of Object.entries(files)) {
  writeFileSync(new URL(`../${path}`, import.meta.url), content);
  console.log(`generated ${path}`);
}
