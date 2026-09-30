# Deployment fallback

The MVP now includes a minimal Node/Express API.

Local:
1. Install Node.js 20+.
2. In this folder run npm install.
3. Run npm start.
4. Open http://localhost:3000.

Production:
- Deploy the folder to any Node-compatible host.
- Set PORT if required.
- Add managed Postgres/Supabase next.
- Connect WhatsApp Business API to POST inbound messages to /api/requests.

API:
GET /api/health
POST /api/requests with {"message":"Need airport pickup tonight"}
GET /api/requests
PATCH /api/requests/:id with {"status":"MATCHING"}

The current API uses in-memory storage intentionally for the MVP. Restarting the server clears requests. It is not production storage.