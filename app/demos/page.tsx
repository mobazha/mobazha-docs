import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/app/components/DocsShell";
import { DocumentHero, TrustPanel } from "@/app/components/DocumentExperience";
import { PageToolbar } from "@/app/components/PageToolbar";
import { VideoCatalog } from "@/app/components/VideoCatalog";
import { docsBySlug } from "@/app/lib/docs";
import { featuredVideos, videos } from "@/app/lib/videos";

export const metadata: Metadata = {
  title: "Product demos",
  description: "Choose a real Mobazha product journey by outcome, then watch only the walkthrough you need.",
  alternates: { canonical: "/demos" },
};

const labels = {
  audience: "Audience",
  appliesTo: "Applies to",
  reviewed: "Last reviewed",
  version: "Document version",
  lastTested: "Last tested",
  authority: "Knowledge authority",
  evidence: "Implementation evidence",
  trust: "Trust, applicability, and sources",
  estimatedTime: "Estimated time",
  onThisPage: "On this page",
};

const paths = [
  ["Sell", "Build a branded storefront and publish products.", "#sell"],
  ["Buy safely", "Understand payment, delivery, cancellation, refund, and dispute paths.", "/buy/cancel-refund-dispute"],
  ["Grow & operate", "See attribution, promoters, and community-market outcomes.", "#grow-and-operate"],
  ["Run & build", "Install the stack or work from the public API contract.", "/self-host"],
] as const;

export default function DemosPage() {
  const doc = docsBySlug.get("demos");
  if (!doc) return null;
  const sellerVideos = videos.filter((video) => video.goals.includes("Sell"));
  const growthVideos = videos.filter((video) => video.goals.some((goal) => goal === "Grow" || goal === "Operate"));

  return (
    <DocsShell activePath="/demos">
      <div className="doc-page doc-page-hub video-hub">
        <div className="doc-breadcrumb"><Link href="/">Docs</Link><span>/</span><span>demos</span></div>
        <PageToolbar doc={doc} isChinese={false} />
        <DocumentHero doc={doc} isChinese={false} labels={labels} statusLabel={doc.status} />
        <TrustPanel doc={doc} labels={labels} />

        <section className="video-section" aria-labelledby="choose-outcome">
          <div className="video-section-heading">
            <div><span>Start here</span><h2 id="choose-outcome">Choose by outcome</h2></div>
            <p>Pick the result you need; each detail page includes scope, chapters, evidence, and related guidance.</p>
          </div>
          <div className="video-path-grid">
            {paths.map(([title, description, href]) => (
              <Link className="video-path-card" href={href} key={title}>
                <strong>{title}<span aria-hidden="true">→</span></strong>
                <span>{description}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="video-section" aria-labelledby="featured-videos">
          <div className="video-section-heading">
            <div><span>End-to-end stories</span><h2 id="featured-videos">Featured journeys</h2></div>
            <p>Multi-role flows that end in a visible product or transaction outcome.</p>
          </div>
          <VideoCatalog items={featuredVideos} />
        </section>

        <section className="video-section" id="sell" aria-labelledby="seller-videos">
          <div className="video-section-heading">
            <div><span>Seller</span><h2 id="seller-videos">Sell and shape a storefront</h2></div>
          </div>
          <VideoCatalog items={sellerVideos} />
        </section>

        <section className="video-section" id="grow-and-operate" aria-labelledby="growth-videos">
          <div className="video-section-heading">
            <div><span>Operator & promoter</span><h2 id="growth-videos">Grow and operate</h2></div>
          </div>
          <VideoCatalog items={growthVideos} />
        </section>

        <section className="video-method" aria-labelledby="video-method">
          <span>How these are made</span>
          <h2 id="video-method">Real runs, explicit scope</h2>
          <p>Each demo is a scripted, re-recordable run of the product. Preview capability is labeled, payment footage identifies the test network, and the public registry preserves the media digest, recording date, applicability, and evidence.</p>
          <div><a href="/videos.json">Video registry ↗</a><a href="/videos.schema.json">Registry schema ↗</a></div>
        </section>
      </div>
    </DocsShell>
  );
}
