import type { TranslationKey } from '@/lib/i18n'

export const MOCK_EMPLOYEE = {
  name: 'Carlos Mendes',
  email: 'colaborador@kpiengenharia.com',
  role: 'BIM Specialist',
}

// Activity options for the tracker/edit dropdowns — the current set plus the
// earlier list, kept together so both forms stay in sync.
export const ACTIVITY_KEYS: TranslationKey[] = [
  'emp_activity_calculation',
  'emp_activity_flowchart',
  'emp_activity_view',
  'emp_activity_detailing',
  'emp_activity_bom',
  'emp_activity_scanning',
  'emp_activity_bim',
  'emp_activity_compat',
  'emp_activity_docs',
  'emp_activity_meeting',
  'emp_activity_software',
  'emp_activity_review',
  'emp_activity_planning',
  'emp_activity_support',
]

// Mock credentials for demo login
export const MOCK_EMPLOYEE_CREDENTIALS = {
  email: 'colaborador@kpiengenharia.com',
  password: 'colaborador123',
}

export type HistoryEntry = {
  id: string
  project: string
  activityKey: string
  start: string
  end: string
  netHours: string
  rate: string
  cost: string
}

export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: '1',
    project: 'Linha 3 — Expansão',
    activityKey: 'emp_activity_calculation',
    start: '08:30',
    end: '12:00',
    netHours: '3.50 h',
    rate: 'R$ 120,00',
    cost: 'R$ 420,00',
  },
  {
    id: '2',
    project: 'KPI Engenharia',
    activityKey: 'emp_activity_flowchart',
    start: '13:00',
    end: '14:00',
    netHours: '1.00 h',
    rate: 'R$ 120,00',
    cost: 'R$ 120,00',
  },
  {
    id: '3',
    project: 'Retrofit Galpão B',
    activityKey: 'emp_activity_view',
    start: '14:15',
    end: '16:45',
    netHours: '2.50 h',
    rate: 'R$ 120,00',
    cost: 'R$ 300,00',
  },
  {
    id: '4',
    project: 'Documentação OS-204',
    activityKey: 'emp_activity_detailing',
    start: '17:00',
    end: '18:00',
    netHours: '1.00 h',
    rate: 'R$ 120,00',
    cost: 'R$ 120,00',
  },
  {
    id: '5',
    project: 'Metrô SP — Linha 6',
    activityKey: 'emp_activity_bom',
    start: '08:00',
    end: '10:30',
    netHours: '2.50 h',
    rate: 'R$ 120,00',
    cost: 'R$ 300,00',
  },
  {
    id: '6',
    project: 'Linha 3 — Expansão',
    activityKey: 'emp_activity_scanning',
    start: '11:00',
    end: '12:30',
    netHours: '1.50 h',
    rate: 'R$ 120,00',
    cost: 'R$ 180,00',
  },
]

export type TimeEntry = HistoryEntry & { date: string }

// 50 mock entries for the employee "All entries" page (search + pagination demo).
const ENTRY_PROJECTS = [
  'Linha 3 — Expansão',
  'KPI Engenharia',
  'Retrofit Galpão B',
  'Documentação OS-204',
  'Metrô SP — Linha 6',
  'Aeroporto — Terminal 2',
  'Hospital Regional',
  'Centro Logístico Norte',
]

const ENTRY_ACTIVITIES = [
  'emp_activity_calculation',
  'emp_activity_flowchart',
  'emp_activity_view',
  'emp_activity_detailing',
  'emp_activity_bom',
  'emp_activity_scanning',
]

const ENTRY_SLOTS = [
  { start: '08:00', end: '10:30', hours: 2.5 },
  { start: '09:15', end: '12:00', hours: 2.75 },
  { start: '10:00', end: '11:00', hours: 1 },
  { start: '13:00', end: '15:30', hours: 2.5 },
  { start: '14:00', end: '18:00', hours: 4 },
  { start: '16:00', end: '17:30', hours: 1.5 },
]

const RATE_VALUE = 120

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export const MOCK_ENTRIES: TimeEntry[] = Array.from({ length: 50 }, (_, i) => {
  const project = ENTRY_PROJECTS[i % ENTRY_PROJECTS.length]
  const activityKey = ENTRY_ACTIVITIES[i % ENTRY_ACTIVITIES.length]
  const slot = ENTRY_SLOTS[i % ENTRY_SLOTS.length]
  // Spread entries across the previous ~50 days, starting from 2026-06-30.
  const day = 30 - (i % 30)
  const month = i < 30 ? 6 : 5
  return {
    id: String(i + 1),
    date: `2026-${pad(month)}-${pad(day)}`,
    project,
    activityKey,
    start: slot.start,
    end: slot.end,
    netHours: `${slot.hours.toFixed(2)} h`,
    rate: formatBRL(RATE_VALUE),
    cost: formatBRL(RATE_VALUE * slot.hours),
  }
})
