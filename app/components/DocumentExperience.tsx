import Image from "next/image";
import Link from "next/link";
import { docApplicability, type DocPage, visualsById } from "@/app/lib/docs";

type ExperienceLabels = {
  audience: string;
  appliesTo: string;
  reviewed: string;
  version: string;
  lastTested: string;
  authority: string;
  evidence: string;
  trust: string;
  estimatedTime: string;
  onThisPage: string;
};

const pageTypeLabels = {
  en: { hub: "Guide", task: "Task", reference: "Reference", concept: "Explainer", policy: "Policy" },
  zh: { hub: "指南", task: "任务", reference: "参考", concept: "说明", policy: "政策" },
};

const journeyLabels = {
  en: { start: "Start", use: "Buy & sell", operate: "Operate", build: "Build", understand: "Understand", community: "Community" },
  zh: { start: "开始", use: "买卖", operate: "运营", build: "开发", understand: "了解", community: "社区" },
};

export function sectionId(heading: string, index: number): string {
  const normalized = heading
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || `section-${index + 1}`;
}

function PrimaryAction({ action }: { action: NonNullable<DocPage["primaryAction"]> }) {
  const content = <>{action.label}<span aria-hidden="true">→</span></>;
  return action.href.startsWith("/")
    ? <Link className="doc-primary-action" href={action.href}>{content}</Link>
    : <a className="doc-primary-action" href={action.href}>{content}</a>;
}

export function DocumentHero({
  doc,
  isChinese,
  statusLabel,
  labels,
}: {
  doc: DocPage;
  isChinese: boolean;
  statusLabel: string;
  labels: ExperienceLabels;
}) {
  const language = isChinese ? "zh" : "en";
  const journey = doc.journey ? journeyLabels[language][doc.journey] : undefined;
  const type = pageTypeLabels[language][doc.pageType];
  const visual = doc.featuredVisual ? visualsById.get(doc.featuredVisual) : undefined;
  const visualKind = isChinese ? "概念模型" : "Conceptual model";
  const visualDetails = isChinese ? "查看证据详情" : "Evidence details";

  return (
    <header className={`doc-title-block doc-title-${doc.pageType}${visual ? " has-featured-visual" : ""}`}>
      <div className="doc-hero-copy">
        <div className="doc-title-context">
          <span className={`doc-status status-${doc.status.toLowerCase()}`}>{statusLabel}</span>
          <span>{journey ? `${journey} · ${type}` : type}</span>
        </div>
        <h1>{doc.title}</h1>
        <p>{doc.outcome ?? doc.summary}</p>
        {(doc.primaryAction || doc.estimatedTime) && (
          <div className="doc-hero-actions">
            {doc.primaryAction && <PrimaryAction action={doc.primaryAction} />}
            {doc.estimatedTime && <span className="doc-time"><b>{labels.estimatedTime}</b>{doc.estimatedTime}</span>}
          </div>
        )}
      </div>
      {visual && (
        <figure className="doc-featured-visual">
          <Image className="visual-desktop" src={visual.src} width={visual.width} height={visual.height} alt={visual.alt} priority />
          {visual.mobile_src && visual.mobile_width && visual.mobile_height && (
            <Image className="visual-mobile" src={visual.mobile_src} width={visual.mobile_width} height={visual.mobile_height} alt={visual.alt} priority />
          )}
          <figcaption>
            <span><b>{visualKind}</b>{visual.caption}</span>
            <a href="/visual-evidence.json">{visualDetails} ↗</a>
          </figcaption>
        </figure>
      )}
    </header>
  );
}

export function TrustPanel({
  doc,
  labels,
  open,
}: {
  doc: DocPage;
  labels: ExperienceLabels;
  open?: boolean;
}) {
  return (
    <details className="trust-panel" open={open}>
      <summary>
        <span>{labels.trust}</span>
        <small>{docApplicability(doc)}</small>
      </summary>
      <div className="doc-metadata">
        <div><span>{labels.audience}</span><b>{doc.audiences.join(" · ")}</b></div>
        <div><span>{labels.appliesTo}</span><b>{docApplicability(doc)}</b></div>
        <div><span>{labels.reviewed}</span><b>{doc.reviewed}</b></div>
        {doc.version && <div><span>{labels.version}</span><b>{doc.version}</b></div>}
        {doc.lastTested && <div><span>{labels.lastTested}</span><b>{doc.lastTested}</b></div>}
        <div>
          <span>{labels.authority}</span>
          <a href={doc.authorityUrl}>{doc.authorityLabel} ↗</a>
        </div>
        <div>
          <span>{labels.evidence}</span>
          {doc.evidenceUrl ? <a href={doc.evidenceUrl}>{doc.evidenceLabel} ↗</a> : <b>{doc.evidenceLabel}</b>}
        </div>
      </div>
    </details>
  );
}

export function PageTableOfContents({ doc, label }: { doc: DocPage; label: string }) {
  if (!["reference", "policy"].includes(doc.pageType) || doc.sections.length < 4) return null;
  return (
    <nav className="doc-toc" aria-label={label}>
      <span>{label}</span>
      <div>
        {doc.sections.map((section, index) => (
          <a href={`#${sectionId(section.heading, index)}`} key={`${index}-${section.heading}`}>{section.heading}</a>
        ))}
      </div>
    </nav>
  );
}
