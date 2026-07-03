'use server'

import { empApiFetch, EmpApiError } from '@/lib/emp-api-client'
import {
  getActiveSession,
  getEntries,
  getMe,
  getSummary,
  mapEntry,
  type BackendEntry,
  type BackendSession,
  type EmployeeMe,
  type EntriesQuery,
  type EntriesResult,
  type TrackerSummary,
} from '@/lib/employee-store'
import type { HistoryEntry } from '@/data/employee-mock'

type Result<T> = ({ ok: true } & T) | { ok: false; error: string }

function fail(e: unknown): { ok: false; error: string } {
  if (e instanceof EmpApiError) return { ok: false, error: e.message }
  throw e // re-throw redirect() and unexpected errors
}

export interface TrackerBootstrap {
  me: EmployeeMe
  session: BackendSession | null
  entries: HistoryEntry[]
}

/** Load everything the provider needs on mount: user, active session, recent entries. */
export async function bootstrapTrackerAction(): Promise<TrackerBootstrap> {
  const [me, session, list] = await Promise.all([
    getMe(),
    getActiveSession(),
    getEntries({ page: 1, limit: 50 }),
  ])
  return { me, session, entries: list.entries }
}

export interface StartSessionInput {
  project: string
  client?: string
  activityKey: string
  location?: string
  entryType?: string
  observations?: string
  startedAt?: string
}

export async function startSessionAction(
  input: StartSessionInput,
): Promise<Result<{ session: BackendSession }>> {
  try {
    const { session } = await empApiFetch<{ session: BackendSession }>(
      '/employee/tracker/session/start',
      { method: 'POST', body: JSON.stringify(input) },
    )
    return { ok: true, session }
  } catch (e) {
    return fail(e)
  }
}

export async function breakAction(): Promise<Result<{ session: BackendSession }>> {
  try {
    const { session } = await empApiFetch<{ session: BackendSession }>(
      '/employee/tracker/session/break',
      { method: 'POST', body: '{}' },
    )
    return { ok: true, session }
  } catch (e) {
    return fail(e)
  }
}

export async function resumeAction(): Promise<Result<{ session: BackendSession }>> {
  try {
    const { session } = await empApiFetch<{ session: BackendSession }>(
      '/employee/tracker/session/resume',
      { method: 'POST', body: '{}' },
    )
    return { ok: true, session }
  } catch (e) {
    return fail(e)
  }
}

export async function stopAction(
  endedAt?: string,
): Promise<Result<{ entry: HistoryEntry }>> {
  try {
    const { entry } = await empApiFetch<{ entry: BackendEntry }>(
      '/employee/tracker/session/stop',
      { method: 'POST', body: JSON.stringify(endedAt ? { endedAt } : {}) },
    )
    return { ok: true, entry: mapEntry(entry) }
  } catch (e) {
    return fail(e)
  }
}

export interface ManualEntryInput {
  project: string
  client?: string
  activityKey: string
  location?: string
  entryType?: string
  startedAt: string
  endedAt: string
  breakMs: number
  notes?: string
}

export async function manualEntryAction(
  input: ManualEntryInput,
): Promise<Result<{ entry: HistoryEntry }>> {
  try {
    const { entry } = await empApiFetch<{ entry: BackendEntry }>('/employee/tracker/entries', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return { ok: true, entry: mapEntry(entry) }
  } catch (e) {
    return fail(e)
  }
}

export interface UpdateEntryInput {
  project?: string
  activityKey?: string
  notes?: string
  startedAt?: string
  endedAt?: string
  breakMs?: number
}

export async function updateEntryAction(
  id: string,
  input: UpdateEntryInput,
): Promise<Result<{ entry: HistoryEntry }>> {
  try {
    const { entry } = await empApiFetch<{ entry: BackendEntry }>(
      `/employee/tracker/entries/${id}`,
      { method: 'PATCH', body: JSON.stringify(input) },
    )
    return { ok: true, entry: mapEntry(entry) }
  } catch (e) {
    return fail(e)
  }
}

export async function listEntriesAction(
  query: EntriesQuery,
): Promise<Result<{ result: EntriesResult }>> {
  try {
    const result = await getEntries(query)
    return { ok: true, result }
  } catch (e) {
    return fail(e)
  }
}

export async function summaryAction(days: number): Promise<Result<{ summary: TrackerSummary }>> {
  try {
    const summary = await getSummary(days)
    return { ok: true, summary }
  } catch (e) {
    return fail(e)
  }
}
