# Vulnerabilities

Findings belong to a project and an affected host. They include severity, CVSS, reproduction steps, impact, and remediation. Open the project's **Issues** section.

## Recording a finding

1. Add a finding and enter its title.
2. Select an affected host from the project.
3. Set initial severity and status.
4. Save, then fill out the detailed finding card.

Create the host under **Recon → Hosts** first if it does not exist.

## Severity

Severities are **critical**, **high**, **medium**, **low**, **info**, and **unrealized**. New findings default to info. Once a CVSS vector is present, severity is derived from it; edit the vector to change the score and derived severity.

Unrealized findings describe tested scenarios that are not exploitable. Info and unrealized findings appear in the report's tests section rather than its detailed vulnerability list.

## Finding fields

- **CWE ID** — weakness identifier, for example `CWE-89`.
- **CVSS 4.0** — vector text, calculated score, and severity.
- **Status** — current workflow state.
- **Steps to reproduce** — ordered steps, with optional pasted screenshots.
- **Impact** — the effect of the issue.
- **Remediation** — recommendations for fixing it.

## Workflow

The nine statuses follow the Works BUG APPSEC workflow:

- Waiting: **open**, **need info**, **paused**.
- In progress: **in progress**, **problem analysis**.
- Finished: **resolved**, **closed**, **cancelled**, **sent by mistake**.

Status colours distinguish waiting, active work, and completion. Change status using the finding card's dropdown. The reporter receives a notification when someone else changes their finding's status.

## Editing and export

Edit fields on the finding card and press **Save changes**. Screenshots attached to reproduction steps are included in generated reports.

**Export to AppSec** creates a Works BUG_APPSEC ticket when that integration is enabled. **Export to Task Tracker** exports finding details to a tracker task. Linked tickets are shown on the finding.

The list supports severity, status, author, and host filters. The status filter offers the main workflow states; the finding card offers all nine.
