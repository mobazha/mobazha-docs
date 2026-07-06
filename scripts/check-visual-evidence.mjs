import { createHash } from "node:crypto";
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

const assetDetails = (path, kind) => {
  if (!existsSync(new URL(`public${path}`, root))) {
    failures.push(`missing visual asset public${path}`);
    return undefined;
  }
  const buffer = readFileSync(new URL(`public${path}`, root));
  const sha256 = createHash("sha256").update(buffer).digest("hex");

  if (path.endsWith(".svg")) {
    const source = buffer.toString("utf8");
    const svg = source.match(/<svg\b[^>]*>/)?.[0] ?? "";
    const width = Number(svg.match(/\bwidth="(\d+)"/)?.[1]);
    const height = Number(svg.match(/\bheight="(\d+)"/)?.[1]);
    const hasAccessibleName = /<title\b/.test(source) && /<desc\b/.test(source) && /aria-labelledby=/.test(svg);
    if (!width || !height) failures.push(`${path} is missing numeric SVG dimensions`);
    if (kind === "conceptual" && !hasAccessibleName) failures.push(`${path} is missing title, description, or aria-labelledby`);
    return { width, height, sha256 };
  }

  if (path.endsWith(".png")) {
    const pngSignature = buffer.length >= 24 && buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
    if (!pngSignature) failures.push(`${path} does not contain a valid PNG signature`);
    return pngSignature
      ? { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), sha256 }
      : { sha256 };
  }

  failures.push(`${path} uses an unsupported visual evidence format; use SVG or PNG`);
  return { sha256 };
};

for (const visual of evidence.visuals) {
  if (!Array.isArray(visual.transcript) || visual.transcript.length < 2) failures.push(`${visual.id} is missing an English copyable transcript`);
  if (!Array.isArray(visual.transcript_zh) || visual.transcript_zh.length < 2) failures.push(`${visual.id} is missing a Chinese copyable transcript`);
  const desktop = assetDetails(visual.src, visual.kind);
  if (desktop && (desktop.width !== visual.width || desktop.height !== visual.height)) {
    failures.push(`${visual.id} desktop dimensions do not match the manifest`);
  }
  if (desktop && desktop.sha256 !== visual.sha256) failures.push(`${visual.id} desktop digest does not match the reviewed asset`);
  if (visual.mobile_src) {
    const mobile = assetDetails(visual.mobile_src, visual.kind);
    if (mobile && (mobile.width !== visual.mobile_width || mobile.height !== visual.mobile_height)) {
      failures.push(`${visual.id} mobile dimensions do not match the manifest`);
    }
    if (mobile && mobile.sha256 !== visual.mobile_sha256) failures.push(`${visual.id} mobile digest does not match the reviewed asset`);
  }
  if (!references.get(visual.id)?.length) failures.push(`${visual.id} is not referenced by a document`);
}

if (failures.length) {
  console.error(`visual evidence check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`visual evidence check passed: ${evidence.visuals.length} records, ${[...references.values()].flat().length} document references`);
