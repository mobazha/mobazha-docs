import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/buy",
  "/self-host/install",
  "/build/api",
  "/project/fees",
  "/zh/buy",
  "/zh/self-host/install",
];

for (const route of routes) {
  test(`${route} keeps its reading and accessibility contract`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "page-level horizontal overflow").toBeLessThanOrEqual(1);

    if (route !== "/") {
      const action = page.locator(".doc-primary-action");
      await expect(action).toBeVisible();
      const actionBox = await action.boundingBox();
      expect(actionBox?.y ?? Number.POSITIVE_INFINITY, "primary action starts within the first viewport").toBeLessThan(testInfo.project.use.viewport?.height ?? 844);

      const bodyFontSizes = await page.locator(".doc-content p, .doc-content li").evaluateAll((nodes) =>
        nodes.slice(0, 20).map((node) => Number.parseFloat(getComputedStyle(node).fontSize)),
      );
      expect(bodyFontSizes.every((size) => size >= 16), "article prose stays at least 16px").toBeTruthy();
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""));
    expect(serious, serious.map((violation) => `${violation.id}: ${violation.help}`).join("\n")).toEqual([]);
  });
}

test("keyboard users can bypass navigation and reach the document", async ({ page }) => {
  await page.goto("/buy");
  await page.keyboard.press("Tab");
  const skip = page.locator(".skip-link");
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});
