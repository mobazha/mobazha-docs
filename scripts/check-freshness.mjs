import { readFileSync } from "node:fs";

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const now = new Date(process.env.FRESHNESS_NOW ?? Date.now());
const day = 24 * 60 * 60 * 1000;
const failures = [];

if (Number.isNaN(now.getTime())) {
  console.error("FRESHNESS_NOW must be an ISO date when provided");
  process.exit(1);
}

const ageInDays = (value) => Math.floor((now.getTime() - new Date(`${value}T00:00:00Z`).getTime()) / day);
const checkAge = (label, value, budget) => {
  const age = ageInDays(value);
  if (!Number.isFinite(age)) failures.push(`${label} has an invalid review date: ${value}`);
  else if (age < 0) failures.push(`${label} has a future review date: ${value}`);
  else if (age > budget) failures.push(`${label} is ${age} days old; budget is ${budget} days`);
};

const statusBudgets = {
  Current: 180,
  Beta: 90,
  Draft: 180,
  Deprecated: 180,
  Historical: 365,
};

const documents = readJson("app/lib/generated-docs.json");
for (const doc of documents) {
  checkAge(`/${doc.slug}`, doc.reviewed, statusBudgets[doc.status] ?? 90);
  if (doc.pageType === "task") checkAge(`/${doc.slug} last tested`, doc.lastTested, 90);
}

const evidence = readJson("visual-evidence.json");
checkAge("visual evidence catalog", evidence.reviewed, 180);
for (const visual of evidence.visuals) checkAge(`visual ${visual.id}`, visual.reviewed, 180);

const sources = readJson("sources.json");
checkAge("public source catalog", sources.reviewed, 90);
for (const source of sources.sources) {
  if (source.reviewed) checkAge(`source ${source.id}`, source.reviewed, 90);
}

const agentEvals = readJson("agent-evals.json");
checkAge("Agent evaluation contract", agentEvals.reviewed, 180);

const videos = readJson("content/videos.json");
checkAge("video catalog", videos.reviewed, 90);
for (const video of videos.videos) checkAge(`video ${video.id}`, video.reviewed, video.status === "Current" ? 180 : 90);

if (failures.length) {
  console.error(`freshness check failed (${now.toISOString().slice(0, 10)}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`freshness check passed: ${documents.length} documents, ${videos.videos.length} videos, ${evidence.visuals.length} visuals, ${sources.sources.length} sources, and the Agent evaluation contract`);
