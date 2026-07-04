import type { DocBlock, DocPage } from "@/app/lib/docs";

function blockToMarkdown(block: DocBlock): string[] {
  switch (block.type) {
    case "paragraph":
      return [block.text, ""];
    case "heading":
      return [`### ${block.text}`, ""];
    case "unordered-list":
      return [...block.items.map((item) => `- ${item}`), ""];
    case "ordered-list":
      return [...block.items.map((item, index) => `${index + 1}. ${item}`), ""];
    case "code":
      return [`\`\`\`${block.language}`, block.code, "```", ""];
    case "callout":
      return [`> **${block.tone}:** ${block.text}`, ""];
    case "table": {
      const header = `| ${block.headers.join(" | ")} |`;
      const divider = `| ${block.headers.map(() => "---").join(" | ")} |`;
      const rows = block.rows.map((row) => `| ${row.join(" | ")} |`);
      return [header, divider, ...rows, ""];
    }
    case "image":
      return [`![${block.alt}](${block.src})`, block.caption ?? "", ""];
    case "links":
      return [...block.items.map((item) => `- [${item.label}](${item.href})${item.description ? ` — ${item.description}` : ""}`), ""];
    case "separator":
      return ["---", ""];
    default:
      return [];
  }
}

export function docPageToMarkdown(doc: DocPage): string {
  const lines = [
    `# ${doc.title}`,
    "",
    doc.outcome ?? doc.summary,
    "",
  ];

  if (doc.estimatedTime) {
    lines.push(`**Estimated time:** ${doc.estimatedTime}`, "");
  }

  if (doc.primaryAction) {
    lines.push(`**Primary action:** [${doc.primaryAction.label}](${doc.primaryAction.href})`, "");
  }

  lines.push(`**Status:** ${doc.status}`, `**Reviewed:** ${doc.reviewed}`, "");

  for (const section of doc.sections) {
    lines.push(`## ${section.heading}`, "");
    for (const block of section.blocks) {
      lines.push(...blockToMarkdown(block));
    }
  }

  return lines.join("\n").trimEnd();
}
