# Agent API overview

Agent API **v2** provides machine access for automation, CI/CD, scanners, and external agents. Clients can read assessment data and create/update findings and notes without interactive sign-in.

Any user can issue a token within their current permissions, so the Agent API documentation is available to ordinary users as well.

## Differences from the application API

- Requests use `/api/v2`; the browser application uses `/api/v1`.
- Authentication uses an agent **Bearer token**, not user cookies.
- Token scopes and allowed projects determine access.
- The API supports reading and writing findings/notes, and reading assets; it does not support deletion.

Changes are attributed to the user who created the token.

## Workflow

Create a token with the minimum required scopes and projects, store it as a secret, and send it using `Authorization: Bearer <token>`. See **Tokens and permissions** and **Authentication and endpoints** for details.
