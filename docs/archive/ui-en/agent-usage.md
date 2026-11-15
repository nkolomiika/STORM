# Authentication and endpoints

Send each machine request to `/api/v2` with the appropriate scope and project access:

```http
Authorization: Bearer <your_token>
```

User cookies are not used for agent authentication. Missing permissions or project access cause an access error. Writes are attributed to the token owner.

## Available endpoints

**Projects** (`projects:read`)
- `GET /api/v2/projects`
- `GET /api/v2/projects/{id}`

**Hosts and assets** (`assets:read`, read-only)
- `GET /api/v2/projects/{id}/hosts`
- `GET /api/v2/projects/{id}/hosts/{host_id}`

**Findings**
- `GET /api/v2/projects/{id}/hosts/{host_id}/vulnerabilities` (`vulns:read`)
- `GET /api/v2/projects/{id}/hosts/{host_id}/vulnerabilities/{vuln_id}` (`vulns:read`)
- `POST /api/v2/projects/{id}/vulnerabilities` (`vulns:write`)
- `PUT /api/v2/projects/{id}/vulnerabilities/{vuln_id}` (`vulns:write`)

**Notes**
- `GET /api/v2/projects/{id}/notes` (`notes:read`)
- `GET /api/v2/projects/{id}/notes/{note_id}` (`notes:read`)
- `POST /api/v2/projects/{id}/notes` (`notes:write`)
- `PUT /api/v2/projects/{id}/notes/{note_id}` (`notes:write`)

Finding reads are scoped to a host; finding writes are scoped to the project. There is no deletion or asset mutation through v2.

## Examples

List projects:

```sh
curl -s https://storm.example/api/v2/projects -H "Authorization: Bearer $STORM_TOKEN"
```

Read hosts:

```sh
curl -s https://storm.example/api/v2/projects/42/hosts -H "Authorization: Bearer $STORM_TOKEN"
```

Create a finding:

```sh
curl -s -X POST https://storm.example/api/v2/projects/42/vulnerabilities -H "Authorization: Bearer $STORM_TOKEN" -H "Content-Type: application/json" -d '{"title":"SQL injection in /api/login","host_id":100,"severity":"high","status":"open"}'
```

Replace the host, token, project ID, and host ID with values for your deployment. Severity is optional and defaults to info; a CVSS vector can refine it later.

## Interactive documentation

Application Swagger: `/api/v1/docs`; ReDoc: `/api/v1/redoc`; schema: `/api/v1/openapi.json`.

Agent Swagger: `/api/v2/docs`; ReDoc: `/api/v2/redoc`; schema: `/api/v2/openapi.json`.

These paths use the same origin as STORM and are separate from the in-app Docs section. Open them in a signed-in browser: Swagger and schema endpoints require an active session and return 401 to anonymous requests.
