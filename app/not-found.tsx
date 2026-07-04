import Link from "next/link";
import { SiteHeader } from "@/app/components/DocsShell";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <section className="not-found">
        <p>404 · DOCUMENT NOT FOUND</p>
        <h1>This path is not part of the current knowledge surface.</h1>
        <span>
          Start from a task, search the documentation, or report a broken public link.
        </span>
        <div>
          <Link className="doc-primary-action" href="/">Browse documentation<span aria-hidden="true">→</span></Link>
          <a className="portal-secondary-action" href="https://github.com/mobazha/mobazha-docs/issues/new">Report a broken link</a>
        </div>
      </section>
    </main>
  );
}
