import { getApiErrorMessage } from "../api";
import { UserInputError } from "../errorMessages";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useToastStore } from "../store";
import { Icon } from "./icons";
import { t } from "./i18n";
import { parseSwaggerDocuments } from "./swaggerEndpoints";

const readJson = (file: File) => new Promise<unknown>((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new UserInputError(t("Couldn't read JSON file")));
  reader.onload = () => {
    try { resolve(JSON.parse(String(reader.result).replace(/^\uFEFF/, ""))); }
    catch { reject(new UserInputError(`${file.name}: ${t("Invalid JSON")}`)); }
  };
  reader.readAsText(file);
});

export function SwaggerEndpointImport({ onParsed, disabled = false }: { disabled?: boolean; onParsed: (lines: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);
  const reading = useRef(false);
  const requestId = useRef(0);
  const pushToast = useToastStore((s) => s.pushToast);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const close = () => { requestId.current++; reading.current = false; setBusy(false); setOpen(false); };
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { requestId.current++; reading.current = false; setBusy(false); setOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const load = async (files: File[]) => {
    if (!files.length || reading.current) return;
    const request = ++requestId.current;
    reading.current = true;
    setBusy(true);
    try {
      if (files.length > 32 || files.reduce((n, file) => n + file.size, 0) > 8 * 1024 * 1024 || files.some((file) => file.size > 2 * 1024 * 1024)) throw new UserInputError(t("Choose up to 32 JSON files, 2 MB each, 8 MB total"));
      if (files.some((file) => !/\.json$/i.test(file.name))) throw new UserInputError(t("Choose JSON files"));
      const documents = await Promise.all(files.map(async (file) => ({ name: file.name, value: await readJson(file) })));
      const result = parseSwaggerDocuments(documents);
      if (!mounted.current || request !== requestId.current) return;
      setOpen(false);
      onParsed(result.lines);
      pushToast(`${t("Endpoints parsed")}: ${result.lines.length}`, "success");
      for (const warning of result.warnings) pushToast(t(warning), "warning");
    } catch (error) {
      if (mounted.current && request === requestId.current) pushToast(t(getApiErrorMessage(error, "Couldn't read JSON file")), "error");
    } finally {
      if (request === requestId.current) { reading.current = false; if (mounted.current) setBusy(false); }
    }
  };
  return <>
    <button type="button" disabled={disabled} onClick={() => setOpen(true)} aria-haspopup="dialog" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 16px", border: "none", borderRadius: 10, background: "var(--st-accent-2)", color: "var(--st-on-accent)", font: "700 13px Inter,sans-serif", cursor: "pointer" }}><Icon name="upload" size={16} color="var(--st-on-accent)" />{t("Upload Swagger JSON")}</button>
    {open && createPortal(<div className="storm" onClick={(e) => { if (e.target === e.currentTarget) close(); }} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20,28,40,.42)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div role="dialog" aria-modal="true" aria-label={t("Upload Swagger JSON")} style={{ width: 580, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", padding: 26, borderRadius: 18, background: "var(--st-surface)", boxShadow: "0 30px 80px rgba(15,27,45,.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}><h2 style={{ margin: 0, color: "var(--st-text)", fontSize: 20 }}>{t("Upload Swagger JSON")}</h2><button type="button" className="actbtn" aria-label={t("Close")} onClick={close} style={{ border: "none", background: "transparent", color: "var(--st-text-3)" }}><Icon name="close" size={18} /></button></div>
        <input ref={input} type="file" multiple accept=".json,application/json" aria-label={t("Swagger JSON files")} hidden onChange={(e) => { void load(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
        <div role="button" tabIndex={busy ? -1 : 0} aria-label={t("Drop Swagger JSON here")} aria-busy={busy} onClick={() => { if (!busy) input.current?.click(); }} onKeyDown={(e) => { if (!busy && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); input.current?.click(); } }} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); void load(Array.from(e.dataTransfer.files)); }} style={{ border: `2px dashed ${dragging ? "var(--st-accent-2)" : "var(--st-border)"}`, background: dragging ? "var(--st-accent-soft)" : "var(--st-sunken)", borderRadius: 12, padding: "36px 18px", textAlign: "center", cursor: busy ? "wait" : "pointer", color: "var(--st-text-2)", fontSize: 13 }}>
          <div>{busy ? t("Parsing JSON…") : t("Drop JSON files here or click to browse")}</div>
          <div style={{ marginTop: 10, fontSize: 11, color: "var(--st-text-faint)" }}>Swagger 1.0 / 1.1 / 1.2 / 2.0 · OpenAPI 3.0 / 3.1 / 3.2</div>
        </div>
        <p style={{ fontSize: 12, color: "var(--st-text-3)", lineHeight: 1.5 }}>{t("Hosts are read from the specification. Missing hosts are imported as unknown.")}</p>
        <p style={{ fontSize: 11, color: "var(--st-text-faint)", lineHeight: 1.5 }}>{t("For Swagger 1.x, include API Declaration files. Upload referenced JSON files together.")}</p>
      </div>
    </div>, document.body)}
  </>;
}
