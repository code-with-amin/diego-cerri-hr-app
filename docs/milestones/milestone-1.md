# Milestone 1: Admin Dashboard UI

**Delivery Date:** June 23, 2026
**Status:** In Progress

## Overview

HR Admin Dashboard built with Next.js 14, TypeScript, Tailwind CSS v4, and shadcn/ui. All pages are fully functional including auth, status management, analytics charts, and a bilingual EN/PT interface. Backend integration is delivered in Milestone 2.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Slate theme)
- Recharts (area + donut charts)
- Lucide React icons

## Scope

| Feature | Status |
|---------|--------|
| Project scaffold + shadcn/ui setup | ✅ Done |
| Admin login page (functional with session auth) | ✅ Done |
| Route protection via middleware | ✅ Done |
| Logout | ✅ Done |
| Dashboard — stat cards with icons | ✅ Done |
| Dashboard — submissions area line chart (7 / 14 / 30 day selector) | ✅ Done |
| Dashboard — pipeline breakdown donut chart | ✅ Done |
| Dashboard — latest candidates table preview with link to full list | ✅ Done |
| Candidates page — full listing table with search, filter, and date filter | ✅ Done |
| Candidate detail page — full profile view across 4 sections | ✅ Done |
| Status selector (functional — persists via JSON store) | ✅ Done |
| Internal notes panel (UI only) | ✅ Done |
| Responsive layout (desktop + mobile) | ✅ Done |
| EN / PT language toggle (cookie-based, no flash on refresh) | ✅ Done |
| Favicon | 🔲 Pending |
| Logo and correct product name | 🔲 Pending |
| Color alignment with client brand | 🔲 Pending |
| Login page alignment with client site theme | 🔲 Pending |

## Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@company.com` |
| Password | `Admin@2024` |

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Admin login |
| `/dashboard` | Analytics overview — stat cards, submissions chart, pipeline donut, latest candidates |
| `/dashboard/candidates` | Full candidate listing with search, status filter, and date filter |
| `/dashboard/candidates/[id]` | Candidate detail — profile sections, status selector, internal notes |

## File Structure

```
src/
├── app/
│   ├── actions/               # Server actions (status update)
│   ├── dashboard/
│   │   ├── page.tsx           # Analytics dashboard
│   │   └── candidates/
│   │       ├── page.tsx       # Candidate listing
│   │       └── [id]/page.tsx  # Candidate detail
│   ├── login/                 # Login page and auth action
│   └── layout.tsx             # Reads hr_lang cookie, wraps with LanguageProvider
├── components/
│   ├── candidates/            # Table, detail content, badges, filters, status selector, notes panel
│   ├── dashboard/             # StatCards, SubmissionsChart, PipelineChart, LatestCandidatesSection
│   ├── layout/                # Sidebar, TopBar (with lang toggle), DashboardShell
│   ├── providers/             # LanguageProvider (EN/PT context + cookie persistence)
│   └── ui/                    # shadcn primitives
└── lib/
    ├── auth.ts                # Auth constants
    ├── candidate-store.ts     # Status persistence (JSON file)
    ├── i18n.ts                # EN/PT translation strings
    ├── mock-data.ts           # 5 mock candidates
    ├── types.ts               # Candidate and CandidateStatus types
    └── utils.ts
```

## Branch

`dev` — https://github.com/code-with-amin/diego-cerri-hr-app/tree/dev
