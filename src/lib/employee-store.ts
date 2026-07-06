import 'server-only'
import { empApiFetch } from './emp-api-client'
import type { HistoryEntry } from '@/data/employee-mock'

// ── Backend shapes ────────────────────────────────────────────

export interface BackendEntry {
  id: string
  project: string
  activityKey: string
  client: string | null
  location: string | null
  entryType: string | null
  startedAt: string
  endedAt: string
  breakMs: number
  netMs: number
  rate: string
  cost: string
  notes: string | null
  source: 'TIMER' | 'MANUAL'
}

export interface BackendSession {
  id: string
  status: 'running' | 'paused'
  startedAt: string
  totalBreakMs: number
  currentBreakStartedAt: string | null
  breakCount: number
  project: string
  client: string | null
  activityKey: string
  location: string | null
  entryType: string | null
  observations: string | null
  rateSnapshot: string | null
}

export interface EmployeeMe {
  id: string
  email: string
  name: string | null
  role: string
  hourlyRate: string | null
}

export interface TrackerSummary {
  hoursToday: number
  weekHours: number
  weekCost: string
  weekEntryCount: number
  perDay: { date: string; hours: number }[]
  activityBreakdown: { activityKey: string; hours: number; cost: string }[]
  recent: BackendEntry[]
}

// ── Formatters ────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function hhmm(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatBRL(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** Map a backend entry to the display shape consumed by the tables. */
export function mapEntry(e: BackendEntry): HistoryEntry {
  const started = new Date(e.startedAt)
  const ended = new Date(e.endedAt)
  const rateValue = Number(e.rate)
  return {
    id: e.id,
    project: e.project,
    activityKey: e.activityKey,
    start: hhmm(started),
    end: hhmm(ended),
    netHours: `${(e.netMs / 3_600_000).toFixed(2)} h`,
    rate: formatBRL(rateValue),
    cost: formatBRL(Number(e.cost)),
    notes: e.notes ?? undefined,
    type: e.entryType ?? undefined,
    location: e.location ?? undefined,
    date: ymd(started),
    startedAt: e.startedAt,
    endedAt: e.endedAt,
    breakMs: e.breakMs,
    rateValue,
  }
}

// ── Fetchers ──────────────────────────────────────────────────

export async function getMe(): Promise<EmployeeMe> {
  const { employee } = await empApiFetch<{ employee: EmployeeMe }>('/employee/auth/me')
  return employee
}

export async function getActiveSession(): Promise<BackendSession | null> {
  const { session } = await empApiFetch<{ session: BackendSession | null }>(
    '/employee/tracker/session/active',
  )
  return session
}

export interface EntriesResult {
  entries: HistoryEntry[]
  total: number
  page: number
  limit: number
  totals: { netMs: number; netHours: number; cost: string }
}

export interface EntriesQuery {
  page?: number
  limit?: number
  dateFrom?: string
  dateTo?: string
  project?: string
  activityKey?: string
}

export async function getEntries(query: EntriesQuery = {}): Promise<EntriesResult> {
  const qs = new URLSearchParams()
  if (query.page) qs.set('page', String(query.page))
  if (query.limit) qs.set('limit', String(query.limit))
  if (query.dateFrom) qs.set('dateFrom', query.dateFrom)
  if (query.dateTo) qs.set('dateTo', query.dateTo)
  if (query.project) qs.set('project', query.project)
  if (query.activityKey) qs.set('activityKey', query.activityKey)
  const q = qs.toString() ? `?${qs.toString()}` : ''

  const res = await empApiFetch<{
    data: BackendEntry[]
    total: number
    page: number
    limit: number
    totals: { netMs: number; netHours: number; cost: string }
  }>(`/employee/tracker/entries${q}`)

  return {
    entries: res.data.map(mapEntry),
    total: res.total,
    page: res.page,
    limit: res.limit,
    totals: res.totals,
  }
}

export async function getSummary(days = 7): Promise<TrackerSummary> {
  return empApiFetch<TrackerSummary>(`/employee/tracker/summary?days=${days}`)
}
