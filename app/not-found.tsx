import Link from "next/link";
import { SiteHeader } from "@/app/components/DocsShell";

export default function NotFound() {
  return (
    <main>
      <SiteHeader />
      <section className="not-found">
        <p>404 · DOCUMENT NOT FOUND</p>
        <h1>This path is not part of the current knowledge surface.</h1>
        <span>
          Start from a task, search the documentation, or report a broken public link.
        </span>
        <div>
          <Link className="primary-action" href="/start">Browse documentation →</Link>
          <a className="secondary-action" href="https://github.com/mobazha/mobazha-docs/issues/new">Report a broken link</a>
        </div>
      </section>
    </main>
  );
}
