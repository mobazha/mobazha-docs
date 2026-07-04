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

function parseSections(body, path) {
  const sections = [];
  let section;
  let paragraph = [];
  let code;

  const requireSection = () => {
    if (!section) throw new Error(`${path} has content before its first level-two heading`);
    return section;
  };
  const flushParagraph = () => {
    if (!paragraph.length) return;
    const current = requireSection();
    current.body ??= [];
    current.body.push(paragraph.join(" ").trim());
    paragraph = [];
  };
  const finishSection = () => {
    flushParagraph();
    if (section) sections.push(section);
  };

  for (const rawLine of body.trim().split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (code) {
      if (line.startsWith("```")) {
        requireSection().code = code.join("\n");
        code = undefined;
      } else {
        code.push(rawLine);
      }
      continue;
    }

    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      finishSection();
      section = { heading: heading[1].trim() };
      continue;
    }
    if (/^#{1,6}\s+/.test(line)) {
      throw new Error(`${path} uses an unsupported heading level: ${line}`);
    }
    if (line.startsWith("```")) {
      flushParagraph();
      code = [];
      continue;
    }
    const note = line.match(/^>\s*\*\*Important:\*\*\s*(.+)$/);
    if (note) {
      flushParagraph();
      requireSection().note = note[1].trim();
      continue;
    }
    const continuedNote = line.match(/^>\s*(.+)$/);
    if (continuedNote && section?.note) {
      section.note = `${section.note} ${continuedNote[1].trim()}`;
      continue;
    }
    if (line.startsWith(">")) {
      throw new Error(`${path} uses an unsupported blockquote; use an Important note`);
    }
    const link = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)(?:\s+—\s+(.+))?$/);
    if (link) {
      flushParagraph();
      const current = requireSection();
      current.links ??= [];
      current.links.push({
        label: link[1],
        href: link[2],
        ...(link[3] ? { description: link[3].trim() } : {}),
      });
      continue;
    }
    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      const current = requireSection();
      current.bullets ??= [];
      current.bullets.push(bullet[1].trim());
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      throw new Error(`${path} uses an unsupported ordered list`);
    }
    if (!line.trim()) {
      flushParagraph();
      continue;
    }
    paragraph.push(line.trim());
  }

  if (code) throw new Error(`${path} has an unclosed code fence`);
  finishSection();
  if (!sections.length) throw new Error(`${path} has no sections`);
  return sections;
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
      language,
      ...(metadata.translationOf ? { translationOf: metadata.translationOf } : {}),
      sections: parseSections(body, path),
    };
  });
}

export function renderDocumentRegistry(documents) {
  return `${JSON.stringify(documents, null, 2)}\n`;
}
