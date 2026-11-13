/** Извлекает объявления функций и методов TypeScript для общей документации.
 * Не исполняет приложение и не подключается к API.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const configFile = ts.readConfigFile(path.join(root, "frontend/tsconfig.app.json"), ts.sys.readFile);
const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.join(root, "frontend"));
const program = ts.createProgram(config.fileNames, config.options);
const checker = program.getTypeChecker();
const files = [];
const compact = (text) => text.replace(/\s+/g, " ").trim();

function declaredName(node, source) {
  if (node.name) return node.name.getText(source);
  if (ts.isVariableDeclaration(node.parent) || ts.isPropertyAssignment(node.parent)) return node.parent.name.getText(source);
  return null;
}

for (const source of program.getSourceFiles()) {
  const relative = path.relative(root, source.fileName).replaceAll(path.sep, "/");
  if (!relative.startsWith("frontend/src/") || /\.(test|spec)\./.test(relative) || source.isDeclarationFile || relative.endsWith("setupTests.ts")) continue;
  const methods = [];
  function visit(node, scope = []) {
    const isCallable = (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) && node.body;
    const name = isCallable ? declaredName(node, source) : null;
    let nestedScope = scope;
    if (ts.isClassDeclaration(node) && node.name) nestedScope = [...scope, node.name.getText(source)];
    if (isCallable && name) {
      const signature = checker.getSignatureFromDeclaration(node);
      const returnType = node.type?.getText(source) ?? (signature ? checker.typeToString(checker.getReturnTypeOfSignature(signature), node, ts.TypeFormatFlags.NoTruncation) : "unknown");
      const docs = signature ? ts.displayPartsToString(signature.getDocumentationComment(checker)) : "";
      const rangeOwner = ts.isArrowFunction(node) ? node.parent.parent : node;
      const comments = (ts.getLeadingCommentRanges(source.text, rangeOwner.getFullStart()) ?? []).map((r) => source.text.slice(r.pos, r.end));
      const comment = docs || comments.filter((s) => s.startsWith("/**")).map((s) => s.replace(/^\/\*\*|\*\/$/g, "").replace(/^\s*\* ?/gm, "").trim()).join("\n");
      const calls = new Set();
      const http = [];
      const throws = [];
      function bodyCalls(child) {
        if (child !== node.body && ts.isFunctionLike(child)) return;
        if (ts.isCallExpression(child)) {
          const expression = compact(child.expression.getText(source));
          calls.add(expression);
          if (/^api\.(get|post|put|patch|delete)$/.test(expression)) http.push({ method: expression.slice(4).toUpperCase(), url: child.arguments[0]?.getText(source), arguments: child.arguments.slice(1).map((arg) => compact(arg.getText(source))) });
        }
        if (ts.isThrowStatement(child)) throws.push(compact(child.expression.getText(source)));
        ts.forEachChild(child, bodyCalls);
      }
      bodyCalls(node.body);
      methods.push({ name: [...scope, name].join("."), line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
        signature: `${node.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword) ? "async " : ""}${name}${node.typeParameters ? `<${node.typeParameters.map((n) => compact(n.getText(source))).join(", ")}>` : ""}(${node.parameters.map((n) => compact(n.getText(source))).join(", ")}) => ${compact(returnType)}`,
        description: comment, returns: compact(returnType), calls: [...calls].sort(), http, throws,
        params: node.parameters.map((parameter) => ({ name: parameter.name.getText(source), type: parameter.type?.getText(source) ?? checker.typeToString(checker.getTypeAtLocation(parameter)), default: parameter.initializer?.getText(source) ?? (parameter.questionToken ? "undefined (optional)" : "обязательный") })),
      });
      nestedScope = [...scope, name];
    }
    ts.forEachChild(node, (child) => visit(child, nestedScope));
  }
  visit(source);
  if (methods.length) files.push({ path: relative, methods });
}
process.stdout.write(JSON.stringify(files, null, 2) + "\n");
