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
- Configure WHATSAPP_VERIFY_TOKEN, WHATSAPP_APP_SECRET, WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN. Point the WhatsApp webhook at /webhooks/whatsapp. Outbound sends use /api/messages/:id/send. The adapter remains blocked until credentials are configured..

API:
GET /api/health
POST /api/requests with {"message":"Need airport pickup tonight"}
GET /api/requests
PATCH /api/requests/:id with {"status":"MATCHING"}

The current API uses persistent local JSON files for the MVP. This is not suitable for concurrent production workloads; move to a managed database before launch.