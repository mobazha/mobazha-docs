"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchDocument = {
  id: string;
  path: string;
  title: string;
  summary: string;
  search_text?: string;
  status: string;
  audiences: string[];
  language: "en" | "zh-CN";
};

export function DocsSearch({
  language = "en",
  variant = "sidebar",
}: {
  language?: "en" | "zh-CN";
  variant?: "sidebar" | "header";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

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

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return documents
      .filter((doc) => doc.language === language)
      .map((doc) => {
        const title = doc.title.toLowerCase();
        const path = doc.path.toLowerCase();
        const haystack = `${title} ${doc.summary} ${doc.search_text ?? ""} ${doc.audiences.join(" ")}`.toLowerCase();
        const score = title.startsWith(normalized) ? 3 : path.includes(normalized) ? 2 : haystack.includes(normalized) ? 1 : 0;
        return { doc, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
      .slice(0, 8)
      .map((result) => result.doc);
  }, [documents, language, query]);

  const isChinese = language === "zh-CN";
  const label = isChinese ? "搜索文档" : "Search documentation";
  const placeholder = isChinese ? "搜索文档…" : "Search docs…";
  const open = focused && query.trim().length > 0;
  const activeOptionId = activeIndex >= 0 && activeIndex < results.length
    ? `docs-search-option-${activeIndex}`
    : undefined;

  return (
    <div
      className={`docs-search docs-search-${variant}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <label className={variant === "header" ? "sr-only" : undefined} htmlFor="docs-search-input">{label}</label>
      <div className="docs-search-field">
        <input
          id="docs-search-input"
          ref={inputRef}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && results.length) {
              event.preventDefault();
              setActiveIndex((current) => Math.min(current + 1, results.length - 1));
            } else if (event.key === "ArrowUp" && results.length) {
              event.preventDefault();
              setActiveIndex((current) => Math.max(current - 1, 0));
            } else if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
              event.preventDefault();
              setFocused(false);
              router.push(results[activeIndex].path);
            }
            if (event.key === "Escape") {
              setQuery("");
              setFocused(false);
              setActiveIndex(-1);
              inputRef.current?.blur();
            }
          }}
          role="combobox"
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          aria-controls="docs-search-results"
          aria-expanded={open}
          aria-haspopup="listbox"
        />
        {variant === "header" && <kbd aria-hidden="true">⌘K</kbd>}
      </div>
      {open && (
        results.length ? <div className="docs-search-results" id="docs-search-results" role="listbox">
          {results.map((doc, index) => (
            <Link
              aria-selected={activeIndex === index}
              href={doc.path}
              id={`docs-search-option-${index}`}
              key={doc.path}
              onClick={() => setFocused(false)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
            >
              <span>{doc.title}</span>
              <small>{doc.status} · {doc.path}</small>
            </Link>
          ))}
        </div> : <div className="docs-search-results" id="docs-search-results" role="status" aria-live="polite">
          <p>{isChinese ? "没有匹配的文档" : "No matching documentation"}</p>
        </div>
      )}
    </div>
  );
}
