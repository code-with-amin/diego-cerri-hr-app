import type { TranslationKey } from '@/lib/i18n'

// Activity options for the tracker/edit dropdowns. Shared so both forms stay in
// sync and so backend `activityKey` values map to translations.
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

/**
 * A tracked entry shaped for display. Formatted strings (`start`, `netHours`,
 * `rate`, `cost`) are rendered directly by the tables; the raw fields
 * (`startedAt`, `endedAt`, `breakMs`, `date`, `rateValue`) let the edit dialog
 * reconstruct the values it needs to PATCH the backend.
 */
export type HistoryEntry = {
  id: string
  project: string
  activityKey: string
  start: string
  end: string
  netHours: string
  rate: string
  cost: string
  notes?: string
  type?: string
  location?: string
  employeeId?: string
  employeeEmail?: string
  // Raw values sourced from the backend (present for real entries).
  date?: string // YYYY-MM-DD (local)
  startedAt?: string // ISO
  endedAt?: string // ISO
  breakMs?: number
  rateValue?: number
}

export type TimeEntry = HistoryEntry & { date: string }
