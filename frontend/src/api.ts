import { errorMessageForCode, UserInputError, safeErrorDetail } from "./errorMessages";
import axios from "axios";
import type {
  TaskTrackerTaskDetail,
  TaskTrackerTaskList,
  AuthLoginResponse,
  SsoConfig,
  TwoFASetupResponse,
  VulnerabilityDetails,
  VulnerabilityFile,
  Endpoint,
  EndpointComment,
  EndpointRequestHeader,
  Host,
  HostDetails,
  IpAddressChangeResult,
  HostFarmJob,
  IpFarmJob,
  JsFarmJob,
  JsFile,
  Invitation,
  InvitationInfo,
  InvitationSentResult,
  Notification,
  OsType,
  PaginatedResponse,
  PasswordResetInfo,
  ReactivationInfo,
  Project,
  ProjectActivityItem,
  ProjectMember,
  ProjectStats,
  User,
  ProjectNote,
  ProjectCredential,
  Vulnerability,
  VulnerabilityAsset,
  AgentApiToken,
  TaskTrackerIssueLink,
  WorksConfig,
  WorksRef,
  WorksIssueLink,
} from "./types";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

const isBlank = (value: string | null | undefined): boolean => !value || value.trim().length === 0;

const assertRequired = (value: string | null | undefined, label: string): void => {
  if (isBlank(value)) {
    throw new UserInputError(`Field "${label}" is required`);
  }
};

const normalizeDetailMessage = (detail: unknown, depth = 0): string | null => {
  if (depth > 8) return null;
  if (typeof detail === "string" && detail.trim()) {
    return detail.trim();
  }
  if (Array.isArray(detail)) {
    const messages = detail.slice(0, 50).map((item) => normalizeDetailMessage(item, depth + 1)).filter((item): item is string => Boolean(item));
    return messages.length ? messages.join("; ") : null;
  }
  if (detail && typeof detail === "object") {
    if (Object.hasOwn(detail, "detail")) {
      return normalizeDetailMessage((detail as { detail?: unknown }).detail, depth + 1);
    }
    if (Object.hasOwn(detail, "message")) {
      return normalizeDetailMessage((detail as { message?: unknown }).message, depth + 1);
    }
    if (Object.hasOwn(detail, "msg")) {
      const message = normalizeDetailMessage((detail as { msg?: unknown }).msg, depth + 1);
      return message?.startsWith("Input should") || message === "Field required" ? "Check the form fields." : message?.replace(/^Value error,\s*/, "") ?? null;
    }
  }
  return null;
};

/** HTTP-статус ошибки axios, если он есть (403 → показываем экран «нет доступа»). */
export const getApiErrorStatus = (error: unknown): number | null =>
  axios.isAxiosError(error) ? (error.response?.status ?? null) : null;

/** Сообщение для пользователя: известный код сервера или безопасная бизнес-ошибка.
 * Диагностика 5xx, HTML, SQL, нативные исключения и сообщения библиотек скрываются.
 * Локальный текст разрешён только для явно созданного UserInputError.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const detail = safeErrorDetail(normalizeDetailMessage(error.response?.data));
    const code = error.response?.data && typeof error.response.data === "object" ? error.response.data.code : null;
    const friendlyMessage = errorMessageForCode(code);
    if (friendlyMessage) return friendlyMessage;
    const status = error.response?.status;

    // Нет ответа вовсе — сеть/прокси/бэкенд недоступен. Самый частый случай при
    // локальном `npm run dev`, когда прокси указывает на несуществующий хост.
    if (!error.response) {
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        return "The server response timed out.";
      }
      return "The service is unavailable. Check your connection and try again.";
    }

    if (status === 401) return detail || "Invalid username or password.";
    if (status === 403) return detail || "You don't have permission for this action.";
    if (status === 404) return detail || "The requested resource was not found.";
    if (status === 409) return detail || "Conflict: the resource already exists or was changed.";
    if (status === 422) return detail || "Check the form fields.";
    if (status === 429) return detail || "Too many attempts. Try again later.";
    if (status && status >= 500) {
      return "Something went wrong. Try again later.";
    }

    return detail || fallback;
  }
  if (error instanceof UserInputError && error.message.trim()) {
    return safeErrorDetail(error.message) || fallback;
  }
  return fallback;
};

let isRefreshing = false;
let waitingQueue: Array<{ resolve: () => void; reject: (error: unknown) => void }> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = String(originalRequest?.url ?? "");
    // /auth/login и /auth/refresh — сами по себе попытки аутентификации;
    // 401 здесь = «неверные креды / refresh-токен», а не «сессия истекла»,
    // повторный refresh замаскирует настоящую ошибку.
    // /users/me на старте — проверка наличия сессии: 401 ожидаем, без авторефреша.
    const shouldSkipRefresh =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/2fa/verify") ||
      requestUrl.includes("/auth/refresh") ||
      // Публичные эндпоинты активации приглашения — вызываются без сессии,
      // 401 тут «токен активации недействителен», а не «сессия истекла».
      requestUrl.includes("/auth/invitations") ||
      requestUrl.includes("/auth/password-reset") ||
      requestUrl.includes("/auth/reactivate") ||
      requestUrl.includes("/users/me");
    if (error.response?.status === 401 && !originalRequest?._retry && !shouldSkipRefresh) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => waitingQueue.push({ resolve, reject })).then(() => api(originalRequest));
      }
      isRefreshing = true;
      try {
        await api.post("/auth/refresh");
        waitingQueue.forEach((entry) => entry.resolve());
        waitingQueue = [];
        return api(originalRequest);
      } catch (refreshError) {
        waitingQueue.forEach((entry) => entry.reject(refreshError));
        waitingQueue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string): Promise<AuthLoginResponse> {
  assertRequired(username, "Username");
  assertRequired(password, "Password");
  const { data } = await api.post<AuthLoginResponse>("/auth/login", { username, password });
  return data;
}

/** Публичная конфигурация SSO: показывать ли кнопку входа и её надпись. */
export async function getSsoConfig(): Promise<SsoConfig> {
  const { data } = await api.get<SsoConfig>("/auth/sso/config");
  return data;
}

export async function verifyTwoFactor(code: string): Promise<AuthLoginResponse> {
  assertRequired(code, "Verification code");
  const { data } = await api.post<AuthLoginResponse>("/auth/2fa/verify", { code: code.trim() });
  return data;
}

export async function setupTwoFactor(): Promise<TwoFASetupResponse> {
  const { data } = await api.post<TwoFASetupResponse>("/users/me/2fa/setup");
  return data;
}

export async function confirmTwoFactor(code: string): Promise<User> {
  assertRequired(code, "Verification code");
  const { data } = await api.post<User>("/users/me/2fa/confirm", { code: code.trim() });
  return data;
}

export async function disableTwoFactor(password: string): Promise<User> {
  assertRequired(password, "Password");
  const { data } = await api.post<User>("/users/me/2fa/disable", { password });
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

/* ── Восстановление пароля («забыли пароль») ─────────────────────────────
   Все три вызова публичные: выполняются без сессии. */

/** Запрашивает ссылку сброса. Отвечает 200 всегда — есть такой email или нет,
 *  бэкенд намеренно не сообщает, чтобы форму нельзя было использовать для
 *  перебора существующих адресов. */
export async function requestPasswordReset(email: string): Promise<{ ok: boolean; mail_preview_url: string | null }> {
  assertRequired(email, "Email");
  const { data } = await api.post<{ ok: boolean; mail_preview_url: string | null }>(
    "/auth/password-reset/request",
    { email }
  );
  return data;
}

export async function getPasswordResetInfo(token: string): Promise<PasswordResetInfo> {
  const { data } = await api.get<PasswordResetInfo>(`/auth/password-reset/${encodeURIComponent(token)}`);
  return data;
}

export async function confirmPasswordReset(token: string, password: string): Promise<void> {
  assertRequired(password, "Пароль");
  await api.post(`/auth/password-reset/${encodeURIComponent(token)}`, { password });
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function getUsers(page = 1, size = 200): Promise<PaginatedResponse<User>> {
  const { data } = await api.get<PaginatedResponse<User>>("/users", { params: { page, size } });
  return data;
}

/** Люди для тайпхеда исполнителя: поиск по username ИЛИ ФИО (full_name).
 *  Сервер ищет среди пользователей STORM; поиск по IAM пока не реализован. */
export interface UserSearchResult {
  username: string;
  full_name: string | null;
  is_sso: boolean;
}
export async function searchUsers(q: string, limit = 10): Promise<UserSearchResult[]> {
  const { data } = await api.get<UserSearchResult[]>("/users/search", { params: { q: q.trim(), limit } });
  return data;
}

/* ── Приглашения (invite-flow) ────────────────────────────────────────────
   Пользователей больше не создаём напрямую: админ шлёт приглашение по email,
   а username/пароль приглашённый задаёт сам на странице активации. */

export async function createInvitation(payload: {
  email: string;
  full_name?: string;
  role: User["role"];
  project_role?: User["project_role"];
}): Promise<InvitationSentResult> {
  assertRequired(payload.email, "Email");
  const { data } = await api.post<InvitationSentResult>("/users/invitations", payload);
  return data;
}

export async function getInvitations(): Promise<Invitation[]> {
  const { data } = await api.get<Invitation[]>("/users/invitations");
  return data;
}

export async function resendInvitation(invitationId: number): Promise<InvitationSentResult> {
  const { data } = await api.post<InvitationSentResult>(`/users/invitations/${invitationId}/resend`);
  return data;
}

export async function revokeInvitation(invitationId: number): Promise<void> {
  await api.delete(`/users/invitations/${invitationId}`);
}

/* Публичные вызовы страницы активации (без сессии). */

export async function getInvitationInfo(token: string): Promise<InvitationInfo> {
  const { data } = await api.get<InvitationInfo>(`/auth/invitations/${encodeURIComponent(token)}`);
  return data;
}

export async function checkInvitationUsername(token: string, username: string): Promise<boolean> {
  const { data } = await api.get<{ available: boolean }>(
    `/auth/invitations/${encodeURIComponent(token)}/username-available`,
    { params: { username } }
  );
  return data.available;
}

export async function acceptInvitation(
  token: string,
  payload: { username: string; password: string }
): Promise<AuthLoginResponse> {
  assertRequired(payload.username, "Username");
  assertRequired(payload.password, "Password");
  const { data } = await api.post<AuthLoginResponse>(
    `/auth/invitations/${encodeURIComponent(token)}/accept`,
    payload
  );
  return data;
}

export async function updateUser(
  userId: number,
  payload: {
    username?: string;
    full_name?: string;
    role?: User["role"];
    project_role?: User["project_role"];
    is_active?: boolean;
  }
): Promise<User> {
  const { data } = await api.put<User>(`/users/${userId}`, payload);
  return data;
}

/** Сразу разблокирует пользователя без отправки письма (только администратор). */
export async function reactivateUser(userId: number): Promise<User> {
  const { data } = await api.post<User>(`/users/${userId}/reactivate`);
  return data;
}

/* ── Возврат по ссылке из письма (страница /reactivate, без сессии) ──────── */

export async function getReactivationInfo(token: string): Promise<ReactivationInfo> {
  const { data } = await api.get<ReactivationInfo>(`/auth/reactivate/${encodeURIComponent(token)}`);
  return data;
}

/** Разблокирует аккаунт по ссылке и сразу выдаёт сессию (cookie ставит бэкенд). */
export async function completeReactivation(token: string): Promise<AuthLoginResponse> {
  const { data } = await api.post<AuthLoginResponse>(`/auth/reactivate/${encodeURIComponent(token)}`);
  return data;
}

export async function deleteUser(userId: number): Promise<void> {
  await api.delete(`/users/${userId}`);
}

export async function changeMyPassword(payload: { current_password: string; new_password: string }): Promise<User> {
  assertRequired(payload.current_password, "Current password");
  assertRequired(payload.new_password, "New password");
  const { data } = await api.patch<User>("/users/me/password", payload);
  return data;
}

export async function uploadMyAvatar(file: File): Promise<User> {
  if (!file) {
    throw new UserInputError("An avatar file is required");
  }
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post<User>("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** Удаляет сохранённый аватар владельца сессии и возвращает обновлённый профиль. */
export async function deleteMyAvatar(): Promise<User> {
  const { data } = await api.delete<User>("/users/me/avatar");
  return data;
}

export async function getProjects(page = 1, size = 20, status?: Project["status"]): Promise<PaginatedResponse<Project>> {
  const { data } = await api.get<PaginatedResponse<Project>>("/projects", { params: { page, size, status } });
  return data;
}

export async function getProjectStats(): Promise<ProjectStats[]> {
  const { data } = await api.get<ProjectStats[]>("/projects/stats");
  return data;
}

export interface DeleteProjectFolderResult {
  path: string;
  deleted_folders: number;
  deleted_projects: number;
}

export async function createProject(payload: {
  name: string;
  folder?: string;
  start_date?: string;
  end_date?: string;
  appsec_component_code?: string | null;
  appsec_component_name?: string | null;
  appsec_version_code?: string | null;
  appsec_version_name?: string | null;
  appsec_versions?: WorksRef[];
  appsec_assignee?: string | null;
  appsec_assignee_name?: string | null;
  appsec_ticket_url?: string | null;
  appsec_ticket_key?: string | null;
}): Promise<Project> {
  assertRequired(payload.name, "Project name");
  const { data } = await api.post<Project>("/projects", payload);
  return data;
}

export async function getProject(projectId: number): Promise<Project> {
  const { data } = await api.get<Project>(`/projects/${projectId}`);
  return data;
}

export async function updateProject(
  projectId: number,
  payload: {
    name?: string;
    folder?: string;
    start_date?: string;
    end_date?: string;
    status?: Project["status"];
    appsec_component_code?: string | null;
    appsec_component_name?: string | null;
    appsec_version_code?: string | null;
    appsec_version_name?: string | null;
    appsec_versions?: WorksRef[];
    appsec_assignee?: string | null;
    appsec_assignee_name?: string | null;
    appsec_ticket_url?: string | null;
    appsec_ticket_key?: string | null;
  }
): Promise<Project> {
  const { data } = await api.put<Project>(`/projects/${projectId}`, payload);
  return data;
}

export async function getProjectMembers(projectId: number): Promise<ProjectMember[]> {
  const { data } = await api.get<ProjectMember[]>(`/projects/${projectId}/members`);
  return data;
}

export async function addProjectMember(projectId: number, userId: number): Promise<void> {
  if (!userId) {
    throw new UserInputError("Select a user");
  }
  await api.post(`/projects/${projectId}/members`, { user_id: userId });
}

export async function removeProjectMember(projectId: number, userId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/members/${userId}`);
}

/** Лента активности проекта — доступна любому участнику (в отличие от админского /audit-logs). */
export async function getProjectActivity(projectId: number, limit = 50): Promise<ProjectActivityItem[]> {
  const { data } = await api.get<ProjectActivityItem[]>(`/projects/${projectId}/activity`, { params: { limit } });
  return data;
}

export async function listProjectNotes(projectId: number): Promise<ProjectNote[]> {
  const { data } = await api.get<ProjectNote[]>(`/projects/${projectId}/notes`);
  return data;
}

export type ProjectNoteActivity = {
  id: number;
  action: "CREATE" | "UPDATE" | "DELETE";
  note_id: number | null;
  note_title: string | null;
  user_id: number | null;
  username: string | null;
  created_at: string;
};

export async function createProjectNote(
  projectId: number,
  payload: { title: string; parent_id?: number | null; content?: string | null }
): Promise<ProjectNote> {
  assertRequired(payload.title, "Page title");
  const { data } = await api.post<ProjectNote>(`/projects/${projectId}/notes`, payload);
  return data;
}

export async function updateProjectNote(
  projectId: number,
  noteId: number,
  payload: { title?: string; content?: string | null }
): Promise<ProjectNote> {
  if (payload.title !== undefined) {
    assertRequired(payload.title, "Page title");
  }
  const { data } = await api.put<ProjectNote>(`/projects/${projectId}/notes/${noteId}`, payload);
  return data;
}

export async function deleteProjectNote(projectId: number, noteId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/notes/${noteId}`);
}

// ---- project credentials (accounts & access tokens) ----

export async function listProjectCredentials(projectId: number): Promise<ProjectCredential[]> {
  const { data } = await api.get<ProjectCredential[]>(`/projects/${projectId}/credentials`);
  return data;
}

export async function createProjectCredential(
  projectId: number,
  payload: { username?: string | null; password: string; host?: string | null }
): Promise<ProjectCredential> {
  assertRequired(payload.password, "Password");
  const { data } = await api.post<ProjectCredential>(`/projects/${projectId}/credentials`, payload);
  return data;
}

export async function updateProjectCredential(
  projectId: number,
  credentialId: number,
  // Пустой/опущенный password означает «оставить прежний» — форма правки не
  // присылает существующий пароль обратно.
  payload: { username?: string | null; password?: string; host?: string | null }
): Promise<ProjectCredential> {
  const { data } = await api.put<ProjectCredential>(`/projects/${projectId}/credentials/${credentialId}`, payload);
  return data;
}

export async function deleteProjectCredential(projectId: number, credentialId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/credentials/${credentialId}`);
}

export async function deleteProject(projectId: number): Promise<void> {
  await api.delete(`/projects/${projectId}`);
}

/** Даты всех хостов (включая origin=ip) для графиков, без полных деревьев. */
export async function getHostCreationTimes(projectId: number): Promise<string[]> {
  const { data } = await api.get<string[]>(`/projects/${projectId}/host-creation-times`);
  return data;
}

export async function getHosts(projectId: number): Promise<PaginatedResponse<Host>> {
  // origin=all — один запрос кормит и таблицу хостов, и таблицу IP: строки
  // origin='ip' отфильтровываются на клиенте (см. hostsList в StormApp).
  // Тянем ВСЕ хосты постранично (бэкенд ограничивает size<=200), чтобы большие
  // проекты не обрезались; на обычных проектах это ровно один запрос.
  const size = 200;
  const first = await api.get<PaginatedResponse<Host>>(`/projects/${projectId}/hosts`, {
    params: { page: 1, size, origin: "all" },
  });
  const items = [...first.data.items];
  const total = first.data.total ?? items.length;
  for (let page = 2; items.length < total; page += 1) {
    const { data } = await api.get<PaginatedResponse<Host>>(`/projects/${projectId}/hosts`, {
      params: { page, size, origin: "all" },
    });
    if (!data.items.length) break;
    items.push(...data.items);
  }
  return { ...first.data, items, size: items.length };
}

export async function createHost(
  projectId: number,
  payload: {
    probe?: boolean;
    ip_address?: string;
    ip_addresses?: string[];
    hostname?: string;
    notes?: string;
    status?: "up" | "down" | "unknown";
    os_type?: OsType;
  }
): Promise<Host> {
  if (isBlank(payload.ip_address) && isBlank(payload.hostname)) {
    throw new UserInputError('Provide at least "IP address" or "Hostname"');
  }
  const { data } = await api.post<Host>(`/projects/${projectId}/hosts`, payload);
  return data;
}

export async function getHost(projectId: number, hostId: number): Promise<HostDetails> {
  const { data } = await api.get<HostDetails>(`/projects/${projectId}/hosts/${hostId}`);
  return data;
}

export async function updateHost(
  projectId: number,
  hostId: number,
  payload: {
    ip_address?: string;
    ip_addresses?: Array<{ ip_address: string; label?: string | null; is_primary?: boolean }>;
    hostname?: string;
    notes?: string | null;
    status?: "up" | "down" | "unknown";
    os_type?: OsType;
  }
): Promise<Host> {
  const { data } = await api.put<Host>(`/projects/${projectId}/hosts/${hostId}`, payload);
  return data;
}

export async function deleteHost(projectId: number, hostId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/hosts/${hostId}`);
}

export async function changeIpAddress(projectId: number, previous: string, address: string): Promise<IpAddressChangeResult> {
  assertRequired(previous, "IP address");
  assertRequired(address, "IP address");
  const { data } = await api.put<IpAddressChangeResult>(`/projects/${projectId}/ip-addresses/${encodeURIComponent(previous)}`, { ip_address: address });
  return data;
}

/* ── Скрытые IP: «удаление» адреса из вкладки IP без разрыва привязки к хостам ──
   Список адресов, скрытых из вкладки IP. Фронт фильтрует по нему ipsRows. */
export async function getHiddenIps(projectId: number): Promise<string[]> {
  const { data } = await api.get<string[]>(`/projects/${projectId}/hidden-ips`);
  return data;
}

/** Скрывает адрес из списка IP (сносит отдельную IP-запись, привязку к хостам хранит). */
export async function hideIp(projectId: number, ip: string): Promise<void> {
  await api.post(`/projects/${projectId}/hidden-ips`, { ip_address: ip });
}

// ---- recon farm: серверный пробив вставленных списков хостов и IP ----

/** Запускает фоновый пробив вставленного списка; возвращает созданную задачу. */
export async function startHostFarm(projectId: number, raw: string): Promise<HostFarmJob> {
  assertRequired(raw, "Hosts");
  const { data } = await api.post<HostFarmJob>(`/projects/${projectId}/host-farm`, { raw });
  return data;
}

/** Статус задачи фермы — фронт опрашивает до status === "done" | "failed". */
export async function getHostFarmJob(projectId: number, jobId: number): Promise<HostFarmJob> {
  const { data } = await api.get<HostFarmJob>(`/projects/${projectId}/host-farm/jobs/${jobId}`);
  return data;
}

/** Запускает обратный резолв + пробив вставленного списка IP-адресов. */
export async function startIpFarm(projectId: number, raw: string): Promise<IpFarmJob> {
  assertRequired(raw, "IPs");
  const { data } = await api.post<IpFarmJob>(`/projects/${projectId}/ip-farm`, { raw });
  return data;
}

/** Статус задачи фермы IP — фронт опрашивает до status === "done" | "failed". */
export async function getIpFarmJob(projectId: number, jobId: number): Promise<IpFarmJob> {
  const { data } = await api.get<IpFarmJob>(`/projects/${projectId}/ip-farm/jobs/${jobId}`);
  return data;
}

/** Запускает скан JS всех доменов проекта (raw пусто) или переданного списка. */
export async function startJsScan(projectId: number, raw = ""): Promise<JsFarmJob> {
  const { data } = await api.post<JsFarmJob>(`/projects/${projectId}/js-farm`, { raw });
  return data;
}

/** Статус задачи фермы JS — фронт опрашивает до status === "done" | "failed". */
export async function getJsScanJob(projectId: number, jobId: number): Promise<JsFarmJob> {
  const { data } = await api.get<JsFarmJob>(`/projects/${projectId}/js-farm/jobs/${jobId}`);
  return data;
}

/** JS-файлы проекта с находками — раздел JS группирует их по хосту.
 *  Постранично: раздел стримит страницы и склеивает их на клиенте, чтобы
 *  проекты с тысячами файлов не упирались в один огромный ответ. */
export async function getJsFilesPage(
  projectId: number,
  page: number,
  size: number,
): Promise<PaginatedResponse<JsFile>> {
  const { data } = await api.get<PaginatedResponse<JsFile>>(`/projects/${projectId}/js-files`, {
    params: { page, size },
  });
  return data;
}

/** Удалить все JS-находки указанного хоста в проекте. */
export async function deleteJsFilesForHost(projectId: number, hostId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/js-files/hosts/${hostId}`);
}

/** Zip найденных .js. `hostId` сужает архив до одного хоста; без него — весь проект.
 *  Файлы не хранятся, поэтому бэкенд докачивает их по URL по требованию. */
export async function downloadJsArchive(projectId: number, hostId?: number): Promise<Blob> {
  const { data } = await api.get(`/projects/${projectId}/js-files/archive`, {
    params: hostId != null ? { host_id: hostId } : {},
    responseType: "blob",
  });
  return data as Blob;
}

/** Сохранённое обсуждение эндпоинта, новые комментарии первыми. */
export async function listEndpointComments(projectId: number, hostId: number, endpointId: number, page = 1): Promise<PaginatedResponse<EndpointComment>> {
  const { data } = await api.get<PaginatedResponse<EndpointComment>>(`/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}/comments`, { params: { page, size: 50 } });
  return data;
}

export async function createEndpointComment(projectId: number, hostId: number, endpointId: number, content: string): Promise<EndpointComment> {
  assertRequired(content, "Comment");
  const { data } = await api.post<EndpointComment>(`/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}/comments`, { content });
  return data;
}

export async function getEndpoints(projectId: number, hostId: number): Promise<Endpoint[]> {
  const { data } = await api.get<Endpoint[]>(`/projects/${projectId}/hosts/${hostId}/endpoints`);
  return data;
}

export async function createEndpoint(
  projectId: number,
  hostId: number,
  payload: {
    path?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE" | "QUERY";
    description?: string | null;
    request_raw?: string;
    query_params?: { name: string; value?: string | null; required?: boolean; description?: string | null }[];
    request_body?: string | null;
    request_content_type?: string | null;
    request_headers?: EndpointRequestHeader[];
  }
): Promise<Endpoint> {
  if (isBlank(payload.path) && isBlank(payload.request_raw)) {
    throw new UserInputError('Provide at least "Path" or "Raw request"');
  }
  const { data } = await api.post<Endpoint>(`/projects/${projectId}/hosts/${hostId}/endpoints`, payload);
  return data;
}

export async function updateEndpoint(
  projectId: number,
  hostId: number,
  endpointId: number,
  payload: {
    path?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE" | "QUERY";
    description?: string | null;
    request_raw?: string;
    query_params?: { name: string; value?: string | null; required?: boolean; description?: string | null }[];
    request_body?: string | null;
    request_content_type?: string | null;
    request_headers?: EndpointRequestHeader[];
  }
): Promise<Endpoint> {
  if (payload.path !== undefined && isBlank(payload.path) && isBlank(payload.request_raw)) {
    throw new UserInputError('Provide at least "Path" or "Raw request"');
  }
  const { data } = await api.put<Endpoint>(`/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}`, payload);
  return data;
}

export async function deleteEndpoint(projectId: number, hostId: number, endpointId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/hosts/${hostId}/endpoints/${endpointId}`);
}

export async function getVulnerabilities(projectId: number): Promise<PaginatedResponse<Vulnerability>> {
  const { data: first } = await api.get<PaginatedResponse<Vulnerability>>(`/projects/${projectId}/vulnerabilities`, {
    params: { page: 1, size: 100 },
  });
  const items = new Map(first.items.map((item) => [item.id, item]));
  // The UI applies filters and computes summaries locally, so it needs the
  // complete list. Bound requests by the first response to avoid looping if
  // concurrent inserts keep increasing the server's total.
  const pages = first.pages || Math.ceil(first.total / 100);
  for (let page = 2; page <= pages; page += 1) {
    const { data } = await api.get<PaginatedResponse<Vulnerability>>(`/projects/${projectId}/vulnerabilities`, {
      params: { page, size: 100 },
    });
    if (!data.items.length) break;
    for (const item of data.items) items.set(item.id, item);
  }
  return { ...first, items: [...items.values()], size: items.size };
}

export async function createVulnerability(
  projectId: number,
  payload: {
    host_id: number;
    title: string;
    description?: string | null;
    // Необязательно: бэкенд по умолчанию ставит "unknown" (критичность не определена).
    severity?: "critical" | "high" | "medium" | "low" | "info" | "unrealized";
    cvss_version?: "4.0" | null;
    cvss_score?: number | null;
    cvss_vector?: string | null;
    cwe_id?: string | null;
    status?: "open" | "in_progress" | "problem_analysis" | "need_info" | "paused" | "resolved" | "closed" | "cancelled" | "sent_by_mistake";
    workflow_steps?: Array<{
      id: string;
      description?: string | null;
      image_file_ids?: number[];
      endpoint_id?: number | null;
      endpoint_request_raw?: string | null;
    }>;
    steps_to_reproduce?: string | null;
    impact?: string | null;
    recommendations?: string | null;
  }
): Promise<Vulnerability> {
  if (!payload.host_id) {
    throw new UserInputError("Select a host");
  }
  assertRequired(payload.title, "Vulnerability title");
  const { data } = await api.post<Vulnerability>(`/projects/${projectId}/vulnerabilities`, payload);
  return data;
}

export async function updateVulnerability(
  projectId: number,
  vulnerabilityId: number,
  payload: {
    title?: string;
    description?: string | null;
    severity?: "critical" | "high" | "medium" | "low" | "info" | "unrealized";
    cvss_version?: "4.0" | null;
    cvss_score?: number | null;
    cvss_vector?: string | null;
    cwe_id?: string | null;
    status?: "open" | "in_progress" | "problem_analysis" | "need_info" | "paused" | "resolved" | "closed" | "cancelled" | "sent_by_mistake";
    workflow_steps?: Array<{
      id: string;
      description?: string | null;
      image_file_ids?: number[];
      endpoint_id?: number | null;
      endpoint_request_raw?: string | null;
    }>;
    steps_to_reproduce?: string | null;
    impact?: string | null;
    recommendations?: string | null;
  }
): Promise<Vulnerability> {
  if (payload.title !== undefined) {
    assertRequired(payload.title, "Vulnerability title");
  }
  const { data } = await api.put<Vulnerability>(`/projects/${projectId}/vulnerabilities/${vulnerabilityId}`, payload);
  return data;
}

export async function deleteVulnerability(projectId: number, vulnerabilityId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/vulnerabilities/${vulnerabilityId}`);
}

export async function getVulnerabilityTaskTrackerLink(projectId: number, vulnerabilityId: number): Promise<TaskTrackerIssueLink | null> {
  const link = await getVulnerabilityWorksLink(projectId, vulnerabilityId);
  return link ? { id: vulnerabilityId, vulnerability_id: vulnerabilityId, task_tracker_issue_key: link.works_key, task_tracker_issue_url: link.works_url, status: "linked", last_error: null, created_at: "", updated_at: "" } : null;
}

export async function exportVulnerabilityToTaskTracker(projectId: number, vulnerabilityId: number): Promise<TaskTrackerIssueLink> {
  const existing = await getVulnerabilityTaskTrackerLink(projectId, vulnerabilityId);
  if (existing?.task_tracker_issue_key) return existing;
  const link = await exportVulnerabilityToWorks(projectId, vulnerabilityId);
  return { id: vulnerabilityId, vulnerability_id: vulnerabilityId, task_tracker_issue_key: link.works_key, task_tracker_issue_url: link.works_url, status: "linked", last_error: null, created_at: "", updated_at: "" };
}

export async function getWorksConfig(): Promise<WorksConfig> {
  const { data } = await api.get<WorksConfig>("/works/config");
  return data;
}

/** Typeahead по компонентам Works (имя→UUID). */
export async function findWorksComponents(q: string): Promise<WorksRef[]> {
  const { data } = await api.get<WorksRef[]>("/works/components", { params: { q } });
  return data;
}

/** Typeahead по версиям Works (имя→UUID). */
export async function findWorksVersions(q: string): Promise<WorksRef[]> {
  const { data } = await api.get<WorksRef[]>("/works/versions", { params: { q } });
  return data;
}

/** Подсказки продуктов STS; code сохраняется без преобразования регистра. */
export async function findWorksProductCodes(q: string): Promise<WorksRef[]> {
  const { data } = await api.get<WorksRef[]>("/works/product-codes", { params: { q } });
  return data;
}

/** Текущая связь уязвимости с тикетом Works (или null). */
export async function getVulnerabilityWorksLink(projectId: number, vulnerabilityId: number): Promise<WorksIssueLink | null> {
  const { data } = await api.get<WorksIssueLink | null>(`/projects/${projectId}/vulnerabilities/${vulnerabilityId}/works`);
  return data;
}

/** Экспорт уязвимости в AppSec (создание тикета bug_appsec в STS). */
export async function exportVulnerabilityToWorks(
  projectId: number,
  vulnerabilityId: number,
  assignee?: string | null
): Promise<WorksIssueLink> {
  const { data } = await api.post<WorksIssueLink>(
    `/projects/${projectId}/vulnerabilities/${vulnerabilityId}/works/export`,
    { assignee: assignee ?? null }
  );
  return data;
}

export async function getVulnerability(projectId: number, vulnerabilityId: number): Promise<VulnerabilityDetails> {
  const { data } = await api.get<VulnerabilityDetails>(`/projects/${projectId}/vulnerabilities/${vulnerabilityId}`);
  return data;
}

export async function addVulnerabilityAsset(
  projectId: number,
  vulnerabilityId: number,
  payload: {
    asset_type: "host" | "port" | "service" | "endpoint";
    asset_id: number;
  }
): Promise<VulnerabilityAsset> {
  const { data } = await api.post<VulnerabilityAsset>(`/projects/${projectId}/vulnerabilities/${vulnerabilityId}/assets`, payload);
  return data;
}

export async function deleteVulnerabilityAsset(projectId: number, vulnerabilityId: number, assetLinkId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/vulnerabilities/${vulnerabilityId}/assets/${assetLinkId}`);
}

export async function listVulnerabilityFiles(projectId: number, vulnerabilityId: number): Promise<VulnerabilityFile[]> {
  const { data } = await api.get<VulnerabilityFile[]>(`/projects/${projectId}/vulnerabilities/${vulnerabilityId}/files`);
  return data;
}

export async function uploadVulnerabilityFile(projectId: number, vulnerabilityId: number, file: File): Promise<VulnerabilityFile> {
  if (!file) {
    throw new UserInputError("Select a file");
  }
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<VulnerabilityFile>(`/projects/${projectId}/vulnerabilities/${vulnerabilityId}/files`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteVulnerabilityFile(projectId: number, vulnerabilityId: number, fileId: number): Promise<void> {
  await api.delete(`/projects/${projectId}/vulnerabilities/${vulnerabilityId}/files/${fileId}`);
}

/** Uploads an inline image (pasted into a note / markdown field) and returns the
 *  served URL to embed as `![alt](url)`. Backed by POST /projects/{id}/images. */
export async function uploadProjectImage(projectId: number, file: File): Promise<{ url: string }> {
  if (!file) {
    throw new UserInputError("Select an image");
  }
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<{ url: string }>(`/projects/${projectId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** Сохраняет имя продукта из Content-Disposition при скачивании через Blob URL. */
function namedReportBlob(data: Blob, disposition: unknown): Blob {
  if (typeof disposition !== 'string') return data;
  let name = '';
  const encoded = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)?.[1];
  try { if (encoded) name = decodeURIComponent(encoded.trim()); } catch { /* Берём ASCII fallback. */ }
  name ||= disposition.match(/filename\s*=\s*"([^"]+)"/i)?.[1] || '';
  return name ? new File([data], name.replace(/[\\/\u0000-\u001f\u007f]/g, '_'), { type: data.type }) : data;
}

export async function downloadProjectCertificationReport(projectId: number): Promise<Blob> {
  const { data, headers } = await api.post(`/projects/${projectId}/reports/szi`, null, {
    responseType: "blob",
  });
  return namedReportBlob(data as Blob, headers['content-disposition']);
}

export async function downloadProjectAcceptanceReport(projectId: number): Promise<Blob> {
  const { data, headers } = await api.post(`/projects/${projectId}/reports/pp`, null, {
    responseType: "blob",
  });
  return namedReportBlob(data as Blob, headers['content-disposition']);
}

export async function listAgentTokens(): Promise<AgentApiToken[]> {
  const { data } = await api.get<AgentApiToken[]>("/agent-tokens");
  return data;
}

export async function createAgentToken(payload: {
  name: string;
  scopes: string[];
  project_ids: number[];
  all_projects: boolean;
  expires_at?: string | null;
}): Promise<AgentApiToken & { token: string }> {
  const { data } = await api.post<AgentApiToken & { token: string }>("/agent-tokens", payload);
  return data;
}

export async function revokeAgentToken(tokenId: number): Promise<void> {
  await api.delete(`/agent-tokens/${tokenId}`);
}

export async function listNotifications(options?: { is_read?: boolean }): Promise<PaginatedResponse<Notification>> {
  const params: Record<string, number | boolean> = { page: 1, size: 20 };
  if (options?.is_read !== undefined) {
    params.is_read = options.is_read;
  }
  const { data } = await api.get<PaginatedResponse<Notification>>("/notifications", { params });
  return data;
}

export async function markNotificationRead(notificationId: number): Promise<void> {
  await api.patch(`/notifications/${notificationId}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch("/notifications/read-all");
}

// ── TaskTracker «Tasks» (раздел Tasks) ──────────────────────────────────────────────
// Бэкенд проксирует задачи Task Tracker пространства APPSEC (read-only). Поиск по имени и фильтр
// по категории статуса выполняются на бэкенде Task Tracker, но фронт также фильтрует
// загруженные страницы на клиенте — как список уязвимостей. Нативный AS21
// использует страницы с нуля; backend отдаёт порции по 20 и next_page_token.

/** Список задач Task Tracker (пространство APPSEC). category: "todo"|"inprogress"|"done"|"". */
export async function getTasks(params: {
  query?: string;
  category?: string;
  page_number?: number;
  sort?: 'first' | 'last';
  refresh?: boolean;
} = {}): Promise<TaskTrackerTaskList> {
  const { data } = await api.get<TaskTrackerTaskList>("/tasks", { params });
  return data;
}

/** Полная карточка одной задачи TaskTracker по ключу (напр. "APPSEC-123"). */
export async function getTask(key: string): Promise<TaskTrackerTaskDetail> {
  const { data } = await api.get<TaskTrackerTaskDetail>(`/tasks/${encodeURIComponent(key)}`);
  return data;
}
