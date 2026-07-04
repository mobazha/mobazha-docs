import { docs } from "./load-docs.mjs";

const base = (process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const routes = [
  "/",
  ...docs.map((doc) => `/${doc.slug}`),
  "/docs-index.json",
  "/sources.json",
  "/sources.schema.json",
  "/llms.txt",
  "/llms-full.txt",
  "/.well-known/mobazha-docs.json",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.svg",
  "/openapi.json",
];

let failed = 0;
for (const route of routes) {
  try {
    const response = await fetch(`${base}${route}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "mobazha-docs-route-check/1.0" },
    });
    console.log(`${response.status} ${route}`);
    if (!response.ok) failed += 1;
  } catch (error) {
    console.error(`ERR ${route}: ${error.message}`);
    failed += 1;
  }
}

console.log(`checked=${routes.length} failed=${failed} base=${base}`);
if (failed) process.exit(1);
