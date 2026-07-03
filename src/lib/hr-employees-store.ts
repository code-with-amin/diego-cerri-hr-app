import 'server-only'
import { apiFetch } from './api-client'

export interface BackendEmployeeCandidate {
  id: string
  name: string
  phone: string
  city: string
  state: string | null
  country: string | null
  seniority: string | null
  hourlyRate: string
}

export interface BackendEmployeeRow {
  id: string
  email: string
  name: string | null
  hourlyRate: string | null
  enabled: boolean
  createdAt: string
  candidateId: string | null
  candidate: BackendEmployeeCandidate | null
}

export interface BackendTimesheetEntry {
  id: string
  project: string
  activityKey: string
  client: string
  location: string
  entryType: string
  startedAt: string
  endedAt: string
  breakMs: number
  netMs: number
  rate: string
  cost: string
  notes: string | null
  source: string
}

export interface BackendTimesheetResponse {
  employee: {
    id: string
    name: string | null
    email: string
    hourlyRate: string | null
    enabled: boolean
  }
  data: BackendTimesheetEntry[]
  total: number
  page: number
  limit: number
  totals: { netMs: number; netHours: number; cost: string }
}

export interface Employee {
  id: string
  email: string
  name: string
  hourlyRate: number | null
  hourlyRateFormatted: string
  enabled: boolean
  createdAt: string
  candidateId: string | null
}

function formatBRL(n: number): string {
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function mapEmployee(row: BackendEmployeeRow): Employee {
  const rate = row.hourlyRate != null ? Number(row.hourlyRate) : null
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? row.candidate?.name ?? row.email,
    hourlyRate: rate,
    hourlyRateFormatted: rate != null ? formatBRL(rate) : '—',
    enabled: row.enabled,
    createdAt: row.createdAt,
    candidateId: row.candidateId,
  }
}

export interface EmployeesResult {
  employees: Employee[]
  total: number
  page: number
  limit: number
}

interface ListParams {
  q?: string
  enabled?: boolean | string
  page?: number
  limit?: number
}

export async function getEmployees(params: ListParams = {}): Promise<EmployeesResult> {
  const qs = new URLSearchParams()
  if (params.q) qs.set('q', params.q)
  if (params.enabled !== undefined && params.enabled !== '' && params.enabled !== 'all') {
    qs.set('enabled', String(params.enabled))
  }
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))

  const query = qs.toString() ? `?${qs.toString()}` : ''
  const res = await apiFetch<{
    data: BackendEmployeeRow[]
    total: number
    page: number
    limit: number
  }>(`/employees${query}`)

  return {
    employees: res.data.map(mapEmployee),
    total: res.total,
    page: res.page,
    limit: res.limit,
  }
}
