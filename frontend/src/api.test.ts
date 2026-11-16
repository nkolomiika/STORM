import { UserInputError } from "./errorMessages";
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Exercise the real Axios interceptor and API functions against an in-memory
// transport. No request is sent to the app, SSO or any external system.
const adapter = vi.fn<(config: InternalAxiosRequestConfig) => Promise<AxiosResponse>>();
const create = axios.create.bind(axios);
vi.spyOn(axios, "create").mockImplementation((config) => create({ ...config, adapter }));
const api = await import("./api");
const response = (config: InternalAxiosRequestConfig, data: unknown = {}, status = 200): AxiosResponse =>
  ({ config, data, status, statusText: String(status), headers: {} });
const failure = (config: InternalAxiosRequestConfig, status = 401, data: unknown = {}) =>
  new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, undefined, response(config, data, status));

beforeEach(() => {
  adapter.mockReset().mockImplementation(async (config) => response(config));
});

describe("API error messages", () => {
  it.each([400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504])("never displays SQL/SMTP diagnostics for HTTP %s", (status) => {
    const error = failure({} as InternalAxiosRequestConfig, status, { detail: "SMTPAuthenticationError password=private-secret / asyncpg SELECT password FROM users" });
    const message = api.getApiErrorMessage(error, "Please try again");
    expect(message).not.toMatch(/private-secret|SMTP|asyncpg|SELECT/);
  });
  it("uses a stable mail error code and ignores the raw server body", () => {
    const error = failure({} as InternalAxiosRequestConfig, 503, { code: "mail_not_configured", detail: "SMTP_PASSWORD=secret" });
    expect(api.getApiErrorMessage(error, "Fallback")).toBe("Email delivery is not configured. Contact an administrator.");
  });
  it("hides native exceptions, unknown error codes and deeply nested responses", () => {
    expect(api.getApiErrorMessage(new SyntaxError("raw parser detail"), "Check the file")).toBe("Check the file");
    const circular: { detail?: unknown } = {}; circular.detail = circular;
    expect(api.getApiErrorMessage(failure({} as InternalAxiosRequestConfig, 422, circular), "Fallback")).toBe("Check the form fields.");
    expect(api.getApiErrorMessage(failure({} as InternalAxiosRequestConfig, 503, { code: "__proto__" }), "Fallback")).toBe("Something went wrong. Try again later.");
  });
  it("turns old Pydantic validation responses into a form hint", () => {
    const error = failure({} as InternalAxiosRequestConfig, 422, { detail: [{ type: "string_type", loc: ["body", "password"], msg: "Input should be a valid string", input: "never-display" }] });
    expect(api.getApiErrorMessage(error, "Fallback")).toBe("Check the form fields.");
  });
  it.each([
    [401, "Invalid username or password."], [403, "You don't have permission for this action."],
    [404, "The requested resource was not found."], [409, "Conflict: the resource already exists or was changed."],
    [422, "Check the form fields."], [429, "Too many attempts. Try again later."],
  ])("provides a useful fallback for HTTP %s", (status, message) => {
    const error = failure({} as InternalAxiosRequestConfig, status);
    expect(api.getApiErrorMessage(error, "Fallback")).toBe(message);
    expect(api.getApiErrorStatus(error)).toBe(status);
  });
  it("extracts nested validation errors", () => {
    const error = failure({} as InternalAxiosRequestConfig, 422, {
      detail: [{ message: " Required " }, { detail: "Invalid value" }, {}, null],
    });
    expect(api.getApiErrorMessage(error, "Fallback")).toBe("Required; Invalid value");
  });
  it.each([500, 502, 503, 504])("handles generic HTTP %s without losing the status", (status) => {
    expect(api.getApiErrorMessage(failure({} as InternalAxiosRequestConfig, status, "Internal Server Error"), "Fallback"))
      .toBe("Something went wrong. Try again later.");
  });
  it("hides technical detail for an unexpected server error", () => {
    expect(api.getApiErrorMessage(failure({} as InternalAxiosRequestConfig, 500, { detail: "Storage failed" }), "Fallback"))
      .toBe("Something went wrong. Try again later.");
  });
  it.each(["ECONNABORTED", "ETIMEDOUT"])("recognizes a timeout (%s)", (code) => {
    expect(api.getApiErrorMessage(new AxiosError("Timeout", code), "Fallback")).toBe("The server response timed out.");
  });
  it("distinguishes no response from other thrown values", () => {
    expect(api.getApiErrorMessage(new AxiosError("Offline"), "Fallback")).toContain("The service is unavailable");
    expect(api.getApiErrorMessage(new UserInputError("Local validation"), "Fallback")).toBe("Local validation");
    expect(api.getApiErrorMessage({}, "Fallback")).toBe("Fallback");
    expect(api.getApiErrorStatus(new Error("Local validation"))).toBeNull();
  });
});

describe("refresh and retry", () => {
  it("does not refresh an unauthenticated session check", async () => {
    adapter.mockImplementation(async (config) => { throw failure(config); });
    await expect(api.getMe()).rejects.toBeInstanceOf(AxiosError);
    expect(adapter).toHaveBeenCalledOnce();
  });
  it("does not refresh rejected credentials", async () => {
    adapter.mockImplementation(async (config) => { throw failure(config); });
    await expect(api.login("user", "wrong")).rejects.toBeInstanceOf(AxiosError);
    expect(adapter).toHaveBeenCalledOnce();
  });
  it("refreshes once and retries the original request", async () => {
    adapter.mockImplementation(async (config) => {
      if (config.url === "/auth/refresh") return response(config);
      if (!(config as InternalAxiosRequestConfig & { _retry?: boolean })._retry) throw failure(config);
      return response(config, { items: [], total: 0 });
    });
    await expect(api.getProjects()).resolves.toEqual({ items: [], total: 0 });
    expect(adapter.mock.calls.map(([config]) => config.url)).toEqual(["/projects", "/auth/refresh", "/projects"]);
  });
  it("shares one refresh across concurrent requests", async () => {
    let finish!: () => void;
    const refreshed = new Promise<void>((resolve) => { finish = resolve; });
    adapter.mockImplementation(async (config) => {
      if (config.url === "/auth/refresh") { await refreshed; return response(config); }
      if (!(config as InternalAxiosRequestConfig & { _retry?: boolean })._retry) throw failure(config);
      return response(config, []);
    });
    const requests = Promise.all([api.getProjects(), api.getUsers()]);
    await vi.waitFor(() => expect(adapter.mock.calls.filter(([c]) => c.url === "/auth/refresh")).toHaveLength(1));
    finish();
    await expect(requests).resolves.toEqual([[], []]);
    expect(adapter.mock.calls.filter(([c]) => c.url === "/auth/refresh")).toHaveLength(1);
  });
  it("rejects all waiting requests if refresh fails, and allows a later attempt", async () => {
    let finish!: () => void;
    const refreshed = new Promise<void>((resolve) => { finish = resolve; });
    adapter.mockImplementation(async (config) => {
      if (config.url === "/auth/refresh") await refreshed;
      throw failure(config);
    });
    const requests = Promise.allSettled([api.getProjects(), api.getUsers()]);
    await vi.waitFor(() => expect(adapter.mock.calls.filter(([c]) => c.url === "/auth/refresh")).toHaveLength(1));
    finish();
    expect((await requests).map((result) => result.status)).toEqual(["rejected", "rejected"]);
    adapter.mockClear();
    await expect(api.getProjects()).rejects.toBeInstanceOf(AxiosError);
    expect(adapter.mock.calls.filter(([c]) => c.url === "/auth/refresh")).toHaveLength(1);
  });
  it("stops after a single retry and never refreshes a 500", async () => {
    adapter.mockImplementation(async (config) => {
      if (config.url === "/auth/refresh") return response(config);
      throw failure(config);
    });
    await expect(api.getProjects()).rejects.toBeInstanceOf(AxiosError);
    expect(adapter).toHaveBeenCalledTimes(3);
    adapter.mockClear().mockImplementation(async (config) => { throw failure(config, 500); });
    await expect(api.getProjects()).rejects.toBeInstanceOf(AxiosError);
    expect(adapter).toHaveBeenCalledOnce();
  });
});

describe("note and endpoint contracts", () => {
  it("allows project creation without an APPSEC ticket", async () => {
    await api.createProject({ name: "Optional ticket" });
    expect(adapter.mock.calls[0][0]).toMatchObject({ method: "post", url: "/projects", data: '{"name":"Optional ticket"}' });
  });
  it("sends an empty note body to clear content, but rejects blank titles locally", async () => {
    await api.updateProjectNote(7, 11, { content: "" });
    expect(adapter.mock.calls[0][0]).toMatchObject({ method: "put", url: "/projects/7/notes/11", data: '{"content":""}' });
    adapter.mockClear();
    await expect(api.createProjectNote(7, { title: " " })).rejects.toThrow("Page title");
    await expect(api.updateProjectNote(7, 11, { title: "" })).rejects.toThrow("Page title");
    expect(adapter).not.toHaveBeenCalled();
  });
  it("uses endpoint-specific pagination and rejects an empty comment locally", async () => {
    await api.listEndpointComments(7, 8, 9, 2);
    expect(adapter.mock.calls[0][0]).toMatchObject({ url: "/projects/7/hosts/8/endpoints/9/comments", params: { page: 2, size: 50 } });
    await api.createEndpointComment(7, 8, 9, "  Checked  ");
    expect(adapter.mock.calls[1][0]).toMatchObject({ method: "post", data: '{"content":"  Checked  "}' });
    adapter.mockClear();
    await expect(api.createEndpointComment(7, 8, 9, " \n ")).rejects.toThrow();
    expect(adapter).not.toHaveBeenCalled();
  });
});

describe("complete finding lists", () => {
  it("loads findings beyond the first page for local search, filters and counters", async () => {
    const findings = Array.from({ length: 237 }, (_, i) => ({ id: i + 1, title: `Finding ${i + 1}` }));
    adapter.mockImplementation(async (config) => {
      const { page, size } = config.params;
      return response(config, { items: findings.slice((page - 1) * size, page * size), total: findings.length, page, size, pages: Math.ceil(findings.length / size) });
    });
    const result = await api.getVulnerabilities(7);
    expect(result.items).toEqual(findings);
    expect(result.total).toBe(237);
    expect(adapter.mock.calls.map(([config]) => config.params.page)).toEqual([1, 2, 3]);
  });

  it("does not return a misleading partial success when a later page fails", async () => {
    adapter.mockImplementation(async (config) => {
      if (config.params.page === 2) throw failure(config, 500);
      return response(config, { items: [{ id: 1 }], total: 101, page: 1, size: 100, pages: 2 });
    });
    await expect(api.getVulnerabilities(7)).rejects.toBeInstanceOf(AxiosError);
  });

  it("does not duplicate rows if records shift between pages", async () => {
    adapter.mockImplementation(async (config) => response(config, config.params.page === 1
      ? { items: [{ id: 1 }, { id: 2 }], total: 3, page: 1, size: 100, pages: 2 }
      : { items: [{ id: 2 }, { id: 3 }], total: 3, page: 2, size: 100, pages: 2 }));
    expect((await api.getVulnerabilities(7)).items.map((item) => item.id)).toEqual([1, 2, 3]);
  });

  it("stops on an empty page if the dataset shrinks during loading", async () => {
    adapter.mockImplementation(async (config) => response(config, {
      items: config.params.page === 1 ? [{ id: 1 }] : [], total: 201, page: config.params.page, size: 100, pages: 3,
    }));
    expect((await api.getVulnerabilities(7)).items).toHaveLength(1);
    expect(adapter).toHaveBeenCalledTimes(2);
  });
});
