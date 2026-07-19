import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/app/components/DocsShell";
import { VideoCatalog } from "@/app/components/VideoCatalog";
import { videos } from "@/app/lib/videos";

export const metadata: Metadata = {
  title: "Product demos",
  description: "See how sellers, promoters, and buyers use Mobazha to build stores, grow sales, and complete purchases.",
  alternates: { canonical: "/demos" },
};

const paths = [
  ["Build your storefront", "Make your store feel like your brand, select what you want to sell, then publish with confidence.", "/demos/storefront-makeover"],
  ["Grow through recommendations", "Give partners one link to share and let every attributed sale reward the right people.", "/demos/seller-affiliate-loop"],
  ["Buy with confidence", "See one purchase move from a clear offer to payment, delivery, and protection in the same place.", "/demos/protected-digital-sale"],
] as const;

export default function DemosPage() {
  return (
    <DocsShell activePath="/demos">
      <div className="doc-page doc-page-hub video-hub">
        <div className="doc-breadcrumb"><Link href="/">Docs</Link><span>/</span><span>Product demos</span></div>

        <section className="demo-hero" aria-labelledby="demos-title">
          <div>
            <span>Mobazha in action</span>
            <h1 id="demos-title">See commerce move from first click to completed sale.</h1>
            <p>These journeys show what people come to Mobazha to do: make a storefront their own, turn recommendations into sales, and buy with confidence.</p>
            <div className="demo-hero-actions">
              <Link className="doc-primary-action" href="/sell">Start selling <span aria-hidden="true">→</span></Link>
              <a href="#journeys">Explore the journeys <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <ul aria-label="What the demos show">
            <li><b>Your store</b><span>Own the experience your buyers see.</span></li>
            <li><b>Your growth</b><span>Make every recommendation count.</span></li>
            <li><b>Your order</b><span>Keep payment, delivery, and support together.</span></li>
          </ul>
        </section>

        <section className="video-section demo-start" aria-labelledby="choose-outcome">
          <div className="video-section-heading">
            <div><span>Start with your goal</span><h2 id="choose-outcome">What do you want to make happen?</h2></div>
            <p>Choose the story that feels most like the next thing you need to do.</p>
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

        <section className="video-section" id="journeys" aria-labelledby="journeys-title">
          <div className="video-section-heading">
            <div><span>See the full journey</span><h2 id="journeys-title">Watch Mobazha at work</h2></div>
            <p>Each video follows a complete story, at the pace the story needs. Open the one that answers your question.</p>
          </div>
          <VideoCatalog items={videos} />
        </section>
      </div>
    </DocsShell>
  );
}
