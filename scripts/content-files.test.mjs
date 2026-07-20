import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { documentLinks, documentText, parseSections } from "./content-files.mjs";
import { validateVideoCatalog } from "./video-files.mjs";

test("preserves rich Markdown block order", () => {
  const sections = parseSections(`
## Prepare

Read **the policy** and use \`testnet\`.

### Requirements

1. Install Git.
2. Create a backup.

| Check | Expected |
|---|---|
| Health | ready |

\`\`\`bash
mobazha doctor --json
\`\`\`

> **Warning:** Do not expose the admin API.

- [Next step](/self-host/configure) — Configure the node.
`, "fixture.md");

  assert.deepEqual(sections[0].blocks.map((block) => block.type), [
    "paragraph",
    "heading",
    "ordered-list",
    "table",
    "code",
    "callout",
    "links",
  ]);
  assert.equal(sections[0].blocks[4].language, "bash");
  assert.equal(sections[0].blocks[5].tone, "warning");
  assert.match(documentText({ sections }), /```bash\nmobazha doctor --json\n```/);
});

test("parses stable registry-backed video references", () => {
  const sections = parseSections(`
## Watch

!video-ref[0004]
`, "video-reference.md");
  assert.deepEqual(sections[0].blocks, [{ type: "video-ref", videoId: "0004", mode: "poster" }]);
  assert.match(documentText({ sections }), /Video 0004/);
});

test("rejects malformed registry-backed video references", () => {
  assert.throws(() => parseSections(`
## Watch

!video-ref[storefront]
`, "bad-video-reference.md"), /invalid video reference/);
});

test("collects card, inline, and image links", () => {
  const doc = {
    sections: parseSections(`
## Links

Read the [policy](/project/fees).

![Diagram](https://docs.mobazha.org/diagram.svg "Architecture")

- [Source](https://github.com/mobazha/mobazha)
`),
  };

  assert.deepEqual(documentLinks(doc).sort(), [
    "/project/fees",
    "https://docs.mobazha.org/diagram.svg",
    "https://github.com/mobazha/mobazha",
  ]);
});

test("rejects malformed tables", () => {
  assert.throws(() => parseSections(`
## Broken

| A | B |
|---|---|
| only one |
`, "broken.md"), /wrong number of cells/);

  assert.throws(() => parseSections(`
## Broken delimiter

| A | B |
|---|
| one | two |
`, "broken-delimiter.md"), /table delimiter with the wrong number of cells/);
});

const videoFixture = () => JSON.parse(readFileSync(new URL("../content/videos.json", import.meta.url), "utf8"));

test("accepts the governed video catalog", () => {
  assert.deepEqual(validateVideoCatalog(videoFixture()), []);
});

test("rejects duplicate video identities and ungoverned media", () => {
  const catalog = videoFixture();
  catalog.videos[1].id = catalog.videos[0].id;
  catalog.videos[1].slug = catalog.videos[0].slug;
  catalog.videos[1].media.video.url = "https://example.com/demo.mp4";
  const failures = validateVideoCatalog(catalog);
  assert(failures.some((failure) => failure.includes("duplicate or invalid id")));
  assert(failures.some((failure) => failure.includes("duplicate or invalid slug")));
  assert(failures.some((failure) => failure.includes("must use https://media.mobazha.org/")));
});

test("rejects more than three featured videos", () => {
  const catalog = videoFixture();
  catalog.videos.push({ ...structuredClone(catalog.videos[2]), id: "0099", slug: "fourth-featured-video", featured: true });
  catalog.videos[2].featured = true;
  assert(validateVideoCatalog(catalog).some((failure) => failure.includes("maximum is 3")));
});

test("rejects impossible video review chronology", () => {
  const catalog = videoFixture();
  catalog.videos[0].recordedAt = "2099-01-02";
  catalog.videos[0].reviewed = "2099-01-01";
  catalog.videos[1].reviewed = "2099-12-31";
  const failures = validateVideoCatalog(catalog);
  assert(failures.some((failure) => failure.includes("reviewed before it was recorded")));
  assert(failures.some((failure) => failure.includes("newer than the catalog review")));
});

test("rejects duplicate or ungoverned caption tracks", () => {
  const catalog = videoFixture();
  catalog.videos[0].media.captions = [
    { url: "https://example.com/demo.vtt", language: "en", label: "English", kind: "captions", default: true },
    { url: "https://media.mobazha.org/demo-copy.vtt", language: "en", label: "English copy", kind: "captions", default: true },
  ];
  const failures = validateVideoCatalog(catalog);
  assert(failures.some((failure) => failure.includes("must use https://media.mobazha.org/") || failure.includes("docs.mobazha.org/captions/")));
  assert(failures.some((failure) => failure.includes("duplicates en:captions")));
  assert(failures.some((failure) => failure.includes("more than one default caption track")));
});
