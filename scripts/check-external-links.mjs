import { access } from "node:fs/promises";
import { docs } from "./load-docs.mjs";
import { documentLinks } from "./content-files.mjs";
import visualEvidence from "../visual-evidence.json" with { type: "json" };
import videoCatalog from "../content/videos.json" with { type: "json" };

const links = new Set();
for (const doc of docs) {
  if (doc.evidenceUrl?.startsWith("https://")) links.add(doc.evidenceUrl);
  for (const link of documentLinks(doc)) if (link.startsWith("https://")) links.add(link);
}
for (const visual of visualEvidence.visuals) {
  if (visual.source?.startsWith("https://")) links.add(visual.source);
}
for (const video of videoCatalog.videos) {
  links.add(video.media.video.url);
  links.add(video.media.cover.url);
  links.add(video.media.poster.url);
  for (const caption of video.media.captions ?? []) links.add(caption.url);
  links.add(video.evidence.url);
}

const urls = [...links].sort();
let failed = 0;

async function check(url) {
  const localPrefixes = [
    "https://github.com/mobazha/mobazha-docs/blob/main/",
    "https://github.com/mobazha/mobazha-docs/tree/main/",
  ];
  for (const localPrefix of localPrefixes) {
    if (url.startsWith(localPrefix)) {
      await access(new URL(`../${url.slice(localPrefix.length)}`, import.meta.url));
      console.log(`LOCAL ${url}`);
      return;
    }
  }

  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
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
      if (accepted) {
        console.log(`${response.status} ${url}`);
        return;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt === 1) console.warn(`RETRY ${url}: ${lastError.message}`);
  }

  console.error(`ERR ${url}: ${lastError?.message ?? "unknown error"}`);
  failed += 1;
}

for (let offset = 0; offset < urls.length; offset += 6) {
  await Promise.all(urls.slice(offset, offset + 6).map(check));
}

console.log(`checked=${urls.length} failed=${failed}`);
if (failed) process.exit(1);
