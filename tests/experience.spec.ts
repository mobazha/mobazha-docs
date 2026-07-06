import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/buy",
  "/self-host/install",
  "/build/api",
  "/api-reference",
  "/project/product-map",
  "/project/identity-and-stores",
  "/project/transaction-spine",
  "/project/offer-to-fulfillment",
  "/project/community-commerce",
  "/project/agent-commerce",
  "/project/surfaces-and-integrations",
  "/project/fees",
  "/zh/buy",
  "/zh/project",
  "/zh/project/product-map",
  "/zh/project/identity-and-stores",
  "/zh/project/transaction-spine",
  "/zh/project/offer-to-fulfillment",
  "/zh/project/community-commerce",
  "/zh/project/agent-commerce",
  "/zh/project/surfaces-and-integrations",
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

test("header language menu preserves translations and the GitHub action stays compact", async ({ page }) => {
  await page.goto("/project/product-map");
  const englishMenu = page.locator(".language-menu");
  await expect(englishMenu.locator("summary")).toHaveText("English");
  await englishMenu.locator("summary").click();
  await expect(englishMenu).toHaveAttribute("open", "");
  await expect(englishMenu.locator('a[href="/project/product-map"]')).toHaveAttribute("aria-current", "page");
  await expect(englishMenu.locator('a[href="/zh/project/product-map"]')).toHaveText("简体中文");

  const githubLink = page.locator('.github-link[href="https://github.com/mobazha/mobazha-docs"]');
  await expect(githubLink).toHaveAttribute("aria-label", "Mobazha Docs on GitHub");
  await expect(githubLink.locator("svg")).toHaveCount(1);
  await expect(githubLink).toHaveText("");

  await page.goto("/zh/project/product-map");
  const chineseMenu = page.locator(".language-menu");
  await expect(chineseMenu.locator("summary")).toHaveText("中文");
  await chineseMenu.locator("summary").click();
  await expect(chineseMenu.locator('a[href="/zh/project/product-map"]')).toHaveAttribute("aria-current", "page");
  await expect(chineseMenu.locator('a[href="/project/product-map"]')).toHaveText("English");
  await expect(page.locator(".github-link")).toHaveAttribute("aria-label", "在 GitHub 查看 Mobazha 文档");
});

test("reduced-motion preference removes meaningful transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const transitionSeconds = await page.locator(".portal-journey-card").first().evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).transitionDuration),
  );
  expect(transitionSeconds).toBeLessThanOrEqual(0.00001);
});

test("homepage promises lead to canonical product models", async ({ page }) => {
  await page.goto("/");
  const englishPromises = page.locator(".portal-principles h3 a");
  await expect(englishPromises).toHaveCount(4);
  expect(await englishPromises.evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual([
    "/project/identity-and-stores",
    "/project/community-commerce",
    "/project/transaction-spine",
    "/project/surfaces-and-integrations",
  ]);

  await page.goto("/zh");
  const chinesePromises = page.locator(".portal-principles h3 a");
  await expect(chinesePromises).toHaveCount(4);
  expect(await chinesePromises.evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual([
    "/zh/project/identity-and-stores",
    "/zh/project/community-commerce",
    "/zh/project/transaction-spine",
    "/zh/project/surfaces-and-integrations",
  ]);
});

test("the current whitepaper is prominent, versioned, and complete", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('.portal-home-actions a[href="/project/whitepaper"]')).toHaveText("Read the v0.2 whitepaper");

  await page.goto("/project/whitepaper");
  await expect(page.locator('.site-header nav a[href="/project/product-map"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".product-nav-group.active-group > summary span")).toHaveText("Vision & direction");
  await expect(page.locator("h1")).toHaveText("Mobazha Founding Whitepaper");
  await expect(page.locator(".doc-metadata")).toContainText("0.2-discussion");
  await expect(page.getByRole("heading", { name: "0. Executive Summary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "5. From One Transaction to an Open Network" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "7. Two Connected Economic Loops" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "15. Conclusion" })).toBeVisible();

  await page.goto("/zh");
  await expect(page.locator('.portal-home-actions a[href="/zh/project/whitepaper"]')).toHaveText("阅读 v0.2 白皮书");
  await expect(page.locator('.site-header nav a[href="/zh/project/whitepaper"]')).toHaveCount(0);

  await page.goto("/zh/project/whitepaper");
  await expect(page.locator('.site-header nav a[href="/zh/project/product-map"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".product-nav-group.active-group > summary span")).toHaveText("愿景与方向");
});

test("primary tabs and project knowledge groups use one taxonomy", async ({ page }) => {
  await page.goto("/project/product-map");
  expect(await page.locator(".site-header nav a").evaluateAll((links) => links.map((link) => link.textContent))).toEqual([
    "Buy & sell",
    "Operate",
    "Build",
    "Product",
    "Project",
    "Community",
  ]);
  await expect(page.locator('.site-header nav a[href="/project/product-map"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".product-nav-group.active-group > summary span")).toHaveText("Product model");
  await expect(page.locator(".product-nav-group > summary span")).toHaveText([
    "Product model",
    "Product foundations",
    "Vision & direction",
  ]);
  await expect(page.locator('.product-nav-group[open] > summary span')).toHaveText([
    "Product model",
    "Product foundations",
    "Vision & direction",
  ]);
  await expect(page.locator('.nav-group a.active')).toHaveCount(1);
  await expect(page.locator('.nav-group a.active')).toHaveAttribute("href", "/project/product-map");
  await expect(page.locator('.nav-group a[href="/project"]')).not.toHaveClass(/active/);
  await expect(page.locator('.docs-sidebar a[href="/project/whitepaper"]')).toHaveCount(2);
  await expect(page.locator('.nav-group a[href="/project/whitepaper"]')).toHaveText("Whitepaper v0.2");

  await page.goto("/project/compatibility");
  await expect(page.locator('.site-header nav a[href="/project/product-map"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".product-nav-group.active-group > summary span")).toHaveText("Product foundations");
  await expect(page.locator(".product-nav-group > summary span")).toHaveText([
    "Product model",
    "Product foundations",
    "Vision & direction",
  ]);
  await expect(page.locator('.product-nav-group[open] > summary span')).toHaveText([
    "Product model",
    "Product foundations",
    "Vision & direction",
  ]);
  await expect(page.locator('.nav-group a.active')).toHaveCount(1);
  await expect(page.locator('.nav-group a.active')).toHaveAttribute("href", "/project/compatibility");
  await expect(page.locator('.nav-group a[href="/project"]')).not.toHaveClass(/active/);

  await page.goto("/project/whitepaper");
  await expect(page.locator('.site-header nav a[href="/project/product-map"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".product-nav-group.active-group > summary span")).toHaveText("Vision & direction");
  await expect(page.locator('.nav-group a.active')).toHaveCount(1);
  await expect(page.locator('.nav-group a[href="/project/whitepaper"]')).toHaveAttribute("aria-current", "page");

  await page.goto("/project/security");
  await expect(page.locator('.site-header nav a[href="/project/release-scope"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".nav-group.active-group > p")).toHaveText("Trust & governance");
  await expect(page.locator(".nav-group")).toHaveCount(1);

  await page.goto("/zh/project/product-map");
  expect(await page.locator(".site-header nav a").evaluateAll((links) => links.map((link) => link.textContent))).toEqual([
    "买卖",
    "运营",
    "开发",
    "产品",
    "项目",
    "社区",
  ]);
  await expect(page.locator('.site-header nav a[href="/zh/project/product-map"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".product-nav-group > summary span")).toHaveText([
    "产品模型",
    "产品基础",
    "愿景与方向",
  ]);
  await expect(page.locator('.product-nav-group[open] > summary span')).toHaveText([
    "产品模型",
    "产品基础",
    "愿景与方向",
  ]);
  await expect(page.locator('.nav-group a[href="/zh/project/fees"]')).toHaveText("收费与经济模式");
  await expect(page.locator('.nav-group a[href="/zh/project/whitepaper"]')).toHaveText("白皮书 v0.2");

  await page.goto("/zh/project");
  await expect(page.locator('.site-header nav a[href="/zh/project"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator(".nav-group.active-group > p")).toHaveText("信任与治理");
});

test("article lists keep their markers without changing task step counters", async ({ page }) => {
  await page.goto("/project/whitepaper");
  const whitepaperStyles = await page.evaluate(() => ({
    headerBackground: getComputedStyle(document.querySelector<HTMLElement>(".site-header")!).backgroundColor,
    listStyleType: getComputedStyle(document.querySelector<HTMLElement>(".doc-content ul")!).listStyleType,
  }));
  expect(whitepaperStyles).toEqual({
    headerBackground: "rgb(255, 255, 255)",
    listStyleType: "disc",
  });

  await page.goto("/sell/store-setup");
  const taskListStyles = await page.evaluate(() => {
    const list = document.querySelector<HTMLElement>(".doc-content ol")!;
    const item = list.querySelector<HTMLElement>("li")!;
    return {
      itemPaddingLeft: getComputedStyle(item).paddingLeft,
      listStyleType: getComputedStyle(list).listStyleType,
      stepContent: getComputedStyle(item, "::before").content,
    };
  });
  expect(taskListStyles).toEqual({
    itemPaddingLeft: "42px",
    listStyleType: "none",
    stepContent: "counter(task-step)",
  });
});

test("architecture and fee pages establish their role in the knowledge system", async ({ page }) => {
  await page.goto("/project/architecture");
  await expect(page.locator("h1")).toHaveText("How Mobazha systems fit together");
  await expect(page.getByRole("heading", { name: "Where this page fits" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "One request through the system" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "When systems disagree or fail" })).toBeVisible();

  await page.goto("/project/fees");
  await expect(page.locator("h1")).toHaveText("What you pay and who receives it");
  await expect(page.locator(".trust-panel")).not.toHaveAttribute("open", "");
  await expect(page.getByRole("heading", { name: "Direct answers" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Read a Fee Quote" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How Mobazha can be sustainable" })).toBeVisible();
});

test("journey and boundary diagrams use the light documentation visual system", async ({ request }) => {
  for (const path of [
    "/images/docs/buy/order-lifecycle.svg",
    "/images/docs/sell/store-operating-loop.svg",
    "/images/docs/self-host/operator-trust-boundary.svg",
  ]) {
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
    const svg = await response.text();
    expect(svg).toContain('fill="#fbfdff"');
    expect(svg).not.toContain("#07131a");
    expect(svg).not.toContain("#102833");
  }
});

test("flagship concepts share one product-model navigation group", async ({ page }) => {
  await page.goto("/project/transaction-spine");
  const englishGroup = page.locator(".nav-group.active-group");
  await expect(englishGroup.locator("summary span")).toHaveText("Product model");
  await expect(englishGroup.locator("a")).toHaveCount(7);

  await page.goto("/zh/project/agent-commerce");
  const chineseGroup = page.locator(".nav-group.active-group");
  await expect(chineseGroup.locator("summary span")).toHaveText("产品模型");
  await expect(chineseGroup.locator("a")).toHaveCount(7);
});

test("/start resolves to the portal home", async ({ page }) => {
  await page.goto("/start");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Own your store");
});

test("/zh/start resolves to the Chinese portal home", async ({ page }) => {
  await page.goto("/zh/start");
  await expect(page).toHaveURL(/\/zh$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("经营自己的店");
});

test("/zh keeps the Chinese portal home contract", async ({ page }) => {
  await page.goto("/zh");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("经营自己的店");
  await expect(page.getByRole("combobox", { name: "搜索文档" })).toBeVisible();
});
