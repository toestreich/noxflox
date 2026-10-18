# NoxFlox MVP: Technical Overview

> Status: v0 draft. Goal: a pilot-ready MVP that 5–10 NYC brokers can use with real renters, on a **$0 stack**.

---

## 1. What the MVP must prove

The pilot tests one loop:

```
Broker creates intake link  →  Renter builds passport (uploads)  →  Renter shares with broker
        →  Broker reviews a complete, AI-checked application on one page
```

If brokers keep sending that link instead of an email checklist, the MVP worked. Everything not needed for that loop is deferred.

### In scope (MVP)
| Area | Renter | Broker |
|---|---|---|
| Accounts | Email magic-link sign-in | Email magic-link sign-in, brokerage name |
| Passport | Profile, move-in date, target rent, document slots | n/a |
| Documents | Upload ID, pay stubs, bank statements, W-2/tax return, employer letter, landlord reference | View through short-lived links, with every view logged |
| Redaction | Black out SSNs, account numbers or anything else **in the browser, before upload**, with automatic suggestions for text PDFs | Sees the document labelled "Redacted in NoxFlox · N areas hidden" |
| AI | Parse docs into fields and show the renter what's missing | One-page applicant summary, consistency flags, income-to-rent ratio |
| Sharing | Share with a broker (from an intake link or by email), set an expiry, revoke, see the access log | See passports shared with them |
| Intake | n/a | Create an intake link per listing (rent, required docs) and see a list of applicants |

### Deferred (post-MVP)
- Bank and payroll connections (Plaid / Argyle / Pinwheel). M2, Plaid sandbox is free to develop against.
- Identity verification (ID scan + selfie). M2, needs a paid vendor.
- Credit checks. Needs FCRA review and a bureau partner. **The MVP never collects SSNs.**
- Households, roommates and guarantors. M4.
- Redaction suggestions for photos and scanned PDFs (needs OCR in the browser, e.g. Tesseract.js). Drawing boxes by hand works on every file in the MVP.
- Payments, billing, team workspaces, board-package export, API.

### Vocabulary: be honest about "verified"
Without bank, payroll or ID connections the MVP **cannot verify** anything. Use these statuses consistently in the UI:

| Status | Meaning | Available |
|---|---|---|
| `uploaded` | File received | MVP |
| `checked` | AI parsed it, fields extracted, internal consistency checked (dates, names, totals match across docs) | MVP |
| `verified` | Confirmed against a source of truth (bank/payroll API, ID vendor) | M2+ |

---

## 2. The $0 stack

| Layer | Choice | Free tier (check current limits) | Catch |
|---|---|---|---|
| App | **Next.js 16** (App Router, TypeScript, Tailwind) | n/a | n/a |
| Hosting | **Vercel Hobby** | Generous for a pilot | Hobby is for **non-commercial** use. Move to Pro (~$20/mo) or Cloudflare once we charge. |
| DB + Auth + Files | **Supabase Free** | ~500 MB Postgres, ~1 GB storage, ~50k monthly active users | Projects **pause after ~7 days idle**. No backups on Free. |
| Email (auth links) | **Resend Free** as SMTP for Supabase Auth | ~3k emails/mo | Supabase's built-in mailer is heavily rate-limited, so it's only fine for dev |
| AI | **Claude API** | Not free | Expect cents per application. Keep it behind a flag, with a per-user daily cap. Apply for startup credits. |
| Errors | Sentry Developer (free) | n/a | Scrub PII before sending |
| CI | GitHub Actions | Free minutes on private repos | n/a |
| Local dev | Supabase CLI (Docker) or plain Postgres | Free | n/a |

**Upgrade triggers:** first paying customer (Vercel Pro), first real renter data in production (Supabase Pro for backups and no pausing, ~$25/mo), or more than ~1 GB of documents.

---

## 3. Architecture

```
 Browser (renter / broker)
        │  HTTPS
        ▼
 Next.js on Vercel ─────────────────────────────────────────────┐
  • Server Components + Server Actions (all data access server-side)
  • proxy.ts: refreshes the Supabase session cookie             │
  • /api/documents/[id]/view: checks grant → logs → 60s signed URL
  • /api/ai/*: parse + summarize (server-only, rate-limited)    │
        │                         │                             │
        ▼                         ▼                             ▼
 Supabase Auth            Supabase Postgres              Supabase Storage
 (magic link)             (RLS on every table)           private bucket "documents"
                                                          path: {passport_id}/{document_id}
                                  ▲
                                  │ structured fields, flags, summaries
                           Claude API (document parsing, summaries)
```

Design rules:
1. **No client-side data access to sensitive tables.** The browser only talks to our server. RLS is the second line of defense, not the first.
2. **The service-role key never reaches the browser.** It's only used in server code for tightly scoped jobs (AI processing, retention cleanup).
3. **Documents are never public.** Each view goes through our route, which checks the share grant, writes an `access_events` row, and returns a signed URL that expires in 60 seconds, served as an attachment.
4. **Every read by a broker is logged.** The renter can see who viewed what, and when.

---

## 4. Data model

```
auth.users ─1:1─ profiles (role: renter | broker)
                    │
        ┌───────────┴─────────────┐
     renter                    broker
        │                         │
     passports 1─* documents    intake_requests (listing, rent, required docs, token)
        │            │                    │
        │         extractions (AI fields + flags per document)
        │                                 │
        └──────── shares ─────────────────┘   (passport ↔ broker grant: scope, expires_at, revoked_at)
                     │
                 access_events (append-only audit log)
                 summaries (AI applicant summary per share)
```

| Table | Key columns | Notes |
|---|---|---|
| `profiles` | `id` (= auth user), `role`, `full_name`, `brokerage_name` | Role is set once at onboarding |
| `passports` | `owner_id`, `target_rent`, `move_in_date`, `status` | One per renter for the MVP |
| `documents` | `passport_id`, `kind`, `storage_path`, `mime_type`, `size_bytes`, `status`, `redacted`, `redactions` (jsonb) | `kind` is an enum of document slots. `redactions` stores box positions only, never the hidden text |
| `extractions` | `document_id`, `model`, `fields` (jsonb), `flags` (jsonb) | Written only by the server |
| `intake_requests` | `broker_id`, `token`, `listing_address`, `monthly_rent`, `required_kinds[]`, `expires_at` | The token appears in the public URL |
| `shares` | `passport_id`, `broker_id`, `intake_request_id?`, `scope`, `expires_at`, `revoked_at` | **The access-control primitive** |
| `access_events` | `share_id`, `actor_id`, `action`, `document_id?`, `created_at` | Insert-only, never updated or deleted by users |
| `summaries` | `share_id`, `model`, `content` (jsonb) | Regenerated when documents change |

**Access rule (enforced in RLS and in server code):** a broker can read a passport and its documents only if a `shares` row exists where `broker_id = them`, `revoked_at is null`, and `expires_at > now()`.

The schema will live in `supabase/migrations/` as SQL with RLS policies.

---

## 5. Key flows

**A. Broker intake → renter share**
1. The broker creates an intake request (address, rent, required docs) and gets `/apply/{token}`.
2. The renter opens the link and signs in (magic link). They see the broker's name, the listing and the required-docs checklist.
3. The renter fills any missing slots in their passport. Docs they already have are reused.
4. The renter clicks **Share**, which creates a `shares` row (default expiry 14 days) linked to the intake request.
5. The broker's dashboard shows the applicant, and the summary is generated.

**B. Upload → AI check**
1. The client asks the server for an upload slot. The server validates kind, MIME type (PDF/JPEG/PNG/HEIC) and size (≤ 10 MB), creates a `documents` row, and returns a signed upload URL scoped to `{passport_id}/{document_id}`.
2. The client uploads straight to Storage, then the server marks the doc `uploaded` and queues parsing. The MVP does this inline in a server action; Supabase Queues or a cron job come later.
3. Parsing sends the file to Claude with a strict JSON schema per `kind` (employer, pay period, gross pay, YTD, account holder name, balances...). The result is stored in `extractions`.
4. Consistency checks are deterministic code, not AI: names match across docs, pay-stub dates are recent, the income figure is consistent, there's a flag if an SSN is still detected. That's a backstop to flow D: the document can't be shared until the renter replaces it with a redacted copy, and the original is deleted.
5. The status becomes `checked`, and the renter sees what was extracted and can correct it.

**C. Broker views a document**
`GET /api/documents/{id}/view` → load the document plus an active share for this broker → insert `access_events(view_document)` → create a signed URL (60s, `download` disposition) → redirect. With no active share the route returns 404, never 403, so it doesn't leak that the document exists.

**D. Redaction (entirely in the browser, before upload)**

The original file never leaves the renter's computer. That's the strongest privacy promise we can make: we never saw the SSN, not even briefly.

1. **Load.** pdf.js renders PDF pages to a canvas, and images load directly. Chrome can't decode HEIC, so either convert it in the browser (heic2any) or drop HEIC from the allow-list.
2. **Suggest.** pdf.js returns each word with its position on the page. Patterns flag SSNs, long account or routing numbers near labels like "acct" or "routing", and dates of birth, and pre-tick them as suggested boxes. Scans and photos have no text layer, so they get no suggestions until OCR lands.
3. **Edit.** The renter adds or removes boxes. Each box is stored as `{page, x, y, w, h, source: auto|manual}` in page-relative units. Warn when a box covers words brokers need (name, employer, pay dates, amounts).
4. **Burn in.** Render every page at about 150 DPI, fill the boxes solid black, export JPEG, and rebuild the PDF from those images with pdf-lib. The output has **no text layer and no metadata**, and re-encoding the image drops photo EXIF. Drawing boxes on top of a PDF without flattening it is not redaction, because the text underneath stays copyable.
5. **Upload the result** through flow B, with `redacted = true` and the box positions. Brokers see "Redacted in NoxFlox · N areas hidden".
6. **Test it.** CI runs fixture documents with known SSNs through the pipeline and asserts that text extraction of the output returns nothing, there's no metadata, and the pixels inside every box are black.

Trade-offs:
- **Why flatten instead of true PDF redaction:** the good free library for removing text objects (PyMuPDF/MuPDF) is AGPL-licensed, and commercial SDKs (Apryse, Nutrient) are expensive. Flattening is free, simple and hard to get wrong.
- **What it costs:** flattening throws away PDF-level forensic signals (fonts, metadata, edit history) that help spot doctored pay stubs. Mitigations: the "redacted" label, cross-document consistency checks, and bank or payroll verification (M4), which makes document forensics matter much less.
- **File size:** image-only PDFs are bigger. 150 DPI JPEG keeps a typical pay stub well under the 10 MB cap.

---

## 6. AI usage

| Task | Input | Output | Model tier |
|---|---|---|---|
| Document parsing | One document (PDF or image) | JSON fields per document kind, plus a confidence score | Small, fast model |
| Applicant summary | Extracted fields + flags (**not** the raw docs) | A one-page structured summary | Mid-tier model |
| Renter guidance (later) | The renter's own passport | Chat | Mid-tier model |

Guardrails:
- **No approve/deny, scores or rankings.** Summaries report facts and missing items only (NYC fair housing, source-of-income protections). The prompt and output schema enforce this.
- Income-to-rent ratios and date checks are computed in code, not by the model.
- Send the model as little PII as possible. The summary step never sees raw documents.
- Use an API account where inputs aren't used for training, and log the model and prompt version on every extraction.

---

## 7. Security and privacy baseline (MVP)

- **Data minimization:** no SSN, no date-of-birth field, no credit data. Renters black out sensitive details in the browser before upload (flow D), and a server-side SSN check catches anything missed.
- **Encryption:** TLS everywhere. Supabase encrypts at rest. Per-passport application-level encryption is deferred to post-pilot.
- **RLS on every table**, default deny. A CI test asserts that every table in `public` has RLS enabled.
- **Private storage bucket.** Access only through signed URLs issued by our server.
- **Uploads:** MIME allow-list, size cap, randomized storage paths, original filenames stored as metadata only. Never rendered inline on our origin. *Gap: no malware scanning on the free stack. Mitigated by the download-only disposition and file-type limits. Add scanning before scale.*
- **Sessions:** HTTP-only cookies through `@supabase/ssr`. Magic links expire quickly.
- **Audit:** `access_events` is insert-only for users. Renters can read the events on their own passport.
- **Retention:** a renter can delete their passport, which hard-deletes the files and rows. Shares auto-expire. Planned: purge documents for passports inactive for 180 days.
- **Secrets:** Vercel env vars only. `.env*` is gitignored. The service-role key is only used server-side.
- **Headers:** a strict CSP, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` on share pages.

**Legal before real renter data:** FCRA (does sharing a checked application make us a consumer reporting agency?), NY data-breach law (SHIELD Act), NYC fair-housing review of the summary content, and a privacy policy plus terms.

---

## 8. Proposed repo layout

```
noxflox-app/
├─ docs/technical-overview.md   ← this file
├─ supabase/
│  ├─ migrations/               ← SQL schema + RLS (source of truth)
│  └─ tests/                    ← RLS tests (plain SQL)
├─ src/
│  ├─ app/                      ← routes (renter, broker, apply/[token], api/)
│  ├─ lib/supabase/             ← server/browser clients
│  └─ proxy.ts                  ← session refresh (Next 16 "proxy", formerly middleware)
├─ .env.example
└─ .github/workflows/ci.yml     ← lint, typecheck, build, RLS tests
```

---

## 9. Milestones

| Milestone | Scope | Done when |
|---|---|---|
| **M0: skeleton** | Next.js + Supabase wiring, schema + RLS, magic-link auth, role onboarding, CI | A renter and a broker can sign in, and the RLS tests pass |
| **M1: core loop** | Passport + uploads, in-browser redaction (manual boxes + text-PDF suggestions), intake links, shares (expiry/revoke), broker applicant view, document viewer, access log | A broker can take a real application end-to-end with no AI |
| **M2: AI** | Parsing, consistency flags, applicant summary, renter "what's missing" | The summary is accurate on 20 sample applications |
| **M3: pilot hardening** | Retention jobs, error monitoring, security headers, legal pages, Supabase Pro, custom domain | 5 pilot brokers onboarded |
| **M4: verified** | Plaid sandbox → production, ID verification vendor, households/guarantors | The first `verified` badge goes live |

M1 before M2 is deliberate: the sharing loop is the product, and AI is the reason it impresses people.
