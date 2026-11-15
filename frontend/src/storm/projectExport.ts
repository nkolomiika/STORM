import type { Project } from "../types";

/** Названия отсутствующих полей для локализованного уведомления перед экспортом. */
export function missingStsProjectFields(project: Project): string[] {
  const missing: string[] = [];
  if (!project.appsec_ticket_key?.trim() && !project.appsec_ticket_url?.trim()) missing.push("AppSec ticket");
  if (!project.appsec_assignee?.trim()) missing.push("Assignee");
  if (!project.appsec_versions?.length && !project.appsec_version_code?.trim()) missing.push("Affected versions");
  return missing;
}
