# O'BUUMBA Intelligence Portal — MVP implementation notes

## Purpose
This milestone introduces a polished, responsive portal foundation inside the existing repository. It begins the single-workspace experience: source capture, a local knowledge list, tool/skill category map, workflow catalogue and honest integration status.

## Engineering contract

The secure source-ingestion requirements, source-record model, processing lifecycle, SSRF controls, privacy requirements and first-release acceptance criteria are defined in [KNOWLEDGE_INGESTION_DESIGN.md](KNOWLEDGE_INGESTION_DESIGN.md). Treat that document as the implementation contract for the next milestone.

## Current implementation
- `portal/index.html` is a self-contained static interface with no third-party runtime dependencies.
- Users can save public HTTP/HTTPS source links, add a title/type/notes, search, remove, and export their source list as JSON.
- Source records are stored in the current browser's localStorage.
- The interface clearly labels every saved source as **Not yet analysed**.
- Tool categories and workflow templates are catalogue placeholders, not claims of live integrations.
- The interface states that login, cloud sync, AI analysis and external connectors are not connected.

## Why this is deliberately staged
A public URL capture feature must not fetch arbitrary URLs directly from the browser's trusted server without SSRF protections. The next backend stage should:
1. Accept only HTTP/HTTPS URLs.
2. Resolve and reject loopback, private, link-local, reserved and internal IP ranges (including IPv4-mapped IPv6).
3. Re-check every redirect target and limit redirects.
4. Apply strict response size, timeout, MIME type and content-length limits.
5. Never forward cookies, authorization headers or user credentials.
6. Extract readable public text only; do not bypass logins, paywalls or access controls.
7. Store source URL, capture timestamp, content hash, extracted text, parser version and retrieval outcome.
8. Cite source URLs in every analysis and label uncertainty.
9. Use a provider adapter on the server for AI analysis; never put API keys in browser code.
10. Treat source text as untrusted data, never as executable instructions.

## Next milestones
### M1 — Source intelligence backend
Safe URL retrieval, readable-text extraction, source records, deduplication, source status and tests.

### M2 — Login and private cloud library
Authentication, per-user ownership, database row-level policies, secure sessions, export/delete and backup strategy. No public shared workspace by default.

### M3 — AI analysis
Provider-neutral model adapters, user-selected provider, server-side secret handling, cost/usage visibility, citations and human review.

### M4 — Skills and connectors catalogue
Versioned registry for models, apps, skills, plugins and connectors. Each record tracks official URL, capabilities, free/paid status with verification date, account/age eligibility, permissions, API support, connection status and alternatives.

### M5 — Workflow execution
Reusable workflow definitions, manual approval gates, idempotency, audit logs, retries, quotas and safe failure handling.

## Data and privacy warning
This prototype stores source links and notes in browser localStorage. They do not sync between devices and may be accessible to anyone using the same browser profile. Do not enter passwords, API keys, private source material or sensitive personal information. It is not a production login portal.
