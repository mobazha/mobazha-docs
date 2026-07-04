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
  quickLinksTitle: string;
  journeys: PortalJourney[];
  quickLinks: Array<{ label: string; href: string; external?: boolean }>;
};

const portalContent: Record<"en" | "zh-CN", PortalContent> = {
  en: {
    eyebrow: "Mobazha documentation",
    title: "Trusted guides for buyers, sellers, operators, and developers.",
    summary:
      "Choose a journey below. Task pages expose outcomes, primary actions, and source-backed guidance without hiding lifecycle or applicability details.",
    primaryAction: { label: "Start buying", href: "/buy" },
    secondaryAction: { label: "Open hosted app", href: "https://app.mobazha.org" },
    quickLinksTitle: "Quick links",
    journeys: [
      {
        title: "Use Mobazha",
        description: "Buy from independent stores or run a seller workflow.",
        links: [
          { label: "Buy", href: "/buy", description: "Checkout, tracking, refunds" },
          { label: "Sell", href: "/sell", description: "Store setup, listings, orders" },
          { label: "Guest checkout", href: "/buy/guest-checkout", description: "Recoverable anonymous orders" },
        ],
      },
      {
        title: "Operate",
        description: "Install, configure, and maintain a Node you control.",
        links: [
          { label: "Self-host overview", href: "/self-host", description: "Choose an operating path" },
          { label: "Install", href: "/self-host/install", description: "Evaluation quick start" },
          { label: "Backup and upgrade", href: "/self-host/backup-and-upgrade", description: "Recovery planning" },
        ],
      },
      {
        title: "Build",
        description: "Integrate through HTTP, events, MCP, and webhooks.",
        links: [
          { label: "Developer overview", href: "/build", description: "Public integration surfaces" },
          { label: "Quickstart", href: "/build/quickstart", description: "First authenticated API call" },
          { label: "API reference", href: "/api-reference", description: "Search operations and schemas" },
        ],
      },
      {
        title: "Understand",
        description: "Architecture, economics, security, and release scope.",
        links: [
          { label: "Project overview", href: "/project", description: "How the stack fits together" },
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
    eyebrow: "Mobazha 文档",
    title: "面向买家、卖家、运营者和开发者的可信指南。",
    summary:
      "从下面的路径进入。任务页会给出结果、主要操作和来源依据，同时保留生命周期与适用范围信息。",
    primaryAction: { label: "开始购买", href: "/zh/buy" },
    secondaryAction: { label: "打开托管应用", href: "https://app.mobazha.org" },
    quickLinksTitle: "快速链接",
    journeys: [
      {
        title: "使用 Mobazha",
        description: "从独立商店购买，或运行卖家工作流。",
        links: [
          { label: "买家指南", href: "/zh/buy", description: "结账、跟踪、退款与争议" },
          { label: "卖家指南", href: "/zh/sell", description: "开店、上架、订单处理" },
          { label: "选择托管方式", href: "/zh/start/choose-deployment", description: "SaaS、自托管或本地节点" },
        ],
      },
      {
        title: "自行托管",
        description: "安装、配置并维护你控制的 Node。",
        links: [
          { label: "节点概览", href: "/zh/self-host", description: "选择运营路径" },
          { label: "安装", href: "/zh/self-host/install", description: "评估环境快速开始" },
        ],
      },
      {
        title: "开发",
        description: "通过 HTTP、事件、MCP 与 Webhook 集成。",
        links: [
          { label: "开发者概览", href: "/zh/build", description: "公开集成面" },
          { label: "运行时能力", href: "/zh/build/runtime-capabilities", description: "按后端能力 fail-closed" },
          { label: "API 参考", href: "/api-reference", description: "搜索接口与 schema（英文界面）" },
        ],
      },
      {
        title: "项目与信任",
        description: "架构、经济模式、安全与发布范围。",
        links: [
          { label: "白皮书", href: "/zh/project/whitepaper", description: "长期原则" },
          { label: "收费与经济模式", href: "/zh/project/fees", description: "费用类别与政策" },
          { label: "获取帮助", href: "/zh/support", description: "问题反馈与支持路径" },
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
