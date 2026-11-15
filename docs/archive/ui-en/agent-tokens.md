# Tokens and permissions

Agent tokens are listed under **Profile → API & Automation → API keys**. Any user can issue tokens within their own permissions.

## Creating a token

Choose a name, permissions, project access (All my projects or a selected list), and an optional expiry date. Tokens start with `storm_`.

The full value is displayed only once. STORM stores its hash and cannot show it again; copy it immediately to secure secret storage. If lost, issue a new token.

## Scopes

- `projects:read` — list/read projects.
- `assets:read` — read project hosts and assets.
- `vulns:read` — read findings.
- `vulns:write` — create/update findings.
- `notes:read` — read notes.
- `notes:write` — create/update notes.

Only selected scopes are granted. Unknown scopes are rejected. There is no `assets:write` scope and no deletion through v2.

## Access follows the owner

Ordinary users can select only projects where they are members. **All my projects** means the owner's accessible projects, not the whole workspace. Administrators can access all projects.

Permissions are checked when the token is issued and again on every request against the owner's current access. Losing project membership removes the token's access to that project. A blocked/inactive owner cannot use an existing token.

## Expiry and revocation

An empty expiry means no time-based expiry. An expired or revoked token no longer works. Revoke unneeded or compromised keys using their delete action. Users manage their own tokens; administrator access follows the token-management API rules.

Use minimal scopes, limit project access, set expiry for temporary work, and issue separate tokens for separate integrations.
