import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/app/components/DocsShell";
import { VideoCatalog } from "@/app/components/VideoCatalog";
import { localizeVideo } from "@/app/lib/video-locales";
import { featuredVideos, videos } from "@/app/lib/videos";

export const metadata: Metadata = {
  title: "产品演示",
  description: "看看卖家、推广者与买家如何用 Mobazha 开店、增长销售并完成购买。",
  alternates: {
    canonical: "/zh/demos",
    languages: {
      en: "/demos",
      "zh-CN": "/zh/demos",
    },
  },
};

const localizedFeatured = featuredVideos.map((video) => localizeVideo(video, "zh-CN"));
const localizedMore = videos
  .filter((video) => !video.featured)
  .map((video) => localizeVideo(video, "zh-CN"));

export default function ChineseDemosPage() {
  return (
    <DocsShell activePath="/zh/demos">
      <div className="doc-page doc-page-hub video-hub">
        <div className="doc-breadcrumb">
          <Link href="/zh">文档</Link>
          <span>/</span>
          <span>产品演示</span>
        </div>

        <header className="demo-hero demo-hero-compact" aria-labelledby="demos-title">
          <h1 id="demos-title">看 Mobazha 如何完成一笔真实成交。</h1>
          <p>观看店面、推荐或购买如何串起来——然后亲自走同一条流程。</p>
          <a className="doc-primary-action" href="#featured">观看演示 <span aria-hidden="true">↓</span></a>
        </header>

        <section className="video-section" id="featured" aria-labelledby="featured-title">
          <div className="video-section-heading">
            <div>
              <span>从这里开始</span>
              <h2 id="featured-title">三条关键旅程</h2>
            </div>
            <p>选最接近你下一步需求的故事。每张卡片打开完整视频。</p>
          </div>
          <VideoCatalog items={localizedFeatured} variant="featured" language="zh-CN" />
        </section>

        {localizedMore.length > 0 && (
          <section className="video-section" id="more" aria-labelledby="more-title">
            <div className="video-section-heading">
              <div>
                <span>更多场景</span>
                <h2 id="more-title">需要下一步细节时</h2>
              </div>
              <p>店铺品牌与受保护订单恢复，不与主路径竞争注意力。</p>
            </div>
            <VideoCatalog items={localizedMore} language="zh-CN" />
          </section>
        )}
      </div>
    </DocsShell>
  );
}
