import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/buy",
  "/self-host/install",
  "/build/api",
  "/api-reference",
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

    if (route !== "/" && route !== "/api-reference") {
      const action = page.locator(".doc-primary-action");
      await expect(action).toBeVisible();
      const actionBox = await action.boundingBox();
      expect(actionBox?.y ?? Number.POSITIVE_INFINITY, "primary action starts within the first viewport").toBeLessThan(testInfo.project.use.viewport?.height ?? 844);

      const bodyFontSizes = await page.locator(".doc-content p, .doc-content li").evaluateAll((nodes) =>
        nodes.slice(0, 20).map((node) => Number.parseFloat(getComputedStyle(node).fontSize)),
      );
      expect(bodyFontSizes.every((size) => size >= 16), "article prose stays at least 16px").toBeTruthy();
    }

    const accessibility = new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);
    if (route === "/api-reference") accessibility.include(".api-reference-intro");
    const results = await accessibility.analyze();
    const serious = results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""));
    expect(serious, serious.map((violation) => `${violation.id}: ${violation.help}`).join("\n")).toEqual([]);
  });
}

test("API reference uses the reviewed contract without enabling requests", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "the shared route test covers mobile layout");
  test.setTimeout(60_000);
  await page.goto("/api-reference");
  await expect(page.locator(".api-reference-intro").getByRole("heading", { name: "Mobazha Node API", exact: true })).toBeVisible();
  await expect(page.getByText("Read-only reference")).toBeVisible();
  await expect(page.getByPlaceholder(/Search/).first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("Test Request", { exact: true })).toHaveCount(0);

  const contractResponse = await page.request.get("/openapi.json");
  expect(contractResponse.ok()).toBeTruthy();
  expect(contractResponse.url()).toContain("/openapi/revisions/");
  expect((await contractResponse.json()).openapi).toBe("3.1.0");
});

test("keyboard users can bypass navigation and reach the document", async ({ page }) => {
  await page.goto("/buy");
  await page.keyboard.press("Tab");
  const skip = page.locator(".skip-link");
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("desktop search supports keyboard selection and navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "header search layout is optimized for desktop");
  const indexReady = page.waitForResponse((response) => response.url().endsWith("/docs-index.json") && response.ok());
  await page.goto("/buy");
  await indexReady;
  const search = page.getByRole("combobox", { name: "Search documentation" });
  await search.fill("refund");
  await expect(page.getByRole("option").first()).toBeVisible();
  await search.press("ArrowDown");
  await expect(search).toHaveAttribute("aria-activedescendant", "docs-search-option-0");
  await expect(page.locator("#docs-search-option-0")).toHaveAttribute("aria-selected", "true");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/buy\/cancel-refund-dispute$/);
});

test("Chinese search stays inside the Chinese knowledge surface", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "header search layout is optimized for desktop");
  const indexReady = page.waitForResponse((response) => response.url().endsWith("/docs-index.json") && response.ok());
  await page.goto("/zh/buy");
  await indexReady;
  const search = page.getByRole("combobox", { name: "搜索文档" });
  await search.fill("收费");
  const results = page.getByRole("option");
  await expect(results.first()).toHaveAttribute("href", "/zh/project/fees");
  const paths = await results.evaluateAll((options) => options.map((option) => option.getAttribute("href")));
  expect(paths.length).toBeGreaterThan(0);
  expect(paths.every((path) => path?.startsWith("/zh/"))).toBeTruthy();
});

test("reduced-motion preference removes meaningful transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const transitionSeconds = await page.locator(".portal-journey-card").first().evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).transitionDuration),
  );
  expect(transitionSeconds).toBeLessThanOrEqual(0.00001);
});

test("/start resolves to the portal home", async ({ page }) => {
  await page.goto("/start");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Trusted guides");
});
