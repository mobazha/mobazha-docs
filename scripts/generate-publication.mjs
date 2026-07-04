import { readFileSync, writeFileSync } from "node:fs";
import { docApplicability, docs, navGroups } from "./load-docs.mjs";
import { renderPublication } from "./publication.mjs";

const sources = JSON.parse(readFileSync(new URL("../sources.json", import.meta.url), "utf8"));
const sourceSchema = readFileSync(new URL("../sources.schema.json", import.meta.url), "utf8");
const files = renderPublication({ docs, navGroups, docApplicability, sources, sourceSchema });

for (const [path, content] of Object.entries(files)) {
  writeFileSync(new URL(`../${path}`, import.meta.url), content);
  console.log(`generated ${path}`);
}
