/** Check interface source strings; product names and protocol examples stay literal. */
import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/storm");
const parse = (name) => ts.createSourceFile(name, fs.readFileSync(path.join(root, name), "utf8"), ts.ScriptTarget.Latest, true, name.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
const dictionary = parse("i18n.ts");
const keys = new Set();
function collect(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(dictionary) === "RU") {
    for (const property of node.initializer.properties) {
      keys.add(ts.isStringLiteral(property.name) ? property.name.text : property.name.getText(dictionary));
    }
  }
  ts.forEachChild(node, collect);
}
collect(dictionary);
const technical = new Set(["HTTP", "CWE ID", "2FA", "Sber", "Tech", "STORM", "cURL", "user@sbertech.ru", "ivanov", "••••••••", "000000"]);
const branding = new Set(["STORM", "OFFENSIVE RESEARCH & MANAGEMENT", "Swagger 1.0 / 1.1 / 1.2 / 2.0 · OpenAPI 3.0 / 3.1 / 3.2"]);
const failures = [];
let checked = 0;
for (const name of [...fs.readdirSync(root).filter((file) => /\.tsx?$/.test(file) && !/\.test\./.test(file)), "../StormRoot.tsx"]) {
  const source = parse(name);
  const report = (node, message) => failures.push(`${name}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}: ${message}`);
  const check = (node) => {
    if (!ts.isStringLiteral(node)) return;
    checked++;
    if (!keys.has(node.text) && !technical.has(node.text) && !node.text.startsWith("CVSS:")) report(node, `Missing Russian translation: ${node.text}`);
  };
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const fn = node.expression.getText(source);
      if (fn === "t" && node.arguments[0]) check(node.arguments[0]);
      if (fn === "getApiErrorMessage" && node.arguments[1]) check(node.arguments[1]);
      if (fn === "cardHeader") node.arguments.slice(1, 3).forEach(check);
    }
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === "API_SCOPE_LABELS") {
      for (const property of node.initializer.properties) check(property.initializer);
    }
    if (ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, " ").trim().replaceAll("&amp;", "&");
      if (/[A-Za-zА-Яа-я]{2}/.test(text) && !branding.has(text)) report(node, `Untranslated interface text: ${text}`);
    }
    if (ts.isJsxAttribute(node) && ["title", "placeholder", "aria-label", "alt"].includes(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer) && /[A-Za-zА-Яа-я]{2}/.test(node.initializer.text) && !technical.has(node.initializer.text)) {
      report(node, `Untranslated interface attribute: ${node.initializer.text}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log(`Localization audit passed: ${checked} literal references checked, ${keys.size} Russian entries.`);
