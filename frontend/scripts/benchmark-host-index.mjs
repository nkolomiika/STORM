/** Микробенчмарк чистого алгоритма, не измеряет DOM/React или браузерную сеть. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const source = fs.readFileSync(path.join(root, "frontend/src/storm/hostIndex.ts"), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { buildHostIndex } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

function previous(hosts) {
  let nested = 0;
  let links = 0;
  for (const host of hosts) {
    if (hosts.some((parent) => parent.origin !== "ip" && parent.id !== host.id && host.host.toLowerCase().endsWith(`.${parent.host.toLowerCase()}`))) nested++;
    links += hosts.filter((other) => other.id !== host.id && other.host.toLowerCase().endsWith(`.${host.host.toLowerCase()}`)).length;
  }
  return { nested, links };
}

const output = { node: process.version, measured_at_utc: new Date().toISOString(), rounds: 3, scenarios: [] };
for (const count of [1000, 5000, 10000]) {
  const hosts = Array.from({ length: count }, (_, id) => ({ id, host: id % 5 === 0 ? `group${Math.floor(id / 5)}.test` : `api${id}.group${Math.floor(id / 5)}.test` }));
  const before = [], after = [];
  for (let round = 0; round < output.rounds; round++) {
    let start = performance.now();
    const expected = previous(hosts);
    before.push(performance.now() - start);
    start = performance.now();
    const index = buildHostIndex(hosts);
    after.push(performance.now() - start);
    const links = [...index.descendants.values()].reduce((sum, children) => sum + children.length, 0);
    if (expected.nested !== index.nestedIds.size || expected.links !== links) throw new Error("Hierarchy changed");
  }
  const median = (values) => [...values].sort((a, b) => a - b)[1];
  output.scenarios.push({ hosts: count, before_ms_median: +median(before).toFixed(3), after_ms_median: +median(after).toFixed(3), speedup: +(median(before) / median(after)).toFixed(2) });
}
const file = path.join(root, "docs/performance/host-index.json");
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(output, null, 2) + "\n");
process.stdout.write(JSON.stringify(output, null, 2) + "\n");
