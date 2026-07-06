import Link from "next/link";

type PortalLink = {
  label: string;
  href: string;
  description: string;
};

type PortalJourney = {
  title: string;
  description: string;
  links: PortalLink[];
};

type PortalContent = {
  eyebrow: string;
  title: string;
  summary: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  principlesTitle: string;
  principles: Array<{ label: string; title: string; description: string }>;
  quickLinksTitle: string;
  journeys: PortalJourney[];
  quickLinks: Array<{ label: string; href: string; external?: boolean }>;
};

const portalContent: Record<"en" | "zh-CN", PortalContent> = {
  en: {
    eyebrow: "Independent commerce, connected",
    title: "Own your store. Connect your community. Trade on inspectable terms.",
    summary:
      "Mobazha brings independent stores, operator-selected Nodes, community distribution, verifiable transaction state, and bounded Agent automation into one open commerce system.",
    primaryAction: { label: "See how Mobazha works", href: "/project/product-map" },
    secondaryAction: { label: "Choose an operating path", href: "/start/choose-deployment" },
    principlesTitle: "One system, four product promises",
    principles: [
      { label: "01", title: "Own", description: "Keep store identity, policy, data, and operating choices explicit." },
      { label: "02", title: "Connect", description: "Reach buyers through independent storefronts, communities, and integrations." },
      { label: "03", title: "Trade", description: "Use backend-owned order state and payment paths with visible terms." },
      { label: "04", title: "Extend", description: "Add services and Agent workflows without handing them Core authority." },
    ],
    quickLinksTitle: "Quick links",
    journeys: [
      {
        title: "Buy or sell",
        description: "Complete a transaction with the store and backend that own it.",
        links: [
          { label: "Buy", href: "/buy", description: "Checkout, tracking, refunds" },
          { label: "Sell", href: "/sell", description: "Store setup, listings, orders" },
          { label: "Guest checkout", href: "/buy/guest-checkout", description: "Recoverable anonymous orders" },
        ],
      },
      {
        title: "Run your own Node",
        description: "Choose an independent or hosted operating path without changing commerce semantics.",
        links: [
          { label: "Self-host overview", href: "/self-host", description: "Choose an operating path" },
          { label: "Install", href: "/self-host/install", description: "Evaluation quick start" },
          { label: "Backup and upgrade", href: "/self-host/backup-and-upgrade", description: "Recovery planning" },
        ],
      },
      {
        title: "Build and automate",
        description: "Integrate through public contracts and keep authority at the Core boundary.",
        links: [
          { label: "Developer overview", href: "/build", description: "Public integration surfaces" },
          { label: "Quickstart", href: "/build/quickstart", description: "First authenticated API call" },
          { label: "API reference", href: "/api-reference", description: "Search operations and schemas" },
        ],
      },
      {
        title: "Understand the system",
        description: "Trace the product model, architecture, economics, and current maturity.",
        links: [
          { label: "Product map", href: "/project/product-map", description: "How stores, Nodes, channels, and services fit" },
          { label: "Whitepaper", href: "/project/whitepaper", description: "Long-term principles" },
          { label: "Fees and economics", href: "/project/fees", description: "Cost categories and policy" },
        ],
      },
    ],
    quickLinks: [
      { label: "Hosted app", href: "https://app.mobazha.org", external: true },
      { label: "Agent guide", href: "/agents" },
      { label: "llms.txt", href: "/llms.txt" },
      { label: "Docs index", href: "/docs-index.json" },
      { label: "OpenAPI JSON", href: "/openapi.json" },
    ],
  },
  "zh-CN": {
    eyebrow: "自主经营，开放连接",
    title: "经营自己的店，连接自己的社群，在可核验的规则下完成交易。",
    summary:
      "Mobazha 把独立店铺、运营者选择的 Node、社群分发、可核验的交易状态和受控的 Agent 自动化连接成一套开放商业系统。",
    primaryAction: { label: "了解 Mobazha 如何运作", href: "/zh/project/product-map" },
    secondaryAction: { label: "选择运行方式", href: "/zh/start/choose-deployment" },
    principlesTitle: "一个系统，四项产品承诺",
    principles: [
      { label: "01", title: "自主", description: "明确掌握店铺身份、政策、数据和运行方式。" },
      { label: "02", title: "连接", description: "通过独立店面、社群和集成触达买家。" },
      { label: "03", title: "交易", description: "依据后端权威订单状态和条款透明的支付路径完成交易。" },
      { label: "04", title: "扩展", description: "接入服务和 Agent 工作流，但不把 Core 权限交给扩展。" },
    ],
    quickLinksTitle: "快速链接",
    journeys: [
      {
        title: "购买或销售",
        description: "围绕真正拥有订单的店铺和后端完成交易。",
        links: [
          { label: "买家指南", href: "/zh/buy", description: "结账、跟踪、退款与争议" },
          { label: "卖家指南", href: "/zh/sell", description: "开店、上架、订单处理" },
          { label: "选择托管方式", href: "/zh/start/choose-deployment", description: "SaaS、自托管或本地节点" },
        ],
      },
      {
        title: "运行自己的 Node",
        description: "选择独立或托管路径，同时保持一致的商业语义。",
        links: [
          { label: "节点概览", href: "/zh/self-host", description: "选择运营路径" },
          { label: "安装", href: "/zh/self-host/install", description: "评估环境快速开始" },
        ],
      },
      {
        title: "开发与自动化",
        description: "通过公开契约集成，并把业务权威留在 Core 边界。",
        links: [
          { label: "开发者概览", href: "/zh/build", description: "公开集成面" },
          { label: "运行时能力", href: "/zh/build/runtime-capabilities", description: "按后端能力 fail-closed" },
          { label: "API 参考", href: "/api-reference", description: "搜索接口与 schema（英文界面）" },
        ],
      },
      {
        title: "理解整个系统",
        description: "理解产品模型、架构、经济边界和当前成熟度。",
        links: [
          { label: "产品地图", href: "/zh/project/product-map", description: "店铺、Node、渠道与服务如何组合" },
          { label: "白皮书", href: "/zh/project/whitepaper", description: "长期原则" },
          { label: "收费与经济模式", href: "/zh/project/fees", description: "费用类别与政策" },
        ],
      },
    ],
    quickLinks: [
      { label: "托管应用", href: "https://app.mobazha.org", external: true },
      { label: "Agent 指南", href: "/zh/agents" },
      { label: "llms.txt", href: "/llms.txt" },
      { label: "文档索引", href: "/docs-index.json" },
      { label: "OpenAPI JSON", href: "/openapi.json" },
    ],
  },
};

export function PortalHome({ language = "en" }: { language?: "en" | "zh-CN" }) {
  const content = portalContent[language];

  return (
    <div className="portal-home">
      <header className="portal-home-header">
        <p className="portal-eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.summary}</p>
        <div className="portal-home-actions">
          <Link className="doc-primary-action" href={content.primaryAction.href}>
            {content.primaryAction.label}<span aria-hidden="true">→</span>
          </Link>
          <a className="portal-secondary-action" href={content.secondaryAction.href}>
            {content.secondaryAction.label}
          </a>
        </div>
      </header>

      <section className="portal-principles" aria-labelledby="portal-principles-title">
        <div className="portal-section-heading">
          <p>{content.eyebrow}</p>
          <h2 id="portal-principles-title">{content.principlesTitle}</h2>
        </div>
        <ol>
          {content.principles.map((principle) => (
            <li key={principle.label}>
              <span>{principle.label}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="portal-journey-grid">
        {content.journeys.map((journey) => (
          <section className="portal-journey-card" key={journey.title}>
            <h2>{journey.title}</h2>
            <p>{journey.description}</p>
            <ul>
              {journey.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span>{link.label}</span>
                    <small>{link.description}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="portal-quick-links" aria-label={content.quickLinksTitle}>
        <h2>{content.quickLinksTitle}</h2>
        <div>
          {content.quickLinks.map((link) => (
            link.external
              ? <a href={link.href} key={link.href}>{link.label} ↗</a>
              : <Link href={link.href} key={link.href}>{link.label}</Link>
          ))}
        </div>
      </section>
    </div>
  );
}
