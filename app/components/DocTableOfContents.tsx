"use client";

import { useEffect, useState } from "react";
import { sectionId } from "@/app/components/DocumentExperience";

type Section = {
  heading: string;
};

export function DocTableOfContents({ sections, label }: { sections: Section[]; label: string }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = sections
      .map((section, index) => document.getElementById(sectionId(section.heading, index)))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 1],
      },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <nav className="doc-toc-sidebar" aria-label={label}>
      <span>{label}</span>
      <ol>
        {sections.map((section, index) => {
          const id = sectionId(section.heading, index);
          return (
            <li key={`${index}-${section.heading}`}>
              <a aria-current={activeId === id ? "location" : undefined} className={activeId === id ? "active" : undefined} href={`#${id}`}>
                {section.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
