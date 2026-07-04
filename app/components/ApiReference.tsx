"use client";

import { lazy, Suspense, useMemo, useSyncExternalStore } from "react";
import type { AnyApiReferenceConfiguration } from "@scalar/api-reference-react";

const ScalarApiReference = lazy(() => import("@scalar/api-reference-react")
  .then((module) => ({ default: module.ApiReferenceReact })));

const customCss = `
.light-mode {
  --scalar-background-1: #ffffff;
  --scalar-background-2: #f7f9fc;
  --scalar-background-3: #eef4ff;
  --scalar-background-accent: #eef4ff;
  --scalar-color-1: #1b2a4e;
  --scalar-color-2: #475569;
  --scalar-color-3: #64748b;
  --scalar-color-accent: #004eeb;
  --scalar-border-color: #e3e8ef;
  --scalar-sidebar-background-1: #f7f9fc;
  --scalar-sidebar-item-hover-background: #eef4ff;
  --scalar-sidebar-item-active-background: #dfeaff;
  --scalar-sidebar-color-active: #004eeb;
  --scalar-sidebar-border-color: #e3e8ef;
  --scalar-font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --scalar-font-size-2: 16px;
  --scalar-font-size-3: 14px;
}
.t-doc__header { display: none; }
`;

export function ApiReference({ specificationUrl }: { specificationUrl: string }) {
  const configuration = useMemo<AnyApiReferenceConfiguration>(() => ({
    url: specificationUrl,
    title: "Mobazha Node API",
    slug: "mobazha-node-api",
    layout: "modern",
    theme: "default",
    customCss,
    darkMode: false,
    forceDarkModeState: "light",
    hideDarkModeToggle: true,
    hideClientButton: true,
    hideTestRequestButton: true,
    showDeveloperTools: "never",
    persistAuth: false,
    telemetry: false,
    documentDownloadType: "direct",
    showOperationId: true,
    defaultOpenFirstTag: false,
    defaultOpenAllTags: false,
    expandAllModelSections: false,
    expandAllResponses: false,
    expandAllSchemaProperties: false,
    orderSchemaPropertiesBy: "preserve",
    orderRequiredPropertiesFirst: true,
    withDefaultFonts: false,
    servers: [{ url: "http://127.0.0.1:5102", description: "Local Node — replace with the Node you operate or trust" }],
  }), [specificationUrl]);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div className="api-reference-loading" role="status">Loading the reviewed API contract…</div>;
  }

  return (
    <Suspense fallback={<div className="api-reference-loading" role="status">Loading the reviewed API contract…</div>}>
      <ScalarApiReference configuration={configuration} />
    </Suspense>
  );
}
