# Hosts and assets

**Recon** inventories the target infrastructure. A host has a name, addresses, availability status, ports, and HTTP endpoints. A host can have several IP addresses; each port can have discovered services.

## Hosts

Open **Recon → Hosts**. Use the add/import action and provide hostnames or addresses. Host imports can probe availability and discover web ports. Open a host to view its addresses, ports, and endpoints. Edit and delete actions are available on its row.

## IP addresses

Use **IPs** to view addresses across the project. Addresses can be linked to hosts; labels such as external, internal, and mgmt identify their purpose. The host card shows its addresses. Removing an address from the IP list does not remove its domain-host association.

## Ports and services

Ports use a number and protocol, for example `443/tcp` or `53/udp`. Host cards show available port states (`open`, `filtered`, `closed`), service information, and HTTP information supplied by discovery results.

## Endpoints

Open **Recon → Endpoints** to see endpoints grouped by host. Add endpoints using a host, HTTP method, and path, for example `GET /api/users`.

The Swagger JSON upload is on the endpoint export screen. Drop or select a Swagger/OpenAPI JSON file. Parsed endpoints populate the import preview; nothing is saved until you confirm the import. Hosts are read from the specification, with `unknown` used when none is specified.

Open an endpoint or use its edit action to edit the complete HTTP request. Saving parses the method, path, query, headers, and body back into endpoint fields. **Save changes** is disabled until the request changes. **Copy request** and **Copy cURL** copy the current request. The response area is a convenience view and is not saved. The discussion below the request supports comments.

Each host group's delete action deletes endpoints for that host. The host edit action renames the host.

## Exporting lists

Hosts and IP addresses can be exported as text. Endpoints can be exported as text or OpenAPI 3 JSON. Exports use the selected/filtered infrastructure list. See **Reports** for Word report generation.
