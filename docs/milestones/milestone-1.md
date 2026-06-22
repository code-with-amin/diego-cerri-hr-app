# Milestone 1: Admin Dashboard UI

**Delivery Date:** June 23, 2026
**Status:** In Progress

## Overview

Static HR Admin Dashboard prototype built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. All pages are functional for navigation and layout review. Backend integration is delivered in Milestone 2.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Slate theme)
- Lucide React icons

## Scope

| Feature | Status |
|---------|--------|
| Project scaffold + shadcn/ui setup | ✅ Done |
| Candidate listing page with stat cards | ✅ Done |
| Search, filter, and date filter (functional) | ✅ Done |
| Candidate detail page — full profile view | ✅ Done |
| Status selector (functional — persists via JSON store) | ✅ Done |
| Internal notes panel (UI only) | ✅ Done |
| Admin login page (functional with session auth) | ✅ Done |
| Route protection via middleware | ✅ Done |
| Logout | ✅ Done |
| Responsive layout (desktop + mobile) | ✅ Done |
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
| `/dashboard` | Candidate listing with stat cards, search, and filters |
| `/dashboard/candidates/[id]` | Candidate detail with profile sections and HR controls |

## File Structure

```
src/
├── app/
│   ├── actions/          # Server actions (status update)
│   ├── dashboard/        # Listing and detail pages
│   ├── login/            # Login page and auth action
│   └── layout.tsx
├── components/
│   ├── candidates/       # Table, badges, filters, status selector, notes panel
│   └── layout/           # Sidebar, TopBar, DashboardShell
└── lib/
    ├── auth.ts           # Auth constants
    ├── candidate-store.ts # Status persistence (JSON file)
    ├── mock-data.ts      # 5 mock candidates
    └── types.ts          # Candidate and CandidateStatus types
```

## Branch

`dev` — https://github.com/code-with-amin/diego-cerri-hr-app/tree/dev
