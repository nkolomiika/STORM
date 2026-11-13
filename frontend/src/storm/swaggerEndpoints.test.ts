import { describe, expect, it } from "vitest";
import { parseSwaggerDocuments } from "./swaggerEndpoints";

const parse = (value: unknown, host = "unknown") => parseSwaggerDocuments([{ name: "api.json", value }], host);

describe("Swagger/OpenAPI endpoint preview", () => {
  it.each(["1.0", "1.1", "1.2"])("reads Swagger %s API Declarations", (version) => {
    expect(parse({ swaggerVersion: version, basePath: "http://api.test:8080/v1", apis: [{ path: "/pets/{id}", operations: [{ [version === "1.2" ? "method" : "httpMethod"]: "GET" }] }] }).lines).toEqual(["GET http://api.test:8080/v1/pets/{id}"]);
  });
  it("combines Swagger 1.x resource listings with declaration files", () => {
    expect(parseSwaggerDocuments([
      { name: "listing.json", value: { swaggerVersion: "1.2", apis: [{ path: "/pets" }] } },
      { name: "pets.json", value: { swaggerVersion: "1.2", basePath: "https://api.test", apis: [{ path: "/pets", operations: [{ method: "POST" }] }] } },
    ]).lines).toEqual(["POST https://api.test/pets"]);
  });
  it("preserves Swagger 2.0 basePath, protocols, ports and method", () => {
    expect(parse({ swagger: "2.0", host: "api.test:8443", basePath: "/v2", schemes: ["https", "http"], paths: { "/pets": { head: {}, options: {}, trace: {}, parameters: [] } } }).lines).toEqual([
      "HEAD https://api.test:8443/v2/pets", "HEAD http://api.test:8443/v2/pets",
      "OPTIONS https://api.test:8443/v2/pets", "OPTIONS http://api.test:8443/v2/pets",
      "TRACE https://api.test:8443/v2/pets", "TRACE http://api.test:8443/v2/pets",
    ]);
  });
  it.each(["3.0.0", "3.0.4", "3.1.0", "3.1.2", "3.2.0", "3.2.1"])("reads OpenAPI %s and resolves server variables", (version) => {
    expect(parse({ openapi: version, servers: [{ url: "https://{env}.test/v1", variables: { env: { default: "api" } } }], paths: { "/pets/{id}": { get: { deprecated: true }, parameters: [] } } }).lines).toEqual(["GET https://api.test/v1/pets/{id}"]);
  });
  it("uses operation servers before path servers before root servers", () => {
    expect(parse({ openapi: "3.1.0", servers: [{ url: "https://root.test" }], paths: { "/pets": { servers: [{ url: "https://path.test/base" }], get: {}, post: { servers: [{ url: "https://operation.test" }] } } } }).lines).toEqual(["GET https://path.test/base/pets", "POST https://operation.test/pets"]);
  });
  it("uses a selected project host when servers are missing or relative", () => {
    const doc = { openapi: "3.0.0", servers: [{ url: "/api" }], paths: { "/pets": { get: {} } } };
    expect(parse(doc).lines).toEqual(["GET https://unknown/api/pets"]);
    expect(parse(doc, "api.test").lines).toEqual(["GET https://api.test/api/pets"]);
  });
  it("resolves local and uploaded JSON references without fetching URLs", () => {
    expect(parseSwaggerDocuments([
      { name: "api.json", value: { openapi: "3.1.0", servers: [{ url: "https://api.test" }], paths: { "/pets": { $ref: "parts.json#/path" }, "/copy": { $ref: "#/components/pathItems/Pet" } }, components: { pathItems: { Pet: { get: {} } } } } },
      { name: "parts.json", value: { path: { post: {} } } },
    ]).lines).toEqual(["POST https://api.test/pets", "GET https://api.test/copy"]);
  });
  it("supports QUERY and reports unsupported additional methods", () => {
    const result = parse({ openapi: "3.2.1", servers: [{ url: "https://api.test" }], paths: { "/pets": { query: {}, additionalOperations: { LINK: {} } } } });
    expect(result.lines).toEqual(["QUERY https://api.test/pets"]);
    expect(result.warnings).toContain("Unsupported HTTP method: LINK");
  });
  it("deduplicates operations across files", () => {
    const value = { swagger: "2.0", host: "api.test", paths: { "/pets": { get: {} } } };
    expect(parseSwaggerDocuments([{ name: "one.json", value }, { name: "two.json", value }]).lines).toHaveLength(1);
  });
  it("reports broken and circular references instead of inventing endpoints", () => {
    expect(() => parse({ openapi: "3.1.0", paths: { "/pets": { $ref: "missing.json#/path" } } })).toThrow("Upload the referenced JSON");
    expect(() => parse({ openapi: "3.1.0", paths: { "/pets": { $ref: "#/paths/~1pets" } } })).toThrow("Circular");
  });
  it.each([{}, { swagger: "4.0", paths: {} }, { openapi: "3.1.0", paths: {} }, { swaggerVersion: "1.2", apis: [{ path: "/pets" }] }])("rejects documents without supported operations", (value) => {
    expect(() => parse(value)).toThrow();
  });
});
