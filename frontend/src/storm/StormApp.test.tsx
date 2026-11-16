import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, vi } from "vitest";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { StormApp } from "./StormApp";
import { useAuthStore, useToastStore } from "../store";
import * as api from "../api";
import { useLangStore } from "./i18n";
import type { TaskTrackerTaskDetail } from "../types";

// The rich-text steps/impact/remediation editors are TipTap (ProseMirror), which
// doesn't expose a real `placeholder` attribute in jsdom. Mock it with a plain
// textarea so the form assertions below can address it by placeholder/value.
vi.mock("./StormMarkdownEditor", () => {
  const Mock = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <textarea placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
  );
  return { __esModule: true, default: Mock, StormMarkdownEditor: Mock };
});

vi.mock("../api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api")>();
  const mk = (id: number, name: string, status: string) => ({
    id, name, folder: "", start_date: "2026-04-27",
    end_date: "2026-07-27", timeline_frozen_at: null, status, created_by: 1,
    created_at: "2026-01-01T00:00:00Z", updated_at: "2026-07-10T00:00:00Z",
  });
  const projects = [
    mk(1, "Acme Corp — External Perimeter", "active"),
    mk(2, "Northwind API", "active"),
    mk(3, "Globex VPN Audit", "archived"),
  ];
  const mkUser = (id: number, username: string, role: string, isLead: boolean) => ({
    id, username, email: `${username}@example.com`, full_name: null, avatar_url: null,
    role, project_role: isLead ? "lead" : "pentester", is_active: true, totp_enabled: false, is_sso: false, password_changed_at: null,
    created_at: "2026-01-01T00:00:00Z",
  });
  const users = [
    mkUser(1, "admin", "admin", true),
    mkUser(2, "alice", "pentester", true),
    mkUser(5, "diana", "pentester", false),
  ];
  const ts = { created_at: "2026-01-01T00:00:00Z", updated_at: "2026-07-10T00:00:00Z" };
  const mkService = (id: number, portId: number, name: string) => ({
    id, port_id: portId, name, version: "1.25.3", banner: null, ...ts,
  });
  const mkPort = (id: number, hostId: number, ipId: number, n: number, svc: string, http: number | null = null) => ({
    id, host_id: hostId, ip_address_id: ipId, port_number: n, protocol: "tcp",
    state: "open", http_status: http, services: [mkService(id * 10, id, svc)], ...ts,
  });
  const mkIp = (
    id: number, hostId: number, ip: string, ports: unknown[],
    extra: { hostnames?: unknown[] } = {},
  ) => ({
    id, host_id: hostId, ip_address: ip, label: null, is_primary: true, ports,
    hostnames: extra.hostnames ?? [], ...ts,
  });
  // Backend-shaped hosts: ports hang off ip_addresses, services off ports.
  const hosts = [
    {
      id: 11, project_id: 2, ip_address: "203.0.113.10", hostname: "api.northwind.test",
      ip_addresses: [mkIp(101, 11, "203.0.113.10", [mkPort(1001, 11, 101, 443, "nginx", 200)])],
      status: "up", os_type: "linux", notes: null, ...ts,
    },
    {
      id: 12, project_id: 2, ip_address: null, hostname: "test.com",
      ip_addresses: [mkIp(102, 12, "203.0.113.11", [mkPort(1002, 12, 102, 22, "openssh")])],
      status: "unknown", os_type: "unknown", notes: null, ...ts,
    },
    // A subdomain of test.com — the table nests it under its parent instead of
    // listing it at top level, which is what the export has to account for.
    {
      id: 13, project_id: 2, ip_address: null, hostname: "api.test.com",
      // No HTTP code on purpose: the status-pill test relies on test.com's whole
      // subtree missing the "up" filter.
      ip_addresses: [mkIp(103, 13, "203.0.113.12", [mkPort(1003, 13, 103, 8443, "nginx")])],
      status: "up", os_type: "linux", notes: null, ...ts,
    },
    /* Added through the IP farm: no hostname of its own, origin="ip". It carries
       203.0.113.10 — the same address as host 11 — so the IPs table has to collapse
       the two into one row, and the hosts table has to hide this one entirely.
       Its 443 answers 403 to a bare-IP probe while host 11's 443 answered 200 to the
       domain probe — the IPs table must show the bare-IP measurement, Hosts the domain. */
    {
      id: 14, project_id: 2, ip_address: "203.0.113.10", hostname: null, origin: "ip",
      ip_addresses: [mkIp(104, 14, "203.0.113.10", [mkPort(1004, 14, 104, 443, "nginx", 403)], {
        hostnames: [
          { hostname: "cdn.northwind.test", source: "ptr", confirmed: true },
          { hostname: "stale.northwind.test", source: "ptr", confirmed: false },
        ],
      })],
      status: "up", os_type: "unknown", notes: null, ...ts,
    },
    {
      id: 15, project_id: 2, ip_address: "104.16.132.229", hostname: null, origin: "ip",
      ip_addresses: [mkIp(105, 15, "104.16.132.229", [])],
      status: "up", os_type: "unknown", notes: null, ...ts,
    },
  ];
  const endpointsByHost: Record<number, unknown[]> = {
    11: [{
      id: 501, host_id: 11, path: "/v1/orders", method: "GET", description: null,
      query_params: [], request_body: null, request_content_type: null, ...ts,
    }],
    12: [],
    13: [],
  };
  // Backend-shaped findings. `created_by_username` is resolved server-side, so the
  // author renders without the (admin-only) users list.
  const mkVuln = (id: number, title: string, severity: string, status: string, author: string) => ({
    id, project_id: 2, affected_host_id: 11, title, description: "", severity, status,
    cvss_version: null, cvss_score: null, cvss_vector: null, cwe_id: null,
    workflow_steps: [], steps_to_reproduce: null, impact: null, recommendations: null,
    created_by: 4, created_by_username: author, ...ts,
  });
  const vulns = [
    mkVuln(71, "IDOR on GET /orders/{id}", "critical", "open", "d.petrov"),
    mkVuln(72, "JWT algorithm confusion (alg=none)", "high", "open", "d.petrov"),
    mkVuln(73, "Mass assignment on order update", "medium", "in_progress", "m.antonov"),
  ];
  const mkNote = (id: number, title: string, content: string, author: string) => ({
    id, project_id: 2, parent_id: null, title, content, sort_order: 0,
    created_by: 4, created_by_username: author, updated_by: null, ...ts,
  });
  const notes = [mkNote(81, "Auth model", "Keycloak realms with bearer tokens.", "d.petrov")];
  const mkCred = (id: number, username: string | null, password: string, host: string | null, author: string) => ({
    id, project_id: 2, username, password, host,
    created_by: 4, created_by_username: author, ...ts,
  });
  const creds = [
    mkCred(91, "kube-admin", "eyJ.kube.token", "10.0.0.5", "d.petrov"),
    mkCred(92, "dbuser", "s3cr3t-pw", "db.internal", "m.antonov"),
  ];
  const mkToken = (id: number, name: string, prefix: string) => ({
    id, name, token_prefix: prefix, scopes: ["read:hosts"], all_projects: true,
    created_by: 1, expires_at: null, revoked_at: null, last_used_at: null,
    project_ids: [], ...ts,
  });
  return {
    ...actual,
    getWorksConfig: vi.fn(async () => null),
    getVulnerabilityWorksLink: vi.fn(async () => null),
    getHiddenIps: vi.fn(async () => []),
    listVulnerabilityFiles: vi.fn(async () => []),
    getProject: vi.fn(async (_id: number) => projects.find((p) => p.id === _id)!),
    getTasks: vi.fn(async () => ({ items: [], next_page_token: null, is_last: true })),
    getTask: vi.fn(async () => { throw new Error("Task not configured"); }),
    getProjects: vi.fn(async () => ({ items: projects, total: projects.length, page: 1, size: 100, pages: 1 })),
    getUsers: vi.fn(async () => ({ items: users, total: users.length, page: 1, size: 200, pages: 1 })),
    getInvitations: vi.fn(async () => []),
    createInvitation: vi.fn(async () => ({ invitation: { id: 1, email: "new@example.com", full_name: null, role: "pentester", project_role: "pentester", status: "pending", is_expired: false, expires_at: "2026-08-01T00:00:00Z", invited_by: 1, created_at: "2026-07-18T00:00:00Z" }, email_sent_to: "new@example.com", mail_preview_url: null })),
    resendInvitation: vi.fn(async () => ({ invitation: { id: 1, email: "new@example.com", full_name: null, role: "pentester", project_role: "pentester", status: "pending", is_expired: false, expires_at: "2026-08-01T00:00:00Z", invited_by: 1, created_at: "2026-07-18T00:00:00Z" }, email_sent_to: "new@example.com", mail_preview_url: null })),
    revokeInvitation: vi.fn(async () => undefined),
    updateUser: vi.fn(async () => users[0]),
    deleteUser: vi.fn(async () => undefined),
    getProjectStats: vi.fn(async () =>
      projects.map((p) => ({ project_id: p.id, status: p.status, hosts_count: 2, total_findings: 3, open_findings: 1 }))
    ),
    getVulnerabilities: vi.fn(async () => ({ items: vulns, total: vulns.length, page: 1, size: 100, pages: 1 })),
    getVulnerability: vi.fn(async (_p: number, id: number) => ({
      ...vulns.find((v) => v.id === id), assets: [{ id: 1, vulnerability_id: id, asset_type: "host", asset_id: 11 }],
      files: [], comments_count: 0,
    })),
    createVulnerability: vi.fn(async () => vulns[0]),
    updateVulnerability: vi.fn(async () => vulns[0]),
    deleteVulnerability: vi.fn(async () => undefined),
    listProjectNotes: vi.fn(async () => notes),
    createProjectNote: vi.fn(async () => notes[0]),
    updateProjectNote: vi.fn(async () => notes[0]),
    deleteProjectNote: vi.fn(async () => undefined),
    listProjectCredentials: vi.fn(async () => creds),
    createProjectCredential: vi.fn(async () => creds[0]),
    updateProjectCredential: vi.fn(async () => creds[0]),
    deleteProjectCredential: vi.fn(async () => undefined),
    getProjectMembers: vi.fn(async () => []),
    getProjectActivity: vi.fn(async () => [
      {
        id: 900, action: "CREATE", entity_type: "vulnerability", entity_id: 71, user_id: 4,
        username: "d.petrov", title: "IDOR on GET /orders/{id}", severity: "critical",
        url: "/projects/2/vulns/71", details: null, created_at: "2026-07-10T00:00:00Z",
      },
      // Ports never reach the feed; the UPDATE row has no details, so its host
      // name has to be resolved from the loaded hosts.
      {
        id: 901, action: "CREATE", entity_type: "port", entity_id: 1001, user_id: 1,
        username: "admin", title: null, severity: null, url: null,
        details: { port: "443/tcp", service: "nginx" }, created_at: "2026-07-10T00:00:00Z",
      },
      {
        id: 902, action: "UPDATE", entity_type: "host", entity_id: 11, user_id: 1,
        username: "admin", title: null, severity: null, url: null, details: null,
        created_at: "2026-07-10T00:00:00Z",
      },
      {
        id: 903, action: "CREATE", entity_type: "host_ip_address", entity_id: 101, user_id: 1,
        username: "admin", title: null, severity: null, url: null,
        details: { ip_address: "203.0.113.10", label: "internal" }, created_at: "2026-07-10T00:00:00Z",
      },
    ]),
    /* Empty by default: the bell renders project and finding names, and a populated
       panel would collide with the same names in the main view. The notification
       tests below opt in with mockResolvedValue. */
    listNotifications: vi.fn(async () => ({ items: [], total: 0, page: 1, size: 20, pages: 1 })),
    markNotificationRead: vi.fn(async () => undefined),
    listAgentTokens: vi.fn(async () => [mkToken(1, "CI pipeline", "storm_ci"), mkToken(2, "Slack alerts bot", "storm_sl")]),
    createProject: vi.fn(async () => projects[0]),
    updateProject: vi.fn(async () => projects[0]),
    deleteProject: vi.fn(async () => undefined),
    // Эндпоинты теперь едут прямо в списке хостов (бэкенд батч-грузит их), фронт
    // больше не дёргает getHost на каждый хост — поэтому мок списка несёт endpoints.
    getHostCreationTimes: vi.fn(async () => hosts.map((host) => host.created_at)),
    listEndpointComments: vi.fn(async () => ({ items: [], total: 0, page: 1, size: 50, pages: 1 })),
    createEndpointComment: vi.fn(),
    getHosts: vi.fn(async () => ({
      items: hosts.map((h) => ({ ...h, endpoints: endpointsByHost[h.id] ?? [] })),
      total: hosts.length, page: 1, size: 100, pages: 1,
    })),
    getHost: vi.fn(async (_projectId: number, hostId: number) => ({
      ...hosts.find((h) => h.id === hostId),
      endpoints: endpointsByHost[hostId] ?? [],
    })),
    getEndpoints: vi.fn(async (_pid: number, hostId: number) => endpointsByHost[hostId] ?? []),
    updateEndpoint: vi.fn(async (_pid: number, _hostId: number, id: number, _payload: { request_raw?: string }) => ({ id, host_id: 11, method: "POST", path: "/changed", query_params: [], request_headers: [], request_content_type: null, request_body: null, description: null, ...ts })),
    createHost: vi.fn(async () => hosts[1]),
    updateHost: vi.fn(async () => hosts[0]),
    changeIpAddress: vi.fn(async (_pid: number, previous: string, address: string) => ({
      old_ip_address: previous, ip_address: address, updated_hosts: 2,
      job: { id: 903, project_id: 2, kind: "ips", status: "pending", targets_total: 1, result: null, error: null, created_at: "2026-11-15T00:00:00Z" },
    })),
    deleteHost: vi.fn(async () => undefined),
    deleteEndpoint: vi.fn(async () => undefined),
    createEndpoint: vi.fn(async (_pid: number, hostId: number, payload: { path: string; method: string }) => ({
      id: 900, host_id: hostId, path: payload.path, method: payload.method, description: null,
      query_params: [], request_body: null, request_content_type: null, request_headers: [], ...ts,
    })),
    startHostFarm: vi.fn(async () => ({
      id: 900, project_id: 2, status: "running", targets_total: 2, result: null, error: null, created_at: "2026-07-19T00:00:00Z",
    })),
    startIpFarm: vi.fn(async () => ({
      id: 901, project_id: 2, kind: "ips", status: "running", targets_total: 2, result: null, error: null, created_at: "2026-07-19T00:00:00Z",
    })),
    getIpFarmJob: vi.fn(async () => ({
      id: 901, project_id: 2, kind: "ips", status: "done", targets_total: 2, error: null, created_at: "2026-07-19T00:00:00Z",
      result: {
        targets_parsed: 2, targets_invalid: 0, ips_created: 2, ips_updated: 0,
        ports_created: 1, ports_updated: 0, ips_online: 2, ips_offline: 0,
        hostnames_found: 1, hosts_promoted: 0, ips: [], errors: [],
      },
    })),
    startJsScan: vi.fn(async () => ({
      id: 902, project_id: 2, kind: "js", status: "running", targets_total: 1, result: null, error: null, created_at: "2026-07-19T00:00:00Z",
    })),
    getJsScanJob: vi.fn(async () => ({
      id: 902, project_id: 2, kind: "js", status: "done", targets_total: 1, error: null, created_at: "2026-07-19T00:00:00Z",
      result: { domains_scanned: 1, files_found: 1, files_scanned: 1, files_failed: 0, secrets_found: 1, endpoints_found: 2, files: [], errors: [] },
    })),
    getJsFilesPage: vi.fn(async () => ({
      items: [
        {
          id: 1, host_id: 11, hostname: "api.northwind.test", url: "https://api.northwind.test/static/app.bundle.js",
          status: "ok", size_bytes: 4096, content_type: "application/javascript", secret_count: 1, endpoint_count: 2,
          endpoints: ["/api/v1/secret-data", "/admin/panel"],
          secrets: [{ kind: "aws_access_key", match_preview: "AKIA…MPLE", snippet: "cfg={key:\"AKIA…\"}", severity: "high" }],
          fetched_at: "2026-07-19T00:00:00Z",
        },
        {
          id: 2, host_id: 11, hostname: "api.northwind.test", url: "https://api.northwind.test/vendor.js",
          status: "ok", size_bytes: 20480, content_type: "application/javascript", secret_count: 0, endpoint_count: 0,
          endpoints: [], secrets: [], fetched_at: "2026-07-19T00:00:00Z",
        },
      ],
      total: 2, page: 1, size: 200, pages: 1,
    })),
    deleteJsFilesForHost: vi.fn(async () => undefined),
    downloadJsArchive: vi.fn(async () => new Blob(["zip"], { type: "application/zip" })),
    getHostFarmJob: vi.fn(async () => ({
      id: 900, project_id: 2, status: "done", targets_total: 2, error: null, created_at: "2026-07-19T00:00:00Z",
      result: {
        targets_parsed: 2, targets_invalid: 0, hosts_created: 2, hosts_updated: 0,
        ports_created: 3, ports_updated: 0, hosts_online: 2, hosts_offline: 0, hosts: [], errors: [],
      },
    })),
  };
});

const defaultGetHosts = vi.mocked(api.getHosts).getMockImplementation()!;
const defaultGetActivity = vi.mocked(api.getProjectActivity).getMockImplementation()!;

describe("StormApp (design prototype port)", () => {
  // StormApp only ever renders behind auth, and admin-only surfaces (the
  // workspace Members page) key off the signed-in user — so sign one in.
  beforeEach(() => {
    useLangStore.getState().setLang("en");
    vi.clearAllMocks();
    vi.mocked(api.getInvitations).mockReset().mockResolvedValue([]);
    vi.mocked(api.getTasks).mockReset().mockResolvedValue({ items: [], next_page_token: null, is_last: true });
    vi.mocked(api.getTask).mockReset().mockRejectedValue(new Error("Task not configured"));
    vi.mocked(api.listEndpointComments).mockReset().mockResolvedValue({ items: [], total: 0, page: 1, size: 50, pages: 1 });
    vi.mocked(api.createEndpointComment).mockReset();
    vi.mocked(api.getHosts).mockReset().mockImplementation(defaultGetHosts);
    vi.mocked(api.getProjectActivity).mockReset().mockImplementation(defaultGetActivity);
    useToastStore.setState({ toasts: [] });
    vi.mocked(api.deleteEndpoint).mockClear();
    vi.mocked(api.deleteJsFilesForHost).mockClear();
    useAuthStore.setState({
      user: {
        id: 1, username: "admin", email: "admin@sbertech.ru", full_name: null, avatar_url: null,
        role: "admin", project_role: "lead", is_active: true, is_locked: false, totp_enabled: false, is_sso: false, password_changed_at: null,
        created_at: "2026-01-01T00:00:00Z",
      },
      isInitialized: true,
    });
    // mockResolvedValue survives the test that set it — reset it so the bell stays
    // empty for everyone else (its rows repeat project/finding names).
    vi.mocked(api.listNotifications).mockResolvedValue({ items: [], total: 0, page: 1, size: 20, pages: 1 });
  });
  afterEach(() => {
    useLangStore.getState().setLang("en");
    useAuthStore.setState({ user: null, isInitialized: false });
  });

  it("renders the Projects landing with backend rows and sidebar", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    expect(await screen.findByText("Acme Corp — External Perimeter")).toBeInTheDocument();
    expect(screen.getByText("Northwind API")).toBeInTheDocument();
    expect(screen.getAllByText("STORM").length).toBeGreaterThan(0);
    expect(screen.queryByText("My Tasks")).not.toBeInTheDocument();
  });

  it("translates already loaded project timestamps without another API request", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    await screen.findByText("Northwind API");
    const calls = vi.mocked(api.getProjects).mock.calls.length;
    expect(screen.getAllByText(/(?:min|h|days|mo) ago/).length).toBeGreaterThan(0);
    act(() => useLangStore.getState().setLang("ru"));
    expect(screen.getByPlaceholderText("Фильтр проектов…")).toBeInTheDocument();
    expect(screen.getAllByText(/назад/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/(?:min|h|days|mo) ago/)).not.toBeInTheDocument();
    expect(vi.mocked(api.getProjects)).toHaveBeenCalledTimes(calls);
  });

  it("loads only host timestamps for project charts, without downloading host trees", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    await screen.findByText("Acme Corp — External Perimeter");
    await waitFor(() => expect(vi.mocked(api.getHostCreationTimes)).toHaveBeenCalledWith(2));
    expect(vi.mocked(api.getHosts)).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Northwind API"));
    await waitFor(() => expect(vi.mocked(api.getHosts)).toHaveBeenCalledWith(2));
  });

  it("switches to the Archived tab", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    await screen.findByText("Acme Corp — External Perimeter");
    expect(screen.queryByText("Globex VPN Audit")).not.toBeInTheDocument();
    const archivedTab = screen.getAllByText("Archived").find((n) => n.closest(".tab"));
    fireEvent.click(archivedTab as HTMLElement);
    expect(await screen.findByText("Globex VPN Audit")).toBeInTheDocument();
    expect(screen.queryByText("Northwind API")).not.toBeInTheDocument();
  });

  it("opens a project and lists its Vulnerabilities from the backend", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByText("Issues"));
    expect(await screen.findByText("IDOR on GET /orders/{id}")).toBeInTheDocument();
    expect(screen.getByText("JWT algorithm confusion (alg=none)")).toBeInTheDocument();
    expect(vi.mocked(api.getVulnerabilities)).toHaveBeenCalledWith(2);
  });

  // The open section is marked by `.on` (the blue underline lives in CSS). Recon
  // opens a menu rather than a section, but it marks itself like any other tab.
  it("marks the open section's tab, Recon included", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    const sectab = (label: string) =>
      screen.getAllByText(label).find((n) => n.closest(".sectab"))?.closest(".sectab") as HTMLElement;
    expect(sectab("Overview")).toHaveClass("on");
    // Reached from the Overview stat card, which only exists on Overview.
    const hostsCard = screen.getAllByText("Hosts").find((n) => n.closest(".statc"));
    fireEvent.click(hostsCard as HTMLElement);
    expect(sectab("Recon")).toHaveClass("on");
    expect(sectab("Overview")).not.toHaveClass("on");
    fireEvent.click(sectab("Issues"));
    expect(sectab("Issues")).toHaveClass("on");
    expect(sectab("Recon")).not.toHaveClass("on");
  });

  // The recon export is a two-pane page: the left pane lists what the filters left
  // on screen, the right pane is that list, editable. Dropping a row on the right
  // has to drop it from the left too, or the panes would disagree.
  it("exports hosts as editable host:port lines, left pane following deletions", async () => {
    const { container } = render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    const hostsCard = screen.getAllByText("Hosts").find((n) => n.closest(".statc"));
    fireEvent.click(hostsCard as HTMLElement);
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    // Two buttons say "Export": the project's Word report and this recon list.
    const exportBtn = screen.getAllByRole("button", { name: /Export/i }).find((b) => b.textContent?.trim() === "Export");
    fireEvent.click(exportBtn as HTMLElement);

    const panes = () => Array.from(container.querySelectorAll("textarea")) as HTMLTextAreaElement[];
    const [left, right] = panes();
    // api.test.com nests under test.com in the table, but still has to be exported.
    expect(right.value.split("\n").sort()).toEqual(["api.northwind.test:443", "api.test.com:8443", "test.com:22"]);
    expect(left.value.split("\n").sort()).toEqual(["api.northwind.test:443", "api.test.com:8443", "test.com:22"]);

    // Drop one row on the right — the left pane must lose exactly that row.
    fireEvent.change(right, { target: { value: "test.com:22" } });
    const [leftAfter, rightAfter] = panes();
    expect(rightAfter.value).toBe("test.com:22");
    expect(leftAfter.value).toBe("test.com:22");
  });

  // The export renders the list view's own filter row, so whatever was narrowed on
  // the Hosts tab is what the export opens with.
  it("carries the hosts-tab filter into the export", async () => {
    const { container } = render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    const hostsCard = screen.getAllByText("Hosts").find((n) => n.closest(".statc"));
    fireEvent.click(hostsCard as HTMLElement);
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    fireEvent.change(screen.getByPlaceholderText("Filter by host…"), { target: { value: "northwind" } });

    const exportBtn = screen.getAllByRole("button", { name: /Export/i }).find((b) => b.textContent?.trim() === "Export");
    fireEvent.click(exportBtn as HTMLElement);
    const right = container.querySelectorAll("textarea")[1] as HTMLTextAreaElement;
    expect(right.value).toBe("api.northwind.test:443");
  });

  it("puts the export under a Project / Hosts / Export crumb that leads back", async () => {
    const { container } = render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    const hostsCard = screen.getAllByText("Hosts").find((n) => n.closest(".statc"));
    fireEvent.click(hostsCard as HTMLElement);
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    const exportBtn = screen.getAllByRole("button", { name: /Export/i }).find((b) => b.textContent?.trim() === "Export");
    fireEvent.click(exportBtn as HTMLElement);

    const crumb = Array.from(container.querySelectorAll("div.mono")).find((n) => n.textContent?.includes("Export"));
    expect(crumb?.textContent).toContain("Northwind API");
    expect(crumb?.textContent).toContain("Hosts");
    expect(crumb?.textContent).toContain("Export");

    // The middle crumb is the way back out of the form.
    const hostsCrumb = Array.from(crumb!.querySelectorAll("span")).find((s) => s.textContent === "Hosts");
    fireEvent.click(hostsCrumb as HTMLElement);
    expect(await screen.findByText("api.northwind.test", { selector: ".hostname" })).toBeInTheDocument();
  });

  it("filters vulnerabilities by host", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByText("Issues"));
    await screen.findByText("IDOR on GET /orders/{id}");
    // The lead search now matches host OR title (author has its own box).
    fireEvent.change(screen.getByPlaceholderText("Filter by host or title…"), { target: { value: "no-such-host" } });
    expect(screen.queryByText("IDOR on GET /orders/{id}")).not.toBeInTheDocument();
  });

  it("opens a vulnerability detail page and can add a reproduction step", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByText("Issues"));
    fireEvent.click(await screen.findByText("IDOR on GET /orders/{id}"));
    expect(screen.getByText("All findings")).toBeInTheDocument();
    // Steps render through the (lazy) markdown editor, so wait for them to mount.
    const before = (await screen.findAllByPlaceholderText("Describe this step… (paste a screenshot to attach)")).length;
    fireEvent.click(screen.getByText("Add step"));
    expect((await screen.findAllByPlaceholderText("Describe this step… (paste a screenshot to attach)")).length).toBe(before + 1);
  });

  // A finding's card is deep-linkable: its real id goes into the URL, which is
  // what notification and activity-feed links point at.
  it("puts the vulnerability id in the URL when its card is opened", async () => {
    render(<MemoryRouter initialEntries={["/projects/2/vulns"]}><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("IDOR on GET /orders/{id}"));
    expect(await screen.findByDisplayValue("IDOR on GET /orders/{id}")).toBeInTheDocument();
  });

  // The reverse: landing straight on /projects/2/vulns/72 must open that finding.
  it("opens a vulnerability directly from a deep link", async () => {
    render(<MemoryRouter initialEntries={["/projects/2/vulns/72"]}><StormApp /></MemoryRouter>);
    expect(await screen.findByDisplayValue("JWT algorithm confusion (alg=none)")).toBeInTheDocument();
  });

  // Creating an issue asks only for Title + Host (defaults + detail card for the rest),
  // then redirects straight to that finding's detail card.
  it("creates a finding from Title + Host and redirects to its detail card", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByText("Issues"));
    await screen.findByText("IDOR on GET /orders/{id}");
    fireEvent.click(screen.getByRole("button", { name: /Add issue/i }));
    fireEvent.change(screen.getByPlaceholderText("e.g. Stored XSS in comments"), { target: { value: "SQLi in login" } });
    fireEvent.change(screen.getByPlaceholderText("Start typing a hostname…"), { target: { value: "api.northwind.test" } });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(vi.mocked(api.createVulnerability)).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ title: "SQLi in login", host_id: 11, severity: "info", status: "open" })
    );
    // Redirected onto a finding's detail card (the mock returns finding #71).
    expect(await screen.findByDisplayValue("IDOR on GET /orders/{id}")).toBeInTheDocument();
  });

  it("derives vulnerability severity from a CVSS 4.0 vector", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByText("Issues"));
    fireEvent.click(await screen.findByText("IDOR on GET /orders/{id}"));
    const vector = screen.getByPlaceholderText(/CVSS:4\.0/);
    fireEvent.change(vector, { target: { value: "CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H" } });
    expect(screen.getByText("critical")).toBeInTheDocument();
  });

  it("opens a read-only viewer for a note authored by someone else", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByText("Notes"));
    fireEvent.click(await screen.findByText("Auth model"));
    expect(screen.getByText("Read only")).toBeInTheDocument();
  });

  it("lists project credentials masked and reveals a password on demand", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByText("Creds"));
    expect(await screen.findByText("kube-admin")).toBeInTheDocument();
    expect(screen.getByText("dbuser")).toBeInTheDocument();
    // The password stays masked until the row's eye is clicked.
    expect(screen.queryByText("eyJ.kube.token")).not.toBeInTheDocument();
    const row = screen.getByText("kube-admin").closest(".prow") as HTMLElement;
    // The host these creds belong to is shown on the row.
    expect(within(row).getByText("10.0.0.5")).toBeInTheDocument();
    fireEvent.click(within(row).getByTitle("Reveal password"));
    expect(within(row).getByText("eyJ.kube.token")).toBeInTheDocument();
    expect(vi.mocked(api.listProjectCredentials)).toHaveBeenCalledWith(2);
  });

  it("keeps the note editor and draft open after saving, then updates the same note", async () => {
    const Path = () => <span data-testid="note-path">{useLocation().pathname}</span>;
    render(<MemoryRouter initialEntries={["/projects/2/notes"]}><StormApp /><Path /></MemoryRouter>);
    fireEvent.click(await screen.findByRole("button", { name: "Add note" }));
    const title = screen.getByPlaceholderText("Give this note a title…");
    const content = screen.getByPlaceholderText(/Write your note/);
    const save = screen.getByRole("button", { name: "Save changes" });
    expect(save).toBeDisabled();
    fireEvent.change(title, { target: { value: "New note" } });
    fireEvent.change(content, { target: { value: "My draft" } });
    expect(save).not.toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(api.createProjectNote).toHaveBeenCalledWith(2, { title: "New note", content: "My draft" }));
    await waitFor(() => expect(screen.getByTestId("note-path")).toHaveTextContent("/projects/2/notes/81"));
    expect(screen.getByPlaceholderText("Give this note a title…")).toHaveValue("New note");
    expect(screen.getByPlaceholderText(/Write your note/)).toHaveValue("My draft");
    await waitFor(() => expect(save).toBeDisabled());
    fireEvent.change(content, { target: { value: "Continued editing" } });
    fireEvent.click(await screen.findByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(api.updateProjectNote).toHaveBeenCalledWith(2, 81, { title: "New note", content: "Continued editing" }));
    expect(api.createProjectNote).toHaveBeenCalledTimes(1);
    expect(screen.getByPlaceholderText(/Write your note/)).toHaveValue("Continued editing");
    expect(screen.getByTestId("note-path")).toHaveTextContent("/projects/2/notes/81");
    await waitFor(() => expect(save).toBeDisabled());
  });

  it("keeps note saving disabled until the title or content differs, including undo", async () => {
    vi.mocked(api.listProjectNotes).mockResolvedValueOnce([{
      id: 81, project_id: 2, parent_id: null, title: "My note", content: "Saved text", sort_order: 0,
      created_by: 1, created_by_username: "admin", updated_by: null,
      created_at: "2026-11-11T12:00:00Z", updated_at: "2026-11-11T12:00:00Z",
    }]);
    render(<MemoryRouter initialEntries={["/projects/2/notes"]}><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("My note"));
    const title = screen.getByPlaceholderText("Give this note a title…");
    const content = screen.getByPlaceholderText(/Write your note/);
    const save = screen.getByRole("button", { name: "Save changes" });
    expect(save).toBeDisabled();
    fireEvent.click(save);
    expect(api.updateProjectNote).not.toHaveBeenCalled();
    fireEvent.change(title, { target: { value: "Renamed" } });
    expect(save).not.toBeDisabled();
    fireEvent.change(title, { target: { value: "My note" } });
    expect(save).toBeDisabled();
    fireEvent.change(content, { target: { value: "Changed text" } });
    expect(save).not.toBeDisabled();
    fireEvent.change(content, { target: { value: "Saved text" } });
    expect(save).toBeDisabled();
  });

  it("keeps edits made during note saving dirty and allows retry after a failed save", async () => {
    let finish!: (value: Awaited<ReturnType<typeof api.createProjectNote>>) => void;
    vi.mocked(api.createProjectNote).mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
    vi.mocked(api.updateProjectNote).mockRejectedValueOnce(new Error("Save failed"));
    render(<MemoryRouter initialEntries={["/projects/2/notes"]}><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByRole("button", { name: "Add note" }));
    const title = screen.getByPlaceholderText("Give this note a title…");
    const content = screen.getByPlaceholderText(/Write your note/);
    fireEvent.change(title, { target: { value: "New note" } });
    fireEvent.change(content, { target: { value: "Sent text" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
    fireEvent.change(content, { target: { value: "Newer text" } });
    finish({ id: 81, project_id: 2, parent_id: null, title: "New note", content: "Sent text", sort_order: 0,
      created_by: 1, created_by_username: "admin", updated_by: null, created_at: "2026-11-11T12:00:00Z", updated_at: "2026-11-11T12:00:00Z" });
    const save = await screen.findByRole("button", { name: "Save changes" });
    expect(save).not.toBeDisabled();
    expect(content).toHaveValue("Newer text");
    fireEvent.click(save);
    await waitFor(() => expect(api.updateProjectNote).toHaveBeenCalledWith(2, 81, { title: "New note", content: "Newer text" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Save changes" })).not.toBeDisabled());
    expect(content).toHaveValue("Newer text");
  });

  it("adds a project credential through the backend API", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByText("Creds"));
    await screen.findByText("kube-admin");
    fireEvent.click(screen.getByRole("button", { name: /Add credential/i }));
    fireEvent.change(screen.getByPlaceholderText("account username"), { target: { value: "svc-account" } });
    fireEvent.change(screen.getByPlaceholderText("account password"), { target: { value: "hunter2" } });
    // Host binds to a real project host (case-insensitive), like the member picker.
    fireEvent.change(screen.getByPlaceholderText("Start typing a hostname…"), { target: { value: "API.northwind.test" } });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(vi.mocked(api.createProjectCredential)).toHaveBeenCalledWith(2, expect.objectContaining({ username: "svc-account", password: "hunter2", host: "api.northwind.test" }));
  });

  // The Creds section is deep-linkable, like Members and Activity.
  it("opens the Creds section directly from a deep link", async () => {
    render(<MemoryRouter initialEntries={["/projects/2/creds"]}><StormApp /></MemoryRouter>);
    expect(await screen.findByText("kube-admin")).toBeInTheDocument();
  });

  it("creates a new project through the backend API", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    await screen.findByText("Acme Corp — External Perimeter");
    fireEvent.click(screen.getByRole("button", { name: /New project/i }));
    fireEvent.change(screen.getByPlaceholderText("e.g. Acme Corp — External Perimeter"), { target: { value: "Initech Web App" } });
    const modal = screen.getByRole("heading", { name: "New project" }).closest(".modalcard") as HTMLElement;
    expect(within(modal).queryByText("Description")).not.toBeInTheDocument();
    fireEvent.change(within(modal).getByPlaceholderText("Paste a URL or start typing a ticket…"), { target: { value: "https://tracker.example/APPSEC-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Create project" }));
    expect(vi.mocked(api.createProject)).toHaveBeenCalledWith(expect.objectContaining({ name: "Initech Web App" }));
    expect(vi.mocked(api.createProject).mock.calls[0][0]).not.toHaveProperty("description");
  });

  const trackerCard = (): TaskTrackerTaskDetail => ({
    key: "APPSEC-701", url: "https://tracker.example/swtr/units/current/unit/APPSEC-701?space=APPSEC",
    summary: "Native APPSEC assessment", status: "Open", status_category: "todo", issue_type: "Assessment",
    priority: "High", assignee: "Мария Петрова", assignee_username: "m.petrova",
    affected_versions: [{ code: "v1", name: "Platform 1.0" }, { code: "v2", name: "Platform 2.0" }],
    created: "2026-11-01T00:00:00Z", updated: "2026-11-15T00:00:00Z",
    reporter: "admin", description: "Native card body", labels: [], is_demo: true,
  });

  it("creates a project with the assignee login and all versions from the full task card", async () => {
    const detail = trackerCard();
    vi.mocked(api.getTasks).mockResolvedValue({ items: [{ ...detail, assignee: "Stale row", affected_versions: [] }], next_page_token: null, is_last: true });
    vi.mocked(api.getTask).mockResolvedValue(detail);
    render(<MemoryRouter initialEntries={["/tasks"]}><StormApp /></MemoryRouter>);
    await screen.findByText(detail.summary);
    expect(screen.getByText("Demo data")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Create project from this ticket" }));
    await screen.findByDisplayValue("Мария Петрова");
    expect(api.getTask).toHaveBeenCalledWith("APPSEC-701");
    const modal = screen.getByRole("heading", { name: "New project" }).closest(".modalcard") as HTMLElement;
    expect(within(modal).getByText("Platform 1.0")).toBeInTheDocument();
    expect(within(modal).getByText("Platform 2.0")).toBeInTheDocument();
    expect(within(modal).getByRole("textbox", { name: "AppSec ticket" })).toHaveValue("APPSEC-701");
    fireEvent.change(within(modal).getByPlaceholderText("e.g. Acme Corp — External Perimeter"), { target: { value: "Created from APPSEC" } });
    fireEvent.click(within(modal).getByRole("button", { name: "Create project" }));
    expect(api.createProject).toHaveBeenCalledWith(expect.objectContaining({ appsec_ticket_key: "APPSEC-701", appsec_assignee: "m.petrova", appsec_assignee_name: "Мария Петрова", appsec_versions: detail.affected_versions }));
  });

  it("opens a task without assignee or versions with empty optional project fields", async () => {
    const detail = { ...trackerCard(), assignee: null, assignee_username: null, affected_versions: [] };
    vi.mocked(api.getTasks).mockResolvedValue({ items: [detail], next_page_token: null, is_last: true });
    vi.mocked(api.getTask).mockResolvedValue(detail);
    render(<MemoryRouter initialEntries={["/tasks"]}><StormApp /></MemoryRouter>);
    await screen.findByText(detail.summary);
    fireEvent.click(screen.getByRole("button", { name: "Create project from this ticket" }));
    const modal = screen.getByRole("heading", { name: "New project" }).closest(".modalcard") as HTMLElement;
    await waitFor(() => expect(modal.closest(".modalback")).toHaveClass("open"));
    expect(within(modal).getByPlaceholderText("Start typing a name…")).toHaveValue("");
    expect(within(modal).queryAllByRole("button", { name: /Remove version/ })).toHaveLength(0);
  });

  it.each(["cancel", "escape", "backdrop"])("clears a cancelled task draft before normal project creation (%s)", async (method) => {
    vi.mocked(api.getTasks).mockResolvedValue({ items: [trackerCard()], next_page_token: null, is_last: true });
    vi.mocked(api.getTask).mockResolvedValue(trackerCard());
    render(<MemoryRouter initialEntries={["/tasks"]}><StormApp /></MemoryRouter>);
    await screen.findByText("Native APPSEC assessment");
    fireEvent.click(screen.getByRole("button", { name: "Create project from this ticket" }));
    await screen.findByDisplayValue("Мария Петрова");
    const modal = screen.getByRole("heading", { name: "New project" }).closest(".modalcard") as HTMLElement;
    fireEvent.change(within(modal).getByPlaceholderText("e.g. Acme Corp — External Perimeter"), { target: { value: "Cancelled draft" } });
    if (method === "cancel") fireEvent.click(within(modal).getByRole("button", { name: "Cancel" }));
    else if (method === "escape") fireEvent.keyDown(document.body, { key: "Escape" });
    else fireEvent.click(modal.closest(".modalback")!);
    expect(modal.closest(".modalback")).not.toHaveClass("open");
    fireEvent.click(screen.getByText("Projects"));
    await screen.findByText("Acme Corp — External Perimeter");
    fireEvent.click(screen.getByRole("button", { name: /New project/i }));
    expect(within(modal).getByPlaceholderText("e.g. Acme Corp — External Perimeter")).toHaveValue("");
    expect(within(modal).getByRole("textbox", { name: "AppSec ticket" })).toHaveValue("");
    expect(within(modal).getByPlaceholderText("Start typing a name…")).toHaveValue("");
    expect(within(modal).queryAllByRole("button", { name: /Remove version/ })).toHaveLength(0);
    expect(api.createProject).not.toHaveBeenCalled();
  });

  it("shows missing project fields in an error toast when exporting findings", async () => {
    render(<MemoryRouter initialEntries={["/projects/2/vulns"]}><StormApp /></MemoryRouter>);
    const button = await screen.findByRole("button", { name: "Export all to Task Tracker" });
    fireEvent.click(button);
    await waitFor(() => expect(useToastStore.getState().toasts).toEqual(expect.arrayContaining([
      expect.objectContaining({ severity: "error", message: "Fill in project details. Missing: AppSec ticket, Assignee, Affected versions" }),
    ])));
    expect(screen.queryByRole("button", { name: "Start export" })).not.toBeInTheDocument();
  });

  it("checks incomplete project data before exporting an individual finding", async () => {
    render(<MemoryRouter initialEntries={["/projects/2/vulns/72"]}><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByRole("button", { name: "Export to Task Tracker" }));
    await waitFor(() => expect(useToastStore.getState().toasts.some((toast) => toast.severity === "error" && toast.message.includes("AppSec ticket, Assignee, Affected versions"))).toBe(true));
    expect(screen.getByRole("heading", { name: "Export to Task Tracker" }).closest(".modalback")).not.toHaveClass("open");
  });

  it("shows a task loading error without opening a partially populated project form", async () => {
    vi.mocked(api.getTasks).mockResolvedValue({ items: [trackerCard()], next_page_token: null, is_last: true });
    vi.mocked(api.getTask).mockRejectedValue(new Error("Tracker offline"));
    render(<MemoryRouter initialEntries={["/tasks"]}><StormApp /></MemoryRouter>);
    await screen.findByText("Native APPSEC assessment");
    fireEvent.click(screen.getByRole("button", { name: "Create project from this ticket" }));
    await waitFor(() => expect(useToastStore.getState().toasts.some((toast) => toast.message.includes("Couldn't load this task"))).toBe(true));
    expect(screen.getByRole("heading", { name: "New project" }).closest(".modalback")).not.toHaveClass("open");
  });

  it("ignores a late task response after leaving Tasks", async () => {
    let finish!: (value: TaskTrackerTaskDetail) => void;
    vi.mocked(api.getTasks).mockResolvedValue({ items: [trackerCard()], next_page_token: null, is_last: true });
    vi.mocked(api.getTask).mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    render(<MemoryRouter initialEntries={["/tasks"]}><StormApp /></MemoryRouter>);
    await screen.findByText("Native APPSEC assessment");
    fireEvent.click(screen.getByRole("button", { name: "Create project from this ticket" }));
    fireEvent.click(screen.getByText("Projects"));
    await screen.findByText("Acme Corp — External Perimeter");
    await act(async () => { finish(trackerCard()); });
    expect(screen.getByRole("heading", { name: "New project" }).closest(".modalback")).not.toHaveClass("open");
  });

  it("renders every affected version in the task card", async () => {
    vi.mocked(api.getTask).mockResolvedValue(trackerCard());
    render(<MemoryRouter initialEntries={["/tasks/APPSEC-701"]}><StormApp /></MemoryRouter>);
    await screen.findByText("Native card body");
    const sidebar = document.querySelector(".task-detail-side") as HTMLElement;
    expect(within(sidebar).getByText("Мария Петрова")).toBeInTheDocument();
    expect(within(sidebar).getByText("Platform 1.0")).toBeInTheDocument();
    expect(within(sidebar).getByText("Platform 2.0")).toBeInTheDocument();
  });

  it("creates a project without an APPSEC ticket", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    await screen.findByText("Acme Corp — External Perimeter");
    fireEvent.click(screen.getByRole("button", { name: /New project/i }));
    fireEvent.change(screen.getByPlaceholderText("e.g. Acme Corp — External Perimeter"), { target: { value: "Required ticket" } });
    fireEvent.click(screen.getByRole("button", { name: "Create project" }));
    await waitFor(() => expect(api.createProject).toHaveBeenCalledWith(expect.objectContaining({ name: "Required ticket", appsec_ticket_key: null, appsec_ticket_url: null })));
  });

  it("closes an open modal when Escape is pressed", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    await screen.findByText("Acme Corp — External Perimeter");
    fireEvent.click(screen.getByRole("button", { name: /New project/i }));
    const back = screen.getByPlaceholderText("e.g. Acme Corp — External Perimeter").closest(".modalback") as HTMLElement;
    expect(back).toHaveClass("open");
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(back).not.toHaveClass("open");
  });

  it("does not render a description column in the project list", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    await screen.findByText("Acme Corp — External Perimeter");
    const projects = screen.getByRole("heading", { name: "Projects" }).closest(".route") as HTMLElement;
    expect(within(projects).queryByText("Description")).not.toBeInTheDocument();
    expect(within(projects).getByText("Findings")).toBeInTheDocument();
  });

  // "API keys" are the backend's agent tokens; only their prefix is ever shown.
  it("navigates to Profile and lists API keys from the backend", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(screen.getByText("Profile"));
    expect(screen.getByRole("heading", { name: "Profile Settings" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("API & Automation"));
    expect(await screen.findByText("CI pipeline")).toBeInTheDocument();
    expect(screen.getByText("Slack alerts bot")).toBeInTheDocument();
    expect(vi.mocked(api.listAgentTokens)).toHaveBeenCalled();
  });

  it("opens the workspace Members admin page with users from the backend", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(screen.getByText("Members"));
    expect(screen.getByRole("heading", { name: "Members" })).toBeInTheDocument();
    expect(await screen.findByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("diana@example.com")).toBeInTheDocument();
  });

  it("shows a friendly mail-delivery failure for an invitation", async () => {
    vi.mocked(api.getInvitations).mockResolvedValue([{
      id: 999, email: "waiting@example.com", full_name: null, role: "pentester", project_role: "pentester",
      status: "pending", is_expired: false, expires_at: "2026-12-01T00:00:00Z", invited_by: 1,
      created_at: "2026-11-16T00:00:00Z", email_status: "failed", email_error_code: "mail_auth_failed",
      email_error: "SMTPAuthenticationError password=must-never-display",
    }]);
    render(<MemoryRouter initialEntries={["/members"]}><StormApp /></MemoryRouter>);
    await screen.findByText("waiting@example.com");
    expect(screen.getByText("Email could not be sent. Ask an administrator to check the mail settings.")).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("must-never-display");
    expect(useToastStore.getState().toasts).toEqual(expect.arrayContaining([
      expect.objectContaining({ severity: "error", message: "Email could not be sent. Ask an administrator to check the mail settings." }),
    ]));
  });

  const openHostsSection = async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    const hostsCard = screen.getAllByText("Hosts").find((n) => n.closest(".statc"));
    fireEvent.click(hostsCard as HTMLElement);
  };

  it("renders hosts loaded from the backend", async () => {
    await openHostsSection();
    // `.hostname` scopes to the hosts table (the export modal lists the same names).
    expect(await screen.findByText("api.northwind.test", { selector: ".hostname" })).toBeInTheDocument();
    expect(screen.getByText("test.com", { selector: ".hostname" })).toBeInTheDocument();
    expect(vi.mocked(api.getHosts)).toHaveBeenCalledWith(2);
    // Ports come from the nested ip_addresses[].ports of the API payload.
    expect(screen.getByText("443/tcp")).toBeInTheDocument();
    expect(screen.getByText("22/tcp")).toBeInTheDocument();
    // The probed HTTP status renders next to its port (scope to the row — "200" is
    // also a filter pill in the toolbar).
    const row = screen.getByText("api.northwind.test", { selector: ".hostname" }).closest(".prow") as HTMLElement;
    expect(within(row).getByText("200")).toBeInTheDocument();
  });

  it("filters hosts by the status pills (empty = all)", async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    expect(screen.getByText("test.com", { selector: ".hostname" })).toBeInTheDocument();
    // "up" pill → only the up host remains (test.com is unknown).
    fireEvent.click(screen.getByText("up"));
    expect(screen.getByText("api.northwind.test", { selector: ".hostname" })).toBeInTheDocument();
    expect(screen.queryByText("test.com", { selector: ".hostname" })).not.toBeInTheDocument();
  });

  it("populates host endpoints from the backend on the Recon → Endpoints view", async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    const endpointsItem = screen.getAllByText("Endpoints").find((n) => n.closest(".menu"));
    fireEvent.click(endpointsItem as HTMLElement);
    // Only host 11 has endpoints, so it is the sole group; expand it to list them.
    const group = screen.getAllByText("api.northwind.test").find((n) => n.closest(".prow"));
    fireEvent.click(group as HTMLElement);
    expect(await screen.findByText("/v1/orders")).toBeInTheDocument();
    // Эндпоинты приезжают прямо в списке хостов (getHosts), getHost на каждый хост
    // больше не вызывается (убран N+1) — факт рендера «/v1/orders» это и подтверждает.
  });

  const openEndpointsView = async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    fireEvent.click(screen.getAllByText("Endpoints").find((node) => node.closest(".menu")) as HTMLElement);
  };

  it("deletes only the endpoints of the chosen host", async () => {
    const base = await api.getHosts(2);
    const endpoint = base.items.find((host) => host.id === 11)!.endpoints![0];
    vi.mocked(api.getHosts).mockResolvedValue({ ...base, items: base.items.map((host) => host.id === 12 ? { ...host, endpoints: [{ ...endpoint, id: 502, host_id: 12, path: "/other" }] } : host) });
    await openEndpointsView();
    expect(screen.getByRole("button", { name: "Delete endpoints: test.com" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete endpoints: api.northwind.test" }));
    const dialog = document.querySelector(".modalback.open") as HTMLElement;
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(api.deleteEndpoint).toHaveBeenCalledWith(2, 11, 501));
    expect(api.deleteEndpoint).toHaveBeenCalledTimes(1);
  });

  it("renames an endpoint group host using its pencil", async () => {
    await openEndpointsView();
    fireEvent.click(screen.getByRole("button", { name: "Edit host: api.northwind.test" }));
    const dialog = document.querySelector(".modalback.open") as HTMLElement;
    fireEvent.change(within(dialog).getByDisplayValue("api.northwind.test"), { target: { value: "renamed.example.com" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(api.updateHost).toHaveBeenCalledWith(2, 11, { hostname: "renamed.example.com" }));
  });

  it("opens the request via pencil and saves a changed endpoint with matching copy buttons", async () => {
    await openEndpointsView();
    fireEvent.click(screen.getAllByText("api.northwind.test").find((node) => node.closest(".prow")) as HTMLElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit endpoint: GET /v1/orders" }));
    const dialog = screen.getByRole("dialog", { name: "Endpoint request" });
    const request = within(dialog).getByRole("textbox", { name: "HTTP request" });
    await waitFor(() => expect(request).not.toBeDisabled());
    const save = within(dialog).getByRole("button", { name: "Save changes" });
    const original = (request as HTMLTextAreaElement).value;
    expect(save).toBeDisabled();
    fireEvent.click(save);
    expect(api.updateEndpoint).not.toHaveBeenCalled();
    const copyRequest = within(dialog).getByRole("button", { name: "Copy request" });
    const copyCurl = within(dialog).getByRole("button", { name: "Copy cURL" });
    expect(copyRequest.nextElementSibling).toBe(copyCurl);
    expect(copyRequest).toHaveStyle({ border: "1px solid var(--st-accent-2)", color: "var(--st-accent-2)" });
    expect(copyCurl.style.cssText).toBe(copyRequest.style.cssText);
    const raw = "POST /changed HTTP/1.1\nHost: api.northwind.test";
    fireEvent.change(request, { target: { value: raw } });
    expect(save).not.toBeDisabled();
    fireEvent.change(request, { target: { value: original } });
    expect(save).toBeDisabled();
    fireEvent.change(request, { target: { value: raw } });
    fireEvent.click(save);
    await waitFor(() => expect(api.updateEndpoint).toHaveBeenCalledWith(2, 11, 501, { request_raw: raw }));
    await waitFor(() => expect(save).toBeDisabled());
    expect(save).toBeInTheDocument();
    expect(within(dialog).getByText("/changed")).toBeInTheDocument();
  });

  it("posts a real endpoint comment, keeps the request dialog open and reloads it after reopening", async () => {
    const saved = { id: 901, endpoint_id: 501, user_id: 1, username: "admin", avatar_url: null, content: "Комментарий сохранён", created_at: "2026-11-11T12:00:00Z", updated_at: "2026-11-11T12:00:00Z" };
    vi.mocked(api.createEndpointComment).mockResolvedValue(saved);
    vi.mocked(api.listEndpointComments).mockResolvedValueOnce({ items: [], total: 0, page: 1, size: 50, pages: 1 })
      .mockResolvedValueOnce({ items: [saved], total: 1, page: 1, size: 50, pages: 1 });
    await openEndpointsView();
    fireEvent.click(screen.getAllByText("api.northwind.test").find((node) => node.closest(".prow")) as HTMLElement);
    const edit = screen.getByRole("button", { name: "Edit endpoint: GET /v1/orders" });
    fireEvent.click(edit);
    const dialog = screen.getByRole("dialog", { name: "Endpoint request" });
    await within(dialog).findByText("No comments yet — start the discussion.");
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Endpoint comment" }), { target: { value: saved.content } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Post comment" }));
    expect(await within(dialog).findByText(saved.content)).toBeInTheDocument();
    expect(dialog).toBeInTheDocument();
    expect(api.createEndpointComment).toHaveBeenCalledWith(2, 11, 501, saved.content);
    fireEvent.click(dialog.parentElement!);
    fireEvent.click(edit);
    expect(await screen.findByText(saved.content)).toBeInTheDocument();
    expect(api.listEndpointComments).toHaveBeenCalledTimes(2);
  });

  it.each(["Add endpoints", "Export"])("uploads Swagger from %s into both import fields without saving immediately", async (entry) => {
    await openEndpointsView();
    expect(screen.queryByRole("button", { name: "Upload Swagger JSON" })).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: entry })[0]);
    const upload = screen.getByRole("button", { name: "Upload Swagger JSON" });
    expect(upload.parentElement?.lastElementChild).toBe(upload);
    fireEvent.click(upload);
    const dialog = screen.getByRole("dialog", { name: "Upload Swagger JSON" });
    const file = new File([JSON.stringify({ swagger: "2.0", host: "api.northwind.test", basePath: "/api", paths: { "/pets": { head: {} } } })], "swagger.json");
    fireEvent.drop(within(dialog).getByRole("button", { name: "Drop Swagger JSON here" }), { dataTransfer: { files: [file] } });
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Paste endpoints" })).toHaveValue("HEAD https://api.northwind.test/api/pets"));
    expect(screen.getByRole("textbox", { name: "Will be imported" })).toHaveValue("HEAD https://api.northwind.test/api/pets");
  });

  it.each([{ host: "unknown", servers: [] }, { host: "newapi.test", servers: [{ url: "https://newapi.test" }] }])("creates one $host host from Swagger when it does not exist", async ({ host, servers }) => {
    await openEndpointsView();
    const base = await api.getHosts(2);
    vi.mocked(api.createHost).mockResolvedValueOnce({ ...base.items[0], id: 900, hostname: host, ip_addresses: [], ip_address: null });
    vi.mocked(api.createHost).mockClear();
    vi.mocked(api.createEndpoint).mockClear();
    fireEvent.click(screen.getAllByRole("button", { name: "Export" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Upload Swagger JSON" }));
    fireEvent.change(screen.getByLabelText("Swagger JSON files"), { target: { files: [new File([JSON.stringify({ openapi: "3.2.1", servers, paths: { "/first": { query: {} }, "/second": { options: {} } } })], "api.json")] } });
    await screen.findByRole("textbox", { name: "Will be imported" });
    expect(api.createHost).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Add endpoints" }));
    await waitFor(() => expect(api.createEndpoint).toHaveBeenCalledWith(2, 900, { path: "/second", method: "OPTIONS" }));
    expect(api.createHost).toHaveBeenCalledTimes(1);
    expect(api.createHost).toHaveBeenCalledWith(2, { hostname: host });
  });

  it("bulk-adds endpoints from a pasted URL list, matching hosts by name", async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    fireEvent.click(screen.getAllByText("Endpoints").find((n) => n.closest(".menu")) as HTMLElement);
    // "Add endpoints" opens a full paste page (like Add hosts/IPs), not the old modal.
    fireEvent.click(screen.getByRole("button", { name: /Add endpoints/i }));
    // api.northwind.test is a project host → its lines create; other.example.com is not → skipped.
    fireEvent.change(screen.getByPlaceholderText(/example\.com/), {
      target: { value: "https://api.northwind.test/v2/login\nPOST https://api.northwind.test/api/users\nhttps://other.example.com/x" },
    });
    // Preview normalizes to METHOD + URL.
    const preview = screen.getByPlaceholderText(/parsed endpoints/) as HTMLTextAreaElement;
    expect(preview.value).toContain("GET https://api.northwind.test/v2/login");
    expect(preview.value).toContain("POST https://api.northwind.test/api/users");
    fireEvent.click(screen.getByRole("button", { name: /Add endpoints/i }));
    await waitFor(() => expect(vi.mocked(api.createEndpoint)).toHaveBeenCalledTimes(2));
    expect(vi.mocked(api.createEndpoint)).toHaveBeenCalledWith(2, 11, { path: "/v2/login", method: "GET" });
    expect(vi.mocked(api.createEndpoint)).toHaveBeenCalledWith(2, 11, { path: "/api/users", method: "POST" });
  });

  it("places a grey deletion button beside each host count and requires confirmation", async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    fireEvent.click(screen.getAllByText("Endpoints").find((n) => n.closest(".menu")) as HTMLElement);
    const button = screen.getByRole("button", { name: "Delete endpoints: api.northwind.test" });
    expect(button.previousElementSibling).toHaveAccessibleName("Edit host: api.northwind.test");
    expect(button.parentElement?.previousElementSibling).toHaveTextContent("1");
    expect(screen.queryByRole("button", { name: "Delete endpoints" })).not.toBeInTheDocument();
    expect(button.parentElement).toHaveClass("endpoint-actions");
    fireEvent.click(button);
    expect(api.deleteEndpoint).not.toHaveBeenCalled();
    let dialog = document.querySelector(".modalback.open") as HTMLElement;
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(api.deleteEndpoint).not.toHaveBeenCalled();
    fireEvent.click(button);
    dialog = document.querySelector(".modalback.open") as HTMLElement;
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(api.deleteEndpoint).toHaveBeenCalledWith(2, 11, 501));
    await waitFor(() => expect(useToastStore.getState().toasts).toEqual(expect.arrayContaining([
      expect.objectContaining({ message: "Endpoints deleted: 1", severity: "success" }),
    ])));
  });

  it("disables endpoint deletion for empty filters and reports API failures as toasts", async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    fireEvent.click(screen.getAllByText("Endpoints").find((n) => n.closest(".menu")) as HTMLElement);
    const filter = screen.getByPlaceholderText("Filter by endpoint…");
    fireEvent.change(filter, { target: { value: "no-matching-endpoint" } });
    expect(screen.queryByRole("button", { name: /Delete endpoints:/ })).not.toBeInTheDocument();
    fireEvent.change(filter, { target: { value: "orders" } });
    vi.mocked(api.deleteEndpoint).mockRejectedValueOnce(new Error("Server error"));
    fireEvent.click(screen.getByRole("button", { name: "Delete endpoints: api.northwind.test" }));
    const dialog = document.querySelector(".modalback.open") as HTMLElement;
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(useToastStore.getState().toasts).toEqual(expect.arrayContaining([
      expect.objectContaining({ message: "Couldn't delete endpoints: 1", severity: "error" }),
    ])));
  });

  it("imports a pasted host list through the probe farm (page + live banner)", async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    // "Add hosts" opens a full page (not a modal) with a paste textarea.
    fireEvent.click(screen.getByRole("button", { name: /Add hosts/i }));
    fireEvent.change(screen.getByPlaceholderText(/example\.com/), { target: { value: "https://example.com\nwww.example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Probe & add/i }));
    // Submit sends the deduped/normalized preview (right pane), not the raw paste.
    expect(vi.mocked(api.startHostFarm)).toHaveBeenCalledWith(2, "example.com:443\nwww.example.com");
    // Returns to the list immediately with a live "probing" banner; the background
    // job is then polled (mock → done), which reloads the hosts.
    expect(await screen.findByText(/Probing 2 hosts/)).toBeInTheDocument();
    await waitFor(() => expect(vi.mocked(api.getHostFarmJob)).toHaveBeenCalled(), { timeout: 3000 });
  });

  /* The IPs view: one row per address (however many hosts or names it has), a
     no Cloudflare or Status columns. */
  const openIpsView = async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    const ipsItem = screen.getAllByText("IPs").find((n) => n.closest(".menu"));
    fireEvent.click(ipsItem as HTMLElement);
  };

  const openJsView = async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    const jsItem = screen.getAllByText("JS").find((n) => n.closest(".menu"));
    fireEvent.click(jsItem as HTMLElement);
  };

  it("edits an actual IP from its card and queues a refresh without changing the hostname", async () => {
    await openIpsView();
    fireEvent.click((await screen.findAllByText("203.0.113.10"))[0]);
    fireEvent.click(await screen.findByRole("button", { name: "Edit IP" }));
    const modal = screen.getByRole("heading", { name: "Edit IP address" }).closest(".modalcard") as HTMLElement;
    expect(within(modal).queryByText("Hostname")).not.toBeInTheDocument();
    expect(within(modal).getByRole("button", { name: "Save changes" })).toBeDisabled();
    const input = within(modal).getByDisplayValue("203.0.113.10");
    fireEvent.change(input, { target: { value: "203.0.113.20" } });
    fireEvent.click(within(modal).getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(api.changeIpAddress).toHaveBeenCalledWith(2, "203.0.113.10", "203.0.113.20"));
    expect(api.updateHost).not.toHaveBeenCalled();
    await waitFor(() => expect(modal.closest(".modalback")).not.toHaveClass("open"));
    expect(useToastStore.getState().toasts).toEqual(expect.arrayContaining([expect.objectContaining({ message: "IP updated. Refreshing its information…", severity: "success" })]));
  });

  it("keeps a rejected IP change editable and displays an error", async () => {
    vi.mocked(api.changeIpAddress).mockRejectedValueOnce(new Error("IP already exists"));
    await openIpsView();
    const row = (await screen.findAllByText("203.0.113.10"))[0].closest(".prow") as HTMLElement;
    fireEvent.click(within(row).getByRole("button", { name: "Edit IP: 203.0.113.10" }));
    const modal = screen.getByRole("heading", { name: "Edit IP address" }).closest(".modalcard") as HTMLElement;
    fireEvent.change(within(modal).getByDisplayValue("203.0.113.10"), { target: { value: "203.0.113.11" } });
    fireEvent.click(within(modal).getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(useToastStore.getState().toasts.some((toast) => toast.message === "Couldn't update IP address")).toBe(true));
    expect(modal.closest(".modalback")).toHaveClass("open");
    expect(within(modal).getByDisplayValue("203.0.113.11")).toBeInTheDocument();
    expect(within(modal).getByRole("button", { name: "Save changes" })).not.toBeDisabled();
  });

  it("has no JS delete-all button and confirms host deletion inside the app", async () => {
    await openJsView();
    const row = (await screen.findByText("api.northwind.test", { selector: ".hostname" })).closest(".prow") as HTMLElement;
    expect(screen.queryByRole("button", { name: "Delete objects" })).not.toBeInTheDocument();
    fireEvent.click(row.querySelector(".actbtn.del") as HTMLElement);
    expect(api.deleteJsFilesForHost).not.toHaveBeenCalled();
    const dialog = document.querySelector(".modalback.open") as HTMLElement;
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(api.deleteJsFilesForHost).toHaveBeenCalledWith(2, 11));
    await waitFor(() => expect(useToastStore.getState().toasts).toEqual(expect.arrayContaining([
      expect.objectContaining({ message: "JS findings deleted", severity: "success" }),
    ])));
  });

  it("lists JS grouped by host, expands to files, and opens a file card with its findings", async () => {
    await openJsView();
    // The host group row, collapsed, carries the host's aggregate counts.
    const groupRow = (await screen.findByText("api.northwind.test", { selector: ".hostname" })).closest(".prow") as HTMLElement;
    expect(within(groupRow).getByText(/1 .*secret/i)).toBeInTheDocument();
    expect(within(groupRow).getByText(/2 .*path/i)).toBeInTheDocument();
    // Expanding the group reveals its files; clicking a file opens its detail card.
    fireEvent.click(groupRow);
    const fileRow = (await screen.findByText("app.bundle.js")).closest(".prow") as HTMLElement;
    fireEvent.click(fileRow);
    // The file card shows the actual finding: kind, redacted value, and a path.
    expect(await screen.findByText("aws_access_key")).toBeInTheDocument();
    expect(screen.getByText("AKIA…MPLE")).toBeInTheDocument();
    expect(screen.getByText("/api/v1/secret-data")).toBeInTheDocument();
    expect(vi.mocked(api.getJsFilesPage)).toHaveBeenCalledWith(2, 1, 200);
  });

  it("filters JS files to only those with secrets", async () => {
    await openJsView();
    // Expand the host group so its files are visible.
    fireEvent.click((await screen.findByText("api.northwind.test", { selector: ".hostname" })).closest(".prow") as HTMLElement);
    expect(await screen.findByText("app.bundle.js")).toBeInTheDocument();
    expect(screen.getByText("vendor.js")).toBeInTheDocument();
    // "With secrets" drops the clean vendor.js bundle; the group stays expanded.
    const group = screen.getByText("Secrets", { selector: "span" }).parentElement as HTMLElement;
    fireEvent.click(within(group).getByText("With secrets"));
    expect(await screen.findByText("app.bundle.js")).toBeInTheDocument();
    expect(screen.queryByText("vendor.js")).not.toBeInTheDocument();
  });

  it("picks domains then starts a JS scan and polls it to completion", async () => {
    await openJsView();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    // The header button now opens a domain picker instead of scanning straight away.
    fireEvent.click(screen.getByRole("button", { name: /Select domains & scan/i }));
    // The picker seeds itself with the project's domains; starting sends that list.
    const startBtn = await screen.findByRole("button", { name: /Start scan/i });
    fireEvent.click(startBtn);
    expect(vi.mocked(api.startJsScan)).toHaveBeenCalledWith(2, expect.stringContaining("api.northwind.test"));
    // A running job shows the banner, then polling flips it to done and reloads.
    expect(await screen.findByText(/Scanning 1/)).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Recon progress" }).previousElementSibling).toHaveTextContent("Total JS files");
    await waitFor(() => expect(vi.mocked(api.getJsScanJob)).toHaveBeenCalled(), { timeout: 3000 });
  });

  it("collapses one address into a single row listing every hostname", async () => {
    await openIpsView();
    // 203.0.113.10 belongs to host 11 (by name) and to the IP-farm row 14 (by PTR).
    const cells = await screen.findAllByText("203.0.113.10");
    const rows = cells.map((c) => c.closest(".prow")).filter(Boolean);
    expect(rows).toHaveLength(1);
    const row = rows[0] as HTMLElement;
    // Every name lands in the one Hostname cell — PTR names plus the host's own.
    expect(within(row).getByText("api.northwind.test")).toBeInTheDocument();
    expect(within(row).getByText("cdn.northwind.test")).toBeInTheDocument();
    expect(within(row).getByText("stale.northwind.test")).toBeInTheDocument();
  });

  it("renders detected technologies as chips in the host card", async () => {
    await openHostsSection();
    // test.com's port 22 carries a detected service (openssh 1.25.3) — the host
    // card shows it as a tech chip in the Service column.
    fireEvent.click(await screen.findByText("test.com", { selector: ".hostname" }));
    expect(await screen.findByText("openssh 1.25.3")).toBeInTheDocument();
  });

  it("shows the bare-IP port measurement in IPs, the domain one in Hosts", async () => {
    // 203.0.113.10: host 11 probed it via the domain (443 → 200); the IP farm
    // probed the bare address (443 → 403). The two must not blend.
    await openIpsView();
    const ipRow = (await screen.findAllByText("203.0.113.10"))[0].closest(".prow") as HTMLElement;
    expect(within(ipRow).getByText("403")).toBeInTheDocument();
    expect(within(ipRow).queryByText("200")).not.toBeInTheDocument();

    // The Hosts table still reflects the domain probe for the same host.
    await openHostsSection();
    const hostRow = (await screen.findByText("api.northwind.test", { selector: ".hostname" })).closest(".prow") as HTMLElement;
    expect(within(hostRow).getByText("200")).toBeInTheDocument();
    expect(within(hostRow).queryByText("403")).not.toBeInTheDocument();
  });

  it("marks a PTR name with no matching forward record as unconfirmed", async () => {
    await openIpsView();
    await screen.findAllByText("203.0.113.10");
    const stale = screen.getByText("stale.northwind.test");
    expect(stale).toHaveAttribute("title", "unconfirmed");
    // The confirmed sibling carries no such marker.
    expect(screen.getByText("cdn.northwind.test")).not.toHaveAttribute("title");
  });

  it("renders each hostname as its own chip, not a comma list", async () => {
    await openIpsView();
    const row = (await screen.findAllByText("203.0.113.10"))[0].closest(".prow") as HTMLElement;
    // Each name is a standalone element whose text is exactly the name — a
    // comma-joined string would make the exact-text match fail.
    for (const name of ["api.northwind.test", "cdn.northwind.test", "stale.northwind.test"]) {
      expect(within(row).getByText(name).textContent).toBe(name);
    }
    expect(within(row).queryByText(/,/)).not.toBeInTheDocument();
  });

  /* "All" is the resting state of every filter group — a fresh view must show it
     selected, not an empty row of pills where nothing looks active. */
  it("starts every recon filter group on All", async () => {
    const activePill = (el: HTMLElement) => el.style.background === "var(--st-accent-2)";
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    // Hosts only have the Status group.
    const hostsAll = screen.getAllByText("All").filter((n) => n.classList.contains("clk"));
    expect(hostsAll).toHaveLength(1);
    expect(hostsAll.every(activePill)).toBe(true);

    const ipsItem = screen.getAllByText("IPs").find((n) => n.closest(".menu"));
    fireEvent.click(ipsItem as HTMLElement);
    // The IP view has only the Status group.
    const ipsAll = screen.getAllByText("All").filter((n) => n.classList.contains("clk"));
    expect(ipsAll).toHaveLength(1);
    expect(ipsAll.every(activePill)).toBe(true);

    const epItem = screen.getAllByText("Endpoints").find((n) => n.closest(".menu"));
    fireEvent.click(epItem as HTMLElement);
    const epAll = screen.getAllByText("All").filter((n) => n.classList.contains("clk"));
    expect(epAll).toHaveLength(1);
    expect(activePill(epAll[0])).toBe(true);
  });

  it("removes Cloudflare from the IPs table and its export filters", async () => {
    await openIpsView();
    await screen.findByText("104.16.132.229");
    expect(screen.queryByText("Cloudflare")).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Export" })[0]);
    expect(screen.queryByText("Cloudflare")).not.toBeInTheDocument();
  });

  it("removes Cloudflare from hosts and their export filters", async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    expect(screen.queryByText("Cloudflare")).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByText("Export").find((n) => n.closest("button")) as HTMLElement);
    const exportArea = await screen.findByRole("textbox", { name: "Will be exported" }) as HTMLTextAreaElement;
    await waitFor(() => expect(exportArea.value).toContain("api.northwind.test"));
    expect(screen.queryByText("Cloudflare")).not.toBeInTheDocument();
  });

  it("keeps IP-farm rows out of the hosts table", async () => {
    await openHostsSection();
    await screen.findByText("api.northwind.test", { selector: ".hostname" });
    // Hosts 14/15 have no hostname; they would render as "—" if they leaked through.
    expect(screen.queryByText("—", { selector: ".hostname" })).not.toBeInTheDocument();
    // …but their addresses are still listed in the IPs view.
    const ipsItem = screen.getAllByText("IPs").find((n) => n.closest(".menu"));
    fireEvent.click(ipsItem as HTMLElement);
    expect(await screen.findByText("104.16.132.229")).toBeInTheDocument();
  });

  it("imports a pasted IP list through its own page, not the host one", async () => {
    await openIpsView();
    fireEvent.click(screen.getByRole("button", { name: /Add IPs/i }));
    // Its own page — the header says IPs, and the host paste label is absent.
    expect(screen.getByText("Add IPs", { selector: "h2" })).toBeInTheDocument();
    expect(screen.queryByText("Paste hosts")).not.toBeInTheDocument();
    expect(screen.getByText("Paste IPs")).toBeInTheDocument();
    // Hostnames are filtered out of the preview: this farm only takes addresses.
    fireEvent.change(screen.getByPlaceholderText(/1\.2\.3\.4/), {
      target: { value: "1.2.3.4\nexample.com\n5.6.7.8:8443" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Probe & add/i }));
    expect(vi.mocked(api.startIpFarm)).toHaveBeenCalledWith(2, "1.2.3.4\n5.6.7.8:8443");
    expect(await screen.findByText(/Probing 2 IPs/)).toBeInTheDocument();
    await waitFor(() => expect(vi.mocked(api.getIpFarmJob)).toHaveBeenCalled(), { timeout: 3000 });
  });

  it("toggles the project sort order", () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    const sortBtn = screen.getAllByText("Last updated").find((el) => el.closest(".iconbtn"));
    fireEvent.click(sortBtn as HTMLElement);
    expect(screen.getByText("First updated")).toBeInTheDocument();
  });

  // The project detail is backend-backed, so editing it must PUT to the API
  // (the rename then comes back via a reload, not from local state).
  it("edits the project detail through the backend API", async () => {
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    const main = document.querySelector("main") as HTMLElement;
    fireEvent.click(within(main).getByRole("button", { name: /Edit/i }));
    const modal = screen.getByText("Edit project").closest(".modalcard") as HTMLElement;
    expect(within(modal).queryByText("Description")).not.toBeInTheDocument();
    const nameInput = within(modal).getByDisplayValue("Northwind API");
    fireEvent.change(nameInput, { target: { value: "Northwind API v2" } });
    fireEvent.change(within(modal).getByPlaceholderText("Paste a URL or start typing a ticket…"), { target: { value: "https://tracker.example/APPSEC-2" } });
    fireEvent.click(within(modal).getByRole("button", { name: "Save" }));
    expect(vi.mocked(api.updateProject)).toHaveBeenCalledWith(2, expect.objectContaining({ name: "Northwind API v2" }));
    expect(vi.mocked(api.updateProject).mock.calls[0][1]).not.toHaveProperty("description");
  });

  // Report generation is backed by the two Word templates the backend already has:
  // "szi" (certification) and "pp" (internal acceptance).
  it("generates a certification report through the backend API", async () => {
    const spy = vi.spyOn(api, "downloadProjectCertificationReport").mockResolvedValue(new Blob(["x"]));
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByRole("button", { name: /Generate report/i }));
    fireEvent.click(screen.getByText("Download .docx"));
    expect(spy).toHaveBeenCalledWith(2);
  });

  it("generates an internal-acceptance report when that type is picked", async () => {
    const spy = vi.spyOn(api, "downloadProjectAcceptanceReport").mockResolvedValue(new Blob(["x"]));
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Northwind API"));
    fireEvent.click(screen.getByRole("button", { name: /Generate report/i }));
    fireEvent.click(screen.getByText("Internal acceptance report"));
    fireEvent.click(screen.getByText("Download .docx"));
    expect(spy).toHaveBeenCalledWith(2);
  });

  /** One notification of each kind — the four reasons the backend ever sends one. */
  const mockNotifications = () => {
    const ctx = {
      vulnerability_id: null, vulnerability_title: null, note_id: null, note_title: null,
      project_id: 2, project_name: "Northwind API", host_id: null, commenter_username: "admin", status: null,
    };
    vi.mocked(api.listNotifications).mockResolvedValue({
      items: [
        {
          id: 1, type: "mention", comment_id: 5, note_comment_id: null, is_read: false,
          created_at: "2026-07-10T00:00:00Z",
          context: { ...ctx, vulnerability_id: 71, vulnerability_title: "IDOR on GET /orders/{id}", host_id: 11, commenter_username: "alice" },
        },
        { id: 2, type: "project_member_added", comment_id: null, note_comment_id: null, is_read: false, created_at: "2026-07-10T00:00:00Z", context: { ...ctx } },
        {
          id: 3, type: "vuln_status_changed", comment_id: null, note_comment_id: null, is_read: true,
          created_at: "2026-07-10T00:00:00Z",
          context: { ...ctx, vulnerability_id: 72, vulnerability_title: "JWT algorithm confusion (alg=none)", status: "cancelled" },
        },
        { id: 4, type: "project_status_changed", comment_id: null, note_comment_id: null, is_read: true, created_at: "2026-07-10T00:00:00Z", context: { ...ctx, status: "freeze" } },
      ],
      total: 4, page: 1, size: 20, pages: 1,
    });
  };

  it("shows deadline reminders and opens the related project", async () => {
    vi.mocked(api.listNotifications).mockResolvedValue({ items: [{
      id: 90, type: "project_deadline", comment_id: null, note_comment_id: null, is_read: false,
      created_at: "2026-11-14T00:00:00Z",
      context: { vulnerability_id: null, vulnerability_title: null, note_id: null, note_title: null,
        project_id: 2, project_name: "Northwind API", host_id: null, commenter_username: null, status: null, deadline_date: "2026-11-16" },
    }], total: 1, page: 1, size: 20, pages: 1 });
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Project deadline: 16.11.2026"));
    await waitFor(() => expect(api.markNotificationRead).toHaveBeenCalledWith(90));
    expect(await screen.findByText("Engagement timeline")).toBeInTheDocument();
  });

  it("opens the endpoint request from a mention notification", async () => {
    vi.mocked(api.listNotifications).mockResolvedValue({ items: [{
      id: 91, type: "mention", comment_id: null, note_comment_id: null, is_read: false,
      created_at: "2026-11-14T00:00:00Z",
      context: { vulnerability_id: null, vulnerability_title: null, note_id: null, note_title: null,
        project_id: 2, project_name: "Northwind API", host_id: 11, commenter_username: "alice", status: null,
        endpoint_id: 501, endpoint_path: "/v1/orders", endpoint_method: "GET", hostname: "api.northwind.test" },
    }], total: 1, page: 1, size: 20, pages: 1 });
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("GET /v1/orders"));
    const dialog = await screen.findByRole("dialog", { name: "Endpoint request" });
    expect((within(dialog).getByRole("textbox", { name: "HTTP request" }) as HTMLTextAreaElement).value).toContain("GET /v1/orders");
    await waitFor(() => expect(api.markNotificationRead).toHaveBeenCalledWith(91));
  });

  /* There are exactly four reasons to be notified, and each reads as its own
     sentence — not everything is "mentioned you in". */
  it("words each kind of notification for what it is", async () => {
    mockNotifications();
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    expect(await screen.findByText("mentioned you in")).toBeInTheDocument();
    expect(screen.getByText("added you to")).toBeInTheDocument();
    expect(screen.getByText("set your finding to Cancelled —")).toBeInTheDocument();
    expect(screen.getByText("changed the project status to Freeze —")).toBeInTheDocument();
    // Two of the four are unread.
    expect(screen.getByText("2 new")).toBeInTheDocument();
  });

  // Clicking a finding notification opens that finding, not just its project.
  it("opens the finding a notification points at", async () => {
    mockNotifications();
    render(<MemoryRouter><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("IDOR on GET /orders/{id}"));
    expect(await screen.findByDisplayValue("IDOR on GET /orders/{id}")).toBeInTheDocument();
    expect(vi.mocked(api.markNotificationRead)).toHaveBeenCalledWith(1);
  });

  it("renders the activity feed without ports, tags or IP labels", async () => {
    render(<MemoryRouter initialEntries={["/projects/2/activity"]}><StormApp /></MemoryRouter>);
    // Each entity type is its own action, counted inline after the verb.
    expect(await screen.findByText("reported", { exact: false })).toBeInTheDocument();
    // Ports are excluded outright.
    expect(screen.queryByText("443/tcp", { exact: false })).not.toBeInTheDocument();
    // No HOST/IP/ENDPOINT tags — the header already says what these are.
    expect(screen.queryByText("IP", { selector: "span.mono", exact: true })).not.toBeInTheDocument();
    // The IP shows bare, without its "(internal)" label.
    expect(screen.getByText("203.0.113.10")).toBeInTheDocument();
    expect(screen.queryByText("203.0.113.10 (internal)")).not.toBeInTheDocument();
    // An UPDATE row has no details: the host name comes from the loaded hosts.
    expect(screen.getByText("api.northwind.test")).toBeInTheDocument();
  });

  it("loads finding host links from the list without fetching a card per row", async () => {
    render(<MemoryRouter initialEntries={["/projects/2/vulns"]}><StormApp /></MemoryRouter>);
    await screen.findByText("IDOR on GET /orders/{id}");
    expect(vi.mocked(api.getVulnerabilities)).toHaveBeenCalledWith(2);
    expect(vi.mocked(api.getVulnerability)).not.toHaveBeenCalled();
    expect(screen.getAllByText("api.northwind.test").length).toBeGreaterThan(0);
  });

  it("hides details links for deleted findings and lists JS scan target hosts", async () => {
    vi.mocked(api.getProjectActivity).mockResolvedValue([
      { id: 1001, action: "DELETE", entity_type: "vulnerability", entity_id: 71, user_id: 1, username: "admin", title: null, severity: null, url: null, details: { title: "Removed finding", severity: "high" }, created_at: "2026-11-10T00:00:00Z" },
      { id: 1002, action: "START", entity_type: "js_farm", entity_id: 5, user_id: 1, username: "admin", title: null, severity: null, url: null, details: { targets: ["api.northwind.test", "test.com"] }, created_at: "2026-11-10T00:00:00Z" },
    ]);
    render(<MemoryRouter initialEntries={["/projects/2/activity"]}><StormApp /></MemoryRouter>);
    expect(await screen.findByText("Removed finding")).toBeInTheDocument();
    expect(screen.queryByText("Show details")).not.toBeInTheDocument();
    expect(screen.getByText("api.northwind.test, test.com")).toBeInTheDocument();
  });

  it("asks before revoking an invitation and removes the invitation hint", async () => {
    vi.mocked(api.getInvitations).mockResolvedValueOnce([{ id: 44, email: "pending@example.com", full_name: null, role: "pentester", project_role: "pentester", status: "pending", is_expired: false, expires_at: "2026-12-01T00:00:00Z", invited_by: 1, created_at: "2026-11-10T00:00:00Z" }]);
    vi.mocked(api.revokeInvitation).mockClear();
    render(<MemoryRouter initialEntries={["/members"]}><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByTitle("Revoke invitation"));
    expect(api.revokeInvitation).not.toHaveBeenCalled();
    let dialog = document.querySelector(".modalback.open") as HTMLElement;
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(api.revokeInvitation).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTitle("Revoke invitation"));
    dialog = document.querySelector(".modalback.open") as HTMLElement;
    fireEvent.click(within(dialog).getByRole("button", { name: "Revoke invitation" }));
    await waitFor(() => expect(api.revokeInvitation).toHaveBeenCalledWith(44));
    expect(screen.queryByText(/Invite people by email/)).not.toBeInTheDocument();
  });

  // Activity → "Show details" → back must land on the findings list, not hang.
  it("returns from a finding opened via the activity feed", async () => {
    render(<MemoryRouter initialEntries={["/projects/2/activity"]}><StormApp /></MemoryRouter>);
    fireEvent.click(await screen.findByText("Show details"));
    expect(await screen.findByDisplayValue("IDOR on GET /orders/{id}")).toBeInTheDocument();
    fireEvent.click(screen.getByText("All findings"));
    expect(screen.queryByDisplayValue("IDOR on GET /orders/{id}")).not.toBeInTheDocument();
  });

  /* Browser Back after opening a finding from the activity feed. This used to be
     broken: the URL changed, but the state → URL effect still held the previous
     screen and navigated forward again, so Back never landed. `navigate(-1)` is
     exactly what the browser's Back button does at the router level. */
  it("honours browser Back from a finding opened via the activity feed", async () => {
    const Back = () => {
      const navigate = useNavigate();
      const { pathname } = useLocation();
      return (
        <>
          <button onClick={() => navigate(-1)}>test-back</button>
          <span data-testid="path">{pathname}</span>
        </>
      );
    };
    render(
      <MemoryRouter initialEntries={["/projects/2/activity"]}>
        <StormApp />
        <Back />
      </MemoryRouter>
    );
    fireEvent.click(await screen.findByText("Show details"));
    await screen.findByDisplayValue("IDOR on GET /orders/{id}");
    expect(screen.getByTestId("path")).toHaveTextContent("/projects/2/vulns/71");

    fireEvent.click(screen.getByText("test-back"));

    expect(await screen.findByText("Show details")).toBeInTheDocument();
    expect(screen.getByTestId("path")).toHaveTextContent("/projects/2/activity");
    expect(screen.queryByDisplayValue("IDOR on GET /orders/{id}")).not.toBeInTheDocument();
  });

  // A project the backend refuses (403) must not render as an empty project.
  it("shows the no-access page when the backend refuses the project", async () => {
    vi.mocked(api.getProjectMembers).mockRejectedValueOnce(
      Object.assign(new Error("forbidden"), { isAxiosError: true, response: { status: 403 } })
    );
    render(<MemoryRouter initialEntries={["/projects/2"]}><StormApp /></MemoryRouter>);
    expect(await screen.findByText("No access")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back to projects/i })).toBeInTheDocument();
  });
});
