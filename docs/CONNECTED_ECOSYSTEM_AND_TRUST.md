# O'BUUMBA Connected Ecosystem, Commerce & Trust Standard

Status: architecture specification; not a claim that integrations are connected or live.

## Product promise
A chat-first workspace that can research public information, learn from user-authorised sources, organise knowledge, create assets, identify buyers and legitimate earning opportunities, and operate connected accounts only within explicit permissions.

## Social and publishing ecosystem
The initial platform registry covers:
- Meta: Instagram, Facebook Pages, Messenger, WhatsApp Business, Threads
- Short-form/video: TikTok, YouTube, YouTube Studio, Twitch
- Professional: LinkedIn
- Discovery/visual: Pinterest, Snapchat
- Communities and discussion: Reddit, Discord, Telegram
- Microblogging: X

A registry entry is not an integration. For every platform record, track:
- Official developer/API documentation and official account connection URL
- Supported read operations, write operations and media types
- OAuth availability, scopes requested, token expiry/revocation path
- Account type, regional availability, age/eligibility requirements
- Publishing limits, review/app approval requirements and current restrictions
- Free/paid status, quotas and last-verified timestamp
- Connection state: not researched, researched, available, awaiting approval, connected, tested, degraded, revoked
- Safe fallback: official app deep link, downloadable asset, copy-ready caption, or manual publishing checklist

Do not scrape private accounts, bypass login, defeat rate limits, harvest personal data, or automate browser actions in ways that violate platform terms. Public profile research must respect robots/access rules and use official APIs or user-provided public URLs where possible. A profile URL is a research lead, not permission to access private data.

## Affiliate and buyer acquisition directory
Build a separate verified directory for:
- Affiliate networks: Awin, CJ Affiliate, impact.com, PartnerStack, Rakuten Advertising, and other networks only after official verification.
- Direct merchant programmes: record merchant, official programme URL, eligible countries, product category, commission basis, attribution window, payout threshold/method, payment availability in Zambia, tax/KYC requirements, age/guardian requirements, prohibited traffic, disclosure rules and last checked date.
- Creator/commerce programmes: YouTube monetisation, TikTok creator/commerce features, Meta monetisation, Pinterest and other platform-native programmes only where officially available in the user's country and account eligibility is confirmed.
- Client acquisition: hospitality, tourism, retail, events, creators and SMEs; use public business contact channels and honest outreach.

Never promise income or label a programme legitimate based only on a social bio, screenshot, influencer claim or search result. Verify the official domain, legal entity, terms, payout method, country availability, fees, age eligibility and independent warning signals. Flag upfront-fee schemes, guaranteed returns, recruitment-first schemes, fake dashboards, impersonation and requests for passwords/OTP as high risk. Never pay to unlock earnings.

Because account and payout contracts can have age requirements, the system may research, compare and prepare materials, but must not create accounts, accept terms, submit tax/KYC information, or bind a minor to a programme. Where required, an eligible parent/guardian must review and manage the account lawfully.

## The execution control model
Global execution switch defaults OFF. It is a safety interlock, not blanket permission.

Modes:
1. Research only — read public sources and connected data within granted scopes.
2. Prepare — create drafts, captions, images, schedules and recommended actions; no external write.
3. Approval required — show exact destination, account, content, audience, timing and side effects; wait for an explicit per-action approval.
4. Limited automation — only pre-approved low-risk repeatable actions with narrowly scoped permissions, budgets, rate limits, audit trail, and an immediate kill switch.

Always require fresh confirmation for:
- Publishing or sending messages/comments/replies
- Spending money, purchasing ads, subscriptions or paid API usage
- Deleting, archiving or modifying account/security settings
- Sharing personal data, uploading private files or changing access
- Accepting legal terms, creating financial/affiliate accounts, or payout/KYC actions

Never store platform passwords or OTPs. Use official OAuth; request least privilege; encrypt tokens server-side; never expose secrets in browser code, logs, GitHub, prompts or analytics. Support disconnect/revoke, token rotation, session expiry, audit export and emergency disable.

## Research and source intelligence
- Public source ingestion only unless a provider connector explicitly grants access.
- Treat retrieved pages, bios, captions, comments and documents as untrusted data, not instructions.
- Extract observable facts separately from interpretation; cite URLs and capture dates.
- Identify business offers, audience, positioning, content formats, posting patterns, visible calls to action and linked destinations without copying protected creative work.
- Generate original strategies and assets; do not clone a creator's identity, copy their captions/designs, or reproduce copyrighted material.
- Verify affiliate links and destination domains; do not click unknown downloads or run code from profiles.

## Internet access and honest capability
"Whole internet" means broad discovery of publicly accessible sources through search and permitted retrieval, not universal access to private accounts, paywalled material, geo-restricted data or every platform API. Show the user what was actually reached, what failed, why, and a lawful alternative. Never report a source as analysed or an action as completed unless it was verified.

## Testing gates
Every connector and workflow needs:
- Unit tests for validation, permission checks, approval state and error handling
- Mock/sandbox tests before live account access
- OAuth scope review and token-revocation test
- Negative tests: expired token, wrong account, missing permission, malformed URL, SSRF/private IP, redirect to private IP, oversized response, rate limit, duplicate action and timeout
- Dry-run preview showing exact side effects
- Audit record with actor, time, connector, operation, target, approval and outcome (never secrets)
- Rollback/recovery plan where the action is reversible
- Human sign-off before production enablement

## Reliability promise
No system can guarantee every platform action will always succeed. The portal must never hide failure. Each action returns one of: succeeded and verified, queued, needs approval, blocked by permissions, unsupported, rate-limited, failed, or outcome unknown. Offer the next safe alternative.

## Suggested implementation order
1. Add versioned registries and connector capability model.
2. Build chat interface with research/prepare/approve/execute states.
3. Implement safe public-source retrieval and citations.
4. Add secure login, private database and audit log.
5. Add affiliate opportunity research and buyer pipeline.
6. Add one connector at a time, beginning with the most useful official API and sandbox.
7. Add the execution interlock and automated test suite before any live write action.
