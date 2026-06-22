# Milestone 1: Admin Dashboard UI (Static) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully static, clickable HR Admin Dashboard UI using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui — candidate list, candidate detail, status controls, internal notes section, and search/filter — with no backend dependency.

**Architecture:** Single Next.js 14 App Router project with all pages under `src/app/`. Mock data lives in `src/lib/mock-data.ts` and is imported directly into server components. Navigation is handled by Next.js `<Link>`. shadcn/ui provides all UI primitives; custom components compose them.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS 3, shadcn/ui, Radix UI, Lucide React, clsx / tailwind-merge (installed by shadcn)

---

## File Map

| Path | Purpose |
|------|---------|
| `src/lib/types.ts` | Shared TypeScript types (`Candidate`, `CandidateStatus`) |
| `src/lib/mock-data.ts` | Typed mock candidates array |
| `src/lib/utils.ts` | `cn()` helper — auto-created by shadcn init |
| `src/components/ui/*` | shadcn/ui primitives — auto-generated, never hand-edited |
| `src/components/layout/Sidebar.tsx` | Left nav sidebar |
| `src/components/layout/TopBar.tsx` | Top bar with page title |
| `src/components/layout/DashboardShell.tsx` | Sidebar + TopBar + `{children}` wrapper |
| `src/components/candidates/StatusBadge.tsx` | Colored Badge for candidate status |
| `src/components/candidates/SearchFilterBar.tsx` | Search Input + status Select + date Input |
| `src/components/candidates/CandidateTable.tsx` | shadcn Table with candidate rows |
| `src/components/candidates/StatusSelector.tsx` | Button group for status change (UI only) |
| `src/components/candidates/InternalNotesPanel.tsx` | Card with Textarea + disabled Button |
| `src/components/candidates/ProfileSection.tsx` | Card rendering a labeled field group |
| `src/app/layout.tsx` | Root layout (font, body class) |
| `src/app/page.tsx` | Redirect to `/dashboard` |
| `src/app/dashboard/page.tsx` | Candidate listing page |
| `src/app/dashboard/candidates/[id]/page.tsx` | Candidate detail page |
| `src/app/login/page.tsx` | Static manager login page |

---

## Task 1: Scaffold Project and Install shadcn/ui

**Files:**
- Create: all project root files via CLI

- [ ] **Step 1: Scaffold Next.js 14**

```bash
cd /Users/user/Documents/diego-cerri-hr-app
npx create-next-app@14 . \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-eslint \
  --no-git
```

Accept all defaults when prompted.

- [ ] **Step 2: Initialise shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted, choose:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

This creates `src/lib/utils.ts`, updates `tailwind.config.ts`, and adds CSS variables to `src/app/globals.css`.

- [ ] **Step 3: Install all required shadcn components**

```bash
npx shadcn@latest add button badge card input select textarea table avatar separator
```

This generates files under `src/components/ui/`.

- [ ] **Step 4: Install Lucide React (already a peer dep — verify)**

```bash
npm list lucide-react
```

Expected: `lucide-react@x.x.x` listed. If missing: `npm install lucide-react`.

- [ ] **Step 5: Clean boilerplate**

Replace `src/app/page.tsx`:

```tsx
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
```

Replace `src/app/globals.css` — keep only the shadcn CSS variable block that `shadcn init` already wrote (do not replace it — just delete the default Next.js demo styles below the `@tailwind` lines and the `:root` block). The file after init will already have the correct structure; leave it as-is.

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: server at `http://localhost:3000`, redirects to `/dashboard` (404 for now). No TypeScript errors in terminal.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 + shadcn/ui with slate theme"
```

---

## Task 2: Define Types and Mock Data

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/mock-data.ts`

- [ ] **Step 1: Create types**

Create `src/lib/types.ts`:

```ts
export type CandidateStatus = 'New' | 'Under Review' | 'Approved' | 'Rejected'

export interface Candidate {
  id: string
  fullName: string
  email: string
  phone: string
  city: string
  state: string
  linkedIn?: string
  portfolio?: string
  desiredRole: string
  areaOfExpertise: string
  yearsOfExperience: number
  currentEmploymentStatus: string
  salaryExpectation: string
  availabilityDate: string
  preferredWorkModel: 'Onsite' | 'Hybrid' | 'Remote'
  degreeLevel: string
  courseMajor: string
  institution: string
  certifications: string[]
  languages: string[]
  professionalSummary: string
  keyTechnicalSkills: string[]
  softwareTools: string[]
  mainAchievements: string
  resumeFileName?: string
  submittedAt: string
  lastUpdatedAt: string
  status: CandidateStatus
  internalNotes?: string
}
```

- [ ] **Step 2: Create mock data**

Create `src/lib/mock-data.ts`:

```ts
import { Candidate } from './types'

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    fullName: 'Ana Oliveira',
    email: 'ana.oliveira@email.com',
    phone: '+55 11 99999-1111',
    city: 'São Paulo',
    state: 'SP',
    linkedIn: 'linkedin.com/in/anaoliveira',
    portfolio: 'anaoliveira.dev',
    desiredRole: 'Frontend Developer',
    areaOfExpertise: 'Web Development',
    yearsOfExperience: 5,
    currentEmploymentStatus: 'Employed',
    salaryExpectation: 'R$ 8.000 – R$ 10.000',
    availabilityDate: '2026-07-15',
    preferredWorkModel: 'Hybrid',
    degreeLevel: "Bachelor's",
    courseMajor: 'Computer Science',
    institution: 'USP',
    certifications: ['AWS Cloud Practitioner'],
    languages: ['Portuguese', 'English'],
    professionalSummary: 'Senior frontend developer with 5 years building React applications for fintech companies.',
    keyTechnicalSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    softwareTools: ['VS Code', 'Figma', 'GitHub'],
    mainAchievements: 'Led migration of legacy jQuery app to React, reducing load time by 40%.',
    resumeFileName: 'ana-oliveira-resume.pdf',
    submittedAt: '2026-06-18T10:23:00Z',
    lastUpdatedAt: '2026-06-18T10:23:00Z',
    status: 'Under Review',
    internalNotes: 'Strong portfolio. Schedule technical interview.',
  },
  {
    id: '2',
    fullName: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    phone: '+55 21 98888-2222',
    city: 'Rio de Janeiro',
    state: 'RJ',
    linkedIn: 'linkedin.com/in/carlosmendes',
    desiredRole: 'Backend Developer',
    areaOfExpertise: 'API Development',
    yearsOfExperience: 3,
    currentEmploymentStatus: 'Freelancer',
    salaryExpectation: 'R$ 6.000 – R$ 8.000',
    availabilityDate: '2026-08-01',
    preferredWorkModel: 'Remote',
    degreeLevel: "Bachelor's",
    courseMajor: 'Systems Analysis',
    institution: 'UERJ',
    certifications: [],
    languages: ['Portuguese', 'Spanish'],
    professionalSummary: 'Backend developer specialising in Node.js REST APIs and PostgreSQL.',
    keyTechnicalSkills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
    softwareTools: ['VS Code', 'Postman', 'GitHub'],
    mainAchievements: 'Built a payment gateway integration handling 50k transactions/day.',
    resumeFileName: 'carlos-mendes-resume.pdf',
    submittedAt: '2026-06-19T14:05:00Z',
    lastUpdatedAt: '2026-06-20T09:00:00Z',
    status: 'New',
  },
  {
    id: '3',
    fullName: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    phone: '+55 31 97777-3333',
    city: 'Belo Horizonte',
    state: 'MG',
    linkedIn: 'linkedin.com/in/fernandalima',
    desiredRole: 'UX Designer',
    areaOfExpertise: 'Product Design',
    yearsOfExperience: 7,
    currentEmploymentStatus: 'Employed',
    salaryExpectation: 'R$ 9.000 – R$ 12.000',
    availabilityDate: '2026-09-01',
    preferredWorkModel: 'Remote',
    degreeLevel: "Master's",
    courseMajor: 'Design',
    institution: 'UFMG',
    certifications: ['Google UX Design Certificate'],
    languages: ['Portuguese', 'English', 'French'],
    professionalSummary: 'UX designer with 7 years creating user-centred digital products across healthcare and retail.',
    keyTechnicalSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    softwareTools: ['Figma', 'Maze', 'Notion'],
    mainAchievements: 'Redesigned onboarding flow increasing activation rate by 28%.',
    resumeFileName: 'fernanda-lima-resume.pdf',
    submittedAt: '2026-06-20T08:30:00Z',
    lastUpdatedAt: '2026-06-21T11:15:00Z',
    status: 'Approved',
    internalNotes: 'Excellent fit. Offer letter in progress.',
  },
  {
    id: '4',
    fullName: 'Rafael Costa',
    email: 'rafael.costa@email.com',
    phone: '+55 41 96666-4444',
    city: 'Curitiba',
    state: 'PR',
    desiredRole: 'DevOps Engineer',
    areaOfExpertise: 'Cloud Infrastructure',
    yearsOfExperience: 2,
    currentEmploymentStatus: 'Student',
    salaryExpectation: 'R$ 4.000 – R$ 5.500',
    availabilityDate: '2026-07-01',
    preferredWorkModel: 'Onsite',
    degreeLevel: "Bachelor's",
    courseMajor: 'Information Technology',
    institution: 'UTFPR',
    certifications: ['AWS Solutions Architect Associate'],
    languages: ['Portuguese', 'English'],
    professionalSummary: 'Junior DevOps engineer with hands-on experience in CI/CD pipelines and Kubernetes.',
    keyTechnicalSkills: ['Docker', 'Kubernetes', 'Terraform', 'AWS'],
    softwareTools: ['GitHub Actions', 'Grafana', 'Datadog'],
    mainAchievements: 'Implemented GitOps workflow reducing deployment time from 45 min to 8 min.',
    submittedAt: '2026-06-21T16:45:00Z',
    lastUpdatedAt: '2026-06-21T16:45:00Z',
    status: 'Rejected',
    internalNotes: 'Good potential but insufficient experience for current seniority requirement.',
  },
  {
    id: '5',
    fullName: 'Beatriz Santos',
    email: 'beatriz.santos@email.com',
    phone: '+55 51 95555-5555',
    city: 'Porto Alegre',
    state: 'RS',
    linkedIn: 'linkedin.com/in/beatrizsantos',
    desiredRole: 'Data Analyst',
    areaOfExpertise: 'Business Intelligence',
    yearsOfExperience: 4,
    currentEmploymentStatus: 'Unemployed',
    salaryExpectation: 'R$ 5.500 – R$ 7.000',
    availabilityDate: '2026-06-30',
    preferredWorkModel: 'Hybrid',
    degreeLevel: "Bachelor's",
    courseMajor: 'Statistics',
    institution: 'UFRGS',
    certifications: ['Google Data Analytics'],
    languages: ['Portuguese', 'English'],
    professionalSummary: 'Data analyst experienced in building BI dashboards and ETL pipelines for retail companies.',
    keyTechnicalSkills: ['Python', 'SQL', 'Power BI', 'dbt'],
    softwareTools: ['Power BI', 'BigQuery', 'Metabase'],
    mainAchievements: 'Built sales forecasting model that improved inventory accuracy by 22%.',
    resumeFileName: 'beatriz-santos-resume.pdf',
    submittedAt: '2026-06-22T09:00:00Z',
    lastUpdatedAt: '2026-06-22T09:00:00Z',
    status: 'New',
  },
]
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/mock-data.ts
git commit -m "feat: add candidate types and mock data"
```

---

## Task 3: Root Layout with Inter Font

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HR Admin Dashboard',
  description: 'Internal HR candidate management system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: configure Inter font in root layout"
```

---

## Task 4: Layout Components — Sidebar, TopBar, DashboardShell

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/TopBar.tsx`
- Create: `src/components/layout/DashboardShell.tsx`

- [ ] **Step 1: Create Sidebar**

Create `src/components/layout/Sidebar.tsx`:

```tsx
import Link from 'next/link'
import { LayoutDashboard, Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Candidates', href: '/dashboard', icon: Users },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col bg-slate-900 text-slate-100 flex-shrink-0">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          HR
        </div>
        <span className="font-semibold text-sm tracking-wide">HR Admin</span>
      </div>

      <Separator className="bg-slate-700" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-slate-700" />

      {/* Manager account */}
      <div className="px-4 py-4 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
            HR
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-200 truncate">HR Manager</p>
          <p className="text-xs text-slate-500 truncate">admin@company.com</p>
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create TopBar**

Create `src/components/layout/TopBar.tsx`:

```tsx
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <>
      <header className="flex h-16 items-center justify-between bg-background px-6 flex-shrink-0">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              HR
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <Separator />
    </>
  )
}
```

- [ ] **Step 3: Create DashboardShell**

Create `src/components/layout/DashboardShell.tsx`:

```tsx
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface DashboardShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function DashboardShell({ children, title, subtitle }: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add Sidebar, TopBar, and DashboardShell using shadcn Avatar, Button, Separator"
```

---

## Task 5: StatusBadge Component

**Files:**
- Create: `src/components/candidates/StatusBadge.tsx`

- [ ] **Step 1: Create StatusBadge**

Create `src/components/candidates/StatusBadge.tsx`:

```tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CandidateStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: CandidateStatus
}

const statusClasses: Record<CandidateStatus, string> = {
  New:            'bg-sky-100 text-sky-700 hover:bg-sky-100 border-sky-200',
  'Under Review': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
  Approved:       'bg-green-100 text-green-700 hover:bg-green-100 border-green-200',
  Rejected:       'bg-red-100 text-red-700 hover:bg-red-100 border-red-200',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', statusClasses[status])}
    >
      {status}
    </Badge>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/candidates/StatusBadge.tsx
git commit -m "feat: add StatusBadge using shadcn Badge"
```

---

## Task 6: SearchFilterBar Component

**Files:**
- Create: `src/components/candidates/SearchFilterBar.tsx`

- [ ] **Step 1: Create SearchFilterBar**

Create `src/components/candidates/SearchFilterBar.tsx`:

```tsx
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SearchFilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or role…"
          className="pl-9"
          readOnly
        />
      </div>

      {/* Status filter */}
      <Select disabled>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Under Review">Under Review</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      {/* Date filter */}
      <Input type="date" className="w-[160px]" readOnly />

      <span className="ml-auto text-xs text-muted-foreground">Showing all candidates</span>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/candidates/SearchFilterBar.tsx
git commit -m "feat: add static SearchFilterBar using shadcn Input and Select"
```

---

## Task 7: CandidateTable Component

**Files:**
- Create: `src/components/candidates/CandidateTable.tsx`

- [ ] **Step 1: Create CandidateTable**

Create `src/components/candidates/CandidateTable.tsx`:

```tsx
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Candidate } from '@/lib/types'
import { StatusBadge } from './StatusBadge'

interface CandidateTableProps {
  candidates: Candidate[]
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Work Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {initials(candidate.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{candidate.fullName}</p>
                      <p className="text-xs text-muted-foreground">{candidate.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{candidate.desiredRole}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {candidate.city}, {candidate.state}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {candidate.preferredWorkModel}
                </TableCell>
                <TableCell>
                  <StatusBadge status={candidate.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(candidate.submittedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" variant="default">
                    <Link href={`/dashboard/candidates/${candidate.id}`}>View Profile</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/candidates/CandidateTable.tsx
git commit -m "feat: add CandidateTable using shadcn Table, Avatar, Button"
```

---

## Task 8: Dashboard Listing Page

**Files:**
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create listing page**

Create `src/app/dashboard/page.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SearchFilterBar } from '@/components/candidates/SearchFilterBar'
import { CandidateTable } from '@/components/candidates/CandidateTable'
import { mockCandidates } from '@/lib/mock-data'

function getStats(candidates: typeof mockCandidates) {
  return [
    { label: 'Total Candidates', value: candidates.length },
    { label: 'New', value: candidates.filter((c) => c.status === 'New').length },
    { label: 'Under Review', value: candidates.filter((c) => c.status === 'Under Review').length },
    { label: 'Approved', value: candidates.filter((c) => c.status === 'Approved').length },
  ]
}

export default function DashboardPage() {
  const stats = getStats(mockCandidates)

  return (
    <DashboardShell
      title="Candidates"
      subtitle={`${mockCandidates.length} total registrations`}
    >
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

      <SearchFilterBar />
      <CandidateTable candidates={mockCandidates} />
    </DashboardShell>
  )
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000/dashboard`. Expected: sidebar, top bar, 4 stat cards, search bar, table of 5 candidates, each with a "View Profile" button.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: add candidate listing dashboard page"
```

---

## Task 9: StatusSelector Component (UI Only)

**Files:**
- Create: `src/components/candidates/StatusSelector.tsx`

- [ ] **Step 1: Create StatusSelector**

Create `src/components/candidates/StatusSelector.tsx`:

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CandidateStatus } from '@/lib/types'

const STATUSES: CandidateStatus[] = ['New', 'Under Review', 'Approved', 'Rejected']

const activeVariantClasses: Record<CandidateStatus, string> = {
  New:            'bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-100',
  'Under Review': 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100',
  Approved:       'bg-green-100 text-green-700 border-green-300 hover:bg-green-100',
  Rejected:       'bg-red-100 text-red-700 border-red-300 hover:bg-red-100',
}

interface StatusSelectorProps {
  currentStatus: CandidateStatus
}

export function StatusSelector({ currentStatus }: StatusSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Application Status
      </p>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => {
          const isActive = status === currentStatus
          return (
            <Button
              key={status}
              type="button"
              variant="outline"
              size="sm"
              disabled
              className={cn(
                'cursor-default',
                isActive && activeVariantClasses[status],
              )}
            >
              {status}
            </Button>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Status changes will be functional in Milestone 2.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/candidates/StatusSelector.tsx
git commit -m "feat: add static StatusSelector using shadcn Button"
```

---

## Task 10: InternalNotesPanel Component (UI Only)

**Files:**
- Create: `src/components/candidates/InternalNotesPanel.tsx`

- [ ] **Step 1: Create InternalNotesPanel**

Create `src/components/candidates/InternalNotesPanel.tsx`:

```tsx
import { Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface InternalNotesPanelProps {
  notes?: string
}

export function InternalNotesPanel({ notes }: InternalNotesPanelProps) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm text-amber-800">
            <Lock className="h-4 w-4" />
            Internal HR Notes
          </CardTitle>
          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-100">
            HR Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          rows={4}
          defaultValue={notes ?? ''}
          placeholder="Add internal notes visible only to HR managers…"
          className="resize-none bg-white border-amber-200 focus-visible:ring-amber-300"
          readOnly
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-amber-700">Never visible to candidates.</p>
          <Button size="sm" disabled className="opacity-60">
            Save Note
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/candidates/InternalNotesPanel.tsx
git commit -m "feat: add static InternalNotesPanel using shadcn Card, Textarea, Button, Badge"
```

---

## Task 11: ProfileSection Component

**Files:**
- Create: `src/components/candidates/ProfileSection.tsx`

- [ ] **Step 1: Create ProfileSection**

Create `src/components/candidates/ProfileSection.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface Field {
  label: string
  value: string | number | string[] | undefined
}

interface ProfileSectionProps {
  title: string
  fields: Field[]
}

function renderValue(value: Field['value']): string {
  if (value === undefined || value === null || value === '') return '—'
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '—'
  return String(value)
}

export function ProfileSection({ title, fields }: ProfileSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs font-medium text-muted-foreground">{field.label}</dt>
              <dd className="mt-0.5 text-sm break-words">{renderValue(field.value)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/candidates/ProfileSection.tsx
git commit -m "feat: add ProfileSection using shadcn Card and Separator"
```

---

## Task 12: Candidate Detail Page

**Files:**
- Create: `src/app/dashboard/candidates/[id]/page.tsx`

- [ ] **Step 1: Create detail page**

Create `src/app/dashboard/candidates/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { mockCandidates } from '@/lib/mock-data'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/candidates/StatusBadge'
import { StatusSelector } from '@/components/candidates/StatusSelector'
import { InternalNotesPanel } from '@/components/candidates/InternalNotesPanel'
import { ProfileSection } from '@/components/candidates/ProfileSection'

interface PageProps {
  params: { id: string }
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function CandidateDetailPage({ params }: PageProps) {
  const candidate = mockCandidates.find((c) => c.id === params.id)
  if (!candidate) notFound()

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <DashboardShell
      title={candidate.fullName}
      subtitle={`${candidate.desiredRole} · Submitted ${fmt(candidate.submittedAt)}`}
    >
      <Button asChild variant="ghost" size="sm" className="mb-5 -ml-2 text-muted-foreground">
        <Link href="/dashboard">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to candidates
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: profile sections */}
        <div className="lg:col-span-2 space-y-5">
          <ProfileSection
            title="Basic Information"
            fields={[
              { label: 'Full Name', value: candidate.fullName },
              { label: 'Email', value: candidate.email },
              { label: 'Phone', value: candidate.phone },
              { label: 'Location', value: `${candidate.city}, ${candidate.state}` },
              { label: 'LinkedIn', value: candidate.linkedIn },
              { label: 'Portfolio / Website', value: candidate.portfolio },
            ]}
          />
          <ProfileSection
            title="Professional Information"
            fields={[
              { label: 'Desired Role', value: candidate.desiredRole },
              { label: 'Area of Expertise', value: candidate.areaOfExpertise },
              { label: 'Years of Experience', value: `${candidate.yearsOfExperience} years` },
              { label: 'Employment Status', value: candidate.currentEmploymentStatus },
              { label: 'Salary Expectation', value: candidate.salaryExpectation },
              { label: 'Availability Date', value: candidate.availabilityDate },
              { label: 'Work Model', value: candidate.preferredWorkModel },
            ]}
          />
          <ProfileSection
            title="Education & Qualifications"
            fields={[
              { label: 'Degree Level', value: candidate.degreeLevel },
              { label: 'Course / Major', value: candidate.courseMajor },
              { label: 'Institution', value: candidate.institution },
              { label: 'Certifications', value: candidate.certifications },
              { label: 'Languages', value: candidate.languages },
            ]}
          />
          <ProfileSection
            title="Experience Summary"
            fields={[
              { label: 'Professional Summary', value: candidate.professionalSummary },
              { label: 'Key Technical Skills', value: candidate.keyTechnicalSkills },
              { label: 'Software / Tools', value: candidate.softwareTools },
              { label: 'Main Projects & Achievements', value: candidate.mainAchievements },
            ]}
          />
        </div>

        {/* Right column: HR controls */}
        <div className="space-y-5">
          {/* Candidate summary card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {initials(candidate.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{candidate.fullName}</p>
                  <p className="text-sm text-muted-foreground">{candidate.desiredRole}</p>
                </div>
                <StatusBadge status={candidate.status} />
              </div>

              <Separator className="my-4" />

              <dl className="space-y-3 text-sm">
                {[
                  { label: 'Submitted', value: fmt(candidate.submittedAt) },
                  { label: 'Last Updated', value: fmt(candidate.lastUpdatedAt) },
                  { label: 'Work Model', value: candidate.preferredWorkModel },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd className="font-medium">{item.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Resume (UI only) */}
              {candidate.resumeFileName && (
                <>
                  <Separator className="my-4" />
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    {candidate.resumeFileName}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Status selector */}
          <Card>
            <CardContent className="pt-5">
              <StatusSelector currentStatus={candidate.status} />
            </CardContent>
          </Card>

          {/* Internal notes */}
          <InternalNotesPanel notes={candidate.internalNotes} />
        </div>
      </div>
    </DashboardShell>
  )
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/dashboard/candidates/1`.

Expected:
- Two-column layout on desktop, single column on mobile
- All four profile sections on the left
- Summary card, status selector, and notes panel on the right
- Back button returns to `/dashboard`
- `/dashboard/candidates/999` shows Next.js 404

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/candidates/
git commit -m "feat: add candidate detail page with shadcn Card, Avatar, Button, Separator"
```

---

## Task 13: Static Login Page

**Files:**
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Create login page**

Create `src/app/login/page.tsx`:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            HR
          </div>
          <h1 className="text-xl font-semibold">HR Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Sign in to access the dashboard</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  autoComplete="email"
                  readOnly
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  readOnly
                />
              </div>
              <Button type="button" className="w-full mt-2">
                Sign in
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Authentication will be functional in Milestone 2.
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Restricted to authorised HR personnel only.
        </p>
      </div>
    </div>
  )
}
```

Note: `Label` is not in the batch install. Install it first:

```bash
npx shadcn@latest add label
```

- [ ] **Step 2: Verify login page at `http://localhost:3000/login`**

Expected: centred card with logo, email input, password input, and Sign in button.

- [ ] **Step 3: Commit**

```bash
git add src/app/login/page.tsx
git commit -m "feat: add static login page using shadcn Card, Input, Button, Label"
```

---

## Task 14: Final Build Verification

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: clean build, all routes statically generated.

- [ ] **Step 3: Smoke test production**

```bash
npm run start
```

Verify in browser:
- `/dashboard` — stat cards + table
- `/dashboard/candidates/1` — full detail, shadcn components render correctly
- `/login` — login card
- Back button on detail page returns to list

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: milestone 1 complete — static HR admin dashboard UI with shadcn/ui"
```

---

## Self-Review Checklist

### Spec Coverage

| Milestone 1 Requirement | Task |
|---|---|
| HR/Admin dashboard UI | Task 8 |
| Candidate listing page (UI only) | Task 7, 8 |
| Candidate detail view layout | Task 12 |
| Status control interface (UI only) | Task 9 |
| Internal notes section (non-functional) | Task 10 |
| Search & filter UI mockup | Task 6 |
| Responsive layout (desktop + mobile) | Task 4 (DashboardShell hides sidebar on mobile), Task 7 (table overflow-x) |
| Clickable navigation flow | Tasks 7, 12 (Link + Button asChild) |
| Static login page | Task 13 |
| Brand-consistent visual style | Tasks 1 (shadcn slate theme), 5 (StatusBadge color map) |

All Milestone 1 scope items covered. No gaps.

### shadcn Components Used

| Component | Installed in |
|---|---|
| `button` | Task 1 batch install |
| `badge` | Task 1 batch install |
| `card` | Task 1 batch install |
| `input` | Task 1 batch install |
| `select` | Task 1 batch install |
| `textarea` | Task 1 batch install |
| `table` | Task 1 batch install |
| `avatar` | Task 1 batch install |
| `separator` | Task 1 batch install |
| `label` | Task 13 (separate install) |

### Type Consistency

- `CandidateStatus` defined in Task 2, used in `StatusBadge` (Task 5), `StatusSelector` (Task 9) — consistent.
- `Candidate` interface defined in Task 2, `mockCandidates: Candidate[]` in Task 2 — consistent.
- `ProfileSection` `fields: Field[]` type defined locally, used in Task 12 — consistent.
- `DashboardShell` `{ title, subtitle? }` props match all usages in Tasks 8, 12, 13 — consistent.
- `initials()` helper duplicated in Task 7 and Task 12 (acceptable — both are server components and the function is trivial).
