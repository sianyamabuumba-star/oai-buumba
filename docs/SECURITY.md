# O'BUUMBA OS Security Baseline

## Current protection

- Runtime JSON records are explicitly blocked from the static-file server at `/data/runtime/*`; only the public demo provider directory is served as static data.

- The server binds to `127.0.0.1` by default. Set `HOST=0.0.0.0` only when deploying behind an appropriate network boundary.
- `/api/health` and `/api/system/status` remain public for deployment checks.
- Other `/api/*` endpoints require `Authorization: Bearer <ADMIN_API_TOKEN>` whenever a token is configured.
- In `NODE_ENV=production`, protected API requests are denied with HTTP 503 if `ADMIN_API_TOKEN` is missing.
- The dashboard prompts for the token when it receives HTTP 401 and keeps it in tab-scoped `sessionStorage`; close the tab to clear that browser-side copy.
- WhatsApp webhook signature validation remains a separate boundary.

## Local development

By default, when `NODE_ENV` is not `production` and no `ADMIN_API_TOKEN` is set, API routes remain open for local development. Keep the default loopback bind and do not expose this mode to the internet.

To test token protection locally, set a long random token before starting the server:

```bash
ADMIN_API_TOKEN='replace-with-a-long-random-secret' npm start
```

The dashboard will prompt for that token the first time it requests protected data.

## Production requirements

1. Set `NODE_ENV=production` and configure a unique, high-entropy `ADMIN_API_TOKEN` using the hosting platform's secret manager.
2. Use HTTPS and restrict network exposure. If the host requires binding to all interfaces, set `HOST=0.0.0.0` only behind the platform's TLS/network controls.
3. Rotate the token if it is exposed. Never commit real tokens to Git.
4. Add proper user accounts/roles before inviting multiple operators. A shared bearer token is a transitional single-owner control, not a full identity system.
5. Migrate local JSON persistence to a transactional database with backups before handling live customer data.
6. Review data retention, privacy, webhook replay/idempotency, rate limits, logging and recovery before launch.

## Known limitations

- Health and system-status responses are intentionally public and should not include secrets.
- This is a minimal single-owner API guard. It does not replace a full authentication provider, role-based authorization, CSRF controls for cookie-based sessions, or production security testing.
- Local JSON files are not safe for concurrent multi-instance production deployments.
