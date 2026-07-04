import { readdirSync, readFileSync } from "node:fs";
import { loadContentDocuments } from "./content-files.mjs";

const root = new URL("../", import.meta.url);
const failures = [];
const fail = (message) => failures.push(message);
const read = (path) => readFileSync(new URL(path, root), "utf8");

function metadata(source, key) {
  return source.match(new RegExp(`^- ${key}:\\s*(.+)$`, "m"))?.[1].trim();
}

function validateRegistry({ directory, kind, statuses, requiredFields, requiredHeadings }) {
  const files = readdirSync(new URL(`${directory}/`, root))
    .filter((file) => /^\d{4}-[a-z0-9-]+\.md$/.test(file) && !file.startsWith("0000-"))
    .sort();
  const registry = read(`${directory}/README.md`);
  if (!read(`${directory}/0000-template.md`).startsWith(`# ${kind}-0000:`)) {
    fail(`${directory}/0000-template.md has an invalid title`);
  }

  for (const file of files) {
    const source = read(`${directory}/${file}`);
    const number = file.slice(0, 4);
    if (!source.startsWith(`# ${kind}-${number}:`)) fail(`${file} title does not match its number`);
    if (!registry.includes(`](./${file})`)) fail(`${file} is missing from ${directory}/README.md`);
    const status = metadata(source, "Status");
    if (!statuses.has(status)) fail(`${file} has unsupported status ${status ?? "<missing>"}`);
    for (const field of requiredFields) {
      if (!metadata(source, field)) fail(`${file} is missing ${field}`);
    }
    for (const heading of requiredHeadings) {
      if (!source.includes(`## ${heading}`)) fail(`${file} is missing section ${heading}`);
    }
  }

  return files.length;
}

const rfcCount = validateRegistry({
  directory: "rfcs",
  kind: "RFC",
  statuses: new Set(["Draft", "Review", "Accepted", "Rejected", "Withdrawn", "Implemented", "Superseded"]),
  requiredFields: ["Status", "Authors", "Created", "Updated", "Decision owners", "Affected surfaces", "Supersedes", "Superseded by"],
  requiredHeadings: ["Summary", "Problem and evidence", "Proposal", "Security, privacy, and abuse analysis", "Economic and legal analysis", "Alternatives", "Rollout and rollback", "Documentation impact", "Open questions", "Decision"],
});

const adrCount = validateRegistry({
  directory: "adrs",
  kind: "ADR",
  statuses: new Set(["Proposed", "Accepted", "Rejected", "Deprecated", "Superseded"]),
  requiredFields: ["Status", "Date", "Decision owners", "Affected surfaces", "Supersedes", "Superseded by"],
  requiredHeadings: ["Context", "Decision", "Alternatives considered", "Consequences", "Validation", "Supersession conditions"],
});

const documents = loadContentDocuments();
const whitepaper = documents.find((doc) => doc.slug === "project/whitepaper");
const chineseWhitepaper = documents.find((doc) => doc.slug === "zh/project/whitepaper");
if (!whitepaper?.version) fail("English whitepaper is missing a version");
if (chineseWhitepaper?.version !== whitepaper?.version) fail("Chinese whitepaper version does not match English");
if (whitepaper?.version && !read("whitepaper/README.md").includes(`\`${whitepaper.version}\``)) {
  fail("whitepaper/README.md does not identify the current public version");
}
if (!read("history/README.md").includes("Status: Historical")) {
  fail("history/README.md is missing the historical record template");
}

if (failures.length) {
  for (const failure of failures) console.error(`record validation failed: ${failure}`);
  process.exit(1);
}

console.log(`record validation passed: ${rfcCount} RFCs, ${adrCount} ADRs, whitepaper ${whitepaper.version}`);
