'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api-client'
import type { BackendEmployeeRow, BackendTimesheetResponse } from '@/lib/hr-employees-store'

export async function updateEmployeeAction(
  id: string,
  patch: { enabled?: boolean; hourlyRate?: number },
): Promise<{ error?: string }> {
  try {
    await apiFetch<{ employee: BackendEmployeeRow }>(`/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update employee'
    return { error: message }
  }
  revalidatePath('/dashboard/employees')
  return {}
}

export async function setEmployeePasswordAction(
  id: string,
  password: string,
): Promise<{ error?: string; emailed?: boolean; email?: string }> {
  try {
    const res = await apiFetch<{ ok: true; id: string; emailed: boolean; email: string }>(
      `/employees/${id}/password`,
      {
        method: 'POST',
        body: JSON.stringify({ password }),
      },
    )
    return { emailed: res.emailed, email: res.email }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to set password'
    return { error: message }
  }
}

export interface TimesheetFilters {
  dateFrom?: string
  dateTo?: string
  project?: string
  activityKey?: string
  page?: number
  limit?: number
}

export async function getEmployeeTimesheetAction(
  id: string,
  filters: TimesheetFilters = {},
): Promise<{ data?: BackendTimesheetResponse; error?: string }> {
  try {
    const qs = new URLSearchParams()
    if (filters.dateFrom) qs.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) qs.set('dateTo', filters.dateTo)
    if (filters.project) qs.set('project', filters.project)
    if (filters.activityKey) qs.set('activityKey', filters.activityKey)
    if (filters.page) qs.set('page', String(filters.page))
    if (filters.limit) qs.set('limit', String(filters.limit))

    const query = qs.toString() ? `?${qs.toString()}` : ''
    const data = await apiFetch<BackendTimesheetResponse>(`/employees/${id}/timesheet${query}`)
    return { data }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load timesheet'
    return { error: message }
  }
}
