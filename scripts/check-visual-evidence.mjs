import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const evidence = JSON.parse(read("visual-evidence.json"));
const documents = JSON.parse(read("app/lib/generated-docs.json"));
const failures = [];
const ids = new Set(evidence.visuals.map((visual) => visual.id));
const references = new Map(evidence.visuals.map((visual) => [visual.id, []]));

for (const doc of documents) {
  if (!doc.featuredVisual) continue;
  if (!ids.has(doc.featuredVisual)) failures.push(`/${doc.slug} references unknown visual ${doc.featuredVisual}`);
  else references.get(doc.featuredVisual).push(`/${doc.slug}`);
}

const svgDimensions = (path) => {
  if (!existsSync(new URL(`public${path}`, root))) {
    failures.push(`missing visual asset public${path}`);
    return undefined;
  }
  const source = read(`public${path}`);
  const svg = source.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const width = Number(svg.match(/\bwidth="(\d+)"/)?.[1]);
  const height = Number(svg.match(/\bheight="(\d+)"/)?.[1]);
  const hasAccessibleName = /<title\b/.test(source) && /<desc\b/.test(source) && /aria-labelledby=/.test(svg);
  if (!width || !height) failures.push(`${path} is missing numeric SVG dimensions`);
  if (!hasAccessibleName) failures.push(`${path} is missing title, description, or aria-labelledby`);
  return { width, height };
};

for (const visual of evidence.visuals) {
  const desktop = svgDimensions(visual.src);
  if (desktop && (desktop.width !== visual.width || desktop.height !== visual.height)) {
    failures.push(`${visual.id} desktop dimensions do not match the manifest`);
  }
  if (visual.mobile_src) {
    const mobile = svgDimensions(visual.mobile_src);
    if (mobile && (mobile.width !== visual.mobile_width || mobile.height !== visual.mobile_height)) {
      failures.push(`${visual.id} mobile dimensions do not match the manifest`);
    }
  }
  if (!references.get(visual.id)?.length) failures.push(`${visual.id} is not referenced by a document`);
}

if (failures.length) {
  console.error(`visual evidence check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`visual evidence check passed: ${evidence.visuals.length} records, ${[...references.values()].flat().length} document references`);
