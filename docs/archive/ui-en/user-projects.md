# Projects

A project is the container for one assessment: hosts, assets, findings, notes, credentials, members, and activity.

## Project list

**Projects** shows projects you can access, split into active and archived tabs. Summary cards show project, host, and open-finding counts. Click a row to open a project.

Only administrators can create and delete projects. The creator of a new project is automatically added as a member. Creation and membership are saved together.

## Project statuses

- **Active** — work is in progress.
- **Freeze** — work is paused.
- **Handover to dev** — results are being handed to development.
- **Recheck** — findings are being retested.
- **Completed** — work is complete.
- **Archived** — the project is archived.

A status describes the assessment stage; it does not prevent editing. Administrators, creators, and project leads can edit the project name, description, status, and dates.

## AppSec and Task Tracker fields

The project form requires an **AppSec ticket** (paste a URL or select an APPSEC task). Optional fields include an **Assignee**, multiple **Affected versions**, and a **Component**. Component and version lookup depend on the configured Works integration. Assignees can be searched by name or username. Creating from Tasks copies the assignee login and every affected version from the full task card. Individual versions can be added or removed before saving.

The linked ticket appears in exported reports. Successful creation opens the project immediately. A missing name or APPSEC ticket keeps the form open and highlights the required field. Version names stay unchanged in the UI and Task Tracker export. The SZI report removes the product prefix only: `Platform V Stack 1.0.2-beta.2` becomes `1.0.2-beta.2`.

## Inside a project

- **Overview** — description, dates, progress, and summaries.
- **Recon** — hosts, IP addresses, endpoints, and JS scan results.
- **Issues** — project findings.
- **Notes** — shared Markdown notes.
- **Creds** — assessment credentials.
- **Members** — project team.
- **Activity** — who added, changed, or removed project data.
