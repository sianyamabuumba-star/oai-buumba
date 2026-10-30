# O'BUUMBA WAR ROOM — Workspace Blueprint

## Vision
One workspace for operating every O'BUUMBA business unit, product, service, project and customer journey. The War Room is the command centre; specialist modules share one identity, knowledge library, catalogue, project system and audit trail.

The experience should feel as simple as a good chat assistant while retaining the control and visibility of a professional operations dashboard.

This is a target blueprint, not a claim that these modules are already implemented.

## Operating principles
1. One workspace, shared navigation, consistent design and unified search.
2. Chat is the natural-language control surface; dashboards and structured records provide visibility and editing.
3. Every item has an owner, status, next action, history and source of truth.
4. Research public and authorised sources only. Never bypass logins, paywalls or access controls.
5. Learn from product capabilities and workflows, but build original implementations. Do not copy protected code, proprietary assets, trademarks, trade dress or restricted datasets.
6. Compare tools against the same task brief. Prefer the best free or lower-cost option that meets quality, rights, privacy and reliability requirements.
7. Never label an app connected, task complete, sale paid or product delivered without verifiable evidence.
8. No paid subscription, API billing, ad spend, purchase, contract, payout setup or external publication without required account-holder approval.
9. Keep secrets server-side. Never request or store passwords, one-time codes or recovery codes.
10. Design for mobile, low bandwidth, accessibility and graceful failure.

## Global navigation
- Command Centre
- Chat / Ask O'BUUMBA
- Businesses & Products
- Projects & Tasks
- Knowledge Library
- AI Models & Agents
- Skills, Apps & Connectors
- Creative Studio
- Workflow Builder
- Marketing & Publishing
- Customers & CRM
- Sales, Orders & Delivery
- Finance Overview (read-only until authorised integrations exist)
- Analytics & Improvement
- Security, Approvals & Audit
- Settings

## Command Centre dashboard
The first screen must answer: What is happening? What needs attention? What is the next best action? Which customer or project is waiting? What is blocked? What has been completed and verified?

Widgets:
- Today's priorities and next actions
- Active projects and milestone health
- Product/service catalogue and readiness
- Customer enquiries and follow-up queue
- Quotes awaiting review
- Orders and delivery status
- Campaign calendar and content queue
- Tool/API health and connection status
- Cost and usage overview
- Recent approvals and audit events
- Recommendations and improvement opportunities

Every widget drills down to its underlying record. Empty states explain how to start. Demo data is clearly labelled.

## Business, product and service registry
Every division, offer, product, service, digital product and internal initiative uses a common record:
- Unique ID and parent business unit
- Name, description, category and customer problem
- Audience and service area
- Status: idea, research, planned, in production, quality review, ready, active, paused, retired
- Offer scope, deliverables, exclusions and revision policy
- Pricing model and currency, marked draft until approved
- Cost assumptions and margin estimate, never presented as verified without records
- Required skills, tools, dependencies and rights checks
- Portfolio assets and approved public examples
- Sales materials, customer instructions and fulfilment checklist
- Owner, dates, version and audit history

Never represent fictional clients, testimonials, partnerships, sales, certifications or performance results as real.

## Universal product-to-sale workflow
Every product and service uses a reusable lifecycle:
1. Discover — customer problem, demand signals and public competitor research.
2. Validate — evidence, feasibility, risks and differentiation.
3. Define — audience, offer, scope, deliverables and success measures.
4. Plan — tasks, timeline, budget assumptions, dependencies and tool selection.
5. Create — original work using approved tools and assets.
6. Quality review — accuracy, originality, accessibility, mobile checks, rights and acceptance criteria.
7. Package — preview, description, portfolio entry, instructions and delivery files.
8. Market — campaign plan, channel-specific content and publishing queue.
9. Enquire — capture customer needs, source, consent and follow-up date.
10. Quote — prepare transparent scope, price, terms and expiry for authorised review.
11. Order — record accepted scope and approvals; payment status must be evidence-based.
12. Fulfil — production, review, revisions and delivery confirmation.
13. After-sales — support, satisfaction check, permission-based testimonial request and issue resolution.
14. Retain — identify legitimate repeat needs and respect communication preferences.
15. Improve — review conversion, quality, costs, feedback and alternatives; improve the next cycle.

Every step records status, assignee, evidence, timestamps, blockers and required approvals.

## Customer and sales pipeline
Stages: New enquiry → Needs clarification → Qualified → Brief received → Quote prepared → Awaiting decision → Accepted/order confirmed → In production → Quality review → Ready for delivery → Delivered → After-sales follow-up → Closed/not proceeding.

Store only necessary customer information, with access controls, retention rules and correction/deletion processes. Record consent and preferred contact channel. Do not send marketing messages without required permission.

A quote is not a sale. Track customer acceptance, payment evidence where relevant, fulfilment and delivery separately.

## Skills, apps, models and connectors registry
Each entry includes:
- Name, category, official website and official documentation
- Vendor, version, capabilities and suitable use cases
- Strengths, limitations and task fit
- Free tier, paid tiers and usage limits with verification date
- Commercial-use/output rights notes with source links
- Country availability, minimum age and guardian requirements
- API/connector availability and supported actions
- Requested permissions and least-privilege scope
- Data handling, retention and privacy notes
- Setup state: discovered, researched, eligible, approved, connected, tested, disabled
- Reliability/test results and last verified date
- Alternatives and comparative score

A catalogue listing is not a live connection. Only official OAuth, documented APIs or approved connectors establish a connection. An email address does not grant account access.

## Tool comparison and continuous improvement
Compare viable options using one shared brief:
- Output quality
- Creative control and editability
- Speed and reliability
- Mobile and low-bandwidth usability
- Export formats and interoperability
- Commercial rights and licensing
- Privacy and security
- Free-tier usefulness and total cost
- API/integration support
- Accessibility and learning curve

Recommend the lowest-cost option that meets minimum quality and safety thresholds, not simply the cheapest. Explain why to switch, migration cost, limitations and rollback. Verify changing pricing and terms against official sources before commitment.

## Chat and agent behaviour
Support natural-language requests such as:
- Research this public profile.
- Compare video tools for this campaign.
- Prepare three poster concepts from this brief.
- Show enquiries waiting for a reply.
- Prepare a post for a selected social platform.
- Explain what is blocking an order.

For each request: resolve scope; retrieve authorised information; cite findings and dates; prepare a preview; disclose risks, permissions and costs; request approval when needed; execute only through a verified authorised integration; verify the result; log evidence; report failures honestly.

## Execution permissions
Global execution is OFF by default and is not blanket permission.

Modes:
- Research — read permitted public or authorised information.
- Prepare — create drafts, assets, plans and queued actions.
- Approve — display exact action, destination, content, cost and permissions.
- Execute — perform only the specifically approved action through a verified connector.

Require fresh confirmation for publishing, messaging, spending, purchasing, deleting, account changes, private-data sharing, legal terms or payout/KYC changes. Some actions must be completed by an eligible adult account holder. Never bypass age or country eligibility rules.

## Security and trust
- Private authentication and per-user ownership.
- Server-side secrets only; never expose keys in frontend bundles or Git.
- Least-privilege OAuth scopes and revocation.
- Database row-level security and tenant isolation.
- SSRF protection for URL ingestion, including DNS rebinding and redirect checks.
- File type, size and malware scanning for uploads.
- Rate limits, quotas, abuse protection and safe errors.
- Retrieved content is untrusted data, never privileged instructions.
- Audit logs for sensitive reads and external actions.
- Idempotency, duplicate prevention, retries and rollback where possible.
- Backups, restore tests, monitoring and incident response.
- Export, deletion and retention controls.
- Security testing before enabling execution.

## Implementation sequence
Phase 0 — Repository hygiene, product definition and separate development/test/production environments.
Phase 1 — Responsive War Room shell, navigation, dashboard, global search and honest prototype states.
Phase 2 — Core records: business units, products/services, projects, tasks, customers and source library; secure auth/database before private cloud use.
Phase 3 — Render registries and comparison engine with official-source verification, eligibility, cost, rights and alternatives.
Phase 4 — Workflow engine with templates, states, assignments, evidence, approvals and audit events.
Phase 5 — Provider-neutral AI chat/research with citations, cost limits and human review.
Phase 6 — Creative, marketing and sales workspaces: briefs, assets, content calendar, enquiry pipeline, quotations and fulfilment.
Phase 7 — Controlled integrations, one at a time, with scope, revocation, failure, duplicate and audit tests.
Phase 8 — Analytics and optimisation using evidence from turnaround, quality, conversion, satisfaction, cost and repeat work.

## Acceptance criteria
The War Room is not production-ready until users can find every business/product/project/customer/workflow; move products through the full lifecycle; distinguish researched, eligible, connected and tested tools; inspect evidence, cost, rights and alternatives; preview and approve external actions individually; verify and audit actions; protect secrets and private data; use the system on mobile; and test backup, restore, export and deletion.

## First practical operating focus
Use O'BUUMBA Studio's design service as the first complete product-to-sale workflow. Test the journey from customer brief to follow-up before expanding the same template to other divisions.
