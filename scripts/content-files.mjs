import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const contentRoot = fileURLToPath(new URL("../content", import.meta.url));
const supportedLanguages = new Set(["en", "zh-CN"]);
const canonicalBaseUrl = "https://docs.mobazha.org";

function walkMarkdown(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return walkMarkdown(path);
      return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
    })
    .sort();
}

function parseFrontmatter(source, path) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${path} is missing YAML frontmatter`);
  const metadata = YAML.parse(match[1]);
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new Error(`${path} has invalid YAML frontmatter`);
  }
  return { metadata, body: match[2] };
}

function tableCells(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function isTableDelimiter(line) {
  const cells = tableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

export function parseSections(body, path = "<content>") {
  const sections = [];
  let section;
  let paragraph = [];

  const requireSection = () => {
    if (!section) throw new Error(`${path} has content before its first level-two heading`);
    return section;
  };
  const addBlock = (block) => {
    const current = requireSection();
    current.blocks ??= [];
    current.blocks.push(block);
  };
  const flushParagraph = () => {
    if (!paragraph.length) return;
    addBlock({ type: "paragraph", text: paragraph.join(" ").trim() });
    paragraph = [];
  };
  const finishSection = () => {
    flushParagraph();
    if (section) sections.push(section);
  };

  const lines = body.trim().split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trimEnd();

    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      finishSection();
      section = { heading: heading[1].trim(), blocks: [] };
      continue;
    }
    const subheading = line.match(/^###\s+(.+)$/);
    if (subheading) {
      flushParagraph();
      addBlock({ type: "heading", level: 3, text: subheading[1].trim() });
      continue;
    }
    if (/^#{1,2}\s+|^#{4,6}\s+/.test(line)) {
      throw new Error(`${path} uses an unsupported heading level: ${line}`);
    }

    const fence = line.match(/^```([^`]*)$/);
    if (fence) {
      flushParagraph();
      const code = [];
      let closed = false;
      for (index += 1; index < lines.length; index += 1) {
        if (lines[index].trimEnd().startsWith("```")) {
          closed = true;
          break;
        }
        code.push(lines[index]);
      }
      if (!closed) throw new Error(`${path} has an unclosed code fence`);
      addBlock({ type: "code", language: fence[1].trim() || "text", code: code.join("\n") });
      continue;
    }

    const callout = line.match(/^>\s*\*\*(Important|Warning|Note|Tip):\*\*\s*(.*)$/i);
    if (callout) {
      flushParagraph();
      const text = [callout[2].trim()];
      while (index + 1 < lines.length && /^>\s*/.test(lines[index + 1])) {
        index += 1;
        text.push(lines[index].replace(/^>\s*/, "").trim());
      }
      addBlock({ type: "callout", tone: callout[1].toLowerCase(), text: text.filter(Boolean).join(" ") });
      continue;
    }
    if (line.startsWith(">")) {
      throw new Error(`${path} uses an unsupported blockquote; use an Important, Warning, Note, or Tip callout`);
    }

    const image = line.match(/^!\[([^\]]*)\]\((\S+)(?:\s+"([^"]+)")?\)$/);
    if (image) {
      flushParagraph();
      addBlock({ type: "image", alt: image[1], src: image[2], ...(image[3] ? { caption: image[3] } : {}) });
      continue;
    }

    if (line.startsWith("|") && index + 1 < lines.length && isTableDelimiter(lines[index + 1])) {
      flushParagraph();
      const headers = tableCells(line);
      if (tableCells(lines[index + 1]).length !== headers.length) {
        throw new Error(`${path} has a table delimiter with the wrong number of cells`);
      }
      const rows = [];
      index += 1;
      while (index + 1 < lines.length && lines[index + 1].trim().startsWith("|")) {
        index += 1;
        const cells = tableCells(lines[index]);
        if (cells.length !== headers.length) throw new Error(`${path} has a table row with the wrong number of cells`);
        rows.push(cells);
      }
      addBlock({ type: "table", headers, rows });
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      const items = [ordered[1].trim()];
      while (index + 1 < lines.length) {
        const next = lines[index + 1].match(/^\d+\.\s+(.+)$/);
        if (!next) break;
        index += 1;
        items.push(next[1].trim());
      }
      addBlock({ type: "ordered-list", items });
      continue;
    }

    const link = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)(?:\s+—\s+(.+))?$/);
    if (link) {
      flushParagraph();
      const items = [];
      let current = link;
      while (current) {
        items.push({ label: current[1], href: current[2], ...(current[3] ? { description: current[3].trim() } : {}) });
        const next = lines[index + 1]?.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)(?:\s+—\s+(.+))?$/);
        if (!next) break;
        index += 1;
        current = next;
      }
      addBlock({ type: "links", items });
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      const items = [bullet[1].trim()];
      while (index + 1 < lines.length) {
        const next = lines[index + 1].match(/^-\s+(.+)$/);
        if (!next || /^\[([^\]]+)\]\(([^)]+)\)(?:\s+—\s+(.+))?$/.test(next[1])) break;
        index += 1;
        items.push(next[1].trim());
      }
      addBlock({ type: "unordered-list", items });
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      addBlock({ type: "separator" });
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      continue;
    }
    paragraph.push(line.trim());
  }

  finishSection();
  if (!sections.length) throw new Error(`${path} has no sections`);
  return sections;
}

function blockStrings(block) {
  if (["paragraph", "heading", "callout"].includes(block.type)) return [block.text];
  if (["ordered-list", "unordered-list"].includes(block.type)) return block.items;
  if (block.type === "links") return block.items.flatMap((item) => [item.label, item.description ?? ""]);
  if (block.type === "table") return [...block.headers, ...block.rows.flat()];
  if (block.type === "image") return [block.alt, block.caption ?? ""];
  return [];
}

export function documentLinks(doc) {
  const links = new Set();
  for (const section of doc.sections) {
    for (const block of section.blocks ?? []) {
      if (block.type === "links") for (const item of block.items) links.add(item.href);
      if (block.type === "image") links.add(block.src);
      for (const text of blockStrings(block)) {
        for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) links.add(match[1]);
      }
    }
  }
  return [...links];
}

export function documentText(doc) {
  return doc.sections.flatMap((section) => [
    section.heading,
    ...(section.blocks ?? []).flatMap((block) => {
      if (block.type === "code") return [`\`\`\`${block.language}`, block.code, "```"];
      if (block.type === "separator") return ["---"];
      return blockStrings(block);
    }),
  ]).filter(Boolean).join("\n");
}

function documentIdentity(path) {
  const relativePath = relative(contentRoot, path).split(sep).join("/");
  const [language, ...parts] = relativePath.replace(/\.md$/, "").split("/");
  if (!supportedLanguages.has(language)) {
    throw new Error(`${path} is outside a supported language directory`);
  }
  const localSlug = parts.join("/");
  if (!localSlug) throw new Error(`${path} has no document slug`);
  return {
    language,
    slug: language === "zh-CN" ? `zh/${localSlug}` : localSlug,
  };
}

export function loadContentDocuments() {
  return walkMarkdown(contentRoot).map((path) => {
    const { language, slug } = documentIdentity(path);
    const { metadata, body } = parseFrontmatter(readFileSync(path, "utf8"), path);
    return {
      slug,
      title: metadata.title,
      summary: metadata.summary,
      status: metadata.status,
      audiences: metadata.audiences,
      authorityKind: "public-knowledge",
      authorityLabel: metadata.authorityLabel ?? metadata.title,
      authorityUrl: `${canonicalBaseUrl}/${slug}`,
      evidenceLabel: metadata.evidenceLabel,
      ...(metadata.evidenceUrl ? { evidenceUrl: metadata.evidenceUrl } : {}),
      reviewed: metadata.reviewed,
      ...(metadata.version ? { version: metadata.version } : {}),
      ...(metadata.appliesTo ? { appliesTo: metadata.appliesTo } : {}),
      pageType: metadata.pageType ?? "concept",
      ...(metadata.lastTested ? { lastTested: metadata.lastTested } : {}),
      ...(metadata.outcome ? { outcome: metadata.outcome } : {}),
      ...(metadata.estimatedTime ? { estimatedTime: metadata.estimatedTime } : {}),
      ...(metadata.journey ? { journey: metadata.journey } : {}),
      ...(metadata.primaryAction ? { primaryAction: metadata.primaryAction } : {}),
      ...(metadata.featuredVisual ? { featuredVisual: metadata.featuredVisual } : {}),
      language,
      ...(metadata.translationOf ? { translationOf: metadata.translationOf } : {}),
      sections: parseSections(body, path),
    };
  });
}

export function renderDocumentRegistry(documents) {
  return `${JSON.stringify(documents, null, 2)}\n`;
}
