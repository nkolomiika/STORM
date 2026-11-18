import { ERROR_MESSAGES, errorMessageForCode } from "../errorMessages";
import { useReconJobPolling } from "./useReconJobPolling";
import { subscribeNotificationUpdates } from "./notificationUpdates";
/* STORM — Offensive Security Research & Management Console.
   React port of the design prototype (STORM.dc.html). Every collection it renders
   is loaded from the backend; data.ts carries the view shapes only. */

import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import "./storm.css";
import { Icon, SberMark } from "./icons";
import { EndpointDiscussion } from "./EndpointDiscussion";
import { buildHostIndex } from "./hostIndex";
import { SwaggerEndpointImport } from "./SwaggerEndpointImport";
import StormMarkdown from "./StormMarkdown";
import { UserAvatar } from "./UserAvatar";
import { Tip } from "./Tip";
import { ENDPOINT_METHODS } from "./swaggerEndpoints";

/* TipTap/ProseMirror is ~460 kB — more than the rest of the app put together, and
   only the note editor needs it. Loading it on demand keeps that weight off every
   other screen. */
const StormMarkdownEditor = lazy(() => import("./StormMarkdownEditor"));
const StormDocs = lazy(() => import("./StormDocs"));
import { StormDatePicker } from "./StormDatePicker";
import { useAuthStore, useToastStore } from "../store";
import { useThemeStore } from "./theme";
import { StormSelect } from "./StormSelect";
import { PasswordInput } from "./PasswordInput";
import { StormAppSecFields, emptyAppsecFields, appsecMetadataFromTask, type AppSecFieldsValue } from "./StormAppSecFields";
import { missingStsProjectFields } from "./projectExport";
import { t, useLangStore, formatRelativeTime as relTime, activityNoun, activityVerb } from "./i18n";
import {
  getApiErrorMessage as rawGetApiErrorMessage,
  getApiErrorStatus,
  getProjects,
  getProjectStats,
  getUsers,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  getProject as apiGetProject,
  getWorksConfig as apiGetWorksConfig,
  deleteProject as apiDeleteProject,
  createInvitation as apiCreateInvitation,
  getInvitations as apiGetInvitations,
  resendInvitation as apiResendInvitation,
  revokeInvitation as apiRevokeInvitation,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  reactivateUser as apiReactivateUser,
  getHosts as apiGetHosts,
  getHostCreationTimes as apiGetHostCreationTimes,
  getHiddenIps as apiGetHiddenIps,
  hideIp as apiHideIp,
  getHost as apiGetHost,
  createHost as apiCreateHost,
  updateHost as apiUpdateHost,
  changeIpAddress as apiChangeIpAddress,
  deleteHost as apiDeleteHost,
  startHostFarm as apiStartHostFarm,
  getHostFarmJob as apiGetHostFarmJob,
  startIpFarm as apiStartIpFarm,
  getIpFarmJob as apiGetIpFarmJob,
  startJsScan as apiStartJsScan,
  getJsScanJob as apiGetJsScanJob,
  getJsFilesPage as apiGetJsFilesPage,
  deleteJsFilesForHost as apiDeleteJsFilesForHost,
  downloadJsArchive as apiDownloadJsArchive,
  createEndpoint as apiCreateEndpoint,
  getEndpoints as apiGetEndpoints,
  deleteEndpoint as apiDeleteEndpoint,
  updateEndpoint as apiUpdateEndpoint,
  getProjectMembers as apiGetProjectMembers,
  addProjectMember as apiAddProjectMember,
  removeProjectMember as apiRemoveProjectMember,
  getVulnerabilities as apiGetVulnerabilities,
  getVulnerability as apiGetVulnerability,
  createVulnerability as apiCreateVulnerability,
  updateVulnerability as apiUpdateVulnerability,
  deleteVulnerability as apiDeleteVulnerability,
  addVulnerabilityAsset as apiAddVulnerabilityAsset,
  deleteVulnerabilityAsset as apiDeleteVulnerabilityAsset,
  listProjectNotes as apiListProjectNotes,
  createProjectNote as apiCreateProjectNote,
  updateProjectNote as apiUpdateProjectNote,
  deleteProjectNote as apiDeleteProjectNote,
  listProjectCredentials as apiListProjectCredentials,
  createProjectCredential as apiCreateProjectCredential,
  updateProjectCredential as apiUpdateProjectCredential,
  deleteProjectCredential as apiDeleteProjectCredential,
  getProjectActivity as apiGetProjectActivity,
  listNotifications as apiListNotifications,
  uploadMyAvatar as apiUploadMyAvatar,
  listVulnerabilityFiles as apiListVulnFiles,
  uploadVulnerabilityFile as apiUploadVulnFile,
  uploadProjectImage as apiUploadProjectImage,
  deleteVulnerabilityFile as apiDeleteVulnFile,
  markNotificationRead as apiMarkNotificationRead,
  markAllNotificationsRead as apiMarkAllNotificationsRead,
  listAgentTokens as apiListAgentTokens,
  createAgentToken as apiCreateAgentToken,
  revokeAgentToken as apiRevokeAgentToken,
  downloadProjectCertificationReport as apiDownloadCertificationReport,
  downloadProjectAcceptanceReport as apiDownloadAcceptanceReport,
  setupTwoFactor as apiSetupTwoFactor,
  confirmTwoFactor as apiConfirmTwoFactor,
  disableTwoFactor as apiDisableTwoFactor,
  changeMyPassword as apiChangeMyPassword,
  exportVulnerabilityToTaskTracker as apiExportVulnerabilityToTaskTracker,
  getVulnerabilityTaskTrackerLink as apiGetVulnerabilityTaskTrackerLink,
  getTasks as apiGetTasks,
  getTask as apiGetTask,
} from "../api";
import { calculateCvssScore, severityFromCvssScore } from "../cvss";
import { PROJECT_STATUS_ORDER } from "../projectStatus";
import type {
  Notification as ApiNotification,
  ProjectActivityItem,
  ProjectMember as ApiProjectMember,
  ProjectNote,
  ProjectCredential as ApiProjectCredential,
  ProjectStats,
  ProjectStatus,
  Endpoint as ApiEndpoint,
  Host as ApiHost,
  HostFarmJob as ApiHostFarmJob,
  IpFarmJob as ApiIpFarmJob,
  JsFarmJob as ApiJsFarmJob,
  JsFile as ApiJsFile,
  Port as ApiPort,
  Service as ApiService,
  Vulnerability as ApiVulnerability,
  TaskTrackerIssueLink,
  TaskTrackerTask,
  TaskTrackerTaskDetail,
  TaskTrackerTaskCategory,
  Invitation as ApiInvitation,
  VulnerabilityFile as ApiVulnFile,
} from "../types";
import {
  type ApiKey,
  type Cred,
  type Endpoint,
  type Host,
  type JsFileEntry,
  type Member,
  type Method,
  type Note,
  type ProjectDetail,
  type Role,
  type Severity,
  type Vuln,
  type VStatus,
  type WorkspaceUser,
  type WsRole,
} from "./data";
import {
  API_SCOPES,
  API_SCOPE_LABELS,
  EDITOR_FIELDS,
  FINDING_SEV,
  MEMBER_COLORS,
  METHOD,
  PORT,
  PROJ_STATUS,
  ROLE,
  SECRET_SEV,
  SEV,
  STDOT,
  TYPELABEL,
  VSTATUS,
  VSTATUS_LABEL,
  VSTATUS_OPEN,
  VSTATUS_ORDER,
  VSTATUS_FILTER,
  WS_ROLE,
  WS_ROLE_LABEL,
  type EditorType,
} from "./tokens";

/* Localize API/backend error messages. rawGetApiErrorMessage returns the backend's
   `detail` (or an English fallback); t() maps our canonical English messages to the
   active locale — English in the English locale, Russian in RU. Backend messages not
   yet migrated to an English source key have no entry and pass through unchanged, so
   this is safe to wrap every error toast in. Public account screens translate
   their messages at the point where they are displayed or queued. */
const getApiErrorMessage = (error: unknown, fallback: string): string =>
  t(rawGetApiErrorMessage(error, fallback));

type NavId = "projects" | "tasks" | "docs" | "members";
type ViewId = "list" | "detail" | "profile" | "workspaceMembers";
type SectionId = "overview" | "hosts" | "vulns" | "notes" | "creds" | "members" | "activity";
type ReconView = "hosts" | "ips" | "endpoints" | "js";
type ProfileTab = "account" | "security" | "api" | "customizing";
/** Word report templates the backend can generate (POST /projects/{id}/reports/{kind}). */
type ReportKind = "szi" | "pp";
/** What the export dialog exports: the project report, or one of the recon lists. */
type ExportScope = "report" | "hosts" | "ips" | "endpoints" | "js-endpoints" | "js-secrets";
/** How many type-to-search suggestions a combo field offers at once. */
const COMBO_MAX = 5;
/** Макс. строк, которые рендерим в больших списках разом (как в FROST): остальное —
 *  за фильтром, иначе тысячи DOM-узлов подвешивают рендер. */
const LIST_CAP = 800;
/** Макс. эндпоинтов, рисуемых внутри одной группы-хоста. */
const EP_GROUP_CAP = 400;
const REPORT_KINDS: { kind: ReportKind; title: string; desc: string }[] = [
  { kind: "szi", title: "Certification report", desc: "Security-system test report — for certification testing." },
  { kind: "pp", title: "Internal acceptance report", desc: "Acceptance protocol — for internal acceptance of the work." },
];

interface NoteForm {
  title: string;
  excerpt: string;
  author: string;
}

interface VulnDetailForm {
  title?: string;
  host?: string;
  sev?: Severity;
  status?: VStatus;
  stepsList?: string[];
  /** Per-step screenshot file ids (uploaded as vulnerability files). Keyed by
      step index; the report pulls these via each step's `image_file_ids`. */
  stepImages?: Record<number, number[]>;
  description?: string;
  impact?: string;
  remediation?: string;
  cwe?: string;
  vector?: string;
}

interface StormState {
  userMenuOpen: boolean;
  notifOpen: boolean;
  modalOpen: boolean;
  sidebarCollapsed: boolean;
  lightboxSrc: string | null;
  apiProjects: ApiProjectRow[] | null;
  projectsLoading: boolean;
  projectsError: string | null;
  /* Per-project "added at" timestamps for the projects-list stat sparklines,
     keyed by project id. Fetched lazily (hosts + vulns per project) so the
     Hosts / Open issues cards can chart real add-frequency, not just a total.
     `null` = not fetched yet. */
  aggTimes: Record<number, { hosts: string[]; openVulns: string[] }> | null;
  reloadTick: number;
  projEditId: number | null;
  confirmProjectId: number | null;
  /** Удаляемый пользователь на странице /members (там нет открытого проекта). */
  confirmUserId: number | null;
  /* ---- project detail: every collection below is backend-backed ----
     `null` = not loaded yet, `[]` = loaded and empty. Each has a `*Tick`
     counter that its loader effect watches, so a mutation reloads it. */
  activity: ProjectActivityItem[] | null;
  activityLoading: boolean;
  activityError: string | null;
  activityTick: number;
  /** Key of the activity group whose full list is open in a modal. */
  activityModalKey: string | null;
  /** Real hosts for `openProjectId`, mapped to Storm's shape. `null` = not loaded yet. */
  apiHosts: Host[] | null;
  hostsLoading: boolean;
  hostsTick: number;
  /** Адреса, скрытые из вкладки IP («удалённые» из списка) — грузятся вместе с хостами. */
  hiddenIps: string[];
  // ---- "Add hosts" import (server-side probe farm) ----
  hostImportOpen: boolean;
  hostImportRaw: string;
  /** Deduped, normalized preview of what will actually be imported (editable). */
  hostImportPreview: string;
  hostImportBusy: boolean;
  // ---- "Add IPs" import (same farm, reverse-resolves each address) ----
  ipImportOpen: boolean;
  ipImportRaw: string;
  ipImportPreview: string;
  ipImportBusy: boolean;
  // ---- "Add endpoints" import (paste a list of URLs, bulk-create) ----
  epImportOpen: boolean;
  epImportRaw: string;
  epImportPreview: string;
  epImportBusy: boolean;
  /** Hosts filter pills (multi-select, empty = all): "up" | "down" | HTTP code. */
  hostFilters: string[];
  /** Same status filter, for the IPs view. */
  ipFilters: string[];
  /** The running/finished probe job being polled, or null when idle. */
  hostFarmJob: ApiHostFarmJob | null;
  ipFarmJob: ApiIpFarmJob | null;
  /** The running/finished JS scan job being polled, or null when idle. */
  jsFarmJob: ApiJsFarmJob | null;
  /** Project JS files (backend-loaded). `null` = not loaded yet. */
  apiJsFiles: ApiJsFile[] | null;
  jsTick: number;
  jsQuery: string;
  /** Only show files that leaked at least one secret. */
  jsSecretsOnly: boolean;
  /** Which JS files are expanded (by url). */
  jsExpanded: string[];
  /** The domain-selection page shown before a scan starts (mirrors the export page). */
  jsScanSetupOpen: boolean;
  /** Editable "will be scanned" domain list on that page — the coarse host filters
      seed it, hand edits refine it (same contract as the export page's list). */
  jsScanText: string;
  apiMembers: Member[] | null;
  membersTick: number;
  apiVulns: Vuln[] | null;
  vulnsTick: number;
  apiNotes: Note[] | null;
  notesTick: number;
  /** Project credential vault for `openProjectId`. `null` = not loaded yet. */
  apiCreds: Cred[] | null;
  credsTick: number;
  /** Ids of creds whose secret is currently un-masked (reveal is per-row, opt-in). */
  revealedCredIds: number[];
  /** Set when the backend answers 403 for the open project → renders the no-access screen. */
  accessDenied: boolean;
  notifs: ApiNotification[];
  reconView: ReconView;
  openHostId: number | null;
  /** The IP address whose detail card is open (IPs have no stored id — keyed by address). */
  openIp: string | null;
  /** Open JS file card, by backend id — part of the URL. */
  openJsFileId: number | null;
  /** Open "all files of host" JS page, by hostname. */
  openJsHost: string | null;
  reconMenuOpen: boolean;
  hostQuery: string;
  /* Recon view filters. Methods are multi-select like every other pill filter:
     empty = all. */
  epMethods: Method[];
  epHostQuery: string;
  epPathQuery: string;
  ipQuery: string;
  epExpanded: string[];
  confirmOpen: boolean;
  confirmType: EditorType | null;
  confirmIndex: number;
  confirmLabel: string;
  noteEditorOpen: boolean;
  noteEditorMode: "add" | "edit";
  noteEditorIndex: number;
  noteEditorId: number | null;
  noteSaving: boolean;
  noteForm: NoteForm;
  noteFormOriginal: Pick<NoteForm, "title" | "excerpt">;
  epOpen: boolean;
  epData: { method: Method; path: string; host: string; hostId: number; endpointId: number };
  /** Raw request being edited — saved to the endpoint (request_raw). */
  epRequest: string;
  epRequestOriginal: string;
  epLoading: boolean;
  /* The response is a scratchpad: there is no column for it on the backend, so it
     is deliberately not saved — it exists to be tweaked and copied out. */
  epSaving: boolean;
  exportModalOpen: boolean;
  /** Backend report template: "szi" = certification, "pp" = internal acceptance. */
  exportKind: ReportKind;
  exportBusy: boolean;
  /** What the export dialog is for: the project's Word report, or a recon list. */
  exportScope: ExportScope;
  exportFormat: "list" | "openapi";
  /** Recon exports open as a full page (like "Add hosts"), not a modal. */
  exportPageOpen: boolean;
  /* The right-hand pane: the lines that will actually be written to the file.
     Seeded from the filtered list and editable, so rows can be dropped before
     downloading — the left pane mirrors whatever is left here. */
  exportText: string;
  /** Note open in the viewer, by backend id — it is part of the URL. */
  openNoteId: number | null;
  editorOpen: boolean;
  editorType: EditorType;
  editorMode: "add" | "edit";
  editorIndex: number;
  editorForm: Record<string, string | string[]>;
  ipEditBusy: boolean;
  tagDrafts: Record<string, string>;
  /** Key of the combo field whose suggestion list is open, if any. */
  comboOpen: string | null;
  /** Index of the keyboard-highlighted suggestion in that list. */
  comboHi: number;
  /** «Affected host» на карточке уязвимости — свой комбо (тот же пикер хостов, что и в форме). */
  vdHostComboOpen: boolean;
  vdHostComboHi: number;
  nav: NavId;
  tab: "active" | "archived";
  query: string;
  projSort: "last" | "first";
  worksEnabled: boolean;
  newName: string;
  newNameError: boolean;
  newStart: string;
  newEnd: string;
  newAppsec: AppSecFieldsValue;
  view: ViewId;
  openProjectId: number | null;
  projEditOpen: boolean;
  projEditName: string;
  projEditStart: string;
  projEditEnd: string;
  projEditStatus: ProjectStatus;
  projEditAppsec: AppSecFieldsValue;
  section: SectionId;
  expanded: number[];
  profileTab: ProfileTab;
  apiKeys: ApiKey[];
  apiKeyModalOpen: boolean;
  apiKeyName: string;
  apiKeyScopes: Record<string, boolean>;
  /** Доступ ключа: все свои проекты (true) или явно выбранные (false). */
  apiKeyAllProjects: boolean;
  apiKeyProjectIds: number[];
  /** Expiry ключа (YYYY-MM-DD); пусто = бессрочный. */
  apiKeyExpiry: string;
  workspaceUsers: WorkspaceUser[];
  /** Неактивированные приглашения (pending), показываются над списком участников. */
  pendingInvites: ApiInvitation[];
  usersTick: number;
  /** Активные / архивные (деактивированные) участники — как вкладки у проектов. */
  wsUserTab: "active" | "archived";
  wsUserModalOpen: boolean;
  wsUserMode: "add" | "edit";
  wsUserIndex: number;
  wsUserName: string;
  wsUserEmail: string;
  wsUserRole: WsRole;
  wsUserProjectRole: Role;
  memberQuery: string;
  /** Multi-select project-role filter (empty = no filtering). */
  memberRoles: Role[];
  wsMemberQuery: string;
  /** Multi-select workspace-role filter (empty = no filtering). */
  wsMemberRoles: WsRole[];
  /** Multi-select project-role filter on the workspace Members page (empty = no filtering). */
  wsMemberProjectRoles: Role[];
  twoFASetupOpen: boolean;
  twoFACode: string;
  // Данные привязки, полученные от POST /users/me/2fa/setup.
  twoFAQr: string | null;
  twoFASecret: string | null;
  // Диалог отключения (требует пароль аккаунта).
  twoFADisableOpen: boolean;
  twoFADisablePassword: string;
  twoFABusy: boolean;
  // Смена пароля в профиле (только для не-SSO пользователей).
  pwdCurrent: string;
  pwdNew: string;
  pwdConfirm: string;
  pwdBusy: boolean;
  vulnFilterAuthor: string;
  /* Multi-select filters: every pill toggles, and an empty selection means "All"
     — so deselecting the last pill lands back on All by itself. */
  vulnFilterStatuses: VStatus[];
  vulnFilterSeverities: Severity[];
  vulnFilterHost: string;
  /* ── Раздел Tasks (Task Tracker пространство APPSEC, read-only) ────────────────────────────
     Список грузится при входе в раздел; поиск по имени и фильтр по категории
     статуса применяются на клиенте (как у списка уязвимостей). */
  tasksRows: TaskTrackerTask[] | null;
  tasksLoading: boolean;
  tasksRefreshing: boolean;
  tasksNextPage: string | null;
  tasksTotal: number | null;
  tasksActiveTotal: number | null;
  tasksClosedTotal: number | null;
  tasksError: string | null;
  tasksQuery: string;
  tasksTab: "active" | "closed";
  tasksSort: "last" | "first";
  /** Открытый ключ задачи (напр. "APPSEC-123") — часть URL /tasks/{key}. */
  tasksOpenKey: string | null;
  tasksDetail: TaskTrackerTaskDetail | null;
  tasksDetailLoading: boolean;
  tasksDetailError: string | null;
  tasksCreatingKey: string | null;
  /** Real backend vulnerability id (not a list index) — it is part of the URL. */
  openVulnId: number | null;
  vulnDetailForm: VulnDetailForm;
  // ---- vulnerability attachments (evidence files in MinIO) ----
  vulnFiles: ApiVulnFile[];
  vulnFilesBusy: boolean;
  // Связь открытой находки с тикетом Works (AppSec) + флаг экспорта.
  worksExportBusy: boolean;
  vulnFileDrag: boolean;
  /** Attachment opened in the preview modal, or null. */
  filePreview: ApiVulnFile | null;
  // ---- TaskTracker export modal ----
  taskTrackerExportOpen: boolean;
  taskTrackerExportVulnId: number | null;
  taskTrackerExportChecking: boolean; // идёт начальная проверка (уже экспортировано? проект привязан?)
  taskTrackerExportBusy: boolean; // идёт сам экспорт
  taskTrackerExportLink: TaskTrackerIssueLink | null; // существующая/созданная связь с задачей
  taskTrackerExportError: string | null;
  // ---- Bulk TaskTracker export (все уязвимости раздела) ----
  taskTrackerBulkOpen: boolean;
  taskTrackerBulkRunning: boolean;
  taskTrackerBulkDone: number;
  taskTrackerBulkTotal: number;
  taskTrackerBulkCreated: number;
  taskTrackerBulkSkipped: number;
  taskTrackerBulkFailed: number;
  taskTrackerBulkFinished: boolean;
  /** Ссылка на TaskTracker-проект — выводится из URL созданной задачи, для кнопки «Open Task Tracker». */
  taskTrackerBulkProjectUrl: string | null;
}

const initialState: StormState = {
  userMenuOpen: false,
  notifOpen: false,
  modalOpen: false,
  sidebarCollapsed: false,
  lightboxSrc: null,
  apiProjects: null,
  projectsLoading: false,
  projectsError: null,
  aggTimes: null,
  reloadTick: 0,
  projEditId: null,
  confirmProjectId: null,
  confirmUserId: null,
  activity: null,
  activityLoading: false,
  activityError: null,
  activityTick: 0,
  activityModalKey: null,
  apiHosts: null,
  hostsLoading: false,
  hostsTick: 0,
  hiddenIps: [],
  hostImportOpen: false,
  ipImportOpen: false,
  ipImportRaw: "",
  ipImportPreview: "",
  ipImportBusy: false,
  epImportOpen: false,
  epImportRaw: "",
  epImportPreview: "",
  epImportBusy: false,
  ipFarmJob: null,
  jsFarmJob: null,
  apiJsFiles: null,
  jsTick: 0,
  jsQuery: "",
  jsSecretsOnly: false,
  jsExpanded: [],
  jsScanSetupOpen: false,
  jsScanText: "",
  hostImportRaw: "",
  hostImportPreview: "",
  hostImportBusy: false,
  hostFilters: [],
  ipFilters: [],
  hostFarmJob: null,
  apiMembers: null,
  membersTick: 0,
  apiVulns: null,
  vulnsTick: 0,
  apiNotes: null,
  notesTick: 0,
  apiCreds: null,
  credsTick: 0,
  revealedCredIds: [],
  accessDenied: false,
  notifs: [],
  reconView: "hosts",
  openHostId: null,
  openIp: null,
  openJsFileId: null,
  openJsHost: null,
  reconMenuOpen: false,
  hostQuery: "",
  epMethods: [],
  epHostQuery: "",
  epPathQuery: "",
  ipQuery: "",
  epExpanded: [],
  confirmOpen: false,
  confirmType: null,
  confirmIndex: -1,
  confirmLabel: "",
  noteEditorOpen: false,
  noteEditorMode: "add",
  noteEditorIndex: -1,
  noteEditorId: null,
  noteSaving: false,
  noteForm: { title: "", excerpt: "", author: "" },
  noteFormOriginal: { title: "", excerpt: "" },
  epOpen: false,
  epData: { method: "GET", path: "", host: "", hostId: 0, endpointId: 0 },
  epRequest: "",
  epRequestOriginal: "",
  epLoading: false,
  epSaving: false,
  exportModalOpen: false,
  exportKind: "szi",
  exportBusy: false,
  exportScope: "report",
  exportFormat: "list",
  exportPageOpen: false,
  exportText: "",
  openNoteId: null,
  editorOpen: false,
  editorType: "host",
  editorMode: "add",
  editorIndex: -1,
  editorForm: {},
  ipEditBusy: false,
  tagDrafts: {},
  comboOpen: null,
  comboHi: 0,
  vdHostComboOpen: false,
  vdHostComboHi: 0,
  nav: "projects",
  tab: "active",
  query: "",
  projSort: "last",
  worksEnabled: false,
  newName: "",
  newNameError: false,
  newStart: "",
  newEnd: "",
  newAppsec: { appsec_components: [], appsec_product_code: null, appsec_component_code: null, appsec_component_name: null, appsec_versions: [], appsec_assignee: null, appsec_assignee_name: null, appsec_ticket_url: null, appsec_ticket_key: null },
  view: "list",
  openProjectId: null,
  projEditOpen: false,
  projEditName: "",
  projEditStart: "",
  projEditEnd: "",
  projEditStatus: "active",
  projEditAppsec: { appsec_components: [], appsec_product_code: null, appsec_component_code: null, appsec_component_name: null, appsec_versions: [], appsec_assignee: null, appsec_assignee_name: null, appsec_ticket_url: null, appsec_ticket_key: null },
  section: "overview",
  expanded: [],
  profileTab: "account",
  apiKeys: [],
  apiKeyModalOpen: false,
  apiKeyName: "",
  apiKeyScopes: {},
  apiKeyAllProjects: true,
  apiKeyProjectIds: [],
  apiKeyExpiry: "",
  workspaceUsers: [],
  pendingInvites: [],
  usersTick: 0,
  wsUserTab: "active",
  wsUserModalOpen: false,
  wsUserMode: "add",
  wsUserIndex: -1,
  wsUserName: "",
  wsUserEmail: "",
  wsUserRole: "user",
  wsUserProjectRole: "pentester",
  memberQuery: "",
  memberRoles: [],
  wsMemberQuery: "",
  wsMemberRoles: [],
  wsMemberProjectRoles: [],
  twoFASetupOpen: false,
  twoFACode: "",
  twoFAQr: null,
  twoFASecret: null,
  twoFADisableOpen: false,
  twoFADisablePassword: "",
  twoFABusy: false,
  pwdCurrent: "",
  pwdNew: "",
  pwdConfirm: "",
  pwdBusy: false,
  vulnFilterAuthor: "",
  vulnFilterStatuses: [],
  vulnFilterSeverities: [],
  vulnFilterHost: "",
  tasksRows: null,
  tasksLoading: false,
  tasksRefreshing: false,
  tasksNextPage: null,
  tasksTotal: null,
  tasksActiveTotal: null,
  tasksClosedTotal: null,
  tasksError: null,
  tasksQuery: "",
  tasksTab: "active",
  tasksSort: "last",
  tasksOpenKey: null,
  tasksDetail: null,
  tasksDetailLoading: false,
  tasksDetailError: null,
  tasksCreatingKey: null,
  openVulnId: null,
  vulnDetailForm: {},
  vulnFiles: [],
  vulnFilesBusy: false,
  worksExportBusy: false,
  vulnFileDrag: false,
  filePreview: null,
  taskTrackerExportOpen: false,
  taskTrackerExportVulnId: null,
  taskTrackerExportChecking: false,
  taskTrackerExportBusy: false,
  taskTrackerExportLink: null,
  taskTrackerExportError: null,
  taskTrackerBulkOpen: false,
  taskTrackerBulkRunning: false,
  taskTrackerBulkDone: 0,
  taskTrackerBulkTotal: 0,
  taskTrackerBulkCreated: 0,
  taskTrackerBulkSkipped: 0,
  taskTrackerBulkFailed: 0,
  taskTrackerBulkFinished: false,
  taskTrackerBulkProjectUrl: null,
};

const CARD: CSSProperties = { background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 16 };
const PILL_ON: CSSProperties = { background: "var(--st-accent-2)", color: "var(--st-on-accent)", border: "1px solid transparent" };
const PILL_OFF: CSSProperties = { background: "var(--st-surface)", color: "var(--st-text-2)", border: "1px solid transparent" };
const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* Styled hover tooltip — a themed replacement for the browser's native `title`
   bubble. Rendered through a portal to document.body so it is never clipped by an
   ancestor's `overflow: hidden` (the recon cards clip), and positioned `fixed`
   against the hovered element's box. */
/* Плавное раскрытие/сворачивание. Содержимое всегда смонтировано (нужно для
   grid-rows анимации); видимость управляется только CSS-классом, поэтому высота
   анимируется в обе стороны. */
function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className={`collapse${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="collapse-inner">{children}</div>
    </div>
  );
}

/* Attachment preview modal. Clicking a finding's file opens this instead of
   downloading it: the bytes are fetched once into a blob URL (so nothing is
   saved to disk), previewed by content type, and only written out if the user
   presses the download arrow. Images, PDFs and text/code render inline; other
   types show a "no preview" card with the download button as the only action. */
function FilePreview({ file, onClose }: { file: ApiVulnFile; onClose: () => void }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ct = file.content_type || "";
  const isImage = ct.startsWith("image/");
  const isPdf = ct === "application/pdf";
  const isText = ct.startsWith("text/") || /(json|xml|javascript|x-sh|yaml|csv|html)/.test(ct);
  const sizeLabel = file.size_bytes < 1024 ? `${file.size_bytes} B` : `${Math.round(file.size_bytes / 1024)} KB`;

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    setBlobUrl(null);
    setText(null);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`/api/v1/files/${file.id}/download`, { credentials: "same-origin" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
        if (isText) setText(await blob.text());
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [file.id, isText]);

  const loading = !blobUrl && !error;

  return createPortal(
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 95, background: "rgba(10,16,26,.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, animation: "storm-fade .18s ease both" }}>
      <div onClick={stop} style={{ display: "flex", flexDirection: "column", width: "min(1000px, 100%)", maxHeight: "100%", background: "var(--st-surface)", border: "1px solid var(--st-border)", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: "1px solid var(--st-divider)" }}>
          <Icon name="doc" size={16} color="var(--st-text-3)" />
          <span className="mono" style={{ flex: 1, minWidth: 0, fontSize: 13, color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.original_name}</span>
          <span className="mono" style={{ flex: "none", fontSize: 11, color: "var(--st-text-faint)" }}>{sizeLabel}</span>
          <a href={`/api/v1/files/${file.id}/download`} download={file.original_name} className="clk" title={t("Download")} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 9, background: "var(--st-accent)", color: "var(--st-on-accent)", font: "700 12.5px Inter,sans-serif", textDecoration: "none", cursor: "pointer" }}>
            <Icon name="download" size={15} sw={2.2} />{t("Download")}
          </a>
          <div className="clk" onClick={onClose} title={t("Close")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 9, background: "var(--st-elevated)", color: "var(--st-text-2)", cursor: "pointer" }}>
            <Icon name="close" size={16} />
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: "var(--st-sunken)", display: "flex", alignItems: isImage ? "center" : "stretch", justifyContent: "center" }}>
          {loading && <div style={{ padding: 60, color: "var(--st-text-faint)", font: "500 14px Inter,sans-serif" }}>{t("Loading preview…")}</div>}
          {error && <div style={{ padding: 60, color: "var(--st-danger)", font: "500 14px Inter,sans-serif" }}>{t("Could not load this file.")} ({error})</div>}
          {blobUrl && isImage && <img src={blobUrl} alt={file.original_name} style={{ maxWidth: "100%", maxHeight: "78vh", objectFit: "contain", display: "block" }} />}
          {blobUrl && isPdf && <iframe src={blobUrl} title={file.original_name} style={{ width: "100%", height: "78vh", border: "none", background: "#fff" }} />}
          {blobUrl && isText && text != null && (
            <pre className="mono" style={{ margin: 0, padding: "16px 18px", width: "100%", fontSize: 12.5, lineHeight: 1.6, color: "var(--st-text-2)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</pre>
          )}
          {blobUrl && !isImage && !isPdf && !isText && (
            <div style={{ padding: 60, textAlign: "center", color: "var(--st-text-faint)", font: "500 14px Inter,sans-serif" }}>
              <Icon name="doc" size={40} color="var(--st-text-faint)" />
              <div style={{ marginTop: 14 }}>{t("No preview available for this file type.")}</div>
              <div style={{ marginTop: 6, fontSize: 12.5 }}>{t("Use the download button to save it.")}</div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Multi-select filter toggle: add the value if absent, drop it if already held. */
const toggleIn = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
/** Coerce an editor-form value (string or tag-array) to a plain string. */
const fstr = (v: string | string[] | undefined): string => (typeof v === "string" ? v : "");

/** dd.mm.yyyy → yyyy-mm-dd (for <input type=date>) and back. */
const toDispDate = (s?: string): string => {
  if (!s) return "";
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : s;
};

/** ISO-таймстамп → «ДД.ММ.ГГГГ, ЧЧ:ММ» (привлекательнее сырого ISO). */
const fmtDateTime = (s?: string | null): string => {
  if (!s) return "—";
  const dt = new Date(s);
  if (Number.isNaN(dt.getTime())) return String(s);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(dt.getDate())}.${p(dt.getMonth() + 1)}.${dt.getFullYear()}, ${p(dt.getHours())}:${p(dt.getMinutes())}`;
};

/** Build the URL path that represents the current navigation state.
 *
 * The open vulnerability is part of the path (`…/vulns/{id}`) so that a finding
 * can be deep-linked — that is what notification and activity-feed links point
 * at. Keep this in sync with `navStateFromPath`: any field encoded here must be
 * parsed back there, or the round-trip through the router will drop it.
 */
function pathFor(s: {
  view: ViewId;
  nav: NavId;
  openProjectId: number | null;
  section: SectionId;
  reconView: ReconView;
  profileTab: ProfileTab;
  openVulnId: number | null;
  openNoteId: number | null;
  openHostId: number | null;
  openIp: string | null;
  openJsFileId: number | null;
  tasksOpenKey: string | null;
}): string {
  if (s.view === "profile") return s.profileTab === "account" ? "/profile" : `/profile/${s.profileTab}`;
  if (s.view === "workspaceMembers") return "/members";
  if (s.view === "detail" && s.openProjectId != null) {
    const base = `/projects/${s.openProjectId}`;
    if (s.section === "overview") return base;
    if (s.section === "hosts") {
      // An open host/IP card is the last path segment, so the card is deep-linkable
      // (an IP carries dots but stays a single segment — encode it to be safe).
      if (s.reconView === "hosts" && s.openHostId != null) return `${base}/hosts/${s.openHostId}`;
      if (s.reconView === "ips" && s.openIp != null) return `${base}/ips/${encodeURIComponent(s.openIp)}`;
      if (s.reconView === "js" && s.openJsFileId != null) return `${base}/js/${s.openJsFileId}`;
      return `${base}/${s.reconView}`;
    }
    if (s.section === "vulns" && s.openVulnId != null) return `${base}/vulns/${s.openVulnId}`;
    if (s.section === "notes" && s.openNoteId != null) return `${base}/notes/${s.openNoteId}`;
    return `${base}/${s.section}`;
  }
  // Открытая задача TaskTracker — последний сегмент, карточка deep-linkable (/tasks/APPSEC-123).
  if (s.nav === "tasks") return s.tasksOpenKey ? `/tasks/${encodeURIComponent(s.tasksOpenKey)}` : "/tasks";
  return ({ projects: "/projects", tasks: "/tasks", docs: "/docs", members: "/members" } as Record<NavId, string>)[s.nav] || "/projects";
}

/** Parse a URL path back into the navigation-state fields it encodes. */
function navStateFromPath(path: string): Partial<StormState> {
  const parts = path.split("/").filter(Boolean);
  const head = parts[0];
  if (!head) return { view: "list", nav: "projects" };
  if (head === "projects") {
    if (parts.length === 1) return { view: "list", nav: "projects", openProjectId: null, openVulnId: null, openNoteId: null, openHostId: null, openIp: null, openJsFileId: null, openJsHost: null };
    const id = Number(parts[1]);
    const seg = parts[2];
    const base: Partial<StormState> = {
      view: "detail",
      nav: "projects",
      openProjectId: Number.isFinite(id) ? id : null,
      openVulnId: null,
      openNoteId: null,
      openHostId: null,
      openIp: null,
      openJsFileId: null,
      openJsHost: null,
    };
    /** `/…/vulns/7` → 7; a missing or non-numeric segment → null. */
    const entityId = () => {
      const n = Number(parts[3]);
      return parts[3] != null && Number.isFinite(n) ? n : null;
    };
    if (!seg) return { ...base, section: "overview" };
    // /projects/{id}/hosts/{hostId} and /projects/{id}/ips/{ip} deep-link an open card.
    if (seg === "hosts") {
      const hid = Number(parts[3]);
      return { ...base, section: "hosts", reconView: "hosts", openHostId: parts[3] != null && Number.isFinite(hid) ? hid : null };
    }
    if (seg === "ips") {
      return { ...base, section: "hosts", reconView: "ips", openIp: parts[3] != null ? decodeURIComponent(parts[3]) : null };
    }
    if (seg === "endpoints") return { ...base, section: "hosts", reconView: seg };
    if (seg === "js") return { ...base, section: "hosts", reconView: "js", openJsFileId: entityId() };
    // /projects/{id}/vulns/{vulnId} and /projects/{id}/notes/{noteId} — deep links.
    if (seg === "vulns") return { ...base, section: "vulns", openVulnId: entityId() };
    if (seg === "notes") return { ...base, section: "notes", openNoteId: entityId() };
    if (seg === "creds" || seg === "members" || seg === "activity") return { ...base, section: seg };
    return { ...base, section: "overview" };
  }
  if (head === "tasks") return { view: "list", nav: "tasks", tasksOpenKey: parts[1] ? decodeURIComponent(parts[1]) : null };
  if (head === "my-tasks") return { view: "list", nav: "projects" };
  if (head === "docs") return { view: "list", nav: "docs" };
  if (head === "members") return { view: "workspaceMembers", nav: "members" };
  if (head === "profile") return { view: "profile", profileTab: ["security", "api", "customizing"].includes(parts[1]) ? (parts[1] as ProfileTab) : "account" };
  return { view: "list", nav: "projects" };
}

/** A project row as shown in the (backend-backed) Projects list. */
interface ApiProjectRow {
  id: number;
  name: string;
  status: ProjectStatus;
  startISO: string;
  endISO: string;
  /** Project creation timestamp — the "added at" point for the count sparklines. */
  createdISO: string;
  updated: string;
  createdBy: number;
  openFindings: number;
  totalFindings: number;
  hostsCount: number;
  /** AppSec-тикет проекта — чтобы в разделе Tasks показать ссылку на проект. */
  appsec_ticket_key: string | null;
  stsMissing: string[];
}

function avatarLetter(username: string): string {
  return (Array.from(username.trim())[0] || "U").toUpperCase();
}

/** CVSS 4.0 scorer.
 *
 * Раньше здесь была упрощённая формула из прототипа (сумма весов), которая
 * расходилась со спецификацией: например
 * CVSS:4.0/AV:L/AC:L/AT:P/PR:L/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N давала 8.8
 * вместо 7.3. Реальный CVSS 4.0 считается по MacroVector-таблицам, поэтому
 * используем спецификационную реализацию из ../cvss — ту же оценку выдаёт и
 * бэкенд (библиотека cvss), так что превью и сохранённое значение совпадают.
 */
function computeCvss4(vector?: string): { score: number; sev: Severity } | null {
  const v = (vector || "").trim();
  if (!/^CVSS:4\.0\//i.test(v)) return null;
  const { score } = calculateCvssScore("4.0", v);
  if (score === null || Number.isNaN(score)) return null;
  return { score, sev: severityFromCvssScore(score) as Severity };
}

/** Единый безопасный GFM-рендерер для заметок и Markdown-полей. */
function renderMarkdown(src: string): ReactNode {
  return <StormMarkdown value={src} />;
}

/** Deterministic sparkline point string (ported from prototype). */

/**
 * Cumulative-count sparkline driven by real "added at" timestamps.
 *
 * X is the engagement window [start, end]; the line is drawn only up to today,
 * so an unfinished project stops partway across the card. Y is the running
 * number of entities created at or before each sampled instant — every add
 * pushes the line up, and a burst of adds shows as a steeper climb.
 *
 * `startMs`/`endMs` are epoch millis (NaN when the project has no dates set); we
 * then fall back to the entities' own first/last timestamps so the card still
 * renders something meaningful.
 */
function cumulativeSpark(
  timestamps: (string | null | undefined)[],
  startMs: number,
  endMs: number,
  w = 111,
  h = 30,
  pad = 3,
): string {
  const now = Date.now();
  const times = timestamps
    .map((t) => Date.parse(t ?? ""))
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => a - b);

  let start = startMs;
  let end = endMs;
  if (!Number.isFinite(start)) start = times.length ? times[0] : now - 7 * 864e5;
  if (!Number.isFinite(end) || end <= start) {
    end = Math.max(now, times.length ? times[times.length - 1] : now, start + 864e5);
  }

  /* Ось X — прошедшая часть окна: от старта до «сегодня», но не дальше конца
     проекта. Нормируем именно по ней (а не по всему start…end), иначе у активного
     проекта линия обрывалась бы на середине карточки, и спарклайны в соседних
     виджетах получались бы разной длины. */
  const cutoff = Math.max(start + 1, Math.min(now, end));
  const span = cutoff - start;
  const maxY = Math.max(1, times.length);
  const yTop = pad;
  const yBot = h - pad;
  const N = 16;

  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    const t = start + ((cutoff - start) * i) / (N - 1);
    let count = 0;
    for (const ts of times) {
      if (ts <= t) count++;
      else break;
    }
    const x = (w * (t - start)) / span;
    const y = yBot - (count / maxY) * (yBot - yTop);
    pts.push(`${Math.round(x)},${Math.round(y)}`);
  }
  return pts.join(" ");
}

/** Замыкает спарклайн вниз до базовой линии — заливка того же цвета под графиком. */
function sparkArea(points: string, w: number, h = 30): string {
  if (!points) return "";
  return `0,${h} ${points} ${w},${h}`;
}

// ================= backend hosts → Storm host shape =================
/* The backend serialises each port with its services (schemas.py `PortOut.services`),
   but the shared `Port` type in ../types does not declare the field yet. Widen it
   locally rather than reaching outside this module. */
type ApiPortWithServices = ApiPort & { services?: ApiService[] };

const STORM_METHODS: Method[] = [...ENDPOINT_METHODS];

/** Сохраняем HTTP-метод без подмены HEAD/OPTIONS/TRACE/QUERY на GET. */
function toStormMethod(m: ApiEndpoint["method"]): Method {
  return m && (STORM_METHODS as string[]).includes(m) ? (m as Method) : "GET";
}

/** A farm job still worth polling. `pending`/`queued` are the recon-worker's
 *  pre-run states — a job sits there until the worker picks it off the queue. */
function isFarmJobInFlight(status: string): boolean {
  return status === "pending" || status === "queued" || status === "running";
}

/** Ports live under each IP on the backend; Storm shows them flat per host. */
function toStormPort(p: ApiPortWithServices): Host["ports"][number] {
  return {
    n: p.port_number,
    proto: p.protocol,
    state: p.state,
    svc: p.services?.[0]?.name ?? "",
    techs: (p.services ?? []).map((s) => ({ name: s.name, version: s.version })),
    http: p.http_status ?? null,
  };
}

function toStormPorts(h: ApiHost): Host["ports"] {
  return h.ip_addresses.flatMap((ip) => (ip.ports as ApiPortWithServices[]).map(toStormPort));
}

function toStormHost(h: ApiHost, endpoints: Endpoint[] = []): Host {
  return {
    id: h.id,
    host: h.hostname || h.ip_address || "—",
    ip: h.ip_address || "",
    ips: h.ip_addresses.map((a) => a.ip_address),
    ipEntries: h.ip_addresses.map((a) => ({
      ip: a.ip_address,
      ports: (a.ports as ApiPortWithServices[]).map(toStormPort),
      hostnames: a.hostnames ?? [],
    })),
    origin: h.origin === "ip" ? "ip" : "host",
    status: h.status,
    ports: toStormPorts(h),
    endpoints,
    created: h.created_at,
  };
}

// ================= backend vulns / notes / members → Storm shapes =================
/** Backend workflow steps carry ids/endpoints/images; Storm's editor shows the text only. */
function toStormVuln(v: ApiVulnerability, hostName: string): Vuln {
  return {
    trackerKey: v.task_tracker_issue_key,
    trackerUrl: v.task_tracker_issue_url,
    id: v.id,
    sev: v.severity,
    title: v.title,
    // Storm speaks the backend's status vocabulary directly — nothing to map.
    status: v.status,
    host: hostName,
    author: v.created_by_username || "—",
    updated: v.updated_at,
    created: v.created_at,
    // Keep steps and their screenshot ids index-aligned (don't drop empties, or
    // a text-less screenshot-only step would lose its images). Trailing fully-
    // empty steps are trimmed so the editor doesn't show blank rows.
    ...(() => {
      const rows = v.workflow_steps.map((s) => ({ desc: s.description || "", ids: s.image_file_ids || [] }));
      while (rows.length && !rows[rows.length - 1].desc.trim() && rows[rows.length - 1].ids.length === 0) rows.pop();
      const stepImages: Record<number, number[]> = {};
      rows.forEach((r, i) => { if (r.ids.length) stepImages[i] = r.ids; });
      return { steps: rows.map((r) => r.desc), stepImages };
    })(),
    description: v.description || "",
    impact: v.impact || "",
    remediation: v.recommendations || "",
    cwe: v.cwe_id || "",
    vector: v.cvss_vector || "",
  };
}

function toStormNote(n: ProjectNote): Note {
  return {
    id: n.id,
    title: n.title,
    when: toDispDate((n.updated_at || n.created_at || "").slice(0, 10)),
    excerpt: n.content || "",
    author: n.created_by_username || "—",
  };
}

function toStormCred(c: ApiProjectCredential): Cred {
  return {
    id: c.id,
    username: c.username || "",
    password: c.password || "",
    passwordAvailable: c.password_available !== false && c.password !== null,
    host: c.host || "",
    author: c.created_by_username || "—",
    when: toDispDate((c.updated_at || c.created_at || "").slice(0, 10)),
  };
}

function toStormMember(m: ApiProjectMember, idx: number): Member {
  return {
    id: m.user_id,
    initials: avatarLetter(m.username),
    name: m.username,
    email: m.email,
    role: m.project_role,
    color: MEMBER_COLORS[idx % MEMBER_COLORS.length],
    avatarUrl: m.avatar_url,
  };
}

// ================= activity feed =================
/* Marker + colour for the dark event panel: green + = added, red − = removed,
   amber ~ = changed — the prototype's scheme, tuned to the Storm palette. */
const ACT_TONE = {
  add: { mark: "+", color: "var(--st-success)" },
  change: { mark: "~", color: "var(--st-warn)" },
  remove: { mark: "−", color: "var(--st-danger)" },
  info: { mark: "•", color: "var(--st-accent-muted)" },
} as const;
type ActTone = (typeof ACT_TONE)[keyof typeof ACT_TONE];
/** Severity chip on the dark panel — filled with the severity's own colour. */
const ACT_SEV: Record<Severity, string> = {
  critical: "var(--st-danger)",
  high: "var(--st-orange)",
  medium: "var(--st-warn)",
  low: "var(--st-accent)",
  info: "var(--st-text-3)",
  unrealized: "var(--st-text-faint)",
};

/** Beyond this many lines a card collapses and offers "Show more". */
const ACT_LINE_LIMIT = 10;

interface ActivityLine {
  key: string;
  text: string;
  severity?: Severity | null;
}
interface ActivityGroup {
  key: string;
  actor: string;
  /** Reads as one sentence with `subject`: "admin added 3 IP addresses". */
  verb: string;
  subject: string;
  tone: ActTone;
  time: string;
  lines: ActivityLine[];
  /** Findings are standalone cards, so the card links to that one finding. */
  vulnId?: number | null;
}

/** Human noun per entity type, singular/plural. Ports are deliberately absent —
    they are excluded from the feed (see ACT_HIDDEN). */
const ACT_NOUN: Record<string, [string, string]> = {
  vulnerability: ["finding", "findings"],
  host: ["host", "hosts"],
  host_ip_address: ["IP address", "IP addresses"],
  ip_address: ["IP address", "IP addresses"],
  service: ["service", "services"],
  endpoint: ["endpoint", "endpoints"],
  project_note: ["note", "notes"],
  note: ["note", "notes"],
  project_credential: ["credential", "credentials"],
  project: ["project", "projects"],
  project_member: ["member", "members"],
  member: ["member", "members"],
  js_farm: ["JS scan", "JS scans"],
  comment: ["comment", "comments"],
  note_comment: ["comment", "comments"],
};

/** Entity types the feed never shows: ports are too noisy to be worth a row. */
const ACT_HIDDEN = new Set(["port"]);
/** Entity types that are always their own card, never merged with siblings. */
const ACT_STANDALONE = new Set(["vulnerability", "project"]);

const actDetail = (a: ProjectActivityItem, k: string): string => {
  const v = a.details?.[k];
  return typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
};

/** Resolves an entity id to a display name — see `activityLine`'s fallback. */
type ActivityResolver = (entityType: string | null, entityId: number | null) => string | null;

/* One feed line: just the thing that was touched. The card header already says
   what kind of objects these are ("added 3 IP addresses"), so the lines carry no
   HOST/IP/ENDPOINT tag — only a coloured +/−/~ marker for added/removed/changed.

   CREATE events carry the entity in their audit details; UPDATE/DELETE ones do
   not, so the name is resolved from the loaded project data instead of printing
   a meaningless "#12". */
function activityLine(a: ProjectActivityItem, resolve: ActivityResolver): ActivityLine {
  const base = { key: String(a.id) };
  const fallback = resolve(a.entity_type, a.entity_id) ?? (a.entity_id != null ? `#${a.entity_id}` : "—");
  switch (a.entity_type) {
    case "vulnerability":
      // A deleted finding cannot be enriched (`title`) or resolved — its name is
      // whatever the DELETE event recorded at the time.
      return { ...base, text: a.title || actDetail(a, "title") || fallback, severity: a.severity ?? (actDetail(a, "severity") as Severity) ?? null };
    case "host": {
      const ip = actDetail(a, "ip_address");
      const name = actDetail(a, "hostname") || ip || fallback;
      return { ...base, text: ip && name !== ip ? `${name} · ${ip}` : name };
    }
    case "host_ip_address":
    case "ip_address":
      // The label (external / internal / mgmt) adds nothing here — just the address.
      return { ...base, text: actDetail(a, "ip_address") || fallback };
    case "service":
      return { ...base, text: actDetail(a, "service") || actDetail(a, "name") || fallback };
    case "endpoint":
      return { ...base, text: actDetail(a, "endpoint") || actDetail(a, "path") || fallback };
    case "project_note":
    case "note":
      return { ...base, text: a.title || actDetail(a, "title") || fallback };
    case "project_credential": {
      // The audit event carries username + host (never the password) — the feed
      // line reads "{username} for {host}", with the +/−/~ marker from the action.
      const who = actDetail(a, "username") || t("credential");
      const host = actDetail(a, "host");
      return { ...base, text: host ? t("{user} for {host}", { user: who, host }) : who };
    }
    case "js_farm": {
      const targets = Array.isArray(a.details?.targets) ? a.details.targets.filter((value): value is string => typeof value === "string") : [];
      return { ...base, text: targets.length ? targets.join(", ") : `${t("JS scan")} · ${actDetail(a, "domains_scanned") || actDetail(a, "targets_total") || "0"} ${t("hosts")}` };
    }
    case "project":
      return { ...base, text: actDetail(a, "project") || a.title || fallback };
    case "project_member":
    case "member":
      return { ...base, text: actDetail(a, "username") || actDetail(a, "user") || fallback };
    default:
      return { ...base, text: a.title || fallback };
  }
}

/** What the action applied to, straight after the verb: "3 IP addresses", "finding". */
function activitySubject(type: string, n: number): string {
  const noun = ACT_NOUN[type] ?? [type.replace(/_/g, " "), `${type.replace(/_/g, " ")}s`];
  const translated = activityNoun(noun[0], noun[1], n);
  return n === 1 ? translated : `${n} ${translated}`;
}

/* One card per action *per entity type*: adding hosts, IPs and endpoints are
   separate actions and never share a card. Findings and projects are always
   standalone — each reported finding is its own entry. Ports are dropped. */
function groupActivity(items: ProjectActivityItem[], resolve: ActivityResolver = () => null): ActivityGroup[] {
  const groups: ActivityGroup[] = [];
  let bucket: ProjectActivityItem[] = [];
  const flush = () => {
    if (!bucket.length) return;
    const first = bucket[0];
    const type = first.entity_type || "event";
    const tone =
      first.action === "CREATE" ? ACT_TONE.add
      : first.action === "DELETE" ? ACT_TONE.remove
      : first.action === "UPDATE" ? ACT_TONE.change
      : ACT_TONE.info;
    // Findings are "reported"; everything else is added / updated / removed.
    const verb =
      first.action === "START" ? "started"
      : first.action === "CREATE" ? (type === "vulnerability" ? "reported" : type === "js_farm" ? "completed" : "added")
      : first.action === "UPDATE" ? "updated"
      : first.action === "DELETE" ? "removed"
      : first.action.toLowerCase().replace(/_/g, " ");
    groups.push({
      key: `g${first.id}`,
      actor: first.username || "System",
      verb: activityVerb(verb),
      subject: activitySubject(type, bucket.length),
      tone,
      time: relTime(first.created_at),
      lines: bucket.map((a) => activityLine(a, resolve)),
      // Findings are standalone, so the card carries exactly one finding to link to.
      vulnId: type === "vulnerability" && first.action !== "DELETE" && first.url ? first.entity_id : null,
    });
    bucket = [];
  };
  items
    .filter((a) => !ACT_HIDDEN.has(a.entity_type || ""))
    .forEach((a) => {
      const prev = bucket[0];
      const breaks =
        prev != null &&
        (prev.username !== a.username ||
          prev.action !== a.action ||
          prev.entity_type !== a.entity_type ||
          ACT_STANDALONE.has(a.entity_type || ""));
      if (breaks) flush();
      bucket.push(a);
    });
  flush();
  return groups;
}

/** Percentage of the engagement window that has elapsed (the overview progress bar). */
function elapsedPct(startISO: string, endISO: string): number {
  const start = Date.parse(startISO);
  const end = Date.parse(endISO);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  const pct = ((Date.now() - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function StormApp() {
  const [state, setStateRaw] = useState<StormState>(() => ({ ...initialState, sidebarCollapsed: window.matchMedia('(max-width: 1100px)').matches }));
  useEffect(() => {
    const query = window.matchMedia('(max-width: 1100px)');
    const sync = () => setStateRaw((current) => ({ ...current, sidebarCollapsed: query.matches }));
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  const sidebarCollapsed = state.sidebarCollapsed;
  const taskProjectRequest = useRef(0);
  const tasksListRequest = useRef(0);
  useEffect(() => {
    setStateRaw((s) => s.tasksCreatingKey ? { ...s, tasksCreatingKey: null } : s);
    return () => { taskProjectRequest.current += 1; };
  }, [state.nav, state.view, state.tasksOpenKey]);
  const [vulnerabilityRows, setVulnerabilityRows] = useState<ApiVulnerability[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<(() => Promise<void>) | null>(null);
  const [pendingDeleteLabel, setPendingDeleteLabel] = useState<string | null>(null);
  const endpointRequestVersion = useRef(0);
  const noteEditorVersion = useRef(0);
  const [deletingEndpointHosts, setDeletingEndpointHosts] = useState<number[]>([]);
  const setState = (patch: Partial<StormState> | ((s: StormState) => Partial<StormState>)) =>
    setStateRaw((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));
  const toggle = (k: keyof StormState) => setStateRaw((s) => ({ ...s, [k]: !s[k] }));

  // ---- logged-in user (real backend auth) ----
  const authUser = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const setUser = useAuthStore((s) => s.setUser);
  // 2FA берём из реального профиля, а не из локального состояния.
  const twoFAEnabled = !!authUser?.totp_enabled;
  const pushToast = useToastStore((s) => s.pushToast);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  // Subscribe so the whole app re-renders (and every t() re-evaluates) on switch.
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const navigate = useNavigate();
  const location = useLocation();
  const realUsername = authUser?.username || "";
  const realIsAdmin = authUser?.role === "admin";
  const me = realUsername;
  const meWsRole: WsRole = realIsAdmin ? "admin" : "user";
  const isAdmin = meWsRole === "admin";
  const canCreateProjects = isAdmin || authUser?.project_role === "lead";
  const meEmail = authUser?.email || "";
  const meDisplay = authUser?.full_name || realUsername;
  const meRoleLabel = meWsRole === "admin" ? t("Administrator") : t("User");
  const meId = String(authUser?.id ?? "");
  const meInitials = avatarLetter(realUsername || "U");

  // ================= avatar upload =================
  /* Mirrors the backend limits (UserService.upload_avatar): ≤5 MB, image only. */
  const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
  const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const clearAvatarPick = () => {
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setAvatarFile(null);
  };

  const onAvatarPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = ""; // позволяет выбрать тот же файл повторно после ошибки
    if (!file) return;
    if (!AVATAR_TYPES.includes(file.type)) {
      pushToast(t("Avatar must be a PNG, JPEG, WEBP or GIF image"), "error");
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      pushToast(t("Avatar exceeds the 5 MB limit"), "error");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const submitAvatar = async () => {
    if (!avatarFile || avatarUploading) return;
    setAvatarUploading(true);
    try {
      const updated = await apiUploadMyAvatar(avatarFile);
      setUser(updated); // avatar_url меняется → круги по всему интерфейсу обновятся
      clearAvatarPick();
      pushToast(t("Avatar updated"), "success");
    } catch (err) {
      pushToast(getApiErrorMessage(err, "Couldn't upload avatar"), "error");
    } finally {
      setAvatarUploading(false);
    }
  };

  /** Фото текущего пользователя; запасной вариант — первая буква логина. */
  const meAvatar = (size: number, fontPx: number, text: string, src: string | null = authUser?.avatar_url ?? null) =>
    <UserAvatar name={meDisplay} src={src} initials={text} size={size} fontSize={fontPx} />;

  /** Any request that 403s for the open project flips the no-access screen on. */
  const handleProjectError = (e: unknown, fallback: string) => {
    if (getApiErrorStatus(e) === 403 || getApiErrorStatus(e) === 404) {
      setStateRaw((s) => ({ ...s, accessDenied: true }));
      return;
    }
    pushToast(getApiErrorMessage(e, fallback), "error");
  };

  // ================= projects: load from backend =================
  const reloadProjects = () => setStateRaw((s) => ({ ...s, reloadTick: s.reloadTick + 1 }));
  // Доступен ли экспорт в AppSec (Works). Грузим один раз; если выключено —
  // AppSec-поля проекта и кнопка экспорта в находке не показываются.
  useEffect(() => {
    let active = true;
    apiGetWorksConfig()
      .then((cfg) => { if (active) setState({ worksEnabled: cfg.enabled }); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setStateRaw((s) => ({ ...s, projectsLoading: true, projectsError: null }));
      try {
        const [res, stats] = await Promise.all([
          getProjects(1, 100),
          // Aggregate stats are best-effort: fall back to zeros rather than failing the list.
          getProjectStats().catch(() => [] as ProjectStats[]),
        ]);
        const statsById = new Map(stats.map((s) => [s.project_id, s]));
        const rows: ApiProjectRow[] = res.items.map((p) => {
          const st = statsById.get(p.id);
          return {
            id: p.id,
            name: p.name,
            status: p.status,
            startISO: p.start_date || "",
            endISO: p.end_date || "",
            createdISO: p.created_at || "",
            updated: p.updated_at,
            createdBy: p.created_by,
            openFindings: st?.open_findings ?? 0,
            totalFindings: st?.total_findings ?? 0,
            hostsCount: st?.hosts_count ?? 0,
            appsec_ticket_key: p.appsec_ticket_key ?? null,
            stsMissing: missingStsProjectFields(p),
          };
        });
        if (!cancelled) setStateRaw((s) => ({ ...s, apiProjects: rows, projectsLoading: false }));
      } catch (e) {
        if (!cancelled) setStateRaw((s) => ({ ...s, apiProjects: [], projectsError: getApiErrorMessage(e, "Couldn't load projects"), projectsLoading: false }));
      }
    })();
    return () => {
      cancelled = true;
    };

  }, [state.reloadTick]);

  /* ================= projects list: per-project "added at" timestamps =========
     The stat cards on the projects page chart real add-frequency, which needs
     each host's and each open finding's creation time — data the list endpoint
     does not carry. Fetch it lazily while the list is on screen, in bounded
     batches so a large workspace does not fire hundreds of requests at once, and
     cache by project id so switching tabs (or reopening the list) reuses it. */
  useEffect(() => {
    if (state.view !== "list" || state.nav !== "projects") return;
    const rows = state.apiProjects;
    if (!rows || rows.length === 0) return;
    const known = state.aggTimes ?? {};
    const need = rows.filter((r) => !(r.id in known));
    if (need.length === 0) return;

    let cancelled = false;
    void (async () => {
      const CONCURRENCY = 6;
      for (let i = 0; i < need.length && !cancelled; i += CONCURRENCY) {
        const batch = need.slice(i, i + CONCURRENCY);
        const settled = await Promise.all(
          batch.map(async (r) => {
            // Best-effort per project: a 403/404 on one project must not blank the
            // whole card — that project simply contributes no points.
            const [hostTimes, vulnsRes] = await Promise.all([
              apiGetHostCreationTimes(r.id).catch(() => [] as string[]),
              apiGetVulnerabilities(r.id).catch(() => null),
            ]);
            const hosts = hostTimes;
            const openVulns = (vulnsRes?.items ?? [])
              .filter((v) => (VSTATUS_OPEN as readonly string[]).includes(v.status))
              .map((v) => v.created_at);
            return [r.id, { hosts, openVulns }] as const;
          })
        );
        if (cancelled) return;
        setStateRaw((s) => ({ ...s, aggTimes: { ...(s.aggTimes ?? {}), ...Object.fromEntries(settled) } }));
      }
    })();
    return () => {
      cancelled = true;
    };

  }, [state.apiProjects, state.view, state.nav]);

  /* ================= workspace users: load from backend =================
     `GET /users` is admin-only, so this must not run for anyone else: it would
     403 and pop a "Insufficient permissions" toast on every page (that is what showed
     up while simply sitting on the Activity tab). `project_role` is a global
     user attribute and the workspace members page is where it is configured. */
  const reloadUsers = () => setStateRaw((s) => ({ ...s, usersTick: s.usersTick + 1 }));
  const shownMailErrors = useRef(new Set<string>());
  useEffect(() => {
    if (state.view !== "workspaceMembers") return;
    const timer = setInterval(reloadUsers, 15000);
    return () => clearInterval(timer);
  }, [state.view]);
  useEffect(() => {
    if (state.view !== "workspaceMembers") return;
    for (const invitation of state.pendingInvites) {
      if (!invitation.email_error) continue;
      const key = `${invitation.id}:${invitation.email_error}`;
      if (shownMailErrors.current.has(key)) continue;
      shownMailErrors.current.add(key);
      pushToast(t(errorMessageForCode(invitation.email_error_code) ?? ERROR_MESSAGES.mail_unavailable), "error");
    }
  }, [state.pendingInvites, state.view]);

  useEffect(() => {
    if (!isAdmin) {
      setStateRaw((s) => (s.workspaceUsers.length === 0 && s.pendingInvites.length === 0 ? s : { ...s, workspaceUsers: [], pendingInvites: [] }));
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        // Активные пользователи и незавершённые приглашения грузим вместе —
        // и то и другое показывается на странице участников (invite-flow).
        const [res, invites] = await Promise.all([getUsers(1, 200), apiGetInvitations()]);
        const rows: WorkspaceUser[] = res.items.map((u) => ({
          id: u.id,
          key: u.username,
          name: u.username,
          email: u.email,
          role: u.role === "admin" ? "admin" : "user",
          projectRole: u.project_role,
          locked: u.is_locked,
          avatarUrl: u.avatar_url,
        }));
        if (!cancelled) setStateRaw((s) => ({ ...s, workspaceUsers: rows, pendingInvites: invites }));
      } catch (e) {
        // Best-effort: keep the list empty rather than breaking the app.
        if (!cancelled) {
          setStateRaw((s) => ({ ...s, workspaceUsers: [], pendingInvites: [] }));
          pushToast(getApiErrorMessage(e, "Couldn't load users"), "error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.usersTick, isAdmin]);

  // ================= hosts: load from backend =================
  /* Endpoints are fetched up-front alongside the list because the Recon →
     Endpoints view aggregates them across every host, so loading them lazily on
     row expand would leave that view permanently empty. */
  const reloadHosts = () => setStateRaw((s) => ({ ...s, hostsTick: s.hostsTick + 1 }));
  useEffect(() => {
    const pid = state.openProjectId;
    if (pid == null) {
      setStateRaw((s) => (s.apiHosts === null && !s.hostsLoading ? s : { ...s, apiHosts: null, hostsLoading: false, hiddenIps: [] }));
      return;
    }
    let cancelled = false;
    // Скрытые IP грузим параллельно списку хостов — вкладка IP фильтрует по ним.
    void (async () => {
      try {
        const hidden = await apiGetHiddenIps(pid);
        if (!cancelled) setStateRaw((s) => ({ ...s, hiddenIps: hidden }));
      } catch {
        if (!cancelled) setStateRaw((s) => (s.hiddenIps.length === 0 ? s : { ...s, hiddenIps: [] }));
      }
    })();
    void (async () => {
      setStateRaw((s) => ({ ...s, hostsLoading: true }));
      try {
        // Эндпоинты теперь приезжают прямо в списке хостов (бэкенд батч-грузит их
        // одним selectinload-запросом), поэтому деталь на каждый хост больше НЕ дёргаем
        // — это убирает N+1 (раньше — отдельный запрос на каждый из сотен хостов).
        const res = await apiGetHosts(pid);
        const rows = res.items.map((h) =>
          toStormHost(h, (h.endpoints ?? []).map((e) => ({ id: e.id, m: toStormMethod(e.method), p: e.path }))),
        );
        if (!cancelled) setStateRaw((s) => ({ ...s, apiHosts: rows, hostsLoading: false }));
      } catch (e) {
        if (!cancelled) {
          setStateRaw((s) => ({ ...s, apiHosts: [], hostsLoading: false }));
          handleProjectError(e, "Couldn't load hosts");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.openProjectId, state.hostsTick]);

  // ================= JS files: backend-loaded, refreshed by jsTick =================
  const reloadJsFiles = () => setStateRaw((s) => ({ ...s, jsTick: s.jsTick + 1 }));
  const lastJsReloadRef = useRef(0);
  const reloadJsFilesThrottled = () => {
    const now = Date.now();
    if (now - lastJsReloadRef.current < 4000) return;
    lastJsReloadRef.current = now;
    reloadJsFiles();
  };
  useEffect(() => {
    const pid = state.openProjectId;
    if (pid == null) {
      setStateRaw((s) => (s.apiJsFiles === null ? s : { ...s, apiJsFiles: null }));
      return;
    }
    let cancelled = false;
    // Стримим JS-файлы страницами и склеиваем накопитель: список появляется
    // сразу после первой страницы и доливается, вместо одного ответа на тысячи
    // файлов (каждый со своими secrets/endpoints). Каждая страница ЗАМЕНЯЕТ
    // apiJsFiles накопленным срезом — идемпотентно даже при рефетче по jsTick.
    void (async () => {
      const PAGE = 200;
      const acc: ApiJsFile[] = [];
      let page = 1;
      let first = true;
      for (;;) {
        let res;
        try {
          res = await apiGetJsFilesPage(pid, page, PAGE);
        } catch {
          if (first && !cancelled) setStateRaw((s) => ({ ...s, apiJsFiles: [] }));
          return;
        }
        if (cancelled) return;
        acc.push(...res.items);
        const snapshot = acc.slice();
        setStateRaw((s) => (s.openProjectId === pid ? { ...s, apiJsFiles: snapshot } : s));
        first = false;
        if (res.items.length < PAGE || page >= (res.pages || 1)) break;
        page++;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.openProjectId, state.jsTick]);

  /* Completion toast for a finished host/IP probe. Reused by the poll effect and
     by the submit handlers when the server closes the job immediately (nothing new
     to probe — every target was already added). Added = new targets probed this
     run; skipped = already-present targets left untouched. */
  const hostFarmDoneToast = (r: NonNullable<ApiHostFarmJob["result"]>) => {
    const added = r.hosts_created + r.hosts_updated;
    const skipped = r.hosts_skipped ? `, ${r.hosts_skipped} ${t("skipped")}` : "";
    pushToast(
      `${t("Probe done")} — ${added} ${t("added")}${skipped}, ${r.hosts_online} ${t("up")}, ${r.hosts_offline} ${t("down")}`,
      "success",
    );
  };
  const ipFarmDoneToast = (r: NonNullable<ApiIpFarmJob["result"]>) => {
    const promoted = r.hosts_promoted ? `, ${r.hosts_promoted} ${t("hosts")}` : "";
    const skipped = r.ips_skipped ? `, ${r.ips_skipped} ${t("skipped")}` : "";
    pushToast(
      `${t("Probe done")} — ${r.ips_created} ${t("IPs")}${skipped}, ${r.hostnames_found} ${t("hostnames")}${promoted}`,
      "success",
    );
  };

  useReconJobPolling(state.hostFarmJob, state.openProjectId, {
    load: apiGetHostFarmJob,
    update: (next) => {
      reloadHosts();
      setStateRaw((s) => (s.hostFarmJob?.id === next.id ? { ...s, hostFarmJob: isFarmJobInFlight(next.status) ? next : null } : s));
      if (next.status === "done" && next.result) { hostFarmDoneToast(next.result); }
      else if (next.status === "failed") pushToast(t("The check could not be completed. Try starting it again."), "error");
    },
    retry: () => setStateRaw((s) => s.hostFarmJob ? { ...s, hostFarmJob: { ...s.hostFarmJob } } : s),
    error: (error) => pushToast(getApiErrorMessage(error, "The check could not be completed. Try starting it again."), "error"),
  });

  useReconJobPolling(state.ipFarmJob, state.openProjectId, {
    load: apiGetIpFarmJob,
    update: (next) => {
      reloadHosts();
      setStateRaw((s) => (s.ipFarmJob?.id === next.id ? { ...s, ipFarmJob: isFarmJobInFlight(next.status) ? next : null } : s));
      if (next.status === "done" && next.result) { ipFarmDoneToast(next.result); }
      else if (next.status === "failed") pushToast(t("The check could not be completed. Try starting it again."), "error");
    },
    retry: () => setStateRaw((s) => s.ipFarmJob ? { ...s, ipFarmJob: { ...s.ipFarmJob } } : s),
    error: (error) => pushToast(getApiErrorMessage(error, "The check could not be completed. Try starting it again."), "error"),
  });

  useReconJobPolling(state.jsFarmJob, state.openProjectId, {
    load: apiGetJsScanJob,
    update: (next) => {
      if (isFarmJobInFlight(next.status)) reloadJsFilesThrottled(); else reloadJsFiles();
      setStateRaw((s) => (s.jsFarmJob?.id === next.id ? { ...s, jsFarmJob: isFarmJobInFlight(next.status) ? next : null } : s));
      if (next.status === "done" && next.result) { pushToast(`${t("Scan done")} — ${next.result.files_scanned} JS, ${next.result.secrets_found} ${t("secrets")}, ${next.result.endpoints_found} ${t("paths")}`, "success"); }
      else if (next.status === "failed") pushToast(t("The check could not be completed. Try starting it again."), "error");
    },
    retry: () => setStateRaw((s) => s.jsFarmJob ? { ...s, jsFarmJob: { ...s.jsFarmJob } } : s),
    error: (error) => pushToast(getApiErrorMessage(error, "The check could not be completed. Try starting it again."), "error"),
  });

  /** Hosts rendered by the whole Recon section. Backend-only — never the seed. */
  const hosts: Host[] = state.apiHosts ?? [];
  const hostIndex = useMemo(() => buildHostIndex(hosts), [hosts]);
  /* Subdomains are not a stored field — they are simply the project's other hosts
     that live under this one's name (www.acme.com under acme.com). Derived here so
     the tree reflects the real host list instead of a parallel, hand-kept one. */
  const subdomainsOf = (host: Host): Host[] =>
    hostIndex.descendants.get(host.id) ?? [];

  // ================= members: load from backend =================
  const reloadMembers = () => setStateRaw((s) => ({ ...s, membersTick: s.membersTick + 1 }));
  useEffect(() => {
    const pid = state.openProjectId;
    if (pid == null) {
      setStateRaw((s) => (s.apiMembers === null ? s : { ...s, apiMembers: null }));
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        // Readable by every project member (require_project_access) — a 403 here
        // means no access to the project at all, so it raises the no-access screen.
        const rows = await apiGetProjectMembers(pid);
        if (!cancelled) setStateRaw((s) => ({ ...s, apiMembers: rows.map(toStormMember) }));
      } catch (e) {
        if (!cancelled) {
          setStateRaw((s) => ({ ...s, apiMembers: [] }));
          handleProjectError(e, "Couldn't load members");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.openProjectId, state.membersTick]);

  // ================= vulnerabilities: load from backend =================
  // Host links arrive with the page. A host refresh only updates names locally;
  // it must not reload the finding list or fan out one HTTP request per row.
  const reloadVulns = () => setStateRaw((s) => ({ ...s, vulnsTick: s.vulnsTick + 1 }));
  useEffect(() => {
    const pid = state.openProjectId;
    if (pid == null) {
      setVulnerabilityRows(null);
      setStateRaw((s) => (s.apiVulns === null ? s : { ...s, apiVulns: null }));
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await apiGetVulnerabilities(pid);
        if (!cancelled) setVulnerabilityRows(res.items);
      } catch (e) {
        if (!cancelled) {
          setVulnerabilityRows([]);
          setStateRaw((s) => ({ ...s, apiVulns: [] }));
          handleProjectError(e, "Couldn't load vulnerabilities");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.openProjectId, state.vulnsTick]);

  useEffect(() => {
    if (vulnerabilityRows === null) return;
    const hostNames = new Map((state.apiHosts ?? []).map((host) => [host.id, host.host]));
    const rows = vulnerabilityRows
      .filter((v) => v.project_id === state.openProjectId)
      .map((v) => toStormVuln(v, v.affected_host_id == null ? "" : hostNames.get(v.affected_host_id) ?? ""));
    setStateRaw((s) => ({ ...s, apiVulns: rows }));
  }, [vulnerabilityRows, state.apiHosts, state.openProjectId]);

  // ================= notes: load from backend =================
  const reloadNotes = () => setStateRaw((s) => ({ ...s, notesTick: s.notesTick + 1 }));
  useEffect(() => {
    const pid = state.openProjectId;
    if (pid == null) {
      setStateRaw((s) => (s.apiNotes === null ? s : { ...s, apiNotes: null }));
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const rows = await apiListProjectNotes(pid);
        if (!cancelled) setStateRaw((s) => ({ ...s, apiNotes: rows.map(toStormNote) }));
      } catch (e) {
        if (!cancelled) {
          setStateRaw((s) => ({ ...s, apiNotes: [] }));
          handleProjectError(e, "Couldn't load notes");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.openProjectId, state.notesTick]);

  // ================= credentials: load from backend =================
  const reloadCreds = () => setStateRaw((s) => ({ ...s, credsTick: s.credsTick + 1 }));
  useEffect(() => {
    const pid = state.openProjectId;
    if (pid == null) {
      setStateRaw((s) => (s.apiCreds === null ? s : { ...s, apiCreds: null, revealedCredIds: [] }));
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const rows = await apiListProjectCredentials(pid);
        if (!cancelled) setStateRaw((s) => ({ ...s, apiCreds: rows.map(toStormCred) }));
      } catch (e) {
        if (!cancelled) {
          setStateRaw((s) => ({ ...s, apiCreds: [] }));
          handleProjectError(e, "Couldn't load credentials");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.openProjectId, state.credsTick]);

  // ================= notifications: live updates and reconnect catch-up =================
  useEffect(() => {
    let cancelled = false;
    const stop = subscribeNotificationUpdates(async () => {
      const res = await apiListNotifications();
      if (!cancelled) setStateRaw((s) => ({ ...s, notifs: res.items }));
    });
    return () => { cancelled = true; stop(); };
  }, []);

  // ================= current project detail =================
  /* `d` is assembled from the collections loaded above — it is a view over real
     backend state, not a store. Nothing mutates it: every edit calls the API and
     bumps the matching `*Tick` to reload. */
  const projRow = state.apiProjects?.find((p) => p.id === state.openProjectId) ?? null;
  const projName = projRow?.name ?? "";
  const stsMissing = projRow?.stsMissing ?? ["AppSec ticket", "Assignee", "Affected versions", "Product code", "Component"];
  const canExportSts = projRow != null && stsMissing.length === 0;
  const stsExportHint = canExportSts ? t("Export to Task Tracker") : t("Complete project details to export. Missing: {fields}", { fields: stsMissing.map((field) => t(field)).join(", ") });
  const canExportFinding = (severity?: Severity) => canExportSts && severity != null && severity !== "unrealized";
  const findingExportHint = (severity?: Severity) => severity === "unrealized" ? t("Unrealized findings are not exported to Task Tracker") : stsExportHint;
  const d: ProjectDetail = {
    status: projRow && (projRow.status === "archived" || projRow.status === "completed") ? "archived" : "active",
    start: toDispDate(projRow?.startISO),
    end: toDispDate(projRow?.endISO),
    progress: elapsedPct(projRow?.startISO ?? "", projRow?.endISO ?? ""),
    title: projName,
    hosts,
    members: state.apiMembers ?? [],
    vulns: state.apiVulns ?? [],
    notes: state.apiNotes ?? [],
    creds: state.apiCreds ?? [],
  };

  // ================= role model / access control =================
  // Project visibility (rule 1.1) is enforced by the backend — getProjects only
  // returns projects the caller may see, and the detail endpoints 403 otherwise.
  const isProjectCreator = projRow != null && authUser != null && projRow.createdBy === authUser.id;
  /** The lead role is global (User.project_role); it only unlocks anything inside a project the user belongs to. */
  const isProjectLead = authUser?.project_role === "lead" && (state.apiMembers ?? []).some((m) => m.id === authUser.id);
  /** Любой участник проекта (в т.ч. простой пентестер) — он есть в списке apiMembers. */
  const isProjectMember = authUser != null && (state.apiMembers ?? []).some((m) => m.id === authUser.id);
  /** Rule 1.2 — управлять составом команды (add/remove) могут только админ / создатель / лид.
      Бэкенд — источник истины (ensure_can_manage_members), это лишь прячет кнопки. */
  const canManageMembers = isAdmin || isProjectCreator || isProjectLead;
  /** Видеть список участников может любой участник проекта — но только смотреть, без управления. */
  const canViewMembers = canManageMembers || isProjectMember;
  /** Карточку проекта может редактировать любой участник; удаление — только менеджеры. */
  const canEditProject = canManageMembers || isProjectMember;
  /* In the projects list there is no membership loaded per row, but a non-admin
     only ever receives projects they belong to (rule 1.1) — so a listed row plus
     the global lead role already means "lead of a project I'm in". */
  const canDeleteProjectRow = (row: ApiProjectRow) =>
    isAdmin || (authUser != null && row.createdBy === authUser.id) || authUser?.project_role === "lead";

  // ================= navigation =================
  // Возврат к списку обязан сбрасывать открытый проект — иначе состояние всё ещё
  // «в проекте», и URL может залипнуть на /projects/{id}.
  const selProjects = () =>
    setState({
      nav: "projects",
      view: "list",
      openProjectId: null,
      section: "overview",
      expanded: [],
      openVulnId: null,
      openNoteId: null,
      openHostId: null,
      openIp: null,
    });
  const openProject = (id: number) =>
    setState({ view: "detail", openProjectId: id, section: "overview", expanded: [], openVulnId: null, openNoteId: null, accessDenied: false });
  const openProfile = () => setState({ view: "profile", userMenuOpen: false, profileTab: "account" });
  const selWSMembers = () => setState({ nav: "members", view: "workspaceMembers" });
  /* Project activity, not the global audit log: /projects/{id}/activity is scoped to
     the project and readable by every member, while /audit-logs stays admin-only. */
  const reloadActivity = () => setStateRaw((s) => ({ ...s, activityTick: s.activityTick + 1 }));
  const loadActivity = (pid: number) => {
    setStateRaw((s) => ({ ...s, activityLoading: true, activityError: null }));
    void (async () => {
      try {
        const items = await apiGetProjectActivity(pid, 50);
        setStateRaw((s) => ({ ...s, activity: items, activityLoading: false }));
      } catch (e) {
        if (getApiErrorStatus(e) === 403 || getApiErrorStatus(e) === 404) {
          setStateRaw((s) => ({ ...s, activity: [], activityLoading: false, accessDenied: true }));
          return;
        }
        setStateRaw((s) => ({ ...s, activity: [], activityError: getApiErrorMessage(e, "Couldn't load activity"), activityLoading: false }));
      }
    })();
  };
  /** A section tab always lands on that section's list, never on a card left open in it. */
  /* Leaving Recon resets its sub-view, so coming back later opens on Hosts
     instead of restoring whichever list was picked several sections ago. */
  /* Leaving a section abandons the full-page forms that live inside it (export,
     "Add hosts") — otherwise coming back would drop the user into a stale form
     instead of the list they asked for. */
  const setSection = (s: SectionId) =>
    setState({ section: s, ...(s === "hosts" ? {} : { reconView: "hosts" as ReconView }), reconMenuOpen: false, openVulnId: null, openNoteId: null, noteEditorOpen: false, openJsFileId: null, openJsHost: null, exportPageOpen: false, hostImportOpen: false, ipImportOpen: false, epImportOpen: false, jsScanSetupOpen: false });
  const selRecon = (v: ReconView) => setState({ section: "hosts", reconView: v, reconMenuOpen: false, openHostId: null, openIp: null, openJsFileId: null, openJsHost: null, exportPageOpen: false, hostImportOpen: false, ipImportOpen: false, epImportOpen: false, jsScanSetupOpen: false });

  /* ---- URL ↔ navigation-state sync (deep links to sections / projects) ----
     Two effects mirror each other: URL → state, and state → URL. They must never
     both act on the same change, because the second one always runs with the
     state of the render it was scheduled in — i.e. the *old* state:

     - On mount that state is `initialState` (projects list), so URL → state must
       win or the deep link gets overwritten with "/projects" (navSyncMounted).
     - On browser Back the URL changes first; state → URL then still sees the
       previous screen and navigates straight back *forward*, so Back appears
       dead and history grows on every press (adoptingUrlRef).

     Whoever changed first wins; the other side stands down for that one run. */
  const adoptingUrlRef = useRef(false);
  useEffect(() => {
    if (location.pathname === "/my-tasks") { navigate("/projects", { replace: true }); return; }
    const patch = navStateFromPath(location.pathname);
    const keys = Object.keys(patch) as (keyof StormState)[];
    // `state` here is the render the URL change arrived in — comparing against it
    // tells us whether this is an external navigation we still have to adopt.
    if (!keys.some((k) => state[k] !== patch[k])) return;
    adoptingUrlRef.current = true;
    setStateRaw((s) => ({ ...s, ...patch }));
    // Deps are the pathname alone on purpose: this must fire only when the URL
    // moves. Adding `state` would re-run it on every state change and re-apply
    // the old URL over a navigation the user just made.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  const navSyncMounted = useRef(false);
  useEffect(() => {
    if (!navSyncMounted.current) {
      navSyncMounted.current = true;
      return;
    }
    if (adoptingUrlRef.current) {
      adoptingUrlRef.current = false;
      return;
    }
    const p = pathFor({
      view: state.view,
      nav: state.nav,
      openProjectId: state.openProjectId,
      section: state.section,
      reconView: state.reconView,
      profileTab: state.profileTab,
      openVulnId: state.openVulnId,
      openNoteId: state.openNoteId,
      openHostId: state.openHostId,
      openIp: state.openIp,
      openJsFileId: state.openJsFileId,
      tasksOpenKey: state.tasksOpenKey,
    });
    if (p !== location.pathname) navigate(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.view, state.nav, state.openProjectId, state.section, state.reconView, state.profileTab, state.openVulnId, state.openNoteId, state.openHostId, state.openIp, state.openJsFileId, state.tasksOpenKey, location.pathname]);

  /* Tasks: сортировка/фильтры запрашивают новую порцию, сохраняя текущую таблицу
     до ответа. Загрузчик заменяет строки только при первом открытии страницы. */
  const loadTasks = (append = false, refresh = false) => {
    if (append && (state.tasksLoading || !state.tasksNextPage)) return;
    const request = ++tasksListRequest.current;
    const page = append ? Number(state.tasksNextPage) : 0;
    const hadRows = state.tasksRows !== null;
    setState({ tasksLoading: true, tasksRefreshing: refresh, tasksError: null });
    void (async () => {
      try {
        const res = await apiGetTasks({ page_number: page, category: state.tasksTab, sort: state.tasksSort,
          ...(state.tasksQuery.trim() ? { query: state.tasksQuery.trim() } : {}), ...(refresh ? { refresh: true } : {}) });
        if (request !== tasksListRequest.current) return;
        setStateRaw((s) => ({ ...s,
          tasksRows: append ? [...new Map([...(s.tasksRows ?? []), ...res.items].map((task) => [task.key, task])).values()] : res.items,
          tasksNextPage: res.next_page_token, tasksTotal: res.total ?? null,
          tasksActiveTotal: res.active_total ?? null, tasksClosedTotal: res.closed_total ?? null,
          tasksLoading: false, tasksRefreshing: false }));
      } catch (e) {
        if (request !== tasksListRequest.current) return;
        const message = getApiErrorMessage(e, "Couldn't load tasks from Task Tracker");
        if (append || hadRows) {
          setState({ tasksLoading: false, tasksRefreshing: false });
          pushToast(message, "error");
        } else setStateRaw((s) => ({ ...s, tasksRows: [], tasksNextPage: null, tasksTotal: null,
          tasksLoading: false, tasksRefreshing: false, tasksError: message }));
      }
    })();
  };
  const reloadTasks = () => loadTasks(false, true);
  useEffect(() => {
    if (!(state.view === "list" && state.nav === "tasks" && !state.tasksOpenKey)) return;
    const timer = window.setTimeout(() => loadTasks(), state.tasksQuery.trim() ? 250 : 0);
    return () => { window.clearTimeout(timer); tasksListRequest.current += 1; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.view, state.nav, state.tasksOpenKey, state.tasksTab, state.tasksSort, state.tasksQuery]);
  // Карточка задачи: грузим полную инфу по открытому ключу (deep-linkable).
  useEffect(() => {
    if (!(state.view === "list" && state.nav === "tasks" && state.tasksOpenKey)) return;
    const key = state.tasksOpenKey;
    setState({ tasksDetailLoading: true, tasksDetailError: null, tasksDetail: null });
    let cancelled = false;
    void (async () => {
      try {
        const detail = await apiGetTask(key);
        if (!cancelled) setStateRaw((s) => (s.tasksOpenKey === key ? { ...s, tasksDetail: detail, tasksDetailLoading: false } : s));
      } catch (e) {
        if (!cancelled) setStateRaw((s) => (s.tasksOpenKey === key ? { ...s, tasksDetailLoading: false, tasksDetailError: getApiErrorStatus(e) === 404 ? "Ticket not found" : getApiErrorMessage(e, "Couldn't load this task") } : s));
      }
    })();
    return () => { cancelled = true; };
  }, [state.view, state.nav, state.tasksOpenKey]);
  /* Loaded as soon as the project opens, like every other collection — the tab's
     counter has to be right before the tab is ever visited. Entering the tab
     re-fetches, since the feed is a shared audit trail that others add to. */
  useEffect(() => {
    if (state.openProjectId != null) loadActivity(state.openProjectId);
    else setStateRaw((s) => (s.activity === null ? s : { ...s, activity: null }));
  }, [state.openProjectId, state.activityTick]);
  useEffect(() => {
    if (state.view === "detail" && state.section === "activity" && state.openProjectId != null) reloadActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.view, state.section]);
  // Leaving a project clears a previous 403 so the next one starts from a clean slate.
  useEffect(() => {
    setStateRaw((s) => (s.accessDenied ? { ...s, accessDenied: false } : s));
  }, [state.openProjectId]);
  /* Deep link (/projects/{p}/vulns/{v}, e.g. from a notification): the URL sets
     openVulnId before the findings have loaded, so the edit form is filled in
     once the matching finding arrives. */
  useEffect(() => {
    if (state.openVulnId == null || state.apiVulns == null) return;
    const v = state.apiVulns.find((x) => x.id === state.openVulnId);
    if (!v) return;
    setStateRaw((s) => (s.vulnDetailForm.title === v.title ? s : { ...s, vulnDetailForm: vulnFormFrom(v) }));

  }, [state.openVulnId, state.apiVulns]);

  // Вложения открытой уязвимости: грузим при открытии карточки, чистим при закрытии.
  useEffect(() => {
    const pid = state.openProjectId;
    const vid = state.openVulnId;
    if (pid == null || vid == null) {
      setStateRaw((s) => (s.vulnFiles.length === 0 ? s : { ...s, vulnFiles: [] }));
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const files = await apiListVulnFiles(pid, vid);
        if (!cancelled) setStateRaw((s) => ({ ...s, vulnFiles: files }));
      } catch {
        if (!cancelled) setStateRaw((s) => ({ ...s, vulnFiles: [] }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.openVulnId, state.openProjectId]);

  /* Esc dismisses the frontmost open overlay, mirroring a backdrop click. Modals
     and the notifications panel each carry their own onClose on `.modalback` /
     `.notifback`, so clicking the topmost open one (highest z-index) closes that
     layer alone and leaves anything beneath it — any modal following the shared
     pattern is covered without touching this. The user menu has no backdrop of
     its own, so it's dismissed by flag. */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const open = Array.from(
        document.querySelectorAll<HTMLElement>(".modalback.open, .notifback.open")
      );
      if (open.length) {
        open
          .reduce((top, el) =>
            (parseInt(getComputedStyle(el).zIndex) || 0) >= (parseInt(getComputedStyle(top).zIndex) || 0) ? el : top
          )
          .click();
        return;
      }
      setStateRaw((s) => (s.userMenuOpen || s.reconMenuOpen ? { ...s, userMenuOpen: false, reconMenuOpen: false } : s));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // ================= projects list (backend-backed) =================
  /** The backend rejects this too (422) — checked here so the form says so before submitting. */
  const datesInvalid = (startISO: string, endISO: string) => !!startISO && !!endISO && endISO < startISO;
  const DATES_ERROR = "Start date can't be after end date";

  const emptyProjectDraft = () => ({ newName: "", newStart: "", newEnd: "", newNameError: false, newAppsec: emptyAppsecFields() });
  const openNewProject = () => {
    if (!canCreateProjects) return;
    taskProjectRequest.current += 1;
    setState({ ...emptyProjectDraft(), modalOpen: true });
  };
  const closeNewProject = () => {
    taskProjectRequest.current += 1;
    setState({ ...emptyProjectDraft(), modalOpen: false });
  };

  const createProject = async () => {
    if (!canCreateProjects) return;
    const name = state.newName.trim();
    if (!name) {
      // Не закрываем модалку — подсвечиваем обязательное поле красным.
      setState({ newNameError: true });
      pushToast(t("Please fill in the required fields"), "error");
      return;
    }
    if (datesInvalid(state.newStart, state.newEnd)) {
      pushToast(t(DATES_ERROR), "error");
      return;
    }
    try {
      const created = await apiCreateProject({
        name,
        start_date: state.newStart || undefined,
        end_date: state.newEnd || undefined,
        ...state.newAppsec,
      });
      // Сброс формы + редирект на страницу созданного проекта.
      setState({
        ...emptyProjectDraft(), modalOpen: false,
        tab: "active", nav: "projects", view: "detail", openProjectId: created.id, section: "overview",
        expanded: [], openVulnId: null, openNoteId: null, accessDenied: false,
      });
      reloadProjects();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't create project"), "error");
    }
  };

  // ================= edit project =================
  // Opened from a list row → targets a real backend project (projEditId set).
  // AppSec-поля (компонент/версия/исполнитель) не входят в список-строку — при
  // открытии редактора догружаем их из проекта, если включён Works.
  const loadProjAppsec = (id: number | null) => {
    if (!id) return;
    void apiGetProject(id)
      .then((p) =>
        setState({
          projEditAppsec: {
            appsec_components: p.appsec_components?.length ? p.appsec_components : p.appsec_component_code ? [{ code: p.appsec_component_code, name: p.appsec_component_name || p.appsec_component_code }] : [],
            appsec_product_code: p.appsec_product_code ?? null,
            appsec_component_code: p.appsec_component_code,
            appsec_component_name: p.appsec_component_name,
            appsec_versions: p.appsec_versions?.length ? p.appsec_versions : p.appsec_version_code ? [{ code: p.appsec_version_code, name: p.appsec_version_name || p.appsec_version_code }] : [],
            appsec_assignee_name: p.appsec_assignee_name ?? null,
            appsec_assignee: p.appsec_assignee,
            appsec_ticket_url: p.appsec_ticket_url,
            appsec_ticket_key: p.appsec_ticket_key,
          },
        })
      )
      .catch(() => {});
  };
  const EMPTY_APPSEC: AppSecFieldsValue = { appsec_components: [], appsec_product_code: null, appsec_component_code: null, appsec_component_name: null, appsec_versions: [], appsec_assignee: null, appsec_assignee_name: null, appsec_ticket_url: null, appsec_ticket_key: null };
  const openProjEditRow = (row: ApiProjectRow) => {
    setState({
      projEditOpen: true,
      projEditId: row.id,
      projEditName: row.name,
      projEditStart: row.startISO,
      projEditEnd: row.endISO,
      projEditStatus: row.status,
      projEditAppsec: EMPTY_APPSEC,
    });
    loadProjAppsec(row.id);
  };
  // Opened from the project detail — targets the open project.
  const openProjEdit = () => {
    setState({
      projEditOpen: true,
      projEditId: state.openProjectId,
      projEditName: projRow?.name ?? "",
      projEditStart: projRow?.startISO ?? "",
      projEditEnd: projRow?.endISO ?? "",
      projEditStatus: projRow?.status ?? "active",
      projEditAppsec: EMPTY_APPSEC,
    });
    loadProjAppsec(state.openProjectId);
  };
  const closeProjEdit = () => setState({ projEditOpen: false });
  const saveProjEdit = async () => {
    const name = state.projEditName.trim();
    if (!name || !state.projEditId) {
      setState({ projEditOpen: false });
      return;
    }
    if (datesInvalid(state.projEditStart, state.projEditEnd)) {
      pushToast(t(DATES_ERROR), "error");
      return;
    }
    try {
      await apiUpdateProject(state.projEditId, {
        name,
        start_date: state.projEditStart || undefined,
        end_date: state.projEditEnd || undefined,
        status: state.projEditStatus,
        ...state.projEditAppsec,
      });
      setState({ projEditOpen: false });
      reloadProjects();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't save project"), "error");
    }
  };
  const askDeleteProject = (row: ApiProjectRow) => setState({ confirmOpen: true, confirmType: null, confirmProjectId: row.id, confirmLabel: row.name });

  // ================= export: Word reports =================
  /* Both reports are generated by the backend from the project's real data
     (ReportService.generate). `kind` is the backend's template id — "szi" and
     "pp" — surfaced under readable names. */
  const openExportModal = () => setState({ exportModalOpen: true, exportKind: "szi", exportScope: "report" });
  const closeExportModal = () => setState({ exportModalOpen: false });

  /* ---- recon exports (hosts / IPs / endpoints) ----
     The dialog exports exactly what the view's filters left on screen, so the
     filter row above the table is the selection UI — no second set of controls
     that could disagree with it. Generated client-side from data already loaded. */
  const downloadText = (text: string, filename: string, mime = "text/plain") => {
    const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const slug = (s: string) => (s.replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export").slice(0, 60);

  /** Non-empty, trimmed lines of the editable pane — what actually gets written. */
  const exportTextLines = (text: string): string[] => text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  /* The line format for every recon export: one row per host:port pair, so a row
     can be dropped without taking the rest of the host with it. A host with no
     known ports still contributes its bare name — otherwise it would vanish from
     an export that is supposed to list it. */
  const exportLinesFor = (scope: ExportScope): string[] => {
    if (scope === "js-endpoints" || scope === "js-secrets") {
      // Источник: открытая карточка файла → страница «все файлы хоста» → весь
      // отфильтрованный список. Так «Экспорт» на странице файла даёт ровно его
      // находки, а та же кнопка в списке — находки всего раздела.
      const src = _jsd ? [_jsd] : _jsHost ? jsFiles.filter((f) => f.host === _jsHost) : jsFilesFiltered;
      const out: string[] = [];
      const uniq = new Set<string>();
      for (const f of src) {
        // Вид и значение — табом: секрет может содержать что угодно, таб переживает grep и вставку в таблицу.
        const lines = scope === "js-endpoints" ? f.endpoints : f.secrets.map((sec) => `${sec.kind}\t${sec.match}`);
        for (const line of lines) {
          const v = line.trim();
          if (!v || uniq.has(v)) continue;
          uniq.add(v);
          out.push(v);
        }
      }
      return out;
    }
    if (scope === "ips") {
      // The row already carries the ports of every host sharing this address.
      return ipsRows.flatMap((r) => (r.ports.length ? r.ports.map((p) => `${r.ip}:${p.n}`) : [r.ip]));
    }
    if (scope === "endpoints") {
      // Only the endpoint URL — no method prefix.
      return endpointGroups.flatMap((g) => g.endpoints.map((e) => `https://${g.host}${e.p}`));
    }
    /* The table nests subdomains under their parent, so hostsList on its own would
       leave them out of the export. Expand every row with its subdomains and dedupe:
       a search flattens the tree, which already lists the subdomain in its own right,
       and subdomainsOf matches every descendant, so deeper trees repeat too. */
    const seen = new Set<number>();
    const rows: Host[] = [];
    const add = (x: Host) => {
      if (seen.has(x.id)) return;
      seen.add(x.id);
      rows.push(x);
    };
    hostsList.forEach(({ h }) => {
      // A parent can be on the list only because one of its subdomains matched the
      // pills — export it itself only when it matches them too.
      if (hostMatchesFilters(h)) add(h);
      visibleSubdomainsOf(h).forEach(add);
    });
    return rows.flatMap((h) => (h.ports.length ? h.ports.map((p) => `${h.host}:${p.n}`) : [h.host]));
  };

  /** Rebuilds the OpenAPI doc from the edited lines, so edits reach the JSON too. */
  const endpointLinesToOpenApi = (lines: string[]): string => {
    const paths: Record<string, Record<string, unknown>> = {};
    lines.forEach((line) => {
      // Export lines are now bare URLs; still accept a leading METHOD for
      // hand-edited lines. No method → default to GET.
      const parts = line.trim().split(/\s+/);
      const hasMethod = parts.length >= 2 && !/^https?:/i.test(parts[0]);
      const method = hasMethod ? parts[0] : "GET";
      const url = hasMethod ? parts[1] : parts[0];
      if (!url) return;
      let host: string;
      let path: string;
      try {
        const u = new URL(url);
        host = u.host;
        path = u.pathname;
      } catch {
        return; // a hand-edited line that is no longer a URL is skipped, not fatal
      }
      // OpenAPI keys by path, so the host goes into the operation's server list.
      paths[path] = paths[path] ?? {};
      paths[path][method.toLowerCase()] = {
        summary: `${method} ${path}`,
        servers: [{ url: `https://${host}` }],
        responses: { "200": { description: "OK" } },
      };
    });
    return JSON.stringify({ openapi: "3.0.3", info: { title: `${projName} — endpoints`, version: "1.0.0" }, paths }, null, 2);
  };

  const doReconExport = () => {
    const name = slug(projName);
    const lines = exportTextLines(state.exportText);
    if (state.exportScope === "endpoints" && state.exportFormat === "openapi") {
      downloadText(endpointLinesToOpenApi(lines), `${name}_endpoints.json`, "application/json");
    } else {
      const file =
        state.exportScope === "hosts" ? "hosts"
        : state.exportScope === "ips" ? "ips"
        : state.exportScope === "js-endpoints" ? "js_paths"
        : state.exportScope === "js-secrets" ? "js_secrets"
        : "endpoints";
      downloadText(lines.join("\n"), `${name}_${file}.txt`);
    }
    closeReconExport();
  };

  const openReconExport = (scope: ExportScope) =>
    setState({ exportPageOpen: true, exportScope: scope, exportFormat: "list", exportText: exportLinesFor(scope).join("\n") });
  const closeReconExport = () => setState({ exportPageOpen: false, exportText: "" });
  const doExport = async () => {
    const pid = state.openProjectId;
    if (pid == null) return;
    const kind = state.exportKind;
    setState({ exportBusy: true });
    try {
      const blob = kind === "szi" ? await apiDownloadCertificationReport(pid) : await apiDownloadAcceptanceReport(pid);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = blob instanceof File ? blob.name : `${projName || "report"}_${kind}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setState({ exportModalOpen: false, exportBusy: false });
    } catch (e) {
      setState({ exportBusy: false });
      pushToast(getApiErrorMessage(e, "Couldn't generate report"), "error");
    }
  };

  // ================= TaskTracker export =================
  /** Перечитывает метаданные проекта перед STS-экспортом.
   * При отсутствии тикета, исполнителя или версий показывает список полей
   * и возвращает false до обращения к интеграции.
   */
  const checkProjectForSts = async (projectId: number): Promise<boolean> => {
    try {
      const project = await apiGetProject(projectId);
      const missing = missingStsProjectFields(project);
      if (missing.length) {
        pushToast(t("Fill in project details. Missing: {fields}", { fields: missing.map((field) => t(field)).join(", ") }), "error");
        return false;
      }
      return true;
    } catch (error) {
      pushToast(getApiErrorMessage(error, "Couldn't load project"), "error");
      return false;
    }
  };
  // Экспорт находки в AppSec (Works): создаёт тикет bug_appsec в STS. Исполнитель,
  // компонент и версии берутся из проекта; сохранённая ссылка приходит со списком находок.

  const openTaskTrackerExport = async (vulnId: number) => {
    const pid = state.openProjectId;
    if (pid == null) return;
    if (d.vulns.find((finding) => finding.id === vulnId)?.sev === "unrealized") return;
    if (!await checkProjectForSts(pid)) return;
    setState({
      taskTrackerExportOpen: true,
      taskTrackerExportVulnId: vulnId,
      taskTrackerExportChecking: true,
      taskTrackerExportBusy: false,
      taskTrackerExportLink: null,
      taskTrackerExportError: null,
    });
    // TaskTracker настроена на уровне деплоя — проверяем только, не экспортирована ли уже находка.
    void apiGetVulnerabilityTaskTrackerLink(pid, vulnId)
      .catch(() => null)
      .then((link) => setState({ taskTrackerExportChecking: false, taskTrackerExportLink: link }));
  };
  const closeTaskTrackerExport = () => setState({ taskTrackerExportOpen: false });
  const doTaskTrackerExport = async () => {
    const pid = state.openProjectId;
    const vid = state.taskTrackerExportVulnId;
    if (pid == null || vid == null) return;
    setState({ taskTrackerExportBusy: true, taskTrackerExportError: null });
    try {
      const link = await apiExportVulnerabilityToTaskTracker(pid, vid);
      setState({ taskTrackerExportBusy: false, taskTrackerExportLink: link });
      reloadVulns();
      pushToast(t("Exported to Task Tracker: {issue}", { issue: link.task_tracker_issue_key || t("issue created") }), "success");
    } catch (e) {
      const msg = getApiErrorMessage(e, "Couldn't export to Task Tracker");
      setState({ taskTrackerExportBusy: false, taskTrackerExportError: msg });
      pushToast(msg, "error");
    }
  };

  // ---- Bulk export: every vulnerability currently listed (respecting filters) ----
  const openBulkTaskTracker = async () => {
    const pid = state.openProjectId;
    if (pid == null) return;
    if (!await checkProjectForSts(pid)) return;
    setState({
      taskTrackerBulkOpen: true,
      taskTrackerBulkRunning: false,
      taskTrackerBulkFinished: false,
      taskTrackerBulkDone: 0,
      taskTrackerBulkTotal: 0,
      taskTrackerBulkCreated: 0,
      taskTrackerBulkSkipped: 0,
      taskTrackerBulkFailed: 0,
      taskTrackerBulkProjectUrl: null,
    });
  };
  const closeBulkTaskTracker = () => {
    if (!state.taskTrackerBulkRunning) setState({ taskTrackerBulkOpen: false });
  };
  const doBulkTaskTrackerExport = async () => {
    const pid = state.openProjectId;
    if (pid == null) return;
    if (!await checkProjectForSts(pid)) return;
    const ids = vulns.filter((finding) => finding.sev !== "unrealized").map((v) => v.id);
    setState({ taskTrackerBulkRunning: true, taskTrackerBulkFinished: false, taskTrackerBulkTotal: ids.length, taskTrackerBulkDone: 0, taskTrackerBulkCreated: 0, taskTrackerBulkSkipped: 0, taskTrackerBulkFailed: 0 });
    let created = 0;
    let skipped = 0;
    let failed = 0;
    // Ссылку на TaskTracker-проект выводим из URL любой задачи: .../browse/STORM-29 -> .../browse/STORM
    let projectUrl: string | null = null;
    const rememberProjectUrl = (issueUrl?: string) => {
      if (projectUrl || !issueUrl) return;
      const m = issueUrl.match(/^(.*\/browse\/[A-Za-z][A-Za-z0-9_]*)-\d+/);
      if (m) projectUrl = m[1];
    };
    for (const id of ids) {
      try {
        const existing = await apiGetVulnerabilityTaskTrackerLink(pid, id).catch(() => null);
        if (existing && existing.status === "linked" && existing.task_tracker_issue_key) {
          skipped++;
          rememberProjectUrl(existing.task_tracker_issue_url);
        } else {
          const link = await apiExportVulnerabilityToTaskTracker(pid, id);
          created++;
          rememberProjectUrl(link.task_tracker_issue_url);
        }
      } catch {
        failed++;
      }
      setState((s) => ({ taskTrackerBulkDone: s.taskTrackerBulkDone + 1, taskTrackerBulkCreated: created, taskTrackerBulkSkipped: skipped, taskTrackerBulkFailed: failed }));
    }
    setState({ taskTrackerBulkProjectUrl: projectUrl });
    setState({ taskTrackerBulkRunning: false, taskTrackerBulkFinished: true });
    reloadVulns();
    pushToast(t("Task Tracker export finished — {created} created, {skipped} already linked, {failed} failed", { created, skipped, failed }), failed ? "warning" : "success");
  };

  // ================= detail: hosts / recon =================
  const toggleHost = (id: number) =>
    setState((s) => ({ expanded: s.expanded.includes(id) ? s.expanded.filter((x) => x !== id) : [...s.expanded, id] }));
  const openHostDetail = (id: number) => setState({ openHostId: id });
  const closeHostDetail = () => setState({ openHostId: null });
  const openIpDetail = (ip: string) => setState({ openIp: ip });
  const closeIpDetail = () => setState({ openIp: null });
  const toggleReconMenu = () => setState((s) => ({ reconMenuOpen: !s.reconMenuOpen }));

  const toggleEpGroup = (host: string) =>
    setState((s) => ({ epExpanded: s.epExpanded.includes(host) ? s.epExpanded.filter((x) => x !== host) : [...s.epExpanded, host] }));
  // JS groups share the epExpanded set, namespaced "js:host:<host>" so a host and
  // its JS group don't collide. Files no longer expand in place — a click opens
  // the file's own card, like hosts and IPs.
  const toggleJsGroup = (host: string) => {
    const key = `js:host:${host}`;
    setState((s) => ({ epExpanded: s.epExpanded.includes(key) ? s.epExpanded.filter((x) => x !== key) : [...s.epExpanded, key] }));
  };
  /** Deletes every JS finding of one host, after confirmation. */
  const deleteJsHost = (hostId: number | undefined, label: string) => {
    const pid = state.openProjectId;
    if (pid == null || hostId == null) return;
    setPendingDelete(() => async () => {
      try {
        await apiDeleteJsFilesForHost(pid, hostId);
        reloadJsFiles();
        pushToast(t("JS findings deleted"), "success");
      } catch (e) {
        pushToast(getApiErrorMessage(e, t("Delete failed")), "error");
      }
    });
    setState({ confirmOpen: true, confirmProjectId: null, confirmUserId: null, confirmLabel: `${t("JS files")}: ${label}` });
  };
  /* Starts the scan on exactly the domains left in the setup page's list — the
     backend takes that list verbatim (empty would fall back to every project
     domain, which the setup page exists to avoid), so an empty list is blocked. */
  const submitJsScan = async () => {
    const pid = state.openProjectId;
    if (pid == null) return;
    const domains = state.jsScanText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (domains.length === 0) {
      pushToast(t("Pick at least one domain to scan."), "error");
      return;
    }
    try {
      const job = await apiStartJsScan(pid, domains.join("\n"));
      setState({ jsFarmJob: job, jsScanSetupOpen: false });
      pushToast(`${t("Scanning")} ${job.targets_total ?? ""} ${t("domains…")}`.replace("  ", " "), "success");
    } catch (e) {
      pushToast(getApiErrorMessage(e, t("Couldn't start JS scan")), "error");
    }
  };
  /* Per-host (or whole-project) zip of the discovered .js. The files were never
     stored, so the backend re-downloads them on demand — this can take a moment
     and may skip files that no longer resolve. */
  const downloadJsArchive = async (hostId: number | undefined, label: string) => {
    const pid = state.openProjectId;
    if (pid == null) return;
    pushToast(t("Preparing JS archive…"), "success");
    try {
      const blob = await apiDownloadJsArchive(pid, hostId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `js-${(label || "project").replace(/[^a-zA-Z0-9._-]+/g, "_")}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      pushToast(getApiErrorMessage(e, t("Couldn't download JS archive.")), "error");
    }
  };
  /* The raw request is loaded from the endpoint itself — what was stored, not a
     made-up template. When it has never been filled in, a skeleton request line
     is offered as a starting point. The response has no backend field, so it
     starts empty and stays local. */
  const formatEndpointRequest = (endpoint: ApiEndpoint, host: string) => {
    const params = new URLSearchParams();
    for (const query of endpoint.query_params ?? []) params.append(query.name, query.value ?? "");
    const query = params.toString();
    const target = endpoint.path + (query ? `?${query}` : "");
    const headers = (endpoint.request_headers ?? []).filter((header) => !["host", "content-type"].includes(header.name.toLowerCase())).map((header) => `${header.name}: ${header.value}`);
    if (endpoint.request_content_type) headers.unshift(`Content-Type: ${endpoint.request_content_type}`);
    return [`${endpoint.method ?? "GET"} ${target} HTTP/1.1`, `Host: ${host}`, ...headers, "", endpoint.request_body ?? ""].join("\n").trimEnd();
  };
  const openEndpoint = (ep: { method: Method; path: string; host: string; hostId: number; endpointId: number }, projectId = state.openProjectId) => {
    const version = ++endpointRequestVersion.current;
    const raw = `${ep.method} ${ep.path} HTTP/1.1\nHost: ${ep.host}`;
    setState({ epOpen: true, epData: ep, epRequest: raw, epRequestOriginal: raw, epLoading: true, epSaving: false });
    const pid = projectId;
    if (pid == null) return;
    void (async () => {
      try {
        const list = await apiGetEndpoints(pid, ep.hostId);
        const stored = list.find((entry) => entry.id === ep.endpointId);
        const request = stored ? formatEndpointRequest(stored, ep.host) : raw;
        if (version === endpointRequestVersion.current) setState({ epRequest: request, epRequestOriginal: request });
      } catch (error) {
        if (version === endpointRequestVersion.current) pushToast(getApiErrorMessage(error, t("Couldn't load endpoint request")), "error");
      } finally {
        if (version === endpointRequestVersion.current) setState({ epLoading: false });
      }
    })();
  };
  const closeEndpoint = () => { endpointRequestVersion.current++; setState({ epOpen: false }); };
  /** Сохраняет изменённый HTTP-запрос; API извлекает из него метод и путь.
   * После успеха обновляет список и исходное значение редактора. При ошибке
   * введённый запрос остаётся доступен для исправления.
   */
  const saveEndpointRequest = async () => {
    const pid = state.openProjectId;
    if (pid == null || state.epSaving || state.epLoading || state.epRequest === state.epRequestOriginal) return;
    if (!state.epRequest.trim()) { pushToast(t("Enter an HTTP request"), "error"); return; }
    const version = endpointRequestVersion.current;
    const ep = state.epData;
    setState({ epSaving: true });
    try {
      const saved = await apiUpdateEndpoint(pid, ep.hostId, ep.endpointId, { request_raw: state.epRequest });
      const request = formatEndpointRequest(saved, ep.host);
      if (version === endpointRequestVersion.current) setState({ epData: { ...ep, method: toStormMethod(saved.method), path: saved.path }, epRequest: request, epRequestOriginal: request });
      reloadHosts();
      pushToast(t("Endpoint updated"), "success");
    } catch (error) {
      pushToast(getApiErrorMessage(error, t("Couldn't save endpoint")), "error");
    } finally {
      if (version === endpointRequestVersion.current) setState({ epSaving: false });
    }
  };
  const copyText = async (text: string, what: string) => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      pushToast(t("{item} copied to clipboard", { item: t(what) }), "success");
    } catch { pushToast(t("Clipboard unavailable"), "error"); }
  };
  const copyEndpointCurl = () => {
    const [head, ...body] = state.epRequest.replace(/\r\n/g, "\n").split("\n\n");
    const [line, ...headers] = head.split("\n");
    const match = /^(\S+)\s+(\S+)\s+HTTP\/\S+$/.exec(line);
    if (!match) { pushToast(t("Enter an HTTP request"), "error"); return; }
    const host = headers.find((header) => /^host\s*:/i.test(header))?.replace(/^host\s*:\s*/i, "") ?? state.epData.host;
    const quote = (value: string) => "'" + value.replace(/'/g, "'\"'\"'") + "'";
    const url = /^https?:\/\//i.test(match[2]) ? match[2] : `https://${host}${match[2]}`;
    const parts = [`curl -X ${match[1]} ${quote(url)}`, ...headers.filter((header) => !/^host\s*:/i.test(header)).map((header) => `-H ${quote(header)}`)];
    if (body.length) parts.push(`--data-raw ${quote(body.join("\n\n"))}`);
    void copyText(parts.join(" "), "cURL");
  };
  const requestCopyStyle: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", border: "1px solid var(--st-accent-2)", borderRadius: 8, background: "transparent", color: "var(--st-accent-2)", font: "700 12px Inter,sans-serif", cursor: "pointer" };
  const endpointSaveDisabled = state.epSaving || state.epLoading || state.epRequest === state.epRequestOriginal;

  /** Toggle whether one credential's secret is shown in clear text. */
  const toggleCredReveal = (id: number) =>
    setState((s) => ({
      revealedCredIds: s.revealedCredIds.includes(id) ? s.revealedCredIds.filter((x) => x !== id) : [...s.revealedCredIds, id],
    }));
  const copyCurl = (ep: { method: Method; path: string; host: string }) => {
    try {
      void navigator.clipboard?.writeText(`curl -X ${ep.method} 'https://${ep.host}${ep.path}'`);
      pushToast(t("cURL copied"), "success");
    } catch {
      /* clipboard unavailable */
    }
  };
  const deleteEndpoint = async (hostId: number, endpointId: number) => {
    const pid = state.openProjectId;
    if (pid == null) return;
    try {
      await apiDeleteEndpoint(pid, hostId, endpointId);
      reloadHosts();
      pushToast(t("Endpoint deleted"), "success");
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't delete endpoint"), "error");
    }
  };

  // ================= entity editor (host / vuln / note / member) =================
  const updateForm = (k: string, v: string) => setState((s) => ({ editorForm: { ...s.editorForm, [k]: v } }));
  const setTagDraft = (k: string, v: string) => setState((s) => ({ tagDrafts: { ...s.tagDrafts, [k]: v } }));
  const addEditorTag = (k: string, val: string) => {
    const v = val.trim();
    if (!v) return;
    setState((s) => {
      const cur = s.editorForm[k];
      const arr = Array.isArray(cur) ? cur : [];
      return { editorForm: { ...s.editorForm, [k]: [...arr, v] }, tagDrafts: { ...s.tagDrafts, [k]: "" } };
    });
  };
  const removeEditorTag = (k: string, idx: number) =>
    setState((s) => {
      const cur = s.editorForm[k];
      const arr = Array.isArray(cur) ? cur : [];
      return { editorForm: { ...s.editorForm, [k]: arr.filter((_, i) => i !== idx) } };
    });
  const openEditor = (type: EditorType, mode: "add" | "edit", index: number) => {
    let form: Record<string, string | string[]> = {};
    if (mode === "edit") {
      if (type === "host") {
        const e = hosts[index];
        if (!e) return;
        form = { host: e.host };
      } else if (type === "ip") {
        const row = ipsRows[index];
        if (!row) return;
        form = { ip: row.ip, originalIp: row.ip };
      } else if (type === "vuln") {
        const e = d.vulns[index];
        if (!e) return;
        form = { title: e.title, host: e.host, sev: e.sev, status: e.status };
      } else if (type === "note") {
        const e = d.notes[index];
        if (!e) return;
        form = { title: e.title, excerpt: e.excerpt };
      } else if (type === "cred") {
        const e = d.creds[index];
        if (!e) return;
        // Password is left blank on edit — sending it blank keeps the stored one, so
        // it is neither pre-filled into the form nor overwritten unless retyped.
        form = { username: e.username, password: "", host: e.host };
      }
    } else if (type === "host") form = { status: "up", ports: [] };
    else if (type === "ip") form = { hostName: "", ip: "", status: "unknown" };
    else if (type === "endpoint") form = { hostName: "", method: "GET", path: "" };
    else if (type === "vuln") form = { sev: "info", status: "open" };
    else if (type === "member") form = { userKey: "" };
    else if (type === "cred") form = { username: "", password: "", host: "" };
    setState({ editorOpen: true, editorType: type, editorMode: mode, editorIndex: index, editorForm: form, tagDrafts: {} });
  };
  const closeEditor = () => setState({ editorOpen: false });


  // ================= host farm: paste-a-list import =================
  /* One pasted token → its canonical `host` / `host:port` form (or null if junk).
     Mirrors the backend parser closely enough for a live preview; the backend
     re-parses authoritatively on submit. Scheme without a port keeps the scheme's
     default port so `https://x` stays 443 (JS URL would otherwise drop it). */
  const normalizeHostToken = (token: string): string | null => {
    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(token);
    if (hasScheme && !/^https?:\/\//i.test(token)) return null; // non-web scheme → rejected
    let u: URL;
    try {
      u = new URL(hasScheme ? token : `http://${token}`);
    } catch {
      return null;
    }
    const host = u.hostname.toLowerCase().replace(/\.$/, "");
    if (!host) return null;
    let port = u.port;
    if (!port && hasScheme) port = /^https:/i.test(token) ? "443" : "80";
    return port ? `${host}:${port}` : host;
  };
  /** Raw paste → deduped, normalized host list (the "will be imported" preview). */
  const normalizeHostList = (raw: string): string => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const line of raw.split(/\r?\n/)) {
      const l = line.trim();
      if (!l || l.startsWith("#") || l.startsWith("//")) continue;
      for (const tok of l.split(/[\s,]+/)) {
        const n = tok.trim() ? normalizeHostToken(tok.trim()) : null;
        if (n && !seen.has(n)) {
          seen.add(n);
          out.push(n);
        }
      }
    }
    return out.join("\n");
  };
  /** Raw paste → deduped IP list. Same normalization, minus anything that is not
   *  an address literal — the IP farm rejects hostnames server-side anyway, so
   *  filtering here keeps the preview honest about what will actually be sent. */
  const isIpLiteral = (host: string): boolean => {
    const bare = host.replace(/^\[|\]$/g, "");
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(bare)) return bare.split(".").every((o) => Number(o) <= 255);
    return bare.includes(":");
  };
  const normalizeIpList = (raw: string): string =>
    normalizeHostList(raw)
      .split("\n")
      .filter((line) => {
        // Strip a trailing :port, but only when it is not part of an IPv6 literal.
        const m = /^(\[[^\]]+\]|[^:]+)(?::(\d+))?$/.exec(line);
        return isIpLiteral(m ? m[1] : line);
      })
      .join("\n");

  // Note: never null hostFarmJob here — a running probe keeps polling in the
  // background (banner + live statuses) whether or not this page is open.
  const openHostImport = () => setState({ hostImportOpen: true, hostImportRaw: "", hostImportPreview: "", hostImportBusy: false });
  const closeHostImport = () => setState({ hostImportOpen: false, hostImportRaw: "", hostImportPreview: "", hostImportBusy: false });
  const openIpImport = () => setState({ ipImportOpen: true, ipImportRaw: "", ipImportPreview: "", ipImportBusy: false });
  const closeIpImport = () => setState({ ipImportOpen: false, ipImportRaw: "", ipImportPreview: "", ipImportBusy: false });
  const submitIpImport = async () => {
    const pid = state.openProjectId;
    const raw = state.ipImportPreview.trim();
    if (pid == null || !raw) {
      pushToast(t("Paste at least one IP"), "error");
      return;
    }
    setState({ ipImportBusy: true });
    try {
      const job = await apiStartIpFarm(pid, raw);
      setState({ ipImportOpen: false, ipImportRaw: "", ipImportPreview: "", ipImportBusy: false });
      reloadHosts();
      // Nothing new to probe — every address was already added. The server closed
      // the job on the spot; report the skip instead of a "Probing 0 IPs…" banner.
      if (!isFarmJobInFlight(job.status)) {
        setState({ ipFarmJob: null });
        if (job.result) ipFarmDoneToast(job.result);
        return;
      }
      // Unlike the host farm there are no skeleton rows: until an address is
      // reverse-resolved we cannot tell whether it belongs to an existing host.
      // Rows still stream in — the farm commits per address.
      setState({ ipFarmJob: job });
      pushToast(`${t("Probing")} ${job.targets_total ?? ""} ${t("IPs")}…`.replace("  ", " "), "success");
    } catch (e) {
      setState({ ipImportBusy: false });
      pushToast(getApiErrorMessage(e, t("Couldn't start IP import")), "error");
    }
  };
  const submitHostImport = async () => {
    const pid = state.openProjectId;
    // Submit the edited preview (the final list the user sees), not the raw paste.
    const raw = state.hostImportPreview.trim();
    if (pid == null || !raw) {
      pushToast(t("Paste at least one host"), "error");
      return;
    }
    setState({ hostImportBusy: true });
    try {
      const job = await apiStartHostFarm(pid, raw);
      // The server creates the hosts up front, so close the page and show them now;
      // statuses/ports fill in as the background probe commits per host (poll effect).
      setState({ hostImportOpen: false, hostImportRaw: "", hostImportPreview: "", hostImportBusy: false });
      reloadHosts();
      // Nothing new to probe — every host was already added. The server closed the
      // job on the spot; report the skip instead of a "Probing 0 hosts…" banner.
      if (!isFarmJobInFlight(job.status)) {
        setState({ hostFarmJob: null });
        if (job.result) hostFarmDoneToast(job.result);
        return;
      }
      setState({ hostFarmJob: job });
      pushToast(`${t("Probing")} ${job.targets_total ?? ""} ${t("hosts")}…`.replace("  ", " "), "success");
    } catch (e) {
      setState({ hostImportBusy: false });
      pushToast(getApiErrorMessage(e, t("Couldn't start host import")), "error");
    }
  };

  /* Импорт эндпоинтов сохраняет предпросмотр URL с необязательным HTTP-методом.
     Существующий хост переиспользуется, новый создаётся с защищённой пробивкой. */
  const EP_METHODS = new Set<string>(ENDPOINT_METHODS);
  const parseEpLine = (line: string): { host: string; method: string; path: string; url: string } | null => {
    const l = line.trim();
    if (!l || l.startsWith("#") || l.startsWith("//")) return null;
    const parts = l.split(/\s+/);
    let method = "GET";
    let target = l;
    if (parts.length >= 2 && EP_METHODS.has(parts[0].toUpperCase())) {
      method = parts[0].toUpperCase();
      target = parts.slice(1).join(" ").trim();
    }
    let host: string;
    let path: string;
    let url: string;
    try {
      const u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(target) ? target : `https://${target}`);
      if (!["http:", "https:"].includes(u.protocol) || u.username || u.password) return null;
      host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
      url = `${u.protocol}//${u.host}${u.pathname}${u.search}`;
      path = (u.pathname || "/") + (u.search || "");
    } catch {
      return null;
    }
    // URL должен содержать домен или IP для привязки; DNS здесь не проверяется.
    if (!host || target.startsWith("/")) return null;
    return { host, method, path, url };
  };
  const normalizeEpList = (raw: string): string => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const line of raw.split(/\r?\n/)) {
      const p = parseEpLine(line);
      if (!p) continue;
      const canon = `${p.method} ${p.url}`;
      if (!seen.has(canon)) {
        seen.add(canon);
        out.push(canon);
      }
    }
    return out.join("\n");
  };
  const openEpImport = () => setState({ epImportOpen: true, epImportRaw: "", epImportPreview: "", epImportBusy: false });
  const closeEpImport = () => setState({ epImportOpen: false, epImportRaw: "", epImportPreview: "", epImportBusy: false });
  /** Объединяет распознанные Swagger-строки с черновиком импорта без дублей.
   * Открывает предпросмотр Add endpoints; сохранение в БД выполняется отдельно.
   */
  const importSwaggerEndpoints = (lines: string[]) => setState((s) => ({
    exportPageOpen: false,
    epImportOpen: true,
    epImportRaw: [...new Set([...(s.epImportOpen ? s.epImportRaw.split(/\r?\n/).filter(Boolean) : []), ...lines])].join("\n"),
    epImportPreview: normalizeEpList([...(s.epImportOpen ? s.epImportPreview.split(/\r?\n/).filter(Boolean) : []), ...lines].join("\n")),
  }));
  /** Импортирует предпросмотр URL, переиспользуя найденные и созданные хосты.
   * Новые хосты ручного ввода и Swagger ставятся в защищённую очередь пробивки.
   */
  const submitEpImport = async () => {
    const pid = state.openProjectId;
    const parsed = state.epImportPreview
      .split(/\r?\n/)
      .map(parseEpLine)
      .filter((x): x is NonNullable<ReturnType<typeof parseEpLine>> => x != null);
    if (pid == null || parsed.length === 0) {
      pushToast(t("Paste at least one endpoint"), "error");
      return;
    }
    setState({ epImportBusy: true });
    let added = 0;
    let skipped = 0;
    const importHosts = new Map(hosts.map((h) => [h.host.toLowerCase(), h]));
    for (const ep of parsed) {
      let host = importHosts.get(ep.host);
      if (!host) {
        try {
          host = toStormHost(await apiCreateHost(pid, { hostname: ep.host, probe: true }));
          importHosts.set(ep.host, host);
        } catch (error) { pushToast(getApiErrorMessage(error, t("Couldn't add host")), "error"); skipped++; continue; }
      }
      try {
        await apiCreateEndpoint(pid, host.id, { path: ep.path, method: ep.method as Method });
        added++;
      } catch {
        skipped++;
      }
    }
    setState({ epImportOpen: false, epImportRaw: "", epImportPreview: "", epImportBusy: false });
    reloadHosts();
    pushToast(
      skipped ? `${t("Added")} ${added} · ${skipped} ${t("not imported")}` : `${t("Added")} ${added} ${t("endpoints")}`,
      added ? "success" : "error",
    );
  };

  /* Host editing only renames — status comes from the probe and ports hang off an
     IP the probe materialises, so neither is editable here. New hosts come from
     the host/endpoint import flows, never this editor. */
  const saveHostEditor = async () => {
    const { editorIndex: index, editorForm: f } = state;
    const pid = state.openProjectId;
    if (pid == null) {
      setState({ editorOpen: false });
      return;
    }
    const target = hosts[index];
    if (!target) {
      setState({ editorOpen: false });
      return;
    }
    const hostname = fstr(f.host).trim();
    try {
      await apiUpdateHost(pid, target.id, { hostname });
      setState({ editorOpen: false });
      reloadHosts();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't save host"), "error");
    }
  };

  /* A finding must hang off a host (`host_id` is required on create), so the
     "Affected host" field is a searchable picker over the project's real hosts.
     Критичность вычисляется из CVSS-вектора; без вектора — unrealized.
     Меняется через CVSS-вектор в карточке находки. */
  /* Resolve a typed host to a real project host, case-insensitively — the same
     binding the member picker uses (match an existing entity, not free text). */
  const resolveProjectHost = (typed: string) => {
    const q = typed.trim().toLowerCase();
    return q ? hosts.find((h) => h.host.toLowerCase() === q) : undefined;
  };

  const saveVulnEditor = async () => {
    const { editorMode: mode, editorIndex: index, editorForm: f } = state;
    const pid = state.openProjectId;
    if (pid == null) return;
    const title = (fstr(f.title) || "Untitled").trim();
    const status = (fstr(f.status) as VStatus) || "open";
    try {
      if (mode === "add") {
        const typedHost = fstr(f.host).trim();
        if (!typedHost) {
          pushToast(t("Select the host this finding belongs to"), "error");
          return;
        }
        const hostLabel = parseEpLine(typedHost)?.host ?? typedHost.toLowerCase();
        let host = resolveProjectHost(hostLabel);
        if (!host) {
          host = toStormHost(await apiCreateHost(pid, { hostname: hostLabel, probe: true }));
          reloadHosts();
        }
        // Add asks only for Title + Host; severity/status default here and the
        // user completes the finding on its detail card — redirect straight there.
        // Без вектора новая находка нереализуема; CVSS уточняет критичность позже.
        const created = await apiCreateVulnerability(pid, { title, status: "open", severity: "unrealized", host_id: host.id });
        reloadVulns();
        setState({ editorOpen: false, section: "vulns", openVulnId: created.id, vulnDetailForm: {} });
        return;
      }
      const target = d.vulns[index];
      if (!target) return;
      // No `severity` here on purpose: sending one would either be ignored (when
      // a CVSS score exists) or silently overwrite the real severity.
      await apiUpdateVulnerability(pid, target.id, { title, status });
      await relinkVulnHost(pid, target.id, fstr(f.host));
      setState({ editorOpen: false });
      reloadVulns();
    } catch (e) {
      pushToast(getApiErrorMessage(e, mode === "add" ? "Couldn't add vulnerability" : "Couldn't save vulnerability"), "error");
    }
  };

  /* `host_id` only exists on create, so moving a finding to another host means
     repointing its host asset link. Without this the "Affected host" field would
     silently do nothing when editing. */
  const relinkVulnHost = async (pid: number, vulnId: number, hostName: string) => {
    const host = resolveProjectHost(hostName);
    if (!host) return;
    const det = await apiGetVulnerability(pid, vulnId);
    const link = det.assets.find((a) => a.asset_type === "host");
    if (link?.asset_id === host.id) return;
    await apiAddVulnerabilityAsset(pid, vulnId, { asset_type: "host", asset_id: host.id });
    if (link) await apiDeleteVulnerabilityAsset(pid, vulnId, link.id);
  };

  const saveNoteEditorEntity = async () => {
    const { editorMode: mode, editorIndex: index, editorForm: f } = state;
    const pid = state.openProjectId;
    if (pid == null) return;
    const payload = { title: (fstr(f.title) || "Untitled").trim(), content: fstr(f.excerpt).trim() };
    try {
      if (mode === "add") await apiCreateProjectNote(pid, payload);
      else {
        const target = d.notes[index];
        if (!target) return;
        await apiUpdateProjectNote(pid, target.id, payload);
      }
      setState({ editorOpen: false });
      reloadNotes();
    } catch (e) {
      pushToast(getApiErrorMessage(e, mode === "add" ? "Couldn't add note" : "Couldn't save note"), "error");
    }
  };

  /* Adding a member only links an existing user to the project — the lead /
     pentester role is global and is set on the workspace Members page, never here. */
  const saveMemberEditor = async () => {
    const pid = state.openProjectId;
    if (pid == null) return;
    // The field is free text with suggestions, so a half-typed name lands here —
    // say so instead of closing the dialog as if it had worked.
    const typed = fstr(state.editorForm.userKey).trim();
    const u = state.workspaceUsers.find((x) => x.key.toLowerCase() === typed.toLowerCase());
    if (!u) {
      pushToast(typed ? `User “${typed}” not found` : "Select a user", "error");
      return;
    }
    try {
      await apiAddProjectMember(pid, u.id);
      setState({ editorOpen: false });
      reloadMembers();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't add member"), "error");
    }
  };

  /* There is no per-IP endpoint: a host's addresses are replaced wholesale via
     updateHost. The current list is re-fetched first so labels and is_primary of
     the existing addresses survive the round-trip. */
  /** Сохраняет IP: изменение заменяет адрес во всём проекте и запускает перепроверку.
   * Успех обновляет открытую карточку/список и отслеживаемую задачу; ошибка
   * сохраняет введённое значение и оставляет форму для исправления.
   */
  const saveIpEditor = async () => {
    const pid = state.openProjectId;
    const f = state.editorForm;
    if (pid == null) return;
    if (state.editorMode === "edit") {
      if (state.ipEditBusy) return;
      const address = fstr(f.ip).trim();
      const previous = fstr(f.originalIp);
      if (!address || address === previous) return;
      setState({ ipEditBusy: true });
      try {
        const result = await apiChangeIpAddress(pid, previous, address);
        setState((s) => ({
          editorOpen: false, ipEditBusy: false,
          openIp: s.openIp === previous ? result.ip_address : s.openIp,
          ipQuery: "", ipFilters: [],
          hiddenIps: s.hiddenIps.filter((ip) => ip !== previous && ip !== result.ip_address),
          ipFarmJob: result.job,
        }));
        reloadHosts();
        pushToast(t("IP updated. Refreshing its information…"), "success");
      } catch (error) {
        setState({ ipEditBusy: false });
        pushToast(getApiErrorMessage(error, "Couldn't update IP address"), "error");
      }
      return;
    }
    const host = hosts.find((h) => h.host === fstr(f.hostName));
    const ip = fstr(f.ip).trim();
    if (!host || !ip) {
      pushToast(host ? "Specify an IP address" : "Select a host", "error");
      return;
    }
    try {
      const current = await apiGetHost(pid, host.id);
      if (current.ip_addresses.some((a) => a.ip_address === ip)) {
        pushToast(t("This host already has that IP"), "error");
        return;
      }
      /* There is no per-IP status: the IPs view renders the parent host's, so the
         field writes through to the host. "unknown" is the untouched default —
         treat it as "leave as is" so adding an address can't downgrade a host
         already known to be up or down. */
      const picked = fstr(f.status) as Host["status"];
      await apiUpdateHost(pid, host.id, {
        ...(picked && picked !== "unknown" ? { status: picked } : {}),
        ip_addresses: [
          ...current.ip_addresses.map((a) => ({ ip_address: a.ip_address, label: a.label, is_primary: a.is_primary })),
          { ip_address: ip, label: null, is_primary: current.ip_addresses.length === 0 },
        ],
      });
      setState({ editorOpen: false });
      reloadHosts();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't add IP address"), "error");
    }
  };

  const saveEndpointEditor = async () => {
    const pid = state.openProjectId;
    const f = state.editorForm;
    if (pid == null) return;
    const host = hosts.find((h) => h.host === fstr(f.hostName));
    const path = fstr(f.path).trim();
    if (!host || !path) {
      pushToast(host ? "Specify the endpoint path" : "Select a host", "error");
      return;
    }
    try {
      await apiCreateEndpoint(pid, host.id, { path, method: (fstr(f.method) as Method) || "GET" });
      setState({ editorOpen: false });
      reloadHosts();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't add endpoint"), "error");
    }
  };

  /* Cred vault. On add the password is required; on edit a blank password means
     "keep the stored one" (see openEditor / updateProjectCredential), so the
     existing password is never round-tripped through the form. */
  const saveCredEditor = async () => {
    const { editorMode: mode, editorIndex: index, editorForm: f } = state;
    const pid = state.openProjectId;
    if (pid == null) return;
    const username = fstr(f.username).trim();
    const password = fstr(f.password);
    // Host binds to a project host, like the member picker: if entered, it must
    // match an existing host (case-insensitive) and is stored by its canonical
    // name; empty means no host binding.
    const typedHost = fstr(f.host).trim();
    let host: string | null = null;
    if (typedHost) {
      const h = resolveProjectHost(typedHost);
      if (!h) {
        pushToast(t("Host “{host}” not found", { host: typedHost }), "error");
        return;
      }
      host = h.host;
    }
    try {
      if (mode === "add") {
        if (!password.trim()) {
          pushToast(t("Enter the password"), "error");
          return;
        }
        await apiCreateProjectCredential(pid, { username: username || null, password, host });
      } else {
        const target0 = d.creds[index];
        if (!target0) return;
        await apiUpdateProjectCredential(pid, target0.id, {
          username: username || null,
          host,
          // Blank = keep the stored password; only send it when the user retyped one.
          ...(password.trim() ? { password } : {}),
        });
      }
      setState({ editorOpen: false });
      reloadCreds();
    } catch (e) {
      pushToast(getApiErrorMessage(e, mode === "add" ? "Couldn't add credential" : "Couldn't save credential"), "error");
    }
  };

  const saveEditor = async () => {
    if (state.editorType === "host") return saveHostEditor();
    if (state.editorType === "ip") return saveIpEditor();
    if (state.editorType === "endpoint") return saveEndpointEditor();
    if (state.editorType === "vuln") return saveVulnEditor();
    if (state.editorType === "note") return saveNoteEditorEntity();
    if (state.editorType === "member") return saveMemberEditor();
    if (state.editorType === "cred") return saveCredEditor();
  };

  // ================= delete confirm =================
  const askDelete = (type: EditorType, index: number, label: string) =>
    setState({ confirmOpen: true, confirmType: type, confirmIndex: index, confirmLabel: label, confirmProjectId: null, confirmUserId: null });
  const closeConfirm = () => {
    setPendingDelete(null);
    setPendingDeleteLabel(null);
    setState({ confirmOpen: false, confirmProjectId: null, confirmUserId: null });
  };
  const confirmDelete = async () => {
    if (pendingDelete) {
      const action = pendingDelete;
      closeConfirm();
      await action();
      return;
    }
    if (state.confirmProjectId) {
      const id = state.confirmProjectId;
      setState({ confirmOpen: false, confirmProjectId: null });
      try {
        await apiDeleteProject(id);
        reloadProjects();
      } catch (e) {
        pushToast(getApiErrorMessage(e, "Couldn't delete project"), "error");
      }
      return;
    }
    // Удаление пользователя идёт со страницы /members — там нет openProjectId,
    // поэтому обрабатываем до общей ветки, как и удаление проекта.
    if (state.confirmUserId) {
      const id = state.confirmUserId;
      setState({ confirmOpen: false, confirmUserId: null });
      try {
        await apiDeleteUser(id);
        reloadUsers();
      } catch (e) {
        pushToast(getApiErrorMessage(e, "Couldn't block user"), "error");
      }
      return;
    }
    const { confirmType: entityType, confirmIndex: i } = state;
    const pid = state.openProjectId;
    setState({ confirmOpen: false });
    if (!entityType || pid == null) return;
    // Every collection is backend-backed: delete through the API, then reload.
    const targets: Record<EditorType, { id: number | undefined; call: (id: number) => Promise<void>; reload: () => void; err: string }> = {
      host: { id: hosts[i]?.id, call: (id) => apiDeleteHost(pid, id), reload: reloadHosts, err: "Couldn't delete host" },
      // Rows in the IPs view address one address of a host, not the host itself.
      // «Удаление» IP скрывает адрес из списка, но не рвёт его привязку к домен-
      // хостам (та остаётся в карточке хоста). Бэк сносит только отдельную IP-запись.
      ip: { id: ipsRows[i] ? i : undefined, call: () => apiHideIp(pid, ipsRows[i].ip), reload: reloadHosts, err: "Couldn't delete IP address" },
      endpoint: { id: endpointRows[i]?.endpointId, call: (id) => apiDeleteEndpoint(pid, endpointRows[i].hostId, id), reload: reloadHosts, err: "Couldn't delete endpoint" },
      vuln: { id: d.vulns[i]?.id, call: (id) => apiDeleteVulnerability(pid, id), reload: reloadVulns, err: "Couldn't delete vulnerability" },
      note: { id: d.notes[i]?.id, call: (id) => apiDeleteProjectNote(pid, id), reload: reloadNotes, err: "Couldn't delete note" },
      cred: { id: d.creds[i]?.id, call: (id) => apiDeleteProjectCredential(pid, id), reload: reloadCreds, err: "Couldn't delete credential" },
      member: {
        id: d.members[i]?.id,
        call: (id) => apiRemoveProjectMember(pid, id),
        /* Removing yourself removes the project from your list (rule 1.1: a
           non-admin only sees projects they belong to), so leave the detail —
           staying would mean 403s on the next request and a project the list
           still shows. Admins keep access regardless of membership. */
        reload: () => {
          const leftMyself = d.members[i]?.id === authUser?.id && !isAdmin;
          if (!leftMyself) {
            reloadMembers();
            return;
          }
          selProjects();
          reloadProjects();
          pushToast(t("You left the project — it's no longer in your list"), "success");
        },
        err: "Couldn't remove member",
      },
    };
    const target = targets[entityType];
    if (target.id == null) return;
    try {
      await target.call(target.id);
      target.reload();
    } catch (e) {
      pushToast(getApiErrorMessage(e, target.err), "error");
    }
  };

  // ================= notes =================
  const openNoteEditor = (mode: "add" | "edit", index: number) => {
    const n = mode === "edit" ? d.notes[index] : null;
    noteEditorVersion.current++;
    setState({
      noteEditorOpen: true,
      noteEditorMode: mode,
      noteEditorIndex: index,
      noteEditorId: n?.id ?? null,
      openNoteId: n?.id ?? null,
      noteSaving: false,
      noteForm: { title: n ? n.title : "", excerpt: n ? n.excerpt : "", author: n ? n.author : me },
      noteFormOriginal: { title: n ? n.title : "", excerpt: n ? n.excerpt : "" },
    });
  };
  // «All notes» / Cancel — всегда возврат к списку заметок (не к вьюеру).
  const backToNotesList = () => setState({ openNoteId: null, noteEditorOpen: false });
  /* Opening a note always shows it rendered — including your own. Editing is a
     deliberate act (the pencil / the viewer's Edit button), not what a click on
     the note means. `id` is the backend id: it goes into the URL. */
  const openNoteViewer = (id: number) => setState({ section: "notes", openNoteId: id, noteEditorOpen: false });
  const updateNoteForm = (k: keyof NoteForm, v: string) => setState((s) => ({ noteForm: { ...s.noteForm, [k]: v } }));
  /** Upload screenshots pasted into the note editor and append them as Markdown
      images; the editor (TipTap Image) renders them inline right away, and the
      note stays plain Markdown (`![name](/api/v1/projects/…/images/…/download)`). */
  const attachNoteImages = async (files: File[]) => {
    const pid = state.openProjectId;
    if (pid == null) return;
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const { url } = await apiUploadProjectImage(pid, file);
        setState((s) => {
          const cur = s.noteForm.excerpt || "";
          const sep = cur.trim() ? (cur.endsWith("\n") ? "\n" : "\n\n") : "";
          return { noteForm: { ...s.noteForm, excerpt: `${cur}${sep}![${file.name}](${url})\n` } };
        });
      } catch (e) {
        pushToast(getApiErrorMessage(e, t("Couldn't upload the image")), "error");
      }
    }
  };
  const noteHasChanges = state.noteForm.title !== state.noteFormOriginal.title || state.noteForm.excerpt !== state.noteFormOriginal.excerpt;
  const noteSaveDisabled = state.noteSaving || !noteHasChanges;
  const saveNote = async () => {
    const { noteEditorMode: mode, noteEditorIndex: index, noteForm: f } = state;
    const pid = state.openProjectId;
    if (pid == null || noteSaveDisabled) return;
    const id = state.noteEditorId ?? d.notes[index]?.id;
    if (mode === "edit" && id == null) return;
    const version = noteEditorVersion.current;
    const payload = { title: (f.title || "Untitled").trim(), content: (f.excerpt || "").trim() };
    setState({ noteSaving: true });
    try {
      const saved = mode === "add" ? await apiCreateProjectNote(pid, payload) : await apiUpdateProjectNote(pid, id as number, payload);
      const savedNote = toStormNote(saved);
      setState((s) => {
        if (s.openProjectId !== pid) return {};
        const notes = s.apiNotes ?? [];
        const apiNotes = notes.some((note) => note.id === saved.id) ? notes.map((note) => note.id === saved.id ? savedNote : note) : [...notes, savedNote];
        if (!s.noteEditorOpen || version !== noteEditorVersion.current) return { apiNotes };
        // Compare with the submitted draft; edits made during this request stay dirty.
        return { apiNotes, noteEditorMode: "edit", noteEditorId: saved.id, openNoteId: saved.id, noteFormOriginal: { title: f.title, excerpt: f.excerpt } };
      });
      reloadNotes();
      pushToast(t("Note saved"), "success");
    } catch (e) {
      pushToast(getApiErrorMessage(e, mode === "add" ? "Couldn't create note" : "Couldn't save note"), "error");
    } finally {
      if (version === noteEditorVersion.current) setState({ noteSaving: false });
    }
  };

  // ================= vulnerability detail =================
  /** The overview's "open findings" tile — everything still needing work. */
  const goToOpenVulns = () => setState({ section: "vulns", vulnFilterStatuses: [...VSTATUS_OPEN], vulnFilterAuthor: "", vulnFilterSeverities: [], vulnFilterHost: "" });
  const goToMyFindings = () => setState({ section: "vulns", vulnFilterAuthor: me, vulnFilterStatuses: [], vulnFilterSeverities: [], vulnFilterHost: "" });
  const vulnFormFrom = (v: Vuln): VulnDetailForm => {
    const stepsList = Array.isArray(v.steps) ? v.steps.slice() : [];
    return {
      title: v.title,
      host: v.host,
      sev: v.sev,
      status: v.status,
      stepsList: stepsList.length ? stepsList : [""],
      stepImages: v.stepImages ?? {},
      description: v.description || "",
      impact: v.impact || "",
      remediation: v.remediation || "",
      cwe: v.cwe || "",
      vector: v.vector || "",
    };
  };
  /** `id` is the real backend id — it goes into the URL, so findings can be deep-linked. */
  const openVulnDetail = (id: number) => {
    const v = d.vulns.find((x) => x.id === id);
    setState({ section: "vulns", openVulnId: id, vulnDetailForm: v ? vulnFormFrom(v) : {} });
  };
  const closeVulnDetail = () => setState({ openVulnId: null });
  // Вложения уязвимости: загрузка (drag-drop / выбор файлов) и удаление. Файлы
  // привязаны к открытой уязвимости (openVulnId) — доказательная база в MinIO.
  const uploadVulnFilesFor = async (files: File[]) => {
    const pid = state.openProjectId;
    const vid = state.openVulnId;
    if (pid == null || vid == null || files.length === 0) return;
    setState({ vulnFilesBusy: true });
    try {
      for (const f of files) {
        await apiUploadVulnFile(pid, vid, f);
      }
      const fresh = await apiListVulnFiles(pid, vid);
      setState({ vulnFiles: fresh, vulnFilesBusy: false });
      pushToast(files.length === 1 ? t("File attached") : `${files.length} ${t("files attached")}`, "success");
    } catch (e) {
      setState({ vulnFilesBusy: false });
      pushToast(getApiErrorMessage(e, t("Couldn't upload the file")), "error");
    }
  };
  const removeVulnFile = async (fileId: number) => {
    const pid = state.openProjectId;
    const vid = state.openVulnId;
    if (pid == null || vid == null) return;
    try {
      await apiDeleteVulnFile(pid, vid, fileId);
      setState((s) => ({ vulnFiles: s.vulnFiles.filter((f) => f.id !== fileId) }));
    } catch (e) {
      pushToast(getApiErrorMessage(e, t("Couldn't delete the file")), "error");
    }
  };
  const updateVulnDetailForm = <K extends keyof VulnDetailForm>(k: K, v: VulnDetailForm[K]) =>
    setState((s) => ({ vulnDetailForm: { ...s.vulnDetailForm, [k]: v } }));
  const addVdStep = () => setState((s) => ({ vulnDetailForm: { ...s.vulnDetailForm, stepsList: [...(s.vulnDetailForm.stepsList ?? []), ""] } }));
  const removeVdStep = (i: number) =>
    setState((s) => {
      const imgs = { ...(s.vulnDetailForm.stepImages ?? {}) };
      delete imgs[i];
      const shifted: Record<number, number[]> = {};
      Object.keys(imgs).forEach((k) => {
        const n = +k;
        shifted[n > i ? n - 1 : n] = imgs[n];
      });
      return { vulnDetailForm: { ...s.vulnDetailForm, stepsList: (s.vulnDetailForm.stepsList ?? []).filter((_, idx) => idx !== i), stepImages: shifted } };
    });
  const updateVdStep = (i: number, val: string) =>
    setState((s) => {
      const list = [...(s.vulnDetailForm.stepsList ?? [])];
      list[i] = val;
      return { vulnDetailForm: { ...s.vulnDetailForm, stepsList: list } };
    });
  /** Upload screenshots pasted into step i as vulnerability files and remember
      their ids on the step. Persisted on save via `image_file_ids`, which the
      Word report renders inside the reproduction step (the old data-URL thumbs
      were client-only and never reached the report). */
  const attachVdStepImages = async (i: number, files: File[]) => {
    const pid = state.openProjectId;
    const vid = state.openVulnId;
    if (pid == null || vid == null) return;
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    setState({ vulnFilesBusy: true });
    try {
      for (const file of images) {
        const uploaded = await apiUploadVulnFile(pid, vid, file);
        setState((s) => {
          const imgs = { ...(s.vulnDetailForm.stepImages ?? {}) };
          imgs[i] = [...(imgs[i] ?? []), uploaded.id];
          return { vulnDetailForm: { ...s.vulnDetailForm, stepImages: imgs } };
        });
      }
      // Keep the Attachments list in sync (the screenshots are real files now).
      const fresh = await apiListVulnFiles(pid, vid);
      setState({ vulnFiles: fresh, vulnFilesBusy: false });
    } catch (e) {
      setState({ vulnFilesBusy: false });
      pushToast(getApiErrorMessage(e, t("Couldn't upload the image")), "error");
    }
  };
  const removeVdStepImage = (i: number, imgIdx: number) =>
    setState((s) => {
      const imgs = { ...(s.vulnDetailForm.stepImages ?? {}) };
      imgs[i] = (imgs[i] ?? []).filter((_, idx) => idx !== imgIdx);
      return { vulnDetailForm: { ...s.vulnDetailForm, stepImages: imgs } };
    });
  const saveVulnDetail = async () => {
    const { openVulnId: id, vulnDetailForm: f } = state;
    const pid = state.openProjectId;
    if (id == null || pid == null) return;
    const current = d.vulns.find((v) => v.id === id);
    if (!current) return;
    // Без вектора критичность сбрасывается в unrealized, включая очистку поля.
    const c = computeCvss4(f.vector);
    const vector = (f.vector ?? "").trim();
    try {
      await apiUpdateVulnerability(pid, id, {
        title: (f.title ?? current.title).trim(),
        severity: c ? c.sev : "unrealized",
        status: f.status || current.status,
        description: f.description ?? "",
        impact: f.impact ?? "",
        recommendations: f.remediation ?? "",
        cwe_id: (f.cwe ?? "").trim() || null,
        cvss_vector: vector || null,
        cvss_version: vector ? "4.0" : null,
        cvss_score: c ? c.score : null,
        // Keep a step if it has text OR screenshots; carry its uploaded image
        // ids in `image_file_ids` so the Word report renders them in-step.
        // Image ids are keyed by the ORIGINAL index, so pair them up before
        // filtering (filtering first would misalign the keys).
        workflow_steps: (f.stepsList ?? [])
          .map((s, i) => ({ description: s, imageIds: (f.stepImages ?? {})[i] ?? [] }))
          .filter(({ description, imageIds }) => description.trim() || imageIds.length)
          .map(({ description, imageIds }, i) => ({ id: `step-${i + 1}`, description, image_file_ids: imageIds })),
      });
      setState({ openVulnId: null });
      reloadVulns();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't save vulnerability"), "error");
    }
  };

  // ================= profile / API keys / 2FA / workspace users =================
  /* "API keys" are the backend's agent tokens. The raw token is returned once, on
     creation, and only its prefix is stored — so the list shows `prefix…`, never a
     full key. */
  const reloadApiKeys = () => {
    void (async () => {
      try {
        const rows = await apiListAgentTokens();
        setStateRaw((s) => ({
          ...s,
          apiKeys: rows
            .filter((t) => !t.revoked_at)
            .map((t) => ({
              id: t.id,
              name: t.name,
              key: `${t.token_prefix}…`,
              scopes: t.scopes,
              created: toDispDate(t.created_at.slice(0, 10)),
              expires: t.expires_at ? toDispDate(t.expires_at.slice(0, 10)) : null,
              allProjects: t.all_projects,
              projectCount: t.project_ids.length,
            })),
        }));
      } catch {
        // Best-effort: список грузится под текущего пользователя; на ошибке — пусто.
        setStateRaw((s) => ({ ...s, apiKeys: [] }));
      }
    })();
  };
  useEffect(() => {
    if (state.view === "profile" && state.profileTab === "api") reloadApiKeys();

  }, [state.view, state.profileTab]);
  // Проекты нужны для выбора доступа ключа — подтягиваем свежий список при открытии.
  const openApiKeyModal = () => {
    reloadProjects();
    setState({ apiKeyModalOpen: true, apiKeyName: "", apiKeyScopes: {}, apiKeyAllProjects: true, apiKeyProjectIds: [], apiKeyExpiry: "" });
  };
  const closeApiKeyModal = () => setState({ apiKeyModalOpen: false });
  const toggleApiScope = (s: string) => setState((st) => ({ apiKeyScopes: { ...st.apiKeyScopes, [s]: !st.apiKeyScopes[s] } }));
  const toggleApiProject = (id: number) =>
    setState((st) => ({
      apiKeyProjectIds: st.apiKeyProjectIds.includes(id)
        ? st.apiKeyProjectIds.filter((p) => p !== id)
        : [...st.apiKeyProjectIds, id],
    }));
  const createApiKey = async () => {
    const name = state.apiKeyName.trim();
    if (!name) return;
    const scopes = API_SCOPES.filter((s) => state.apiKeyScopes[s]);
    if (!scopes.length) {
      pushToast(t("Select at least one scope"), "error");
      return;
    }
    // Явный список проектов не может быть пустым — иначе токен ни к чему не даёт доступ.
    if (!state.apiKeyAllProjects && state.apiKeyProjectIds.length === 0) {
      pushToast(t("Select projects or enable “All my projects”"), "error");
      return;
    }
    // Пусто = бессрочный; иначе конец выбранного дня.
    const expires_at = state.apiKeyExpiry ? new Date(`${state.apiKeyExpiry}T23:59:59`).toISOString() : null;
    try {
      const created = await apiCreateAgentToken({
        name,
        scopes,
        project_ids: state.apiKeyAllProjects ? [] : state.apiKeyProjectIds,
        all_projects: state.apiKeyAllProjects,
        expires_at,
      });
      setState({ apiKeyModalOpen: false });
      // The token is shown once and never again — the backend keeps only its hash.
      pushToast(t("Token created — copy it now: {token}", { token: created.token }), "success");
      reloadApiKeys();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't create token"), "error");
    }
  };
  const revokeApiKey = async (id: number) => {
    try {
      await apiRevokeAgentToken(id);
      reloadApiKeys();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't revoke token"), "error");
    }
  };

  const openWSUserEditor = (mode: "add" | "edit", index: number) => {
    const u = mode === "edit" ? state.workspaceUsers[index] : null;
    setState({
      wsUserModalOpen: true,
      wsUserMode: mode,
      wsUserIndex: index,
      wsUserName: u ? u.name : "",
      wsUserEmail: u ? u.email : "",
      wsUserRole: u ? u.role : "user",
      wsUserProjectRole: u ? u.projectRole : "pentester",
    });
  };
  const closeWSUserEditor = () => setState({ wsUserModalOpen: false });
  // The workspace role maps onto the backend account role; the project role is a
  // global user attribute and is sent alongside it.
  const saveWSUser = async () => {
    const name = state.wsUserName.trim();
    const email = state.wsUserEmail.trim();
    const role = state.wsUserRole === "admin" ? "admin" : "pentester";
    const projectRole = state.wsUserProjectRole;
    const adding = state.wsUserMode === "add";
    // В режиме приглашения username не задаём — его выберет сам приглашённый.
    if (adding ? !email : (!name || !email)) return;
    try {
      if (adding) {
        const res = await apiCreateInvitation({ email, role, project_role: projectRole });
        if (res.activation_url) {
          try { await navigator.clipboard.writeText(res.activation_url); } catch { /* clipboard may be blocked */ }
          pushToast(t("Invitation created for {email} — activation link copied: {url}", { email: res.email_sent_to, url: res.activation_url }), "success");
        } else {
          const preview = res.mail_preview_url ? t(" (email preview: {url})", { url: res.mail_preview_url }) : "";
          pushToast(t("Invitation queued for {email}{preview}", { email: res.email_sent_to, preview }), "success");
        }
      } else {
        const u = state.workspaceUsers[state.wsUserIndex];
        if (!u) return;
        // Юзернейм неизменяем (см. read-only поле в редакторе) — шлём только роли.
        await apiUpdateUser(u.id, { role, project_role: projectRole });
      }
      setState({ wsUserModalOpen: false });
      reloadUsers();
    } catch (e) {
      pushToast(getApiErrorMessage(e, adding ? "Couldn't send invitation" : "Couldn't save user"), "error");
    }
  };
  /* «Удаление» пользователя на деле деактивирует его (мягкое удаление на бэке:
     строка остаётся, выставляется is_locked) — сначала подтверждаем в общем
     диалоге, сам вызов apiDeleteUser — в confirmDelete по confirmUserId. */
  const askDeleteWSUser = (index: number) => {
    const u = state.workspaceUsers[index];
    if (!u) return;
    setState({ confirmOpen: true, confirmType: null, confirmIndex: -1, confirmLabel: u.name, confirmProjectId: null, confirmUserId: u.id });
  };
  /* Администратор сразу возвращает доступ без письма и ожидания перехода по ссылке. */
  const reactivateUser = async (index: number) => {
    const u = state.workspaceUsers[index];
    if (!u) return;
    try {
      await apiReactivateUser(u.id);
      pushToast(t("User reactivated"), "success");
      reloadUsers();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't reactivate the user"), "error");
    }
  };
  const resendInvite = async (id: number) => {
    try {
      const res = await apiResendInvitation(id);
      if (res.activation_url) {
        try { await navigator.clipboard.writeText(res.activation_url); } catch { /* clipboard may be blocked */ }
        pushToast(t("Activation link copied: {url}", { url: res.activation_url }), "success");
      } else {
        const preview = res.mail_preview_url ? t(" (email preview: {url})", { url: res.mail_preview_url }) : "";
        pushToast(t("Invitation queued for {email}{preview}", { email: res.email_sent_to, preview }), "success");
      }
      reloadUsers();
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't resend invitation"), "error");
    }
  };
  const askRevokeInvite = (id: number, email: string) => {
    setPendingDelete(() => () => revokeInvite(id));
    setPendingDeleteLabel(t("Revoke invitation"));
    setState({ confirmOpen: true, confirmProjectId: null, confirmUserId: null, confirmLabel: email });
  };
  const revokeInvite = async (id: number) => {
    try {
      await apiRevokeInvitation(id);
      reloadUsers();
      pushToast(t("Invitation revoked"), "success");
    } catch (e) {
      pushToast(getApiErrorMessage(e, "Couldn't revoke invitation"), "error");
    }
  };

  const startTwoFA = async () => {
    setState({ twoFABusy: true });
    try {
      const setup = await apiSetupTwoFactor();
      setState({ twoFASetupOpen: true, twoFACode: "", twoFAQr: setup.qr_png_data_url, twoFASecret: setup.secret, twoFABusy: false });
    } catch (e) {
      setState({ twoFABusy: false });
      pushToast(getApiErrorMessage(e, "Couldn't start 2FA setup"), "error");
    }
  };
  const cancelTwoFA = () => setState({ twoFASetupOpen: false, twoFACode: "", twoFAQr: null, twoFASecret: null });
  const confirmTwoFA = async () => {
    if (state.twoFACode.trim().length < 6 || state.twoFABusy) return;
    setState({ twoFABusy: true });
    try {
      await apiConfirmTwoFactor(state.twoFACode.trim());
      await refreshUser();
      setState({ twoFASetupOpen: false, twoFACode: "", twoFAQr: null, twoFASecret: null, twoFABusy: false });
      pushToast(t("Two-factor authentication enabled"), "success");
    } catch (e) {
      setState({ twoFABusy: false });
      pushToast(getApiErrorMessage(e, "Invalid code — try again"), "error");
    }
  };
  const openDisableTwoFA = () => setState({ twoFADisableOpen: true, twoFADisablePassword: "" });
  const cancelDisableTwoFA = () => setState({ twoFADisableOpen: false, twoFADisablePassword: "" });
  const disableTwoFA = async () => {
    if (!state.twoFADisablePassword || state.twoFABusy) return;
    setState({ twoFABusy: true });
    try {
      await apiDisableTwoFactor(state.twoFADisablePassword);
      await refreshUser();
      setState({ twoFADisableOpen: false, twoFADisablePassword: "", twoFABusy: false });
      pushToast(t("Two-factor authentication disabled"), "success");
    } catch (e) {
      setState({ twoFABusy: false });
      pushToast(getApiErrorMessage(e, "Couldn't disable 2FA"), "error");
    }
  };

  // Смена собственного пароля (PATCH /users/me/password). Для SSO-пользователей
  // форма не показывается (у них нет локального пароля — меняется в IdM).
  const submitPasswordChange = async () => {
    if (state.pwdBusy) return;
    const cur = state.pwdCurrent;
    const nw = state.pwdNew;
    if (!cur || !nw) { pushToast(t("Enter your current and new password"), "error"); return; }
    if (nw.length < 8) { pushToast(t("New password must be at least 8 characters"), "error"); return; }
    if (nw !== state.pwdConfirm) { pushToast(t("Passwords don't match"), "error"); return; }
    if (nw === cur) { pushToast(t("New password must differ from the current one"), "error"); return; }
    setState({ pwdBusy: true });
    try {
      await apiChangeMyPassword({ current_password: cur, new_password: nw });
      await refreshUser();
      setState({ pwdBusy: false, pwdCurrent: "", pwdNew: "", pwdConfirm: "" });
      pushToast(t("Password changed"), "success");
    } catch (e) {
      setState({ pwdBusy: false });
      pushToast(getApiErrorMessage(e, "Couldn't change the password"), "error");
    }
  };

  // ================= notifications =================
  /* Each notification carries the ids of what it is about (context.project_id /
     vulnerability_id), so clicking it navigates straight to the finding. The
     previous version matched a seed project *by name* against the real projects,
     which never matched — openProjectId stayed null and the click fell back to
     the projects list. */
  const goToNotif = (n: ApiNotification) => {
    const pid = n.context?.project_id ?? null;
    const vid = n.context?.vulnerability_id ?? null;
    const nid = n.context?.note_id ?? null;
    void apiMarkNotificationRead(n.id).catch(() => {
      /* best-effort: the read flag is not worth blocking navigation on */
    });
    // Land on whatever the notification is actually about: the finding, the note,
    // or — for "added to project" / project status — the project itself.
    const section: SectionId = vid != null ? "vulns" : nid != null ? "notes" : n.context?.host_id != null ? "hosts" : "overview";
    setStateRaw((s) => ({
      ...s,
      notifs: s.notifs.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)),
      notifOpen: false,
      ...(pid == null
        ? {}
        : {
            view: "detail" as const,
            nav: "projects" as const,
            openProjectId: pid,
            section,
            openHostId: n.context?.endpoint_id == null && vid == null && nid == null ? n.context?.host_id ?? null : null,
            ...(n.context?.endpoint_id != null ? { reconView: "endpoints" as const } : {}),
            expanded: [],
            openVulnId: vid,
            openNoteId: nid,
            vulnDetailForm: {},
            accessDenied: false,
          }),
    }));
    if (pid != null && n.context?.endpoint_id != null && n.context.host_id != null) {
      openEndpoint({ method: (n.context.endpoint_method || "GET") as Method, path: n.context.endpoint_path || "/", host: n.context.hostname || "unknown", hostId: n.context.host_id, endpointId: n.context.endpoint_id }, pid);
    }
    if (pid == null) pushToast(t("Notification isn't linked to a project"), "error");
  };

  const markAllNotifsRead = () => {
    void apiMarkAllNotificationsRead().catch((e) => pushToast(getApiErrorMessage(e, "Couldn't mark notifications"), "error"));
    setStateRaw((s) => ({ ...s, notifs: s.notifs.map((x) => ({ ...x, is_read: true })) }));
  };

  // ---------------------------------------------------------------- derived
  const isActive = state.tab === "active";
  const q = state.query.trim().toLowerCase();
  // Rule 1.1 is enforced server-side: getProjects returns only visible projects.
  const allProjects = state.apiProjects ?? [];
  const isArchivedStatus = (s: ProjectStatus) => s === "archived" || s === "completed";
  const projRows = allProjects
    .filter((p) => (state.tab === "active" ? !isArchivedStatus(p.status) : isArchivedStatus(p.status)))
    .filter((p) => !q || p.name.toLowerCase().includes(q));
  // Newest first by default ("Last updated") — a just-added project lands at the
  // top, not buried at the end; "First updated" flips to oldest-first. id is a
  // monotonic proxy for creation order (safe: projRows is a fresh filtered array).
  projRows.sort((a, b) => {
    const difference = (Date.parse(a.updated || "") || 0) - (Date.parse(b.updated || "") || 0) || a.id-b.id;
    return state.projSort === "first" ? difference : -difference;
  });

  const activeCount = allProjects.filter((p) => !isArchivedStatus(p.status)).length;
  const archivedCount = allProjects.filter((p) => isArchivedStatus(p.status)).length;
  // Tab-scoped (no search filter): stat tiles must not react to `query`.
  const tabProjects = allProjects.filter((p) => (isActive ? !isArchivedStatus(p.status) : isArchivedStatus(p.status)));

  // ---- stat-card sparklines: real cumulative growth over the projects' window ----
  const activeRows = allProjects.filter((p) => !isArchivedStatus(p.status));
  const archivedRows = allProjects.filter((p) => isArchivedStatus(p.status));
  const parseAll = (arr: (string | undefined)[]) => arr.map((s) => Date.parse(s ?? "")).filter((n) => Number.isFinite(n));
  /** Combined [start, end] window across a set of projects — the sparkline's X axis. */
  const projWindow = (rows: ApiProjectRow[]): [number, number] => {
    const starts = parseAll(rows.map((r) => r.startISO || r.createdISO));
    const ends = parseAll(rows.map((r) => r.endISO));
    return [starts.length ? Math.min(...starts) : NaN, ends.length ? Math.max(...ends) : NaN];
  };
  const projCreatedTimes = (rows: ApiProjectRow[]) => rows.map((r) => r.createdISO || r.startISO);
  const aggHostTimes = (rows: ApiProjectRow[]) => rows.flatMap((r) => state.aggTimes?.[r.id]?.hosts ?? []);
  const aggOpenVulnTimes = (rows: ApiProjectRow[]) => rows.flatMap((r) => state.aggTimes?.[r.id]?.openVulns ?? []);

  // Активный пункт — акцентный фон; неактивному фон НЕ задаём (undefined), иначе
  // inline-стиль перебил бы CSS `.nav:hover` и подсветки при наведении не было бы.
  const navBg = (id: NavId) => (state.nav === id ? "var(--st-accent-soft)" : undefined);
  const navColor = (id: NavId) => (state.nav === id ? "var(--st-accent)" : "var(--st-text-2)");

  const isList = state.view === "list" && state.nav === "projects";
  const isDocs = state.view === "list" && state.nav === "docs";
  const isTasks = state.view === "list" && state.nav === "tasks";
  /* Notification rows, built from the backend payload. Each event reads differently — the
     row is a sentence: "<who> <action> <subject>". */
  const NOTIF_AVATAR_COLORS = ["var(--st-accent)", "var(--st-purple)", "var(--st-orange)", "var(--st-danger)", "var(--st-success)"];
  const notifs = state.notifs.map((n) => {
    const ctx = n.context;
    const who = ctx?.commenter_username || "System";
    const project = ctx?.project_name || state.apiProjects?.find((p) => p.id === ctx?.project_id)?.name || "";
    const statusLabel = ctx?.status ? VSTATUS_LABEL[ctx.status as VStatus] ?? PROJ_STATUS[ctx.status]?.label ?? ctx.status : "";
    const row = { action: "", subject: "" };
    switch (n.type) {
      case "project_deadline":
        row.action = t("Project deadline: {date}", { date: toDispDate(ctx?.deadline_date || "") });
        row.subject = project;
        break;
      case "project_member_added":
        row.action = t("added you to");
        row.subject = project;
        break;
      case "vuln_created":
        row.action = t("added a vulnerability —");
        row.subject = ctx?.vulnerability_title || "";
        break;
      case "vuln_status_changed":
        row.action = t("set your finding to {status} —", { status: t(statusLabel) });
        row.subject = ctx?.vulnerability_title || "";
        break;
      case "project_status_changed":
        row.action = t("changed the project status to {status} —", { status: t(statusLabel) });
        row.subject = project;
        break;
      case "mention":
        row.action = t("mentioned you in");
        row.subject = ctx?.vulnerability_title || ctx?.note_title || (ctx?.endpoint_id != null ? `${ctx.endpoint_method || "GET"} ${ctx.endpoint_path || "/"}` : project);
        break;
      default:
        row.action = t("Notification");
        row.subject = project;
    }
    return {
      key: n.id,
      initials: avatarLetter(who),
      avBg: NOTIF_AVATAR_COLORS[n.id % NOTIF_AVATAR_COLORS.length],
      user: who === "System" ? t("System") : `@${who}`,
      action: row.action,
      where: row.subject,
      // The project is already the subject of project-level events; don't repeat it.
      meta: [n.type === "mention" || n.type === "vuln_status_changed" || n.type === "vuln_created" ? project : "", relTime(n.created_at)].filter(Boolean).join(" · "),
      unread: !n.is_read,
      onClick: () => goToNotif(n),
    };
  });
  const newCount = notifs.filter((n) => n.unread).length;
  const hasUnread = newCount > 0;

  const sideW = sidebarCollapsed ? "76px" : "236px";

  // ---- section tab styling ----
  const sec = state.section;
  const secStyle = (k: SectionId) => ({
    // The tab's own underline/colour is CSS-driven off `active` (see .sectab);
    // `color` stays for the badges, which are still styled inline.
    active: sec === k,
    color: sec === k ? "var(--st-accent)" : "var(--st-text-2)",
    badgeColor: sec === k ? "var(--st-accent)" : "var(--st-text-3)",
    badgeBg: sec === k ? "var(--st-accent-soft)" : "var(--st-bg)",
  });

  // ---- hosts / recon derived ----
  const rv = state.reconView;
  const portPillsOf = (ports: Host["ports"]) => ports.map((p) => ({ label: `${p.n}/${p.proto}`, http: p.http, ...(PORT[p.state] ?? PORT.closed) }));
  /** Colour for an HTTP status code next to a port: 2xx green, 3xx amber, else red. */
  const httpStatusColor = (code: number): string =>
    code < 300 ? "var(--st-success)" : code < 400 ? "var(--st-warn)" : "var(--st-danger)";

  // Hosts are searched by name here; addresses have their own search in the IPs view.
  /** A host that is a subdomain of another host in the project (shown nested, not top-level). */
  const isNestedSubdomain = (h: Host) =>
    hostIndex.nestedIds.has(h.id);
  /* Rows the hosts table shows. The IP farm has to create a parent Host per address
     (ports hang off host_ip_addresses, which hangs off hosts), but the user added an
     address, not a host — a nameless row here would just be noise. They stay visible
     in the IPs view, which is what they are. */
  const isIpFarmRow = (h: Host) => h.origin === "ip";
  /* Status filter pills, classified by the ports' HTTP codes (not the raw backend
     status): up = any 2xx/3xx/4xx; down = any 5xx or an offline entity; a numeric
     pill = that exact code on some port. Shared by the hosts and IPs views. */
  const matchesStatusFilters = (ports: Host["ports"], status: Host["status"], filters: string[]): boolean => {
    if (filters.length === 0) return true;
    const codes = ports.map((p) => p.http).filter((c): c is number => c != null);
    return filters.some((k) => {
      if (k === "up") return codes.some((c) => c >= 200 && c < 500);
      if (k === "down") return status === "down" || codes.some((c) => c >= 500);
      return codes.includes(Number(k));
    });
  };
  /* Единственное место, где решается судьба строки в таблице хостов, — через него
     же идёт экспорт (exportLinesFor → hostsList/visibleSubdomainsOf), поэтому
     фильтры не могут разъехаться между тем, что видно, и тем, что выгружается. */
  const hostMatchesFilters = (h: Host): boolean =>
    matchesStatusFilters(h.ports, h.status, state.hostFilters);
  /** Status pills offered in the hosts and IPs views (empty selection = all). */
  const STATUS_FILTER_KEYS = ["up", "200", "301", "401", "403", "down"];
  /** Subdomains of a host, filtered by the active pills (empty = all). */
  const visibleSubdomainsOf = (h: Host): Host[] => subdomainsOf(h).filter(hostMatchesFilters);
  const hostsList = hosts
    .map((h, idx) => ({ h, idx }))
    .filter((x) => {
      const hq = state.hostQuery.trim().toLowerCase();
      // Only a *search* flattens the tree; filtering keeps subdomains nested under
      // their parent. A parent is shown if it OR a subdomain matches the filter.
      const flat = hq !== "";
      const nameOk = hq ? x.h.host.toLowerCase().includes(hq) : true;
      const nestOk = flat || !isNestedSubdomain(x.h);
      const filterOk = hostMatchesFilters(x.h) || (!flat && visibleSubdomainsOf(x.h).length > 0);
      return !isIpFarmRow(x.h) && nameOk && nestOk && filterOk;
    });

  const _hd = state.openHostId != null ? hosts.find((h) => h.id === state.openHostId) : undefined;

  const sevCounts: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0, unrealized: 0 };
  d.vulns.forEach((v) => (sevCounts[v.sev] = (sevCounts[v.sev] || 0) + 1));
  const sevBars = (["critical", "high", "medium", "low", "info", "unrealized"] as Severity[]).map((k) => ({
    label: cap(k),
    color: SEV[k].color,
    tileBg: SEV[k].bg,
    count: sevCounts[k],
    onClick: () => setState({ section: "vulns", vulnFilterSeverities: [k], vulnFilterStatuses: [], vulnFilterAuthor: "", vulnFilterHost: "" }),
  }));

  const vulnStCounts = Object.fromEntries(VSTATUS_ORDER.map((k) => [k, 0])) as Record<VStatus, number>;
  d.vulns.forEach((v) => (vulnStCounts[v.status] = (vulnStCounts[v.status] || 0) + 1));
  const openVulnCount = VSTATUS_OPEN.reduce((n, k) => n + vulnStCounts[k], 0);
  const myFindingsCount = d.vulns.filter((v) => v.author === me).length;

  const vfA = state.vulnFilterAuthor.trim().toLowerCase();
  const vfS = state.vulnFilterStatuses;
  const vfSev = state.vulnFilterSeverities;
  // Единое поле поиска: совпадение по хосту ИЛИ по названию находки.
  const vfQ = state.vulnFilterHost.trim().toLowerCase();
  // Within a group the selected values are OR-ed; the groups are AND-ed. An empty
  // group filters nothing, which is what makes "All" light up on its own.
  const vulns = d.vulns
    .map((v, idx) => ({ v, idx }))
    .filter(
      ({ v }) =>
        (!vfA || v.author.toLowerCase().includes(vfA)) &&
        (vfS.length === 0 || vfS.includes(v.status)) &&
        (vfSev.length === 0 || vfSev.includes(v.sev)) &&
        (!vfQ || v.host.toLowerCase().includes(vfQ) || v.title.toLowerCase().includes(vfQ))
    )
    // Newest first: a just-added finding lands at the top, not buried at the end.
    // idx is captured above, so edit/delete still address the right d.vulns entry.
    .sort((a, b) => b.v.id - a.v.id)
    .map(({ v, idx }, i) => ({
      id: v.id,
      trackerUrl: v.trackerUrl,
      num: i + 1,
      sev: v.sev,
      title: v.title,
      host: v.host,
      status: v.status,
      author: v.author,
      updated: v.updated,
      // The card is addressed by backend id (it lands in the URL); the editor and
      // delete still address the list position.
      onOpen: () => openVulnDetail(v.id),
      onEdit: (e: ReactMouseEvent) => {
        e.stopPropagation();
        openEditor("vuln", "edit", idx);
      },
      onDelete: (e: ReactMouseEvent) => {
        e.stopPropagation();
        askDelete("vuln", idx, v.title);
      },
    }));

  /** Pill styling for a multi-select filter; `on` also covers the "All" pill (empty selection). */
  const vfPill = (on: boolean): CSSProperties => (on ? PILL_ON : PILL_OFF);

  // A host can carry several IPs (external / internal / mgmt) — the IPs view lists
  // them all, one row per address. Row actions target the address, not the host.
  // One search box matches either side of the row: the address or its host.
  const ipQ = state.ipQuery.trim().toLowerCase();
  /* One row per address, whatever it hangs off. The same address legitimately
     belongs to several hosts (shared hosting, a CDN edge, or simply a hostname
     imported after its address was) — those collapse into one row whose Hostname
     cell lists every name, rather than repeating the address per host. */
  type IpRowNames = { hostname: string; source: string; confirmed: boolean }[];
  /* Ports/status are tracked in two buckets and never blended: the bare-IP probe
     (from an origin="ip" host — the IP farm hits the address directly) and the
     domain probe (from origin="host" hosts — the host farm hits the address with a
     Host header). A vhost legitimately answers differently to the two, so the IPs
     view shows the bare-IP measurement when there is one, and falls back to the
     domain probe only when the address was merely resolved from a domain and never
     scanned as an IP. The Hosts view keeps showing the domain probe, so the two no
     longer overwrite each other. */
  type IpBucket = { ports: Host["ports"]; status: Host["status"] };
  const mergeBucket = (into: IpBucket | null, h: IpBucket): IpBucket => {
    if (into === null) return { ports: [...h.ports], status: h.status };
    const seen = new Set(into.ports.map((p) => `${p.n}/${p.proto}`));
    return {
      ports: [...into.ports, ...h.ports.filter((p) => !seen.has(`${p.n}/${p.proto}`))],
      status: into.status !== "up" && h.status === "up" ? h.status : into.status,
    };
  };
  const ipRowsByAddr = new Map<
    string,
    { ip: string; names: IpRowNames; ipMeas: IpBucket | null; domainMeas: IpBucket | null }
  >();
  hosts.forEach((h) => {
    h.ipEntries.forEach((entry) => {
      if (!entry.ip || entry.ip === "—") return;
      // A host's own name counts as a name for its address even when the address
      // never went through reverse resolution (added by hand or by the host farm).
      const own: IpRowNames =
        h.origin === "host" && h.host && h.host !== "—" ? [{ hostname: h.host, source: "host", confirmed: true }] : [];
      const acc =
        ipRowsByAddr.get(entry.ip) ??
        (() => {
          const fresh = { ip: entry.ip, names: [] as IpRowNames, ipMeas: null as IpBucket | null, domainMeas: null as IpBucket | null };
          ipRowsByAddr.set(entry.ip, fresh);
          return fresh;
        })();
      acc.names.push(...entry.hostnames, ...own);
      const measurement = { ports: entry.ports ?? [], status: h.status };
      if (h.origin === "ip") acc.ipMeas = mergeBucket(acc.ipMeas, measurement);
      else acc.domainMeas = mergeBucket(acc.domainMeas, measurement);
    });
  });
  const ipsRows = [...ipRowsByAddr.values()]
    // Скрытые («удалённые» из списка) адреса не показываем — привязка к хостам при
    // этом сохранена на бэке, адрес просто не значится во вкладке IP.
    .filter((row0) => !state.hiddenIps.includes(row0.ip))
    .map((row0) => {
      // Bare-IP measurement wins; domain probe is the fallback for addresses only
      // ever resolved from a domain.
      const meas = row0.ipMeas ?? row0.domainMeas ?? { ports: [], status: "unknown" as Host["status"] };
      const row = { ...row0, ports: meas.ports, status: meas.status };
      // Dedup names across every host that carries the address; a name confirmed
      // by any of them is confirmed. PTR entries win over a bare host name.
      const byName = new Map<string, { hostname: string; source: string; confirmed: boolean }>();
      for (const n of row.names) {
        const cur = byName.get(n.hostname);
        if (!cur) byName.set(n.hostname, { ...n });
        else {
          cur.confirmed = cur.confirmed || n.confirmed;
          if (cur.source !== "ptr" && n.source === "ptr") cur.source = n.source;
        }
      }
      const names = [...byName.values()].sort(
        (a, b) => Number(b.confirmed) - Number(a.confirmed) || a.hostname.localeCompare(b.hostname),
      );
      return { ...row, names };
    })
    .filter(
      (row) =>
        !ipQ ||
        row.ip.toLowerCase().includes(ipQ) ||
        row.names.some((n) => n.hostname.toLowerCase().includes(ipQ)),
    )
    // Same status filter as hosts. The Status *column* is gone from this table,
    // but filtering by HTTP code still answers a real question here.
    .filter((row) => matchesStatusFilters(row.ports, row.status, state.ipFilters))
    .map((row, i) => ({
      ...row,
      onEdit: (e: ReactMouseEvent) => {
        e.stopPropagation();
        openEditor("ip", "edit", i);
      },
      onDelete: (e: ReactMouseEvent) => {
        e.stopPropagation();
        askDelete("ip", i, row.ip);
      },
    }));
  /** The IP row whose detail card is open (looked up by address, like _hd by id). */
  const _ipd = state.openIp != null ? ipsRows.find((r) => r.ip === state.openIp) : undefined;
  /** Flat endpoint list, so a confirm dialog can address one by position. */
  const endpointRows = useMemo(() => hosts.flatMap((h) => h.endpoints.map((e) => ({ hostId: h.id, endpointId: e.id, host: h.host, label: `${e.m} ${e.p}` }))), [hosts]);
  /* Endpoints view filters: method pills (empty = all), plus separate searches for
     the host and the endpoint path — they are different questions ("everything on
     this host" vs "where is /login"), so one combined box would answer neither. */
  const epHostQ = state.epHostQuery.trim().toLowerCase();
  const epPathQ = state.epPathQuery.trim().toLowerCase();
  const endpointGroups = useMemo(() => hosts
    .filter((h) => !epHostQ || h.host.toLowerCase().includes(epHostQ))
    .map((h) => ({
      hostId: h.id,
      host: h.host,
      endpoints: h.endpoints.filter(
        (e) => (state.epMethods.length === 0 || state.epMethods.includes(e.m)) && (!epPathQ || e.p.toLowerCase().includes(epPathQ))
      ),
      expanded: state.epExpanded.includes(h.host),
    }))
    .filter((g) => g.endpoints.length > 0)
    .map((g) => ({ ...g, count: g.endpoints.length })), [hosts, epHostQ, epPathQ, state.epMethods, state.epExpanded]);
  // Counts what the filters actually left on screen.
  const endpointTotal = endpointGroups.reduce((s, g) => s + g.count, 0);
  const askDeleteEndpoints = (group: typeof endpointGroups[number]) => {
    const pid = state.openProjectId;
    if (pid == null || group.count === 0 || deletingEndpointHosts.includes(group.hostId)) return;
    const targets = group.endpoints.map((e) => ({ hostId: group.hostId, id: e.id }));
    setPendingDelete(() => async () => {
      setDeletingEndpointHosts((ids) => [...ids, group.hostId]);
      try {
        let deleted = 0;
        let failed = 0;
        for (let offset = 0; offset < targets.length; offset += 10) {
          const results = await Promise.allSettled(targets.slice(offset, offset + 10).map((e) => apiDeleteEndpoint(pid, e.hostId, e.id)));
          deleted += results.filter((r) => r.status === "fulfilled").length;
          failed += results.filter((r) => r.status === "rejected").length;
        }
        reloadHosts();
        if (deleted) pushToast(`${t("Endpoints deleted")}: ${deleted}`, "success");
        if (failed) pushToast(`${t("Couldn't delete endpoints")}: ${failed}`, "error");
      } finally {
        setDeletingEndpointHosts((ids) => ids.filter((id) => id !== group.hostId));
      }
    });
    setState({ confirmOpen: true, confirmProjectId: null, confirmUserId: null, confirmLabel: `${group.host} · ${group.count} ${t("endpoints")}` });
  };

  /* JS files pulled from the backend, filtered by the JS view's controls, then
     grouped by the domain they were found on — the table mirrors the endpoints
     layout (a card per host, files expand to show their secrets + paths). */
  const jsQ = state.jsQuery.trim().toLowerCase();
  const jsFiles: JsFileEntry[] = (state.apiJsFiles ?? []).map((f) => ({
    id: f.id,
    host: f.hostname || "—",
    hostId: f.host_id,
    url: f.url,
    status: f.status,
    size: f.size_bytes,
    secrets: f.secrets.map((s) => ({ kind: s.kind, match: s.match_preview, snippet: s.snippet, severity: s.severity })),
    endpoints: f.endpoints,
  }));
  const jsFilesFiltered = jsFiles.filter(
    (f) =>
      (!jsQ || f.url.toLowerCase().includes(jsQ) || f.host.toLowerCase().includes(jsQ)) &&
      (!state.jsSecretsOnly || f.secrets.length > 0),
  );
  const jsGroups = [...new Set(jsFilesFiltered.map((f) => f.host))].map((host) => {
    const files = jsFilesFiltered.filter((f) => f.host === host);
    // Every file in a group shares one host, so its id names the archive scope.
    return { host, hostId: files[0]?.hostId, files, count: files.length, paths: files.reduce((n, f) => n + f.endpoints.length, 0) };
  });
  /** File-name tail of a JS URL, and a compact byte size — shared by the JS views. */
  const fileBase = (url: string) => url.split("/").pop() || url;
  const kb = (n: number | null) => (n == null ? "" : n < 1024 ? `${n} B` : `${Math.round(n / 1024)} KB`);
  /** Open JS file card — found over the whole list, so a list filter can't close it. */
  const _jsd = state.openJsFileId != null ? jsFiles.find((f) => f.id === state.openJsFileId) : undefined;
  const openJsFile = (id: number) => setState({ openJsFileId: id });
  const closeJsFile = () => setState({ openJsFileId: null });
  /** Open "all files of host" JS page, or null. */
  const _jsHost = state.openJsHost;
  const openJsHostDetail = (host: string) => setState({ openJsHost: host, openJsFileId: null });
  const closeJsHostDetail = () => setState({ openJsHost: null });

  /* The domains the JS scan can target: every project domain the host filters
     leave on screen, minus IP-origin rows and IP literals (the farm scans names,
     not addresses). Subdomains are pulled up like the export does, so a parent on
     the list only because a child matched doesn't drag the child along silently. */
  const jsScanDomains = (): string[] => {
    const seen = new Set<number>();
    const rows: Host[] = [];
    const add = (x: Host) => {
      if (seen.has(x.id)) return;
      seen.add(x.id);
      rows.push(x);
    };
    hostsList.forEach(({ h }) => {
      if (hostMatchesFilters(h)) add(h);
      visibleSubdomainsOf(h).forEach(add);
    });
    const out: string[] = [];
    const uniq = new Set<string>();
    for (const h of rows) {
      const name = h.host.trim().toLowerCase();
      if (!name || h.origin === "ip" || isIpLiteral(name) || uniq.has(name)) continue;
      uniq.add(name);
      out.push(name);
    }
    return out;
  };
  const openJsScanSetup = () => setState({ jsScanSetupOpen: true, jsScanText: jsScanDomains().join("\n") });
  const closeJsScanSetup = () => setState({ jsScanSetupOpen: false });
  /** Row count of the active recon view — shown next to the section title. */
  const reconTotal = rv === "ips" ? ipsRows.length : rv === "endpoints" ? endpointTotal : rv === "js" ? jsFilesFiltered.length : hostsList.length;
  /** Wording for that count, matching the active view. */
  const reconTotalLabel = rv === "ips" ? t("Total IPs") : rv === "endpoints" ? t("Total endpoints") : rv === "js" ? t("Total JS files") : t("Total hosts");

  const reconJob = rv === "ips" ? state.ipFarmJob : rv === "js" ? state.jsFarmJob : rv === "hosts" ? state.hostFarmJob : null;
  const reconProgress = isFarmJobInFlight(reconJob?.status ?? "")
    ? `${rv === "js" ? t("Scanning") : t("Probing")} ${reconJob?.targets_total ?? ""} ${rv === "ips" ? t("IPs") : rv === "js" ? t("domains…") : t("hosts…")}`
    : (rv === "js" ? state.apiJsFiles === null : state.hostsLoading) ? t("Loading…") : null;

  /* Retuning a filter reseeds the editable pane from what the filter left on
     screen. Hand edits are dropped on purpose: the filters are the coarse
     selection and the pane the fine one, so the coarse one has to win. Only the
     filter inputs are deps — a background hosts refresh must not wipe edits. */
  useEffect(() => {
    if (!state.exportPageOpen) return;
    setStateRaw((s) => {
      const next = exportLinesFor(s.exportScope).join("\n");
      return s.exportText === next ? s : { ...s, exportText: next };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.exportPageOpen, state.exportScope, state.hostQuery, state.hostFilters, state.ipQuery, state.epHostQuery, state.epPathQuery, state.epMethods]);

  /* Same contract as the export reseed above: the JS scan page's host filters are
     the coarse pick, the domain list the fine one, so retuning a filter reseeds the
     list. Deps are only the host filters — a background hosts refresh must not wipe
     hand edits. */
  useEffect(() => {
    if (!state.jsScanSetupOpen) return;
    setStateRaw((s) => {
      const next = jsScanDomains().join("\n");
      return s.jsScanText === next ? s : { ...s, jsScanText: next };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.jsScanSetupOpen, state.hostQuery, state.hostFilters]);

  // The chip shows the project's real status (active / freeze / …), not the
  // coarse active-vs-archived split the tabs use.
  const stCh = PROJ_STATUS[projRow?.status ?? "active"] ?? PROJ_STATUS.active;

  const sectionLabel =
    sec === "hosts"
      ? ({ hosts: "Hosts", ips: "IPs", endpoints: "Endpoints", js: "JS scan" } as Record<string, string>)[rv] || "Hosts"
      : ({ overview: "Overview", vulns: "Issues", notes: "Notes", creds: "Creds", members: "Members", activity: "Activity" } as Record<string, string>)[sec] || "Overview";
  /** The item open inside the section, if any — the last crumb (e.g. the note's title). */
  const crumbLeaf =
    // The recon full-page forms are crumbs of their own: Project / Hosts / Export,
    // which makes the middle crumb the way back to the list.
    sec === "hosts" && state.exportPageOpen
      ? t("Export")
      : sec === "hosts" && state.hostImportOpen
        ? t("Add hosts")
        : sec === "hosts" && state.ipImportOpen
        ? t("Add IPs")
        : sec === "hosts" && state.epImportOpen
        ? t("Add endpoints")
        : sec === "hosts" && rv === "js" && state.jsScanSetupOpen
        ? t("Choose domains")
        : sec === "hosts" && rv === "js" && _jsd
        ? fileBase(_jsd.url)
        : sec === "hosts" && rv === "js" && _jsHost
        ? _jsHost
        : sec === "notes" && state.noteEditorOpen
          ? (state.noteForm.title.trim() || t("New note"))
          : sec === "notes" && state.openNoteId != null
          ? d.notes.find((n) => n.id === state.openNoteId)?.title ?? ""
          : sec === "vulns" && state.openVulnId != null
            ? d.vulns.find((v) => v.id === state.openVulnId)?.title ?? ""
            : sec === "hosts" && _hd
              ? _hd.host
              : sec === "hosts" && _ipd
                ? _ipd.ip
                : "";

  // ---- editor fields (options that depend on live data are filled in here) ----
  let efCfg = EDITOR_FIELDS[state.editorType] ?? [];
  if (state.editorType === "member") {
    const existing = d.members.map((m) => m.name);
    const avail = state.workspaceUsers.filter((u) => !existing.includes(u.name));
    efCfg = efCfg.map((f) => (f.k === "userKey" ? { ...f, opts: avail.map((u) => u.key) } : f));
  }
  if (state.editorType === "vuln") {
    // On add we ask for just Title + Host — severity/status get sensible defaults
    // and everything else is filled on the finding's detail card, where we redirect.
    // On edit, severity is driven by the CVSS vector afterwards, so drop it here too.
    if (state.editorMode === "add") efCfg = efCfg.filter((f) => f.k === "title" || f.k === "host");
    else efCfg = efCfg.filter((f) => f.k !== "sev");
    // A finding must point at a real host — the picker offers the project's hosts.
    efCfg = efCfg.map((f) => (f.k === "host" ? { ...f, opts: hosts.map((h) => h.host) } : f));
  }
  // IPs and endpoints hang off a host, so their pickers list the project's hosts.
  if (state.editorType === "ip" || state.editorType === "endpoint") {
    efCfg = efCfg.map((f) => (f.k === "hostName" ? { ...f, opts: hosts.map((h) => h.host) } : f));
  }
  if (state.editorType === "ip" && state.editorMode === "edit") efCfg = efCfg.filter((field) => field.k === "ip");
  // Cred host binds to a project host — same validated picker as members (the
  // save resolves the typed value against the project's hosts).
  if (state.editorType === "cred") {
    efCfg = efCfg.map((f) => (f.k === "host" ? { ...f, opts: hosts.map((h) => h.host) } : f));
    // On edit the password is intentionally blank — say what leaving it blank does.
    if (state.editorMode === "edit") {
      efCfg = efCfg.map((f) => (f.k === "password" ? { ...f, ph: "leave blank to keep the current password" } : f));
    }
  }
  const editorFields = efCfg.map((f) => {
    /* `sub` is the secondary line of a suggestion (a user's email); selects only
       ever render `label`, so widening the shape here leaves them untouched. */
    const options = (f.opts ?? []).map((o) => ({
      value: o,
      // Selects title-case their options (up → Up); combos (hosts, usernames)
      // show the value verbatim — capitalising a hostname would misrepresent it.
      label: f.type === "select" ? t(cap(o)) : o,
      sub: f.k === "userKey" ? state.workspaceUsers.find((u) => u.key === o)?.email ?? "" : "",
    }));
    const typed = fstr(state.editorForm[f.k]);
    const q = typed.trim().toLowerCase();
    /* Suggestions are ranked, not just filtered: typing "ad" puts every ad*
       nickname first, then any other hit on the nickname or email. Capped at
       COMBO_MAX so the list stays scannable instead of dumping the workspace. */
    const suggestions = options
      .map((o) => {
        if (!q) return { o, rank: 0 };
        if (o.value.toLowerCase().startsWith(q)) return { o, rank: 0 };
        if (`${o.value} ${o.sub}`.toLowerCase().includes(q)) return { o, rank: 1 };
        return null;
      })
      .filter((x): x is { o: (typeof options)[number]; rank: number } => x !== null)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, COMBO_MAX)
      .map((x) => x.o);
    const hi = Math.min(state.comboHi, Math.max(suggestions.length - 1, 0));
    const pick = (v: string) => setState({ editorForm: { ...state.editorForm, [f.k]: v }, comboOpen: null, comboHi: 0 });
    return {
      key: f.k,
      label: f.label,
      isText: f.type === "text",
      isTextarea: f.type === "textarea",
      isSelect: f.type === "select",
      isTags: f.type === "tags",
      isCombo: f.type === "combo",
      value: typed,
      placeholder: f.ph || "",
      onInput: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateForm(f.k, e.target.value),
      tagDraft: state.tagDrafts[f.k] || "",
      onTagDraft: (e: ChangeEvent<HTMLInputElement>) => setTagDraft(f.k, e.target.value),
      onTagKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addEditorTag(f.k, e.currentTarget.value);
        }
      },
      tags: (Array.isArray(state.editorForm[f.k]) ? (state.editorForm[f.k] as string[]) : []).map((t, ti) => ({ value: t, onRemove: () => removeEditorTag(f.k, ti) })),
      options,
      // ---- combo (type-to-search) ----
      suggestions: suggestions.map((o, i) => ({ ...o, active: i === hi, onPick: () => pick(o.value) })),
      comboOpen: state.comboOpen === f.k && suggestions.length > 0,
      onComboInput: (e: ChangeEvent<HTMLInputElement>) => {
        updateForm(f.k, e.target.value);
        setState({ comboOpen: f.k, comboHi: 0 });
      },
      onComboFocus: () => setState({ comboOpen: f.k, comboHi: 0 }),
      onComboBlur: () => setState({ comboOpen: null }),
      onComboKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (state.comboOpen !== f.k || suggestions.length === 0) {
          if (e.key === "ArrowDown") setState({ comboOpen: f.k, comboHi: 0 });
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setState({ comboHi: (hi + 1) % suggestions.length });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setState({ comboHi: (hi - 1 + suggestions.length) % suggestions.length });
        } else if (e.key === "Enter") {
          e.preventDefault();
          pick(suggestions[hi].value);
        } else if (e.key === "Escape") {
          setState({ comboOpen: null });
        }
      },
    };
  });

  const so = secStyle("overview");
  const sh = secStyle("hosts");
  const sv = secStyle("vulns");
  const sn = secStyle("notes");
  const scr = secStyle("creds");
  const sm = secStyle("members");
  const sa = secStyle("activity");

  const vd = state.vulnDetailForm;
  const detailFinding = d.vulns.find((finding) => finding.id === state.openVulnId);
  const vdCvss = computeCvss4(vd.vector);
  const vdSev: Severity = vdCvss ? vdCvss.sev : "unrealized";
  const vdScore = vdCvss ? vdCvss.score.toFixed(1) : "—";

  const pfNav = (tab: ProfileTab): CSSProperties =>
    state.profileTab === tab ? { background: "var(--st-accent-soft)", color: "var(--st-accent)", boxShadow: "inset 3px 0 0 var(--st-accent)" } : { background: "transparent", color: "var(--st-text-2)", boxShadow: "inset 3px 0 0 transparent" };

  // ================================================================= RENDER

  // Футер «+N more» под усечённым большим списком (остальное — за фильтром).
  const capNote = (total: number, shown: number): ReactNode =>
    total > shown ? (
      <div style={{ padding: "16px 20px", textAlign: "center", color: "var(--st-text-faint)", fontSize: 13 }}>
        +{total - shown} {t("more — narrow the filter to see the rest")}
      </div>
    ) : null;

  const eyebrow = (crumbs: { label: string; onClick?: () => void; muted?: boolean }[]): ReactNode => (
    <div className="mono" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--st-text-faint)", fontWeight: 700, marginBottom: 10 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--st-accent)" }} />
      {crumbs.map((c, i) => {
        // Все уровни кроме последнего — синие (как ссылки), последний — серый.
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} style={{ display: "contents" }}>
            {i > 0 && <span>/</span>}
            <span className={c.onClick ? "clk" : undefined} onClick={c.onClick} style={{ cursor: c.onClick ? "pointer" : undefined, color: isLast ? "var(--st-text-3)" : "var(--st-accent-2)" }}>
              {t(c.label)}
            </span>
          </span>
        );
      })}
    </div>
  );

  // ---------- Projects list ----------
  const renderProjects = () => (
    <div className="route" style={{ padding: "40px 48px 36px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 800, letterSpacing: "-1px", color: "var(--st-text)" }}>{t("Projects")}</h1>
          <div style={{ fontSize: 15, color: "var(--st-text-3)", marginTop: 8 }}>
            {isActive ? `${t("Showing active projects")} · ${activeCount} ${t("active")}` : `${t("Showing archived projects")} · ${archivedCount} ${t("archived")}`}
          </div>
        </div>
        {canCreateProjects && <button className="clk" onClick={openNewProject} style={{ display: "flex", alignItems: "center", gap: 9, height: 46, padding: "0 22px", border: "none", borderRadius: 13, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 14px Inter,sans-serif" }}>
          <Icon name="plus" size={17} sw={2.4} />
          {t("New project")}
        </button>}
      </div>

      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,180px),1fr))", gap: 16, margin: "26px 0 22px" }}>
        {[
          { icon: "trend-up" as const, iconColor: "var(--st-accent-2)", label: "Active", value: String(activeCount), spark: cumulativeSpark(projCreatedTimes(activeRows), ...projWindow(activeRows)), stroke: "var(--st-accent-2)", w: 111 },
          { icon: "archive" as const, iconColor: "var(--st-text-3)", label: "Archived", value: String(archivedCount), spark: cumulativeSpark(projCreatedTimes(archivedRows), ...projWindow(archivedRows)), stroke: "var(--st-text-faint)", w: 111 },
          { icon: "clock" as const, iconColor: "var(--st-danger)", label: "Open issues", value: String(tabProjects.reduce((s, p) => s + p.openFindings, 0)), spark: cumulativeSpark(aggOpenVulnTimes(tabProjects), ...projWindow(tabProjects)), stroke: "var(--st-danger)", w: 111 },
          { icon: "star" as const, iconColor: "var(--st-accent-2)", label: "Projects", value: String(tabProjects.length), spark: cumulativeSpark(projCreatedTimes(tabProjects), ...projWindow(tabProjects)), stroke: "var(--st-accent-muted)", w: 111 },
          { icon: "server" as const, iconColor: "var(--st-success)", label: "Hosts", value: String(tabProjects.reduce((s, p) => s + p.hostsCount, 0)), spark: cumulativeSpark(aggHostTimes(tabProjects), ...projWindow(tabProjects)), stroke: "var(--st-success)", w: 111 },
        ].map((c) => (
          <div key={t(c.label)} className="statc" style={{ ...CARD, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--st-text-3)", font: "600 11.5px Inter,sans-serif", letterSpacing: ".5px", textTransform: "uppercase" }}>
              <Icon name={c.icon} size={15} color={c.iconColor} sw={2.1} />
              {t(c.label)}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 8 }}>
              <div className="mono" style={{ fontWeight: 800, fontSize: 26, color: "var(--st-text)", lineHeight: 1, letterSpacing: "-1px" }}>{c.value}</div>
              <svg width={c.w} height="30" viewBox={`0 0 ${c.w} 30`} fill="none" style={{ flex: "0 1 111px", maxWidth: "60%", minWidth: 0 }}>
                <polygon points={sparkArea(c.spark, c.w)} fill={c.stroke} fillOpacity={0.15} />
                <polyline points={c.spark} stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div className={`tab${isActive ? " on" : ""}`} onClick={() => setState({ tab: "active" })} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 15px", borderRadius: 11, font: "700 13.5px Inter,sans-serif" }}>
            <Icon name="trend-up" size={15} sw={2.2} />
            {t("Active")}
            <span className="mono" style={{ minWidth: 20, height: 20, padding: "0 5px", borderRadius: 6, background: isActive ? "var(--st-accent-2)" : "var(--st-accent-soft)", color: isActive ? "var(--st-on-accent)" : "var(--st-accent-2)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{activeCount}</span>
          </div>
          <div className={`tab${!isActive ? " on" : ""}`} onClick={() => setState({ tab: "archived" })} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 15px", borderRadius: 11, font: "700 13.5px Inter,sans-serif" }}>
            <Icon name="archive" size={15} />
            {t("Archived")}
            <span className="mono" style={{ minWidth: 20, height: 20, padding: "0 5px", borderRadius: 6, background: !isActive ? "var(--st-accent-2)" : "var(--st-accent-soft)", color: !isActive ? "var(--st-on-accent)" : "var(--st-accent-2)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{archivedCount}</span>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <label className="fq" style={{ position: "relative", display: "flex", alignItems: "center", width: 280 }}>
          <svg style={{ position: "absolute", left: 13 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--st-text-faint)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <input placeholder={t("Filter projects…")} value={state.query} onChange={(e) => setState({ query: e.target.value })} />
        </label>
        <button type="button" className="clk iconbtn sort-filter" onClick={() => setState((s) => ({ projSort: s.projSort === "first" ? "last" : "first" }))} style={{ display: "flex", alignItems: "center", gap: 9, height: 40, width: 172, flexShrink: 0, justifyContent: "center", boxSizing: "border-box", padding: "0 16px", border: "1px solid transparent", borderRadius: 20, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>
          <Icon name={state.projSort === "first" ? "sort-asc" : "sort-desc"} size={16} />
          {state.projSort === "first" ? t("First updated") : t("Last updated")}
        </button>
      </div>

      {/* table */}
      <div style={{ ...CARD, overflow: "hidden" }}>
        {projRows.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "48px minmax(0,2fr) minmax(0,1fr) 150px 70px", padding: "13px 22px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".6px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
            <div>#</div>
            <div>{t("Project")}</div>
            <div>{t("Findings")}</div>
            <div>{t("Updated")}</div>
            <div style={{ textAlign: "right" }}>{t("Actions")}</div>
          </div>
        )}
        {projRows.map((r, i) => {
          const fsev = r.openFindings === 0 ? FINDING_SEV.none : r.openFindings >= 3 ? FINDING_SEV.high : FINDING_SEV.med;
          const findingsLabel = r.openFindings === 0 ? (r.totalFindings > 0 ? t("No open") : t("No findings")) : `${r.openFindings} ${t("open")}`;
          return (
            <div key={r.id} className="prow clk" onClick={() => openProject(r.id)} style={{ display: "grid", gridTemplateColumns: "48px minmax(0,2fr) minmax(0,1fr) 150px 70px", alignItems: "center", padding: "11px 22px", borderBottom: "1px solid var(--st-divider)" }}>
              <div className="mono" style={{ color: "var(--st-text-faint)", fontSize: 13, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ minWidth: 0, paddingRight: 12 }}>
                <div style={{ font: "700 14.5px Inter,sans-serif", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
              </div>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, background: fsev.fBg, color: fsev.fColor, font: "600 12px Inter,sans-serif" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: fsev.fDot }} />
                  {findingsLabel}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "var(--st-text-3)" }}>{relTime(r.updated)}</div>
              {/* Правки доступны участникам; удаление — admin / создателю / lead-участнику. */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                {authUser != null && (
                  <Tip label={t("Edit")}><div className="actbtn" onClick={(e) => { e.stopPropagation(); openProjEditRow(r); }}><Icon name="edit" size={15} /></div></Tip>
                )}
                {canDeleteProjectRow(r) && (
                  <Tip label={t("Delete")}><div className="actbtn del" onClick={(e) => { e.stopPropagation(); askDeleteProject(r); }}><Icon name="trash" size={15} /></div></Tip>
                )}
              </div>
            </div>
          );
        })}
        {state.projectsLoading && projRows.length === 0 && <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("Loading projects…")}</div>}
        {state.projectsError && <div style={{ padding: 52, textAlign: "center", color: "var(--st-danger)", fontSize: 14 }}>{state.projectsError}</div>}
        {!state.projectsLoading && !state.projectsError && projRows.length === 0 && <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("No projects found.")}</div>}
      </div>
    </div>
  );

  // ---------- Tasks (Task Tracker пространство APPSEC, read-only) ----------
  // Категория статуса → подпись и цвет точки/чипа (одинаково в списке и карточке).
  // Категории Task Tracker (Works): ожидание — серый, в работе — синий, завершено — зелёный.
  const TASK_CAT: Record<TaskTrackerTaskCategory, { label: string; color: string }> = {
    todo: { label: "Waiting", color: "var(--st-text-3)" },
    inprogress: { label: "In progress", color: "var(--st-accent-2)" },
    done: { label: "Done", color: "var(--st-success)" },
    unknown: { label: "Unknown", color: "var(--st-text-faint)" },
  };
  /* Статус задачи из трекера (напр. "IN PROGRESS", "PROBLEM ANALYSIS") приводим к
     нашему VStatus, чтобы локализовать и покрасить по тем же правилам, что и находки.
     Неизвестный статус — показываем как есть с цветом категории. */
  const taskStatusVs = (raw: string): VStatus | null => {
    const k = (raw || "").trim().toLowerCase().replace(/\s+/g, "_");
    return (VSTATUS_ORDER as string[]).includes(k) ? (k as VStatus) : null;
  };
  const TASK_COLS = "110px minmax(0,2fr) minmax(0,150px) 90px minmax(0,140px) 120px 64px";

  /** Загружает полную карточку APPSEC и открывает чистый черновик проекта.
   * Переносит логин исполнителя и все версии. Поздние ответы после навигации
   * игнорируются; ошибка оставляет форму закрытой и показывает уведомление.
   */
  const createProjectFromTask = async (task: TaskTrackerTask) => {
    if (!canCreateProjects) return;
    const request = ++taskProjectRequest.current;
    setState({ tasksCreatingKey: task.key });
    try {
      // Use the same full AS21 unit as the task card, rather than a partial list row.
      const detail = await apiGetTask(task.key);
      if (request !== taskProjectRequest.current) return;
      if (detail.key !== task.key) throw new Error(t("Couldn't load this task"));
      if (detail.project_exists) {
        pushToast(t("A project already exists for this ticket"), "error");
        reloadTasks();
        return;
      }
      setState({ ...emptyProjectDraft(), newName: detail.summary.slice(0, 255), modalOpen: true, newAppsec: {
        ...EMPTY_APPSEC,
        appsec_ticket_url: detail.url || task.url,
        appsec_ticket_key: detail.key,
        appsec_assignee: detail.assignee_username ?? null,
        appsec_assignee_name: detail.assignee_username ? detail.assignee : null,
        ...appsecMetadataFromTask(detail),
      } });
    } catch (error) {
      if (request === taskProjectRequest.current) pushToast(getApiErrorMessage(error, "Couldn't load this task"), "error");
    } finally {
      if (request === taskProjectRequest.current) setState({ tasksCreatingKey: null });
    }
  };

  const renderTasks = () => {
    if (state.tasksOpenKey) return renderTaskDetail();
    const rows = state.tasksRows ?? [];
    const isDone = (task: TaskTrackerTask) => task.status_category === "done" || ["paused", "на паузе"].includes(task.status.trim().toLowerCase());
    const activeCount = state.tasksActiveTotal ?? rows.filter((task) => !isDone(task)).length;
    const closedCount = state.tasksClosedTotal ?? rows.filter(isDone).length;
    const isActive = state.tasksTab === "active";
    // Категория, поиск и сортировка применяются на сервере до лимита 20.
    const filtered = rows;
    const firstLoad = state.tasksLoading && state.tasksRows === null;
    return (
      <div className="route" style={{ padding: "40px 48px 36px", width: "100%" }}>
        {eyebrow([{ label: "Workspace", onClick: selProjects }, { label: "Tasks", muted: true }])}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-.7px", color: "var(--st-text)" }}>{t("Tasks")}</h1>
            {rows.some((task) => task.is_demo) && <div style={{ marginTop: 6, fontSize: 12, color: "var(--st-text-faint)" }}>{t("Demo data")}</div>}
          </div>
          <button
            className="clk"
            onClick={reloadTasks}
            disabled={state.tasksRefreshing || firstLoad}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, padding: "0 18px", border: "none", borderRadius: 10, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", cursor: state.tasksRefreshing || firstLoad ? "default" : "pointer", opacity: state.tasksRefreshing || firstLoad ? 0.6 : 1 }}
          >
            <Icon name="refresh" size={15} sw={2.2} />{t("Refresh")}
          </button>
        </div>
        {/* Вкладки Active/Closed (closed = завершённые статусы) + поиск + сортировка по дате (как в Projects). */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div className={`tab${isActive ? " on" : ""}`} onClick={() => setState({ tasksTab: "active" })} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 15px", borderRadius: 11, font: "700 13.5px Inter,sans-serif" }}>
              <Icon name="trend-up" size={15} sw={2.2} />{t("Active")}
              <span className="mono" style={{ minWidth: 20, height: 20, padding: "0 5px", borderRadius: 6, background: isActive ? "var(--st-accent-2)" : "var(--st-accent-soft)", color: isActive ? "var(--st-on-accent)" : "var(--st-accent-2)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{activeCount}</span>
            </div>
            <div className={`tab${!isActive ? " on" : ""}`} onClick={() => setState({ tasksTab: "closed" })} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 15px", borderRadius: 11, font: "700 13.5px Inter,sans-serif" }}>
              <Icon name="archive" size={15} />{t("Closed")}
              <span className="mono" style={{ minWidth: 20, height: 20, padding: "0 5px", borderRadius: 6, background: !isActive ? "var(--st-accent-2)" : "var(--st-accent-soft)", color: !isActive ? "var(--st-on-accent)" : "var(--st-accent-2)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{closedCount}</span>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          {searchBox(t("Filter tasks by title…"), state.tasksQuery, (v) => setState({ tasksQuery: v }), 280)}
          <button type="button" className="clk iconbtn sort-filter" onClick={() => setState((s) => ({ tasksSort: s.tasksSort === "first" ? "last" : "first" }))} style={{ display: "flex", alignItems: "center", gap: 9, height: 40, width: 172, flexShrink: 0, justifyContent: "center", boxSizing: "border-box", padding: "0 16px", border: "1px solid transparent", borderRadius: 20, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>
            <Icon name={state.tasksSort === "first" ? "sort-asc" : "sort-desc"} size={16} />{state.tasksSort === "first" ? t("First updated") : t("Last updated")}
          </button>
        </div>
        <div className="task-list" aria-busy={state.tasksLoading} style={{ ...CARD, overflow: "hidden" }}>
          {filtered.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: TASK_COLS, gap: 10, padding: "13px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
              <div>{t("Key")}</div><div>{t("Summary")}</div><div>{t("Status")}</div><div>{t("Priority")}</div><div>{t("Assignee")}</div><div>{t("Updated")}</div><div style={{ textAlign: "center" }}>{t("Actions")}</div>
            </div>
          )}
          {firstLoad && <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("Loading tasks…")}</div>}
          {!state.tasksLoading && state.tasksError && (
            <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-3)", fontSize: 14 }}>{state.tasksError}</div>
          )}
          {!firstLoad && !state.tasksError && filtered.map((task) => {
            const catc = TASK_CAT[task.status_category] ?? TASK_CAT.unknown;
            const tvs = taskStatusVs(task.status);
            const stColor = tvs ? VSTATUS[tvs] : catc.color;
            const stText = tvs ? t(VSTATUS_LABEL[tvs]) : task.status;
            // Уже есть проект с этим тикетом? Тогда вместо «+» — ссылка на проект.
            const linkedProject = allProjects.find((p) => p.appsec_ticket_key === task.key);
            const projectExists = task.project_exists ?? Boolean(linkedProject);
            const projectId = task.project_exists !== undefined ? task.project_id : linkedProject?.id;
            return (
              <div key={task.key} className="prow clk" onClick={() => setState({ tasksOpenKey: task.key })} style={{ display: "grid", gridTemplateColumns: TASK_COLS, alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid var(--st-divider)" }}>
                <a className="clk mono keylink" href={task.url ?? "#"} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} title={t("Open in Task Tracker")} style={{ fontSize: 12.5, color: "var(--st-accent-2)", fontWeight: 700, justifySelf: "start" }}>{task.key}</a>
                <div style={{ font: "600 14px Inter,sans-serif", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.summary}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, font: "600 12px Inter,sans-serif", color: stColor, overflow: "hidden" }}><span style={{ width: 6, height: 6, flex: "none", borderRadius: "50%", background: stColor }} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stText}</span></div>
                <div style={{ fontSize: 12.5, color: "var(--st-text-2)" }}>{task.priority || "—"}</div>
                <div style={{ fontSize: 12.5, color: "var(--st-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.assignee?.trim().split(/\s+/).slice(0, 2).join(" ") || "—"}</div>
                <div className="mono" style={{ fontSize: 11.5, color: "var(--st-text-faint)" }}>{relTime(task.updated)}</div>
                <div onClick={(event) => event.stopPropagation()} style={{ display: "flex", justifyContent: "center" }}>
                  {projectExists ? (
                    <Tip label={t(projectId != null ? "Open linked project" : "No access to linked project")}><button type="button" className="actbtn" aria-label={t(projectId != null ? "Open linked project" : "No access to linked project")} disabled={projectId == null} onClick={(e) => { e.stopPropagation(); if (projectId != null) setState({ nav: "projects", view: "detail", openProjectId: projectId, section: "overview", expanded: [], openVulnId: null, openNoteId: null, accessDenied: false }); }}><Icon name="folder" size={15} /></button></Tip>
                  ) : (
                    <Tip label={t(canCreateProjects ? "Create project from this ticket" : "Only lead or admin can create projects")}><button type="button" className="actbtn" aria-label={t("Create project from this ticket")} disabled={!canCreateProjects || Boolean(state.tasksCreatingKey)} aria-busy={state.tasksCreatingKey === task.key} onClick={(e) => { e.stopPropagation(); void createProjectFromTask(task); }}><Icon name="plus" size={15} /></button></Tip>
                  )}
                </div>
              </div>
            );
          })}
          {!firstLoad && !state.tasksError && filtered.length === 0 && (
            <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>
              {rows.length === 0 ? t("No tasks in the AppSec space yet.") : t("No tasks match these filters.")}
            </div>
          )}
          {!firstLoad && !state.tasksError && <div className="tasks-pagination">
            {state.tasksNextPage && <button type="button" className="clk tasks-load-more" disabled={state.tasksLoading} onClick={() => loadTasks(true)}>{state.tasksLoading ? t("Loading tasks…") : t("Show {count} more", { count: Math.min(20, Math.max(0, (state.tasksTotal ?? rows.length+20)-rows.length)) })}</button>}
            <span className="tasks-pagination-count">{state.tasksTotal != null ? t("Showing {shown} of {total}", { shown: filtered.length, total: state.tasksTotal }) : t("Showing {shown}", { shown: filtered.length })}</span>
          </div>}
        </div>
      </div>
    );
  };

  const renderTaskDetail = () => {
    const d = state.tasksDetail;
    const catc = d ? TASK_CAT[d.status_category] ?? TASK_CAT.unknown : TASK_CAT.unknown;
    const dtvs = d ? taskStatusVs(d.status) : null;
    const dStColor = dtvs ? VSTATUS[dtvs] : catc.color;
    const dStText = dtvs ? t(VSTATUS_LABEL[dtvs]) : d?.status ?? "";
    // Строка «Параметров» в стиле Works: подпись слева, значение справа.
    const sideRow = (label: string, value: ReactNode) => (
      <div style={{ display: "grid", gridTemplateColumns: "92px 1fr", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--st-divider)", alignItems: "baseline" }}>
        <div style={{ fontSize: 12, color: "var(--st-text-faint)", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13, color: "var(--st-text)", wordBreak: "break-word", minWidth: 0 }}>{value}</div>
      </div>
    );
    const backToTasks = () => setState({ tasksOpenKey: null, tasksDetail: null, tasksDetailError: null });
    return (
      <div className="route" style={{ padding: "40px 48px 36px", width: "100%" }}>
        {eyebrow([{ label: "Workspace", onClick: selProjects }, { label: "Tasks", onClick: backToTasks }, { label: d?.key ?? state.tasksOpenKey ?? "", muted: true }])}
        {/* Шапка — как у карточки уязвимости: заголовок секции + действие на одной линии, «назад» ниже. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-.7px", color: "var(--st-text)" }}>{t("Tasks")}</h1>
          {d && (
            <a className="clk" href={d.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 16px", borderRadius: 11, border: "none", background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", textDecoration: "none" }}>
              <Icon name="link" size={15} color="var(--st-on-accent)" />{t("Open in Task Tracker")}
            </a>
          )}
        </div>
        <div style={{ marginBottom: 18 }}>
          <span className="clk" onClick={backToTasks} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 12.5px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 20, padding: "7px 13px", cursor: "pointer" }}>
            <Icon name="chevron-left" size={15} />{t("All tasks")}
          </span>
        </div>
        {state.tasksDetailLoading && <div style={{ ...CARD, padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("Loading task…")}</div>}
        {!state.tasksDetailLoading && state.tasksDetailError && (
          <div style={{ ...CARD, padding: 52, textAlign: "center", color: "var(--st-text-3)", fontSize: 14 }}>{t(state.tasksDetailError)}</div>
        )}
        {!state.tasksDetailLoading && !state.tasksDetailError && d && (
          <div style={{ ...CARD, overflow: "hidden" }}>
            <div className="task-detail-grid" style={{ display: "grid" }}>
              {/* Основная колонка: ключ, статус, заголовок, описание (как в TaskTracker — слева). */}
              <div style={{ padding: "26px 30px", minWidth: 0 }}>
                <h1 style={{ margin: "0 0 22px", fontSize: 25, fontWeight: 800, letterSpacing: "-.5px", color: "var(--st-text)", lineHeight: 1.2 }}>{d.summary}</h1>
                <div className="mono" style={{ fontSize: 10.5, letterSpacing: 1, color: "var(--st-text-faint)", fontWeight: 700, textTransform: "uppercase" }}>{t("Description")}</div>
                <div style={{ marginTop: 10, whiteSpace: "pre-wrap", font: "400 14px/1.7 Inter,sans-serif", color: "var(--st-text)", wordBreak: "break-word" }}>{(d.description || "").trim() || t("No description.")}</div>
              </div>
              {/* Сайдбар деталей (как в TaskTracker — справа). */}
              <div className="task-detail-side" style={{ borderLeft: "1px solid var(--st-divider)", background: "var(--st-elevated)", padding: "24px" }}>
                <div style={{ font: "800 13px Inter,sans-serif", color: "var(--st-text)", marginBottom: 4 }}>{t("Details")}</div>
                {sideRow(t("Key"), <a className="clk mono keylink" href={d.url} target="_blank" rel="noreferrer" title={t("Open in Task Tracker")} style={{ fontSize: 12.5, fontWeight: 700, color: "var(--st-accent-2)", textDecoration: "none" }}>{d.key}</a>)}
                {sideRow(t("Status"), <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "700 11px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".4px", color: dStColor }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: dStColor }} />{dStText}</span>)}
                {sideRow(t("Type"), d.issue_type || "—")}
                {sideRow(t("Priority"), d.priority || "—")}
                {sideRow(t("Assignee"), d.assignee || "—")}
                {sideRow(t("Affected versions"), (d.affected_versions ?? []).length ? <div style={{ display: "grid", gap: 5 }}>{d.affected_versions!.map((version) => <span key={version.code}>{version.name}</span>)}</div> : "—")}
                {sideRow(t("Reporter"), d.reporter || "—")}
                {sideRow(t("Created"), fmtDateTime(d.created))}
                {sideRow(t("Updated"), fmtDateTime(d.updated))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ---------- Workspace members (admin) ----------
  const renderWorkspaceMembers = () => (
    <div className="route" style={{ padding: "40px 48px 36px", width: "100%" }}>
      {eyebrow([{ label: "Workspace", onClick: selProjects }, { label: "Members", muted: true }])}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-.7px", color: "var(--st-text)" }}>{t("Members")}</h1>
        </div>
        <button className="clk" onClick={() => openWSUserEditor("add", -1)} style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 18px", border: "none", borderRadius: 11, background: "var(--st-accent)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: "pointer" }}>
          <Icon name="plus" size={15} sw={2.2} />
          {t("Invite member")}
        </button>
      </div>
      {/* Одна строка управления: вкладки активные/заблокированные — слева (там,
          где раньше был поиск по пользователям), поиск и фильтры — справа. */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
        <div className={`tab${state.wsUserTab === "active" ? " on" : ""}`} onClick={() => setState({ wsUserTab: "active" })} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 15px", borderRadius: 11, font: "700 13.5px Inter,sans-serif" }}>
          <Icon name="unlock" size={15} sw={2.2} />
          {lang === "ru" ? "Активные" : t("Active")}
          <span className="mono" style={{ minWidth: 20, height: 20, padding: "0 5px", borderRadius: 6, background: state.wsUserTab === "active" ? "var(--st-accent-2)" : "var(--st-accent-soft)", color: state.wsUserTab === "active" ? "var(--st-on-accent)" : "var(--st-accent-2)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{state.workspaceUsers.filter((u) => !u.locked).length}</span>
        </div>
        <div className={`tab${state.wsUserTab === "archived" ? " on" : ""}`} onClick={() => setState({ wsUserTab: "archived" })} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 15px", borderRadius: 11, font: "700 13.5px Inter,sans-serif" }}>
          <Icon name="lock" size={15} sw={2.2} />
          {lang === "ru" ? "Заблокированные" : t("Blocked")}
          <span className="mono" style={{ minWidth: 20, height: 20, padding: "0 5px", borderRadius: 6, background: state.wsUserTab === "archived" ? "var(--st-accent-2)" : "var(--st-accent-soft)", color: state.wsUserTab === "archived" ? "var(--st-on-accent)" : "var(--st-accent-2)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{state.workspaceUsers.filter((u) => u.locked).length}</span>
        </div>
        <div style={{ flex: 1 }} />
        {/* Поиск переехал сюда — в правую часть строки, вплотную к фильтрам. */}
        <label className="fq" style={{ position: "relative", display: "flex", alignItems: "center", width: 240 }}>
          <svg style={{ position: "absolute", left: 13 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--st-text-faint)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
          <input placeholder={t("Search by username…")} value={state.wsMemberQuery} onChange={(e) => setState({ wsMemberQuery: e.target.value })} />
        </label>
        {/* Every pill toggles; filters combine (AND across groups, OR inside one).
            An empty group means "All", so unpicking the last pill re-selects it. */}
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: 1, color: "var(--st-text-faint)", fontWeight: 700 }}>{t("ROLE")}</span>
        <div className="clk filter-pill" onClick={() => setState({ wsMemberRoles: [] })} style={{ font: "600 12px Inter,sans-serif", padding: "6px 12px", borderRadius: 20, cursor: "pointer", ...vfPill(state.wsMemberRoles.length === 0) }}>{t("All")}</div>
        {([{ label: "Admin", v: "admin" as const }, { label: "User", v: "user" as const }]).map((o) => (
          <div key={o.v} className="clk filter-pill" onClick={() => setState((s) => ({ wsMemberRoles: toggleIn(s.wsMemberRoles, o.v) }))} style={{ font: "600 12px Inter,sans-serif", padding: "6px 12px", borderRadius: 20, cursor: "pointer", ...vfPill(state.wsMemberRoles.includes(o.v)) }}>{t(o.label)}</div>
        ))}
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: 1, color: "var(--st-text-faint)", fontWeight: 700, marginLeft: 8 }}>{t("PROJECT")}</span>
        <div className="clk filter-pill" onClick={() => setState({ wsMemberProjectRoles: [] })} style={{ font: "600 12px Inter,sans-serif", padding: "6px 12px", borderRadius: 20, cursor: "pointer", ...vfPill(state.wsMemberProjectRoles.length === 0) }}>{t("All")}</div>
        {([{ label: "Lead", v: "lead" as const }, { label: "Pentester", v: "pentester" as const }]).map((o) => (
          <div key={o.v} className="clk filter-pill" onClick={() => setState((s) => ({ wsMemberProjectRoles: toggleIn(s.wsMemberProjectRoles, o.v) }))} style={{ font: "600 12px Inter,sans-serif", padding: "6px 12px", borderRadius: 20, cursor: "pointer", ...vfPill(state.wsMemberProjectRoles.includes(o.v)) }}>{t(o.label)}</div>
        ))}
      </div>
      {/* Ожидающие приглашения — это будущие активные участники, показываем их
          только на вкладке «Активные». */}
      {state.wsUserTab === "active" && state.pendingInvites.length > 0 && (
        <div style={{ marginTop: 16, ...CARD, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".6px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
            <Icon name="mail" size={14} color="var(--st-text-faint)" />
            {t("Pending invitations ·")} {state.pendingInvites.length}
          </div>
          {state.pendingInvites.map((inv) => (
            <div key={inv.id} className="prow" style={{ display: "grid", gridTemplateColumns: "1.4fr 168px 150px", alignItems: "center", padding: "13px 20px", borderBottom: "1px solid var(--st-divider)", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                <span style={{ width: 32, height: 32, flex: "none", borderRadius: "50%", background: "var(--st-divider)", color: "var(--st-text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="mail" size={15} color="var(--st-text-3)" /></span>
                <div style={{ minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 12.5, color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.email}</div>
                  {inv.email_error && <div style={{ fontSize: 11, color: "var(--st-danger)", marginTop: 4 }}>{t(errorMessageForCode(inv.email_error_code) ?? ERROR_MESSAGES.mail_unavailable)}</div>}
                  <div style={{ fontSize: 11, color: inv.is_expired ? "var(--st-danger)" : "var(--st-text-3)", fontWeight: 600, marginTop: 2 }}>{inv.is_expired ? t("Link expired — resend it") : t("Pending activation")}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "3px 9px", background: WS_ROLE[inv.role === "admin" ? "admin" : "user"].bg, color: WS_ROLE[inv.role === "admin" ? "admin" : "user"].color }}>{t(WS_ROLE_LABEL[inv.role === "admin" ? "admin" : "user"])}</span>
                <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "3px 9px", background: ROLE[inv.project_role].bg, color: ROLE[inv.project_role].color }}>{inv.project_role}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button className="clk" onClick={() => resendInvite(inv.id)} style={{ height: 30, padding: "0 12px", border: "1px solid var(--st-border-strong)", borderRadius: 8, background: "var(--st-surface)", color: "var(--st-accent)", font: "600 12px Inter,sans-serif", cursor: "pointer" }}>{t("Resend")}</button>
                <Tip label={t("Revoke invitation")}><div className="actbtn del" onClick={() => askRevokeInvite(inv.id, inv.email)} title={t("Revoke invitation")}><Icon name="trash" size={15} /></div></Tip>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 16, ...CARD, overflow: "hidden" }}>
        {(() => {
          const wq = state.wsMemberQuery.trim().toLowerCase();
          const filtered = state.workspaceUsers
            .map((u, idx) => ({ u, idx }))
            .filter(
              ({ u }) =>
                // Вкладка: активные = не заблокированные, архив = деактивированные.
                (state.wsUserTab === "archived" ? u.locked : !u.locked) &&
                (state.wsMemberRoles.length === 0 || state.wsMemberRoles.includes(u.role)) &&
                (state.wsMemberProjectRoles.length === 0 || state.wsMemberProjectRoles.includes(u.projectRole)) &&
                (!wq || u.name.toLowerCase().includes(wq))
            );
          if (filtered.length === 0)
            return (
              <div style={{ padding: 44, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>
                {state.wsUserTab === "archived" ? t("No deactivated members.") : t("No members match.")}
              </div>
            );
          return (
            <>
              {/* Column headers only make sense with rows — hide them when empty. */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 168px 72px", padding: "13px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".6px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
                <div>{t("Name")}</div>
                <div>{t("Email")}</div>
                <div>{t("Role")}</div>
                <div style={{ textAlign: "right" }}>{t("Actions")}</div>
              </div>
              {filtered.map(({ u, idx }) => (
            <div key={u.key + idx} className="prow" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 168px 72px", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--st-divider)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                <UserAvatar name={u.name} src={u.id === authUser?.id ? authUser.avatar_url : u.avatarUrl} initials={avatarLetter(u.name)} size={32} fontSize={13} background={u.locked ? "var(--st-text-faint)" : "var(--st-accent)"} />
                <span style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{u.name}</span>
              </div>
              <div className="mono" style={{ fontSize: 12.5, color: "var(--st-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "3px 9px", background: WS_ROLE[u.role].bg, color: WS_ROLE[u.role].color }}>{t(WS_ROLE_LABEL[u.role])}</span>
                <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "3px 9px", background: ROLE[u.projectRole].bg, color: ROLE[u.projectRole].color }}>{u.projectRole}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Tip label={t("Edit")}><div className="actbtn" onClick={() => openWSUserEditor("edit", idx)}><Icon name="edit" size={15} /></div></Tip>
                {u.locked ? (
                  <Tip label={t("Reactivate user")}><div className="actbtn" title={t("Reactivate user")} onClick={() => reactivateUser(idx)}><Icon name="unlock" size={15} /></div></Tip>
                ) : (
                  <Tip label={t("Block user")}><div className="actbtn del" title={t("Block user")} onClick={() => askDeleteWSUser(idx)}><Icon name="trash" size={15} /></div></Tip>
                )}
              </div>
            </div>
              ))}
            </>
          );
        })()}
      </div>
    </div>
  );

  // ---------- Project detail ----------
  const tabItem = (label: string, icon: Parameters<typeof Icon>[0]["name"], st: { active: boolean }, onClick: () => void, badge?: { text: string; color: string; bg: string }, extra?: ReactNode) => (
    <div className={`clk sectab${st.active ? " on" : ""}`} onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, padding: "15px 15px", marginBottom: -1, whiteSpace: "nowrap", font: "600 14px Inter,sans-serif" }}>
      <Icon name={icon} size={17} />
      {label}
      {extra}
      {badge && <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: badge.color, background: badge.bg, borderRadius: 6, padding: "1px 7px" }}>{badge.text}</span>}
    </div>
  );

  const renderDetail = () => (
    <div className="route" style={{ padding: "0 0 36px", width: "100%" }}>
      {/* tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "0 48px", borderBottom: "1px solid var(--st-border-light)", background: "var(--st-surface)", overflow: "visible" }}>
        {tabItem(t("Overview"), "layout", so, () => setSection("overview"))}
        <div style={{ position: "relative", display: "flex" }}>
          {/* Recon открывает меню, а не раздел напрямую, но выделяется как
              обычная вкладка — той же синей линией снизу, что и соседние. */}
          {tabItem(t("Recon"), "server", sh, toggleReconMenu, undefined, <Icon name="chevron-down" size={14} sw={2.2} />)}
          {/* Full-screen backdrop: a click anywhere outside the popup dismisses it
              (Esc is handled by the global keydown listener). */}
          {state.reconMenuOpen && <div onClick={() => setState({ reconMenuOpen: false })} style={{ position: "fixed", inset: 0, zIndex: 40 }} />}
          <div className={`menu ${state.reconMenuOpen ? "open" : ""}`} style={{ position: "absolute", top: 52, left: 8, width: 214, background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 14, boxShadow: "0 20px 54px rgba(15,27,45,.16)", zIndex: 50, padding: 8, transformOrigin: "top left" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: 1.5, color: "var(--st-text-faint)", fontWeight: 700, padding: "8px 10px" }}>{t("RECON")}</div>
            {([
              { v: "hosts" as const, icon: "server" as const, label: "Hosts", count: hosts.length },
              { v: "ips" as const, icon: "card" as const, label: "IPs", count: ipsRows.length },
              { v: "endpoints" as const, icon: "link" as const, label: "Endpoints", count: endpointTotal },
              { v: "js" as const, icon: "doc" as const, label: "JS", count: jsFiles.length },
            ]).map((it) => {
              // Nothing is highlighted while another section is open: the recon
              // view only counts as active when Recon itself is the open section.
              const on = sec === "hosts" && rv === it.v;
              return (
                <div key={it.v} className={`reconrow clk${on ? " on" : ""}`} onClick={() => selRecon(it.v)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 11px", marginTop: 2, borderRadius: 10, font: "600 13.5px Inter,sans-serif" }}>
                  <Icon name={it.icon} size={17} />
                  {t(it.label)}
                  <span className="mono" style={{ marginLeft: "auto", minWidth: 22, textAlign: "center", fontSize: 11, fontWeight: 700, color: on ? "var(--st-accent)" : "var(--st-text-3)", background: on ? "var(--st-accent-soft)" : "var(--st-hover)", border: `1px solid ${on ? "var(--st-accent-muted)" : "var(--st-border-light)"}`, borderRadius: 6, padding: "1px 6px" }}>{it.count}</span>
                </div>
              );
            })}
          </div>
        </div>
        {tabItem(t("Issues"), "star2", sv, () => setSection("vulns"), { text: String(d.vulns.length), color: sv.badgeColor, bg: sv.badgeBg })}
        {tabItem(t("Notes"), "doc", sn, () => setSection("notes"), { text: String(d.notes.length), color: sn.badgeColor, bg: sn.badgeBg })}
        {tabItem(t("Creds"), "lock", scr, () => setSection("creds"), { text: String(d.creds.length), color: scr.badgeColor, bg: scr.badgeBg })}
        {canViewMembers && tabItem(t("Members"), "users", sm, () => setSection("members"), { text: String(d.members.length), color: sm.badgeColor, bg: sm.badgeBg })}
        {tabItem(t("Activity"), "activity", sa, () => setSection("activity"), { text: String(activityGroups.length), color: sa.color, bg: "var(--st-bg)" })}
      </div>

      <div style={{ padding: "26px 48px 0" }}>
        {/* Project / Section / <open item>. The section stays clickable while an
            item is open, so it is the way back to that section's list. */}
        <div className="mono" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--st-text-faint)", fontWeight: 600, marginBottom: 14 }}>
          <span className="clk" onClick={() => setSection("overview")} style={{ color: "var(--st-accent-2)", cursor: "pointer" }}>{projName}</span>
          <span>/</span>
          {crumbLeaf ? (
            <>
              <span className="clk" onClick={() => setSection(sec)} style={{ color: "var(--st-accent-2)", cursor: "pointer" }}>{sectionLabel}</span>
              <span>/</span>
              {/* Путь находки (Проект / Хост / Finding): все уровни кроме последнего — синие. */}
              {crumbLeaf.split(" / ").map((part, i, arr) => (
                <span key={i} style={{ display: "contents" }}>
                  {i > 0 && <span>/</span>}
                  <span style={{ color: i === arr.length - 1 ? "var(--st-text-3)" : "var(--st-accent-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{part}</span>
                </span>
              ))}
            </>
          ) : (
            <span style={{ color: "var(--st-text-3)" }}>{sectionLabel}</span>
          )}
        </div>

        {/* header row */}
        {sec === "overview" ? (
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 24 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-.8px", color: "var(--st-text)" }}>{d.title || projName}</h1>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: stCh.bg, color: stCh.color, font: "700 12px Inter,sans-serif" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: stCh.dot }} />
                  {t(stCh.label)}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flex: "none" }}>
              <button className="clk" onClick={openExportModal} style={{ height: 42, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-accent-2)", display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Icon name="file-check" size={16} sw={2.2} color="var(--st-accent-2)" />{t("Generate report")}
              </button>
              {canEditProject && (
                <button className="clk" onClick={openProjEdit} style={{ height: 42, padding: "0 18px", border: "none", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="edit" size={16} color="var(--st-on-accent)" />{t("Edit")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-.7px", color: "var(--st-text)" }}>{sectionLabel}</h1>
              {/* Recon total sits next to the section title; the toolbar below keeps
                  search on the left and filters on the right. */}
              {sec === "hosts" && !_hd && !_ipd && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 12.5px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-surface)", border: "1px solid var(--st-border-strong)", borderRadius: 20, padding: "5px 13px" }}>{reconTotalLabel} <b className="mono" style={{ color: "var(--st-text)" }}>{reconTotal}</b></span>
              )}
              {sec === "hosts" && !_hd && !_ipd && reconProgress && <span role="status" aria-label={t("Recon progress")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 12, background: "var(--st-accent-soft)", color: "var(--st-accent)", font: "600 12.5px Inter,sans-serif", whiteSpace: "nowrap" }}><span className="storm-spin" style={{ width: 14, height: 14, flex: "none", borderRadius: "50%", border: "2px solid var(--st-accent)", borderTopColor: "transparent", display: "inline-block" }} />{reconProgress}</span>}
            </div>
            <div style={{ display: "flex", gap: 10, flex: "none" }}>

              {sec === "hosts" && rv === "hosts" && !state.hostImportOpen && !_hd && (
                <>
                  <button className="clk" onClick={() => openReconExport("hosts")} style={{ height: 42, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-accent-2)", display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <Icon name="upload" size={16} sw={2.2} color="var(--st-accent-2)" />{t("Export")}
                  </button>
                  <button className="addbtn clk" onClick={openHostImport} style={{ height: 42 }}>
                    <Icon name="plus" size={15} color="var(--st-on-accent)" sw={2.6} />{t("Add hosts")}
                  </button>
                </>
              )}
              {/* On the open card the primary action becomes "Edit host" — it takes
                  the slot the "Add hosts"/"Add IPs" button held on the list. */}
              {sec === "hosts" && rv === "hosts" && _hd && (
                <button className="addbtn clk" onClick={() => openEditor("host", "edit", hosts.findIndex((x) => x.id === _hd.id))} style={{ height: 42 }}>
                  <Icon name="edit" size={15} color="var(--st-on-accent)" sw={2.4} />{t("Edit host")}
                </button>
              )}
              {/* Each recon view adds the kind of object it lists; the totals row
                  below carries that view's filters. */}
              {sec === "hosts" && rv === "ips" && !state.ipImportOpen && !_ipd && (
                <>
                  <button className="clk" onClick={() => openReconExport("ips")} style={{ height: 42, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-accent-2)", display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <Icon name="upload" size={16} sw={2.2} color="var(--st-accent-2)" />{t("Export")}
                  </button>
                  <button className="addbtn clk" onClick={openIpImport} style={{ height: 42 }}>
                    <Icon name="plus" size={15} color="var(--st-on-accent)" sw={2.6} />{t("Add IPs")}
                  </button>
                </>
              )}
              {/* Редактируется адрес во всех привязках проекта, затем обновляются замеры. */}
              {sec === "hosts" && rv === "ips" && _ipd && (
                <button className="addbtn clk" onClick={() => openEditor("ip", "edit", ipsRows.findIndex((row) => row.ip === _ipd.ip))} style={{ height: 42 }}>
                  <Icon name="edit" size={15} color="var(--st-on-accent)" sw={2.4} />{t("Edit IP")}
                </button>
              )}
              {sec === "hosts" && rv === "endpoints" && state.epImportOpen && (
                <SwaggerEndpointImport disabled={state.epImportBusy} onParsed={importSwaggerEndpoints} />
              )}
              {sec === "hosts" && rv === "endpoints" && !state.epImportOpen && (
                <>
                  <button className="clk" onClick={() => openReconExport("endpoints")} style={{ height: 42, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-accent-2)", display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <Icon name="upload" size={16} sw={2.2} color="var(--st-accent-2)" />{t("Export")}
                  </button>
                  <button className="addbtn clk" onClick={openEpImport} style={{ height: 42 }}>
                    <Icon name="plus" size={15} color="var(--st-on-accent)" sw={2.6} />{t("Add endpoints")}
                  </button>
                </>
              )}
              {/* Opens the domain picker rather than scanning straight away, so the
                  label says what the click does: choose what to scan. */}
              {/* Одна кнопка «Экспорт»: пути или секреты выбираются уже на странице экспорта. */}

              {sec === "hosts" && rv === "js" && !state.jsScanSetupOpen && !state.exportPageOpen && !_jsd && (
                <>
                  <button className="clk" onClick={() => openReconExport("js-endpoints")} style={{ height: 42, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-accent-2)", display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <Icon name="upload" size={15} sw={2.2} color="var(--st-accent-2)" />{t("Export")}
                  </button>
                  <button className="addbtn clk" onClick={openJsScanSetup} disabled={isFarmJobInFlight(state.jsFarmJob?.status ?? "")} style={{ height: 42, opacity: isFarmJobInFlight(state.jsFarmJob?.status ?? "") ? 0.6 : 1 }}>
                    <Icon name="search" size={15} color="var(--st-on-accent)" sw={2.6} />{t("Select domains & scan")}
                  </button>
                </>
              )}
              {sec === "vulns" && state.openVulnId == null && (
                <>
                  <Tip label={stsExportHint}><span className="export-availability" title={stsExportHint}><button className="clk" disabled={!canExportSts} title={stsExportHint} onClick={openBulkTaskTracker} style={{ height: 42, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-accent-2)", display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <Icon name="upload" size={15} sw={2.2} />{t("Export all to Task Tracker")}
                  </button></span></Tip>
                  <button className="addbtn clk" onClick={() => openEditor("vuln", "add", -1)} style={{ height: 42 }}><Icon name="plus" size={15} color="var(--st-on-accent)" sw={2.6} />{t("Add issue")}</button>
                </>
              )}
              {/* В карточке уязвимости кнопка экспорта — на линии заголовка (напротив «Issues»). */}
              {sec === "vulns" && state.openVulnId != null && (
                <>
                  {detailFinding?.trackerUrl ? <a className="addbtn clk" href={detailFinding.trackerUrl} target="_blank" rel="noopener noreferrer" style={{ height: 42, textDecoration: "none" }}><Icon name="eye" size={15} color="currentColor" />{t("Open in Task Tracker")}</a> :
                  <Tip label={findingExportHint(detailFinding?.sev)}><span className="export-availability" title={findingExportHint(detailFinding?.sev)}>
                    <button className="addbtn clk" disabled={!canExportFinding(d.vulns.find((finding) => finding.id === state.openVulnId)?.sev)} onClick={() => state.openVulnId != null && openTaskTrackerExport(state.openVulnId)} style={{ height: 42 }}>
                      <Icon name="upload" size={15} color="currentColor" sw={2.4} />{t("Export to Task Tracker")}
                    </button>
                  </span></Tip>}
                </>
              )}
              {sec === "notes" && (
                <button className="addbtn clk" onClick={() => openNoteEditor("add", -1)} style={{ height: 42 }}><Icon name="plus" size={15} color="var(--st-on-accent)" sw={2.6} />{t("Add note")}</button>
              )}
              {sec === "creds" && (
                <button className="addbtn clk" onClick={() => openEditor("cred", "add", -1)} style={{ height: 42 }}><Icon name="plus" size={15} color="var(--st-on-accent)" sw={2.6} />{t("Add credential")}</button>
              )}
              {sec === "members" && canManageMembers && (
                <button className="addbtn clk" onClick={() => openEditor("member", "add", -1)} style={{ height: 42 }}><Icon name="plus" size={15} color="var(--st-on-accent)" sw={2.6} />{t("Add member")}</button>
              )}
            </div>
          </div>
        )}

        <div style={{ width: "100%" }}>
          {sec === "overview" && renderOverview()}
          {sec === "hosts" && renderRecon()}
          {sec === "vulns" && renderVulns()}
          {sec === "notes" && (state.noteEditorOpen ? renderNoteEditor() : state.openNoteId != null ? renderNoteViewer() : renderNotes())}
          {sec === "creds" && renderCreds()}
          {sec === "members" &&
            (canViewMembers
              ? renderMembers()
              : renderNoAccessPage("The team roster is visible to the admin, the project lead and its creator."))}
          {sec === "activity" && renderActivity()}
        </div>
      </div>
    </div>
  );

  const renderNoAccess = (message: string) => (
    <div className="route" style={{ ...CARD, padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--st-hover)", color: "var(--st-text-faint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="lock" size={22} sw={1.9} />
      </div>
      <div style={{ font: "700 15px Inter,sans-serif", color: "var(--st-text)" }}>{t("Restricted")}</div>
      <div style={{ fontSize: 13, color: "var(--st-text-3)", maxWidth: 360 }}>{message}</div>
    </div>
  );

  /* Shown instead of a whole screen the user may not open: a project the backend
     refuses (403/404), or a section that is not theirs (workspace members, the
     project's team). 404 is folded in on purpose: "not found" and "not yours"
     must be indistinguishable, otherwise the id becomes an existence oracle. */
  const NO_ACCESS_PROJECT = "You don't have access to this project. It's visible to members only — ask an admin or lead to add you to the team.";
  const renderNoAccessPage = (message: string = NO_ACCESS_PROJECT) => (
    <div className="route" style={{ padding: "40px 48px 36px", width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ ...CARD, padding: "56px 40px", maxWidth: 520, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, marginTop: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--st-danger-soft)", color: "var(--st-danger)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="lock" size={28} sw={1.9} />
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-.5px", color: "var(--st-text)" }}>{t("No access")}</h1>
        <div style={{ fontSize: 14, color: "var(--st-text-3)", maxWidth: 380, lineHeight: 1.6 }}>{message}</div>
        <button
          className="clk"
          onClick={selProjects}
          style={{ marginTop: 10, height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: "pointer" }}
        >
          {t("Back to projects")}
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="route">
      <div style={{ ...CARD, padding: "20px 22px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ font: "700 14px Inter,sans-serif", color: "var(--st-text)" }}>{t("Engagement timeline")}</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--st-text-3)" }}>{d.start} → {d.end}</div>
        </div>
        <div style={{ height: 10, borderRadius: 6, background: "var(--st-bg)", overflow: "hidden" }}>
          <div style={{ width: `${d.progress}%`, height: "100%", background: "linear-gradient(90deg,var(--st-accent-2),var(--st-accent-2))", borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--st-text-faint)" }}>{t("Start")}</span>
          <span style={{ font: "600 12px Inter,sans-serif", color: "var(--st-text-2)" }}>{d.progress}{t("% elapsed")}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--st-text-faint)" }}>{t("End")}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14, marginBottom: 18 }}>
        {(() => {
          // Cumulative sparklines over the engagement window — each add pushes the
          // line up. Open vulns / my findings chart the creation time of the very
          // findings that make up the shown count, so the curve lands on that total.
          const wStart = Date.parse(projRow?.startISO ?? "");
          const wEnd = Date.parse(projRow?.endISO ?? "");
          const openVulns = d.vulns.filter((v) => (VSTATUS_OPEN as readonly string[]).includes(v.status));
          const myVulns = d.vulns.filter((v) => v.author === me);
          return [
          { icon: "globe" as const, color: "var(--st-accent-2)", label: "Hosts", value: hosts.length, spark: cumulativeSpark(hosts.map((h) => h.created), wStart, wEnd), stroke: "var(--st-accent-2)", onClick: () => setSection("hosts") },
          { icon: "alert-triangle" as const, color: "var(--st-danger)", label: "Open vulns", value: openVulnCount, spark: cumulativeSpark(openVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-danger)", onClick: goToOpenVulns },
          { icon: "star" as const, color: "var(--st-purple)", label: "My findings", value: myFindingsCount, spark: cumulativeSpark(myVulns.map((v) => v.created), wStart, wEnd), stroke: "var(--st-purple)", onClick: goToMyFindings },
          ];
        })().map((c) => (
          <div key={t(c.label)} className="statc clk" onClick={c.onClick} style={{ ...CARD, padding: "16px 18px", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--st-text-3)", font: "600 11.5px Inter,sans-serif", letterSpacing: ".5px", textTransform: "uppercase" }}>
              <Icon name={c.icon} size={15} color={c.color} sw={2.1} />{t(c.label)}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 8 }}>
              <div className="mono" style={{ fontWeight: 800, fontSize: 26, color: "var(--st-text)", lineHeight: 1, letterSpacing: "-1px" }}>{c.value}</div>
              <svg width="111" height="30" viewBox="0 0 111 30" fill="none" style={{ flex: "none" }}>
                <polygon points={sparkArea(c.spark, 111)} fill={c.stroke} fillOpacity={0.15} />
                <polyline points={c.spark} stroke={c.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...CARD, padding: "20px 22px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ font: "700 14px Inter,sans-serif", color: "var(--st-text)" }}>{t("Vulnerabilities across the project")}</div>
          <span className="clk" onClick={() => setSection("vulns")} style={{ font: "600 12px Inter,sans-serif", color: "var(--st-accent-2)" }}>{t("View all →")}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 12 }}>
          {sevBars.map((b) => (
            <div key={t(b.label)} className="statc clk" onClick={b.onClick} style={{ border: "1px solid var(--st-bg)", borderRadius: 13, padding: "15px 16px", background: b.tileBg, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: b.color }} />
                <span style={{ font: "700 10.5px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", color: b.color }}>{t(b.label)}</span>
              </div>
              <div className="mono" style={{ fontSize: 30, fontWeight: 800, color: "var(--st-text)", marginTop: 10, lineHeight: 1 }}>{b.count}</div>
            </div>
          ))}
        </div>
      </div>

      {canViewMembers && (
        <div style={{ ...CARD, padding: "20px 22px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ font: "700 14px Inter,sans-serif", color: "var(--st-text)" }}>{t("Team")}</div>
            <span className="clk" onClick={() => setSection("members")} style={{ font: "600 12px Inter,sans-serif", color: "var(--st-accent-2)" }}>{canManageMembers ? t("Manage →") : t("View all →")}</span>
          </div>
          {d.members.map((m, i) => (
            <div key={m.name + i} className="listitem" style={{ display: "flex", alignItems: "center", gap: 11, padding: "7px 0", borderTop: "1px solid var(--st-divider)" }}>
              <UserAvatar name={m.name} src={m.id === authUser?.id ? authUser.avatar_url : m.avatarUrl} initials={m.initials} size={30} fontSize={11} background={m.color} />
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text)" }}>{m.name}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--st-text-faint)" }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* One pill per port holds BOTH the port and its status in a single highlight.
     A down host shows "down" per port; an up host shows the probed HTTP code. */
  const portPills = (ports: Host["ports"], hostDown = false) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {portPillsOf(ports).map((p, i) => {
        const statusText = hostDown ? "down" : p.http != null ? String(p.http) : null;
        const statusColor = hostDown ? "var(--st-danger)" : p.http != null ? httpStatusColor(p.http) : undefined;
        return (
          <span key={i} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px", background: p.bg, color: p.color }}>
            <span>{p.label}</span>
            {statusText != null && (
              <>
                <span style={{ opacity: 0.55 }}>-</span>
                <span style={{ color: statusColor }}>{statusText}</span>
              </>
            )}
          </span>
        );
      })}
      {/* A down host with no probed ports still shows a "down" chip in the ports column. */}
      {hostDown && ports.length === 0 && (
        <span className="mono" style={{ fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px", background: "var(--st-danger-soft)", color: "var(--st-danger)" }}>{t("down")}</span>
      )}
    </div>
  );

  /* Имена, в которые резолвится адрес — серыми чипами по образцу портов: один
     адрес часто отдаёт несколько имён, и перечисление через запятую в узкой
     ячейке читается хуже, чем набор плашек. Неподтверждённые (PTR без обратного
     подтверждения) — приглушены и подписаны в title. */
  const hostnamePills = (names: { hostname: string; source: string; confirmed: boolean }[]) => {
    if (names.length === 0) return <span style={{ color: "var(--st-text-faint)", fontSize: 12.5 }}>—</span>;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {names.map((n) => (
          <span
            key={n.hostname}
            className="mono"
            title={n.confirmed ? undefined : t("unconfirmed")}
            style={{
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 6,
              padding: "2px 8px",
              background: "var(--st-elevated)",
              color: n.confirmed ? "var(--st-text-2)" : "var(--st-text-faint)",
              opacity: n.confirmed ? 1 : 0.75,
            }}
          >
            {n.hostname}
          </span>
        ))}
      </div>
    );
  };

  /* "Add hosts" is a full page (not a modal): paste a list, submit, and the server
     creates the hosts up front + probes them in the background. On submit we return
     to the list and statuses fill in live (see the poll effect + the probing banner). */
  /* One page, two farms. The IPs view used to open this very page verbatim, which
     is why "Add IPs" led to something titled "Add hosts" — the label was not the
     bug, the whole page was reused. Parameterised instead of copied so the two
     stay in step. */
  const renderImportPage = (cfg: {
    title: string;
    backLabel: string;
    pasteLabel: string;
    placeholder: string;
    previewPlaceholder: string;
    raw: string;
    preview: string;
    busy: boolean;
    submitLabel?: string;
    busyLabel?: string;
    onRaw: (v: string) => void;
    onPreview: (v: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
  }) => {
    const previewCount = cfg.preview.split(/\r?\n/).filter((l) => l.trim()).length;
    const fillArea: CSSProperties = { flex: 1, minHeight: 0, resize: "none", width: "100%", fontFamily: "ui-monospace,Menlo,monospace", fontSize: 13 };
    const paneCol: CSSProperties = { display: "flex", flexDirection: "column", minHeight: 0 };
    return (
      // Fills the whole section area: the two textareas grow to take all remaining height.
      <div className="route" style={{ ...CARD, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 260px)" }}>
        <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 10, padding: "16px 22px", borderBottom: "1px solid var(--st-divider)" }}>
          <button type="button" className="clk back-arrow" onClick={cfg.onCancel} aria-label={cfg.backLabel} title={cfg.backLabel} style={{ color: "var(--st-text-3)" }}><Icon name="chevron-left" size={20} /></button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "var(--st-text)" }}>{cfg.title}</h2>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "18px 22px 20px" }}>
          <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={paneCol}>
              <label className="flabel">{cfg.pasteLabel}</label>
              <textarea className="finp" disabled={cfg.busy} aria-label={cfg.pasteLabel} placeholder={cfg.placeholder} value={cfg.raw} onChange={(e) => cfg.onRaw(e.target.value)} style={fillArea} />
            </div>
            <div style={paneCol}>
              <label className="flabel">{t("Will be imported")}{previewCount ? ` (${previewCount})` : ""}</label>
              <textarea className="finp" disabled={cfg.busy} aria-label={t("Will be imported")} placeholder={cfg.previewPlaceholder} value={cfg.preview} onChange={(e) => cfg.onPreview(e.target.value)} style={fillArea} />
            </div>
          </div>
          <div style={{ flex: "none", display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <button className="clk" onClick={cfg.onCancel} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button>
            <button className="clk" disabled={cfg.busy} onClick={cfg.onSubmit} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif" }}>{cfg.busy ? (cfg.busyLabel ?? t("Starting…")) : (cfg.submitLabel ?? t("Probe & add"))}</button>
          </div>
        </div>
      </div>
    );
  };

  const renderHostImport = () =>
    renderImportPage({
      title: t("Add hosts"),
      backLabel: t("All hosts"),
      pasteLabel: t("Paste hosts"),
      placeholder: "https://example.com\nwww.example.com\napp.example.com\napi.example.com:8443\nadmin.acme-corp.com\nstaging.example.org",
      previewPlaceholder: t("parsed hosts appear here…"),
      raw: state.hostImportRaw,
      preview: state.hostImportPreview,
      busy: state.hostImportBusy,
      onRaw: (v) => setState({ hostImportRaw: v, hostImportPreview: normalizeHostList(v) }),
      onPreview: (v) => setState({ hostImportPreview: v }),
      onCancel: closeHostImport,
      onSubmit: submitHostImport,
    });

  const renderIpImport = () =>
    renderImportPage({
      title: t("Add IPs"),
      backLabel: t("All IPs"),
      pasteLabel: t("Paste IPs"),
      placeholder: "1.2.3.4\n1.2.3.4:8443\nhttps://5.6.7.8:443",
      previewPlaceholder: t("parsed IPs appear here…"),
      raw: state.ipImportRaw,
      preview: state.ipImportPreview,
      busy: state.ipImportBusy,
      onRaw: (v) => setState({ ipImportRaw: v, ipImportPreview: normalizeIpList(v) }),
      onPreview: (v) => setState({ ipImportPreview: v }),
      onCancel: closeIpImport,
      onSubmit: submitIpImport,
    });

  const renderEpImport = () =>
    renderImportPage({
      title: t("Add endpoints"),
      backLabel: t("All endpoints"),
      pasteLabel: t("Paste endpoints"),
      placeholder: "https://api.example.com/v1/login\nhttps://example.com/admin\nPOST https://example.com/api/users",
      previewPlaceholder: t("parsed endpoints appear here…"),
      submitLabel: t("Add endpoints"),
      busyLabel: t("Adding…"),
      raw: state.epImportRaw,
      preview: state.epImportPreview,
      busy: state.epImportBusy,
      onRaw: (v) => setState({ epImportRaw: v, epImportPreview: normalizeEpList(v) }),
      onPreview: (v) => setState({ epImportPreview: v }),
      onCancel: closeEpImport,
      onSubmit: submitEpImport,
    });

  const searchBox = (placeholder: string, value: string, onChange: (v: string) => void, width: number | string = 280) => (
    <label className="fq" style={{ position: "relative", display: "flex", alignItems: "center", width }}>
      <svg style={{ position: "absolute", left: 13 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--st-text-faint)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
      <input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );

  const filterPill = (label: string, on: boolean, onClick: () => void) => (
    <div key={label} className="clk filter-pill" onClick={onClick} style={{ font: "600 12px Inter,sans-serif", padding: "6px 12px", borderRadius: 20, cursor: "pointer", ...vfPill(on) }}>{label}</div>
  );

  /* The recon filter rows. The export page renders the same row as the view it
     exports — sharing one definition is what keeps the two from ever disagreeing
     about which rows are selected. Empty pill selection means All. */
  const reconFilterRow = (view: ReconView) => {
    if (view === "ips") {
      // One box matches either column of the row: the address or its host.
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16, flexWrap: "wrap" }}>
          {searchBox(t("Filter by IP or host…"), state.ipQuery, (v) => setState({ ipQuery: v }))}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ font: "700 11px Inter,sans-serif", letterSpacing: ".5px", textTransform: "uppercase", color: "var(--st-text-faint)" }}>{t("Status")}</span>
            {filterPill(t("All"), state.ipFilters.length === 0, () => setState({ ipFilters: [] }))}
            {STATUS_FILTER_KEYS.map((k) => filterPill(k, state.ipFilters.includes(k), () => setState((s) => ({ ipFilters: toggleIn(s.ipFilters, k) }))))}
          </div>
        </div>
      );
    }
    if (view === "endpoints") {
      /* Host and path get separate boxes: they are different questions ("everything
         on this host" vs "where is /login"), so one combined box would answer neither. */
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16, flexWrap: "wrap" }}>
          {searchBox(t("Filter by host…"), state.epHostQuery, (v) => setState({ epHostQuery: v }), 190)}
          {searchBox(t("Filter by endpoint…"), state.epPathQuery, (v) => setState({ epPathQuery: v }), 190)}
          <div style={{ flex: 1 }} />
          {/* Подписан так же, как Status, — иначе единственный ряд
             пилюль без заголовка читается как «непонятно что фильтрует». */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ font: "700 11px Inter,sans-serif", letterSpacing: ".5px", textTransform: "uppercase", color: "var(--st-text-faint)" }}>{t("Method")}</span>
            {filterPill(t("All"), state.epMethods.length === 0, () => setState({ epMethods: [] }))}
            {STORM_METHODS.map((m) => filterPill(m, state.epMethods.includes(m), () => setState((s) => ({ epMethods: toggleIn(s.epMethods, m) }))))}
          </div>
        </div>
      );
    }
    if (view === "js") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16, flexWrap: "wrap" }}>
          {searchBox(t("Filter by JS URL or host…"), state.jsQuery, (v) => setState({ jsQuery: v }))}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ font: "700 11px Inter,sans-serif", letterSpacing: ".5px", textTransform: "uppercase", color: "var(--st-text-faint)" }}>{t("Secrets")}</span>
            {filterPill(t("All"), !state.jsSecretsOnly, () => setState({ jsSecretsOnly: false }))}
            {filterPill(t("With secrets"), state.jsSecretsOnly, () => setState({ jsSecretsOnly: true }))}
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16, flexWrap: "wrap" }}>
        {searchBox(t("Filter by host…"), state.hostQuery, (v) => setState({ hostQuery: v }))}
        <div style={{ flex: 1 }} />
        {/* Label + pills share one flex gap so the spacing between filters is equal. */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ font: "700 11px Inter,sans-serif", letterSpacing: ".5px", textTransform: "uppercase", color: "var(--st-text-faint)" }}>{t("Status")}</span>
          {filterPill(t("All"), state.hostFilters.length === 0, () => setState({ hostFilters: [] }))}
          {STATUS_FILTER_KEYS.map((k) => filterPill(k, state.hostFilters.includes(k), () => setState((s) => ({ hostFilters: toggleIn(s.hostFilters, k) }))))}
        </div>
      </div>
    );
  };

  /* Recon export: the same two-pane shape as "Add hosts". The left pane is the full
     list the filters leave on screen; the right pane is that list, editable. Deleting
     a row on the right drops it from the left too — the left only renders lines that
     survive on the right, so the two can't drift apart. The filter row sits above the
     card, where every other section keeps its filters, and it is the *same* row the
     list view renders: narrowing it there narrows what lands here. */
  const renderExport = () => {
    const scope = state.exportScope;
    const title =
      scope === "hosts" ? t("Export hosts")
      : scope === "ips" ? t("Export IP addresses")
      : scope === "js-endpoints" ? t("Export paths")
      : scope === "js-secrets" ? t("Export secrets")
      : t("Export endpoints");
    const kept = new Set(exportTextLines(state.exportText));
    const left = exportLinesFor(scope).filter((l) => kept.has(l));
    const keptCount = exportTextLines(state.exportText).length;
    const fillArea: CSSProperties = { flex: 1, minHeight: 0, resize: "none", width: "100%", fontFamily: "ui-monospace,Menlo,monospace", fontSize: 13 };
    const paneCol: CSSProperties = { display: "flex", flexDirection: "column", minHeight: 0 };
    return (
      <div className="route">
        {/* JS exports carry no recon filter row — the JS list has its own filters. */}
        {!scope.startsWith("js-") && reconFilterRow(scope === "ips" ? "ips" : scope === "endpoints" ? "endpoints" : "hosts")}
        {/* Height leaves room for the filter row the card now sits under. */}
        <div style={{ ...CARD, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 318px)" }}>
          <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 10, padding: "16px 22px", borderBottom: "1px solid var(--st-divider)" }}>
            <button type="button" className="clk back-arrow" onClick={closeReconExport} aria-label={t("Back")} title={t("Back")} style={{ color: "var(--st-text-3)" }}><Icon name="chevron-left" size={20} /></button>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "var(--st-text)" }}>{title}</h2>
            <div style={{ marginLeft: "auto" }}>{scope === "endpoints" && <SwaggerEndpointImport disabled={state.epImportBusy} onParsed={importSwaggerEndpoints} />}</div>
          </div>
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "18px 22px 20px" }}>
            <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={paneCol}>
                <label className="flabel">{t("Found")}{left.length ? ` (${left.length})` : ""}</label>
                <textarea className="finp" aria-label={t("Found")} readOnly value={left.join("\n")} style={{ ...fillArea, background: "var(--st-sunken)", color: "var(--st-text-2)" }} />
              </div>
              <div style={paneCol}>
                <label className="flabel">{t("Will be exported")}{keptCount ? ` (${keptCount})` : ""}</label>
                <textarea
                  className="finp"
                  aria-label={t("Will be exported")}
                  value={state.exportText}
                  onChange={(e) => setState({ exportText: e.target.value })}
                  style={fillArea}
                />
              </div>
            </div>
            <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
              {/* Endpoints can also go out as an OpenAPI doc, rebuilt from these lines. */}
              {scope === "endpoints" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {filterPill(t("List"), state.exportFormat === "list", () => setState({ exportFormat: "list" }))}
                  {filterPill(t("Swagger (OpenAPI 3)"), state.exportFormat === "openapi", () => setState({ exportFormat: "openapi" }))}
                </div>
              )}
              <div style={{ flex: 1 }} />
              <button className="clk" onClick={closeReconExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button>
              <button className="clk" onClick={doReconExport} disabled={keptCount === 0} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: keptCount === 0 ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: keptCount === 0 ? "default" : "pointer" }}>{t("Download")}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* Domain picker shown before a JS scan — the same two-pane shape as the export
     page: the host filter row narrows the "Found" list, the editable right pane is
     the exact set that goes to the scan. Starting the scan sends that list verbatim. */
  const renderJsScanSetup = () => {
    const kept = new Set(exportTextLines(state.jsScanText));
    const found = jsScanDomains().filter((d) => kept.has(d));
    const keptCount = exportTextLines(state.jsScanText).length;
    const fillArea: CSSProperties = { flex: 1, minHeight: 0, resize: "none", width: "100%", fontFamily: "ui-monospace,Menlo,monospace", fontSize: 13 };
    const paneCol: CSSProperties = { display: "flex", flexDirection: "column", minHeight: 0 };
    return (
      <div className="route">
        {reconFilterRow("hosts")}
        <div style={{ ...CARD, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 318px)" }}>
          <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 10, padding: "16px 22px", borderBottom: "1px solid var(--st-divider)" }}>
            <button type="button" className="clk back-arrow" onClick={closeJsScanSetup} aria-label={t("All JS files")} title={t("All JS files")} style={{ color: "var(--st-text-3)" }}><Icon name="chevron-left" size={20} /></button>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "var(--st-text)" }}>{t("Choose domains to scan")}</h2>
          </div>
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "18px 22px 20px" }}>
            <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={paneCol}>
                <label className="flabel">{t("Found")}{found.length ? ` (${found.length})` : ""}</label>
                <textarea className="finp" readOnly value={found.join("\n")} style={{ ...fillArea, background: "var(--st-sunken)", color: "var(--st-text-2)" }} />
              </div>
              <div style={paneCol}>
                <label className="flabel">{t("Will be scanned")}{keptCount ? ` (${keptCount})` : ""}</label>
                <textarea
                  className="finp"
                  placeholder={t("one domain per line…")}
                  value={state.jsScanText}
                  onChange={(e) => setState({ jsScanText: e.target.value })}
                  style={fillArea}
                />
              </div>
            </div>
            <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
              <div style={{ flex: 1 }} />
              <button className="clk" onClick={closeJsScanSetup} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button>
              <button className="clk" onClick={submitJsScan} disabled={keptCount === 0} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: keptCount === 0 ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: keptCount === 0 ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon name="search" size={15} color="var(--st-on-accent)" sw={2.6} />{t("Start scan")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /** "All files of one host" page — aggregates its files, secrets and paths. */
  const renderJsHostDetail = (host: string) => {
    const files = jsFiles.filter((f) => f.host === host);
    const allSecrets = files.flatMap((f) => f.secrets.map((s) => ({ ...s, file: fileBase(f.url) })));
    const allPaths = [...new Set(files.flatMap((f) => f.endpoints))].sort();
    const totalBytes = files.reduce((n, f) => n + (f.status === "ok" ? (f.size ?? 0) : 0), 0);
    const secGrid = "minmax(0,130px) minmax(0,150px) minmax(0,1fr) minmax(0,1.2fr)";
    return (
      <div style={{ animation: "storm-fade .2s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          {/* Экспорт для этого хоста делает единственная кнопка «Export» в шапке
              секции JS scan (она учитывает открытый хост), поэтому отдельной
              кнопки экспорта в под-шапке нет. */}
          <span className="clk" onClick={closeJsHostDetail} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 12.5px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 20, padding: "7px 13px", cursor: "pointer" }}>
            <Icon name="chevron-left" size={15} />{t("All JS files")}
          </span>
        </div>
        <div style={{ ...CARD, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="globe2" size={17} sw={2.2} color="var(--st-text-2)" style={{ flex: "none" }} />
            <span className="mono" style={{ font: "800 18px 'JetBrains Mono',monospace", color: "var(--st-text)", wordBreak: "break-all" }}>{host}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--st-text-2)", background: "var(--st-hover)", border: "1px solid var(--st-border-light)", borderRadius: 6, padding: "3px 9px" }}>{files.length} {t("files")}</span>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--st-text-2)", background: "var(--st-hover)", border: "1px solid var(--st-border-light)", borderRadius: 6, padding: "3px 9px" }}>{allPaths.length} {t("paths")}</span>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: allSecrets.length ? "var(--st-danger)" : "var(--st-text-2)", background: "var(--st-hover)", border: "1px solid var(--st-border-light)", borderRadius: 6, padding: "3px 9px" }}>{allSecrets.length} {t("secrets")}</span>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--st-text-2)", background: "var(--st-hover)", border: "1px solid var(--st-border-light)", borderRadius: 6, padding: "3px 9px" }}>{kb(totalBytes)}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ font: "700 13px Inter,sans-serif", color: "var(--st-text)" }}>{t("Files")} <span className="mono" style={{ color: "var(--st-text-3)", fontWeight: 600 }}>{files.length}</span></span>
        </div>
        <div style={{ ...CARD, overflow: "hidden", marginBottom: 20 }}>
          {files.map((f) => (
            <div key={f.id} className="prow clk" onClick={() => openJsFile(f.id)} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 84px 84px 96px", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: "1px solid var(--st-divider)" }}>
              <span className="mono hostname" title={f.url} style={{ font: "600 13px 'JetBrains Mono',monospace", color: f.status === "ok" ? "var(--st-text)" : "var(--st-text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>{fileBase(f.url)}</span>
              <span className="mono" style={{ fontSize: 11.5, color: "var(--st-text-3)" }}>{f.endpoints.length} {t("paths")}</span>
              <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: f.secrets.length ? "var(--st-danger)" : "var(--st-text-faint)" }}>{f.secrets.length}</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--st-text-faint)", textAlign: "right" }}>{f.status === "ok" ? kb(f.size) : f.status}</span>
            </div>
          ))}
          {files.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--st-text-faint)", fontSize: 13.5 }}>{t("No JS files on this host.")}</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ font: "700 13px Inter,sans-serif", color: "var(--st-text)" }}>{t("Secrets")} <span className="mono" style={{ color: "var(--st-text-3)", fontWeight: 600 }}>{allSecrets.length}</span></span>
        </div>
        <div style={{ ...CARD, overflow: "hidden", marginBottom: 20 }}>
          {allSecrets.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: secGrid, gap: 14, alignItems: "center", padding: "12px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
              <div>{t("File")}</div><div>{t("Kind")}</div><div>{t("Match")}</div><div>{t("Snippet")}</div>
            </div>
          )}
          {allSecrets.map((sec, i) => {
            const c = SECRET_SEV[sec.severity] ?? SECRET_SEV.low;
            return (
              <div key={i} className="prow" style={{ display: "grid", gridTemplateColumns: secGrid, alignItems: "start", gap: 14, padding: "13px 20px", borderBottom: "1px solid var(--st-divider)" }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--st-text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={sec.file}>{sec.file}</span>
                <span className="mono" style={{ justifySelf: "start", fontSize: 10.5, fontWeight: 700, borderRadius: 5, padding: "2px 8px", background: c.bg, color: c.color }}>{sec.kind}</span>
                <span className="mono" style={{ fontSize: 12, color: "var(--st-text-2)", wordBreak: "break-all" }}>{sec.match}</span>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--st-text-2)", whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.55, userSelect: "text" }}>{sec.snippet}</span>
              </div>
            );
          })}
          {allSecrets.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--st-text-faint)", fontSize: 13.5 }}>{t("No secrets on this host.")}</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ font: "700 13px Inter,sans-serif", color: "var(--st-text)" }}>{t("Paths")} <span className="mono" style={{ color: "var(--st-text-3)", fontWeight: 600 }}>{allPaths.length}</span></span>
        </div>
        <div style={{ ...CARD, overflow: "hidden", marginBottom: 20 }}>
          {allPaths.map((path, i) => (
            <div key={i} className="prow" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid var(--st-divider)" }}>
              <span className="mono" style={{ fontSize: 12.5, color: "var(--st-text)", wordBreak: "break-all" }}>{path}</span>
            </div>
          ))}
          {allPaths.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--st-text-faint)", fontSize: 13.5 }}>{t("No paths on this host.")}</div>
          )}
        </div>
      </div>
    );
  };

  /** One JS file's card — its secrets table and paths list, with Export. */
  const renderJsFileDetail = (f: JsFileEntry) => {
    const canExport = f.endpoints.length > 0 || f.secrets.length > 0;
    const secGrid = "minmax(0,150px) minmax(0,1fr) minmax(0,1.2fr)";
    return (
      <div style={{ animation: "storm-fade .2s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <span className="clk" onClick={closeJsFile} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 12.5px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 20, padding: "7px 13px", cursor: "pointer" }}>
            <Icon name="chevron-left" size={15} />{t("All JS files")}
          </span>
          <div style={{ flex: 1 }} />
          <button className="clk" onClick={() => openReconExport(f.endpoints.length ? "js-endpoints" : "js-secrets")} disabled={!canExport} style={{ height: 42, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: canExport ? "var(--st-accent-2)" : "var(--st-text-faint)", display: "inline-flex", alignItems: "center", gap: 7, cursor: canExport ? "pointer" : "default" }}>
            <Icon name="upload" size={16} sw={2.2} color={canExport ? "var(--st-accent-2)" : "var(--st-text-faint)"} />{t("Export")}
          </button>
        </div>
        <div style={{ ...CARD, padding: "22px 24px", marginBottom: 16 }}>
          <div className="mono" style={{ font: "800 17px 'JetBrains Mono',monospace", color: "var(--st-text)", wordBreak: "break-all" }}>{fileBase(f.url)}</div>
          <a className="mono" href={f.url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: "var(--st-accent)", wordBreak: "break-all" }}>{f.url}</a>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--st-text-2)", background: "var(--st-hover)", border: "1px solid var(--st-border-light)", borderRadius: 6, padding: "3px 9px" }}>{f.host}</span>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--st-text-2)", background: "var(--st-hover)", border: "1px solid var(--st-border-light)", borderRadius: 6, padding: "3px 9px" }}>{f.status === "ok" ? kb(f.size) : f.status}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ font: "700 13px Inter,sans-serif", color: "var(--st-text)" }}>{t("Secrets")} <span className="mono" style={{ color: "var(--st-text-3)", fontWeight: 600 }}>{f.secrets.length}</span></span>
        </div>
        <div style={{ ...CARD, overflow: "hidden", marginBottom: 20 }}>
          {f.secrets.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: secGrid, gap: 14, alignItems: "center", padding: "12px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
              <div>{t("Kind")}</div><div>{t("Match")}</div><div>{t("Snippet")}</div>
            </div>
          )}
          {f.secrets.map((sec, i) => {
            const c = SECRET_SEV[sec.severity] ?? SECRET_SEV.low;
            return (
              <div key={i} className="prow" style={{ display: "grid", gridTemplateColumns: secGrid, alignItems: "start", gap: 14, padding: "13px 20px", borderBottom: "1px solid var(--st-divider)" }}>
                <span className="mono" style={{ justifySelf: "start", fontSize: 10.5, fontWeight: 700, borderRadius: 5, padding: "2px 8px", background: c.bg, color: c.color }}>{sec.kind}</span>
                <span className="mono" style={{ fontSize: 12, color: "var(--st-text-2)", wordBreak: "break-all" }}>{sec.match}</span>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--st-text-2)", whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.55, userSelect: "text" }}>{sec.snippet}</span>
              </div>
            );
          })}
          {f.secrets.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--st-text-faint)", fontSize: 13.5 }}>{f.status === "ok" ? t("Nothing found in this file.") : t("File could not be scanned.")}</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ font: "700 13px Inter,sans-serif", color: "var(--st-text)" }}>{t("Paths")} <span className="mono" style={{ color: "var(--st-text-3)", fontWeight: 600 }}>{f.endpoints.length}</span></span>
        </div>
        <div style={{ ...CARD, overflow: "hidden", marginBottom: 20 }}>
          {f.endpoints.map((path, i) => (
            <div key={i} className="prow" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid var(--st-divider)" }}>
              <span className="mono" style={{ fontSize: 12.5, color: "var(--st-text)", wordBreak: "break-all" }}>{path}</span>
            </div>
          ))}
          {f.endpoints.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--st-text-faint)", fontSize: 13.5 }}>{t("No paths in this file.")}</div>
          )}
        </div>
      </div>
    );
  };

  const renderRecon = () => {
    if (state.exportPageOpen) return renderExport();
    if (rv === "js" && state.jsScanSetupOpen) return renderJsScanSetup();
    if (rv === "ips") {
      if (state.ipImportOpen) return renderIpImport();
      if (_ipd) return renderIpDetail(_ipd);
      // Grid shared by the header and every IP row.
      const ipGrid = "minmax(0,1fr) minmax(0,1.4fr) minmax(0,1fr) 72px";
      return (
        <div className="route">
          {reconFilterRow("ips")}
          {/* Та же плашка, что у фермы хостов: синяя, со спиннером. */}

          <div style={{ ...CARD, overflow: "hidden" }}>
            {/* No column headers over an empty table (same as the hosts table). */}
            {ipsRows.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: ipGrid, gap: 14, padding: "13px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".6px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
                <div>{t("IP address")}</div><div>{t("Hostname")}</div><div>{t("Ports")}</div><div style={{ textAlign: "right" }}>{t("Actions")}</div>
              </div>
            )}
            {ipsRows.slice(0, LIST_CAP).map((i, idx) => (
              <div key={idx} className="prow clk" onClick={() => openIpDetail(i.ip)} style={{ display: "grid", gridTemplateColumns: ipGrid, gap: 14, alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--st-divider)" }}>
                <div style={{ minWidth: 0 }}>
                  <span className="mono hostname" style={{ font: "700 13.5px 'JetBrains Mono',monospace", color: "var(--st-text)", cursor: "pointer" }}>{i.ip}</span>
                </div>
                {/* Every name the address resolves to, on the one row. Unconfirmed
                    names (PTR with no matching forward record) are dimmed, not hidden. */}
                <div style={{ minWidth: 0 }} title={i.names.map((n) => n.hostname).join(", ")}>{hostnamePills(i.names)}</div>
                <div style={{ minWidth: 0 }}>{portPills(i.ports, i.status === "down")}</div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Tip label={t("Edit IP")}><button type="button" className="actbtn" title={t("Edit IP")} aria-label={`${t("Edit IP")}: ${i.ip}`} onClick={i.onEdit}><Icon name="edit" size={15} /></button></Tip>
                  <Tip label={t("Delete")}><div className="actbtn del" onClick={i.onDelete}><Icon name="trash" size={15} /></div></Tip>
                </div>
              </div>
            ))}
            {capNote(ipsRows.length, Math.min(ipsRows.length, LIST_CAP))}
            {ipsRows.length === 0 && <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("No IPs found.")}</div>}
          </div>
        </div>
      );
    }
    if (rv === "endpoints") {
      if (state.epImportOpen) return renderEpImport();
      return (
        <div className="route">
          {reconFilterRow("endpoints")}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {endpointGroups.slice(0, LIST_CAP).map((g) => (
              <div key={g.host} style={{ background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 14, overflow: "hidden" }}>
                <div className="prow clk" onClick={() => toggleEpGroup(g.host)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
                  <Icon name="chevron-right" size={15} color="var(--st-text-faint)" sw={2.4} style={{ transform: g.expanded ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
                  <Icon name="globe2" size={16} color="var(--st-text-3)" />
                  <span className="mono" style={{ font: "700 14px 'JetBrains Mono',monospace", color: "var(--st-text)", flex: 1 }}>{g.host}</span>
                  <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: "var(--st-text-2)", background: "var(--st-hover)", borderRadius: 7, padding: "3px 9px" }}>{g.count}</span>
                  {canManageMembers && <div className="endpoint-actions">
                    <Tip label={`${t("Edit host")}: ${g.host}`}><button type="button" className="actbtn" aria-label={`${t("Edit host")}: ${g.host}`} title={t("Edit host")} onClick={(event) => { event.stopPropagation(); openEditor("host", "edit", hosts.findIndex((host) => host.id === g.hostId)); }}><Icon name="edit" size={15} /></button></Tip>
                    <Tip label={`${t("Delete endpoints")}: ${g.host}`}><button type="button" className="actbtn del" aria-label={`${t("Delete endpoints")}: ${g.host}`} title={t("Delete endpoints")} disabled={deletingEndpointHosts.includes(g.hostId)} onClick={(event) => { event.stopPropagation(); askDeleteEndpoints(g); }}><Icon name="trash" size={15} /></button></Tip>
                  </div>}
                </div>
                <Collapse open={g.expanded}>
                  <div style={{ borderTop: "1px solid var(--st-divider)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "72px minmax(0,1fr) 96px", gap: 10, padding: "11px 20px 11px 50px", borderBottom: "1px solid var(--st-divider)", font: "700 10.5px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
                      <div>{t("Method")}</div><div>{t("Path")}</div><div style={{ textAlign: "right" }}>{t("Actions")}</div>
                    </div>
                    {g.endpoints.slice(0, EP_GROUP_CAP).map((e: Endpoint, i: number) => {
                      const m = METHOD[e.m] ?? PORT.closed;
                      return (
                        <div key={i} className="prow clk" onClick={() => openEndpoint({ method: e.m, path: e.p, host: g.host, hostId: g.hostId, endpointId: e.id })} style={{ display: "grid", gridTemplateColumns: "72px minmax(0,1fr) 96px", alignItems: "center", gap: 10, padding: "11px 20px 11px 50px", borderBottom: "1px solid var(--st-elevated)" }}>
                          <span className="mono" style={{ justifySelf: "start", fontWeight: 700, borderRadius: 5, padding: "2px 8px", fontSize: 10.5, background: m.bg, color: m.color }}>{e.m}</span>
                          <div className="mono" style={{ fontSize: 12.5, color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.p}</div>
                          <div className="endpoint-actions">
                            <Tip label={t("Copy as cURL")}><div className="actbtn" onClick={(ev) => { ev.stopPropagation(); copyCurl({ method: e.m, path: e.p, host: g.host }); }}><Icon name="copy" size={15} /></div></Tip>
                            <Tip label={t("Edit endpoint")}><button type="button" className="actbtn" aria-label={`${t("Edit endpoint")}: ${e.m} ${e.p}`} onClick={(ev) => { ev.stopPropagation(); openEndpoint({ method: e.m, path: e.p, host: g.host, hostId: g.hostId, endpointId: e.id }); }}><Icon name="edit" size={15} /></button></Tip>
                            <Tip label={t("Delete endpoint")}><div className="actbtn del" onClick={(ev) => { ev.stopPropagation(); void deleteEndpoint(g.hostId, e.id); }}><Icon name="trash" size={15} /></div></Tip>
                          </div>
                        </div>
                      );
                    })}
                    {g.endpoints.length > EP_GROUP_CAP && (
                      <div style={{ padding: "8px 20px 8px 50px", color: "var(--st-text-faint)", fontSize: 12.5 }}>+{g.endpoints.length - EP_GROUP_CAP} {t("more — narrow the filter to see the rest")}</div>
                    )}
                  </div>
                </Collapse>
              </div>
            ))}
            {capNote(endpointGroups.length, Math.min(endpointGroups.length, LIST_CAP))}
            {endpointTotal === 0 && <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14, background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 14 }}>{t("No endpoints discovered.")}</div>}
          </div>
        </div>
      );
    }
    if (rv === "js") {
      // Открытая карточка файла имеет приоритет над страницей хоста: клик по файлу
      // со страницы хоста показывает файл, а «назад» возвращает на страницу хоста.
      if (_jsd) return renderJsFileDetail(_jsd);
      if (_jsHost) return renderJsHostDetail(_jsHost);
      // Та же сетка, что у таблицы хостов: домен — раскрывающаяся строка, файлы под
      // ним — вложенные. Столбцы: chevron, хост, пути, секреты, действия.
      const jsGrid = "24px minmax(0,1.6fr) 84px 84px 96px";
      return (
        <div className="route">
          {reconFilterRow("js")}
          {/* Same blue in-flight banner as the host/IP farms. */}

          <div style={{ ...CARD, overflow: "hidden" }}>
            {jsGroups.length > 0 && (
              <div style={{ display: "grid", alignItems: "center", gridTemplateColumns: jsGrid, gap: 14, padding: "12px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
                <div /><div>{t("Host")}</div><div>{t("Paths")}</div><div>{t("Secrets")}</div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
                  <span>{t("Actions")}</span>

                </div>
              </div>
            )}
            {jsGroups.slice(0, LIST_CAP).map((g) => {
              const exp = state.epExpanded.includes(`js:host:${g.host}`);
              const groupSecrets = g.files.reduce((n, f) => n + f.secrets.length, 0);
              return (
                <div key={g.host} style={{ borderBottom: "1px solid var(--st-divider)" }}>
                  <div className="prow clk" onClick={() => toggleJsGroup(g.host)} style={{ display: "grid", gridTemplateColumns: jsGrid, alignItems: "center", gap: 14, padding: "15px 20px" }}>
                    <Icon name="chevron-right" size={15} color="var(--st-text-faint)" sw={2.4} style={{ transform: exp ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
                    {/* Клик по имени хоста открывает страницу «все файлы хоста»; клик по
                        остальной строке — раскрывает список файлов под ней. */}
                    <span className="mono hostname clk" onClick={(ev) => { ev.stopPropagation(); openJsHostDetail(g.host); }} title={t("Open all files of this host")} style={{ font: "700 14px 'JetBrains Mono',monospace", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>{g.host}</span>
                    <span className="mono" style={{ fontSize: 12, color: g.paths ? "var(--st-text-2)" : "var(--st-text-faint)" }}>{g.paths} {t("paths")}</span>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: groupSecrets ? "var(--st-danger)" : "var(--st-text-faint)" }}>{groupSecrets} {t("secrets")}</span>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                      {/* Re-downloads this host's .js into a zip (files aren't stored). */}
                      <Tip label={t("Download JS archive")}><div className="actbtn" onClick={(ev) => { ev.stopPropagation(); downloadJsArchive(g.hostId, g.host); }}><Icon name="download" size={15} /></div></Tip>
                      {canManageMembers && <Tip label={t("Delete host JS")}><div className="actbtn del" onClick={(ev) => { ev.stopPropagation(); deleteJsHost(g.hostId, g.host); }}><Icon name="trash" size={15} /></div></Tip>}
                    </div>
                  </div>
                  <Collapse open={exp}>
                    <div style={{ background: "var(--st-elevated)" }}>
                      {g.files.slice(0, EP_GROUP_CAP).map((file) => (
                        <div key={file.id} className="prow clk" onClick={() => openJsFile(file.id)} style={{ display: "grid", gridTemplateColumns: jsGrid, alignItems: "center", gap: 14, padding: "13px 20px 13px 44px", borderTop: "1px solid var(--st-divider)" }}>
                          <span />
                          <span className="mono hostname" title={file.url} style={{ font: "600 13px 'JetBrains Mono',monospace", color: file.status === "ok" ? "var(--st-text)" : "var(--st-text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>{fileBase(file.url)}</span>
                          <span className="mono" style={{ fontSize: 11.5, color: "var(--st-text-3)" }}>{file.endpoints.length} {t("paths")}</span>
                          <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: file.secrets.length ? "var(--st-danger)" : "var(--st-text-faint)" }}>{file.secrets.length} {t("secrets")}</span>
                          <span className="mono" style={{ fontSize: 11, color: "var(--st-text-faint)", textAlign: "right" }}>{file.status === "ok" ? kb(file.size) : file.status}</span>
                        </div>
                      ))}
                      {g.files.length > EP_GROUP_CAP && (
                        <div style={{ padding: "10px 20px 10px 44px", borderTop: "1px solid var(--st-divider)", color: "var(--st-text-faint)", fontSize: 12.5 }}>+{g.files.length - EP_GROUP_CAP} {t("more — narrow the filter to see the rest")}</div>
                      )}
                      {g.files.length === 0 && (
                        <div style={{ padding: "13px 20px 13px 44px", borderTop: "1px solid var(--st-divider)", font: "500 12.5px Inter,sans-serif", color: "var(--st-text-faint)" }}>{t("No JS files on this host.")}</div>
                      )}
                    </div>
                  </Collapse>
                </div>
              );
            })}
            {capNote(jsGroups.length, Math.min(jsGroups.length, LIST_CAP))}
            {state.apiJsFiles === null && <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("Loading JS files…")}</div>}
            {state.apiJsFiles !== null && jsGroups.length === 0 && (
              <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("No JS files yet — pick domains and scan.")}</div>
            )}
          </div>
        </div>
      );
    }
    // rv === "hosts"
    if (state.hostImportOpen) return renderHostImport();
    if (_hd) return renderHostDetail(_hd);
    // Grid shared by the header, each host row and each nested subdomain row.
    const hostGrid = "24px minmax(0,1.25fr) minmax(0,1fr) 72px";
    return (
      <div className="route">
        {/* While a probe job runs, statuses fill in live in the table below. */}

        {reconFilterRow("hosts")}
        <div style={{ ...CARD, overflow: "hidden" }}>
          {/* No column headers over an empty table — only show them with rows. */}
          {hostsList.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: hostGrid, gap: 14, padding: "12px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
              <div /><div>{t("Host")}</div><div>{t("Ports")}</div><div style={{ textAlign: "right" }}>{t("Actions")}</div>
            </div>
          )}
          {hostsList.slice(0, LIST_CAP).map(({ h, idx }) => {
            const exp = state.expanded.includes(h.id);
            return (
              <div key={h.id} style={{ borderBottom: "1px solid var(--st-divider)" }}>
                <div className="prow clk" onClick={() => toggleHost(h.id)} style={{ display: "grid", gridTemplateColumns: hostGrid, alignItems: "start", gap: 14, padding: "15px 20px" }}>
                  <Icon name="chevron-right" size={15} color="var(--st-text-faint)" sw={2.4} style={{ marginTop: 3, transform: exp ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span style={{ width: 6, height: 6, flex: "none", borderRadius: "50%", background: STDOT[h.status] ?? STDOT.unknown }} />
                      <span className="clk" onClick={(ev) => { ev.stopPropagation(); openHostDetail(h.id); }} style={{ display: "inline-block", minWidth: 0 }}>
                        <span className="mono hostname" style={{ font: "700 14px 'JetBrains Mono',monospace", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>{h.host}</span>
                      </span>
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>{portPills(h.ports, h.status === "down")}</div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Tip label={t("Edit")}><div className="actbtn" onClick={(ev) => { ev.stopPropagation(); openEditor("host", "edit", idx); }}><Icon name="edit" size={15} /></div></Tip>
                    <Tip label={t("Delete")}><div className="actbtn del" onClick={(ev) => { ev.stopPropagation(); askDelete("host", idx, h.host); }}><Icon name="trash" size={15} /></div></Tip>
                  </div>
                </div>
                {/* Expanding a host lists its subdomains — the addresses live in the IPs view. */}
                <Collapse open={exp}>
                  <div style={{ background: "var(--st-elevated)" }}>
                    {visibleSubdomainsOf(h).map((sub) => (
                      <div key={sub.id} className="prow clk" onClick={(ev) => { ev.stopPropagation(); openHostDetail(sub.id); }} style={{ display: "grid", gridTemplateColumns: hostGrid, alignItems: "start", gap: 14, padding: "13px 20px 13px 44px", borderTop: "1px solid var(--st-divider)" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: STDOT[sub.status] ?? STDOT.unknown, marginTop: 8, justifySelf: "end" }} />
                        <div style={{ minWidth: 0 }}>
                          <span className="mono hostname" style={{ font: "600 13px 'JetBrains Mono',monospace", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", cursor: "pointer" }}>{sub.host}</span>
                        </div>
                        <div style={{ minWidth: 0 }}>{portPills(sub.ports, sub.status === "down")}</div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                          <Tip label={t("Edit")}><div className="actbtn" onClick={(ev) => { ev.stopPropagation(); openEditor("host", "edit", hosts.findIndex((x) => x.id === sub.id)); }}><Icon name="edit" size={15} /></div></Tip>
                          <Tip label={t("Delete")}><div className="actbtn del" onClick={(ev) => { ev.stopPropagation(); askDelete("host", hosts.findIndex((x) => x.id === sub.id), sub.host); }}><Icon name="trash" size={15} /></div></Tip>
                        </div>
                      </div>
                    ))}
                    {visibleSubdomainsOf(h).length === 0 && (
                      <div style={{ padding: "13px 20px 13px 44px", borderTop: "1px solid var(--st-divider)", font: "500 12.5px Inter,sans-serif", color: "var(--st-text-faint)" }}>{t("No subdomains discovered.")}</div>
                    )}
                  </div>
                </Collapse>
              </div>
            );
          })}
          {state.apiHosts === null && <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("Loading hosts…")}</div>}
          {capNote(hostsList.length, Math.min(hostsList.length, LIST_CAP))}
          {state.apiHosts !== null && hostsList.length === 0 && <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("No hosts found.")}</div>}
        </div>
      </div>
    );
  };

  const renderHostDetail = (h: Host) => {
    return (
      <div style={{ animation: "storm-fade .2s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <span className="clk" onClick={closeHostDetail} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 12.5px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 20, padding: "7px 13px", cursor: "pointer" }}>
            <Icon name="chevron-left" size={15} />{t("All hosts")}
          </span>
        </div>
        <div style={{ ...CARD, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 6, height: 6, flex: "none", borderRadius: "50%", background: STDOT[h.status] ?? STDOT.unknown }} />
              <span className="mono" style={{ font: "800 20px 'JetBrains Mono',monospace", color: "var(--st-text)", wordBreak: "break-all" }}>{h.host}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {h.ips.map((ip, i) => (
                <span key={i} className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--st-text-2)", background: "var(--st-hover)", border: "1px solid var(--st-border-light)", borderRadius: 6, padding: "3px 9px" }}>{ip}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ font: "700 13px Inter,sans-serif", color: "var(--st-text)" }}>{t("Ports")} <span className="mono" style={{ color: "var(--st-text-3)", fontWeight: 600 }}>{h.ports.length}</span></span>
        </div>
        <div style={{ ...CARD, overflow: "hidden", marginBottom: 20 }}>
          {h.ports.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,120px) minmax(0,1fr) 80px 110px", gap: 14, padding: "12px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
              <div>{t("Port")}</div><div>{t("Service")}</div><div>{t("HTTP")}</div><div>{t("State")}</div>
            </div>
          )}
          {h.ports.map((p, pi) => (
            <div key={pi} className="prow" style={{ display: "grid", gridTemplateColumns: "minmax(0,120px) minmax(0,1fr) 80px 110px", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: "1px solid var(--st-divider)" }}>
              <span className="mono" style={{ font: "700 13px 'JetBrains Mono',monospace", color: "var(--st-text)" }}>{p.n}/{p.proto}</span>
              {/* Весь стек технологий чипами (whatweb); пусто → unknown. */}
              {p.techs.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, minWidth: 0 }}>
                  {p.techs.map((tech, ti) => (
                    <span key={ti} className="mono" title={tech.version ? `${tech.name} ${tech.version}` : tech.name} style={{ fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px", background: "var(--st-elevated)", color: "var(--st-text-2)" }}>
                      {tech.name}{tech.version ? ` ${tech.version}` : ""}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="mono" style={{ fontSize: 12.5, color: "var(--st-text-faint)" }}>{t("unknown")}</span>
              )}
              <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: h.status === "down" ? "var(--st-danger)" : p.http != null ? httpStatusColor(p.http) : "var(--st-text-faint)" }}>{h.status === "down" ? t("down") : p.http != null ? p.http : "—"}</span>
              <span className="mono" style={{ justifySelf: "start", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 9px", ...(PORT[p.state] ?? PORT.closed) }}>{p.state}</span>
            </div>
          ))}
          {h.ports.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--st-text-faint)", fontSize: 13.5 }}>{t("No ports yet.")}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ font: "700 13px Inter,sans-serif", color: "var(--st-text)" }}>{t("Endpoints")} <span className="mono" style={{ color: "var(--st-text-3)", fontWeight: 600 }}>{h.endpoints.length}</span></span>
        </div>
        <div style={{ ...CARD, overflow: "hidden" }}>
          {h.endpoints.slice(0, EP_GROUP_CAP).map((e, ei) => {
            const m = METHOD[e.m] ?? PORT.closed;
            return (
              <div key={ei} className="prow clk" onClick={() => openEndpoint({ method: e.m, path: e.p, host: h.host, hostId: h.id, endpointId: e.id })} style={{ display: "grid", gridTemplateColumns: "72px minmax(0,1fr) 96px", alignItems: "center", gap: 12, padding: "13px 20px", borderBottom: "1px solid var(--st-divider)" }}>
                <span className="mono" style={{ justifySelf: "start", fontWeight: 700, borderRadius: 5, padding: "2px 8px", fontSize: 10.5, background: m.bg, color: m.color }}>{e.m}</span>
                <div className="mono" style={{ fontSize: 12.5, color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.p}</div>
                <div className="endpoint-actions">
                  <Tip label={t("Copy as cURL")}><div className="actbtn" onClick={(ev) => { ev.stopPropagation(); copyCurl({ method: e.m, path: e.p, host: h.host }); }}><Icon name="copy" size={15} /></div></Tip>
                  <Tip label={t("Edit endpoint")}><button type="button" className="actbtn" aria-label={`${t("Edit endpoint")}: ${e.m} ${e.p}`} onClick={(ev) => { ev.stopPropagation(); openEndpoint({ method: e.m, path: e.p, host: h.host, hostId: h.id, endpointId: e.id }); }}><Icon name="edit" size={15} /></button></Tip>
                  <Tip label={t("Delete endpoint")}><div className="actbtn del" onClick={(ev) => { ev.stopPropagation(); void deleteEndpoint(h.id, e.id); }}><Icon name="trash" size={15} /></div></Tip>
                </div>
              </div>
            );
          })}
          {h.endpoints.length > EP_GROUP_CAP && <div style={{ padding: "8px 20px", color: "var(--st-text-faint)", fontSize: 12.5 }}>+{h.endpoints.length - EP_GROUP_CAP} {t("more — narrow the filter to see the rest")}</div>}
          {h.endpoints.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--st-text-faint)", fontSize: 13.5 }}>{t("No endpoints yet.")}</div>}
        </div>
      </div>
    );
  };

  /* The IP card mirrors the host card: the address takes the host's place in the
     header, the names it resolves to take the host's IP chips, and the ports table
     is identical. IPs own no endpoints (those belong to a host), so there is no
     endpoints section — the resolved hostnames stand in as the address's context. */
  const renderIpDetail = (row: (typeof ipsRows)[number]) => {
    return (
      <div style={{ animation: "storm-fade .2s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <span className="clk" onClick={closeIpDetail} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 12.5px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 20, padding: "7px 13px", cursor: "pointer" }}>
            <Icon name="chevron-left" size={15} />{t("All IPs")}
          </span>
        </div>
        <div style={{ ...CARD, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ width: 6, height: 6, flex: "none", borderRadius: "50%", background: STDOT[row.status] ?? STDOT.unknown }} />
              <span className="mono" style={{ font: "800 20px 'JetBrains Mono',monospace", color: "var(--st-text)", wordBreak: "break-all" }}>{row.ip}</span>

            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <span style={{ font: "700 11px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>{t("Hostnames")}</span>
              <span title={row.names.map((n) => n.hostname).join(", ")}>{hostnamePills(row.names)}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ font: "700 13px Inter,sans-serif", color: "var(--st-text)" }}>{t("Ports")} <span className="mono" style={{ color: "var(--st-text-3)", fontWeight: 600 }}>{row.ports.length}</span></span>
        </div>
        <div style={{ ...CARD, overflow: "hidden" }}>
          {row.ports.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,120px) minmax(0,1fr) 80px 110px", gap: 14, padding: "12px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
              <div>{t("Port")}</div><div>{t("Service")}</div><div>{t("HTTP")}</div><div>{t("State")}</div>
            </div>
          )}
          {row.ports.map((p, pi) => (
            <div key={pi} className="prow" style={{ display: "grid", gridTemplateColumns: "minmax(0,120px) minmax(0,1fr) 80px 110px", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: "1px solid var(--st-divider)" }}>
              <span className="mono" style={{ font: "700 13px 'JetBrains Mono',monospace", color: "var(--st-text)" }}>{p.n}/{p.proto}</span>
              {/* Весь стек технологий чипами (whatweb); пусто → unknown. */}
              {p.techs.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, minWidth: 0 }}>
                  {p.techs.map((tech, ti) => (
                    <span key={ti} className="mono" title={tech.version ? `${tech.name} ${tech.version}` : tech.name} style={{ fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px", background: "var(--st-elevated)", color: "var(--st-text-2)" }}>
                      {tech.name}{tech.version ? ` ${tech.version}` : ""}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="mono" style={{ fontSize: 12.5, color: "var(--st-text-faint)" }}>{t("unknown")}</span>
              )}
              <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: row.status === "down" ? "var(--st-danger)" : p.http != null ? httpStatusColor(p.http) : "var(--st-text-faint)" }}>{row.status === "down" ? t("down") : p.http != null ? p.http : "—"}</span>
              <span className="mono" style={{ justifySelf: "start", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 9px", ...(PORT[p.state] ?? PORT.closed) }}>{p.state}</span>
            </div>
          ))}
          {row.ports.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--st-text-faint)", fontSize: 13.5 }}>{t("No ports yet.")}</div>}
        </div>
      </div>
    );
  };

  const renderVulns = () => {
    if (state.openVulnId != null) return renderVulnDetail();
    return (
      <div className="route">
        {/* Панель фильтров (4 группы: поиск хост/название, поиск автор, STATUS,
            SEVERITY). Поведение задаётся классами + container-query в storm.css:
            — хватает ширины → всё в одну линию (поиски слева, кнопки справа);
            — не хватает → два столбца: поиски друг под другом, группы кнопок
              друг под другом. Порог — по реальной доступной ширине (container),
              а не по viewport, поэтому работает и со свёрнутым сайдбаром. */}
        <div className="issues-filterwrap">
          <div className="issues-filters">
            <div className="if-searches">
              {searchBox(t("Filter by host or title…"), state.vulnFilterHost, (v) => setState({ vulnFilterHost: v }), 260)}
              {searchBox(t("Filter by author…"), state.vulnFilterAuthor, (v) => setState({ vulnFilterAuthor: v }), 260)}
            </div>
            {/* Status / severity are multi-select: pills toggle, several can be held at
                once, and clearing the last one falls back to "All". Driven by the token
                lists so they cannot drift from the backend's vocabularies. */}
            <div className="if-pills">
              <div className="if-group">
                <span className="mono" style={{ fontSize: 10.5, letterSpacing: 1, color: "var(--st-text-faint)", fontWeight: 700 }}>{t("STATUS")}</span>
                {filterPill(t("All"), vfS.length === 0, () => setState({ vulnFilterStatuses: [] }))}
                {VSTATUS_FILTER.map((s) => filterPill(t(VSTATUS_LABEL[s]), vfS.includes(s), () => setState((st) => ({ vulnFilterStatuses: toggleIn(st.vulnFilterStatuses, s) }))))}
              </div>
              <div className="if-group">
                <span className="mono" style={{ fontSize: 10.5, letterSpacing: 1, color: "var(--st-text-faint)", fontWeight: 700 }}>{t("SEVERITY")}</span>
                {filterPill(t("All"), vfSev.length === 0, () => setState({ vulnFilterSeverities: [] }))}
                {(["critical", "high", "medium", "low", "info", "unrealized"] as Severity[]).map((s) => filterPill(cap(s), vfSev.includes(s), () => setState((st) => ({ vulnFilterSeverities: toggleIn(st.vulnFilterSeverities, s) }))))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ ...CARD, overflow: "hidden" }}>
          {vulns.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "48px minmax(0,1.8fr) minmax(0,1fr) 140px 110px 130px 120px 64px", gap: 10, padding: "13px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".5px", color: "var(--st-text-faint)", textTransform: "uppercase" }}>
              <div>#</div><div>{t("Title")}</div><div>{t("Host")}</div><div>{t("Status")}</div><div>{t("Severity")}</div><div>{t("Author")}</div><div>{t("Updated")}</div><div style={{ textAlign: "center" }}>{t("Actions")}</div>
            </div>
          )}
          {vulns.slice(0, LIST_CAP).map((v) => (
            <div key={v.num} className="prow clk" onClick={v.onOpen} style={{ display: "grid", gridTemplateColumns: "48px minmax(0,1.8fr) minmax(0,1fr) 140px 110px 130px 120px 64px", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid var(--st-divider)" }}>
              <div className="mono" style={{ fontSize: 13, color: "var(--st-text-faint)", fontWeight: 600 }}>{String(v.num).padStart(2, "0")}</div>
              <div style={{ font: "600 14px Inter,sans-serif", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</div>
              <div className="mono" style={{ fontSize: 12, color: "var(--st-text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.host}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, font: "600 12px Inter,sans-serif", color: VSTATUS[v.status] ?? "var(--st-text-3)" }}><span style={{ width: 6, height: 6, flex: "none", borderRadius: "50%", background: VSTATUS[v.status] ?? "var(--st-text-3)" }} />{t(VSTATUS_LABEL[v.status] ?? v.status)}</div>
              <span style={{ justifySelf: "start", font: "700 10.5px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 7, padding: "4px 9px", background: SEV[v.sev].bg, color: SEV[v.sev].color }}>{t(v.sev)}</span>
              <div className="mono" style={{ fontSize: 12, color: "var(--st-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.author}</div>
              <div className="mono" style={{ fontSize: 11.5, color: "var(--st-text-faint)" }}>{relTime(v.updated)}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 2 }}>
                {v.trackerUrl ? <Tip label={t("Open in Task Tracker")}><a className="actbtn" href={v.trackerUrl} target="_blank" rel="noopener noreferrer" aria-label={t("Open in Task Tracker")} onClick={(e) => e.stopPropagation()}><Icon name="eye" size={15} /></a></Tip> :
                  <Tip label={findingExportHint(v.sev)}><span className="export-availability" title={findingExportHint(v.sev)}><button type="button" className="actbtn" aria-label={t("Export to Task Tracker")} disabled={!canExportFinding(v.sev)} onClick={(e) => { e.stopPropagation(); openTaskTrackerExport(v.id); }}><Icon name="upload" size={15} /></button></span></Tip>}
                <Tip label={t("Delete")}><div className="actbtn del" onClick={v.onDelete}><Icon name="trash" size={15} /></div></Tip>
              </div>
            </div>
          ))}
          {capNote(vulns.length, Math.min(vulns.length, LIST_CAP))}
          {vulns.length === 0 && <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("No findings match these filters.")}</div>}
        </div>
      </div>
    );
  };

  const renderVulnDetail = () => {
    // openVulnId is a backend id, not a list index — look the finding up by id.
    const original = state.openVulnId != null ? d.vulns.find((v) => v.id === state.openVulnId) : undefined;
    /* «Affected host» — тот же пикер хостов проекта, что и в форме создания уязвимости:
       ранжируем как combo редактора (совпадение по префиксу выше), режем до COMBO_MAX. */
    const vdHostQ = (vd.host || "").trim().toLowerCase();
    const vdHostSuggestions = hosts
      .map((h) => h.host)
      .flatMap((hn) => {
        if (!vdHostQ) return [{ v: hn, rank: 0 }];
        if (hn.toLowerCase().startsWith(vdHostQ)) return [{ v: hn, rank: 0 }];
        if (hn.toLowerCase().includes(vdHostQ)) return [{ v: hn, rank: 1 }];
        return [] as { v: string; rank: number }[];
      })
      .sort((a, b) => a.rank - b.rank)
      .slice(0, COMBO_MAX)
      .map((x) => x.v);
    const vdHostHi = Math.min(state.vdHostComboHi, Math.max(vdHostSuggestions.length - 1, 0));
    const vdHostPick = (v: string) =>
      setState((s) => ({ vulnDetailForm: { ...s.vulnDetailForm, host: v }, vdHostComboOpen: false, vdHostComboHi: 0 }));
    return (
      <div className="vuln-detail" style={{ width: "100%" }}>
        <div style={{ marginBottom: 18 }}>
          <span className="clk" onClick={closeVulnDetail} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 12.5px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 20, padding: "7px 13px", cursor: "pointer" }}>
            <Icon name="chevron-left" size={15} />{t("All findings")}
          </span>
        </div>
        <div style={{ ...CARD, padding: "26px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label className="flabel">{t("Title")}</label>
              <input className="finp" value={vd.title || ""} onChange={(e) => updateVulnDetailForm("title", e.target.value)} style={{ font: "800 18px Inter,sans-serif" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label className="flabel">{t("Affected host")}</label>
              {/* Тот же пикер хостов проекта, что и в форме создания уязвимости —
                  подсказки при вводе; свободный ввод по-прежнему допускается. */}
              <div style={{ position: "relative" }}>
                <input
                  className="finp"
                  value={vd.host || ""}
                  placeholder={t("Start typing a hostname…")}
                  autoComplete="off"
                  onChange={(e) => { updateVulnDetailForm("host", e.target.value); setState({ vdHostComboOpen: true, vdHostComboHi: 0 }); }}
                  onFocus={() => setState({ vdHostComboOpen: true, vdHostComboHi: 0 })}
                  onBlur={() => setState({ vdHostComboOpen: false })}
                  onKeyDown={(e) => {
                    if (!state.vdHostComboOpen || vdHostSuggestions.length === 0) {
                      if (e.key === "ArrowDown") setState({ vdHostComboOpen: true, vdHostComboHi: 0 });
                      return;
                    }
                    if (e.key === "ArrowDown") { e.preventDefault(); setState({ vdHostComboHi: (vdHostHi + 1) % vdHostSuggestions.length }); }
                    else if (e.key === "ArrowUp") { e.preventDefault(); setState({ vdHostComboHi: (vdHostHi - 1 + vdHostSuggestions.length) % vdHostSuggestions.length }); }
                    else if (e.key === "Enter") { e.preventDefault(); vdHostPick(vdHostSuggestions[vdHostHi]); }
                    else if (e.key === "Escape") setState({ vdHostComboOpen: false });
                  }}
                />
                {state.vdHostComboOpen && vdHostSuggestions.length > 0 && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 12, boxShadow: "0 18px 44px rgba(15,27,45,.16)", zIndex: 60, padding: 6, overflow: "hidden" }}>
                    {vdHostSuggestions.map((hn, i) => (
                      <div
                        key={hn}
                        className="nav clk"
                        /* mousedown, а не click: click после blur-а инпута уже не долетит (список размонтируется). */
                        onMouseDown={(e) => { e.preventDefault(); vdHostPick(hn); }}
                        style={{ display: "flex", flexDirection: "column", gap: 1, padding: "8px 10px", borderRadius: 9, background: i === vdHostHi ? "var(--st-accent-soft)" : undefined }}
                      >
                        <span style={{ font: "600 13.5px Inter,sans-serif", color: i === vdHostHi ? "var(--st-accent)" : "var(--st-text)" }}>{hn}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div><label className="flabel">{t("CWE ID")}</label><input className="finp mono" placeholder={t("e.g. CWE-89")} value={vd.cwe || ""} onChange={(e) => updateVulnDetailForm("cwe", e.target.value)} /></div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label className="flabel">{t("CVSS 4.0 vector")}</label>
                <input className="finp mono" placeholder={t("CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N")} value={vd.vector || ""} onChange={(e) => updateVulnDetailForm("vector", e.target.value)} style={{ width: "100%", fontSize: 12.5 }} />
              </div>
              <div style={{ flex: "none", width: 150 }}>
                <label className="flabel">{t("Severity")}</label>
                <div className="finp" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, cursor: "default" }}>
                  <span style={{ font: "700 11px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "3px 8px", background: SEV[vdSev].bg, color: SEV[vdSev].color }}>{vdSev}</span>
                  <span className="mono" style={{ fontSize: 12.5, color: "var(--st-text-2)" }}>{vdScore}</span>
                </div>
              </div>
              <div style={{ flex: "none", width: 170 }}>
                <label className="flabel">{t("Status")}</label>
                <StormSelect
                  value={vd.status || "open"}
                  onChange={(v) => updateVulnDetailForm("status", v as VStatus)}
                  options={VSTATUS_ORDER.map((s) => ({ value: s, label: t(VSTATUS_LABEL[s]), dot: VSTATUS[s] }))}
                />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="flabel">{t("Steps to reproduce")}</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
              {(vd.stepsList ?? []).map((s, i) => {
                const imgs = (vd.stepImages ?? {})[i] ?? [];
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Номер и корзина центрируются по ПЕРВОЙ строке шага: обёртки
                        высотой 49px (высота однострочного редактора при minHeight 44 +
                        паддинги/бордер) с align-items:center, а строка выровнена по
                        верху (flex-start). Поэтому при многострочном тексте редактор
                        растёт вниз, а номер и корзина остаются напротив первой строки. */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flex: "none", height: 49, display: "flex", alignItems: "center" }}>
                        <span className="mono" style={{ width: 26, height: 26, borderRadius: 8, background: "var(--st-accent-soft)", color: "var(--st-accent)", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Suspense fallback={<div className="stormmd" style={{ minHeight: 44, color: "var(--st-text-faint)", font: "500 14px Inter,sans-serif" }}>{t("Loading editor…")}</div>}>
                          <StormMarkdownEditor value={s} onChange={(md) => updateVdStep(i, md)} onImagePaste={(files) => void attachVdStepImages(i, files)} placeholder={t("Describe this step… (paste a screenshot to attach)")} minHeight={44} />
                        </Suspense>
                      </div>
                      <div style={{ flex: "none", height: 49, display: "flex", alignItems: "center" }}>
                        <Tip label={t("Delete")}><div className="actbtn del" onClick={() => removeVdStep(i)}><Icon name="trash" size={15} /></div></Tip>
                      </div>
                    </div>
                    {imgs.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginLeft: 36 }}>
                        {imgs.map((fileId, ii) => {
                          const src = `/api/v1/files/${fileId}/download`;
                          return (
                          <div key={fileId} style={{ position: "relative" }}>
                            <img src={src} alt={`Step ${i + 1} screenshot ${ii + 1}`} title={t("Click to view")} onClick={() => setState({ lightboxSrc: src })} style={{ height: 78, borderRadius: 9, border: "1px solid var(--st-border-strong)", display: "block", cursor: "zoom-in" }} />
                            <div className="clk" onClick={() => removeVdStepImage(i, ii)} style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", background: "var(--st-danger)", color: "var(--st-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 13px Inter,sans-serif", lineHeight: 1, cursor: "pointer", border: "2px solid var(--st-surface)" }}>×</div>
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button className="clk" onClick={addVdStep} style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", border: "1px dashed var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 12.5px Inter,sans-serif", color: "var(--st-text-2)", cursor: "pointer" }}>
              <Icon name="plus" size={13} sw={2.4} />{t("Add step")}
            </button>
          </div>
          {/* Вложения: дропзона (клик открывает проводник / drag-drop) + список файлов. */}
          <div style={{ marginBottom: 18 }}>
            <label className="flabel">{t("Attachments")}</label>
            <label
              onDragOver={(e) => { e.preventDefault(); if (!state.vulnFileDrag) setState({ vulnFileDrag: true }); }}
              onDragLeave={() => setState({ vulnFileDrag: false })}
              onDrop={(e) => { e.preventDefault(); setState({ vulnFileDrag: false }); void uploadVulnFilesFor(Array.from(e.dataTransfer.files)); }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6, padding: "22px 16px", border: `1.5px dashed ${state.vulnFileDrag ? "var(--st-accent)" : "var(--st-border)"}`, borderRadius: 12, background: state.vulnFileDrag ? "var(--st-accent-soft)" : "var(--st-surface)", cursor: "pointer", textAlign: "center" }}
            >
              <Icon name="upload" size={20} color="var(--st-text-faint)" sw={2} />
              <div style={{ fontSize: 13, color: "var(--st-text-2)", fontWeight: 600 }}>{state.vulnFilesBusy ? t("Uploading…") : t("Drag & drop files here, or click to browse")}</div>
              <div style={{ fontSize: 11.5, color: "var(--st-text-faint)" }}>{t("Up to 50 MB each")}</div>
              <input type="file" multiple hidden onChange={(e) => { const fs = e.target.files ? Array.from(e.target.files) : []; e.currentTarget.value = ""; void uploadVulnFilesFor(fs); }} />
            </label>
            {state.vulnFiles.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                {state.vulnFiles.map((f) => (
                  <div key={f.id} className="listitem" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "1px solid var(--st-divider)", borderRadius: 10, background: "var(--st-surface)" }}>
                    <Icon name="doc" size={15} color="var(--st-text-3)" />
                    <span className="mono clk" title={t("Click to preview")} onClick={() => setState({ filePreview: f })} style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: "var(--st-accent-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>{f.original_name}</span>
                    <span className="mono" style={{ flex: "none", fontSize: 11, color: "var(--st-text-faint)" }}>{kb(f.size_bytes)}</span>
                    <Tip label={t("Download")}><a href={`/api/v1/files/${f.id}/download`} download={f.original_name} className="actbtn clk" title={t("Download")} style={{ cursor: "pointer", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}><Icon name="download" size={14} color="var(--st-text-3)" /></a></Tip>
                    <Tip label={t("Delete file")}><div className="actbtn del clk" title={t("Delete file")} onClick={() => void removeVulnFile(f.id)} style={{ cursor: "pointer" }}><Icon name="trash" size={14} color="var(--st-danger)" /></div></Tip>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="flabel">{t("Impact")}</label>
            <Suspense fallback={<div className="stormmd" style={{ minHeight: 90, color: "var(--st-text-faint)", font: "500 14px Inter,sans-serif" }}>{t("Loading editor…")}</div>}>
              <StormMarkdownEditor value={vd.impact || ""} onChange={(md) => updateVulnDetailForm("impact", md)} placeholder={t("Business/security impact if exploited…")} minHeight={90} />
            </Suspense>
          </div>
          <div>
            <label className="flabel">{t("Remediation")}</label>
            <Suspense fallback={<div className="stormmd" style={{ minHeight: 120, color: "var(--st-text-faint)", font: "500 14px Inter,sans-serif" }}>{t("Loading editor…")}</div>}>
              <StormMarkdownEditor value={vd.remediation || ""} onChange={(md) => updateVulnDetailForm("remediation", md)} placeholder={t("How to fix or mitigate this vulnerability…")} minHeight={120} />
            </Suspense>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, fontSize: 12, color: "var(--st-text-faint)" }}>
            <span>{t("Reported by")} <b style={{ color: "var(--st-text-3)" }}>{original?.author}</b> · {relTime(original?.updated)}</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="clk" onClick={closeVulnDetail} style={{ height: 40, padding: "0 18px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button>
              <button className="clk" onClick={saveVulnDetail} style={{ height: 40, padding: "0 20px", border: "none", borderRadius: 10, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif" }}>{t("Save changes")}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /** First non-empty line of the body, with Markdown syntax stripped — the card preview. */
  const notePreview = (md: string) => {
    const line = md.replace(/\r/g, "").split("\n").map((l) => l.trim()).find((l) => l && !/^[-*_]{3,}$/.test(l)) ?? "";
    return line
      .replace(/^#{1,6}\s+/, "")
      .replace(/^\s*[-*]\s+/, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  };

  /* The project credential vault: a shared table of username/password accounts.
     Passwords are masked by default; the eye reveals one row, the copy button
     lifts a value to the clipboard without revealing it. Everyone who can open
     the project can view and edit these, like notes. */
  // Fixed action column (not `auto`) so the header and every row share identical
  // column widths — otherwise the empty header cell and the 2-button rows compute
  // different 1fr widths and the "Password" header drifts off its column.
  const credCols = "34px minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 72px";
  // Fixed-width password box: the mask fills it, so nothing moves when a row is
  // revealed — the eye/copy buttons stay put (the shift bug). Long values ellipsize.
  const CRED_MASK = "••••••••••••••••";
  const renderCreds = () => {
    if (state.apiCreds === null) {
      return <div className="route" style={{ ...CARD, padding: 48, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("Loading credentials…")}</div>;
    }
    const monoCell: CSSProperties = { font: "500 13px 'JetBrains Mono',monospace", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
    const empty = d.creds.length === 0;
    return (
      <div className="route" style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        {/* Column headers only make sense with rows — hide them for an empty vault. */}
        {!empty && (
          <div style={{ display: "grid", gridTemplateColumns: credCols, gap: 14, alignItems: "center", padding: "12px 20px", borderBottom: "1px solid var(--st-divider)", font: "700 11px Inter,sans-serif", letterSpacing: ".5px", textTransform: "uppercase", color: "var(--st-text-faint)" }}>
            <div>#</div>
            <div>{t("Username")}</div>
            <div>{t("Password")}</div>
            <div>{t("Host")}</div>
            <div style={{ textAlign: "right" }}>{t("Actions")}</div>
          </div>
        )}
        {d.creds.map((c, idx) => {
          const revealed = state.revealedCredIds.includes(c.id);
          return (
            <div key={c.id} className="prow" style={{ display: "grid", gridTemplateColumns: credCols, gap: 14, alignItems: "center", padding: "15px 20px", borderBottom: "1px solid var(--st-divider)" }}>
              {/* row index */}
              <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: "var(--st-text-faint)" }}>{String(idx + 1).padStart(2, "0")}</div>
              {/* username + copy — one line */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                <span style={{ ...monoCell, fontSize: 14, fontWeight: 700, flex: "0 1 auto" }}>{c.username || <span style={{ color: "var(--st-text-faint)" }}>—</span>}</span>
                {c.username && <Tip label={t("Copy username")}><div className="actbtn" title={t("Copy username")} onClick={() => copyText(c.username, "Username")}><Icon name="copy" size={14} /></div></Tip>}
              </div>
              {/* password (masked) + reveal + copy — the value box is a fixed width so
                  revealing never shifts the icons */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                {c.passwordAvailable === false ? <span style={{ ...monoCell, flex: '0 1 auto', color: 'var(--st-text-faint)' }} title={t('Ask an administrator to restore the encryption key, or set a new password.')}>{t('Password unavailable')}</span> : <>
                <span style={{ ...monoCell, flex: "0 1 18ch" }}>{revealed ? c.password : CRED_MASK}</span>
                <Tip label={revealed ? t("Hide password") : t("Reveal password")}><div className="actbtn" title={revealed ? t("Hide password") : t("Reveal password")} onClick={() => toggleCredReveal(c.id)}><Icon name={revealed ? "lock" : "eye"} size={14} /></div></Tip>
                <Tip label={t("Copy password")}><div className="actbtn" title={t("Copy password")} onClick={() => copyText(c.password, "Password")}><Icon name="copy" size={14} /></div></Tip>
                </>}
              </div>
              {/* host — which host these creds belong to */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                <span style={{ ...monoCell, flex: "0 1 auto" }}>{c.host || <span style={{ color: "var(--st-text-faint)" }}>—</span>}</span>
                {c.host && <Tip label={t("Copy host")}><div className="actbtn" title={t("Copy host")} onClick={() => copyText(c.host, "Host")}><Icon name="copy" size={14} /></div></Tip>}
              </div>
              {/* row actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                <Tip label={t("Edit")}><div className="actbtn" title={t("Edit")} onClick={() => openEditor("cred", "edit", idx)}><Icon name="edit" size={15} /></div></Tip>
                <Tip label={t("Delete")}><div className="actbtn del" title={t("Delete")} onClick={() => askDelete("cred", idx, c.username || "credential")}><Icon name="trash" size={15} /></div></Tip>
              </div>
            </div>
          );
        })}
        {empty && (
          <div style={{ padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>
            {t("No credentials yet. Add a username and password for this project.")}
          </div>
        )}
      </div>
    );
  };

  const renderNotes = () => (
    <div className="route" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {d.notes.map((n, idx) => {
        const mine = n.author === me;
        return (
          // Клик по своей заметке открывает её сразу в редакторе (как карточка уязвимости);
          // чужую — только на просмотр (read-only).
          <div key={n.id} className="statc listitem clk" onClick={() => (mine ? openNoteEditor("edit", idx) : openNoteViewer(n.id))} style={{ ...CARD, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ font: "700 15px Inter,sans-serif", color: "var(--st-text)" }}>{n.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }}>
                {mine && (
                  <Tip label={t("Delete")}><div className="actbtn del" onClick={(e) => { e.stopPropagation(); askDelete("note", idx, n.title); }}><Icon name="trash" size={15} /></div></Tip>
                )}
                <span className="mono" style={{ fontSize: 11.5, color: "var(--st-text-faint)" }}>{n.when}</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "var(--st-text-3)", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{notePreview(n.excerpt)}</div>
            <div className="mono" style={{ fontSize: 11.5, color: "var(--st-text-3)", marginTop: 12 }}>{n.author}</div>
          </div>
        );
      })}
      {d.notes.length === 0 && <div style={{ ...CARD, padding: 52, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("No notes yet.")}</div>}
    </div>
  );

  /* The note deep link (/projects/{p}/notes/{n}) renders the body as Markdown.
     Your own notes get an Edit button here rather than opening raw on click. */
  const renderNoteViewer = () => {
    const idx = d.notes.findIndex((x) => x.id === state.openNoteId);
    const n = idx === -1 ? undefined : d.notes[idx];
    if (!n) {
      if (state.apiNotes === null) return <div className="route" style={{ ...CARD, padding: 48, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("Loading note…")}</div>;
      return renderNoAccess("Note not found.");
    }
    const mine = n.author === me;
    // Read-only заметка показывается в том же лейауте, что и редактор (All notes +
    // Title + Content), только поля не редактируются и нет Save.
    return (
      <div className="route" style={{ width: "100%" }}>
        <div style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span className="clk" onClick={backToNotesList} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 12.5px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 20, padding: "7px 13px", cursor: "pointer" }}>
            <Icon name="chevron-left" size={15} />{t("All notes")}
          </span>
          {mine ? (
            <button className="addbtn clk" onClick={() => openNoteEditor("edit", idx)} style={{ height: 40 }}>
              <Icon name="edit" size={15} color="var(--st-on-accent)" sw={2.4} />{t("Edit note")}
            </button>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 11.5px Inter,sans-serif", color: "var(--st-text-3)", background: "var(--st-divider)", borderRadius: 20, padding: "6px 12px" }}>
              <Icon name="eye" size={13} />{t("Read only")}
            </span>
          )}
        </div>
        <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "22px 22px 8px" }}>
            <label className="flabel">{t("Title")}</label>
            <input className="finp" value={n.title} readOnly style={{ font: "700 16px Inter,sans-serif", height: 48, background: "var(--st-elevated)", cursor: "default" }} />
          </div>
          <div style={{ padding: "14px 22px 24px" }}>
            <label className="flabel">{t("Content")}</label>
            {/* Та же «коробка», что у редактора (класс .stormmd), только не редактируется. */}
            <div className="stormmd" style={{ cursor: "default", marginTop: 8 }}>{renderMarkdown(n.excerpt)}</div>
          </div>
          <div style={{ padding: "14px 22px" }}>
            <span className="mono" style={{ fontSize: 11.5, color: "var(--st-text-faint)" }}>{n.author} · {n.when}</span>
          </div>
        </div>
      </div>
    );
  };

  // Редактор заметки — как карточка уязвимости: «All notes» сверху, поля инлайн,
  // Save/Cancel снизу. После сохранения редактор остаётся открытым.
  const renderNoteEditor = () => {
    const editing = state.noteEditorMode === "edit" ? d.notes.find((note) => note.id === state.noteEditorId) ?? d.notes[state.noteEditorIndex] : undefined;
    const footAuthor = editing?.author ?? me;
    const footWhen = editing?.when ?? "";
    return (
    <div className="route" style={{ width: "100%" }}>
      <div style={{ marginBottom: 18 }}>
        <span className="clk" onClick={backToNotesList} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "600 12.5px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 20, padding: "7px 13px", cursor: "pointer" }}>
          <Icon name="chevron-left" size={15} />{t("All notes")}
        </span>
      </div>
      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "22px 22px 8px" }}>
          <label className="flabel">{t("Title")}</label>
          <input className="finp" placeholder={t("Give this note a title…")} value={state.noteForm.title} onChange={(e) => updateNoteForm("title", e.target.value)} style={{ font: "700 16px Inter,sans-serif", height: 48, background: "var(--st-elevated)" }} />
        </div>
        {/* Markdown renders as you type (### + space → heading, right in the line) —
            the note is still stored as Markdown, so the viewer and the reports read
            exactly what was typed. */}
        <div style={{ padding: "14px 22px 20px" }}>
          <label className="flabel">{t("Content")}</label>
          <Suspense fallback={<div className="stormmd" style={{ minHeight: 260, color: "var(--st-text-faint)", font: "500 14px Inter,sans-serif" }}>{t("Loading editor…")}</div>}>
            <StormMarkdownEditor
              value={state.noteForm.excerpt}
              onChange={(md) => updateNoteForm("excerpt", md)}
              onImagePaste={(files) => void attachNoteImages(files)}
              placeholder={t("Write your note… «### » makes a heading, «- » a list (paste a screenshot to insert it)")}
            />
          </Suspense>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 22px" }}>
          <span className="mono" style={{ fontSize: 11.5, color: "var(--st-text-faint)" }}>{footAuthor}{footWhen ? ` · ${footWhen}` : ""}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="clk" onClick={backToNotesList} style={{ height: 40, padding: "0 18px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button>
            <button className="clk" disabled={noteSaveDisabled} onClick={saveNote} style={{ height: 40, padding: "0 20px", border: "none", borderRadius: 10, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", cursor: noteSaveDisabled ? "default" : "pointer", opacity: noteSaveDisabled ? .45 : 1 }}>{state.noteSaving ? t("Saving…") : t("Save changes")}</button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderMembers = () => {
    const mq = state.memberQuery.trim().toLowerCase();
    const filtered = d.members
      .map((m, idx) => ({ m, idx }))
      .filter(({ m }) => (state.memberRoles.length === 0 || state.memberRoles.includes(m.role)) && (!mq || m.name.toLowerCase().includes(mq)));
    return (
      <div className="route">
        {/* search + role filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <label className="fq" style={{ position: "relative", display: "flex", alignItems: "center", width: 280 }}>
            <svg style={{ position: "absolute", left: 13 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--st-text-faint)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
            <input placeholder={t("Search by username…")} value={state.memberQuery} onChange={(e) => setState({ memberQuery: e.target.value })} />
          </label>
          <div style={{ flex: 1 }} />
          {/* Every pill toggles; an empty selection means "All". */}
          <span className="mono" style={{ fontSize: 10.5, letterSpacing: 1, color: "var(--st-text-faint)", fontWeight: 700 }}>{t("ROLE")}</span>
          <div className="clk filter-pill" onClick={() => setState({ memberRoles: [] })} style={{ font: "600 12px Inter,sans-serif", padding: "6px 12px", borderRadius: 20, cursor: "pointer", ...vfPill(state.memberRoles.length === 0) }}>{t("All")}</div>
          {([{ label: "Lead", v: "lead" as const }, { label: "Pentester", v: "pentester" as const }]).map((o) => (
            <div key={o.v} className="clk filter-pill" onClick={() => setState((s) => ({ memberRoles: toggleIn(s.memberRoles, o.v) }))} style={{ font: "600 12px Inter,sans-serif", padding: "6px 12px", borderRadius: 20, cursor: "pointer", ...vfPill(state.memberRoles.includes(o.v)) }}>{t(o.label)}</div>
          ))}
        </div>
        <div style={{ ...CARD, overflow: "hidden" }}>
          {filtered.map(({ m, idx }) => (
            <div key={m.name + idx} className="prow" style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 20px", borderBottom: "1px solid var(--st-divider)" }}>
              <UserAvatar name={m.name} src={m.id === authUser?.id ? authUser.avatar_url : m.avatarUrl} initials={m.initials} size={38} fontSize={13} background={m.color} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ font: "600 14px Inter,sans-serif", color: "var(--st-text)" }}>{m.name}</span>
                  <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 6, padding: "2px 8px", background: ROLE[m.role].bg, color: ROLE[m.role].color }}>{m.role}</span>
                </div>
                <div className="mono" style={{ fontSize: 12, color: "var(--st-text-faint)", marginTop: 2 }}>{m.email}</div>
              </div>
              {canManageMembers && (
                <div style={{ display: "flex", gap: 2 }}>
                  <Tip label={t("Delete")}><div className="actbtn del" onClick={() => askDelete("member", idx, m.name)}><Icon name="trash" size={15} /></div></Tip>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div style={{ padding: 44, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("No members match.")}</div>}
        </div>
      </div>
    );
  };

  /* UPDATE/DELETE audit rows carry no details, so the feed resolves the entity's
     name from the project data already loaded rather than printing "#12". */
  const resolveActivityName: ActivityResolver = (type, id) => {
    if (id == null) return null;
    if (type === "host") return hosts.find((h) => h.id === id)?.host ?? null;
    if (type === "vulnerability") return d.vulns.find((v) => v.id === id)?.title ?? null;
    if (type === "project_note" || type === "note") return d.notes.find((n) => n.id === id)?.title ?? null;
    if (type === "project") return projRow?.id === id ? projRow.name : null;
    if (type === "endpoint") {
      for (const h of hosts) {
        const e = h.endpoints.find((x) => x.id === id);
        if (e) return `${e.m} ${e.p}`;
      }
    }
    return null;
  };

  /* Grouped up-front rather than inside renderActivity: the tab's counter must
     match what the feed actually lists (cards, ports already dropped), and it has
     to be right before the tab is opened. */
  const activityGroups = groupActivity(state.activity ?? [], resolveActivityName);

  /** One line of the dark event panel: + text [SEVERITY]. */
  const activityLineRow = (l: ActivityLine, tone: ActTone) => (
    <div key={l.key} style={{ display: "flex", alignItems: "center", gap: 9, whiteSpace: "nowrap" }}>
      <span className="mono" style={{ flex: "none", width: 10, textAlign: "center", font: "700 12.5px 'JetBrains Mono',monospace", color: tone.color }}>
        {tone.mark}
      </span>
      <span style={{ font: "600 12.5px 'JetBrains Mono',monospace", color: "var(--st-code-text)", textOverflow: "ellipsis", overflow: "hidden" }}>{l.text}</span>
      {/* Severity sits in a chip filled with that severity's own colour. */}
      {l.severity && (
        <span
          className="mono"
          style={{ flex: "none", font: "700 9.5px 'JetBrains Mono',monospace", letterSpacing: ".4px", textTransform: "uppercase", borderRadius: 4, padding: "3px 6px", background: ACT_SEV[l.severity], color: "var(--st-on-accent)" }}
        >
          {l.severity}
        </span>
      )}
    </div>
  );

  /* Project activity: /projects/{id}/activity, visible to every project member.
     One white card per action per entity type, each listing exactly *what* was
     touched inside a dark panel. Long lists collapse to ACT_LINE_LIMIT rows and
     open in full in a modal. */
  const renderActivity = () => {
    const logs = state.activity ?? [];
    if (state.activityLoading && logs.length === 0)
      return <div className="route" style={{ ...CARD, padding: 48, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("Loading activity…")}</div>;
    if (state.activityError) return renderNoAccess(state.activityError);
    const groups = activityGroups;
    if (groups.length === 0)
      return <div className="route" style={{ ...CARD, padding: 48, textAlign: "center", color: "var(--st-text-faint)", fontSize: 14 }}>{t("No activity yet.")}</div>;
    return (
      <div className="route" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {groups.map((g) => {
          const hidden = g.lines.length - ACT_LINE_LIMIT;
          const shown = hidden > 0 ? g.lines.slice(0, ACT_LINE_LIMIT) : g.lines;
          return (
            <div key={g.key} className="listitem" style={{ ...CARD, padding: "16px 18px", display: "flex", gap: 13 }}>
              <span
                className="mono"
                style={{ width: 32, height: 32, flex: "none", borderRadius: "50%", background: g.actor === "System" ? "var(--st-accent-soft)" : "var(--st-accent)", color: g.actor === "System" ? "var(--st-accent-2)" : "var(--st-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 11px 'JetBrains Mono',monospace" }}
              >
                {g.actor === "System" ? <Icon name="clock2" size={15} /> : avatarLetter(g.actor)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* The count reads inline — "admin added 3 IP addresses" — rather
                    than as a separate badge repeating what the list already shows. */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div style={{ fontSize: 13.5, color: "var(--st-text-2)", lineHeight: 1.5, flex: 1, minWidth: 0 }}>
                    <b className="mono" style={{ color: "var(--st-text)" }}>{g.actor === "System" ? t("System") : g.actor}</b> {t(g.verb)} <b style={{ color: "var(--st-text)" }}>{g.subject}</b>
                  </div>
                  <span className="mono" style={{ flex: "none", fontSize: 11.5, color: "var(--st-text-faint)" }}>{g.time}</span>
                </div>
                <div style={{ marginTop: 11, background: "var(--st-code-bg)", borderRadius: 10, padding: "11px 13px", display: "flex", flexDirection: "column", gap: 6, overflowX: "auto" }}>
                  {shown.map((l) => activityLineRow(l, g.tone))}
                  {hidden > 0 && (
                    <div
                      className="clk"
                      onClick={() => setState({ activityModalKey: g.key })}
                      style={{ marginTop: 3, font: "700 11.5px Inter,sans-serif", color: "var(--st-accent-muted)", cursor: "pointer" }}
                    >
                      {t("Show more ·")} {hidden} {t("more")}
                    </div>
                  )}
                </div>
                {/* Findings link out from under the panel — the title itself is plain text. */}
                {g.vulnId != null && (
                  <div
                    className="clk"
                    onClick={() => openVulnDetail(g.vulnId as number)}
                    style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 5, font: "700 12px Inter,sans-serif", color: "var(--st-accent-2)", cursor: "pointer" }}
                  >
                    {t("Show details")}<Icon name="chevron-right" size={13} sw={2.4} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ---------- Profile ----------
  const renderProfile = () => (
    <div className="route" style={{ padding: "40px 48px 36px", width: "100%" }}>
      {eyebrow([{ label: "Account", muted: true }, { label: "Profile settings", muted: true }])}
      <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-.7px", color: "var(--st-text)" }}>{t("Profile Settings")}</h1>
      <div style={{ fontSize: 13.5, color: "var(--st-text-3)", marginTop: 6 }}>{t("Signed in as")} <b style={{ color: "var(--st-text-2)" }}>{me}</b> · {t("manage your account, security, integrations & automation")}</div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 22, alignItems: "start", marginTop: 26 }}>
        <div style={{ ...CARD, padding: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 12px 16px" }}>
            {meAvatar(44, 17, meInitials)}
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "700 14px Inter,sans-serif", color: "var(--st-text)" }}>{meDisplay}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3, font: "600 11.5px Inter,sans-serif", color: "var(--st-success)" }}><Icon name="shield-check" size={12} sw={2.2} />{t("Active account")}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div className="listitem clk" onClick={() => setState({ profileTab: "account" })} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, cursor: "pointer", font: "600 13.5px Inter,sans-serif", ...pfNav("account") }}><Icon name="user1" size={17} />{t("Account")}</div>
            <div className="listitem clk" onClick={() => setState({ profileTab: "security" })} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, cursor: "pointer", font: "600 13.5px Inter,sans-serif", ...pfNav("security") }}>
              <Icon name="lock" size={17} /><span style={{ flex: 1 }}>{t("Security")}</span>
              {twoFAEnabled && <span className="mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".5px", color: "var(--st-success)", background: "var(--st-success-soft)", borderRadius: 6, padding: "2px 6px" }}>{t("2FA")}</span>}
            </div>
            <div className="listitem clk" onClick={() => setState({ profileTab: "api" })} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, cursor: "pointer", font: "600 13.5px Inter,sans-serif", ...pfNav("api") }}><Icon name="plug" size={17} />{t("API & Automation")}</div>
            <div className="listitem clk" onClick={() => setState({ profileTab: "customizing" })} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, cursor: "pointer", font: "600 13.5px Inter,sans-serif", ...pfNav("customizing") }}><Icon name={theme === "dark" ? "moon" : "sun"} size={17} />{t("Customizing")}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {state.profileTab === "account" && renderProfileAccount()}
          {state.profileTab === "security" && renderProfileSecurity()}
          {state.profileTab === "api" && renderProfileApi()}
          {state.profileTab === "customizing" && renderProfileCustomizing()}
        </div>
      </div>
    </div>
  );

  const cardHeader = (icon: Parameters<typeof Icon>[0]["name"], title: string, sub: string, right?: ReactNode) => (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, flex: "none", borderRadius: 10, background: "var(--st-accent-soft)", color: "var(--st-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={icon} size={19} /></div>
        <div><div style={{ font: "700 15px Inter,sans-serif", color: "var(--st-text)" }}>{t(title)}</div><div style={{ fontSize: 12.5, color: "var(--st-text-3)", marginTop: 2 }}>{t(sub)}</div></div>
      </div>
      {right}
    </div>
  );

  const renderProfileAccount = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ ...CARD, padding: "22px 24px" }}>
        {cardHeader("image", "Profile Picture", "Shown next to your name across the workspace")}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {meAvatar(84, 30, meInitials[0], avatarPreview || (authUser?.avatar_url ?? null))}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input id="pfFileInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" style={{ display: "none" }} onChange={onAvatarPick} />
              <label htmlFor="pfFileInput" className="clk" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 18px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)", cursor: "pointer" }}><Icon name="image" size={15} />{t("Choose file")}</label>
              <button className="clk avatar-upload" disabled={!avatarFile || avatarUploading} onClick={submitAvatar} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 18px", border: "none", borderRadius: 11, background: !avatarFile || avatarUploading ? "var(--st-accent-muted)" : "var(--st-accent)", color: "#fff", font: "700 13px Inter,sans-serif", cursor: !avatarFile || avatarUploading ? "not-allowed" : "pointer" }}><Icon name="upload" size={15} color="currentColor" />{avatarUploading ? t("Uploading…") : t("Upload")}</button>
              {avatarFile && !avatarUploading && (
                <button className="clk" onClick={clearAvatarPick} style={{ display: "inline-flex", alignItems: "center", height: 42, padding: "0 14px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-3)", cursor: "pointer" }}>{t("Cancel")}</button>
              )}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--st-text-faint)", marginTop: 12 }}>
              {avatarFile ? (
                <span style={{ color: "var(--st-text-2)" }}>{t("Selected:")} <b>{avatarFile.name}</b> {t("— press Upload to save.")}</span>
              ) : (
                <>{t("PNG / JPEG / WEBP / GIF, up to")} <b style={{ color: "var(--st-text-3)" }}>{t("5 MB")}</b>{t(". Square images look best.")}</>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...CARD, padding: "22px 24px" }}>
        {cardHeader("idcard", "Account identity", "Read-only — managed by your administrator", <span style={{ font: "700 11px Inter,sans-serif", color: "var(--st-text-2)", background: "var(--st-hover)", border: "1px solid var(--st-border-light)", borderRadius: 8, padding: "5px 11px" }}>{t("Active account")}</span>)}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: "1px solid var(--st-divider)", borderRadius: 12, overflow: "hidden" }}>
          {[
            { label: "Username", value: me, mono: true, color: "var(--st-text)" },
            { label: "Email", value: meEmail, mono: true, color: "var(--st-text)", small: true },
            { label: "Role", value: meRoleLabel, mono: false, color: "var(--st-accent)" },
            { label: "User ID", value: String(meId), mono: true, color: "var(--st-accent-2)", last: true },
          ].map((c, i) => (
            <div key={i} style={{ padding: "15px 18px", borderRight: c.last ? "none" : "1px solid var(--st-divider)" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: ".8px", color: "var(--st-text-faint)", fontWeight: 700, textTransform: "uppercase" }}>{t(c.label)}</div>
              <div className={c.mono ? "mono" : undefined} style={{ fontSize: c.small ? 13 : 14, color: c.color, fontWeight: c.mono ? 600 : 700, marginTop: 7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...(c.mono ? {} : { font: "700 13px Inter,sans-serif" }) }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfileCustomizing = () => {
    // One selectable option tile, shared by the Appearance and Language cards.
    const tile = (key: string, active: boolean, onClick: () => void, icon: Parameters<typeof Icon>[0]["name"], title: string, desc: string) => (
      <div
        key={key}
        className="listitem clk"
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 13,
          padding: "16px 18px",
          border: `1.5px solid ${active ? "var(--st-accent)" : "var(--st-border-light)"}`,
          borderRadius: 14,
          background: active ? "var(--st-accent-soft)" : "var(--st-surface)",
          cursor: "pointer",
          transition: "border-color .12s, background .12s",
        }}
      >
        <div style={{ width: 38, height: 38, flex: "none", borderRadius: 10, background: active ? "var(--st-surface)" : "var(--st-hover)", color: active ? "var(--st-accent)" : "var(--st-text-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={19} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ font: "700 14px Inter,sans-serif", color: active ? "var(--st-accent)" : "var(--st-text)" }}>{title}</span>
            {active && <Icon name="check-circle" size={15} color="var(--st-accent)" sw={2.2} />}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--st-text-3)", marginTop: 4, lineHeight: 1.45 }}>{desc}</div>
        </div>
      </div>
    );
    const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 };
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Appearance / theme */}
        <div style={{ ...CARD, padding: "22px 24px" }}>
          {cardHeader("sun", t("Appearance"), t("Choose how STORM looks — saved on this browser"))}
          <div style={grid}>
            {tile("light", theme === "light", () => setTheme("light"), "sun", t("Light"), t("Bright interface — the STORM default."))}
            {tile("dark", theme === "dark", () => setTheme("dark"), "moon", t("Dark"), t("Dimmed palette, easier on the eyes in low light."))}
          </div>
        </div>
        {/* Language */}
        <div style={{ ...CARD, padding: "22px 24px" }}>
          {cardHeader("globe", t("Language"), t("Language of the interface — saved on this browser"))}
          <div style={grid}>
            {tile("en", lang === "en", () => setLang("en"), "globe", "English", t("Interface in English."))}
            {tile("ru", lang === "ru", () => setLang("ru"), "globe2", "Русский", t("Interface in Russian."))}
          </div>
        </div>
      </div>
    );
  };

  const renderProfileSecurity = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ ...CARD, padding: "22px 24px" }}>
      {cardHeader("lock", "Two-factor authentication", "Protect sign-in with a Google Authenticator code")}
      {twoFAEnabled ? (
        state.twoFADisableOpen ? (
          <div style={{ border: "1px solid var(--st-divider)", borderRadius: 12, padding: 18 }}>
            <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text)", marginBottom: 12 }}>{t("Confirm your account password to disable 2FA")}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input className="finp" type="password" autoComplete="current-password" placeholder={t("Account password")} value={state.twoFADisablePassword} onChange={(e) => setState({ twoFADisablePassword: e.target.value })} style={{ maxWidth: 240 }} />
              <button className="clk" onClick={disableTwoFA} disabled={!state.twoFADisablePassword || state.twoFABusy} style={{ height: 44, padding: "0 18px", border: "none", borderRadius: 11, background: !state.twoFADisablePassword || state.twoFABusy ? "var(--st-danger-muted)" : "var(--st-danger)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", cursor: !state.twoFADisablePassword || state.twoFABusy ? "not-allowed" : "pointer" }}>{state.twoFABusy ? t("Disabling…") : t("Disable 2FA")}</button>
              <button className="clk" onClick={cancelDisableTwoFA} style={{ height: 44, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)", cursor: "pointer" }}>{t("Cancel")}</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /><span style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{t("Enabled via authenticator app")}</span></div>
            <button className="clk" onClick={openDisableTwoFA} style={{ height: 38, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 12.5px Inter,sans-serif", color: "var(--st-danger)", cursor: "pointer" }}>{t("Disable")}</button>
          </div>
        )
      ) : state.twoFASetupOpen ? (
        <div style={{ border: "1px solid var(--st-divider)", borderRadius: 12, padding: 18 }}>
          <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text)", marginBottom: 14 }}>{t("1. Scan this QR in your authenticator app")}</div>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            {state.twoFAQr ? (
              <img src={state.twoFAQr} alt={t("TOTP QR code")} width={120} height={120} style={{ flex: "none", borderRadius: 10, border: "1px solid var(--st-divider)", imageRendering: "pixelated" }} />
            ) : (
              <div style={{ width: 120, height: 120, flex: "none", borderRadius: 10, background: "var(--st-hover)", border: "1px solid var(--st-divider)" }} />
            )}
            <div>
              <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text)", marginBottom: 6 }}>{t("Or enter this key manually")}</div>
              <div className="mono" style={{ fontSize: 13, letterSpacing: 1, background: "var(--st-hover)", border: "1px solid var(--st-divider)", borderRadius: 8, padding: "8px 12px", display: "inline-block", whiteSpace: "nowrap", maxWidth: "100%", overflowX: "auto" }}>{state.twoFASecret || "…"}</div>
            </div>
          </div>
          <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text)", margin: "18px 0 10px" }}>{t("2. Enter the 6-digit code")}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input className="finp" inputMode="numeric" maxLength={6} placeholder="000000" value={state.twoFACode} onChange={(e) => setState({ twoFACode: e.target.value.replace(/\D/g, "") })} style={{ maxWidth: 160, font: "700 16px 'JetBrains Mono',monospace", letterSpacing: 4, textAlign: "center" }} />
            <button className="clk" onClick={confirmTwoFA} disabled={state.twoFACode.trim().length < 6 || state.twoFABusy} style={{ height: 44, padding: "0 18px", border: "none", borderRadius: 11, background: state.twoFACode.trim().length < 6 || state.twoFABusy ? "var(--st-accent-muted)" : "var(--st-accent)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", cursor: state.twoFACode.trim().length < 6 || state.twoFABusy ? "not-allowed" : "pointer" }}>{state.twoFABusy ? t("Verifying…") : t("Verify & enable")}</button>
            <button className="clk" onClick={cancelTwoFA} style={{ height: 44, padding: "0 16px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)", cursor: "pointer" }}>{t("Cancel")}</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, border: "1px solid var(--st-divider)", borderRadius: 12, padding: "14px 16px" }}>
          <span style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Two-factor authentication is currently disabled.")}</span>
          <button className="clk" onClick={startTwoFA} disabled={state.twoFABusy} style={{ height: 38, padding: "0 16px", border: "none", borderRadius: 10, background: state.twoFABusy ? "var(--st-accent-muted)" : "var(--st-accent)", color: "var(--st-on-accent)", font: "700 12.5px Inter,sans-serif", cursor: state.twoFABusy ? "not-allowed" : "pointer" }}>{state.twoFABusy ? t("Preparing…") : t("Enable 2FA")}</button>
        </div>
      )}
    </div>
    {!authUser?.is_sso && (
      <div style={{ ...CARD, padding: "22px 24px" }}>
        {cardHeader("lock", "Change password", "Update the password you sign in with")}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
          <div>
            <label className="flabel">{t("Current password")}</label>
            <PasswordInput autoComplete="current-password" placeholder="••••••••" value={state.pwdCurrent} onChange={(v) => setState({ pwdCurrent: v })} />
          </div>
          <div>
            <label className="flabel">{t("New password")}</label>
            <PasswordInput autoComplete="new-password" placeholder={t("At least 8 characters")} value={state.pwdNew} onChange={(v) => setState({ pwdNew: v })} />
          </div>
          <div>
            <label className="flabel">{t("Confirm new password")}</label>
            <PasswordInput autoComplete="new-password" placeholder="••••••••" value={state.pwdConfirm} onChange={(v) => setState({ pwdConfirm: v })} />
          </div>
          <div>
            <button className="clk" onClick={submitPasswordChange} disabled={state.pwdBusy} style={{ height: 44, padding: "0 20px", border: "none", borderRadius: 11, background: state.pwdBusy ? "var(--st-accent-muted)" : "var(--st-accent)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", cursor: state.pwdBusy ? "not-allowed" : "pointer" }}>{state.pwdBusy ? t("Saving…") : t("Change password")}</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );

  const renderProfileApi = () => (
    <div style={{ ...CARD, padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div><div style={{ font: "700 15px Inter,sans-serif", color: "var(--st-text)" }}>{t("API keys")}</div><div style={{ fontSize: 12.5, color: "var(--st-text-3)", marginTop: 2 }}>{t("Scoped tokens for CI, bots and automation — no interactive login")}</div></div>
        <button className="clk" onClick={openApiKeyModal} style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 40, padding: "0 16px", border: "none", borderRadius: 10, background: "var(--st-accent)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", cursor: "pointer" }}><Icon name="plus" size={14} color="var(--st-on-accent)" sw={2.2} />{t("Generate new key")}</button>
      </div>
      <div style={{ marginTop: 14, border: "1px solid var(--st-divider)", borderRadius: 12, overflow: "hidden" }}>
        {state.apiKeys.map((k) => (
          <div key={k.id} className="listitem" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderTop: "1px solid var(--st-divider)" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{k.name}</div>
              <div className="mono" style={{ fontSize: 12, color: "var(--st-text-3)", marginTop: 4 }}>{k.key}</div>
              <div style={{ fontSize: 11, color: "var(--st-text-faint)", marginTop: 4 }}>
                {k.allProjects ? t("All projects") : `${t("Projects:")} ${k.projectCount ?? 0}`}
                {" · "}
                {k.expires ? `until ${k.expires}` : t("no expiry")}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, maxWidth: 280, justifyContent: "flex-end" }}>
              {k.scopes.map((sc) => <span key={sc} className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--st-accent)", background: "var(--st-accent-soft)", borderRadius: 6, padding: "3px 8px" }}>{sc}</span>)}
            </div>
            <div className="mono" style={{ fontSize: 11.5, color: "var(--st-text-faint)", width: 80, textAlign: "right" }}>{k.created}</div>
            <Tip label={t("Delete")}><div className="actbtn del" onClick={() => revokeApiKey(k.id)} style={{ flex: "none" }}><Icon name="trash" size={15} /></div></Tip>
          </div>
        ))}
        {state.apiKeys.length === 0 && <div style={{ padding: "22px 16px", textAlign: "center", color: "var(--st-text-faint)", fontSize: 13 }}>{t("No API keys yet.")}</div>}
      </div>
    </div>
  );

  // ---------- Modals ----------
  const modalShell = (open: boolean, onClose: () => void, zIndex: number, width: number, children: ReactNode, align: "center" | "flex-start" = "center", pad = "24px") => (
    <div className={`modalback ${open ? "open" : ""}`} onClick={onClose} style={{ position: "absolute", inset: 0, zIndex, background: "rgba(20,28,40,.42)", display: "flex", alignItems: align, justifyContent: "center", padding: pad, overflow: align === "flex-start" ? "auto" : undefined }}>
      <div className="modalcard" onClick={stop} style={{ width, maxWidth: "100%", background: "var(--st-surface)", borderRadius: 20, boxShadow: "0 30px 80px rgba(15,27,45,.3)", padding: "28px 28px 24px" }}>
        {children}
      </div>
    </div>
  );

  const modalFooter = (onCancel: () => void, onSave: () => void, saveLabel: string, saveBg = "var(--st-accent-2)", disabled = false) => (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
      <button className="clk" onClick={onCancel} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button>
      <button className="clk" onClick={onSave} disabled={disabled} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: saveBg, color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", opacity: disabled ? .45 : 1, cursor: disabled ? "default" : "pointer" }}>{t(saveLabel)}</button>
    </div>
  );

  return (
    <div className="storm" style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--st-bg)", position: "relative" }}>
      {/* top app bar */}
      <header style={{ height: 58, flex: "none", display: "flex", alignItems: "center", gap: 14, padding: "0 22px", background: "var(--st-surface)", borderBottom: "1px solid var(--st-border-light)", zIndex: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="button" className="brand-home" aria-label={t("Go to home page")} onClick={selProjects} style={{ display: "flex", alignItems: "center", gap: 10, padding: 0, border: 0, background: "transparent", cursor: "pointer" }}>
          <SberMark size={23} />
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.3px" }}><span style={{ color: "var(--st-text)" }}>{t("Sber")}</span><span style={{ color: "var(--st-accent-2)" }}>{t("Tech")}</span></div>
          </button>
          <div style={{ width: 1, height: 22, background: "var(--st-border-strong)", margin: "0 4px" }} />
          <div className="mono brand-tagline" style={{ fontSize: 10.5, letterSpacing: 2, color: "var(--st-text-faint)", fontWeight: 600 }}>{t("OFFENSIVE RESEARCH & MANAGEMENT")}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div className="clk nav iconbtn" onClick={() => toggle("notifOpen")} style={{ width: 40, height: 40, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: "var(--st-text-3)" }}>
          <Icon name="bell" size={19} />
          {hasUnread && <span style={{ position: "absolute", top: 6, right: 7, width: 8, height: 8, borderRadius: "50%", background: "var(--st-danger)", border: "2px solid var(--st-surface)" }} />}
        </div>
        <div className="clk" onClick={() => toggle("userMenuOpen")} style={{ display: "flex", alignItems: "center", gap: 9, padding: 4, borderRadius: 24 }}>
          {meAvatar(34, 12.5, meInitials)}
          <Icon name="chevron-down" size={15} color="var(--st-text-faint)" sw={2.2} style={{ transform: state.userMenuOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </div>
      </header>

      {/* user menu */}
      {state.userMenuOpen && <div onClick={() => setState({ userMenuOpen: false })} style={{ position: "absolute", inset: 0, zIndex: 40 }} />}
      <div className={`menu ${state.userMenuOpen ? "open" : ""}`} style={{ position: "absolute", top: 56, right: 16, width: 270, background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 16, boxShadow: "0 20px 54px rgba(15,27,45,.18)", zIndex: 50, overflow: "hidden" }}>
        <div style={{ padding: "22px 20px 16px", textAlign: "center", borderBottom: "1px solid var(--st-elevated)" }}>
          <div style={{ width: 60, height: 60, margin: "0 auto 12px", borderRadius: "50%", border: "1px solid var(--st-border-light)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>{meAvatar(60, 24, meInitials)}</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--st-text)" }}>{meDisplay}</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--st-text-faint)", marginTop: 3 }}>{meEmail}</div>
        </div>
        <div style={{ padding: 8 }}>
          <div className="nav clk" onClick={openProfile} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}><Icon name="user" size={18} color="var(--st-text-3)" />{t("Profile")}</div>
          <div style={{ height: 1, background: "var(--st-elevated)", margin: "6px 4px" }} />
          <div className="nav clk" onClick={() => { setState({ userMenuOpen: false }); void signOut(); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, font: "600 13.5px Inter,sans-serif", color: "var(--st-danger)" }}><Icon name="logout" size={18} color="currentColor" />{t("Logout")}</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* sidebar */}
        <aside className={`sb ${sidebarCollapsed ? "collapsed" : ""}`} style={{ width: sideW, flex: "none", background: "var(--st-surface)", borderRight: "1px solid var(--st-border-light)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="sbhead" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 14px 18px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
              <div className="lbl" style={{ fontWeight: 800, fontSize: 16, letterSpacing: 3, color: "var(--st-text)" }}>{t("STORM")}</div>
            </div>
            <div className="clk nav iconbtn" onClick={() => toggle("sidebarCollapsed")} style={{ width: 26, height: 26, flex: "none", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--st-text-faint)" }}>
              <Icon name="chevrons-left" size={18} color="currentColor" sw={2.4} style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "none", transition: "transform .26s ease" }} />
            </div>
          </div>
          <div className="lbl mono" style={{ padding: "0 20px 8px", fontSize: 10, letterSpacing: 1.5, color: "var(--st-text-faint)", fontWeight: 700 }}>{t("WORKSPACE")}</div>
          <nav style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 3 }}>
            {([
              { id: "projects" as const, icon: "folder" as const, label: "Projects", onClick: selProjects },
              { id: "tasks" as const, icon: "check-square" as const, label: "Tasks", onClick: () => setState({ nav: "tasks", view: "list", tasksOpenKey: null }) },
              { id: "docs" as const, icon: "doc" as const, label: "Docs", onClick: () => setState({ nav: "docs", view: "list" }) },
              ...(isAdmin ? [{ id: "members" as const, icon: "users" as const, label: "Members", onClick: selWSMembers }] : []),
            ]).map((it) => (
              <div key={it.id} className="nav clk" title={t(it.label)} onClick={it.onClick} style={{ display: "flex", alignItems: "center", gap: 13, padding: "10px 12px", borderRadius: 11, font: "600 14px Inter,sans-serif", color: navColor(it.id), background: navBg(it.id) }}>
                <Icon name={it.icon} size={19} color="currentColor" style={{ flex: "none" }} />
                <span className="lbl">{t(it.label)}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* main column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          {/* Скролл-контейнер — колонка: контент растёт и прижимает футер к низу,
              поэтому футер виден только когда страница прокручена в самый низ
              (а не висит постоянной полосой под областью прокрутки). */}
          <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: "1 0 auto" }}>
              {isList && renderProjects()}
              {isDocs && (
                <Suspense fallback={<div className="route" style={{ padding: "40px 48px", color: "var(--st-text-faint)", font: "500 14px Inter,sans-serif" }}>{t("Loading docs…")}</div>}>
                  <StormDocs isAdmin={isAdmin} onNavigateWorkspace={selProjects} />
                </Suspense>
              )}
              {isTasks && renderTasks()}
              {/* /members is admin-only (GET /users is too) — say so rather than
                  quietly showing the projects list instead. */}
              {state.view === "workspaceMembers" &&
                (isAdmin
                  ? renderWorkspaceMembers()
                  : renderNoAccessPage("The Members section is admin-only — this is where users are created and roles assigned."))}
              {state.view === "detail" && (state.accessDenied ? renderNoAccessPage() : renderDetail())}
              {state.view === "profile" && renderProfile()}
            </div>
            <footer style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, background: "transparent", fontSize: 12.5, color: "var(--st-text-faint)", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, color: "var(--st-text-3)" }}>{t("STORM")}</span><span>·</span><span>{t("Licensed to SberTech · Copyright © 2026. All rights reserved.")}</span>
            </footer>
          </main>
        </div>
      </div>

      {/* ===== modals ===== */}
      {/* workspace user editor */}
      {modalShell(
        state.wsUserModalOpen,
        closeWSUserEditor,
        60,
        440,
        <>
          <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{state.wsUserMode === "add" ? t("Invite member") : t("Edit member")}</h2>
          {state.wsUserMode === "add" ? (
            <>
              <div style={{ marginTop: 16 }}><label className="flabel">{t("Email")}</label><input className="finp" placeholder={t("user@sbertech.ru")} value={state.wsUserEmail} onChange={(e) => setState({ wsUserEmail: e.target.value })} /></div>
            </>
          ) : (
            <>
              {/* Юзернейм неизменяем (даже админом) — как и email: только для чтения. */}
              <div style={{ marginTop: 20 }}><label className="flabel">{t("Username")}</label><input className="finp" value={state.wsUserName} disabled style={{ background: "var(--st-elevated)", color: "var(--st-text-3)" }} /></div>
              <div style={{ marginTop: 16 }}><label className="flabel">{t("Email")}</label><input className="finp" placeholder={t("user@sbertech.ru")} value={state.wsUserEmail} disabled style={{ background: "var(--st-elevated)", color: "var(--st-text-3)" }} /></div>
            </>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
            <div>
              <label className="flabel">{t("Workspace role")}</label>
              <StormSelect
                value={state.wsUserRole}
                onChange={(v) => setState({ wsUserRole: v as WsRole })}
                options={[
                  { value: "user", label: "User", dot: WS_ROLE.user.color, desc: "Works on assigned projects" },
                  { value: "admin", label: "Admin", dot: WS_ROLE.admin.color, desc: "Manages the whole workspace" },
                ]}
              />
            </div>
            <div>
              <label className="flabel">{t("Project role")}</label>
              <StormSelect
                value={state.wsUserProjectRole}
                onChange={(v) => setState({ wsUserProjectRole: v as Role })}
                options={[
                  { value: "lead", label: "Lead", dot: ROLE.lead.color, desc: "Leads the project team" },
                  { value: "pentester", label: "Pentester", dot: ROLE.pentester.color, desc: "Tests and reports findings" },
                ]}
              />
            </div>
          </div>
          {modalFooter(closeWSUserEditor, saveWSUser, state.wsUserMode === "add" ? t("Send invite") : t("Save"), "var(--st-accent)")}
        </>
      )}

      {/* generate API key */}
      {modalShell(
        state.apiKeyModalOpen,
        closeApiKeyModal,
        60,
        460,
        <>
          <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Generate API key")}</h2>
          <div style={{ marginTop: 20 }}><label className="flabel">{t("Key name")}</label><input className="finp" placeholder={t("e.g. CI pipeline")} value={state.apiKeyName} onChange={(e) => setState({ apiKeyName: e.target.value })} /></div>
          <div style={{ marginTop: 16 }}>
            <label className="flabel">{t("Permissions")}</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, border: "1px solid var(--st-divider)", borderRadius: 11, overflow: "hidden", marginTop: 6 }}>
              {API_SCOPES.map((s) => {
                const checked = !!state.apiKeyScopes[s];
                return (
                  <div key={s} className="prow listitem clk" onClick={() => toggleApiScope(s)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderTop: "1px solid var(--st-divider)", cursor: "pointer" }}>
                    <span style={{ width: 18, height: 18, flex: "none", borderRadius: 5, border: `1.5px solid ${checked ? "var(--st-accent)" : "var(--st-border)"}`, background: checked ? "var(--st-accent)" : "var(--st-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {checked && <Icon name="check" size={12} color="var(--st-on-accent)" sw={3} />}
                    </span>
                    <span className="mono" style={{ fontSize: 12, color: "var(--st-text)", flex: "none" }}>{s}</span>
                    <span style={{ fontSize: 12, color: "var(--st-text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t(API_SCOPE_LABELS[s])}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="flabel">{t("Project access")}</label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <div className="clk filter-pill" onClick={() => setState({ apiKeyAllProjects: true })} style={{ font: "600 12.5px Inter,sans-serif", padding: "7px 13px", borderRadius: 9, cursor: "pointer", ...vfPill(state.apiKeyAllProjects) }}>{t("All my projects")}</div>
              <div className="clk filter-pill" onClick={() => setState({ apiKeyAllProjects: false })} style={{ font: "600 12.5px Inter,sans-serif", padding: "7px 13px", borderRadius: 9, cursor: "pointer", ...vfPill(!state.apiKeyAllProjects) }}>{t("Selected projects")}</div>
            </div>
            {!state.apiKeyAllProjects && (
              <div style={{ marginTop: 8, border: "1px solid var(--st-divider)", borderRadius: 11, maxHeight: 168, overflow: "auto" }}>
                {(state.apiProjects ?? []).map((p) => {
                  const checked = state.apiKeyProjectIds.includes(p.id);
                  return (
                    <div key={p.id} className="prow listitem clk" onClick={() => toggleApiProject(p.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderTop: "1px solid var(--st-divider)", cursor: "pointer" }}>
                      <span style={{ width: 18, height: 18, flex: "none", borderRadius: 5, border: `1.5px solid ${checked ? "var(--st-accent)" : "var(--st-border)"}`, background: checked ? "var(--st-accent)" : "var(--st-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {checked && <Icon name="check" size={12} color="var(--st-on-accent)" sw={3} />}
                      </span>
                      <span style={{ fontSize: 12.5, color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                    </div>
                  );
                })}
                {(state.apiProjects ?? []).length === 0 && <div style={{ padding: 16, textAlign: "center", color: "var(--st-text-faint)", fontSize: 12.5 }}>{t("No projects available.")}</div>}
              </div>
            )}
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="flabel">{t("Expiry")}</label>
            <StormDatePicker value={state.apiKeyExpiry} onChange={(v) => setState({ apiKeyExpiry: v })} min={new Date().toISOString().slice(0, 10)} placeholder={t("No expiry")} />
          </div>
          {modalFooter(closeApiKeyModal, createApiKey, t("Generate key"), "var(--st-accent)")}
        </>
      )}

      {/* new project */}
      {modalShell(
        state.modalOpen,
        closeNewProject,
        60,
        480,
        <>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("New project")}</h2>
          <div style={{ fontSize: 13.5, color: "var(--st-text-3)", marginTop: 6 }}>{t("Create a project workspace for a new engagement.")}</div>
          <div style={{ marginTop: 22 }}>
            <label className="flabel">{t("Project name")}</label>
            <input className="finp" style={state.newNameError && !state.newName.trim() ? { borderColor: "var(--st-danger)", boxShadow: "0 0 0 3px var(--st-danger-soft)" } : undefined} placeholder={t("e.g. Acme Corp — External Perimeter")} value={state.newName} onChange={(e) => setState({ newName: e.target.value, newNameError: false })} />
            {state.newNameError && !state.newName.trim() && <div style={{ marginTop: 6, font: "600 12px Inter,sans-serif", color: "var(--st-danger)" }}>{t("Project name is required")}</div>}
          </div>
          <div style={{ marginTop: 16 }}>
            <StormAppSecFields key={state.modalOpen ? "create-open" : "create-closed"} value={state.newAppsec} onChange={(p) => setState({ newAppsec: { ...state.newAppsec, ...p } })} works={state.worksEnabled} t={t} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
            {/* min/max keep the pickers themselves from offering an inverted range. */}
            <div><label className="flabel">{t("Start date")}</label><StormDatePicker value={state.newStart} onChange={(v) => setState({ newStart: v })} max={state.newEnd || undefined} /></div>
            <div><label className="flabel">{t("End date")}</label><StormDatePicker value={state.newEnd} onChange={(v) => setState({ newEnd: v })} min={state.newStart || undefined} /></div>
          </div>
          {datesInvalid(state.newStart, state.newEnd) && (
            <div style={{ marginTop: 8, font: "600 12px Inter,sans-serif", color: "var(--st-danger)" }}>{DATES_ERROR}</div>
          )}
          {modalFooter(closeNewProject, createProject, "Create project")}
        </>
      )}

      {/* edit project */}
      {modalShell(
        state.projEditOpen,
        closeProjEdit,
        60,
        480,
        <>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Edit project")}</h2>
          <div style={{ marginTop: 20 }}><label className="flabel">{t("Project name")}</label><input className="finp" value={state.projEditName} onChange={(e) => setState({ projEditName: e.target.value })} /></div>
          <div style={{ marginTop: 16 }}>
            <label className="flabel">{t("Status")}</label>
            <StormSelect
              value={state.projEditStatus}
              onChange={(v) => setState({ projEditStatus: v as ProjectStatus })}
              options={PROJECT_STATUS_ORDER.map((s) => ({ value: s, label: t(PROJ_STATUS[s]?.label ?? s), dot: PROJ_STATUS[s]?.dot }))}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <StormAppSecFields key={`${state.projEditId ?? "edit"}:${state.projEditOpen}`} value={state.projEditAppsec} onChange={(p) => setState({ projEditAppsec: { ...state.projEditAppsec, ...p } })} works={state.worksEnabled} t={t} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
            <div><label className="flabel">{t("Start date")}</label><StormDatePicker value={state.projEditStart} onChange={(v) => setState({ projEditStart: v })} max={state.projEditEnd || undefined} /></div>
            <div><label className="flabel">{t("End date")}</label><StormDatePicker value={state.projEditEnd} onChange={(v) => setState({ projEditEnd: v })} min={state.projEditStart || undefined} /></div>
          </div>
          {datesInvalid(state.projEditStart, state.projEditEnd) && (
            <div style={{ marginTop: 8, font: "600 12px Inter,sans-serif", color: "var(--st-danger)" }}>{DATES_ERROR}</div>
          )}
          {modalFooter(closeProjEdit, saveProjEdit, t("Save"))}
        </>
      )}

      {/* activity: the full list behind a card's "Show more" */}
      {(() => {
        const g = state.activityModalKey ? activityGroups.find((x) => x.key === state.activityModalKey) : undefined;
        const close = () => setState({ activityModalKey: null });
        return modalShell(
          !!g,
          close,
          60,
          620,
          <>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>
              {g ? `${g.actor === "System" ? t("System") : g.actor} ${t(g.verb)} ${g.subject}` : ""}
            </h2>
            {g && <div className="mono" style={{ marginTop: 6, fontSize: 11.5, color: "var(--st-text-faint)" }}>{g.time}</div>}
            <div style={{ marginTop: 16, background: "var(--st-code-bg)", borderRadius: 10, padding: "12px 13px", display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflow: "auto" }}>
              {g?.lines.map((l) => activityLineRow(l, g.tone))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button className="clk" onClick={close} style={{ height: 40, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 10, background: "var(--st-surface)", font: "700 13px Inter,sans-serif", color: "var(--st-text-2)", cursor: "pointer" }}>{t("Close")}</button>
            </div>
          </>
        );
      })()}

      {/* export: Word report generation (backend templates szi / pp) */}
      {modalShell(
        state.exportModalOpen && state.exportScope === "report",
        closeExportModal,
        60,
        480,
        <>
          <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export report")}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            {REPORT_KINDS.map((r) => {
              const on = state.exportKind === r.kind;
              return (
                <div
                  key={r.kind}
                  className="listitem clk"
                  onClick={() => setState({ exportKind: r.kind })}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 12, cursor: "pointer", border: `1.5px solid ${on ? "var(--st-accent-2)" : "var(--st-border-light)"}`, background: on ? "var(--st-accent-soft)" : "var(--st-surface)" }}
                >
                  <span style={{ width: 18, height: 18, flex: "none", marginTop: 2, borderRadius: "50%", border: `1.5px solid ${on ? "var(--st-accent)" : "var(--st-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", background: on ? "var(--st-accent)" : "var(--st-surface)" }}>
                    {on && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--st-surface)" }} />}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ font: "700 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{t(r.title)}</div>
                    <div style={{ fontSize: 12.5, color: "var(--st-text-3)", marginTop: 3, lineHeight: 1.5 }}>{t(r.desc)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
            <button className="clk" onClick={closeExportModal} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button>
            <button className="clk" onClick={doExport} disabled={state.exportBusy} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: state.exportBusy ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: state.exportBusy ? "default" : "pointer" }}>
              {state.exportBusy ? t("Generating…") : t("Download .docx")}
            </button>
          </div>
        </>
      )}

      {/* export: single vulnerability -> TaskTracker issue */}
      {modalShell(
        state.taskTrackerExportOpen,
        closeTaskTrackerExport,
        60,
        460,
        (() => {
          const v = state.taskTrackerExportVulnId != null ? d.vulns.find((x) => x.id === state.taskTrackerExportVulnId) : undefined;
          const link = state.taskTrackerExportLink;
          const isLinked = !!(link && link.status === "linked" && link.task_tracker_issue_key);
          const exportDisabled = state.taskTrackerExportBusy || state.taskTrackerExportChecking;
          return (
            <>
              <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export to Task Tracker")}</h2>

              {v && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 14px", border: "1px solid var(--st-divider)", borderRadius: 12 }}>
                  <span style={{ font: "700 10px Inter,sans-serif", textTransform: "uppercase", letterSpacing: ".5px", borderRadius: 7, padding: "4px 9px", background: SEV[v.sev].bg, color: SEV[v.sev].color, flex: "none" }}>{t(v.sev)}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ font: "600 14px Inter,sans-serif", color: "var(--st-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</div>
                    <div className="mono" style={{ fontSize: 12, color: "var(--st-text-3)", marginTop: 2 }}>{v.host}</div>
                  </div>
                </div>
              )}

              {/* Статус-блок рендерим ТОЛЬКО когда есть что показать (проверка /
                  уже экспортировано / ошибка). Иначе — без пустого зарезервированного
                  пространства: карточка находки идёт сразу к кнопкам. */}
              {(state.taskTrackerExportChecking || isLinked || state.taskTrackerExportError) && (
                <div style={{ marginTop: 16 }}>
                  {state.taskTrackerExportChecking ? (
                    <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-3)" }}>{t("Checking status…")}</div>
                  ) : isLinked ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "13px 15px" }}>
                      <Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} />
                      <div style={{ font: "600 13.5px Inter,sans-serif", color: "var(--st-text)" }}>
                        {t("Already exported:")}{" "}
                        <a href={link!.task_tracker_issue_url} target="_blank" rel="noreferrer" style={{ color: "var(--st-accent)", fontWeight: 700 }}>{link!.task_tracker_issue_key}</a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: "var(--st-danger)", font: "600 12.5px Inter,sans-serif" }}>{state.taskTrackerExportError}</div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                {isLinked ? (
                  <>
                    <a className="clk" href={link!.task_tracker_issue_url} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open in Task Tracker")}</a>
                    <button className="clk" onClick={closeTaskTrackerExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button>
                  </>
                ) : (
                  <>
                    <button className="clk" onClick={closeTaskTrackerExport} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Cancel")}</button>
                    <button className="clk" onClick={doTaskTrackerExport} disabled={exportDisabled} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: exportDisabled ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: exportDisabled ? "default" : "pointer" }}>
                      {state.taskTrackerExportBusy ? t("Exporting…") : t("Export")}
                    </button>
                  </>
                )}
              </div>
            </>
          );
        })()
      )}

      {/* export: all listed vulnerabilities -> TaskTracker issues */}
      {modalShell(
        state.taskTrackerBulkOpen,
        closeBulkTaskTracker,
        60,
        460,
        (() => {
          const total = vulns.filter((finding) => finding.sev !== "unrealized").length;
          const excluded = vulns.length - total;
          const pct = state.taskTrackerBulkTotal > 0 ? Math.round((state.taskTrackerBulkDone / state.taskTrackerBulkTotal) * 100) : 0;
          return (
            <>
              <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px" }}>{t("Export all to Task Tracker")}</h2>
              {excluded > 0 && <p style={{ color: "var(--st-text-2)", fontSize: 12 }}>{t("Unrealized findings skipped: {count}", { count: excluded })}</p>}

              <div style={{ marginTop: 16 }}>
                {state.taskTrackerBulkFinished ? (
                  <div style={{ border: "1px solid var(--st-success-soft)", background: "var(--st-success-soft)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}><Icon name="check-circle" size={18} color="var(--st-success)" sw={2.2} /><span style={{ font: "700 13.5px Inter,sans-serif", color: "var(--st-text)" }}>{t("Export finished")}</span></div>
                    <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.7 }}>
                      {t("Created:")} <b>{state.taskTrackerBulkCreated}</b><br />
                      {t("Already linked (skipped):")} <b>{state.taskTrackerBulkSkipped}</b><br />
                      {t("Failed:")} <b style={{ color: state.taskTrackerBulkFailed ? "var(--st-danger)" : "var(--st-text-2)" }}>{state.taskTrackerBulkFailed}</b>
                    </div>
                  </div>
                ) : state.taskTrackerBulkRunning ? (
                  <div>
                    <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", marginBottom: 10 }}>{t("Exporting")} {state.taskTrackerBulkDone} / {state.taskTrackerBulkTotal}…</div>
                    <div style={{ height: 8, background: "var(--st-divider)", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "var(--st-accent)", transition: "width .2s" }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ font: "600 13px Inter,sans-serif", color: "var(--st-text-2)", lineHeight: 1.5 }}>
                    {t("This will create a Task Tracker issue (in To Do) for each of the")} <b style={{ color: "var(--st-text)" }}>{total}</b> {t("listed")} {total === 1 ? t("vulnerability") : t("vulnerabilities")} {t("(page filters apply). Already-linked findings are skipped.")}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                {state.taskTrackerBulkFinished ? (
                  <>
                    {state.taskTrackerBulkProjectUrl && (
                      <a className="clk" href={state.taskTrackerBulkProjectUrl} target="_blank" rel="noreferrer" style={{ height: 42, padding: "0 20px", borderRadius: 11, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{t("Open Task Tracker")}</a>
                    )}
                    <button className="clk" onClick={closeBulkTaskTracker} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)" }}>{t("Done")}</button>
                  </>
                ) : (
                  <>
                    <button className="clk" onClick={closeBulkTaskTracker} disabled={state.taskTrackerBulkRunning} style={{ height: 42, padding: "0 20px", border: "1px solid var(--st-border)", borderRadius: 11, background: "var(--st-surface)", font: "700 13.5px Inter,sans-serif", color: "var(--st-text-2)", cursor: state.taskTrackerBulkRunning ? "default" : "pointer" }}>{t("Cancel")}</button>
                    <button className="clk" onClick={doBulkTaskTrackerExport} disabled={state.taskTrackerBulkRunning || total === 0} style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 11, background: state.taskTrackerBulkRunning || total === 0 ? "var(--st-accent-muted)" : "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13.5px Inter,sans-serif", cursor: state.taskTrackerBulkRunning || total === 0 ? "default" : "pointer" }}>
                      {state.taskTrackerBulkRunning ? t("Exporting…") : `${t("Export")} ${total}`}
                    </button>
                  </>
                )}
              </div>
            </>
          );
        })()
      )}

      {/* entity editor */}
      {modalShell(
        state.editorOpen,
        closeEditor,
        60,
        480,
        <>
          <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "var(--st-text)", letterSpacing: "-.4px", textTransform: "capitalize" }}>{`${state.editorMode === "add" ? t("Add") : t("Edit")} ${t(TYPELABEL[state.editorType])}`}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 15, marginTop: 22 }}>
            {editorFields.map((f) => (
              <div key={f.key}>
                <label className="flabel">{t(f.label)}</label>
                {f.isText && <input className="finp" placeholder={t(f.placeholder)} value={f.value} onChange={f.onInput} />}
                {f.isTextarea && <textarea className="finp" rows={3} placeholder={t(f.placeholder)} value={f.value} onChange={f.onInput} />}
                {f.isSelect && (
                  <StormSelect
                    value={f.value}
                    onChange={(v) => f.onInput({ target: { value: v } } as unknown as ChangeEvent<HTMLSelectElement>)}
                    options={f.options.map((o) => ({ value: o.value, label: o.label }))}
                    placeholder={t("Select…")}
                  />
                )}
                {/* Type-to-search over a long option list (hosts, workspace users).
                    A native datalist renders as an unstyleable OS popup, so the
                    suggestions are drawn here instead — top COMBO_MAX matches,
                    prefix hits first. Free text is still accepted. */}
                {f.isCombo && (
                  <div style={{ position: "relative" }}>
                    <input
                      className="finp"
                      placeholder={t(f.placeholder)}
                      value={f.value}
                      onChange={f.onComboInput}
                      onFocus={f.onComboFocus}
                      onBlur={f.onComboBlur}
                      onKeyDown={f.onComboKeyDown}
                      autoComplete="off"
                    />
                    {f.comboOpen && (
                      <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--st-surface)", border: "1px solid var(--st-border-light)", borderRadius: 12, boxShadow: "0 18px 44px rgba(15,27,45,.16)", zIndex: 60, padding: 6, overflow: "hidden" }}>
                        {f.suggestions.map((o) => (
                          <div
                            key={o.value}
                            className="nav clk"
                            /* mousedown would blur the input and unmount the list
                               before the click lands, so pick on mousedown. */
                            onMouseDown={(e) => {
                              e.preventDefault();
                              o.onPick();
                            }}
                            style={{ display: "flex", flexDirection: "column", gap: 1, padding: "8px 10px", borderRadius: 9, background: o.active ? "var(--st-accent-soft)" : undefined }}
                          >
                            <span style={{ font: "600 13.5px Inter,sans-serif", color: o.active ? "var(--st-accent)" : "var(--st-text)" }}>{o.label}</span>
                            {o.sub && <span className="mono" style={{ fontSize: 11.5, color: "var(--st-text-3)" }}>{o.sub}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {f.isTags && (
                  <div>
                    {f.tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                        {f.tags.map((t, ti) => (
                          <span key={ti} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600, color: "var(--st-text-2)", background: "var(--st-hover)", border: "1px solid var(--st-border-light)", borderRadius: 7, padding: "4px 6px 4px 9px" }}>
                            {t.value}
                            <span className="clk" onClick={t.onRemove} style={{ display: "flex", color: "var(--st-text-faint)" }}><Icon name="close" size={12} sw={2.4} /></span>
                          </span>
                        ))}
                      </div>
                    )}
                    <input className="finp" placeholder={t(f.placeholder)} value={f.tagDraft} onChange={f.onTagDraft} onKeyDown={f.onTagKeyDown} />
                  </div>
                )}
              </div>
            ))}
          </div>
          {modalFooter(closeEditor, saveEditor, state.ipEditBusy ? t("Saving…") : state.editorMode === "add" ? t("Create") : t("Save changes"), "var(--st-accent-2)", state.editorType === "ip" && state.editorMode === "edit" && (state.ipEditBusy || !fstr(state.editorForm.ip).trim() || fstr(state.editorForm.ip).trim() === fstr(state.editorForm.originalIp)))}
        </>
      )}

      {/* delete confirm */}
      {modalShell(
        state.confirmOpen,
        closeConfirm,
        65,
        420,
        state.confirmUserId != null ? (
          /* Пользователя не удаляем, а деактивируем — формулировки об этом и говорят
             (действие обратимо: разблокировать можно тут же на странице участников). */
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
              <span style={{ width: 42, height: 42, flex: "none", borderRadius: "50%", background: "var(--st-danger-soft)", color: "var(--st-danger)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="lock" size={20} /></span>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "var(--st-text)" }}>{t("Block user")}</h2>
            </div>
            <div style={{ fontSize: 14, color: "var(--st-text-2)", lineHeight: 1.55 }}>
              <b style={{ color: "var(--st-text)" }}>{state.confirmLabel}</b> {t("will lose access, but their projects, findings and notes stay. You can reactivate them here later.")}
            </div>
            {modalFooter(closeConfirm, confirmDelete, t("Block"), "var(--st-danger)")}
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
              <span style={{ width: 42, height: 42, flex: "none", borderRadius: "50%", background: "var(--st-danger-soft)", color: "var(--st-danger)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="trash" size={20} /></span>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "var(--st-text)" }}>{pendingDeleteLabel ?? t("Confirm deletion")}</h2>
            </div>
            <div style={{ fontSize: 14, color: "var(--st-text-2)", lineHeight: 1.55 }}>{pendingDeleteLabel ? t("Revoke this invitation for") : t("Are you sure you want to delete")} <b style={{ color: "var(--st-text)" }}>{state.confirmLabel}</b>{t("? This action cannot be undone.")}</div>
            {modalFooter(closeConfirm, confirmDelete, pendingDeleteLabel ?? t("Delete"), "var(--st-danger)")}
          </>
        )
      )}

      {/* endpoint detail */}
      <div className={`modalback ${state.epOpen ? "open" : ""}`} aria-hidden={!state.epOpen} onClick={closeEndpoint} style={{ position: "absolute", inset: 0, zIndex: 66, background: "rgba(20,28,40,.42)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 24px", overflow: "auto" }}>
        <div className="modalcard" role="dialog" aria-modal="true" aria-label={t("Endpoint request")} onClick={stop} style={{ width: 820, maxWidth: "100%", background: "var(--st-surface)", borderRadius: 20, boxShadow: "0 30px 80px rgba(15,27,45,.3)", padding: "24px 26px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span className="mono" style={{ fontWeight: 700, borderRadius: 6, padding: "3px 10px", fontSize: 12, background: (METHOD[state.epData.method] ?? PORT.closed).bg, color: (METHOD[state.epData.method] ?? PORT.closed).color }}>{state.epData.method}</span>
            <span className="mono" style={{ font: "700 15px 'JetBrains Mono',monospace", color: "var(--st-text)" }}>{state.epData.path}</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--st-text-3)", background: "var(--st-hover)", borderRadius: 6, padding: "3px 9px" }}>{state.epData.host}</span>
            <div style={{ flex: 1 }} />
            <Tip label={t("Close")}><div className="clk actbtn" onClick={closeEndpoint}><Icon name="close" size={18} /></div></Tip>
          </div>
          {/* Full-width request box (the response scratchpad was removed). The copy
              control builds a ready cURL for this endpoint; the raw request below is
              still editable and stored on the endpoint. */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div className="mono" style={{ fontSize: 10.5, letterSpacing: 1, color: "var(--st-text-faint)", fontWeight: 700 }}>{t("REQUEST")}</div>
              <div style={{ flex: 1 }} />
              <button type="button" style={requestCopyStyle} disabled={state.epLoading} onClick={() => void copyText(state.epRequest, "Request")}><Icon name="copy" size={14} />{t("Copy request")}</button>
              <button type="button" style={requestCopyStyle} disabled={state.epLoading} onClick={copyEndpointCurl}><Icon name="copy" size={14} />{t("Copy cURL")}</button>
            </div>
            <textarea className="finp mono" aria-label={t("HTTP request")} disabled={state.epLoading || state.epSaving} rows={9} style={{ fontSize: 12, lineHeight: 1.6, resize: "vertical" }} value={state.epRequest} onChange={(e) => setState({ epRequest: e.target.value })} placeholder={`${state.epData.method} ${state.epData.path} HTTP/1.1`} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button type="button" className="clk" disabled={endpointSaveDisabled} onClick={() => void saveEndpointRequest()} style={{ height: 40, padding: "0 18px", border: "none", borderRadius: 10, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", cursor: endpointSaveDisabled ? "default" : "pointer", opacity: endpointSaveDisabled ? .45 : 1 }}>{state.epSaving ? t("Saving…") : t("Save changes")}</button>
          </div>
          <div style={{ height: 1, background: "var(--st-divider)", margin: "22px 0 18px" }} />
          {state.epOpen && state.openProjectId != null && <EndpointDiscussion key={`${state.openProjectId}:${state.epData.hostId}:${state.epData.endpointId}`} projectId={state.openProjectId} hostId={state.epData.hostId} endpointId={state.epData.endpointId} />}
        </div>
      </div>

      {/* notifications panel */}
      <div className={`notifback ${state.notifOpen ? "open" : ""}`} onClick={() => setState({ notifOpen: false })} style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(20,28,40,.3)", display: "flex", justifyContent: "flex-end" }}>
        <div className="notifpanel" onClick={stop} style={{ width: 390, maxWidth: "90%", height: "100%", background: "var(--st-surface)", boxShadow: "-20px 0 60px rgba(15,27,45,.2)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "22px 24px 18px", borderBottom: "1px solid var(--st-divider)" }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: "var(--st-text)" }}>{t("Notifications")}</div>
            <span className="mono" style={{ padding: "3px 9px", borderRadius: 8, background: "var(--st-accent-soft)", color: "var(--st-accent)", fontSize: 11, fontWeight: 700 }}>{newCount} {t("new")}</span>
            <div style={{ flex: 1 }} />
            <div className="clk" onClick={markAllNotifsRead} style={{ font: "600 13px Inter,sans-serif", color: "var(--st-accent-2)" }}>{t("Mark all read")}</div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 6 }}>
            {notifs.map((n) => (
              <div key={n.key} className="notifitem clk" onClick={n.onClick} style={{ display: "flex", gap: 13, padding: "14px 16px", borderRadius: 12, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", background: n.avBg, color: "var(--st-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", font: "700 12px 'JetBrains Mono',monospace" }}>{n.initials}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: "var(--st-text)", lineHeight: 1.45 }}>
                    <span className="mono" style={{ color: "var(--st-accent)", fontWeight: 600 }}>{n.user}</span> {n.action}{" "}
                    <span style={{ fontWeight: 700, color: "var(--st-text)" }}>{n.where}</span>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--st-text-faint)", marginTop: 5 }}>{n.meta}</div>
                </div>
                {n.unread && <span style={{ width: 8, height: 8, flex: "none", borderRadius: "50%", background: "var(--st-accent-2)", marginTop: 5 }} />}
              </div>
            ))}
            {notifs.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "var(--st-text-faint)", fontSize: 13.5 }}>{t("No notifications.")}</div>}
          </div>
        </div>
      </div>

      {/* image lightbox — click a step screenshot to view it full-size */}
      {state.lightboxSrc && (
        <div onClick={() => setState({ lightboxSrc: null })} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(10,16,26,.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, cursor: "zoom-out", animation: "storm-fade .18s ease both" }}>
          <img src={state.lightboxSrc} alt={t("Step screenshot")} onClick={stop} style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12, boxShadow: "0 30px 80px rgba(0,0,0,.5)", display: "block", cursor: "default" }} />
          <div className="clk" onClick={() => setState({ lightboxSrc: null })} style={{ position: "fixed", top: 22, right: 24, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.12)", color: "var(--st-on-accent)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="close" size={20} color="var(--st-on-accent)" />
          </div>
        </div>
      )}
      {state.filePreview && <FilePreview file={state.filePreview} onClose={() => setState({ filePreview: null })} />}
    </div>
  );
}
