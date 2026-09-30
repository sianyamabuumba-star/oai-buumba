# O'BUUMBA OS

Universal human + AI orchestration system for O'BUUMBA.

## Current build

**Core loop:** CAPTURE → UNDERSTAND → PLAN → EXECUTE → VERIFY → LOG → IMPROVE

The `obuumbA-os/` app now includes:
- Persistent local JSON task/request/audit storage
- Universal request classification and basic requirement extraction
- Task creation, execution, verification and owner escalation
- Adapter registry with explicit READY/BLOCKED states
- Owner cockpit showing what is connected and what requires owner action
- Request/task/audit queues
- Provider directory kept explicitly in demo/unverified mode
- Automated Node self-test
- GitHub Actions CI workflow

## Safe execution rules

The system does **not** pretend that an external service is connected.
A task becomes `NEEDS_OWNER` when an external adapter is blocked. Live WhatsApp, payments, maps, production database, notifications and provider availability require real credentials/integrations before they can execute.

## Run locally

Requirements: Node.js 20+

    cd obuumbA-os
    npm install
    npm start

Open `http://localhost:3000`.
Run the self-test with `npm test`.

## API

- `GET /api/health`
- `GET /api/system/status`
- `POST /api/requests`
- `GET /api/requests`
- `PATCH /api/requests/:id`
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks/:id/run`
- `POST /api/tasks/:id/verify`
- `GET /api/audit`

## Production path

The portable local core is the fallback. The next production integrations are:
1. Managed Postgres/Supabase
2. WhatsApp Business API/webhooks
3. Verified provider onboarding
4. Live availability
5. Maps/routing
6. Payments
7. Notifications
8. Production hosting/domain
9. End-to-end pilot testing

See `docs/AUTOPILOT_SPEC.md`, `docs/OWNER_ACTIONS.md`, `docs/API_CONTRACT.md`, and `docs/TEST_PLAN.md`.