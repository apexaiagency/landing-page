# Deploy guide — Off-Site Desktops landing page

This deploys the site, wires the pilot form to **Supabase** (stores leads) and **Resend**
(emails you each lead), and connects your domain. All services used here are free to start.

The form and email capture are **host-independent** — Supabase and Resend are just HTTPS
calls from the server route, so they work the same wherever you deploy. The steps below use
**Vercel**, the native fit for Next.js (the form's server route "just works").

> Hosting note: Vercel's free **Hobby** plan is non-commercial per their terms. It's fine for
> a quiet pre-launch page; move to **Pro ($20/mo)** at real commercial launch (also lifts the
> 100 GB bandwidth cap to 1 TB). If you need free-and-commercial from day one, use Cloudflare
> instead — but its free tier needs the OpenNext adapter, which makes the form's server route
> more finicky to set up. See the bottom of this file.

---

## 1. Put the code in a Git repo

Vercel deploys from Git. From inside `landing-page/`:

```bash
git init
git add .
git commit -m "Off-Site Desktops landing page v1"
# create an empty repo on GitHub first (private is fine), then:
git remote add origin git@github.com:YOURORG/offsite-landing.git
git branch -M main
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `.next`, and `.env*` — no secrets get committed.

---

## 2. Supabase — store leads (free)

1. Create a project at supabase.com (free tier).
2. In the SQL editor, run:

   ```sql
   create table if not exists pilot_leads (
     id uuid primary key default gen_random_uuid(),
     email text not null,
     msp_name text not null,
     client_seats integer,
     current_platform text not null,
     intent text not null check (intent in ('pilot','pricing')),
     source text,
     user_agent text,
     created_at timestamptz not null default now()
   );
   ```

3. Project Settings → API. Copy the **Project URL** and the **service_role** key
   (server-only — never expose it to the browser).

Leads are inserted by the server route only, so no public RLS policy is needed.

---

## 3. Resend — email you each lead (free)

1. Create an account at resend.com (free tier easily covers lead volume).
2. **API Keys** → create one. That's `RESEND_API_KEY`.
3. Sender address (`LEAD_FROM_EMAIL`):
   - To test immediately: use `onboarding@resend.dev`.
   - For production: add and verify your domain in Resend (a few DNS records), then use
     something like `leads@yourdomain.com`. Deliverability is much better from a verified domain.
4. Decide the inbox that receives new-lead emails → `LEAD_NOTIFY_EMAIL`.

Replies to a lead email go straight to the MSP (the route sets `reply_to` to their address).

---

## 4. Deploy on Vercel

1. vercel.com → New Project → import your GitHub repo.
2. Framework preset auto-detects **Next.js**. Root directory = repo root (or `landing-page`
   if you kept it inside the larger repo). Leave build/output settings default.
3. Add **Environment Variables** (Settings → Environment Variables), then redeploy:

   | Variable | Value |
   |---|---|
   | `SUPABASE_URL` | your Supabase Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service_role key |
   | `RESEND_API_KEY` | your Resend API key |
   | `LEAD_NOTIFY_EMAIL` | inbox that should receive new-lead emails |
   | `LEAD_FROM_EMAIL` | verified sender (or `onboarding@resend.dev` to test) |
   | `NEXT_PUBLIC_SIGNUP_HANDOFF_URL` | your platform sign-up URL (optional; success-state button) |
   | `LEAD_NOTIFY_WEBHOOK_URL` | optional Slack/Teams webhook |
   | `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | optional analytics endpoint |

   Nothing here blocks a first deploy — with Supabase/Resend unset the form still returns a
   success state; it just won't store or email until the keys are in.

4. Submit the form on the live URL once and confirm a row appears in Supabase and an email
   lands in your inbox.

---

## 5. Connect your domain (when ready)

1. Vercel → Project → Settings → Domains → add `offsitedesktops.com` (or your domain).
2. At your registrar, add the two DNS records Vercel shows (an `A`/`ALIAS` for the apex and a
   `CNAME` for `www`). SSL is issued automatically once DNS resolves.
3. Update `content/site.ts → meta.url` to the real domain (canonical/OG/sitemap), and set
   `LEAD_FROM_EMAIL` to an address on that domain once it's verified in Resend.

---

## Alternative: Cloudflare (free for commercial use)

Cloudflare's free tier permits commercial projects, but Next.js App Router isn't native there —
you deploy through the **OpenNext Cloudflare adapter** (`@opennextjs/cloudflare`). Supabase and
Resend work identically; only the build/deploy config differs. Ask and I'll add the adapter and
config. Expect more setup than Vercel and occasional compatibility edges on the server route.
