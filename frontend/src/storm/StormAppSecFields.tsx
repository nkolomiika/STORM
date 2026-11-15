/* AppSec-поля проекта: тикет Task Tracker, исполнитель, компонент и версия.
 *
 * Тикет и исполнитель показываются всегда (нужны для отчёта и для поля
 * исполнителя создаваемого тикета). Компонент и версия ищутся в Works (STORM
 * проксирует запрос, токен на фронт не уходит) и показываются только когда
 * интеграция Works включена. Исполнитель ищется через /users/search по username
 * ИЛИ ФИО; в списке и поле показываем только ФИ, а храним username (= ФИО для
 * локального пользователя / IAM-логин для IAM) — он идёт в assigned_to тикета.
 * Все поля — typeahead; используется в формах создания и редактирования проекта. */

import { useEffect, useId, useRef, useState } from "react";
import { findWorksComponents, findWorksVersions, searchUsers, getTasks } from "../api";
import type { TaskTrackerTask, WorksRef } from "../types";

/** Отображаем только ФИ (Фамилия Имя) — первые два слова ФИО. Для IAM-логина
 *  без пробелов возвращаем как есть. Хранимое значение (username) не меняется. */
function fio2fi(s: string | null | undefined): string {
  return (s || "").trim().split(/\s+/).filter(Boolean).slice(0, 2).join(" ");
}

export interface AppSecFieldsValue {
  appsec_component_code: string | null;
  appsec_component_name: string | null;
  appsec_versions: WorksRef[];
  appsec_assignee: string | null;
  appsec_assignee_name: string | null;
  appsec_ticket_url: string | null;
  appsec_ticket_key: string | null;
}

export function emptyAppsecFields(): AppSecFieldsValue {
  return { appsec_component_code: null, appsec_component_name: null, appsec_versions: [], appsec_assignee: null, appsec_assignee_name: null, appsec_ticket_url: null, appsec_ticket_key: null };
}

interface Opt {
  code: string;
  name: string;
}

function Typeahead({
  label,
  placeholder,
  value,
  fetchOptions,
  onPick,
  clearOnPick = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  fetchOptions: (q: string) => Promise<Opt[]>;
  onPick: (opt: Opt) => void;
  clearOnPick?: boolean;
}) {
  const [q, setQ] = useState(value);
  const [opts, setOpts] = useState<Opt[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Внешнее значение изменилось (например, открыли другой проект) — синхронизируем.
  useEffect(() => setQ(value), [value]);
  const fetchRef = useRef(fetchOptions);
  fetchRef.current = fetchOptions;

  useEffect(() => {
    if (!open) return;
    let active = true;
    const h = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchRef.current(q.trim());
        if (active) setOpts(res);
      } catch {
        if (active) setOpts([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 220);
    return () => {
      active = false;
      clearTimeout(h);
    };
  }, [q, open]);

  return (
    <div style={{ position: "relative" }}>
      <label className="flabel">{label}</label>
      <input
        className="finp"
        placeholder={placeholder}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        // Задержка, чтобы успел отработать onMouseDown по пункту списка.
        onBlur={() => setTimeout(() => setOpen(false), 160)}
      />
      {open && (loading || opts.length > 0) && (
        <div
          style={{
            position: "absolute",
            zIndex: 20,
            left: 0,
            right: 0,
            top: "100%",
            marginTop: 4,
            maxHeight: 220,
            overflowY: "auto",
            background: "var(--st-surface)",
            border: "1px solid var(--st-border)",
            borderRadius: 11,
            boxShadow: "0 12px 30px var(--st-shadow)",
          }}
        >
          {loading && opts.length === 0 && (
            <div style={{ padding: "10px 14px", fontSize: 13, color: "var(--st-text-faint)" }}>…</div>
          )}
          {opts.slice(0, 5).map((o) => (
            <div
              key={o.code}
              className="prow clk"
              // onMouseDown (не onClick): срабатывает до blur инпута.
              onMouseDown={() => {
                onPick(o);
                setQ(clearOnPick ? "" : o.name);
                setOpen(false);
              }}
              style={{ padding: "9px 14px", fontSize: 13.5, color: "var(--st-text)", cursor: "pointer" }}
            >
              {o.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Поле «AppSec-тикет»: связать проект с задачей из раздела Tasks ИЛИ ввести URL
   вручную. Если ввод похож на ссылку (http…) — сохраняем как URL. Иначе ищем по
   задачам Tasks и показываем выпадающий список; выбор сохраняет url + key задачи.
   Ссылка потом подставляется в отчёт («…по задаче {url}»). */
function TicketField({
  url,
  taskKey,
  onChange,
  t,
}: {
  url: string;
  taskKey: string | null;
  onChange: (patch: { appsec_ticket_url: string | null; appsec_ticket_key: string | null }) => void;
  t: (s: string) => string;
}) {
  const inputId = useId();
  const editing = useRef(false);
  const [q, setQ] = useState(taskKey || url || "");
  const [opts, setOpts] = useState<TaskTrackerTask[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (taskKey || url || !editing.current) setQ(taskKey || url || "");
  }, [url, taskKey]);

  const looksLikeUrl = (s: string) => /^https?:\/\//i.test(s.trim());

  useEffect(() => {
    if (!open || looksLikeUrl(q) || !q.trim()) {
      setOpts([]);
      return;
    }
    let active = true;
    const h = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await getTasks({ query: q.trim() });
        if (active) setOpts((r.items ?? []).slice(0, 5));
      } catch {
        if (active) setOpts([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 260);
    return () => {
      active = false;
      clearTimeout(h);
    };
  }, [q, open]);

  return (
    <div style={{ position: "relative" }}>
      <label className="flabel" htmlFor={inputId}>{t("AppSec ticket")}</label>
      <input
        id={inputId}
        className="finp"
        placeholder={t("Paste a URL or start typing a ticket…")}
        value={q}
        onChange={(e) => {
          const text = e.target.value;
          editing.current = true;
          setQ(text);
          setOpen(true);
          // URL сохраняем сразу; поиск по тексту сохраняется только выбором из списка.
          if (looksLikeUrl(text)) onChange({ appsec_ticket_url: text.trim(), appsec_ticket_key: null });
          else onChange({ appsec_ticket_url: null, appsec_ticket_key: null });
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
      />
      {open && (loading || opts.length > 0) && (
        <div
          style={{
            position: "absolute",
            zIndex: 20,
            left: 0,
            right: 0,
            top: "100%",
            marginTop: 4,
            maxHeight: 240,
            overflowY: "auto",
            background: "var(--st-surface)",
            border: "1px solid var(--st-border)",
            borderRadius: 11,
            boxShadow: "0 12px 30px var(--st-shadow)",
          }}
        >
          {loading && opts.length === 0 && (
            <div style={{ padding: "10px 14px", fontSize: 13, color: "var(--st-text-faint)" }}>…</div>
          )}
          {opts.map((task) => (
            <div
              key={task.key}
              className="prow clk"
              onMouseDown={() => {
                editing.current = false;
                onChange({ appsec_ticket_url: task.url ?? null, appsec_ticket_key: task.key });
                setQ(task.key);
                setOpen(false);
              }}
              style={{ padding: "9px 14px", fontSize: 13, cursor: "pointer", display: "flex", gap: 8, minWidth: 0 }}
            >
              <span className="mono" style={{ flex: "none", fontWeight: 700, color: "var(--st-accent-2)" }}>{task.key}</span>
              <span style={{ color: "var(--st-text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.summary}</span>
            </div>
          ))}
        </div>
      )}
      {taskKey && !looksLikeUrl(q) && (
        <div style={{ fontSize: 11.5, color: "var(--st-text-faint)", marginTop: 5 }}>
          {t("Linked ticket")}: {taskKey}
        </div>
      )}
    </div>
  );
}

export function StormAppSecFields({
  value,
  onChange,
  works,
  t,
}: {
  value: AppSecFieldsValue;
  onChange: (patch: Partial<AppSecFieldsValue>) => void;
  // true — показывать поля экспорта в Works (компонент/версия/исполнитель).
  // Поле тикета показывается всегда (нужно для отчёта независимо от Works).
  works: boolean;
  t: (s: string) => string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <TicketField
        url={value.appsec_ticket_url || ""}
        taskKey={value.appsec_ticket_key}
        onChange={(patch) => onChange(patch)}
        t={t}
      />
      {/* Исполнитель — всегда (идёт в поле исполнителя тикета Task Tracker).
          Поиск по username ИЛИ ФИО, в списке и поле показываем только ФИ. */}
      <Typeahead
        label={t("Assignee")}
        placeholder={t("Start typing a name…")}
        value={fio2fi(value.appsec_assignee_name || value.appsec_assignee)}
        fetchOptions={async (q) => {
          const res = await searchUsers(q, 5);
          // code = username (= ФИО для локального / IAM-логин для IAM) → в assigned_to тикета.
          return res.map((u) => ({ code: u.username, name: fio2fi(u.full_name || u.username) }));
        }}
        onPick={(o) => onChange({ appsec_assignee: o.code, appsec_assignee_name: o.name })}
      />
      {/* Затронутая версия — всегда (ищется в Works/AppSec-пространстве проекта). */}
      <Typeahead
        label={t("Affected versions")}
        placeholder={t("Start typing a version…")}
        value=""
        fetchOptions={(q) => findWorksVersions(q)}
        clearOnPick
        onPick={(o) => {
          if (!value.appsec_versions.some((version) => version.code === o.code))
            onChange({ appsec_versions: [...value.appsec_versions, { code: o.code, name: o.name }] });
        }}
      />
      {value.appsec_versions.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: -6 }}>
        {value.appsec_versions.map((version) => <span key={version.code} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 6px 4px 10px", borderRadius: 9, background: "var(--st-accent-soft)", color: "var(--st-text-2)", fontSize: 12 }}>
          {version.name}
          <button type="button" className="actbtn del" title={`${t("Remove version")}: ${version.name}`} aria-label={`${t("Remove version")}: ${version.name}`} onClick={() => onChange({ appsec_versions: value.appsec_versions.filter((item) => item.code !== version.code) })}>×</button>
        </span>)}
      </div>}
      {works && (<>
      <div style={{ font: "700 12.5px Inter,sans-serif", color: "var(--st-text-2)", marginTop: 2 }}>{t("AppSec export (Works)")}</div>
      <Typeahead
        label={t("Component")}
        placeholder={t("Start typing a component…")}
        value={value.appsec_component_name || ""}
        fetchOptions={(q) => findWorksComponents(q)}
        onPick={(o) => onChange({ appsec_component_code: o.code, appsec_component_name: o.name })}
      />
      </>)}
    </div>
  );
}

export default StormAppSecFields;
