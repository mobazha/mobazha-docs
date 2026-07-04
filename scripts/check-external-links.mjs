import { access } from "node:fs/promises";
import { docs } from "../app/lib/docs.ts";

const links = new Set();
for (const doc of docs) {
  if (doc.sourceUrl?.startsWith("https://")) links.add(doc.sourceUrl);
  for (const section of doc.sections) {
    for (const link of section.links ?? []) {
      if (link.href.startsWith("https://")) links.add(link.href);
    }
  }
}

const urls = [...links].sort();
let failed = 0;

async function check(url) {
  try {
    const localPrefix = "https://github.com/mobazha/mobazha-docs/blob/main/";
    if (url.startsWith(localPrefix)) {
      await access(new URL(`../${url.slice(localPrefix.length)}`, import.meta.url));
      console.log(`LOCAL ${url}`);
      return;
    }
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "mobazha-docs-link-check/1.0" },
    });
    if (response.status === 405) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
        headers: { "user-agent": "mobazha-docs-link-check/1.0", range: "bytes=0-0" },
      });
    }
    const accepted = response.ok || response.status === 403 || response.status === 429;
    console.log(`${response.status} ${url}`);
    if (!accepted) failed += 1;
  } catch (error) {
    console.error(`ERR ${url}: ${error.message}`);
    failed += 1;
  }
}

for (let offset = 0; offset < urls.length; offset += 6) {
  await Promise.all(urls.slice(offset, offset + 6).map(check));
}

console.log(`checked=${urls.length} failed=${failed}`);
if (failed) process.exit(1);
