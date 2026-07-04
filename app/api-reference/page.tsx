import type { Metadata } from "next";
import Link from "next/link";
import { ApiReference } from "@/app/components/ApiReference";
import { SiteHeader } from "@/app/components/DocsShell";
import metadata from "@/app/lib/generated-openapi-metadata.json";

export const metadata: Metadata = {
  title: "Mobazha Node API Reference",
  description: "Search the reviewed Mobazha Node HTTP operations, schemas, authentication requirements, and response contracts.",
  alternates: { canonical: "/api-reference" },
};

export default function ApiReferencePage() {
  return (
    <main id="main-content" className="api-reference-page" tabIndex={-1}>
      <a className="skip-link" href="#api-reference">Skip to API reference</a>
      <SiteHeader activePath="/api-reference" />
      <header className="api-reference-intro">
        <div>
          <p className="portal-eyebrow">Build · Reference</p>
          <h1>Mobazha Node API</h1>
          <p>
            Search the reviewed HTTP contract. Runtime capabilities from the Node you connect to remain authoritative.
          </p>
        </div>
        <dl aria-label="API contract metadata">
          <div><dt>API contract</dt><dd>{metadata.apiVersion}</dd></div>
          <div><dt>OpenAPI</dt><dd>{metadata.openapiVersion}</dd></div>
          <div><dt>Reviewed source</dt><dd><a href={metadata.sourceUrl}>{metadata.shortRevision} ↗</a></dd></div>
          <div><dt>Coverage</dt><dd>{metadata.operationCount} operations</dd></div>
        </dl>
        <aside>
          <b>Read-only reference</b>
          <span>Try It is disabled. Code samples use the default local Node address; replace it with a Node you operate or trust.</span>
          <Link href="/build/api">Read the integration guide →</Link>
        </aside>
      </header>
      <section id="api-reference" className="api-reference-surface" aria-label="OpenAPI reference">
        <ApiReference specificationUrl={metadata.publicPath} />
      </section>
    </main>
  );
}
