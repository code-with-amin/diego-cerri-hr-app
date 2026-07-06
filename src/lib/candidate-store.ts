import 'server-only'
import { apiFetch } from './api-client'
import { Candidate, CandidateStatus, Note } from './types'

type BackendStatus = 'NEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'

const STATUS_FROM_BACKEND: Record<BackendStatus, CandidateStatus> = {
  NEW: 'New',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

const STATUS_TO_BACKEND: Record<CandidateStatus, BackendStatus> = {
  New: 'NEW',
  'Under Review': 'UNDER_REVIEW',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
}

interface BackendListItem {
  id: string
  name: string
  email: string
  phone: string
  city: string
  state: string | null
  seniority: string | null
  hourlyRate: string
  status: BackendStatus
  createdAt: string
}

interface BackendDetail {
  id: string
  name: string
  email: string
  phone: string
  city: string
  state: string | null
  country: string | null
  linkedinUrl: string | null
  birthDate: string | null
  employmentTypes: string[]
  hoursPerDay: number
  workRegime: string | null
  availabilityStart: string | null
  travelAvailability: string
  knowledgeAreas: string[]
  softwareSkills: string | null
  seniority: string | null
  workDone: string
  workCapable: string | null
  yearsExperience: number | null
  hourlyRate: string
  monthlyExpectation: string | null
  observations: string | null
  consent: boolean
  status: BackendStatus
  createdAt: string
  updatedAt: string
  resumeUrl: string
  resumeFilename: string
  resumeContentType: string
  resumeSize: number
}

interface BackendNote {
  id: string
  body: string
  createdAt: string
  admin: { id: string; email: string }
}

function mapListItem(item: BackendListItem): Candidate {
  return {
    id: item.id,
    fullName: item.name,
    email: item.email,
    phone: item.phone,
    city: item.city,
    state: item.state ?? undefined,
    employmentTypes: [],
    hoursPerDay: 0,
    travelAvailability: '',
    knowledgeAreas: [],
    seniority: item.seniority ?? undefined,
    workDone: '',
    hourlyRate: Number(item.hourlyRate) > 0 ? `R$ ${Number(item.hourlyRate).toFixed(2)}/hr` : '—',
    submittedAt: item.createdAt,
    lastUpdatedAt: item.createdAt,
    status: STATUS_FROM_BACKEND[item.status],
  }
}

function mapDetail(c: BackendDetail): Candidate {
  const rate = Number(c.hourlyRate)
  const monthly = c.monthlyExpectation != null ? Number(c.monthlyExpectation) : undefined

  return {
    id: c.id,
    fullName: c.name,
    email: c.email,
    phone: c.phone,
    city: c.city,
    state: c.state ?? undefined,
    country: c.country ?? undefined,
    linkedIn: c.linkedinUrl ?? undefined,
    birthDate: c.birthDate ? c.birthDate.slice(0, 10) : undefined,

    resumeFileName: c.resumeFilename,
    resumeUrl: c.resumeUrl,

    employmentTypes: c.employmentTypes,
    hoursPerDay: c.hoursPerDay,
    workMode: c.workRegime ?? undefined,
    availabilityStart: c.availabilityStart ?? undefined,
    travelAvailability: c.travelAvailability,

    knowledgeAreas: c.knowledgeAreas,
    softwareSkills: c.softwareSkills ?? undefined,
    seniority: c.seniority ?? undefined,

    workDone: c.workDone,
    workCapable: c.workCapable ?? undefined,
    yearsExperience: c.yearsExperience ?? undefined,

    hourlyRate: rate > 0 ? `R$ ${rate.toFixed(2)}/hr` : '',
    monthlyExpectation: monthly != null ? `R$ ${monthly.toFixed(2)}` : undefined,
    observations: c.observations ?? undefined,

    submittedAt: c.createdAt,
    lastUpdatedAt: c.updatedAt,
    status: STATUS_FROM_BACKEND[c.status],
  }
}

export interface CandidatesResult {
  candidates: Candidate[]
  total: number
  page: number
  limit: number
}

interface ListParams {
  q?: string
  status?: CandidateStatus | string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export async function getCandidates(params: ListParams = {}): Promise<CandidatesResult> {
  const qs = new URLSearchParams()
  if (params.q) qs.set('q', params.q)
  if (params.status && params.status !== 'all') {
    qs.set('status', STATUS_TO_BACKEND[params.status as CandidateStatus])
  }
  // Send plain YYYY-MM-DD bounds; the backend snaps them to the start/end of the
  // day in UTC so the range is inclusive and timezone-consistent on both ends.
  if (params.dateFrom) qs.set('dateFrom', params.dateFrom)
  if (params.dateTo) qs.set('dateTo', params.dateTo)
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))

  const query = qs.toString() ? `?${qs.toString()}` : ''
  const res = await apiFetch<{ data: BackendListItem[]; total: number; page: number; limit: number }>(
    `/candidates${query}`,
  )
  return {
    candidates: res.data.map(mapListItem),
    total: res.total,
    page: res.page,
    limit: res.limit,
  }
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  try {
    const { candidate } = await apiFetch<{ candidate: BackendDetail }>(`/candidates/${id}`)
    return mapDetail(candidate)
  } catch {
    return null
  }
}

export async function getNotes(candidateId: string): Promise<Note[]> {
  try {
    const { notes } = await apiFetch<{ notes: BackendNote[] }>(`/candidates/${candidateId}/notes`)
    return notes
  } catch {
    return []
  }
}

/** Populated only on a first-time approval that just provisioned an account. */
export interface ApprovalNotification {
  type: 'approval'
  email: string
  emailed: boolean
}

export async function updateCandidateStatus(
  id: string,
  status: CandidateStatus,
): Promise<ApprovalNotification | null> {
  const res = await apiFetch<{ notification: ApprovalNotification | null }>(
    `/candidates/${id}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status: STATUS_TO_BACKEND[status] }),
    },
  )
  return res.notification
}

export async function deleteCandidate(id: string): Promise<void> {
  await apiFetch(`/candidates/${id}`, { method: 'DELETE' })
}
