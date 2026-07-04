import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../app/lib/docs.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: "docs.ts",
  reportDiagnostics: true,
});

if (compiled.diagnostics?.length) {
  const formatted = ts.formatDiagnosticsWithColorAndContext(compiled.diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => "\n",
  });
  throw new Error(`failed to load documentation metadata:\n${formatted}`);
}

const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`;
const loaded = await import(moduleUrl);

export const docApplicability = loaded.docApplicability;
export const docs = loaded.docs;
export const navGroups = loaded.navGroups;
export const publicationNavGroups = loaded.publicationNavGroups;
