# O'BUUMBA OS Architecture

Customer message → intent → requirements → provider search → ranking → confirmation → arrangement → completion → audit.

Domains: customers, requests, providers, services, availability, bookings, interactions, verification, payments, automation_runs, audit_events, creator_projects, business_opportunities.

Request states: NEW → MATCHING → AWAITING_CONFIRMATION → CONFIRMED → IN_PROGRESS → COMPLETED. Escalation states: NEEDS_HUMAN, CANCELLED, FAILED.

Rules: never claim availability without a real check; never claim a booking without confirmation; minimize private data; escalate ambiguous, high-value, sensitive or failed requests.
