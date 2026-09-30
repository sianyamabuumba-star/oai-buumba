# O'BUUMBA OS — AUTOPILOT SPEC

## Purpose
O'BUUMBA OS is the orchestration layer for O'BUUMBA projects, businesses, creative work and universal concierge operations.

## Core loop
CAPTURE → UNDERSTAND → PLAN → EXECUTE → VERIFY → LOG → IMPROVE.

## Router
Every task is classified into one or more domains:
- Concierge
- Creator
- Business
- Research
- Content
- Technology
- Operations
- Finance
- Admin

## Execution policy
1. Prefer an existing connected integration.
2. If an integration is unavailable, use a portable local/GitHub fallback.
3. Never fabricate external state.
4. Separate DEMO, READY, CONNECTED and LIVE.
5. Ask the owner only for information that cannot be safely inferred or accessed.
6. Every action gets an audit event.
7. Failed actions become retryable tasks.
8. High-risk, financial, legal, sensitive or irreversible actions require explicit confirmation.

## Universal task object
{
  "id": "uuid",
  "domain": "concierge|creator|business|research|content|technology|operations|finance|admin",
  "goal": "human-readable objective",
  "inputs": {},
  "status": "NEW|PLANNED|RUNNING|WAITING|VERIFYING|DONE|FAILED|NEEDS_OWNER",
  "actions": [],
  "outputs": [],
  "dependencies": [],
  "requires_owner": [],
  "created_at": "",
  "updated_at": ""
}

## Adapter model
External services are adapters, not hard-coded assumptions:
- GitHubAdapter
- NotionAdapter
- TodoAdapter
- CanvaAdapter
- WhatsAppAdapter
- DatabaseAdapter
- PaymentsAdapter
- MapsAdapter
- AIAdapter
- StorageAdapter
- NotificationAdapter

Each adapter exposes:
- health()
- capabilities()
- execute(action, payload)
- verify(result)
- rollback(result) where possible

## Completion states
DONE means the requested result was actually produced and verified.
READY means implementation exists but credentials/external setup is still required.
BLOCKED means an external dependency prevents execution.
NEEDS_OWNER means a decision, secret, payment, approval or physical action is required.

## Owner cockpit
The dashboard should show:
1. What O'BUUMBA can do automatically now.
2. What is connected.
3. What is ready to connect.
4. What is blocked.
5. The exact next owner action.
6. Retryable failures.
7. Recent audit events.

## First implementation priority
1. Persistent task store.
2. Adapter registry.
3. Task runner.
4. Audit log.
5. Owner cockpit.
6. Provider matching.
7. External integration credentials.
8. Automated tests.
9. Deployment.
10. Production pilot.

The goal is not another dashboard. The goal is a system that turns an instruction into verified execution with the fewest owner actions possible.
