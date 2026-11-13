/** Разбирает маршруты локально: Swagger 1.x/2.0 и OpenAPI 3.0–3.2. */
export interface SwaggerDocument { name: string; value: unknown }
type JsonObject = Record<string, unknown>;
const object = (value: unknown): JsonObject => value !== null && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
export const ENDPOINT_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "TRACE", "QUERY"] as const;
const methods = new Set<string>(ENDPOINT_METHODS);

export function parseSwaggerDocuments(documents: SwaggerDocument[], fallbackHost = "unknown") {
  const files = new Map(documents.map((doc) => [doc.name, doc.value]));
  if (files.size !== documents.length) throw new Error("JSON filenames must be unique");
  const lines = new Set<string>();
  const warnings = new Set<string>();
  const versions = new Set<string>();
  let resourceListing = false;
  const fallback = fallbackHost ? (/^https?:\/\//i.test(fallbackHost) ? fallbackHost : `https://${fallbackHost}`) : "";
  const resolve = (value: unknown, file: string, chain = new Set<string>()): { value: JsonObject; file: string } => {
    const item = object(value);
    if (typeof item.$ref !== "string") return { value: item, file };
    const key = `${file}:${item.$ref}`;
    if (chain.has(key) || chain.size >= 32) throw new Error("Circular endpoint reference");
    const [filename, pointer = ""] = item.$ref.split("#");
    const target = filename ? new URL(filename, `https://local.invalid/${file}`).pathname.slice(1) : file;
    if (!files.has(target)) throw new Error(`Upload the referenced JSON file: ${target}`);
    let node: unknown = files.get(target);
    if (pointer && !pointer.startsWith("/")) throw new Error("Unsupported JSON reference");
    for (const part of pointer.split("/").slice(1)) {
      const token = decodeURIComponent(part).replace(/~1/g, "/").replace(/~0/g, "~");
      if (!Object.hasOwn(object(node), token)) throw new Error(`Endpoint reference not found: ${item.$ref}`);
      node = object(node)[token];
    }
    const resolved = resolve(node, target, new Set([...chain, key]));
    return { value: { ...resolved.value, ...Object.fromEntries(Object.entries(item).filter(([k]) => k !== "$ref")) }, file: resolved.file };
  };
  const serverUrls = (raw: unknown): string[] => Array.isArray(raw) ? raw.map((entry) => {
    const server = object(entry);
    if (typeof server.url !== "string") throw new Error("Invalid server URL");
    return server.url.replace(/\{([^}]+)\}/g, (_, name: string) => {
      const variable = object(object(server.variables)[name]);
      if (typeof variable.default !== "string") throw new Error(`Missing server variable: ${name}`);
      return variable.default;
    });
  }) : [];
  const add = (method: string, base: string, path: string) => {
    method = method.toUpperCase();
    if (!methods.has(method)) { warnings.add(`Unsupported HTTP method: ${method}`); return; }
    if (!base || (!/^https?:\/\//i.test(base) && !base.startsWith("//") && !fallback)) {
      throw new Error("Select a project host for relative URLs");
    }
    const url = new URL(base, fallback || "https://local.invalid/");
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("Only HTTP and HTTPS server URLs are supported");
    const route = `${url.pathname.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
    lines.add(`${method} ${url.origin}${route}${url.search}`);
    if (lines.size > 10000) throw new Error("Too many endpoints in JSON (maximum 10000)");
  };

  for (const document of documents) {
    const spec = object(document.value);
    const version = spec.openapi ?? spec.swagger ?? spec.swaggerVersion;
    // Файлы компонентов для $ref могут не иметь собственного номера версии.
    if (version === undefined) continue;
    if (typeof version !== "string" || !/^(1\.[012]|2\.0|3\.[012](?:\.\d+)?)$/.test(version)) throw new Error(`Unsupported Swagger/OpenAPI version: ${String(version)}`);
    versions.add(version);
    if (version.startsWith("1.")) {
      let declarations = 0;
      for (const rawApi of Array.isArray(spec.apis) ? spec.apis : []) {
        const api = object(rawApi);
        for (const rawOperation of Array.isArray(api.operations) ? api.operations : []) {
          const operation = object(rawOperation);
          const method = operation.method ?? operation.httpMethod;
          if (typeof api.path === "string" && typeof method === "string") {
            add(method, typeof spec.basePath === "string" ? spec.basePath : fallback, api.path);
            declarations++;
          }
        }
      }
      if (!declarations) resourceListing = true;
      continue;
    }
    const swagger2 = version.startsWith("2.");
    let rootServers = serverUrls(spec.servers);
    if (swagger2) {
      const host = typeof spec.host === "string" ? spec.host : "";
      const prefix = typeof spec.basePath === "string" ? spec.basePath : "";
      const schemes = Array.isArray(spec.schemes) && spec.schemes.length ? spec.schemes : ["https"];
      rootServers = host ? schemes.map((scheme) => `${scheme}://${host}${prefix}`) : [prefix || "/"];
    }
    if (!rootServers.length) rootServers = ["/"];
    for (const [path, rawPath] of Object.entries(object(spec.paths))) {
      if (!path.startsWith("/")) continue;
      try {
        const resolved = resolve(rawPath, document.name);
        const item = resolved.value;
        const pathServers = serverUrls(item.servers);
        const operations = Object.entries(item).filter(([key]) => methods.has(key.toUpperCase()));
        // OpenAPI 3.2 допускает дополнительные имена HTTP-методов.
        operations.push(...Object.entries(object(item.additionalOperations)));
        for (const [method, rawOperation] of operations) {
          const operation = resolve(rawOperation, resolved.file).value;
          if (!rawOperation || typeof rawOperation !== "object" || Array.isArray(rawOperation)) { warnings.add(`Invalid operation: ${method.toUpperCase()} ${path}`); continue; }
          const operationServers = serverUrls(operation.servers);
          const bases = operationServers.length ? operationServers : pathServers.length ? pathServers : rootServers;
          for (const base of bases) add(method, base, path);
        }
      } catch (error) {
        // Ошибка адреса требует выбора хоста, иначе нельзя корректно заполнить поля.
        if (error instanceof Error && error.message === "Select a project host for relative URLs") throw error;
        warnings.add(error instanceof Error ? error.message : "Invalid endpoint");
      }
    }
  }
  if (!versions.size) throw new Error("This JSON is not a Swagger/OpenAPI document");
  if (!lines.size && resourceListing) warnings.add("Swagger 1.x resource listings need their API Declaration JSON files");
  if (!lines.size) throw new Error([...warnings].join("; ") || "No endpoints found in JSON");
  return { lines: [...lines], warnings: [...warnings], versions: [...versions] };
}
