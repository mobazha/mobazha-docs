import { writeFileSync } from "node:fs";
import { loadContentDocuments, renderDocumentRegistry } from "./content-files.mjs";

const documents = loadContentDocuments();
writeFileSync(
  new URL("../app/lib/generated-docs.json", import.meta.url),
  renderDocumentRegistry(documents),
);
console.log(`generated app/lib/generated-docs.json (${documents.length} documents)`);
