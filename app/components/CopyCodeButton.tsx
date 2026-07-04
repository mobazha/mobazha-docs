"use client";

import { useState } from "react";

export function CopyCodeButton({ code, language }: { code: string; language: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("failed");
    }
  }

  const label = state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy";
  return (
    <button aria-label={`Copy ${language} code`} onClick={copy} type="button">
      {label}
    </button>
  );
}
