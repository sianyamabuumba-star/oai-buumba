# O'BUUMBA Creative — Public Website

A mobile-first static website for the O'BUUMBA Creative studio.

## Purpose

- Explain the studio and its services.
- Present the brand professionally to prospective clients.
- Direct genuine enquiries to WhatsApp or email.
- Show clearly labelled concept studies without inventing client relationships, testimonials or commissioned work.

## Current scope

- Static HTML, CSS and a small amount of vanilla JavaScript.
- No paid dependencies, tracking scripts, cookies, database or backend.
- Email is the current enquiry route. A dedicated business contact channel can be added after it is set up safely.
- Portfolio tiles are explicitly labelled concept/service previews.
- No domain, hosting provider or live deployment has been configured.

## Preview locally

From the repository root:

```bash
python3 -m http.server 8000 --directory website
```

Then open `http://127.0.0.1:8000`.

## Before publishing

1. Review every word, contact detail and service description.
2. Replace concept tiles with approved original portfolio images when available.
3. Add a real domain and canonical URL after the domain is selected.
4. Test on an Android phone and desktop at narrow and wide widths.
5. Confirm WhatsApp and email links open correctly.
6. Choose and configure a hosting target; deployment is not enabled by this branch.
7. Do not publish a personal phone number. Add a dedicated business contact channel only when it is ready and appropriately managed.
8. Keep private operating-system files, customer data and credentials outside the public site.

## Brand direction

- Palette: black, deep purple, metallic gold and ivory.
- Voice: clear, confident, useful and grounded.
- Brand line: **Create. Uplift. Cockieness.**
- Positioning: **From Livingstone to the world.**

## Cloudflare Pages deployment

The production deployment workflow is `.github/workflows/deploy-cloudflare-pages.yml`.
It publishes the static `website/` directory only after the dependency-free
website validation job succeeds.

Before the first deployment, a repository administrator must:

1. Create a Cloudflare Pages project using **Direct Upload**, named
   `obuumba-creative` (or use the exact project name configured below).
2. Create a Cloudflare API token restricted to the relevant account with
   **Cloudflare Pages: Edit** permission. Do not use a Global API Key.
3. In GitHub, open **Settings → Secrets and variables → Actions** and add:
   - Secret `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.
   - Secret `CLOUDFLARE_API_TOKEN`: the restricted Pages API token.
   - Repository variable `CLOUDFLARE_PAGES_PROJECT`: the exact Pages project
     name (default recommendation: `obuumba-creative`).
4. Push an approved website change to `main`, or run the workflow manually
   from the `main` branch.

The workflow uses a SHA-pinned checkout action and an exact Wrangler version.
It does not store credentials in the repository. Never paste API tokens into
issues, commits, source files or chat messages.

A successful GitHub workflow run confirms deployment. The resulting
`*.pages.dev` address is supplied by Cloudflare; add a custom domain only
after the site has been reviewed and the domain is controlled by the project
owner. No domain purchase is required for the initial Pages URL.
