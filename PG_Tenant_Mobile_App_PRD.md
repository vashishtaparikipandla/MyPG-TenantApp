# PG Wonders — Tenant Mobile App — Product Requirements Document

**Version:** 0.2 (Draft for prototype build)
**Companion to:** `PG_Management_Platform_PRD.md` ("Owner PRD" — referenced below as **Owner §x**)
**Status:** Living document. This is the "other side of the coin" of the Owner PRD: every tenant action here is cross-linked to what the Owner / Manager / Staff / Admin sees or does (see §8).

**Change log — v0.2** (stakeholder decisions; these override anything older in this document)
| Decision | Change |
|---|---|
| **DEC-11** | **Stay history stays with the tenant only.** It is never shared with any hostel/owner, including new PGs. The consent toggle, sharing screen, owner-side history view, `HistoryShareConsent` entity, M-18 and D-12 are removed. |
| **DEC-12** | **Guardian details are trusted as given.** No OTP, no reply-YES handshake, no verification or "pending" state. Updates are simply pushed to the number. |
| **DEC-13** | **HRA rent statements are optional for owners** — per-property owner switch, **default OFF**. Per-payment receipts remain always available. |

**Tag legend** (same convention as the Owner PRD, plus three additions)
| Tag | Meaning |
|---|---|
| `[PLACEHOLDER]` | Needs business/finance/legal sign-off before production build. Use the stated default in the prototype. |
| `[ASSUMPTION]` | Best-guess fill-in for a gap in the brief. Confirm. |
| `[LEGAL REVIEW]` | Do not ship to production without counsel review. |
| `[NEW]` | Feature or behaviour that does **not exist in the Owner PRD** and needs a matching owner/staff/admin-side spec (collected in §17 "Deltas"). |
| `P1` / `P2` / `P3` | Phase. P1 = MVP and in the prototype. P2 = designed here, shown as "Coming soon" in the prototype. P3 = teased only. |
| `S-xx` `EC-xx` `X-xx` `N-xx` `M-xx` `G-xx` | IDs for Screens, Edge Cases, Cross-links, Notifications, Modules, Guardian templates. |
| `DEC-xx` / `D-xx` | `DEC-xx` = decision from stakeholder Q&A (§2). `D-xx` = required change (delta) to the Owner/Admin/Staff PRDs (§17). Use all IDs in build tickets. |

---

## 1. Purpose, Scope & Principles

### 1.1 Purpose
The tenant app is the **free, daily-use side** of the platform (Owner §1). It must (a) make a tenant's life in a PG easier, (b) give them a trustworthy record of everything money- and stay-related, and (c) keep a portable, tenant-owned record of their stays that stays **private to the tenant** and is never shared with PG owners (DEC-11).

### 1.2 In scope (this document)
Native mobile app (React Native / Flutter, see §16) for the **Tenant** persona in all lifecycle states: Registered → Join-requested → Invited/Pending activation → Active → Notice period → Past tenant, including the pre-stay "prospective tenant / waitlist" experience.

### 1.3 Explicitly out of scope
| Item | Why / when |
|---|---|
| Tenant web version | Later. Data model and APIs must not assume mobile-only. |
| Guardian login or guardian app | Decision DEC-05: guardians get **WhatsApp alerts only** (§9). |
| Visitor pre-approval / guest log | Decision: not now. |
| Late-entry / gate pass | Decision: not now. |
| In-app payment gateway (UPI collect, cards) | Phase 2 (Owner §18). Phase 1 = cash + owner's own UPI QR. |
| Marketplace search / browse of PGs | Phase 3. Phase 1 joins are by PG code / QR / link only. |
| Community feed | Designed in §7.23, **Phase 2**. |
| Sharing stay history with any PG owner/hostel | **Never** (DEC-11). History is tenant-private. |
| Regional languages | English only for now; all strings must be externalised (i18n-ready). |
| Manager / Staff / Sales / Owner / Admin apps | Separate PRDs. Only their *effects on the tenant* are specified here. |

### 1.4 Design principles
1. **The owner's reality comes first.** The PG owner runs a cash-heavy, trust-based business. A tenant action that claims money was paid never becomes "paid" until the owner side confirms it (or the owner logged it themselves).
2. **Never leave a tenant without a receipt or a status.** Every request (payment claim, issue, leave, deboarding, room change) has a visible status, timestamps, and a next expected step.
3. **Safety-critical paths are boring and reliable.** SOS, emergency contacts, guardian alerts: fewest taps, offline-tolerant, no cleverness.
4. **Progressive disclosure by state.** A prospective tenant sees a tiny app; an active tenant sees the full app; a past tenant sees a records-only app.
5. **Tenants only see what their role and the PG's enabled modules allow.** Nothing about other tenants, other floors' issues, or owner finances.
6. **Honest, plain language.** Particularly on money, data and guardian sharing (Owner §15).
7. **Works on a ₹8,000 Android phone on patchy WiFi.** Offline queues, small images, skeleton loaders (§12).

### 1.5 Success metrics
| Metric | Target `[PLACEHOLDER]` |
|---|---|
| Activation rate (invite → agreement signed) within 3 days | ≥ 80% |
| Weekly active tenants / active tenants | ≥ 60% |
| Rent payments with tenant-side claim/confirmation completed within 24 h | ≥ 90% |
| Issues raised in-app vs. via WhatsApp/verbal (owner-reported) | ≥ 70% |
| Median owner confirmation time for a payment claim | ≤ 12 h |
| Food opt-out usage (tenants who toggled ≥ once/week) | ≥ 35% |
| SOS false-alarm rate | ≤ 20% of triggers |
| Guardian alert delivery rate | ≥ 95% |

---

## 2. Decisions Log (from stakeholder Q&A)

| # | Decision | Impact on this PRD |
|---|---|---|
| DEC-01 | Native stack: **React Native or Flutter**. Tenant is a **separate flow, not a toggle** inside another persona. | §3.3, §16. No "demo mode" toggle in the UI; demo scenarios are driven by seeded phone numbers (§16.3). |
| DEC-02 | Prospective tenants **register in the app** and must be **approved by the PG owner** to join that PG. Discovery/search of PGs is future; sending join requests to a PG is Phase 1 by code/QR/link. | §7.1–7.4 (S-04 → S-10). |
| DEC-03 | Prospect → tenant flow is first-time-only, but a returning user must see **history of earlier stays** at platform PGs. | §7.22 Stay History. **Sharing is superseded by DEC-11: history is private to the tenant.** |
| DEC-04 | Payments are **mostly cash**. Owner can upload an **official UPI QR**; tenants pay via that QR or share it to any UPI app. No money flows through the platform. | §7.7. "I've paid" claim + owner confirmation; no gateway in P1. |
| DEC-05 | **No guardian login.** Guardians receive **WhatsApp updates** (payments and other important events). | §9 Guardian Alerts. Minor agreement handled offline/assisted (EC-L). |
| DEC-06 | Features added: **SOS** ✅, **Room-change/bed-swap** ✅, **Food feedback** ✅, **HRA rent receipts** ✅ (owner-optional, DEC-13), **Refer-a-friend** ✅, **Laundry/parcel tracking** ✅. **Rejected: Visitor pre-approval ❌, Gate pass ❌.** | SOS §7.16 · Room change §7.17 · Food feedback §7.12 · HRA §7.9 · Referral §7.20 · Laundry/parcels §7.18. All tagged `[NEW]`. |
| DEC-07 | Community = **Phase 2**. Roommate emergency contact stays Phase 1. | §7.23 (spec'd, feature-flagged off). |
| DEC-08 | **Module toggles are controlled by the company Admin, not owners.** | §4.3 Module Registry; Delta D-02. |
| DEC-09 | **English only.** | i18n-ready architecture only. |
| DEC-10 | **Persona is chosen before login** ("Continue as Tenant / Manager / Staff…"), not after. | §4.1. **Changes Owner §5.4** (which placed the picker after authentication). Delta D-01. |
| DEC-11 | **Stay history stays with the tenant only** — never shared with any hostel/owner (including new PGs). No consent toggle, no owner-side history view. | §7.22, §7.3; X-31, M-18, D-12 removed. |
| DEC-12 | **Guardian details are trusted as given** — no verification, OTP or opt-in handshake; updates are simply pushed. | §9, §7.5 step 11c, §7.24. A guardian's STOP reply is still honoured (WhatsApp platform requirement). |
| DEC-13 | **HRA rent statements are optional for owners** — per-property switch, **default OFF**. Per-payment receipts are always available. | §7.9, M-13, D-07, demo data §16.5. |

---

## 3. Tenant Personas, Lifecycle & Access by State

### 3.1 Tenant sub-personas
| Sub-persona | Description | Special handling |
|---|---|---|
| **Prospect** | Registered, not yet in any PG. May hold a join request or waitlist entry. | Minimal app (S1–S2). |
| **Invited tenant** | Onboarded by owner/manager (Owner §5.2). | Pre-filled profile; activation wizard. |
| **Active tenant** | In a bed, using the PG. | Full app. |
| **Minor tenant (<18)** | Student, guardian is legal signatory. | Age flag; mandatory guardian WhatsApp alerts; assisted agreement (EC-L). |
| **Tenant on leave** | Overlay on Active. | Food/cleaning suppressed (Owner §8, §9). |
| **Tenant in notice period** | Deboarding approved/in progress. | Most features live; room-change blocked. |
| **Past tenant** | Exited. | Records-only; may re-join. |
| **Returning / multi-PG tenant** | Has ≥1 past stay at platform PGs. | Private stay history (visible only to the tenant). |

### 3.2 Lifecycle state machine
```
[S0 Unregistered]
      │ phone OTP + basic profile
      ▼
[S1 Registered / Unaffiliated] ──── enters PG code / QR / link ───┐
      ▲                                                            ▼
      │  rejected / withdrawn / expired          [S2 Join Requested]
      │                                    (Submitted → Under review → Waitlisted)
      │                                                            │ owner approves + assigns bed
      │                                                            ▼
      │        owner-initiated onboarding (Owner §5.2) ───► [S3 Approved / Pending Activation]
      │                                                    (bed = reserved, agreement unsigned)
      │                                                            │ agreement e-signed
      │                                                            ▼
      │                                                    [S4 Active]
      │                                                            │ deboarding request approved (or owner-initiated)
      │                                                            ▼
      │                                                    [S5 Notice Period]
      │                                                            │ exit checklist + settlement complete
      │                                                            ▼
      └──────────────── re-join (request again) ◄────────── [S6 Past Tenant]
```
Overlays (not states): `On Leave`, `Minor`, `Dues Overdue`, `Temporarily Relocated`, `PG Offboarded From Platform`.

**Invariant (Owner §14.9, §14.22):** an account can hold **at most one** stay in S3/S4/S5 at any time. It may hold multiple S6 stays. It may hold up to 3 concurrent S2 requests `[PLACEHOLDER]` only while it has no S3/S4/S5 stay.

### 3.3 Feature availability by state
✅ full · 👁 view-only · ⚠ limited (see note) · ❌ hidden/blocked

| Feature (section) | S1 Registered | S2 Requested | S3 Pending activation | S4 Active | S5 Notice | S6 Past |
|---|---|---|---|---|---|---|
| Join a PG by code/QR/link (7.3) | ✅ | ✅ up to 3 | ❌ (decline invite first) | ❌ | ❌ | ✅ |
| Invite accept / decline (7.4) | ✅ if invited | ✅ | ✅ | ❌ | ❌ | ✅ if invited |
| Activation wizard (7.5) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Home dashboard (7.6) | ⚠ Prospect home | ⚠ Request tracker | ⚠ Activation checklist | ✅ | ✅ + banner | ⚠ Past summary |
| Rent & payments (7.7) | ❌ | ❌ | ⚠ move-in payment only | ✅ | ✅ | 👁 history + pay outstanding dues |
| Deposit ledger (7.8) | ❌ | ❌ | ⚠ | ✅ | ✅ | 👁 settlement |
| Receipts / HRA (7.9) | ❌ | ❌ | ⚠ | ✅ | ✅ | ✅ |
| Issues (7.10) | ❌ | ❌ | ❌ | ✅ | ✅ | 👁 history only |
| Cleaning requests (7.11) | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Food menu / opt-out / feedback (7.12) | ❌ | ❌ | 👁 sample menu | ✅ | ✅ | ❌ |
| Leave declaration (7.13) | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Notices / Inbox (7.14) | ⚠ platform only | ⚠ platform + request updates | ✅ PG welcome notices | ✅ | ✅ | ⚠ settlement-related only |
| Roommates & emergency call (7.15) | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| SOS (7.16) | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Room-change request (7.17) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Laundry & parcels (7.18) | ❌ | ❌ | ❌ | ✅ | ✅ | ⚠ parcel collection ≤ 7 days |
| PG info: WiFi, amenities, rules, contacts (7.19) | ❌ | ⚠ public preview | ⚠ preview + rules | ✅ | ✅ | ❌ |
| Refer-a-friend (7.20) | ⚠ code only | ⚠ | ❌ | ✅ | ✅ | ✅ |
| Deboarding (7.21) | ❌ | ❌ | ❌ | ✅ request | ✅ track | 👁 settlement |
| Stay history (7.22) | ✅ if any | ✅ | ✅ | ✅ | ✅ | ✅ |
| Community (7.23) `P2` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Profile, documents, settings, privacy (7.24) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Guardian updates screen (§9) | ❌ | ❌ | ✅ | ✅ | ✅ | 👁 |
| Help & support (7.24) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 4. App Structure

### 4.1 Launch, persona picker & authentication (implements DEC-10, changes Owner §5.4)

```
Splash → [First launch: 3-card intro] → PERSONA PICKER → Login (phone + OTP) → state router
```
- **S-01 Persona picker (pre-login):** tiles — **Tenant** (sub-label "Staying at a PG, or looking to join one"), Manager, Staff, Owner, Sales. Prospective tenants use the **Tenant** tile; there is no separate "prospect" persona tile `[ASSUMPTION]` because the account is the same one that later becomes a tenant. In this prototype only **Tenant** is live; other tiles open a bottom sheet "This role isn't part of this build."
- The last chosen persona is remembered on the device. The login screen shows "Not a tenant? **Change role**". The role can also be changed from **More → Log out**, which returns to the picker. There is **no in-session role switching** and no post-login "Continue as…" picker.
- **Server-side role check (security):** picking a persona does not grant access. After OTP, the backend verifies the phone/identity holds that persona. If not → EC-A5.
- One person holding multiple personas (tenant + staff elsewhere) logs in separately for each, each with its own session, notification settings and data (satisfies Owner §5.4's "no bleed-through").
- **S-02 Login:** phone number (+91 default, country picker `[ASSUMPTION]` hidden in P1) → OTP (6 digits, auto-read on Android, 30 s resend timer, max 5 attempts then 15-min lock `[PLACEHOLDER]`). No passwords in P1 `[ASSUMPTION: overrides Owner §5.2 step 8 "credentials or magic link" — tenants use OTP + optional app lock; simpler, and avoids password resets]`.
- **S-03 App lock (optional):** biometric/PIN prompt on cold start and after 5 min in background.
- **State router (after successful login):** routes by state — no profile → S-04 registration; S1 → Prospect home; S2 → request tracker; invited/S3 → invite/activation; S4/S5 → Home; S6 → Past home. If the user has both an S6 stay and an S2 request, the S2 request tracker is shown as a banner on the Past home.

### 4.2 Navigation (S4/S5)
Bottom tabs (max 5): **Home · Rent · Food · Services · More**. Header on every screen: PG name (tap = PG info), **Inbox bell** (Notices + Updates), and **SOS** (Home only, guarded, see 7.16).
- **Services hub:** Raise issue · Request cleaning · Laundry · Parcels · Room change · Declare leave.
- **More:** Notices · Roommates · PG info (WiFi, amenities, rules, contacts) · Refer & earn · Stay history · Documents · Guardian updates · Profile · Help · Settings · Community `P2`.
- If the **Food** module is disabled for the property, the tab is removed (4 tabs).
- S1/S2/S3/S6 use a simplified single-stack layout, no bottom tabs.

### 4.3 Module Registry — **controlled by company Admin, not owners** (DEC-08)
Owners configure *content and operational settings* (menu, cutoff times within limits, QR, notices, staff). The **Admin** decides *which modules exist* for a property or account (by plan, pilot, or policy). The owner sees enabled modules read-only and can request a change via Support `[ASSUMPTION]`.

| ID | Module | Default (P1) | Admin toggle scope | Owner-side dependency | If disabled mid-use |
|---|---|---|---|---|---|
| M-01 | Home, Notices/Inbox, Profile, Help | Always on (non-toggleable) | — | — | — |
| M-02 | Rent & Payments (ledger, claims, receipts) | Always on | — | Payment mode config (Owner §11) | — |
| M-03 | Issues | Always on | — | Issue queue (Owner §10) | — |
| M-04 | Deboarding | Always on | — | Exit flow (Owner §13) | — |
| M-05 | Food (menu, opt-out, feedback) | On | Property | Menu builder, cutoffs (Owner §9) | Hide tab; in-flight opt-outs void; history retained |
| M-06 | Cleaning requests | On | Property | Housekeeping staff exist | In-flight requests complete; entry hidden |
| M-07 | Leave declaration | On | Property | — (but affects M-05/M-06 suppression) | Existing leaves retained, no new ones |
| M-08 | Roommate emergency contact | On | Property | Telephony masking vendor | Hide; SOS unaffected |
| M-09 | SOS | On | Property | Escalation contacts configured | Cannot be disabled while any tenant is active `[ASSUMPTION: safety]` |
| M-10 | Room-change / bed-swap `[NEW]` | On | Property | Owner room-change queue (D-08) | In-flight requests complete |
| M-11 | Laundry `[NEW]` | Off unless PG offers laundry | Property | Laundry staff/vendor | In-flight orders complete |
| M-12 | Parcels `[NEW]` | Off unless PG has reception/security | Property | Security/reception staff | Uncollected parcels stay visible |
| M-13 | HRA statement `[NEW]` | Available, but **owner switch default OFF** (DEC-13) | Admin (account) + **per-property owner opt-in** | Owner PAN on file (Owner §5.1) | Hide statement generator; per-payment receipts always stay |
| M-14 | Refer-a-friend `[NEW]` | Off until reward policy decided | Property | Owner waitlist queue | Existing referrals honoured |
| M-15 | Food feedback `[NEW]` | On (with M-05) | Property | Owner feedback report | Hide prompts |
| M-16 | Guardian WhatsApp alerts | On (mandatory for minors) | Platform | WhatsApp Business account | Blocked for minors: cannot disable |
| M-17 | Community `P2` | Off | Property | Moderation queue | Hide; posts retained |
| M-18 | ~~Stay history sharing~~ **Removed (DEC-11)** | — | — | — | — |
| M-19 | Marketplace / Explore `P3` | Off | Platform | — | — |

Prototype implements this as a `modules.config.ts` per property (no UI toggle in the tenant app — DEC-01).

### 4.4 Global UI patterns
- **Status chips (consistent everywhere):** grey = pending/neutral, blue = in progress, amber = needs attention / awaiting someone, green = done/paid, red = overdue/rejected/blocked.
- **Banner priority on Home (only top 2 shown, rest under "More alerts"):** (1) PG offboarded from platform · (2) SOS active · (3) Document rejected / activation blocked · (4) Rent overdue · (5) Payment awaiting confirmation · (6) Notice-period countdown · (7) Agreement/house-rules update needs acknowledgement · (8) Owner subscription lapsed — *no tenant-facing messaging unless a feature is impacted* (Owner §14.18).
- **Confirmation rules:** destructive/irreversible actions (deboarding, cancel leave, delete account, SOS cancel) use a confirm dialog with consequences in one sentence. Reversible actions (food toggle) are optimistic with undo toast.
- **Idempotency:** every submit (payment claim, issue, request) carries a client-generated request ID so double-taps and offline replays never create duplicates.
- **Timestamps:** all cutoffs/timers use **server time (IST)**; device clock is never trusted for cutoff logic (EC-D3).
- **Loading/empty/error:** skeleton loaders; every list has an empty state with a next action; every error has a human message + retry; see §11.2.
- **Tone:** friendly, short, no jargon. Example: "Your rent is paid. Receipt #R-2410-118 is ready."

---

## 5. Roles, Visibility & Data-Exposure Rules

### 5.1 What a tenant can see about other people and things
| Subject | Tenant can see | Tenant cannot see |
|---|---|---|
| Self | Everything in own profile, ledger, documents, issues, requests, guardian message log | Internal owner notes/flags about them (e.g., "absconded" flag, private owner remarks) — see EC-J9 for disputes |
| Roommates (same room) | First name, optional photo, in-app **masked** emergency call button | Phone number, ID, DOB, payment status, food/leave status, medical info, occupation (unless Community P2 opt-in) |
| Same-floor tenants | First name + masked emergency call (Owner §8: "same-room / same-floor") `[ASSUMPTION: floor-level list collapsed by default]` | Everything else |
| Other tenants (PG-wide) | Nothing in P1. Community P2: display name + optional photo only | Anything else |
| Manager | Name, role, photo, on-duty status, masked call / in-app "call manager" | Personal number unless owner enables direct dial `[PLACEHOLDER]` |
| Staff (cook, cleaner, electrician, plumber, helper, security) | Name, role, photo **only when assigned to the tenant's request**, or on the "Who's who" list if owner enables | Phone, salary, schedule, attendance |
| Owner | Business/PG name, verified badge, contact route configured by owner | Personal data beyond what owner publishes |
| Common-area issues | Count of "others also reported" (no names) `[ASSUMPTION]` | Other tenants' issue details |
| Occupancy / finances | Nothing | All |

### 5.2 What owner-side roles see about the tenant (transparency principle)
Tenants can see exactly what is shared through **Profile → Privacy → "Who can see my data"** (read-only explainer, built from this table). Owner/Manager: profile, ID docs, ledger, issues, leave, food status, room history, guardian contact. Staff: name, room, and only the fields needed for the task (e.g., cleaner sees room + slot + "do not disturb", never ID/payments). Admin/Support: audit-logged access only (Owner §16.2). Sales: **none** (Owner §6).

### 5.3 Data-minimisation rules
1. Aadhaar: store only what is legally permitted; display masked (XXXX-XXXX-1234); no full-number export. `[LEGAL REVIEW]`
2. ID document images are viewable by the tenant only inside the app with screenshot blocking on Android (`FLAG_SECURE`) and blur in app-switcher.
3. Medical info is optional, tenant-disclosed, and shown to owner/manager **only inside an SOS event** or on tenant profile with a visible "medical note" flag; never sent to guardian WhatsApp.
4. Location is requested only for SOS (optional) — never continuously.
5. **Stay history is private (DEC-11):** a PG owner/manager only ever sees records of stays at *their own* PG. Nothing from other PGs — stays, dues, exit type, ratings — is shown to them in join requests, invites or anywhere else.

---

## 6. Notifications Matrix

Channels: **Push** (default), **In-app inbox**, **SMS** (fallback for critical when push undeliverable/app not installed), **WhatsApp→Guardian** (see §9), **Email** (agreements/receipts copy).
Quiet hours default 10 pm–7 am `[PLACEHOLDER]`: non-critical push is held until morning. Critical (🔴) ignores quiet hours and cannot be muted.

| ID | Event | Tenant push | SMS fallback | Guardian WA | Owner-side trigger |
|---|---|---|---|---|---|
| N-01 | Join request approved / waitlisted / rejected | ✅ | ✅ | ❌ | Owner acts on join request |
| N-02 | Invite received (owner-initiated onboarding) | ✅ | ✅ (primary, contains link) | ❌ | Owner §5.2 step 8 |
| N-03 | Activation reminder (day 1, 3, 6) | ✅ | day 3 | ❌ | Auto |
| N-04 | Agreement signed (copy) | ✅ + email | ❌ | ✅ minors | Tenant e-sign |
| N-05 | Rent due soon (T-3, T-1), due today | ✅ | ❌ | ✅ T-2 (if guardian scope ≥ payments) | Auto per owner grace config |
| N-06 | Rent overdue (D+1, D+3, D+7) 🔴 from D+3 | ✅ | ✅ D+3 | ✅ D+3 | Auto |
| N-07 | Payment claim submitted (ack) | in-app | ❌ | ❌ | Tenant |
| N-08 | Payment confirmed → receipt ready | ✅ | ❌ | ✅ | Owner confirms / logs |
| N-09 | Payment claim rejected / mismatch | ✅ | ❌ | ❌ | Owner rejects |
| N-10 | New charge / late-fee / rent change added | ✅ | ❌ | ❌ | Owner adds ledger line |
| N-11 | Issue status changes (assigned, in progress, resolved, escalated) | ✅ | ❌ | ❌ | Staff/Manager |
| N-12 | Issue resolved — confirm within N days | ✅ D+1, D+2 | ❌ | ❌ | Auto |
| N-13 | Cleaning scheduled / done / missed | ✅ | ❌ | ❌ | Housekeeping |
| N-14 | Menu published / today's meal changed / mess closed | ✅ (batched) | ❌ | ❌ | Owner/cook |
| N-15 | Meal cutoff in 30 min (only if not yet toggled and setting on) | ✅ opt-in | ❌ | ❌ | Auto |
| N-16 | Rate your meal (post-meal prompt) | ✅ max 1/day | ❌ | ❌ | Auto |
| N-17 | Notice (normal) | ✅ | ❌ | ❌ | Owner/Manager broadcast |
| N-18 | Notice (urgent) 🔴 | ✅ + full-screen | ✅ | ❌ | Owner/Manager |
| N-19 | Leave recorded / long-leave flagged | in-app | ❌ | ✅ leave ≥ 7 days | Tenant |
| N-20 | Room-change offer / decision / scheduled | ✅ | ❌ | ✅ on completion | Owner |
| N-21 | Temporary relocation notice 🔴 | ✅ | ✅ | ❌ | Owner (maintenance) |
| N-22 | Parcel received / uncollected reminder | ✅ | ❌ | ❌ | Security |
| N-23 | Laundry picked up / ready | ✅ | ❌ | ❌ | Laundry staff |
| N-24 | Deboarding: approved / countered / rejected / checklist / settlement / refund | ✅ | ✅ (settlement) | ✅ approved & completed | Owner |
| N-25 | Owner-initiated deboarding 🔴 | ✅ | ✅ | ✅ | Owner |
| N-26 | SOS raised (confirmation to tenant) 🔴 | ✅ | — | ✅ (if scope allows) | Tenant |
| N-27 | SOS acknowledged by staff 🔴 | ✅ | — | ✅ | Manager/security |
| N-28 | Document verified / rejected | ✅ | ❌ | ❌ | Owner |
| N-29 | House rules / agreement updated (ack needed) | ✅ | ❌ | ❌ | Owner |
| N-30 | PG leaving platform / subscription-related PG change 🔴 | ✅ | ✅ | ❌ | Owner cancels (Owner §14.19) |
| N-31 | Referral: friend joined / reward credited | ✅ | ❌ | ❌ | Owner/System |
| N-32 | WiFi password changed | ✅ | ❌ | ❌ | Owner |

Preferences (Settings → Notifications): per-category toggles for non-critical events; quiet-hours editor; "Meal cutoff reminders" toggle.

---

## 7. Screen-by-Screen Flows

Format per feature: **Purpose → Screens → Logic/rules → States → Owner-side link → Edge-case refs.** "Owner-side link" is summarised again in §8.

### 7.1 Registration & basic profile (S-04) — P1
**Purpose:** create the account for a person with no PG yet (prospect) or complete the profile of an invited tenant.
**Steps (progress saved after each; resumable):**
1. **You:** full name (2–60 chars, letters/spaces/.'-), date of birth (date picker; age ≥ 16 `[PLACEHOLDER/LEGAL REVIEW]`), gender (Male / Female / Other / Prefer not to say), profile photo (camera or gallery, cropped square; basic quality check `[ASSUMPTION: P2 face detection]`).
2. **About you:** occupation (Student / Working / Other), college or employer name, hometown, food preference (Veg / Non-veg / Egg / Vegan), email (optional, verified by link `[ASSUMPTION]`).
3. **Health (optional):** medical conditions/allergies relevant to emergencies — clear note on who can see it (§5.3).
4. **Consent:** Terms + Privacy Policy (two unticked checkboxes); marketing messages opt-in separate and off by default.
**Logic:** DOB → age <18 sets the `minor` flag immediately (drives guardian rules, §9, EC-L). Phone is read-only (verified at login). Fields that the owner pre-filled during owner-initiated onboarding (Owner §5.2 steps 2–6) appear **pre-populated**; identity fields (name, DOB, ID number, gender) are locked and changeable only via **"Request correction"** (→ owner approval, EC-B5).
**Owner-side link:** profile appears on owner's Tenant record; when created via join request it becomes the join-request card (X-02).

### 7.2 Prospect home (S-05) — P1
Cards: **Join a PG** (enter code / scan QR), **My requests** (status chips), **My stay history** (if any), **How it works** (3 steps), **Explore PGs near you** (disabled, "Coming soon" — Phase 3 teaser, DEC-02), **Refer & earn** (if M-14). Empty state: illustration + "Ask your PG owner for their PG Wonders code."

### 7.3 Join a PG — code / QR / link (S-06 → S-09) — P1
**S-06 Enter code:** 6-character PG code (case-insensitive), **Scan QR** (owner's poster/QR), or open a **deep link** (`pgwonders.app/j/<code>`) shared by owner on WhatsApp. If the app isn't installed → store page, then deferred deep link restores the code after install/login `[ASSUMPTION]`.
**S-07 PG preview:** photo carousel, PG name, area + landmark (full address after approval `[ASSUMPTION]`), category, gender policy, amenities, room types with price ranges, house-rules summary, food included?, **availability hint** (Beds available / Limited / Waitlist only — owner-controlled, may be hidden), owner **verification badge** (Owner §5.1 states). CTA: **Request to join**.
**S-08 Request form:** room-type preference (multi-select from PG's types), preferred move-in date (today → +90 days), note to owner (≤ 300 chars), contact-sharing consent (name, phone, photo, occupation shared with owner), optional ID upload now ("you can add later"). Minor → banner "Guardian details will be required at onboarding". The request never includes stay history from other PGs (DEC-11).
**Pre-submit validations:** gender policy vs profile gender (block with kind message; "Other/Prefer not to say" → allowed, owner decides `[ASSUMPTION]`); already in S3/S4/S5 (block, EC-O1); ≥ 3 open requests (block); duplicate open request to same PG (block, show existing); cooldown after rejection (7 days `[PLACEHOLDER]`); PG paused/suspended/left platform (EC-O5).
**S-09 Request tracker (timeline):**
| Status | Tenant sees | Actions |
|---|---|---|
| Submitted | "Sent to Sunrise PG on 12 Oct" | Withdraw · Remind owner (once after 48 h) |
| Under review | "Owner is reviewing" | Withdraw |
| **Approved** | "Approved! The owner is finalising your bed and rent. You'll get an offer shortly." | Message owner |
| **Waitlisted** | "No bed right now. You're on the waitlist" (+ position if owner enables) | Withdraw · "Still interested?" prompt at day 25; auto-expires day 30 `[PLACEHOLDER]` |
| Rejected | Owner's canned reason (No vacancy / Doesn't match PG policy / Other + optional note) | Request again after cooldown · Try another code |
| Expired | Owner didn't respond in 7 days `[PLACEHOLDER]` | Re-send request |
| Withdrawn | — | Re-request |
**Owner-side link:** new **Join Requests queue** `[NEW → D-04]` with Approve & Onboard (launches Owner §5.2 prefilled) / Waitlist / Reject; referral tag if referred (X-03).

### 7.4 Owner-initiated invite (S-10) — P1
**Trigger:** owner/manager onboards a tenant (Owner §5.2 step 8) — SMS + link. Bed is set to **`reserved`** `[NEW → D-05]`.
1. Tenant opens link → app → persona picker (Tenant) → OTP login. If the number has no account, registration (7.1) opens with owner-entered data pre-filled.
2. **Identity check on invite (EC-A9):** "This invite is for **A\*\*\*\*a**. Confirm your date of birth" — 3 attempts, then invite is locked and owner is told the phone may be wrong. Prevents leaking a stranger's stay details if the owner mistyped a number.
3. **Offer card:** PG, bed (Tower/Floor/Room/Bed), room type, monthly rent, deposit, rent due day, move-in date, notice period, invite validity (7 days `[PLACEHOLDER]`).
4. **Actions:** Accept & continue → activation (7.5) · Decline (reason list) → bed returns to `vacant` and owner notified · Ask a question (single in-app thread with owner/manager).
**States:** expired (ask owner to resend), revoked by owner ("This invite is no longer valid"), already accepted on another device, account already in another active stay (block: EC-O1).

### 7.5 Activation wizard (S-11a–f) — P1
Runs in S3. Resumable; a checklist card on Home tracks progress. Owner sees "Pending activation" tag with step-level progress (Owner §5.2 edge case).
| Step | Content | Rules |
|---|---|---|
| 11a Review stay | Rent, deposit, due day, move-in, bed, notice period, house rules | "Something looks wrong" → message owner (rent/bed/dates disputes must be fixed by owner before signing) |
| 11b Profile & ID | Confirm pre-filled profile; upload ID front/back (Aadhaar/Passport/DL) if not already uploaded | Status: uploaded → under review → verified → rejected (reason + re-upload). **Signing is not blocked by pending verification** `[ASSUMPTION, mirrors Owner §5.1]`; owner may enforce otherwise |
| 11c Emergency & guardian | Emergency contact (name, relationship, phone, address) — **mandatory, not skippable** (Owner §5.2 step 4). **Guardian updates on WhatsApp:** number + relationship (mandatory for minors; strongly encouraged for adults) + tenant checkbox "I agree PG Wonders may send updates to this number" | **No guardian verification or opt-in handshake (DEC-12):** the number is taken as given (format check only) and updates are simply pushed. Wizard never waits on the guardian. Adult tenants pick scope (§9.3) |
| 11d Agreement | In-app PDF viewer (must scroll to end to enable Sign); e-sign = draw signature + OTP consent `[PLACEHOLDER: e-sign provider; IT Act validity — LEGAL REVIEW]`. **Minors:** no in-app signing by tenant; owner uploads guardian-signed agreement (wet signature); tenant sees "Signed by guardian (uploaded by PG)" `[LEGAL REVIEW]` | "I don't agree" → message to owner; stays S3. Signed copy is emailed and stored in Documents |
| 11e Set up | Notification permission, optional app lock (biometric), camera/gallery permission explainer | Skippable |
| 11f Welcome | Room summary, WiFi details, house rules acknowledgement, today's menu | Lands on Home |
**Move-in payment:** checklist item on Home ("Pay deposit ₹17,000 + first rent ₹8,500"), paid via QR/cash (7.7). It does **not** block activation `[ASSUMPTION]`; owner controls key handover offline.
**Activation → Active:** agreement signed ⇒ tenant status `Active`; the bed flips `reserved → occupied` when the owner marks move-in/onboarding complete (Owner §5.2 step 9). If the tenant never activates: reminders N-03; owner can manage manually; after invite expiry the bed auto-releases (owner-configurable).

### 7.6 Home dashboard (S-12) — P1 (S4/S5)
**Header:** PG name · Inbox bell (badge) · SOS (guarded — 7.16).
**Cards (top → bottom):**
1. **Banners** (priority order in §4.4).
2. **Rent card:** amount due, due date, status chip (Upcoming / Due today / Overdue / Awaiting confirmation / Paid), CTAs **Pay** and **I paid cash** (§7.7). "Paid ✓ Receipt" when settled.
3. **Today's menu:** lunch & dinner rows with Available/Not-available toggles and cutoff countdown (7.12). Hidden if M-05 off.
4. **My room:** Tower · Floor · Room · Bed, roommates count, "Temporarily relocated" tag if applicable.
5. **In progress:** open issues, cleaning slot, laundry, parcel awaiting collection — max 3 rows + "See all".
6. **Notices:** latest 2 (pinned first).
7. **Quick actions grid:** Raise issue · Cleaning · Leave · Laundry · WiFi · Contacts.
**Leave overlay:** if on leave, a green "You're on leave until 12 Oct — I'm back early" strip replaces the menu card.
**Pull-to-refresh**; last-synced timestamp when offline.

### 7.7 Rent & Payments (S-13 → S-20) — P1 (implements DEC-04)

**Core rule:** platform never holds money. The tenant either (a) pays cash and declares it, or (b) pays the owner's own UPI account via the owner's QR. **Nothing turns "Paid" until the owner side confirms or the owner logs it.** This preserves the optional-digital-trail promise of Owner §15.1.

**Property payment modes (owner-configured, Owner §11):**
| Mode | Tenant sees | Phase |
|---|---|---|
| Cash only | "I paid cash" | P1 |
| Cash + Owner UPI QR (`[NEW → D-06]` owner uploads QR + UPI ID + payee name) | "Pay via UPI" + "I paid cash" | P1 |
| In-app gateway | "Pay now" | P2 (not built) |

**S-13 Rent tab:** current-cycle card (amount, breakdown, due date, grace-until date, status), **ledger** list (all cycles, newest first), filters (All / Due / Paid / Disputed), Deposit card (7.8), Receipts shortcut (7.9).
**Ledger line types:** Rent · Security deposit · Add-on charge (late fee, damage, laundry, other — owner-added with note) · Credit/adjustment (pro-rata, referral credit, waiver) · Refund.
**Invoice/line statuses:** Upcoming · Due · Overdue · Partially paid · **Awaiting confirmation** · Paid · Waived · Disputed.
**Pro-rata display (Owner §14.7):** mid-month move-in/out shows the calculation ("₹8,500 × 17/31 = ₹4,662") with rounding rule `[PLACEHOLDER: round to nearest ₹1]`.
**Rent change notice:** if the owner changes rent, tenant gets N-10 and must **acknowledge** ("Rent changes from ₹8,500 to ₹9,000 from 1 Jan"); unacknowledged changes still apply per agreement terms `[LEGAL REVIEW]`.

**S-14 Pay via UPI QR**
1. Screen shows: owner-uploaded **official QR** (large, high-contrast, brightness-boost prompt), payee name, UPI ID (copy), **amount to pay** (default = outstanding; editable for partial **only if owner allows partials** `[ASSUMPTION: default allowed]`), reference note (auto: `Rent Oct – Rm 204B – Karthik`).
2. Actions:
   - **Pay with UPI app** — opens system UPI intent/deep link with prefilled `pa, pn, am, tn` (Android chooser; iOS shows installed-app buttons for GPay/PhonePe/Paytm/BHIM). If the QR is a static merchant QR that rejects prefilled amounts, fall back to *scan-from-gallery* guidance (EC-C4).
   - **Share QR** — native share sheet (WhatsApp, Messages, Gmail…) so tenant or guardian can open it in any UPI app; also **Save to gallery** and **Copy UPI ID**.
3. Trust copy (always visible): "This pays your PG owner directly. PG Wonders does not hold your money."
4. On return to the app (app-resume after leaving to a UPI app), auto-open **S-15 Confirm payment** — the app **cannot know** whether the UPI transaction succeeded, so it never assumes.

**S-15 Confirm payment ("I've paid")**
Fields: amount (prefilled), paid on (date-time, ≤ now, ≥ 30 days ago), **payer** (Myself / Guardian / Other), **UTR / transaction ID** (12-digit numeric for UPI RRN; format-validated), **screenshot** (JPG/PNG ≤ 5 MB, compressed client-side) — **at least one of UTR or screenshot required** `[PLACEHOLDER: owner-configurable strictness]`, note (optional).
→ creates **Payment claim** (status *Awaiting confirmation*), shown on Home and Rent with an "owner will confirm" message and the submitted evidence.
- **Owner confirms** → *Paid*, receipt generated (7.9), N-08 (+ guardian WA).
- **Owner confirms different amount** → line becomes *Partially paid* with a system note "Owner recorded ₹6,000 of ₹8,500" and remaining balance stays *Due*.
- **Owner rejects ("payment not found")** → reason shown; tenant may **Resubmit with new proof** or **Raise a dispute** (comment thread, visible to owner and escalatable to Support — Owner §14.8). Claims are never auto-deleted.
- **Owner doesn't respond in 48 h** → tenant sees "Still waiting — Remind owner" (once), then "Ask PG Wonders Support" `[ASSUMPTION]`; Admin sees ageing claims (Owner §16.1).
- **Duplicate UTR** already used on another claim (any tenant of the same owner) → blocked with "This transaction ID was already submitted" (EC-C6).

**S-16 I paid cash**
Fields: amount, date, **paid to** (Owner / Manager <name> / Other), optional photo of handwritten receipt/handover. → claim *Awaiting confirmation*. If the **owner or manager logs the cash directly** (Owner §11, §15.1), the tenant sees it as *Paid* instantly with "Recorded by Manager Ravi on 5 Oct". If the recorded amount ≠ tenant's belief → **Report a mismatch** (dispute thread).

**S-17 Payment detail & dispute thread:** timeline (submitted → confirmed/rejected), evidence, receipt, comments (tenant ↔ owner/manager; Support joins on escalation), attachment support. Closing a dispute needs both sides or Admin resolution (Owner §16.1).

**S-18 Move-in payment (S3):** same flows scoped to deposit + first rent.
**S-19 Guardian-paid rent:** tenant taps **Share QR with guardian** (share sheet) → guardian pays → tenant (or owner) records with payer = Guardian → guardian gets confirmation on WhatsApp (§9).
**S-20 Payment reminders:** schedule from N-05/N-06 respecting owner's grace period; reminders stop the moment a claim is awaiting confirmation.

**Errors specific to payments:** see EC-C1 → EC-C18.

### 7.8 Security deposit ledger (S-21) — P1
Distinct card (Owner §11): **Paid ₹17,000 · Held** → at exit: Deductions (line items with reason, amount, optional photo) → Refundable balance → Refund status (Initiated → Paid with mode/ref/date). Tenant can **Accept** or **Dispute** deductions during settlement (7.21). Deposit line is visible in S4, S5, S6.

### 7.9 Receipts, invoices & HRA statement (S-22, S-23) — P1 `[NEW]` for HRA (owner-optional, DEC-13)
- **Receipt (per confirmed payment):** PDF with receipt no., PG name/address, owner name, tenant name, room/bed, period, amount, mode, reference, paid-on, "Confirmed by owner / Recorded by <role>". Actions: **Download, Share (WhatsApp/email), Print**. Available offline once downloaded.
- **Invoice (per due line):** viewable before payment.
- **HRA rent statement (S-23):** choose Financial Year (Apr–Mar) → generates a consolidated statement + monthly receipts bundle (PDF) for **confirmed** payments only. Shows landlord name and **landlord PAN** — required when annual rent exceeds ₹1,00,000 `[LEGAL/TAX REVIEW]`. If owner PAN is missing → "Your PG owner hasn't added a PAN yet. Ask them" with a **Request PAN** button (notifies owner). **HRA statements are optional for owners and OFF by default (DEC-13).** While off, the HRA card shows "Your PG hasn't enabled rent statements for HRA yet" with an **Ask my PG to enable** button (one request per 30 days; owner is notified). Per-payment receipts (above) are **always** available regardless of this switch.
- **Decision (DEC-13):** the consolidated HRA statement is an **owner opt-in per property, default OFF**, because it creates a formal rent trail some owners are wary of (Owner §15). Owner-side switch, PAN capture and honest privacy copy are specified in Delta D-07.
- Receipt numbering: `R-<YYMM>-<seq>` per property; immutable once generated; a correction issues a **credit note**, never an edit.

### 7.10 Issues (S-24 → S-28) — P1 (Owner §8, §10)
**S-24 Issue list:** open / resolved tabs, status chips, SLA "expected by".
**S-25 Raise issue:**
1. **Category** (Owner §8): Electrical · Plumbing · Cleaning · WiFi · Furniture · Other; optional sub-issue chips per category (e.g., Plumbing → No water · Leaking tap · Blocked drain · Geyser); **Location:** My room (default) / Common area (floor, area picker).
2. **Photos** (0–4; camera/gallery; compressed to ≤ 1 MB each). **Video/voice note** `P2`.
3. **Description** (10–500 chars; required unless sub-issue chip selected).
4. **Access:** "OK to enter when I'm away" toggle + preferred time window.
5. **Urgency:** auto-derived priority from category/sub-issue (Owner §10: no water/electricity = High) shown as a chip; tenant may tick "This is urgent" (owner can override).
6. **Duplicate check:** if an open issue in the same category + location exists → "You already have an open request. Add details to it instead?"; common-area: "**3 others** reported this" → **Me too** (adds count, no new ticket) `[ASSUMPTION]`.
7. Submit → **New**; drafts auto-saved; offline submit queued (§12).
**S-26 Issue detail:** timeline — New → Assigned (assignee first name, role, photo; masked call button `[ASSUMPTION]`) → In progress → **Resolved** (resolution note + optional photo) → tenant **Confirm resolved** or **Reopen** (reason mandatory, ≤ 2 reopens then auto-escalates to Manager→Owner→Support, Owner §10) → **Closed** (auto after 3 days with no reopen `[PLACEHOLDER]`). Comments thread with staff/manager. **SLA timer** + "Escalated to Manager" indicator. **Cancel** allowed only while *New*.
**S-27 Rate resolution** (1–5 stars + optional comment) after confirming; feeds Support's churn-risk view (Owner §10) `[ASSUMPTION]`.
**S-28 WiFi shortcut:** "WiFi not working" from WiFi screen pre-fills an issue.
**Owner-side link:** Kanban queue New → Assigned → In Progress → Resolved → Reopened (Owner §7); assignee sees the tenant's first name, room, photos, access permission.

### 7.11 Room cleaning requests (S-29, S-30) — P1
Distinct lightweight flow (Owner §8): **Next scheduled cleaning** card (owner's housekeeping frequency) with **Skip this time** · **Request a clean:** date (today → +7), slot (Morning / Afternoon / Evening — from owner-defined housekeeping slots), type (Regular · Deep clean · Bathroom only `[ASSUMPTION]`), "Do not disturb / enter while I'm away" toggle.
**Statuses:** Requested → Scheduled → Done (staff marks) → auto-confirmed after 24 h or tenant taps *Not done properly* (reopens as an Issue with category Cleaning). **Missed** by staff → auto-reschedule prompt.
**Rules:** dates inside a declared leave are disabled ("You're on leave", Owner §8); quota of free requests per week `[PLACEHOLDER]` with charge line if exceeded and owner enables; same-slot conflicts resolved by owner-side capacity.
**Owner/staff link:** housekeeping staff gets a task with room, slot, DND flag.

### 7.12 Food (S-31 → S-36) — P1 (Owner §9, DEC-06 food feedback)
**S-31 Menu:** Today / Week views; slots **Breakfast · Lunch · Snacks · Dinner**; each dish tagged Veg / Non-veg / Egg / Jain; filter by the tenant's food preference (default on). Empty state: "Menu not published yet". "Mess closed" days (owner-marked) grey out with reason.
**S-32 Opt-out/opt-in (Lunch & Dinner only in P1 — Owner §8):**
- Default state = **Available** for every meal (opt-out model, Owner §9.4).
- Toggle per meal for **today → +7 days**. Bulk actions: "Skip all dinners this week", "Skip weekends".
- **Cutoff** per meal (default lunch 10:00, dinner 18:00 `[PLACEHOLDER]`, owner-editable within Admin-defined limits). Countdown shown ("Lunch locks in 1 h 12 m"). **After cutoff the toggle is hard-disabled** with a lock icon and "Locked — you're counted for lunch" (Owner §14.11), not just warned.
- **Leave wins:** during declared leave, meals are auto "Not available" and toggles disabled (Owner §14.12).
- Owner-side headcount locks at cutoff and shows "Today's Lunch: 42" to Manager/Cook (Owner §9.5).
- **Rent is unaffected by opt-outs in V1** `[ASSUMPTION]`; copy on screen: "Skipping helps the kitchen plan and reduces waste."
- **Optimistic UI with Undo (10 s)**; server is the source of truth, and a rejection reverts the toggle with an explanation (EC-D2, EC-D3).
**S-33 Menu change alert:** if owner edits a published meal after tenants opted in, tenant gets N-14 with old → new dish and, if before cutoff, a one-tap "Change my choice".
**S-34 Meal feedback (`[NEW]`, M-15):** 45 min after a meal ends, for meals the tenant was counted for: emoji rating (1–5) + tags (Taste · Quantity · Hygiene · Freshness · Timing) + comment (≤ 200) + optional photo. Max 1 prompt/day; dismissible; editable for 24 h. Owner sees aggregated by dish/meal/week; the **cook sees anonymised** feedback `[ASSUMPTION]`.
**S-35 Special diet note (`P2`)**, **S-36 Guest meals — out of scope** (visitor feature rejected).

### 7.13 Leave declaration (S-37, S-38) — P1 (Owner §8, §9.6)
**Create leave:** start date (today → +60 days), end date (≥ start), expected return time (optional), reason (optional, private-to-owner), **effects preview:** "6 lunches & 6 dinners removed · cleaning requests paused · Owner & Manager notified · Guardian notified (leave ≥ 7 days)".
**Rules:** no past dates; overlapping/adjacent leaves are merged after confirmation; leave starting today after a meal's cutoff does not remove that meal; leave > 30 days is flagged to the owner for review `[ASSUMPTION]` and does not change rent unless owner policy says so; leave can span the notice period.
**Edit/cancel:** cancel future portion; **"I'm back early"** ends leave from the next meal whose cutoff hasn't passed; edits re-run the effects preview.
**Owner-side link:** roster shows "On leave" (Owner §7); food headcount excludes tenant; Manager sees return date. **Not** visible to roommates.

### 7.14 Notices & Inbox (S-39 → S-41) — P1 (Owner §7 broadcast)
**Bell → Inbox** with two tabs: **Notices** (owner/manager/platform broadcasts) and **Updates** (system notifications: payments, issues, requests).
**Notices list:** filters All · Unread · Important · Pinned; categories General · Maintenance · Rules · Event · Rent · Emergency. Badges: Normal / Important / **Urgent** (Urgent shows a full-screen interrupt card once, with sound if allowed).
**Notice detail:** title, body, attachments (image/PDF), sender (Owner/Manager/Platform), posted/scheduled time, **"Acknowledge"** button when the sender required it (tenant sees "The owner will see you've read this" if read receipts are on, Owner §7).
**Rules:** tenant only receives notices targeting their property/tower/floor; edited notices show "Edited"; retracted notices show "Withdrawn by sender"; scheduled notices appear only at send time; expired notices move to Archive; search by keyword.
**Platform notices (Admin):** shown with a "PG Wonders" badge, visible even to S1/S6.

### 7.15 Roommates & emergency contacts (S-42, S-43) — P1 (Owner §8)
**S-42 Roommates:** list of same-room tenants (first name, optional photo) + "Same floor" (collapsed). Each row has **Emergency call** (in-app relay; real numbers are never exposed to either party). UI copy frames it strictly as emergency use.
**Rules:** relay via masked telephony `[PLACEHOLDER: vendor, e.g. Exotel/Twilio]`; callee sees "PG Wonders emergency call from <first name>"; **rate limit** 3 calls/hour per pair `[ASSUMPTION]`; call metadata logged and available to owner/Admin on complaint; consent is part of the Terms accepted at registration — tenants can hide their photo but **cannot opt out of receiving emergency calls** (safety) `[ASSUMPTION]`; abuse → **Report** → owner/Admin review, repeat abuse restricts the feature for the abuser.
**New/departing roommate:** N-notice "A new roommate joins on 3 Oct" (name shown only after they activate); departing roommates disappear from the list on exit.
**S-43 Emergency contacts (PG + public):** Manager on duty (masked call), Warden, Security, Owner (if owner allows), **108 Ambulance · 112 Police · 101 Fire** quick-dial, nearest hospital (owner-configured `[ASSUMPTION]`). Numbers work offline (cached).

### 7.16 SOS (S-44, S-45) — P1 `[NEW]` (DEC-06)
**Trigger (S-44):** persistent SOS button on Home header and lock-screen-style widget `[P2]`. **Press-and-hold 3 seconds** with haptic and ring animation to prevent accidental triggers. Then a **5-second cancel countdown** ("Sending SOS… Cancel").
**Type (optional, auto-default in 10 s):** Medical · Safety threat · Fire · Other — default "Emergency".
**On send:** alert to **Manager on duty + Security/Warden + Owner (per owner config)** with tenant name, photo, room/bed, type, time, optional location (if permission granted), and **medical note** (if tenant disclosed one). If the tenant has consented, **guardian/emergency contact gets a WhatsApp** (§9). App shows a "Call 112" button in parallel.
**S-45 SOS status screen:** Sent → **Acknowledged by <name>** ("Ravi is on the way") → Resolved. Escalation if not acknowledged in 2 min → next contact in the owner-defined chain → Owner → Admin/Support `[PLACEHOLDER: timings]`. Tenant can tap **"I'm safe"** to close; if cancelled during the 5-s window nothing is sent; if closed after send, flagged as *false alarm/resolved by tenant* (no guardian follow-up spam).
**Offline:** if no data, show "No internet. Calling 112 / Manager" one-tap options; on Android, attempt SMS fallback to configured numbers (permission needed); alert is queued and retried; **never silently fail** (EC-H1).
**Abuse controls:** > 3 false alarms in 30 days → owner sees a pattern flag (not auto-blocked). **Legal copy:** "SOS informs your PG team and contacts. It is not a replacement for emergency services." `[LEGAL REVIEW]`
**Owner/staff link:** SOS appears as a red, top-pinned item on Manager/Security apps and owner dashboard; every alert has an audit trail (who saw/acked/when).

### 7.17 Room-change / bed-swap request (S-46 → S-49) — P1 `[NEW]`
**Types:** Change bed (same room) · Change room · Change room type (upgrade/downgrade with rent difference) · **Swap with a roommate/tenant (mutual consent)**.
**S-46 Request:** reason (Roommate issue · Maintenance · Upgrade · Downgrade · Noise/light · Personal · Other), preferences (room type, floor, AC/non-AC, budget), preferred date, for **swap** the partner is selected from same-room/floor list and must **accept in their own app** (partner sees requester's first name only). Roommate complaints are **confidential** — never shown to the roommate.
**S-47 Status:** Requested → Under review → **Offered** (specific bed/room, rent difference, effective date, deposit adjustment) → Tenant **Accepts / Declines / Asks** → Scheduled → Completed (owner performs relocation; addendum e-signed) → ledger adjusts (pro-rata). Also Rejected (reason) · Withdrawn · Expired (offer valid 48 h `[PLACEHOLDER]`).
**Eligibility rules `[PLACEHOLDER]`:** not in notice period; not within first 30 days of move-in; no overdue dues (owner-configurable); one open request at a time.
**S-48 Owner-initiated relocation** (e.g., bed under maintenance while occupied, Owner §14.4; capacity reduction, Owner §14.3): tenant sees **"Temporary relocation"** or **"Permanent relocation"** card with new bed, dates, reason, and **Ask a question** — the tenant can't refuse maintenance moves but can request a different option; permanent moves require acknowledgement + addendum e-sign. N-21 is critical.
**S-49 Post-move:** food/cleaning/issue routing updates automatically; roommates list refreshes; old roommates get a neutral "Your roommate changed rooms" only when relevant.
**Owner-side link:** new Room-change queue with capacity-aware suggestions `[NEW → D-08]`.

### 7.18 Laundry & parcels (S-50 → S-55) — P1 `[NEW]` (M-11, M-12)
**Laundry (S-50, S-51):** shows PG laundry schedule (Owner §8 amenities). **Schedule pickup:** slot, mode (item-count or "bag"), items by category (shirts, pants, innerwear, bedsheets…), optional photo, bag/tag number (auto-generated). Statuses: Requested → **Picked up** (staff records count; tenant **confirms count** in app or auto-confirm after 12 h) → In process → Ready → Delivered/Collected → *Confirmed*. Charges (per item/plan) appear as ledger add-on lines. **Missing/damaged item** → raises an Issue (category Laundry) with the order attached. Not schedulable during declared leave.
**Parcels (S-52, S-53):** security/reception logs a parcel with courier, photo, and the tenant. Tenant gets N-22; statuses: **Received at gate → Collected** (tenant shows a **4-digit hand-over code**; staff enters it to mark collected) → Uncollected reminders at 24 h and 72 h → **Returned/Held** after 7 days `[PLACEHOLDER]`. Tenant actions: **Not mine** (wrong tenant), **Ask to hold**, **Report missing**. No parcel contents/sender details are displayed beyond courier and label name. COD parcels: PG policy `[PLACEHOLDER]`. **Expect a parcel (pre-alert)** — `P2`.
**Owner/staff link:** laundry staff task list; security "Parcels" log; owner sees weekly volume and disputes.

### 7.19 PG info (S-56 → S-60) — P1 (Owner §8)
- **WiFi (S-56):** SSID + password visible without raising a request; **Copy** and **"Join via QR"** (WiFi QR generated on device); multiple networks (per tower/floor) with the tenant's own auto-selected first; "Updated on 3 Oct"; password change triggers N-32; **"WiFi not working"** → issue prefill.
- **Amenities (S-57):** gym/laundry/parking/study room etc., with timings and rules, pulled from owner's amenities config (Owner §5.1 step 5). Parking shows availability info only in P1 (no slot booking).
- **House rules (S-58):** versioned; when the owner updates → N-29 and an **acknowledge** prompt; acknowledgement date shown.
- **Contacts (S-59):** see 7.15. **Who's who (S-60):** Manager, warden, staff roles on duty (names/roles only), if owner enables.

### 7.20 Refer-a-friend (S-61, S-62) — P1 `[NEW]` (M-14)
**Flow:** tenant taps **Refer & earn** → gets a personal referral link/code tied to **their PG's code** → **Share** via WhatsApp/any app (**no contact-book access**) → friend installs, registers, requests to join that PG → lands in owner's Join Requests queue tagged **"Referred by Karthik"** (X-03).
**Referral tracker (S-62):** Invited → Registered → Requested → Joined → **Reward credited**.
**Reward `[PLACEHOLDER]`:** e.g., ₹500 rent credit after the friend completes 30 days (funded by owner or platform? undecided); appears as a **Credit** line in the ledger.
**Anti-abuse:** no self-referral (same phone/device/ID doc/guardian number); max 10 active referrals `[ASSUMPTION]`; reward only if the referred friend is a genuinely new-to-PG-Wonders account; owner can reject an ineligible referral; Admin can audit.
**Cross-PG:** referral to *another* PG (Phase 3 marketplace) is out of scope.

### 7.21 Deboarding / exit (S-63 → S-70) — P1 (Owner §13)
**S-63 Request to move out:** intended move-out date (picker enforces **minimum notice** from agreement: "Earliest date without penalty: 14 Nov"), reason (Job change · College ended · Relocating · Cost · Issues with PG · Other), **PG feedback** (rating + would-you-recommend + comment; private to owner+Admin), **forwarding address**, **deposit-refund details** (UPI ID or bank account; validated format; penny-drop `P2`), **expected-dues summary** (rent to date, pro-rata, deposit, known charges).
**S-64 Status timeline:** Submitted → Under review → **Approved** (date confirmed or adjusted) / **Countered** (owner proposes another date with reason → tenant Accept / Dispute) / **Rejected** (reason; discuss) → **Notice period** (banner: "23 days to move-out", S5) → **Exit checklist** → **Settlement** → **Completed (S6)**.
**S-65 Exit checklist (tenant view of the owner-configured list, Owner §13.3):** room/bed condition check (owner proposes slot, tenant confirms/reschedules) · key/access-card return · dues settlement · deposit deduction entries · final invoice · feedback. Each item: Pending / Done / Needs attention, with who marked it.
**S-66 Settlement statement:** itemised — deposit held, deductions (reason + photo + amount), unpaid rent/charges, credits, **net refundable / payable**. Tenant **Accepts** or **Disputes** a line (comment thread → owner → Support). Payable balances can be paid via 7.7.
**S-67 Refund tracker:** Initiated → Paid (mode, reference, date) → Completed; if mode is cash, tenant confirms receipt in-app.
**S-68 Withdraw request:** allowed until the owner approves; after approval only the owner can cancel (tenant asks). **S-69 Owner-initiated deboarding** (non-payment, rule violation; Owner §13.1): tenant sees the reason category, effective date and **Dispute** option (escalates to Support); N-25 critical.
**S-70 Completion:** live features (food, issues, cleaning, SOS, roommates) are **revoked**; ledger, receipts, agreement, settlement, documents remain (Owner §13.4); Past-tenant home appears; **"Rate your stay"** (once, within 30 days) `[ASSUMPTION]`; "Find/join another PG" CTA.
**Guardian:** approval and completion are sent on WhatsApp (§9).

### 7.22 Stay history & "returning tenant" (S-71, S-72) — P1 (DEC-03)
**S-71 My stays:** timeline of all platform stays (PG name, area, dates, room type, exit type: *Completed* / *Ended by PG*), documents per stay (agreement, receipts, settlement), on-time-payment summary **for the tenant's own eyes**.
**S-72 Privacy of history (DEC-11):** stay history is **visible only to the tenant**. It is never shown to any PG owner or manager, never attached to join requests or invites, and there is no consent toggle. The screen carries a small note: "Only you can see your stay history." A PG owner sees only the records of stays at *their own* PG (which they hold as ordinary tenant records — Owner §13.4).
**Rules:** history from a PG that left the platform (Owner §14.19) remains visible with a "PG no longer on PG Wonders" tag and downloads remain available for 12 months `[PLACEHOLDER]`; past tenants can **Rejoin** the same PG via a shortcut (sent as a normal join request — no history is attached); an owner-side flagged exit shows the neutral label "Ended by PG" to the tenant with a **Contest** link to Support (EC-J9).

### 7.23 Community (S-73 → S-76) — **Phase 2** (DEC-07; M-17 off by default)
Designed now, not built in the prototype (shown as "Coming soon" card in More).
- **Scope:** PG-wide feed + optional floor channels. **Text + photo posts** (≤ 500 chars, ≤ 3 photos); categories General · Events · Lost & Found · Help; comments (1 level), reactions; **no DMs** (Owner §8 assumption).
- **Identity:** first name + photo (opt-in), no anonymous posting `[ASSUMPTION]`.
- **Moderation:** Report; owner/manager can hide/delete/pin, mute a user for N days; profanity/contact-number filter blocks phone numbers and links `[ASSUMPTION]`; post states Published · Held (auto-filter) · Removed (reason shown); appeals → Support.
- **Limits:** 5 posts/day, 30 comments/day; cooldown on repeated reports.
- **Notifications:** off by default except replies/mentions and pinned owner posts.
- **Visibility:** S4/S5 only; posts removed from the tenant's view on exit; retained by PG for moderation window `[PLACEHOLDER]`.
- **Owner side:** moderation queue, pinned posts, community health metric.

### 7.24 Profile, documents, settings, privacy & help (S-77 → S-88) — P1
- **S-77 Profile:** view/edit. *Free-edit:* photo, email, occupation, institution/employer, hometown, food preference, medical note. *Free-edit with owner notification (no OTP/verification, DEC-12):* emergency contact, guardian number (owner is notified — safety-critical). *Locked (request correction → owner approval):* legal name, DOB, gender, ID numbers.
- **S-78 Phone-number change:** OTP to old (if reachable) and new number; conflicts → Support; owner notified; guardian not affected.
- **S-79 Documents:** ID, agreement versions, addenda, settlement — status chips (Uploaded · Under review · Verified · Rejected + reason), view/download (watermarked "For <PG>" `[ASSUMPTION]`), replace → re-verification; expiry reminders for time-bound docs (Passport/DL).
- **S-80 Settings:** notifications (§6), quiet hours, app lock, **Logout** (returns to persona picker), logged-in devices `[P2]`, app version. **No language selector in P1** (DEC-09).
- **S-81 Privacy centre (Owner §15):** "Who can see my data" explainer (§5.2), **Download my data** (export ZIP link within 24 h, emailed), **Delete my account** request (rules below), consent history (terms, guardian updates), marketing opt-in.
- **Account deletion rules (Owner §15.3):** blocked while in S3/S4/S5 ("Complete your move-out first"); with outstanding dues → warns; for S1/S6, **soft-delete + anonymise** within 30 days `[PLACEHOLDER]`; financial records retained (anonymised) for the legal window `[LEGAL REVIEW]`; PG-side records referencing the tenant show "Deleted user".
- **S-82 Guardian updates:** see §9.4.
- **S-83 Help & support:** FAQ; **Contact my PG** (Manager/Owner thread); **Contact PG Wonders Support** for disputes/escalations (tickets, Owner §16.2); report a problem with the app.
- **S-84 About / Legal:** terms, privacy, licences.
- **S-85 Feedback on the app** (in-app rating prompt after positive events, max 1/60 days).
- **S-86 Force-update & maintenance screens** (§11.1).
- **S-87 "PG left the platform" screen** (Owner §14.19): shown when owner cancels — explains what stops working, what stays (ledger, documents), and how to export. **S-88 Account suspended screen** (Admin action, Owner §16.1).

---

## 8. Tenant ↔ Owner Cross-Link Table ("the other side of the coin")

Read as: *tenant does X → owner/staff/admin sees Y → mapped to Owner §Z.* Use this as the integration contract for the prototype's simulation engine (§16.4) and for the real backend.

| ID | Tenant action / event (screen) | Owner / Manager / Staff / Admin side effect | Owner PRD ref | State / data change |
|---|---|---|---|---|
| X-01 | Registers, verifies OTP (S-02/04) | Nothing visible until a join request or invite; Admin sees new-user count | §5.2 | User created (S1) |
| X-02 | Submits join request (S-08) | Appears in **Join Requests queue** with profile, room-type pref, referral tag, ID (if uploaded) `[NEW]` | new; §5.2 | JoinRequest = Submitted |
| X-03 | Referred friend requests to join (S-62) | Queue card tagged "Referred by <tenant>" | new | Referral = Requested |
| X-04 | Owner approves + onboards (owner action) | Owner §5.2 wizard prefilled; bed → `reserved`; tenant gets invite | §5.2, §4 | JoinRequest = Approved; Stay = Invited (S3) |
| X-05 | Tenant accepts invite (S-10) | Onboarding card → "Accepted — pending activation" | §5.2 | Stay = Pending activation |
| X-06 | Tenant declines invite | Bed → `vacant`; owner notified with reason | §5.2 | Stay cancelled |
| X-07 | Uploads ID docs (11b) | Doc review queue with approve/reject + reason | §5.1 (verification states), §5.2 step 3 | Doc = under review |
| X-08 | Enters emergency/guardian details (11c) | Visible on Tenant record; guardian WhatsApp delivery status shown (no verification step) | §5.2 step 4 | Guardian = Active |
| X-09 | E-signs agreement (11d) | "Agreement signed" on tenant card; countersign flow | §5.2 step 7 | Stay = Active; bed → `occupied` on owner move-in |
| X-10 | "I've paid via UPI" claim (S-15) | **Payment claim** card: amount, UTR, screenshot; Confirm / Partial / Reject with reason | §11 | Claim = Awaiting confirmation |
| X-11 | "I paid cash" claim (S-16) | Same card; owner confirms or logs | §11, §15.1 | Claim = Awaiting confirmation |
| X-12 | Owner logs cash/UPI (owner action) | Tenant sees Paid + receipt instantly | §11 | Ledger line = Paid |
| X-13 | Disputes a charge/deduction (S-17, S-66) | Dispute thread on invoice/exit record; escalate to Support | §14.8, §16.1 | Line = Disputed |
| X-14 | Requests HRA statement (S-23) | Owner PAN request if missing; if HRA is off, an "Enable HRA statements?" request; count of statements generated | §5.1, §11 | — |
| X-15 | Raises issue (S-25) | Kanban **New**; auto priority; assign to staff | §10, §7 | Issue = New |
| X-16 | Confirms/reopens issue (S-26) | Status → Closed/Reopened; SLA timer resets; escalation chain | §10 | Issue state change |
| X-17 | Requests cleaning (S-30) | Housekeeping task with slot/DND | §8 | Cleaning = Requested |
| X-18 | Toggles lunch/dinner (S-32) | Live headcount for Manager/Cook; locks at cutoff | §9 | MealOptState |
| X-19 | Submits meal feedback (S-34) | Feedback report by dish/meal; cook sees anonymised | new | MealFeedback |
| X-20 | Declares leave (S-37) | Roster "On leave"; headcount & cleaning suppressed; owner/manager notified; guardian ≥ 7 d | §8, §9.6 | Leave |
| X-21 | Reads/acknowledges notice (S-40) | Read/ack receipts on broadcast | §7 | NoticeAck |
| X-22 | Emergency-calls roommate (S-42) | Call metadata logged (available on complaint) | §8 | CallLog |
| X-23 | Triggers SOS (S-44) | Red alert to Manager/Security/Owner; escalation chain; guardian WA | new | SOSEvent |
| X-24 | Requests room change / swap (S-46) | Room-change queue; offer creation; swap partner consent | §14.3, §14.4, new | RoomChange |
| X-25 | Owner relocates tenant (owner action) | Tenant relocation card; food/cleaning routing updates | §14.4 | Relocation |
| X-26 | Schedules laundry (S-50) | Laundry staff task list | §8 (amenities), new | LaundryOrder |
| X-27 | Parcel collected via code (S-53) | Security marks collected | new | Parcel |
| X-28 | Requests to move out (S-63) | Deboarding review → approve/counter/reject; exit checklist | §13 | Deboarding = Submitted |
| X-29 | Accepts/disputes settlement (S-66) | Deposit ledger finalised or dispute opened | §11, §13.3 | Settlement |
| X-30 | Exit completed (S-70) | Bed → `vacant`; tenant → Past; features revoked | §13.4 | Stay = Ended |
| X-31 | ~~Shares stay history to a PG~~ — **removed (DEC-11)** | None. No owner-side view of other-PG history exists | — | — |
| X-32 | Edits profile field (S-77) | Change log on Tenant record; locked fields → correction request | §7 | ProfileChange |
| X-33 | Requests deletion/export (S-81) | Support ticket; owner informed of anonymisation on past records | §15.3 | PrivacyRequest |
| X-34 | Contacts PG Wonders Support (S-83) | Support queue with tenant/PG context (audit-logged) | §16.2 | Ticket |
| **Reverse links (owner → tenant)** | | | | |
| X-35 | Owner adds charge/late fee/rent change | Tenant N-10 + acknowledgement | §11 | Ledger line |
| X-36 | Owner publishes/edit menu, marks mess closed | Tenant menu & N-14; toggles disabled | §9 | Menu |
| X-37 | Owner broadcasts notice (audience: property/tower/floor) | Tenant Inbox + push; ack if required | §7 | Notice |
| X-38 | Owner changes WiFi | Tenant N-32 | §8 | WiFi |
| X-39 | Owner initiates deboarding / force-deboards | Tenant S-69 / Past; guardian WA | §13, §14.10 | Stay ended |
| X-40 | Owner subscription soft-lock | **No tenant feature loss** (rent, issues stay live); tenant sees nothing | §14.18 | — |
| X-41 | Owner cancels subscription | Tenant S-87 "PG left platform"; export window | §14.19 | Property inactive |
| X-42 | Admin toggles a module (Admin console) | Tenant entry points appear/disappear; in-flight items finish | §16.1 + D-02 | ModuleFlag |
| X-43 | Support corrects data (audit-logged) | Tenant sees corrected values + "Updated by PG Wonders Support" note on affected item | §16.2, §14.21 | AuditLog |
| X-44 | Manager removed / staff reassigned | Open issues reassigned; tenant sees new assignee | §14.13 | Assignment |
| X-45 | Owner uploads/changes UPI QR | Tenant sees new QR; in-flight claims keep the QR snapshot used | §11 + D-06 | PaymentConfig |

---

## 9. Guardian WhatsApp Alerts (implements DEC-05)

Guardians **do not log in and there is no guardian app.** They receive templated **WhatsApp Business** messages triggered by system events. This is one-way communication with a stop/opt-out.

### 9.1 Setup & consent (DEC-12 — no verification)
1. Guardian number is captured in activation step 11c (or by the owner in Owner §5.2 step 4). **The number is trusted as given** — no OTP, no reply-YES handshake, no validation beyond format (10-digit Indian mobile).
2. Consent is the **tenant's** (checkbox in 11c) and, for minors, part of the agreement terms. `[LEGAL REVIEW — confirm this satisfies WhatsApp Business opt-in policy and DPDP for a third-party recipient; if counsel requires guardian-side opt-in later, re-add it behind a config flag]`.
3. On first save, one **informational** message is sent: "Karthik has added you to receive updates about his stay at Sunrise PG (rent, safety). Reply STOP to unsubscribe." After that, updates are simply pushed — nothing is held, queued or gated.
4. Status shown to tenant/owner: **Active → Unsubscribed (guardian replied STOP) → Failed (number not on WhatsApp)**. There is no "pending" state.

### 9.2 Events and templates
| # | Trigger | Template summary (English) | Frequency / timing | Default scope |
|---|---|---|---|---|
| G-01 | Guardian added (informational) | Welcome + what you'll receive + STOP | Once, on first save | All |
| G-02 | Rent due reminder | "Rent ₹8,500 for Oct due on 5 Oct" | T-2 days | Payments |
| G-03 | Payment confirmed | "₹8,500 rent for Oct received on 4 Oct. Receipt: <short link>" (link expires 7 days) | On confirmation | Payments |
| G-04 | Rent overdue | "Rent for Oct is pending (due 5 Oct)" — factual, non-shaming | D+3 and D+10 | Payments |
| G-05 | Deposit paid / refund initiated | Amount + status | On event | Payments |
| G-06 | Agreement signed (minors) | Copy link | On event | Minor: always |
| G-07 | Extended leave | "Karthik has declared leave 10–20 Oct" | Leave ≥ 7 days | Stay updates |
| G-08 | Room change completed | New room/floor (no reasons) | On event | Stay updates |
| G-09 | Deboarding approved / completed / owner-initiated | Dates + status | On event | Stay updates |
| G-10 | **SOS raised / acknowledged** | "Karthik triggered an SOS at 11:42 pm. Sunrise PG manager Ravi has acknowledged." + PG manager number | Immediately; ack update | Emergency (always on) |
| G-11 | Owner-flagged important notice (disciplinary/safety) "Share with guardian" `[NEW]` | Short neutral summary | Manual by owner | Stay updates |
| G-12 | Weekly digest (Sun 6 pm) `[ASSUMPTION, optional]` | Rent status, leave status, any open critical item | Weekly | Stay updates |

**Never shared with guardians:** food choices, issue details, feedback, community, roommate info, location (except inside an SOS if tenant consented), medical notes, ID documents, private owner remarks.

### 9.3 Scope rules
| Tenant type | Rule |
|---|---|
| **Minor (<18)** | Guardian alerts **mandatory** (all categories, cannot be reduced). Emergency contact must be a guardian. Tenant sees the setting locked with the reason "Required for tenants under 18". |
| **Adult** | Default: all categories. Tenant may choose **Payments + Emergency** or **Emergency only** `[PLACEHOLDER: product/legal decision on adult consent]`. Owner cannot override an adult's choice. |
| **Turning 18** (DOB) | On 18th birthday: prompt tenant to review guardian scope; agreement re-confirmation prompt per legal advice `[LEGAL REVIEW]`; alerts continue until the tenant changes scope. |

### 9.4 Guardian updates screen (S-82)
Shows: guardian name + masked number (+91 ••••• 43210), relationship, delivery status, scope selector (per 9.3), **message log (last 30 days):** template name, sent time, delivery status (Sent/Delivered/Read/Failed) — but **not** message bodies containing amounts beyond what the tenant already sees. Actions: **Change guardian number** (tenant edits directly — no OTP or verification; owner is notified), **Pause non-critical alerts for 7 days** (adults only).

### 9.5 Failure & abuse handling
| Case | Behaviour |
|---|---|
| Number not on WhatsApp / undelivered | Status = Failed; SMS fallback for G-10 and G-03/G-04 only `[ASSUMPTION]`; tenant + owner told "Guardian can't receive WhatsApp — update the number" |
| Guardian replies STOP | Status = Unsubscribed; honoured (platform requirement); tenant and owner notified. For **minors**, owner is prompted for an alternative guardian number. No further messages go to that number |
| Guardian replies with messages | Auto-reply: "This number can't receive replies. Contact Sunrise PG at <manager number>." |
| Wrong number (message reaches stranger) | Stranger can STOP; mismatch report path via Support; PII in templates kept minimal (first name, amounts only) |
| Cost | WhatsApp per-message cost is bundled in owner subscription `[PLACEHOLDER]` |
| Rate cap | Max 3 non-critical messages/day per guardian; critical messages exempt |

---

## 10. Edge Cases & Error Scenarios (build checklist)

Format: **ID — scenario → required behaviour.** Cross-refs to Owner §14 where they overlap.

### A. Login, identity & account
- **EC-A1 — OTP not received** → "Resend in 30 s"; after 3 resends offer "Call me with OTP" `[P2]`; after 5 wrong attempts lock 15 min with countdown.
- **EC-A2 — OTP expired (10 min)** → clear message, request new.
- **EC-A3 — Phone number changed / recycled** (new person has an old tenant's number) → login shows the stay data of the previous owner of the number. Mitigation: device binding + new-device verification via DOB check + owner-side "Reset tenant login" and Support can force re-verification.
- **EC-A4 — New device login** → require OTP + DOB confirmation; old device stays valid for 7 days or until logout `[ASSUMPTION]`.
- **EC-A5 — Persona mismatch** (picked Tenant but the number is only a Staff/Manager account) → "This number isn't registered as a tenant. Register as a tenant, or change role." Never reveal that another role exists (avoid enumeration).
- **EC-A6 — Number holds Tenant profile + Staff profile elsewhere** → sessions fully separate per persona (Owner §5.4); logging out of one doesn't affect the other.
- **EC-A7 — Session expiry** → silent refresh; if refresh fails, re-login with unsaved drafts preserved.
- **EC-A8 — Force update required** → blocking screen S-86 with store link; queued offline actions preserved.
- **EC-A9 — Owner typed the wrong phone number** → the invite would reach a stranger. The DOB check on the invite (7.4) blocks disclosure beyond first-letter-masked name; after 3 failed DOB attempts, invite locks and owner is notified "Invite may have gone to the wrong number — edit and resend".
- **EC-A10 — Duplicate identity** (same ID number / DOB+name on two accounts, or one person on two numbers) → flagged to Support (never auto-merged); tenant cannot self-merge; owner sees "possible duplicate".
- **EC-A11 — Suspended account** (Admin action, Owner §16.1) → S-88 with reason category and Support link; data retained.
- **EC-A12 — Deep link opened while logged in as another persona** → prompts "Switch to Tenant? You'll be logged out of Manager."
- **EC-A13 — Under-age registration** (< 16) → block with friendly message; no data stored beyond phone hash `[LEGAL REVIEW]`.

### B. Onboarding & activation
- **EC-B1 — Tenant never activates** → reminders N-03; "Pending activation" tag for owner; owner may proceed manually (Owner §5.2). After invite expiry bed auto-releases if owner enabled.
- **EC-B2 — Tenant declines to e-sign** → "I don't agree" → owner message; no data deletion; stays S3 until owner acts.
- **EC-B3 — Owner edits stay terms after tenant viewed but before signing** → tenant must re-review; sign button disabled with "Terms changed — review" and diff highlight.
- **EC-B4 — Owner edits terms *after* signing** → creates **addendum** requiring tenant e-sign; unsigned addendum shows in Home banner; original stays valid.
- **EC-B5 — Tenant spots a wrong locked field** (name/DOB/ID) → **Request correction** with proof photo → owner approves/rejects; audit trail; Support can override (Owner §14.21).
- **EC-B6 — Document rejected** → reason + guidance ("Photo was blurry"), re-upload; N-28; doesn't block use unless owner enforces.
- **EC-B7 — Camera/gallery permission denied** → in-app explainer with "Open settings"; alternative "Upload later" or "Ask manager to scan it".
- **EC-B8 — Large / wrong-format upload** → client-side compress; unsupported formats (HEIC handled/converted); > 10 MB rejected with guidance.
- **EC-B9 — Upload interrupted** → resumable upload; draft retained.
- **EC-B10 — Guardian number = tenant's own number** → blocked. **Guardian number equals another tenant's** → allowed (siblings) but flagged softly.
- **EC-B11 — Bed no longer available at accept time** (owner reassigned) → "This offer is no longer valid" + message owner (server-side check at accept).
- **EC-B12 — Two owners invite the same person simultaneously** → tenant sees both invites; accepting one auto-declines/locks the other with owner notified (single-stay invariant).
- **EC-B13 — Move-in date passed while pending** → banner "Your move-in date was 10 Oct — confirm a new date with the owner"; owner can extend.
- **EC-B14 — Minor's agreement** → tenant cannot self-sign; assisted path: owner uploads guardian-signed agreement; tenant sees status; activation continues without tenant e-sign `[LEGAL REVIEW]`.
- **EC-B15 — Time gap between join-approved and invite** (owner slow) → tracker shows "Waiting for owner to finalise your bed"; nudge after 3 days.

### C. Payments & ledger
- **EC-C1 — Owner has no QR configured but mode says UPI** → hide UPI method, show cash only, owner alerted on their dashboard.
- **EC-C2 — QR image unreadable/low-res** → tenant "Report QR problem" → owner notified; fallback shows UPI ID text.
- **EC-C3 — UPI app not installed / intent fails** → fallback to Share QR/Save QR + instructions.
- **EC-C4 — Static QR rejects prefilled amount** → app detects return without proof and shows "Couldn't open the payment? Save the QR and pay from your UPI app's scan-from-gallery."
- **EC-C5 — Payment failed/pending at bank (money debited, UTR pending)** → allow claim with "pending at bank" flag; owner sees flag; auto-reminder for confirmation after 24 h.
- **EC-C6 — Duplicate UTR** → block; if it matches the tenant's own earlier claim, link to it instead.
- **EC-C7 — Wrong amount paid** (over/under) → owner records actual; overpayment becomes a **credit** applied to next cycle (or refund per owner); underpayment leaves balance due.
- **EC-C8 — Claim submitted for an already-Paid line** → blocked with "Already paid" + receipt link.
- **EC-C9 — Claim rejected but tenant insists** → dispute thread → Support (Owner §14.8).
- **EC-C10 — Owner confirms a claim after the tenant edited/withdrew it** → claims are immutable once submitted; withdrawal allowed only before owner action; otherwise raise dispute.
- **EC-C11 — Owner logs cash payment for the wrong tenant** → tenant "Not me" report → owner corrects via audited reversal (credit note); Support can intervene.
- **EC-C12 — Rent changed while a claim is in flight** → claim keeps the invoice amount snapshot; difference shown as new due line.
- **EC-C13 — Grace period & late fee** → reminders respect grace; late fee only appears when the **owner** adds a line (Owner §11); tenant sees a reason and can dispute.
- **EC-C14 — Proof screenshot contains sensitive info** → note in UI "You can crop out other details"; in-app crop tool.
- **EC-C15 — Time-zone/date issues on "paid on"** → all in IST; future dates blocked; > 30 days old requires a note.
- **EC-C16 — Tenant pays after cycle closed / after exit** → allowed for outstanding dues; receipt marks "Paid after exit".
- **EC-C17 — Guardian paid but tenant didn't tell** → owner logs with payer = Guardian; tenant sees "Paid by guardian".
- **EC-C18 — Refund to tenant fails** (invalid UPI/bank) → "Refund couldn't be sent — update details"; details editable once; owner notified.
- **EC-C19 — HRA statement with gaps/unconfirmed months** → statement lists only confirmed months and flags gaps ("No confirmed payment for Aug") rather than fabricating.
- **EC-C20 — Partial payment disabled by owner but tenant enters less** → inline validation "This PG accepts full payment only".
- **EC-C21 — Receipt PDF generation failure** → retry; fallback "Receipt will be emailed"; never block the paid status.
- **EC-C22 — Owner changes QR after tenant scanned** → claim stores the QR snapshot; mismatch flagged to owner if payee differs.

### D. Food
- **EC-D1 — Menu missing/partially published** → show published days; "Menu coming soon" for others; toggles disabled for meals without a menu `[ASSUMPTION]`.
- **EC-D2 — Toggle rejected by server (cutoff passed)** → revert, toast "Cutoff passed at 10:00 — you're counted for lunch"; notification if it happened from an offline queue.
- **EC-D3 — Device clock wrong/tampered** → cutoffs use server time; offline toggles are accepted only if made before cutoff per a trusted local timestamp (last server sync + monotonic clock, ±5 min tolerance) `[ASSUMPTION]`; otherwise rejected on sync with notice.
- **EC-D4 — Owner changes cutoff mid-day** → applies from next unlocked meal; already-locked meals stay locked.
- **EC-D5 — Owner edits menu after opt-ins** → N-14; option to change choice if before cutoff.
- **EC-D6 — Mess closed/festival** → toggles disabled with reason; auto-suppressed count.
- **EC-D7 — Toggle during leave** → disabled, tooltip "You're on leave until 12 Oct" (Owner §14.12).
- **EC-D8 — Food module off for property** → no Food tab; no food notifications; opt-out data retained.
- **EC-D9 — Tenant food preference vs menu** → non-matching dishes de-emphasised, never hidden without a "Show all" link.
- **EC-D10 — Feedback for a meal the tenant skipped** → blocked (only counted meals).
- **EC-D11 — Feedback abuse / profanity** → filtered; owner-only visibility of tenant identity.
- **EC-D12 — Tenant ate but opted out (or vice-versa)** → out of app scope; owner handles manually.

### E. Issues, cleaning, laundry, parcels
- **EC-E1 — Duplicate issue** → nudge to add to existing (7.10).
- **EC-E2 — No staff of that type configured** → issue routes to Manager; tenant sees "Assigned to Manager".
- **EC-E3 — Assignee removed mid-way** (Owner §14.13) → auto-reassign notice; tenant sees new assignee; timeline preserved.
- **EC-E4 — Tenant not available when staff comes** → staff marks "Could not access"; tenant gets prompt to pick a new window; SLA paused.
- **EC-E5 — Tenant says resolved but staff marked unresolved** → tenant confirmation drives closure; owner can reopen with note.
- **EC-E6 — Photo upload fails/offline** → issue is created with text, photos upload in the background with retry indicator.
- **EC-E7 — Safety issue (fire hazard, exposed wiring) selected as low priority** → keyword/sub-issue based auto-upgrade `[ASSUMPTION]`; prompt "Is anyone in danger? Use SOS".
- **EC-E8 — Issue about Manager/Owner** (sensitive) → "Report to PG Wonders Support" path that bypasses the owner queue `[ASSUMPTION]`.
- **EC-E9 — Cleaning slot full/staff absent** → owner-side rescheduling; tenant sees new slot with accept/decline.
- **EC-E10 — Cleaning requested during leave** → date disabled.
- **EC-E11 — Laundry item count mismatch** → tenant "Count is wrong" → owner/staff resolves; dispute thread.
- **EC-E12 — Laundry lost/damaged** → Issue with order attached; compensation policy `[PLACEHOLDER]` owner-managed.
- **EC-E13 — Parcel logged for wrong tenant/ex-tenant** → "Not mine" → security reassigns; ex-tenants can collect within 7 days.
- **EC-E14 — Parcel uncollected > 7 days** → returned/held per policy; tenant informed.
- **EC-E15 — Hand-over code not working** → staff can verify identity manually; code regenerates on request.

### F. Leave
- **EC-F1 — Overlapping/duplicate leave** → merge prompt.
- **EC-F2 — End date before start / far future** → validation.
- **EC-F3 — Tenant returns early without telling** → resumes meals only if they tap "I'm back"; owner can also end leave.
- **EC-F4 — Leave declared during notice period** → allowed; exit dates unaffected.
- **EC-F5 — Leave suppresses a meal after cutoff** → no (already counted).
- **EC-F6 — Leave > 30 days** → owner review flag (7.13).
- **EC-F7 — SOS/emergency call during leave** → unaffected (safety features never suppressed).

### G. Notices & inbox
- **EC-G1 — Urgent notice while app is closed** → push (critical channel) + SMS.
- **EC-G2 — Notice retracted after read** → shows "Withdrawn"; ack retained in owner log.
- **EC-G3 — Large attachment/offline** → cached text first, attachment on demand.
- **EC-G4 — Notice audience changes** (tenant moves floors) → sees notices only from move date; earlier ones targeting old floor are hidden.
- **EC-G5 — Notification permission denied** → in-app banner explaining risk (rent reminders); SMS fallback for critical.

### H. SOS & emergency
- **EC-H1 — No internet at trigger** → immediate "Call 112 / Manager" options + SMS fallback (Android) + queued retry; UI states clearly that the alert has **not** reached the PG yet.
- **EC-H2 — Accidental trigger** → hold-3 s + 5-s cancel window.
- **EC-H3 — Nobody acknowledges** → escalation chain + Admin/Support visibility (Owner §16.2); tenant is prompted to call 112.
- **EC-H4 — Location permission denied** → SOS proceeds with room/bed only.
- **EC-H5 — Multiple SOS in a short time** → merged into one active event; updates appended.
- **EC-H6 — Guardian number unreachable / unsubscribed** → SOS WhatsApp fails; SMS fallback if the number hasn't unsubscribed; failure recorded and visible to the manager.
- **EC-H7 — Tenant medical note** → included in alert only if tenant disclosed and consented; never to guardian by WhatsApp.
- **EC-H8 — Staff/Manager offline** → escalate; audit trail shows unacknowledged.
- **EC-H9 — Roommate emergency call: callee unreachable/blocked network** → after 2 attempts suggests contacting Manager on duty.

### I. Room change & relocation
- **EC-I1 — Requested room gets taken before offer** → owner offers alternatives; tenant sees "no longer available".
- **EC-I2 — Swap partner declines/ignores** → expires after 48 h; requester notified without partner's reasons.
- **EC-I3 — Rent difference changes after offer** → offer re-issued; previous acceptance void.
- **EC-I4 — Tenant accepts offer, then owner cancels** → status Cancelled by owner with reason; tenant stays in current bed.
- **EC-I5 — Room type reduced (3-share → 2-share) with tenants inside** (Owner §14.3) → tenant receives relocation notice with options; owner must resolve before capacity change.
- **EC-I6 — Relocation during unpaid dues** → owner policy; tenant sees rule explanation.
- **EC-I7 — Temporary relocation ends but bed still under maintenance** → owner extends; tenant sees new return date.
- **EC-I8 — Room-change while a cleaning/laundry/issue is open** → open items auto-re-pointed to new room.

### J. Deboarding & exit
- **EC-J1 — Requested date earlier than notice period** → allowed to submit with a **penalty notice** ("₹X notice-period charge may apply") if the owner policy says so.
- **EC-J2 — Owner counter-offers a later date** → tenant accepts or disputes; dispute → Support.
- **EC-J3 — Tenant withdraws after approval** → needs owner consent.
- **EC-J4 — Tenant stays beyond exit date** → banner "Your notice period ended — contact manager"; owner may extend or charge; no automatic penalty in tenant app `[ASSUMPTION]`.
- **EC-J5 — Dues unpaid at exit** → settlement shows deduction from deposit or payable balance; tenant can pay via 7.7.
- **EC-J6 — Deposit deduction dispute** → per-line dispute, evidence photos both sides, Support mediation (Owner §14.8, §16.1).
- **EC-J7 — Refund failed / delayed** → tracker shows expected date; "Report delay" → owner + Support.
- **EC-J8 — Owner-initiated deboarding** (non-payment, rule violation) → reason category visible, **dispute** allowed, tenant can download all records before access reduces.
- **EC-J9 — Owner force-deboards an absconded tenant (Owner §14.10)** → tenant, if they log in later, sees "Stay ended by PG" and records; the internal flag isn't shown to the tenant and is **never shared with any other PG (DEC-11)**, and a **Contest** option exists (fairness, `[LEGAL REVIEW]`).
- **EC-J10 — Tenant exits and immediately requests another PG** → allowed only once Stay = Ended (no dual active states, Owner §14.22).
- **EC-J11 — Mid-month exit** → pro-rata shown with breakdown (Owner §14.7).
- **EC-J12 — Feedback given at exit is negative** → visible to owner + Admin only; **no retaliation** protections handled by policy (owner cannot see it before settlement completes) `[ASSUMPTION]`.

### K. Owner/platform-side changes that affect the tenant
- **EC-K1 — Owner subscription lapses (soft-lock)** → tenant features remain live; tenant sees **nothing** unless an owner-only feature blocks a tenant flow, e.g., new invites (Owner §14.18).
- **EC-K2 — Owner cancels subscription / property leaves platform** → S-87 banner + N-30; export window; join links stop working with friendly message (Owner §14.19).
- **EC-K3 — Owner deactivates marketplace listing** → no effect on tenant (Owner §14.23).
- **EC-K4 — Admin disables a module while tenant is mid-flow** → current item completes; new entry hidden; if the tenant is inside the screen, a graceful "This feature isn't available for your PG right now" and back navigation.
- **EC-K5 — Bed/room/price edited by owner outside the app** → tenant sees updated info + system note in Updates; rent changes require ack (7.7).
- **EC-K6 — Owner owner-account suspended/deleted** → S-87/S-88; records exportable.
- **EC-K7 — Support edits tenant data** → transparent "Updated by PG Wonders Support" annotation (X-43).
- **EC-K8 — Manager scope change** → tenant may see a different "Manager on duty"; no other effect.
- **EC-K9 — Owner sets payment mode from Cash+QR to Cash only** → open claims unaffected; QR hidden for new payments.

### L. Minors & guardians
- **EC-L1 — Minor registers** → banner, guardian details mandatory, locked guardian scope.
- **EC-L2 — Guardian STOP** → owner prompted for alternative guardian (9.5).
- **EC-L3 — Minor turns 18** → guardian scope review prompt (9.3).
- **EC-L4 — Guardian number invalid** → activation completes but "Guardian unreachable" banner persists for owner.
- **EC-L5 — Minor pays rent themselves** → allowed to declare claim; payer = Guardian preferred; no restrictions on UPI since owner-side.
- **EC-L6 — Guardian wants to dispute** → no channel in-app; message directs to PG contact; Support handles by phone `[PLACEHOLDER]`.
- **EC-L7 — DOB entered incorrectly to avoid guardian alerts** → owner-side ID verification cross-check; flagged on mismatch; tenant can't edit DOB (locked).

### M. Device, network & platform
- **EC-M1 — Offline** → §12.
- **EC-M2 — Slow network** → skeletons, low-res images first, upload progress, cancel option.
- **EC-M3 — App killed mid-upload/mid-claim** → drafts + resumable queue; idempotency key prevents duplicates.
- **EC-M4 — Low storage** → detect failed writes; friendly "Free up space" message; cache purge option.
- **EC-M5 — Permission changes in OS settings** (camera, notifications, location) → runtime re-check; contextual explainer.
- **EC-M6 — Dark mode / font scale 200% / screen reader** → layouts don't break; all icons labelled (§14.3).
- **EC-M7 — Very small screens (320 dp)** → single-column fallbacks.
- **EC-M8 — Timezone travel** → IST for all cutoffs regardless of device timezone; display note if device tz ≠ IST.
- **EC-M9 — Screenshot/screen-recording on ID/QR screens** → block on documents; allowed on QR.
- **EC-M10 — Shared phone** (two tenants share device) → app lock encouraged; logout clears local caches.
- **EC-M11 — Rooted/jailbroken device** → warn on documents/payments proofs `[ASSUMPTION]`.
- **EC-M12 — Push token invalid / notifications disabled** → SMS fallback for critical; banner.
- **EC-M13 — Backend outage/5xx** → last-synced data shown read-only with banner; writes queued only for queue-able actions.
- **EC-M14 — Duplicate double-tap on submit** → idempotency (§4.4).

### N. Privacy & data
- **EC-N1 — Delete request while active** → blocked (7.24).
- **EC-N2 — Data export request during active dispute** → export includes dispute threads the tenant participated in.
- **EC-N3 — Tenant removes profile photo** → allowed; owner sees placeholder; ID photo unaffected.
- **EC-N4 — Access by Support** → audit-logged, visible in tenant's "Data access log" `[P2]` (Owner §16.2).
- **EC-N5 — Tenant asks who can see their stay history** → Privacy centre states plainly: only the tenant (DEC-11).

### O. Multi-PG, history & marketplace (joins)
- **EC-O1 — Join request/invite while already in S3/S4/S5** → blocked: "You have an active stay at Sunrise PG. Complete move-out first." (Owner §14.9, §14.22).
- **EC-O2 — Rejoin same PG after ex-tenancy** → sent as a normal join request; the owner relies on their own records of that stay; no platform history is attached; previous terms are not pre-filled.
- **EC-O3 — Past tenant with unpaid dues requests a new PG** → tenant sees the outstanding-dues banner for the old PG; **the new PG owner never sees dues or any history from other PGs (DEC-11)**. Dues remain between the tenant and the old PG.
- **EC-O4 — Same person joins two PGs simultaneously by two accounts** → detection by ID/DOB (EC-A10).
- **EC-O5 — Code for a paused / suspended / departed PG** → "This PG isn't accepting requests right now."
- **EC-O6 — Wrong PG code entered repeatedly** → rate-limit (10 tries/hour) to stop code enumeration.
- **EC-O7 — Join request while previous request at another PG is Approved** → the first approved becomes an invite; the tenant chooses; accepting locks/withdraws others.
- **EC-O8 — Owner rejects; tenant re-requests via different route** → cooldown enforced per PG.

### P. Referrals
- **EC-P1 — Self-referral / same device / same ID** → rejected; no reward.
- **EC-P2 — Friend already has an account or already in a PG** → not eligible for reward; explained neutrally.
- **EC-P3 — Reward payable when friend leaves in < 30 days** → reward voided (`[PLACEHOLDER]` clawback rule).
- **EC-P4 — Referrer exits before friend completes 30 days** → reward still credited as refund adjustment or cash `[PLACEHOLDER]`.

---

## 11. Error, Empty & Loading Standards

### 11.1 System-level screens
| Screen | Trigger | Content / actions |
|---|---|---|
| Offline banner | No connectivity | Persistent top strip "You're offline — showing last synced data (2 min ago)"; queued-changes counter |
| Maintenance | Backend 503 planned | "We'll be back by 6 pm" + last-synced read-only data; critical numbers (Manager, 112) remain accessible |
| Force update (S-86) | Min-version enforced | Blocking; store link; explains reason |
| Session expired | Refresh fails | Re-login prompt; drafts preserved |
| Link expired/invalid | Deep link | Explain + "Ask the PG for a new link" + Go home |
| Permission needed | Camera/notification/location denied | Contextual explainer + Open Settings + alternative path |
| PG left platform (S-87) / Suspended (S-88) | Owner cancels / Admin suspends | See 7.24, N-30 |

### 11.2 Patterns
| Situation | Pattern | Example copy |
|---|---|---|
| Field validation | Inline, on blur + submit; never clear user input | "UTR should be 12 digits" |
| Recoverable API error | Toast/snackbar + Retry; auto-retry with backoff (1, 2, 4, 8 s, max 5) for idempotent reads | "Couldn't load your ledger. Retry" |
| Failed write (queue-able) | Item shows "Waiting to sync ⟳"; never lost | "Will send when you're online" |
| Failed write (non-queueable) | Blocking dialog with cause + what to do | "Couldn't submit the payment claim. Check your connection and try again — your details are saved." |
| Conflict (state changed server-side) | Refresh view + explain | "The owner already confirmed this payment" |
| Empty list | Illustration + one-line reason + next action | "No issues yet. Everything working well?" |
| Loading | Skeletons (lists/cards), spinners only for button actions | — |
| Partial data (some modules fail) | Card-level error with retry; rest of screen usable | — |
| Destructive confirmation | Dialog with consequence + primary = safe option | "Cancel your move-out request? Your owner will be notified." |
| Rate-limit | Countdown UI | "Too many attempts. Try again in 12:00" |
**Copy rules:** plain English, ≤ 2 sentences, say what happened + what to do, never blame the user, no error codes on-screen (codes go in "Details" expander for Support).

---

## 12. Offline Behaviour

| Action | Offline behaviour | On reconnect / conflict |
|---|---|---|
| View home, ledger, receipts (downloaded), menu, notices (cached), WiFi, contacts, agreement | ✅ Cached read (last 30 days; WiFi/contacts/rules permanently) | Silent refresh |
| Emergency contacts, 112/108, SOS | ✅ Always available; SOS shows "Alert not yet sent" until delivered (EC-H1) | Retry + SMS fallback |
| Raise issue (text + photos) | ✅ Queued; photos upload in background | Server validates duplicates via idempotency key |
| Request cleaning / laundry pickup | ✅ Queued | Slot may be full → tenant asked to re-pick |
| Food toggle | ✅ Optimistic; queued with trusted local timestamp | Server accepts if before cutoff; else revert + notice (EC-D3) |
| Declare/cancel leave | ✅ Queued | Server re-runs suppression; conflicts shown |
| Payment claim ("I've paid") | ⚠ Queued **as draft** with "Not submitted yet" badge — never presented as submitted | Auto-submit on reconnect; user notified |
| Sign agreement, deboarding request, room-change offer response | ❌ Requires connectivity (legal/critical) — draft saved | — |
| Profile edits (non-locked) | ✅ Queued | Last-write-wins with server timestamp |
| Notices ack/read | ✅ Queued | — |
| Referral share | ✅ Share sheet works offline (link) | — |
Queue rules: max 50 items; FIFO; retry backoff; items older than 7 days prompt the user; a "Sync issues" screen lists failed items with retry/discard.

---

## 13. Data Model Additions (tenant-facing entities)

Extends Owner PRD hierarchy (Owner §4). `*` = new vs. Owner PRD. All records carry `id, created_at, updated_at, created_by, tenant_id/property_id` scoping and are soft-deletable.

| Entity | Key fields | States / enums |
|---|---|---|
| **User (identity)** | phone (unique), email, personas[] | — |
| **TenantProfile** | user_id, name, dob, gender, photo, occupation, institution, hometown, food_pref, medical_note, minor (derived), verified_fields | — |
| **Stay** | tenant_id, property_id, bed_id, rent, deposit, due_day, move_in, notice_period_days, agreement_id, exit_type | `invited → pending_activation → active → notice → ended`; exit_type: `clean / ended_by_pg / left_without_notice` |
| **JoinRequest*** | tenant_id, property_id, room_types[], move_in_pref, note, referred_by | `submitted → under_review → approved / waitlisted / rejected / expired / withdrawn` |
| **Invite*** | stay_id, phone, expires_at, dob_attempts | `sent / accepted / declined / expired / revoked / locked` |
| **Bed (extension)*** | status adds `reserved` | `vacant / reserved / occupied / under-maintenance / blocked` |
| **Agreement / Addendum*** | stay_id, version, pdf_url, signed_by, signed_at, guardian_signed_upload | `draft / awaiting_sign / signed / superseded` |
| **Document** | tenant_id, type, number_masked, file_url, status, reject_reason | `uploaded / under_review / verified / rejected` |
| **PaymentConfig*** | property_id, modes[], upi_id, payee_name, qr_image, allow_partial, proof_required | — |
| **LedgerEntry** | stay_id, type (rent/deposit/addon/credit/refund), amount, period, due_date, status | `upcoming/due/overdue/partial/awaiting_confirmation/paid/waived/disputed` |
| **PaymentClaim*** | ledger_entry_ids[], amount, mode(cash/upi), utr, proof_url, paid_on, payer, qr_snapshot, idempotency_key | `awaiting_confirmation / confirmed / partially_confirmed / rejected / withdrawn` |
| **Receipt** | payment_id, number, pdf_url, recorded_by | immutable; corrections = credit note |
| **Dispute*** | subject_type/id, thread[], escalated_to_support | `open / escalated / resolved` |
| **Issue** | category, sub_issue, description, photos[], location, priority, assignee, sla_due, reopen_count | `new/assigned/in_progress/resolved/reopened/closed/cancelled` |
| **CleaningRequest** | date, slot, type, dnd | `requested/scheduled/done/missed/cancelled` |
| **MealOptState** | stay_id, date, meal, available, locked_at, source | — |
| **MealFeedback*** | meal_id, rating, tags[], comment, photo | — |
| **Leave** | stay_id, start, end, reason, effective_effects | `active/ended_early/cancelled` |
| **Notice / NoticeAck** | audience, priority, ack_required, attachments | `scheduled/published/edited/withdrawn/archived` |
| **CallLog*** | from_tenant, to_tenant, at, outcome | — |
| **SOSEvent*** | tenant_id, type, location?, notified[], acknowledged_by, timeline | `sent/acknowledged/resolved/closed_by_tenant/false_alarm` |
| **RoomChangeRequest*** | type, reason, prefs, swap_partner_id, offer{bed, rent_diff, effective}, addendum_id | `requested/under_review/offered/accepted/scheduled/completed/rejected/withdrawn/expired/cancelled` |
| **Relocation*** | stay_id, from_bed, to_bed, temp?, start, end, reason | `planned/active/ended` |
| **LaundryOrder*** | items[], slot, tag, count_confirmed, charge | `requested/picked_up/in_process/ready/delivered/confirmed/disputed` |
| **Parcel*** | courier, photo, handover_code, received_at | `received/collected/uncollected/returned/wrong_recipient` |
| **GuardianContact*** | stay_id, name, relation, phone, delivery_status, scope | `active/unsubscribed/failed` |
| **GuardianMessageLog*** | template, sent_at, delivery_status | — |
| **Referral*** | referrer_id, referee_id, property_id, reward, status | `invited/registered/requested/joined/rewarded/void` |
| **DeboardingRequest** | requested_date, approved_date, reason, feedback, refund_details | `submitted/under_review/approved/countered/rejected/withdrawn/completed` |
| **ExitChecklistItem / Settlement*** | items[], deductions[], net_amount, refund_status | `pending/done/needs_attention`; `initiated/paid/completed/disputed` |
| **ModuleFlag*** | scope(platform/account/property), module_id, enabled, set_by (Admin) | — |
| **NotificationPref** | tenant_id, category, channel, quiet_hours | — |
| **AuditLog** | actor, action, before/after, reason/ticket | append-only |

---

## 14. Non-Functional Requirements

### 14.1 Security & privacy
- OTP auth with device binding; short-lived access tokens + refresh; TLS 1.2+; PII/financial data encrypted at rest; per-tenant row-level scoping matching §5.1 and Owner §6.
- Screenshot blocking on ID/doc screens; secure file URLs (signed, expiring); watermarking on downloaded documents `[ASSUMPTION]`.
- Compliance: India's **DPDP Act 2023** (consent, purpose limitation, deletion, guardian consent for minors) `[LEGAL REVIEW]`; Aadhaar handling rules `[LEGAL REVIEW]`; WhatsApp Business policy for guardian messaging.
- No PCI scope (no cards/gateway in P1); UPI ID/QR are owner-provided and treated as public payee data.
- Audit logging for all internal access to tenant data (Owner §16.2, §17).

### 14.2 Performance & reliability
- Cold start ≤ 3 s on a 3 GB-RAM Android; home content within 1.5 s from cache; list scroll 60 fps; app size ≤ 40 MB; images ≤ 1 MB after compression; all screens usable on 3G.
- SOS trigger-to-server ≤ 2 s on 4G; critical push delivered ≤ 10 s.
- 99.9% availability target for SOS, auth, payments claims `[PLACEHOLDER]`.

### 14.3 Accessibility & usability
- WCAG 2.1 AA contrast; touch targets ≥ 48 dp; supports font scaling to 200%; VoiceOver/TalkBack labels on all controls and status chips (never colour-only); reduced-motion respected; haptics for critical confirmations.
- English only in P1; **all strings externalised** and layouts tolerate 40% longer text (for future Hindi/regional).
- Dark mode supported `[ASSUMPTION P2]`.

### 14.4 Observability
- Crash reporting, structured logs with request IDs, feature-flag state in every log, error budgets on critical flows (payment claim submit, SOS, activation).

---

## 15. Analytics & KPIs

**Principles:** no PII in events; consent-gated; events named `object_action`.
| Area | Events |
|---|---|
| Acquisition | `persona_selected`, `otp_verified`, `registration_completed`, `pg_code_entered`, `join_request_submitted`, `join_request_status_changed` |
| Activation | `invite_viewed`, `invite_accepted`, `activation_step_completed{step}`, `agreement_signed`, `activation_completed{hours_from_invite}` |
| Payments | `rent_screen_viewed`, `upi_qr_opened`, `upi_intent_launched`, `qr_shared`, `payment_claim_submitted{mode}`, `payment_claim_confirmed{latency_h}`, `payment_claim_rejected`, `receipt_downloaded`, `hra_statement_generated` |
| Engagement | `menu_viewed`, `meal_toggled{meal,locked?}`, `meal_feedback_submitted`, `issue_created{category}`, `issue_reopened`, `cleaning_requested`, `leave_declared`, `notice_read`, `notice_acked` |
| Safety | `sos_triggered`, `sos_cancelled`, `sos_acknowledged{latency_s}`, `roommate_call_started` |
| Lifecycle | `room_change_requested`, `deboarding_requested`, `settlement_disputed`, `stay_completed`, `referral_shared`, `referral_joined` |
| Health | `offline_queue_size`, `sync_failed`, `guardian_message_failed` |
Dashboards: activation funnel; payment-confirmation latency; issue SLA adherence; food participation; SOS response; guardian delivery rate; module usage by property (feeds Admin's module decisions).

---

## 16. Prototype Build Guide (for Antigravity)

### 16.1 Stack & shareability `[ASSUMPTION — confirm]`
DEC-01 allows React Native **or** Flutter. Recommendation for the prototype: **React Native + Expo (TypeScript)** — one codebase yields (a) a **web link** for stakeholders (Expo web export on Firebase Hosting/Vercel/Netlify), (b) **Expo Go QR / EAS Update** for phone testing, (c) an **Android APK** via EAS Build. (Flutter is equally viable — web build + APK — if the team prefers it; all requirements below are framework-agnostic.)
Suggested libraries: Expo Router · Zustand (+ persisted storage) · TanStack Query (mock adapters) · React Hook Form + Zod · `react-native-svg` · `react-native-qrcode-svg` · `expo-image-picker/camera` · `expo-sharing` · `expo-linking` (UPI deep links) · `expo-notifications` (local, to simulate push) · `expo-local-authentication` · `expo-print`/`expo-file-system` (mock PDFs) · `date-fns-tz` (IST) · `lucide-react-native`.
**Web fallbacks (browser demo):** camera → file input; share → Web Share API or copy-link; UPI deep link → show "Open on your phone" QR; haptics/biometrics → no-op; push → in-app toast.

### 16.2 Structure
```
/app                 # expo-router routes: (persona)/ (auth)/ (prospect)/ (tenant tabs)/ ...
/src/features        # join, onboarding, home, rent, issues, cleaning, food, leave, notices, roommates, sos, roomchange, laundry, parcels, pginfo, referral, deboarding, history, profile, guardian
/src/api             # typed contracts + mock adapters (swap for real REST later)
/src/simulation      # owner/staff/admin behaviour engine (§16.4)
/src/config          # modules.config.ts, simulation.config.ts, demo.clock.ts
/src/design          # tokens, components
/src/mock            # seed data per demo account
/docs                # this PRD, DEVIATIONS.md
```

### 16.3 Demo accounts (separate seeded logins — no in-app toggle, DEC-01)
OTP for all: **123456** (wrong: `000000` → invalid; `111111` → expired). Persona: choose **Tenant**.
| Phone | Name | State | Demonstrates |
|---|---|---|---|
| 9000000001 | Ananya Rao | S0 new | Registration → join by code: `SUN123` (approved after ~20 s), `FULL99` (waitlist), `GENTS1` (gender-policy block), `CLOSED9` (paused PG), `REJECT1` (rejected, cooldown) |
| 9000000002 | Rohit Verma | S3 invited | Invite + **DOB check** (DOB `14-03-2001`; 3 wrong = lock), offer, activation wizard, e-sign, guardian details entry (no verification), move-in payment |
| 9000000003 | Karthik Nair | S4 active (**main demo**) | Everything: rent due in 3 days, QR pay, menu + cutoffs, issues in all states, cleaning, notices (incl. urgent), parcel, laundry, roommates, SOS, referral, HRA |
| 9000000004 | Meera Iyer | S4 overdue | Overdue banner, claim awaiting confirmation, rejected claim + dispute thread, upcoming leave, room-change **offer** |
| 9000000005 | Aarav Menon (17) | S4 minor | Locked guardian scope, guardian message log, guardian-signed agreement (uploaded), G-templates |
| 9000000006 | Sana Khan | S5 notice | Deboarding timeline, exit checklist, settlement with a disputed line, refund tracker |
| 9000000007 | Vikram Shah | S6 + S2 | 3-stay private history, rejoin (normal request, nothing attached), past ledger/receipts, pending request banner |
| 9000000008 | Divya Pillai | S4 at "Lakeview Hostel" | **Modules off:** Food hidden; **HRA not enabled → "Ask my PG to enable" flow**; Laundry & Parcels on; temporary relocation card; on-leave overlay |
| 9000000009 | (Staff-only number) | — | EC-A5 persona-mismatch error |

### 16.4 Simulation engine (owner/staff/admin behaviour without a backend)
`src/simulation` listens to tenant actions and emits timed responses (default delay 10 s, configurable in `simulation.config.ts`; delivered as in-app updates + local notifications). **Magic values** trigger alternate branches (documented, not exposed as UI toggles):
| Input | Result |
|---|---|
| Payment claim with UTR ending `000` | Owner **rejects** after 10 s ("Payment not found") |
| UTR ending `111` | Owner confirms **partial** ₹6,000 |
| UTR ending `999` | No response (use `DEMO_NOW` advance to show 48 h reminder) |
| Any other valid UTR / cash claim | Owner **confirms** → receipt generated |
| Join code `SUN123` | Approved → invite offer arrives after ~20 s |
| Issue category → Plumbing | Assigned (Suresh) after 15 s → In progress after 30 s → Resolved after 60 s |
| SOS | Manager "Ravi" acknowledges after 20 s; guardian log entry appended |
| Deboarding request | Approved with adjusted date after 20 s → checklist items tick progressively |
| Room-change request | Offer arrives after 20 s (rent +₹1,500) |
| Parcel demo | Parcel logged 5 s after login for Karthik |
| HRA "Ask my PG to enable" (Divya) | Owner enables HRA after ~15 s; statement generator appears |
`DEMO_NOW` (frozen clock, default **2 Oct 2026 08:30 IST** so lunch cutoff is 1.5 h away and rent is due in 3 days), `DEMO_SPEED` (time multiplier), `?offline=1` (web) to preview offline behaviour; on device use airplane mode.

### 16.5 Seed data (single source of truth)
- **PG:** *Sunrise Residency*, Koramangala 4th Block, Bengaluru; code `SUN123`; Standard category; separate men's/women's blocks; 2 towers, 4 floors; amenities: WiFi, laundry, gym, parking, housekeeping alt-days; verified badge.
- **Room types & rent:** 2-share AC ₹8,500 (deposit ₹17,000, due day 5); 3-share non-AC ₹6,500; private AC ₹13,500. Notice period 30 days.
- **People:** Manager *Ravi Kumar*; cook *Lakshmi*; housekeeping *Sunita*; electrician *Imran*; plumber *Suresh*; security *Mahesh*; owner *Mr. Prakash Rao*.
- **Payment config:** Cash + UPI QR; UPI ID `sunriseresidency@upi` (placeholder); payee "Sunrise Residency"; partial payments allowed; proof required (UTR or screenshot). **HRA statements: enabled for Sunrise (owner opted in), disabled for Lakeview (DEC-13).**
- **Menu:** 7-day menu, breakfast/lunch/snacks/dinner, veg + non-veg tags; cutoffs lunch 10:00, dinner 18:00.
- **Notices:** water-tank cleaning (Maintenance), rent reminder (Rent), house-rules update (Rules, ack required), **urgent** power-outage notice.
- **Second PG:** *Lakeview Hostel* (Divya) with `food=false`.
- **Assets:** placeholder photos (no real people), sample ID images, sample agreement PDF, sample QR generated from the UPI URI.

### 16.6 Design system (placeholder brand "PG Wonders")
- **Colours:** neutral base — ink `#111827`, greys `#374151/#6B7280/#E5E7EB/#F9FAFB`; single accent (teal `#0E7C86`); semantic: success `#15803D`, warning `#B45309`, danger `#B91C1C`, info `#1D4ED8`. (Swap tokens when the owner-app palette is available — all colours from tokens only.)
- **Type:** Inter/system; sizes 12/14/16/20/24/32; line-height 1.4; numeric tabular figures for money.
- **Layout:** 4-pt spacing, 12 px radius cards, 48 dp minimum tap targets, bottom sheets for secondary actions, sticky primary CTA in forms.
- **Components to build once:** Button, Chip/StatusChip, Card, ListRow, Banner, Toast, BottomSheet, Dialog, FormField (validation), OTPInput, DatePicker, PhotoPicker, FileUploadRow, Timeline, SkeletonCard, EmptyState, Stepper, Countdown, QRDisplay, SignaturePad, PDFViewer (mock), ToggleRow with lock state, NotificationBadge, HoldButton (SOS), MaskedNumber.
- **Money:** ₹ with Indian grouping (₹1,25,000), tabular figures.
- **Motion:** subtle; SOS hold ring; confetti-free.

### 16.7 Build order & acceptance criteria
| Milestone | Scope | Acceptance |
|---|---|---|
| **M0 Foundations** | Repo, tokens, components skeleton, persona picker (S-01), OTP login (S-02), state router, module config, simulation engine, seed data, frozen clock | Each demo phone lands on the correct home/state; wrong OTP/expired OTP/persona-mismatch errors work |
| **M1 Prospect → Active** | S-04 → S-11: registration, prospect home, join by code/QR/link, preview, request form, tracker (approve/waitlist/reject/withdraw), invite + DOB check, activation wizard incl. e-sign & guardian details (no verification) | Ananya completes join → gets offer → activates; Rohit invite path; all EC-A9, EC-B2/B7/B11 behaviours |
| **M2 Home + Rent** | S-12 Home, S-13 → S-23 rent, QR pay, share/save QR, claims, sim confirm/reject/partial, dispute thread, receipts (PDF mock), deposit, HRA | Karthik pays via UPI and cash flows; Meera's reject/dispute; magic UTRs work; EC-C1–C8 |
| **M3 Issues, Cleaning, Notices** | S-24 → S-30, S-39 → S-41 | Full issue lifecycle incl. reopen/rate; cleaning w/ leave-block; urgent notice interrupt + ack |
| **M4 Food + Leave** | S-31 → S-38 with server-time cutoffs and lock states | Countdown to cutoff; hard lock; leave suppresses meals; "I'm back" works; Divya has no Food tab |
| **M5 Safety & Info** | Roommates masked call (simulated), emergency contacts, SOS (hold + cancel + status), WiFi/amenities/rules/contacts | SOS full sequence incl. cancel and escalation; WiFi QR |
| **M6 Room change, Laundry, Parcels** | S-46 → S-55 | Meera's offer accept → relocation; Divya's temporary relocation; parcel hand-over code; laundry lifecycle |
| **M7 Exit & History** | S-63 → S-72, referral S-61/62 | Sana's whole exit; settlement dispute; Vikram's private history and rejoin; referral tracker |
| **M8 Guardian, Profile, System states, Polish** | S-77 → S-88, §9, offline queue UX, force-update/maintenance/PG-left screens, a11y pass, web export | Aarav's guardian log & locked scope; privacy export/delete flows; offline demo; deploy shareable web link + Expo QR + APK |
Stop after each milestone for review; do not begin the next until acceptance is confirmed.

### 16.8 Kickoff prompt for Antigravity (paste with this PRD attached)
> Build the **PG Wonders Tenant mobile app prototype** exactly per the attached PRD. Stack: React Native + Expo (TypeScript strict) with Expo Router; no real backend — implement typed API contracts with mock adapters and the simulation engine in §16.4. Work milestone by milestone (§16.7) and stop for review after each. Follow the screen IDs (S-xx), edge cases (EC-xx), and cross-links (X-xx) as the source of truth. Use only tokens from §16.6. Apply every `[ASSUMPTION]`/`[PLACEHOLDER]` default as written and log any deviation or unresolved ambiguity in `docs/DEVIATIONS.md` instead of inventing scope. Do **not** build anything listed as out of scope (§1.3) or Phase 2/3 except the "Coming soon" placeholders. There must be no in-app toggle that switches user state — states come from the seeded demo accounts (§16.3). Ensure every list has loading, empty and error states (§11), and that money/time logic uses the frozen IST clock. Deliver: web build link, Expo Go QR, and Android APK.

### 16.9 Definition of done (prototype)
1. Every P1 screen reachable via the demo accounts; no dead buttons (P2/P3 items show "Coming soon").
2. Every P1 edge case marked with a demo hook is demonstrable; others are implemented as UI states.
3. Every action in §8 produces the specified owner-side effect through the simulation engine and a visible tenant-side update.
4. Cutoffs, pro-rata, leave suppression and notice countdown compute correctly from the frozen clock.
5. Passes basic a11y checks (contrast, labels, 200% font) and runs on a low-end Android and mobile Safari (web).
6. A `README` explains demo accounts, magic values, `DEMO_NOW`, and how to share the build.

---

## 17. Deltas Required in Owner / Admin / Other PRDs

The tenant experience depends on these additions. Nothing here is built by the tenant prototype but each needs a spec.

| ID | Delta | Affects | Why |
|---|---|---|---|
| D-01 | **Persona picker before login** replaces post-login "Continue as…" | Owner §5.4 | DEC-10 |
| D-02 | **Admin module registry** (feature flags per platform/account/property) + owner read-only view + "request module" flow | Owner §6, §16.1 | DEC-08 |
| D-03 | Guardian WhatsApp infrastructure: templates, delivery status on Tenant record (no verification step), owner-side "share this notice with guardian" | Owner §5.2, §7 | DEC-05 |
| D-04 | **Join Requests queue** (approve & onboard / waitlist / reject), PG code + QR + deep link generator, PG public preview configuration (photos, vacancy visibility), waitlist management | Owner §4, §5.2, §18 (pulls part of Phase 3 discovery into P1) | DEC-02 |
| D-05 | Bed status **`reserved`** for approved/invited-but-not-moved-in tenants | Owner §4, §5.2 step 9 | 7.4 |
| D-06 | **Owner UPI QR/UPI ID upload**, payment-mode config, **payment-claim confirmation** (confirm / partial / reject with reason), duplicate-UTR check, dispute threads | Owner §7, §11, §15 | DEC-04 |
| D-07 | HRA statement: owner **PAN** capture, **per-property owner opt-in (default OFF)**, tenant "ask my PG to enable" request, honest privacy copy | Owner §5.1, §11, §15 | 7.9 |
| D-08 | **Room-change / relocation queue** (offers, swaps, capacity checks, ledger adjustment, addendum) | Owner §7, §14.3–14.4 | 7.17 |
| D-09 | SOS routing: on-duty contacts, escalation chain config, acknowledgement UI in Manager/Security apps | Owner §5.3, §16 | 7.16 |
| D-10 | Staff app: laundry pickup/count, parcel logging + hand-over code, housekeeping DND/slots, "could not access" | Staff PRD | 7.11, 7.18 |
| D-11 | Owner food-feedback report; Admin-defined cutoff limits; mess-closed calendar | Owner §7, §9 | 7.12 |
| D-12 | ~~Stay-history sharing~~ **Removed (DEC-11)** — no owner-side view of other-PG history; exit-type taxonomy stays internal to each PG | — | DEC-11 |
| D-13 | Referral programme config + reward credit ledger line | Owner §7, §11 | 7.20 |
| D-14 | Notice composer: **urgent** type, **ack required**, attachment, guardian-share flag | Owner §7 | 7.14 |
| D-15 | Support console: tenant-originated tickets, dispute mediation view, "sensitive issue about manager/owner" bypass, force-reverify login | Owner §16.2 | EC-A3, EC-E8 |
| D-16 | **Agreement addenda** + minor's guardian-signed upload + re-review on terms change | Owner §5.2 step 7 | EC-B3/B4/B14 |
| D-17 | Owner tools: "Reset tenant login", duplicate-identity flags, invite edit/resend/revoke, document review queue with reasons | Owner §5.2, §7 | EC-A3, A9, A10 |
| D-18 | Owner §5.2 step 8 "credentials or magic link" → **OTP login + magic invite link** | Owner §5.2 | 4.1 |
| D-19 | Tenant profile change-log and **profile-correction request** workflow | Owner §7 | EC-B5 |
| D-20 | Deboarding: counter-offer date, notice-period penalty config, settlement dispute lines, refund tracker | Owner §13 | 7.21 |

---

## 18. Phased Roadmap (tenant app)

- **Phase 1 (prototype + MVP):** persona picker/OTP login · registration · join by code/QR/link + waitlist · invite + activation + e-sign · Home · rent ledger, cash + owner-QR claims, receipts, deposit, HRA · issues · cleaning · food (menu, opt-out, feedback) · leave · notices/inbox · roommate emergency call · **SOS** · room-change/relocation · laundry & parcels · PG info/WiFi · referral · deboarding & settlement · stay history & consent · profile/privacy · guardian WhatsApp alerts · module registry (Admin).
- **Phase 2:** in-app gateway payments · **community feed** · voice/video issue notes · pre-alert parcels · special-diet notes · eKYC (DigiLocker) · guardian e-sign via one-time link · dark mode · Hindi/regional languages · data-access log · lock-screen SOS · penny-drop refund validation.
- **Phase 3:** marketplace discovery/search, ratings/reviews, cross-PG "port" requests (Owner §18), surfaces that keep tenant stay history private (DEC-11).

---

## 19. Open Questions Log

1. Confirm build stack: **React Native + Expo** vs Flutter (16.1).
2. Guardian alerts for **adult tenants**: is opt-down (Payments + Emergency only / Emergency only) acceptable, and what consent wording (9.3, DPDP) `[LEGAL REVIEW]`.
3. Minor agreement: wet-signed upload acceptable, or plan a guardian one-time e-sign link in P2 (EC-B14) `[LEGAL REVIEW]`.
4. E-sign provider and legal validity (7.5).
5. Payment-claim strictness: UTR **or** screenshot, or both? Owner-configurable? (7.7)
6. Are partial payments allowed by default? (7.7)
7. ~~HRA default~~ **Resolved (DEC-13):** owner opt-in, default OFF.
8. ~~Stay-history sharing~~ **Resolved (DEC-11):** never shared.
9. ~~Past-tenant dues visible to a new owner~~ **Resolved (DEC-11):** never shared.
10. Referral reward: amount, who funds, clawback rules (7.20).
11. Masked-call vendor and cost model (7.15).
12. WhatsApp Business provider and per-message cost ownership (9.5).
13. SOS escalation timings, SMS fallback feasibility on iOS, liability copy (7.16) `[LEGAL REVIEW]`.
14. Join-request expiry (7 days), waitlist expiry (30 days), invite validity (7 days), cooldown after rejection (7 days) — confirm numbers.
15. Room-change eligibility rules (30-day lock-in, no overdue dues) (7.17).
16. Minimum registration age (16?) (EC-A13).
17. Whether rent is affected by meal opt-outs (assumed: no) (7.12).
18. Whether tenants may see the manager's direct number or only masked calls (5.1).
19. Data retention for past tenants' access (proposed 24 months) and account-deletion window (30 days) (7.24, Owner §15.3).
20. Palette/logo from the owner-side designs to replace placeholder tokens (16.6).
21. Guardian numbers are unverified (DEC-12): confirm with counsel that tenant-side consent satisfies WhatsApp Business opt-in policy and DPDP (9.1). Fallback: a config flag to re-enable a guardian-side opt-in.

---
*End of draft. Search for `[PLACEHOLDER]`, `[ASSUMPTION]`, `[LEGAL REVIEW]` and `[NEW]` to find everything that needs a decision before production; §17 lists the exact changes needed in the Owner/Admin/Staff PRDs.*
