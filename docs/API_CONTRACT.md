# API contract

## GET /api/health
Returns service status.

## POST /api/requests
Body: {"message":"Need airport pickup tonight"}

Creates a NEW request and returns its id, detected intents and timestamp.

## GET /api/requests
Returns current MVP request queue.

## PATCH /api/requests/:id
Body: {"status":"MATCHING"}

Updates request status.

Production extension:
- authentication
- persistent database
- provider matching endpoint
- webhook signature verification
- idempotency keys
- audit events
- rate limiting
- structured error codes
