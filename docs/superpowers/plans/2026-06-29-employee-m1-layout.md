# Employee Module M1 — Layout and Overall Visual Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the visual shell of the employee time-tracking module — login page and tracker page — as static UI for client approval. No backend, no state, no interactions.

**Architecture:** Two new route groups under `src/app/employee/`: a login page mirroring the admin login style, and a tracker page with a sticky timer bar, activity form, and history table. All components are static for M1. The existing `LanguageProvider` and `i18n.ts` are extended with employee-specific keys.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI select), lucide-react

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/lib/i18n.ts` | Add employee i18n keys (EN + PT) |
| Create | `src/app/employee/login/page.tsx` | Login page shell |
| Create | `src/app/employee/login/LoginCard.tsx` | Login form card (visual only) |
| Create | `src/app/employee/tracker/page.tsx` | Tracker page shell |
| Create | `src/app/employee/tracker/TrackerHeader.tsx` | Top bar — logo, lang toggle, sign out |
| Create | `src/app/employee/tracker/TimerBar.tsx` | Sticky timer bar — 4 live indicators |
| Create | `src/app/employee/tracker/ActivityForm.tsx` | Full activity form + action buttons |
| Create | `src/app/employee/tracker/HistoryTable.tsx` | Today's entries table (empty state) |

---

## Task 1: Add employee i18n keys

**Files:**
- Modify: `src/lib/i18n.ts`

- [ ] **Step 1: Add EN keys to `translations.en`**

In `src/lib/i18n.ts`, add the following inside the `en: { ... }` object (before the closing `}`):

```typescript
    // Employee module
    emp_portal: 'Employee Portal',
    emp_login_description: 'Sign in to track your hours',
    emp_login_restricted: 'Access restricted to approved employees only.',
    emp_sign_out: 'Sign Out',
    emp_net_time: 'Net Time',
    emp_breaks: 'Breaks',
    emp_cost: 'Cost',
    emp_entries: 'Entries',
    emp_project: 'Project',
    emp_client: 'Client / Contract',
    emp_activity: 'Activity',
    emp_hourly_rate: 'Hourly Rate',
    emp_location: 'Work Location',
    emp_entry_type: 'Entry Type',
    emp_location_remote: 'Remote',
    emp_location_office: 'Office',
    emp_location_client: 'Client Site',
    emp_type_productive: 'Productive Hours',
    emp_type_admin: 'Administrative Hours',
    emp_type_nonbillable: 'Non-billable Hours',
    emp_time_start: 'Start',
    emp_time_break_in: 'Break In',
    emp_time_break_out: 'Break Out',
    emp_time_end: 'End',
    emp_time_optional: 'Retroactive entry (optional)',
    emp_observations: 'Observations',
    emp_btn_start: 'Start Recording',
    emp_btn_break: 'Register Break',
    emp_btn_resume: 'Resume',
    emp_btn_end: 'End Activity',
    emp_history_title: "Today's Entries",
    emp_history_empty: 'No completed entries',
    emp_col_project: 'Project',
    emp_col_activity: 'Activity',
    emp_col_start: 'Start',
    emp_col_end: 'End',
    emp_col_net_hours: 'Net Hours',
    emp_col_rate: 'Rate/Hour',
    emp_col_cost: 'Cost',
    emp_activity_bim: 'BIM Modeling',
    emp_activity_compat: 'Compatibility',
    emp_activity_docs: 'Technical Documentation',
    emp_activity_meeting: 'Project Meeting',
    emp_activity_software: 'Software Development',
    emp_activity_review: 'Drawing Review',
    emp_activity_planning: 'Planning / Schedule',
    emp_activity_support: 'Internal Support',
```

- [ ] **Step 2: Add PT keys to `translations.pt`**

In `src/lib/i18n.ts`, add the following inside the `pt: { ... }` object (before the closing `}`):

```typescript
    // Employee module
    emp_portal: 'Portal do Colaborador',
    emp_login_description: 'Entre para registrar suas horas',
    emp_login_restricted: 'Acesso restrito a colaboradores aprovados.',
    emp_sign_out: 'Sair',
    emp_net_time: 'Tempo Líquido',
    emp_breaks: 'Pausas',
    emp_cost: 'Custo',
    emp_entries: 'Lançamentos',
    emp_project: 'Projeto',
    emp_client: 'Cliente / Contrato',
    emp_activity: 'Atividade',
    emp_hourly_rate: 'Valor/Hora',
    emp_location: 'Local de Trabalho',
    emp_entry_type: 'Tipo de Lançamento',
    emp_location_remote: 'Remoto',
    emp_location_office: 'Escritório',
    emp_location_client: 'Cliente',
    emp_type_productive: 'Horas Produtivas',
    emp_type_admin: 'Horas Administrativas',
    emp_type_nonbillable: 'Horas Não Faturáveis',
    emp_time_start: 'Início',
    emp_time_break_in: 'Entrada Pausa',
    emp_time_break_out: 'Saída Pausa',
    emp_time_end: 'Fim',
    emp_time_optional: 'Entrada retroativa (opcional)',
    emp_observations: 'Observações',
    emp_btn_start: 'Iniciar Registro',
    emp_btn_break: 'Registrar Pausa',
    emp_btn_resume: 'Retomar',
    emp_btn_end: 'Encerrar Atividade',
    emp_history_title: 'Lançamentos do Dia',
    emp_history_empty: 'Nenhum lançamento finalizado',
    emp_col_project: 'Projeto',
    emp_col_activity: 'Atividade',
    emp_col_start: 'Início',
    emp_col_end: 'Fim',
    emp_col_net_hours: 'Horas Líquidas',
    emp_col_rate: 'Valor/Hora',
    emp_col_cost: 'Custo',
    emp_activity_bim: 'Modelagem BIM',
    emp_activity_compat: 'Compatibilização',
    emp_activity_docs: 'Documentação Técnica',
    emp_activity_meeting: 'Reunião de Projeto',
    emp_activity_software: 'Desenvolvimento de Software',
    emp_activity_review: 'Revisão de Desenhos',
    emp_activity_planning: 'Planejamento / Cronograma',
    emp_activity_support: 'Suporte Interno',
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat(employee): add employee i18n keys for M1"
```

---

## Task 2: Employee login page

**Files:**
- Create: `src/app/employee/login/LoginCard.tsx`
- Create: `src/app/employee/login/page.tsx`

- [ ] **Step 1: Create `LoginCard.tsx`**

```tsx
// src/app/employee/login/LoginCard.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n'

export function LoginCard() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col items-start gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="KPI Engenharia" className="h-9 w-auto" />
          <span className="text-sm text-primary-foreground/80 font-medium pl-0.5">
            {t('emp_portal')}
          </span>
        </div>
        <div className="flex items-center rounded-lg border border-primary-foreground/30 overflow-hidden text-xs font-semibold">
          {(['en', 'pt'] as Language[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === l
                  ? 'bg-secondary text-primary-foreground'
                  : 'text-primary-foreground/70 hover:bg-primary-foreground/10'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg">{t('login_title')}</CardTitle>
          <CardDescription>{t('emp_login_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('login_email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="employee@company.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t('login_password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <Button className="w-full">{t('login_submit')}</Button>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-primary-foreground/70">
        {t('emp_login_restricted')}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Create `page.tsx`**

```tsx
// src/app/employee/login/page.tsx
import { LoginCard } from './LoginCard'

export default function EmployeeLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <LoginCard />
    </div>
  )
}
```

- [ ] **Step 3: Open browser and verify**

Navigate to `http://localhost:3000/employee/login`

Check:
- Dark primary background fills the full screen
- KPI logo appears above the card
- "Employee Portal" / "Portal do Colaborador" subtitle is visible
- Card contains Email, Password fields and Sign In button
- PT/EN toggle in top-right switches subtitle and labels
- Page is centered on mobile (375px) and desktop

- [ ] **Step 4: Commit**

```bash
git add src/app/employee/login/
git commit -m "feat(employee): add employee login page (M1 visual)"
```

---

## Task 3: TrackerHeader component

**Files:**
- Create: `src/app/employee/tracker/TrackerHeader.tsx`

- [ ] **Step 1: Create `TrackerHeader.tsx`**

```tsx
// src/app/employee/tracker/TrackerHeader.tsx
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { Button } from '@/components/ui/button'
import { Language } from '@/lib/i18n'

export function TrackerHeader() {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="KPI Engenharia" className="h-7 w-auto" />
        <span className="font-semibold text-sm hidden sm:block">KPI Engenharia</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border overflow-hidden text-xs font-semibold">
          {(['en', 'pt'] as Language[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === l
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm">{t('emp_sign_out')}</Button>
      </div>
    </header>
  )
}
```

---

## Task 4: TimerBar component

**Files:**
- Create: `src/app/employee/tracker/TimerBar.tsx`

- [ ] **Step 1: Create `TimerBar.tsx`**

```tsx
// src/app/employee/tracker/TimerBar.tsx
'use client'

import { Clock, Coffee, DollarSign, FileText } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export function TimerBar() {
  const { t } = useLanguage()

  return (
    <div className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 flex flex-wrap gap-6 sm:gap-10 items-center">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 opacity-60 shrink-0" />
        <span className="text-xs text-primary-foreground/70">{t('emp_net_time')}</span>
        <span className="font-mono font-semibold tabular-nums">00:00:00</span>
      </div>
      <div className="flex items-center gap-2">
        <Coffee className="h-4 w-4 opacity-60 shrink-0" />
        <span className="text-xs text-primary-foreground/70">{t('emp_breaks')}</span>
        <span className="font-semibold">0</span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 opacity-60 shrink-0" />
        <span className="text-xs text-primary-foreground/70">{t('emp_cost')}</span>
        <span className="font-semibold">R$ 0,00</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 opacity-60 shrink-0" />
        <span className="text-xs text-primary-foreground/70">{t('emp_entries')}</span>
        <span className="font-semibold">0</span>
      </div>
    </div>
  )
}
```

---

## Task 5: ActivityForm component

**Files:**
- Create: `src/app/employee/tracker/ActivityForm.tsx`

- [ ] **Step 1: Create `ActivityForm.tsx`**

```tsx
// src/app/employee/tracker/ActivityForm.tsx
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ACTIVITIES: TranslationKey[] = [
  'emp_activity_bim',
  'emp_activity_compat',
  'emp_activity_docs',
  'emp_activity_meeting',
  'emp_activity_software',
  'emp_activity_review',
  'emp_activity_planning',
  'emp_activity_support',
]

const TIME_FIELDS: { key: TranslationKey; id: string }[] = [
  { key: 'emp_time_start', id: 'time-start' },
  { key: 'emp_time_break_in', id: 'time-break-in' },
  { key: 'emp_time_break_out', id: 'time-break-out' },
  { key: 'emp_time_end', id: 'time-end' },
]

export function ActivityForm() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Project + Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>{t('emp_project')}</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proj-alpha">Project Alpha</SelectItem>
              <SelectItem value="proj-beta">Project Beta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client">{t('emp_client')}</Label>
          <Input id="client" placeholder="—" readOnly />
        </div>
      </div>

      {/* Activity */}
      <div className="space-y-1.5">
        <Label>{t('emp_activity')}</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            {ACTIVITIES.map((key) => (
              <SelectItem key={key} value={key}>
                {t(key)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rate + Location + Entry type */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rate">{t('emp_hourly_rate')}</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
              R$
            </span>
            <Input id="rate" className="pl-8" placeholder="0,00" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>{t('emp_location')}</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">{t('emp_location_remote')}</SelectItem>
              <SelectItem value="office">{t('emp_location_office')}</SelectItem>
              <SelectItem value="client">{t('emp_location_client')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{t('emp_entry_type')}</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="productive">{t('emp_type_productive')}</SelectItem>
              <SelectItem value="admin">{t('emp_type_admin')}</SelectItem>
              <SelectItem value="nonbillable">{t('emp_type_nonbillable')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Retroactive time entry */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          {t('emp_time_optional')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TIME_FIELDS.map(({ key, id }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id}>{t(key)}</Label>
              <Input id={id} type="time" />
            </div>
          ))}
        </div>
      </div>

      {/* Observations */}
      <div className="space-y-1.5">
        <Label htmlFor="observations">{t('emp_observations')}</Label>
        <Textarea id="observations" rows={3} placeholder="—" />
      </div>

      <Separator />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button>{t('emp_btn_start')}</Button>
        <Button variant="outline">{t('emp_btn_break')}</Button>
        <Button variant="outline">{t('emp_btn_resume')}</Button>
        <Button
          variant="outline"
          className="text-destructive border-destructive hover:bg-destructive/10"
        >
          {t('emp_btn_end')}
        </Button>
      </div>
    </div>
  )
}
```

---

## Task 6: HistoryTable component

**Files:**
- Create: `src/app/employee/tracker/HistoryTable.tsx`

- [ ] **Step 1: Create `HistoryTable.tsx`**

```tsx
// src/app/employee/tracker/HistoryTable.tsx
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const COLUMNS: Array<'emp_col_project' | 'emp_col_activity' | 'emp_col_start' | 'emp_col_end' | 'emp_col_net_hours' | 'emp_col_rate' | 'emp_col_cost'> = [
  'emp_col_project',
  'emp_col_activity',
  'emp_col_start',
  'emp_col_end',
  'emp_col_net_hours',
  'emp_col_rate',
  'emp_col_cost',
]

export function HistoryTable() {
  const { t } = useLanguage()

  return (
    <div className="p-4 md:p-6 space-y-3">
      <h2 className="font-semibold text-sm">{t('emp_history_title')}</h2>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableHead key={col}>{t(col)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={COLUMNS.length}
                className="text-center text-muted-foreground py-10 text-sm"
              >
                {t('emp_history_empty')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

---

## Task 7: Tracker page shell — wire everything together

**Files:**
- Create: `src/app/employee/tracker/page.tsx`

- [ ] **Step 1: Create `page.tsx`**

```tsx
// src/app/employee/tracker/page.tsx
import { TrackerHeader } from './TrackerHeader'
import { TimerBar } from './TimerBar'
import { ActivityForm } from './ActivityForm'
import { HistoryTable } from './HistoryTable'

export default function TrackerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TrackerHeader />
      <TimerBar />
      <main className="flex-1 max-w-4xl w-full mx-auto pb-12">
        <ActivityForm />
        <HistoryTable />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd /Users/user/Documents/diego-cerri-hr-app && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Open browser and verify tracker page**

Navigate to `http://localhost:3000/employee/tracker`

Check all of the following:

**Desktop (1280px):**
- Header: logo left, lang toggle + Sign Out right
- Timer bar: dark primary bg, 4 indicators in a row (Clock icon, Coffee icon, DollarSign icon, FileText icon)
- Timer bar stays sticky when scrolling
- Form: 2-col Project/Client row, full-width Activity, 3-col Rate/Location/Type row
- Time fields: 4 columns side by side
- Observations textarea
- 4 action buttons in a row (last one has red border)
- History table: 7 columns, empty state message centered

**Mobile (375px):**
- Form fields stack to single column
- Time fields stack to 2 columns
- Action buttons wrap onto multiple lines
- Timer bar wraps gracefully
- Table scrolls horizontally if needed

**PT/EN toggle:**
- Toggle in header switches all labels, titles, buttons, and empty state message

- [ ] **Step 4: Commit**

```bash
git add src/app/employee/
git commit -m "feat(employee): add tracker page shell — M1 visual complete"
```
