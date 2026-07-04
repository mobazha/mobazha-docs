import { CopyPageButton } from "@/app/components/CopyPageButton";
import { docPageToMarkdown } from "@/app/lib/markdown";
import type { DocPage } from "@/app/lib/docs";

export function PageToolbar({ doc, isChinese }: { doc: DocPage; isChinese: boolean }) {
  const markdown = docPageToMarkdown(doc);
  const labels = isChinese
    ? { copy: "复制页面", markdown: "Markdown", reviewed: "审阅" }
    : { copy: "Copy page", markdown: "Markdown", reviewed: "Reviewed" };

  return (
    <div className="page-toolbar">
      <span className="page-toolbar-meta">
        {labels.reviewed} {doc.reviewed}
      </span>
      <div className="page-toolbar-actions">
        <CopyPageButton label={labels.copy} markdown={markdown} />
        <a
          className="page-toolbar-button"
          download={`${doc.slug.replaceAll("/", "-")}.md`}
          href={`data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`}
        >
          {labels.markdown}
        </a>
      </div>
    </div>
  );
}
