import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/app/components/DocsShell";
import { VideoCatalog } from "@/app/components/VideoCatalog";
import { featuredVideos, videos } from "@/app/lib/videos";

export const metadata: Metadata = {
  title: "Product demos",
  description: "See how sellers, promoters, and buyers use Mobazha to build stores, grow sales, and complete purchases.",
  alternates: { canonical: "/demos" },
};

const moreVideos = videos.filter((video) => !video.featured);

export default function DemosPage() {
  return (
    <DocsShell activePath="/demos">
      <div className="doc-page doc-page-hub video-hub">
        <div className="doc-breadcrumb"><Link href="/">Docs</Link><span>/</span><span>Product demos</span></div>

        <header className="demo-hero demo-hero-compact" aria-labelledby="demos-title">
          <h1 id="demos-title">See Mobazha complete a real sale.</h1>
          <p>Watch how a storefront, a recommendation, or a purchase comes together — then try the same flow yourself.</p>
          <a className="doc-primary-action" href="#featured">Watch a demo <span aria-hidden="true">↓</span></a>
        </header>

        <section className="video-section" id="featured" aria-labelledby="featured-title">
          <div className="video-section-heading">
            <div>
              <span>Start here</span>
              <h2 id="featured-title">Three journeys that matter</h2>
            </div>
            <p>Pick the story closest to what you need next. Each card opens the full video.</p>
          </div>
          <VideoCatalog items={featuredVideos} variant="featured" />
        </section>

        {moreVideos.length > 0 && (
          <section className="video-section" id="more" aria-labelledby="more-title">
            <div className="video-section-heading">
              <div>
                <span>More scenes</span>
                <h2 id="more-title">When you need the next detail</h2>
              </div>
              <p>Store branding and protected-order recovery, without competing with the main paths.</p>
            </div>
            <VideoCatalog items={moreVideos} />
          </section>
        )}
      </div>
    </DocsShell>
  );
}
