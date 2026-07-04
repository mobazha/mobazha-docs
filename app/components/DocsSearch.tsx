"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SearchDocument = {
  id: string;
  path: string;
  title: string;
  summary: string;
  status: string;
  audiences: string[];
  language: "en" | "zh-CN";
};

export function DocsSearch({ language = "en" }: { language?: "en" | "zh-CN" }) {
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/docs-index.json")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("index unavailable"))))
      .then((index) => {
        if (active && Array.isArray(index.documents)) setDocuments(index.documents);
      })
      .catch(() => {
        if (active) setDocuments([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return documents
      .filter((doc) => doc.language === language)
      .map((doc) => {
        const title = doc.title.toLowerCase();
        const path = doc.path.toLowerCase();
        const haystack = `${title} ${doc.summary} ${doc.audiences.join(" ")}`.toLowerCase();
        const score = title.startsWith(normalized) ? 3 : path.includes(normalized) ? 2 : haystack.includes(normalized) ? 1 : 0;
        return { doc, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
      .slice(0, 6)
      .map((result) => result.doc);
  }, [documents, language, query]);

  const isChinese = language === "zh-CN";

  const open = focused && query.trim().length > 0;

  return (
    <div className="docs-search" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
    }}>
      <label htmlFor="docs-search-input">{isChinese ? "搜索文档" : "Search documentation"}</label>
      <input
        id="docs-search-input"
        type="search"
        value={query}
        placeholder={isChinese ? "搜索文档…" : "Search docs…"}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setQuery("");
            setFocused(false);
          }
        }}
        role="combobox"
        aria-autocomplete="list"
        aria-controls="docs-search-results"
        aria-expanded={open}
      />
      {open && (
        <div className="docs-search-results" id="docs-search-results" role="listbox">
          {results.length ? results.map((doc) => (
            <Link href={doc.path} key={doc.path} onClick={() => setFocused(false)}>
              <span>{doc.title}</span>
              <small>{doc.status} · {doc.path}</small>
            </Link>
          )) : <p>{isChinese ? "没有匹配的文档" : "No matching documentation"}</p>}
        </div>
      )}
    </div>
  );
}
