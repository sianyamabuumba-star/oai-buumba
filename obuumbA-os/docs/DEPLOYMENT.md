# Deployment

## Local development

1. Install Node.js 20 or later.
2. In this folder, run `npm install`.
3. Run `npm test` to execute unit and HTTP security tests.
4. Run `npm start`.
5. Open http://127.0.0.1:3000.

## Production prerequisites

- Deploy to a Node-compatible host.
- Set `NODE_ENV=production`.
- Set `PORT` if required by the host.
- Configure a high-entropy `ADMIN_API_TOKEN` in the host's secret manager.
- Configure `DATA_DIR` to a persistent private volume outside the public web directory.
- Use HTTPS and the host's network controls.
- Bind to `0.0.0.0` only when required by the hosting platform and protected by its network/TLS boundary.
- Configure WhatsApp secrets only through managed environment secrets.
- Keep the runtime volume out of Git and public static hosting.

## Public and private paths

Only files inside `public/` are served as static content. The application dashboard is copied to `public/index.html`. Server source, tests, package files and runtime data must remain private.

`GET /public/providers` exposes only the demo provider directory. Runtime provider records are available only through authenticated API routes.

## Persistence and launch status

The MVP currently uses local JSON persistence. This is not suitable for concurrent production workloads. Move to a managed database with tested backups before handling real customer bookings or sensitive data.

Payment processing, provider confirmation and external integrations must not be described as live until each integration has been approved, configured and tested.
