import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const root = new URL("../", import.meta.url);
const sitemap = readFileSync(new URL("public/sitemap.xml", root), "utf8");
const pagePaths = [...sitemap.matchAll(/<loc>https:\/\/docs\.mobazha\.org([^<]*)<\/loc>/g)].map((match) => match[1] || "/");

test("all published pages avoid critical and serious WCAG violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "representative routes retain separate mobile WCAG coverage");
  test.setTimeout(300_000);
  const failures = [];

  for (const path of pagePaths) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    for (const violation of results.violations.filter((item) => ["critical", "serious"].includes(item.impact ?? ""))) {
      failures.push(`${path} ${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`);
    }
  }

  expect(failures, failures.join("\n")).toEqual([]);
});
