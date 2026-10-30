# O'BUUMBA OS Security Baseline

## Security changes in this branch

- Only the dedicated `public/` directory is served by Express static hosting.
- Server source, internal modules, tests, package metadata and private data paths are not part of the public web root.
- Runtime JSON storage defaults to `.obuumba-os-runtime/` beside the application directory, outside the static web root.
- `DATA_DIR` can override the runtime location, but startup rejects a path inside the public directory.
- Public provider data is exposed through a dedicated endpoint containing only the demo provider directory. Runtime provider records remain behind the authenticated API.
- Baseline browser security headers are set.
- API responses are marked `Cache-Control: no-store`.
- HTTP security tests check that source and private data paths are not served.

## Authentication baseline

- The server binds to `127.0.0.1` by default.
- `/api/health` and `/api/system/status` remain public for deployment checks.
- Other `/api/*` endpoints require `Authorization: Bearer <ADMIN_API_TOKEN>` whenever a token is configured.
- In `NODE_ENV=production`, protected API requests are denied with HTTP 503 if `ADMIN_API_TOKEN` is missing.
- The dashboard stores its token in tab-scoped `sessionStorage`. This is a transitional single-owner control, not multi-user authentication.
- WhatsApp webhook signature validation remains a separate boundary.

## Runtime data

Set `DATA_DIR` to a persistent private volume in production. Do not point it at `public/`, a static hosting directory, or a version-controlled path. Restrict filesystem permissions to the application process and back up the data securely.

Example:

```bash
DATA_DIR=/var/lib/obuumba-os
NODE_ENV=production
ADMIN_API_TOKEN='use-a-long-random-secret-from-your-host-secret-manager'
npm start
```

Do not put real secrets in source files, shell history, issue comments or commit messages. Prefer the hosting platform's secret manager.

## Local development

By default, when `NODE_ENV` is not `production` and no `ADMIN_API_TOKEN` is set, API routes remain open for local development. Keep the default loopback bind and do not expose this mode to the internet.

## Production requirements still outstanding

1. Use HTTPS and restrict network exposure.
2. Replace the shared bearer token with individual accounts and role-based authorization before multiple operators use the system.
3. Add rate limiting and abuse protection.
4. Migrate local JSON persistence to a transactional database before handling live customer data or concurrent multi-instance workloads.
5. Review webhook replay protection and idempotency.
6. Define privacy notices, retention and deletion procedures.
7. Test backups and restoration.
8. Add monitoring and a documented incident-response process.
9. Review dependencies and update them through controlled pull requests.
10. Complete independent security testing before handling sensitive customer information or payments.

## Known limitations

- Public health and system-status responses must never include secrets.
- The application does not yet provide full identity management, granular roles or a production-grade multi-tenant security model.
- Local JSON files are not suitable for concurrent multi-instance production workloads.
- These controls are a baseline hardening change, not a penetration-test certification.
