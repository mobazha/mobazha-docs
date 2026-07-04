import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const root = new URL("../", import.meta.url);
const sitemap = readFileSync(new URL("public/sitemap.xml", root), "utf8");
const pagePaths = [...sitemap.matchAll(/<loc>https:\/\/docs\.mobazha\.org([^<]*)<\/loc>/g)].map((match) => match[1] || "/");
const discoveryPaths = [
  "/docs-index.json",
  "/sources.json",
  "/agent-evals.json",
  "/visual-evidence.json",
  "/llms.txt",
  "/llms-full.txt",
  "/.well-known/mobazha-docs.json",
  "/openapi.json",
];

test("published pages and Agent discovery endpoints remain reachable", async ({ request }) => {
  test.setTimeout(60_000);
  const failures = [];
  for (const path of [...new Set([...pagePaths, ...discoveryPaths])]) {
    const response = await request.get(path);
    if (!response.ok()) failures.push(`${response.status()} ${path}`);
  }
  expect(failures, failures.join("\n")).toEqual([]);
});
