# Reports

STORM generates Word (`.docx`) documents from project hosts, findings, reproduction steps, and evidence. Documents are built from templates using current project data.

## Report types

- **Certification report** — security-system test results for certification work (SZI).
- **Internal acceptance report** — an acceptance protocol for internal review (PP).

## Generating a report

Open the project, press **Generate report**, choose a template, and start generation. The resulting `.docx` downloads automatically; its filename includes the project and report type.

Before exporting, fill out finding titles, CVSS, reproduction steps, impact, remediation, and screenshots. Evidence images are resolved and embedded in the document.

## Included data

- Critical, high, medium, and low findings appear in the detailed vulnerability list.
- Info and unrealized findings appear in the tests section.
- Certification reports include the project's credential table; the internal acceptance template does not.
- A linked AppSec ticket is included as the assessment task reference.

## Recon lists

Recon exports provide host, IP, and endpoint lists. Text is available for all three; endpoints also support OpenAPI JSON. The export preview reflects the selected filters. See **Hosts and assets** for endpoint export and Swagger import.
