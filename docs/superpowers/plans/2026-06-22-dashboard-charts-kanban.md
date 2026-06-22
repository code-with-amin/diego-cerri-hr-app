# Dashboard Charts & Candidates Kanban Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dashboard's candidate table with analytics charts, and add a dedicated `/dashboard/candidates` Kanban board page where admins can view and move candidates between status columns.

**Architecture:** The `/dashboard` route becomes a pure analytics view (stat cards + pipeline donut chart + submissions bar chart). A new `/dashboard/candidates` route shows a Kanban board with 4 columns (New, Under Review, Approved, Rejected); each card has an inline status-move action that calls the existing `updateStatusAction` server action. Charts use Recharts directly with colour values passed as `fill` props — no CSS injection needed.

**Tech Stack:** Next.js 14 App Router, Recharts, shadcn/ui Card/Badge, Tailwind CSS v4, Lucide React, existing `updateStatusAction` server action.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Add `recharts` dependency |
| `src/components/dashboard/PipelineChart.tsx` | Create | Donut chart — candidate count by status |
| `src/components/dashboard/SubmissionsChart.tsx` | Create | Bar chart — submissions per day (last 7 days) |
| `src/app/dashboard/page.tsx` | Modify | Remove CandidateTable + SearchFilterBar; add two charts |
| `src/app/dashboard/candidates/page.tsx` | Create | Kanban board server page — fetches candidates, passes to KanbanBoard |
| `src/components/candidates/KanbanBoard.tsx` | Create | Server component — renders 4 KanbanColumn components |
| `src/components/candidates/KanbanColumn.tsx` | Create | Server component — renders column header + list of CandidateCard |
| `src/components/candidates/CandidateCard.tsx` | Create | Client component — card with avatar, info, inline status-move buttons |
| `src/components/layout/Sidebar.tsx` | Modify | Fix Candidates nav link to `/dashboard/candidates`; add active-link highlight |

---

## Task 1: Install Recharts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install recharts**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npm install recharts
```

Expected: recharts added to `node_modules` and `package.json` dependencies.

- [ ] **Step 2: Verify import resolves**

```bash
node -e "require('recharts')" && echo "OK"
```

Expected output: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install recharts for dashboard charts"
```

---

## Task 2: Pipeline Donut Chart Component

**Files:**
- Create: `src/components/dashboard/PipelineChart.tsx`

Shows candidate count split by status as a donut chart (PieChart with innerRadius). Colour values are hardcoded per status — no CSS injection.

- [ ] **Step 1: Create `src/components/dashboard/PipelineChart.tsx`**

```tsx
"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CandidateStatus } from "@/lib/types"

interface PipelineChartProps {
  counts: Record<CandidateStatus, number>
}

const STATUS_META: { status: CandidateStatus; colour: string }[] = [
  { status: "New", colour: "#3b82f6" },
  { status: "Under Review", colour: "#f59e0b" },
  { status: "Approved", colour: "#22c55e" },
  { status: "Rejected", colour: "#ef4444" },
]

export function PipelineChart({ counts }: PipelineChartProps) {
  const data = STATUS_META.map(({ status, colour }) => ({
    name: status,
    value: counts[status] ?? 0,
    colour,
  }))

  const total = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Pipeline Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={76}
                strokeWidth={2}
                stroke="#fff"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.colour} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ background: entry.colour }}
              />
              <span className="text-muted-foreground truncate">{entry.name}</span>
              <span className="ml-auto font-semibold">{entry.value}</span>
            </div>
          ))}
          <div className="col-span-2 mt-1 pt-2 border-t flex justify-between text-xs font-semibold">
            <span>Total</span>
            <span>{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/PipelineChart.tsx
git commit -m "feat: add pipeline donut chart component"
```

---

## Task 3: Submissions Bar Chart Component

**Files:**
- Create: `src/components/dashboard/SubmissionsChart.tsx`

Shows number of candidate submissions per day for the last 7 days. Data is derived from `candidates[].submittedAt`. Uses `BarChart` from Recharts.

- [ ] **Step 1: Create `src/components/dashboard/SubmissionsChart.tsx`**

```tsx
"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Candidate } from "@/lib/types"

interface SubmissionsChartProps {
  candidates: Candidate[]
}

function buildDailyData(candidates: Candidate[]) {
  const today = new Date()
  const days: { date: string; label: string; submissions: number }[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const isoDate = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    days.push({ date: isoDate, label, submissions: 0 })
  }

  for (const c of candidates) {
    const isoDate = c.submittedAt.slice(0, 10)
    const bucket = days.find((d) => d.date === isoDate)
    if (bucket) bucket.submissions++
  }

  return days
}

export function SubmissionsChart({ candidates }: SubmissionsChartProps) {
  const data = buildDailyData(candidates)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Submissions — Last 7 Days
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value: number) => [value, "Submissions"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/SubmissionsChart.tsx
git commit -m "feat: add daily submissions bar chart component"
```

---

## Task 4: Refactor Dashboard Page — Charts Only

**Files:**
- Modify: `src/app/dashboard/page.tsx`

Remove `SearchFilterBar`, `CandidateTable`, and filter logic. Add `PipelineChart` and `SubmissionsChart`. Keep stat cards.

- [ ] **Step 1: Replace `src/app/dashboard/page.tsx` with**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { getCandidates } from '@/lib/candidate-store'
import { PipelineChart } from '@/components/dashboard/PipelineChart'
import { SubmissionsChart } from '@/components/dashboard/SubmissionsChart'
import { CandidateStatus } from '@/lib/types'

export default function DashboardPage() {
  const all = getCandidates()

  const statusCounts = all.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1
      return acc
    },
    {} as Record<CandidateStatus, number>,
  )

  const stats = [
    { label: 'Total Candidates', value: all.length },
    { label: 'New', value: statusCounts['New'] ?? 0 },
    { label: 'Under Review', value: statusCounts['Under Review'] ?? 0 },
    { label: 'Approved', value: statusCounts['Approved'] ?? 0 },
  ]

  return (
    <DashboardShell title="Dashboard" subtitle="Overview of your hiring pipeline">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SubmissionsChart candidates={all} />
        </div>
        <div>
          <PipelineChart counts={statusCounts} />
        </div>
      </div>
    </DashboardShell>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: replace candidate table with analytics charts on dashboard"
```

---

## Task 5: Candidate Card Component

**Files:**
- Create: `src/components/candidates/CandidateCard.tsx`

Client component — card with avatar, name, role, location. Clicking the card navigates to detail page. Bottom section shows quick-move buttons for each other status, calling `updateStatusAction`.

- [ ] **Step 1: Create `src/components/candidates/CandidateCard.tsx`**

```tsx
"use client"

import { useTransition } from "react"
import Link from "next/link"
import { MapPin, Briefcase, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Candidate, CandidateStatus } from "@/lib/types"
import { updateStatusAction } from "@/app/actions/update-status"

const STATUS_ORDER: CandidateStatus[] = ["New", "Under Review", "Approved", "Rejected"]

const STATUS_BUTTON_CLASSES: Record<CandidateStatus, string> = {
  New: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  "Under Review": "bg-amber-100 text-amber-700 hover:bg-amber-200",
  Approved: "bg-green-100 text-green-700 hover:bg-green-200",
  Rejected: "bg-red-100 text-red-700 hover:bg-red-200",
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
}

interface CandidateCardProps {
  candidate: Candidate
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const [isPending, startTransition] = useTransition()

  function moveTo(status: CandidateStatus) {
    startTransition(async () => {
      await updateStatusAction(candidate.id, status)
    })
  }

  const otherStatuses = STATUS_ORDER.filter((s) => s !== candidate.status)

  return (
    <Card className={cn("group transition-shadow hover:shadow-md", isPending && "opacity-60 pointer-events-none")}>
      <CardContent className="p-4">
        <Link
          href={`/dashboard/candidates/${candidate.id}`}
          className="flex items-start gap-3 mb-3"
        >
          <Avatar className="h-9 w-9 flex-shrink-0 mt-0.5">
            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
              {initials(candidate.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                {candidate.fullName}
              </p>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
          </div>
        </Link>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Briefcase className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{candidate.desiredRole}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{candidate.city}, {candidate.state}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wide font-medium">Move to</p>
          <div className="flex flex-wrap gap-1">
            {otherStatuses.map((status) => (
              <button
                key={status}
                onClick={() => moveTo(status)}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors cursor-pointer",
                  STATUS_BUTTON_CLASSES[status],
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/candidates/CandidateCard.tsx
git commit -m "feat: add CandidateCard with inline status-move actions"
```

---

## Task 6: Kanban Board Components

**Files:**
- Create: `src/components/candidates/KanbanColumn.tsx`
- Create: `src/components/candidates/KanbanBoard.tsx`

Server components — no interactivity here, just layout. `KanbanBoard` groups candidates by status and passes each group to `KanbanColumn`. `KanbanColumn` renders the coloured column header and stacks `CandidateCard` client components.

- [ ] **Step 1: Create `src/components/candidates/KanbanColumn.tsx`**

```tsx
import { Candidate, CandidateStatus } from "@/lib/types"
import { CandidateCard } from "./CandidateCard"

const COLUMN_META: Record<CandidateStatus, { headerClass: string; badgeClass: string }> = {
  New: {
    headerClass: "border-blue-200 bg-blue-50",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  "Under Review": {
    headerClass: "border-amber-200 bg-amber-50",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  Approved: {
    headerClass: "border-green-200 bg-green-50",
    badgeClass: "bg-green-100 text-green-700",
  },
  Rejected: {
    headerClass: "border-red-200 bg-red-50",
    badgeClass: "bg-red-100 text-red-700",
  },
}

interface KanbanColumnProps {
  status: CandidateStatus
  candidates: Candidate[]
}

export function KanbanColumn({ status, candidates }: KanbanColumnProps) {
  const meta = COLUMN_META[status]

  return (
    <div className="flex flex-col min-w-0">
      <div className={`flex items-center justify-between rounded-lg border px-3 py-2 mb-3 ${meta.headerClass}`}>
        <span className="text-sm font-semibold">{status}</span>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${meta.badgeClass}`}>
          {candidates.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {candidates.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
            No candidates
          </div>
        ) : (
          candidates.map((c) => <CandidateCard key={c.id} candidate={c} />)
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/candidates/KanbanBoard.tsx`**

```tsx
import { Candidate, CandidateStatus } from "@/lib/types"
import { KanbanColumn } from "./KanbanColumn"

const STATUSES: CandidateStatus[] = ["New", "Under Review", "Approved", "Rejected"]

interface KanbanBoardProps {
  candidates: Candidate[]
}

export function KanbanBoard({ candidates }: KanbanBoardProps) {
  const grouped = STATUSES.reduce(
    (acc, status) => {
      acc[status] = candidates.filter((c) => c.status === status)
      return acc
    },
    {} as Record<CandidateStatus, Candidate[]>,
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {STATUSES.map((status) => (
        <KanbanColumn key={status} status={status} candidates={grouped[status]} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/candidates/KanbanBoard.tsx src/components/candidates/KanbanColumn.tsx
git commit -m "feat: add KanbanBoard and KanbanColumn components"
```

---

## Task 7: Candidates Kanban Page

**Files:**
- Create: `src/app/dashboard/candidates/page.tsx`

Server component at `/dashboard/candidates`. Note: this file coexists with `src/app/dashboard/candidates/[id]/page.tsx` — Next.js App Router treats `page.tsx` as the index and `[id]` as the dynamic segment, so there is no conflict.

- [ ] **Step 1: Create `src/app/dashboard/candidates/page.tsx`**

```tsx
import { DashboardShell } from '@/components/layout/DashboardShell'
import { KanbanBoard } from '@/components/candidates/KanbanBoard'
import { getCandidates } from '@/lib/candidate-store'

export default function CandidatesPage() {
  const candidates = getCandidates()

  return (
    <DashboardShell
      title="Candidates"
      subtitle={`${candidates.length} total — use quick-move buttons on each card to update status`}
    >
      <KanbanBoard candidates={candidates} />
    </DashboardShell>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/candidates/page.tsx
git commit -m "feat: add /dashboard/candidates kanban board page"
```

---

## Task 8: Fix Sidebar Navigation with Active-Link Highlighting

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`

The Sidebar must become a client component to use `usePathname`. Update the Candidates link href to `/dashboard/candidates`. Add active-link highlighting: Dashboard is active only on exact `/dashboard` match; Candidates is active on any `/dashboard/candidates` path.

- [ ] **Step 1: Replace `src/components/layout/Sidebar.tsx` with**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { logoutAction } from '@/app/login/actions'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Candidates', href: '/dashboard/candidates', icon: Users, exact: false },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col bg-slate-900 text-slate-100 flex-shrink-0">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          HR
        </div>
        <span className="font-semibold text-sm tracking-wide">HR Admin</span>
      </div>

      <Separator className="bg-slate-700" />

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-slate-700" />

      <div className="px-4 py-4 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
            HR
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-200 truncate">HR Manager</p>
          <p className="text-xs text-slate-500 truncate">admin@company.com</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            title="Sign out"
            className="text-slate-500 hover:text-slate-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Sidebar.tsx
git commit -m "feat: fix sidebar Candidates link and add active-link highlighting"
```

---

## Task 9: Dev Server Smoke Test + Push

- [ ] **Step 1: Start dev server**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npm run dev
```

Open http://localhost:3000 in browser. Log in with `admin@company.com` / `Admin@2024`.

- [ ] **Step 2: Verify each route**

- `/dashboard` — stat cards + bar chart + donut chart visible, no candidate table
- `/dashboard/candidates` — 4-column Kanban board, candidates in correct columns, coloured headers
- Click "Under Review" button on a New card → page reloads, card moves column
- Click a candidate name → navigates to `/dashboard/candidates/[id]`
- Sidebar: Dashboard link highlighted on `/dashboard`, Candidates highlighted on `/dashboard/candidates` and `/dashboard/candidates/[id]`

- [ ] **Step 3: Push**

```bash
git push origin dev
```

---

## Self-Review

**Spec coverage:**
- Progress chart on dashboard — Task 2 (donut) + Task 3 (bar)
- Graphics for non-tech client — colourful donut with legend, blue bar chart, coloured Kanban column headers
- Candidates only on candidates page — Task 4 removes table from dashboard; Task 7 adds Kanban page at `/dashboard/candidates`
- Candidates interactive with each other — Kanban board shows all candidates side-by-side across status columns; quick-move buttons let admin change status directly from the board

**Placeholder scan:** All code blocks are complete. No TBD or TODO.

**Type consistency:**
- `CandidateStatus` imported from `@/lib/types` everywhere
- `updateStatusAction(candidateId: string, status: CandidateStatus)` — matches `src/app/actions/update-status.ts`
- `getCandidates()` returns `Candidate[]` — consumed correctly in dashboard and candidates pages
