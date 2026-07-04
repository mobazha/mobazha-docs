"use client";

import { useState } from "react";

export function CopyPageButton({ markdown, label }: { markdown: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setState("copied");
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("failed");
    }
  }

  const text = state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label;

  return (
    <button className="page-toolbar-button" onClick={copy} type="button">
      {text}
    </button>
  );
}
