# Administrator role

Administrators have ordinary assessment capabilities plus workspace administration. The User documentation describes the shared project, host, finding, note, and report workflows.

## Administrator capabilities

- Invite, block, and manage workspace users and their roles under **Members**.
- Create and delete projects.
- Access all projects regardless of membership.
- Issue agent tokens for any allowed/all projects and revoke tokens as permitted by the administration API.

## Two independent role axes

**Workspace role** is Admin or User (`pentester`) and controls platform administration. **Project role** is Lead or Pentester and controls management inside projects where the user is a member.

An administrator can access a project without membership. Creating a new project also adds its creator to the team. Changing a user's workspace role does not automatically grant membership in unrelated projects.
