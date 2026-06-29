# Employee Module — M1: Layout and Overall Visual Design

**Delivery Date:** TBD
**Status:** In Progress

## Overview

Visual design milestone for the worker-facing time-tracking module. No backend functionality or interactions — every element is static and presented for client approval before moving to M2. The module lives inside the existing `diego-cerri-hr-app` codebase as a new `/employee` route group, sharing the same design system (shadcn/ui, Tailwind CSS v4, lucide-react) and the existing EN/PT language toggle.

Brand reference: [KPI Engenharia](https://kpiengenharia.com.br/) — dark, professional aesthetic, white logo on dark background.

## Tech Stack

- Next.js 14 (App Router) — same codebase as admin dashboard
- TypeScript
- Tailwind CSS v4
- shadcn/ui (same component library as admin)
- lucide-react icons
- Existing `LanguageProvider` + `i18n.ts` (EN/PT toggle, new employee-specific keys added)

## Scope

| Feature | Status |
|---------|--------|
| Employee login page (visual only) | 🔲 Pending |
| Employee tracker page — sticky timer bar | 🔲 Pending |
| Employee tracker page — activity form | 🔲 Pending |
| Employee tracker page — action buttons | 🔲 Pending |
| Employee tracker page — today's history table | 🔲 Pending |
| KPI Engenharia logo on both pages | 🔲 Pending |
| PT/EN language toggle (same as admin) | 🔲 Pending |
| Fully responsive (mobile + desktop) | 🔲 Pending |

## Pages

| Route | Description |
|-------|-------------|
| `/employee/login` | Employee login — email + password, KPI logo, PT/EN toggle |
| `/employee/tracker` | Time-tracking page — sticky timer, activity form, history table |

## Page Designs

### `/employee/login`

- Full-height centered card, dark background using `--color-primary`
- KPI Engenharia logo at top (white version from client site)
- Subtitle: "Portal do Colaborador" (PT) / "Employee Portal" (EN)
- Fields: Email, Password
- Button: Sign In (primary)
- PT/EN toggle in top-right of card
- Components: shadcn Card, Input, Button, Label

### `/employee/tracker`

**Top bar**
- Left: KPI logo + app name
- Right: PT/EN toggle + Sign Out button

**Sticky timer bar** (always visible while scrolling)
- `<Clock />` Net time — `00:00:00`
- `<Coffee />` Break count — `0 breaks`
- `<DollarSign />` Current cost — `R$ 0.00`
- `<FileText />` Entry count — `0`

**Activity form**
- Project dropdown (shadcn Select)
- Client/Contract field (Input)
- Activity dropdown — 8 options: BIM Modeling, Compatibility, Technical Documentation, Project Meeting, Software Development, Drawing Review, Planning/Schedule, Internal Support
- Hourly rate field — `R$` prefix (Input)
- Work location dropdown — Remote, Office, Client Site
- Entry type dropdown — Productive Hours, Administrative Hours, Non-billable Hours
- Time entry fields (optional retroactive): Start, Break In, Break Out, End (Input with time format)
- Observations textarea

**Action buttons**
- `Start Recording` — primary
- `Register Break` — secondary
- `Resume` — secondary
- `End Activity` — destructive outline

**Today's entries table**
- Columns: Project | Activity | Start | End | Net Hours | Rate/Hour | Cost
- Empty state: "Nenhum lançamento finalizado" / "No completed entries"
- Components: shadcn Table (same style as admin candidates table)

## File Structure

```
src/
├── app/
│   └── employee/
│       ├── login/
│       │   ├── page.tsx          # Employee login page shell
│       │   └── LoginCard.tsx     # Login form card
│       └── tracker/
│           ├── page.tsx          # Tracker page shell
│           ├── TrackerHeader.tsx   # Top bar (logo, sign out, lang toggle)
│           ├── TimerBar.tsx      # Sticky timer indicator bar
│           ├── ActivityForm.tsx  # Project/activity/time fields
│           └── HistoryTable.tsx  # Today's completed entries
```

## Notes

- M1 is visual-only — no auth logic, no API calls, no timer state. All values are hardcoded/static.
- i18n keys for employee module to be added to `src/lib/i18n.ts` under `employee` namespace.
- Logo URL: `https://kpiengenharia.com.br/wp-content/uploads/2025/08/cropped-kpi-engenharia-logo-white-scaled-1-e1756850332681.png`
- M2 will add authentication, live timer logic, Supabase integration, and Power BI-ready data storage.
