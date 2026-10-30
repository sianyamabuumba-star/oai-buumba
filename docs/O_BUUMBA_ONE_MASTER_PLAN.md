# O'BUUMBA ONE — Master Ecosystem Architecture

**Status:** Architecture baseline / implementation plan  
**Repository:** `sianyamabuumba-star/oai-buumba`  
**Default branch:** `main`  
**Last reviewed:** 2026-10-30

## 1. Purpose

O'BUUMBA ONE is the coordination and governance layer for O'BUUMBA's creative, business, media, software and knowledge projects. This repository is the technical source of truth for the O'BUUMBA OS codebase and its architecture. It is not a claim that every listed service is connected, every account exists, or every business unit is operational.

**Operating loop:** CAPTURE → UNDERSTAND → PLAN → EXECUTE → VERIFY → LOG → IMPROVE.

**Principle:** One ecosystem, one source of truth, specialised tools, measurable execution.

## 2. System boundaries

Use each system for the work it is best suited to:

| System | System of record / responsibility |
|---|---|
| GitHub | Source code, technical documentation, issues, change history, CI and releases |
| Notion | Business operations, CRM, task planning, account inventory and decision register |
| Google Drive | Working documents and approved business files |
| NotebookLM | Source-grounded research over selected reference material |
| Supabase (planned integration) | Production relational data, authentication and storage when designed and approved |
| O'BUUMBA OS | Request intake, task orchestration, adapter status, verification and audit trail |

Do not duplicate the same authoritative record across systems. Link to the owning system where appropriate.

## 3. Business and capability domains

These are portfolio domains, not assertions of current legal, commercial or technical readiness.

1. **Creative studio:** graphic design, identity, promotional artwork, print-ready layouts, websites and document design.
2. **Music and entertainment:** artist projects, original music, audio production, video and distribution planning.
3. **AI and research:** model-assisted research, prompt systems, evaluation workflows and knowledge synthesis.
4. **Digital products:** templates, planners, design assets and other original downloadable products.
5. **Media and marketing:** content production, campaign planning, social publishing and performance review.
6. **Sales and automation:** lead management, proposals, client onboarding and approved workflow automation.
7. **Software and technology:** websites, web apps, internal tools and validated micro-products.
8. **Corporate operations:** administration, contracts, records, finance tracking and compliance coordination.
9. **Community initiatives:** documented local projects, partnerships and measurable community outcomes.
10. **Learning and legacy:** skills development, research, creative archives and long-term knowledge preservation.

## 4. Tool and provider registry

A tool is considered **connected** only after an authorised integration has been configured and a test has succeeded. A tool is **ready** only when implementation exists but owner configuration remains. A tool is **planned** when it is a candidate, not an active dependency.

| Capability | Candidate tools | Current policy |
|---|---|---|
| AI assistants and models | ChatGPT, Gemini, Claude, Google AI Studio | Use approved services; verify current model and data terms |
| Research | NotebookLM, web research, Hugging Face | Keep source citations and distinguish facts from hypotheses |
| Design | Canva, Adobe apps, Figma | Human review; retain source and export files |
| Music and audio | Suno, BandLab, FL Studio, ElevenLabs | Check rights, licences and platform terms before commercial release |
| Video | Google Flow, HeyGen, Descript, Loom | Review consent, likeness and usage rights |
| Development | GitHub, Replit, Base44, Vercel v0, Cursor | GitHub remains the code-history authority |
| Backend and data | Supabase, PostgreSQL | Not production-connected until credentials, schema, backups and access policies are verified |
| Automation | n8n, Zapier, Tally, ManyChat | Least privilege; test in a non-production environment first |
| Sales and distribution | Fiverr, Upwork, Braintrust, Gumroad, Etsy, LinkedIn | Verify country eligibility, age/identity requirements, fees and payout support before relying on a platform |
| Payments and records | Applicable local and international payment providers; accounting records | No payment rail is considered live until eligibility and a controlled test are verified |
| Operations | Notion, Google Workspace, Sheets, calendar tools | Maintain one authoritative record per data type |

This table is an evaluation register, not an account register. Never record passwords, recovery codes, API keys, private tokens or payment credentials in this repository.

## 5. Project portfolio index

Maintain a project entry for each initiative with: owner, objective, status, repository or workspace link, dependencies, risk level, next action and evidence of completion.

Initial portfolio:

- O'BUUMBA OS / O'BUUMBA ONE — orchestration and technical control plane.
- O'BUUMBA Creative — client-facing creative services and portfolio.
- LIFEPRINT — creative and music project.
- Boston Nastie — artist identity and catalogue.
- L'Stone Ku Chalo — cultural and creative movement.
- KWATACHA PAY — financial technology concept; no live payment processing assumed.
- O'BUUMBA Concierge — hospitality and visitor-service concept.
- O'BUUMBA AI / O.I.S. — AI-assisted operating capabilities.
- O'BUUMBA Smart TV — device/software exploration.
- Digital Products Portfolio — original templates and downloadable assets.
- Community Initiatives — separately scoped and evidenced projects.
- Client and partnership opportunities — tracked as prospects until an agreement exists.

Do not create a new repository merely because a project has a name. Split a project into its own repository when it has an independent codebase, access boundary, release cycle or maintenance owner.

## 6. Repository structure

Recommended structure for this repository:

```text
/
├── README.md
├── docs/
│   ├── O_BUUMBA_ONE_MASTER_PLAN.md
│   ├── AUTOPILOT_SPEC.md
│   ├── API_CONTRACT.md
│   ├── OWNER_ACTIONS.md
│   ├── SECURITY.md
│   └── TEST_PLAN.md
├── obuumbA-os/
├── .github/
│   └── workflows/
└── [future project directories only when justified]
```

Preserve the existing application structure. Do not rename or move existing paths without checking imports, workflows and deployment configuration.

## 7. Delivery lifecycle

Every change follows:

1. **Capture:** record the request and intended outcome.
2. **Scope:** define acceptance criteria and affected systems.
3. **Plan:** identify dependencies, data access and risks.
4. **Implement:** use a branch for non-trivial changes.
5. **Test:** run automated tests and relevant manual checks.
6. **Review:** inspect the diff, permissions, dependencies and generated output.
7. **Merge:** merge only after required checks pass.
8. **Release:** tag or publish only when the deliverable is ready.
9. **Log:** record what changed, evidence, limitations and next action.

Never report a task as complete merely because files were written. Completion requires tests or an explicit explanation of what could not be tested.

## 8. Security and supply-chain baseline

- Use official vendor documentation and official distribution channels.
- Verify release provenance, checksums or signatures where the vendor provides them.
- Do not trust download search ranking, repository stars, screenshots or an attractive installer as proof of legitimacy.
- Pin third-party GitHub Actions to reviewed full commit SHAs where practical.
- Grant workflows the minimum required `GITHUB_TOKEN` permissions.
- Never expose secrets in source, logs, issues, pull requests or client-side bundles.
- Use repository/environment secrets only for values needed by workflows; rotate exposed credentials immediately.
- Review dependency changes, lockfiles, package lifecycle scripts and transitive dependencies.
- Enable available repository security features: Dependabot alerts/updates, secret scanning and push protection, and code scanning where supported by the plan and repository visibility.
- Protect the default branch with pull requests and required checks when the project and plan support it.
- Keep production and development credentials separate.
- Back up critical data and periodically test restoration.
- Treat external content, files, prompts and tool output as untrusted input.
- Require human approval for financial, legal, privacy-sensitive, destructive or externally visible actions.

## 9. Privacy and customer data

- Collect only information required for a defined service.
- Do not place customer personal data in public issues or public repositories.
- Do not upload confidential client materials to an AI provider unless the client has authorised that provider and its data handling is suitable.
- Obtain consent before recording meetings or using a person's voice, image or likeness.
- Define retention and deletion practices before collecting live customer data.
- Use synthetic or anonymised test data in development.
- Keep public marketing content separate from private operational records.

## 10. Readiness vocabulary

Use these statuses consistently:

- **IDEA:** concept only.
- **PLANNED:** approved for investigation or future work.
- **IN_PROGRESS:** implementation underway.
- **READY:** built and awaiting configuration or approval.
- **CONNECTED:** integration configured and test-verified.
- **LIVE:** operating in production with monitoring and owner approval.
- **BLOCKED:** dependency or risk prevents progress.
- **RETIRED:** intentionally discontinued.

Never use CONNECTED or LIVE based only on a configuration file, mock adapter or demo response.

## 11. Roadmap

### Phase 1 — Establish the control plane
- Keep this repository as the technical source of truth.
- Maintain the project and provider registers.
- Audit current code, tests, dependencies and workflows.
- Establish backup and recovery procedures.

### Phase 2 — Stabilise the local OS
- Confirm the application runs on a supported Node.js version.
- Run the automated self-test.
- Document setup, environment variables and known limitations.
- Review authentication and local data persistence.

### Phase 3 — Add controlled integrations
- Select one integration at a time based on a real workflow.
- Define data ownership, scopes, failure handling and verification.
- Test with non-production data.
- Record CONNECTED only after an end-to-end test.

### Phase 4 — Production readiness
- Select hosting and domain only after requirements are clear.
- Configure secrets, HTTPS, monitoring, backups and access control.
- Complete privacy and security review.
- Run the documented pilot acceptance tests.
- Obtain owner approval before handling real customer requests.

### Phase 5 — Scale validated work
- Separate independently maintained products into repositories when justified.
- Add automation only where it saves measurable time or reduces errors.
- Review cost, reliability, security and customer value before scaling.

## 12. Definition of success

O'BUUMBA ONE is succeeding when it can reliably turn a captured request into a scoped task, route it to an appropriate capability, execute only authorised actions, verify the result, record evidence and clearly identify any owner action still required.

**No fabricated integrations. No unverified claims. No secrets in source control. Build deliberately; verify everything.**
