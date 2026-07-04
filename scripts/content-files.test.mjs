import assert from "node:assert/strict";
import test from "node:test";
import { documentLinks, documentText, parseSections } from "./content-files.mjs";

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
