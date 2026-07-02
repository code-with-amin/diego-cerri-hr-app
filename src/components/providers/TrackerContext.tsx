'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { MOCK_EMPLOYEE, MOCK_HISTORY, type HistoryEntry } from '@/data/employee-mock'
import type { TranslationKey } from '@/lib/i18n'

export type TimerStatus = 'idle' | 'running' | 'paused'

interface TrackerContextValue {
  // Form fields
  project: string
  setProject: (v: string) => void
  client: string
  setClient: (v: string) => void
  activityKey: string
  setActivityKey: (v: string) => void
  rate: string
  setRate: (v: string) => void
  location: string
  setLocation: (v: string) => void
  entryType: string
  setEntryType: (v: string) => void
  retroStart: string
  setRetroStart: (v: string) => void
  breakStartField: string
  setBreakStartField: (v: string) => void
  breakEndField: string
  setBreakEndField: (v: string) => void
  retroEnd: string
  setRetroEnd: (v: string) => void
  observations: string
  setObservations: (v: string) => void

  // Registered times (readonly display)
  registeredStart: string
  registeredEnd: string

  // Timer
  timerStatus: TimerStatus
  elapsedMs: number
  breakCount: number

  // Validation feedback (translation key of the last error, or null)
  error: TranslationKey | null
  clearError: () => void

  // Actions
  startSession: () => void
  startBreak: () => void
  resumeSession: () => void
  endSession: () => void
  saveManualEntry: () => void

  // History
  entries: HistoryEntry[]
  clearHistory: () => void
  updateEntry: (id: string, patch: Partial<HistoryEntry>) => void
}

const TrackerContext = createContext<TrackerContextValue | null>(null)

function formatHHMM(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function formatHHMMSS(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Parse a datetime-local input value into epoch ms (null if empty/invalid).
function parseLocalMs(value: string): number | null {
  if (!value) return null
  const ms = new Date(value).getTime()
  return Number.isNaN(ms) ? null : ms
}

function hhmmFromMs(ms: number): string {
  const d = new Date(ms)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function toNetHoursStr(ms: number): string {
  return `${(ms / 3_600_000).toFixed(2)} h`
}

function toCostStr(ms: number, rateStr: string): string {
  const rateNum = parseFloat(rateStr.replace(',', '.')) || 0
  const hours = ms / 3_600_000
  const cost = hours * rateNum
  return `R$ ${cost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function toRateStr(rateStr: string): string {
  const rateNum = parseFloat(rateStr.replace(',', '.')) || 0
  return `R$ ${rateNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  // Form fields
  const [project, setProject] = useState('')
  const [client, setClient] = useState('')
  const [activityKey, setActivityKey] = useState('')
  const [rate, setRate] = useState('')
  const [location, setLocation] = useState('')
  const [entryType, setEntryType] = useState('')
  const [retroStart, setRetroStart] = useState('')
  const [breakStartField, setBreakStartField] = useState('')
  const [breakEndField, setBreakEndField] = useState('')
  const [retroEnd, setRetroEnd] = useState('')
  const [observations, setObservations] = useState('')
  const [registeredStart, setRegisteredStart] = useState('')
  const [registeredEnd, setRegisteredEnd] = useState('')

  // Timer state
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle')
  const [sessionStartMs, setSessionStartMs] = useState<number | null>(null)
  const [totalBreakMs, setTotalBreakMs] = useState(0)
  const [currentBreakStartMs, setCurrentBreakStartMs] = useState<number | null>(null)
  const [breakCount, setBreakCount] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  // Validation feedback
  const [error, setError] = useState<TranslationKey | null>(null)

  // History
  const [entries, setEntries] = useState<HistoryEntry[]>(MOCK_HISTORY)

  // Live elapsed time interval
  useEffect(() => {
    if (timerStatus !== 'running' || sessionStartMs === null) return
    const id = setInterval(() => {
      setElapsedMs(Date.now() - sessionStartMs - totalBreakMs)
    }, 1000)
    return () => clearInterval(id)
  }, [timerStatus, sessionStartMs, totalBreakMs])

  function startSession() {
    const now = Date.now()
    const startMs = retroStart ? new Date(retroStart).getTime() : now
    if (Number.isNaN(startMs) || startMs > now) {
      setError('emp_err_start_invalid')
      return
    }
    setError(null)
    setSessionStartMs(startMs)
    setTotalBreakMs(0)
    setBreakCount(0)
    setCurrentBreakStartMs(null)
    setElapsedMs(now - startMs)
    setRegisteredStart(hhmmFromMs(startMs))
    setRegisteredEnd('')
    setTimerStatus('running')
  }

  // Build a completed entry, stamping the logged-in employee, notes and metadata.
  function makeEntry(startLabel: string, endLabel: string, netMs: number): HistoryEntry {
    return {
      id: String(Date.now()),
      project: project || '—',
      activityKey: activityKey || 'emp_activity_bim',
      start: startLabel,
      end: endLabel,
      netHours: toNetHoursStr(netMs),
      rate: toRateStr(rate),
      cost: toCostStr(netMs, rate),
      notes: observations || undefined,
      type: entryType || undefined,
      location: location || undefined,
      employeeId: MOCK_EMPLOYEE.id,
      employeeEmail: MOCK_EMPLOYEE.email,
    }
  }

  // Duration of the manually-typed break window (0 if not fully provided).
  function manualBreakMs(): number {
    const bStart = parseLocalMs(breakStartField)
    const bEnd = parseLocalMs(breakEndField)
    if (bStart === null || bEnd === null) return 0
    return Math.max(0, bEnd - bStart)
  }

  function startBreak() {
    setCurrentBreakStartMs(Date.now())
    setTimerStatus('paused')
  }

  function resumeSession() {
    if (currentBreakStartMs === null) return
    const breakDuration = Date.now() - currentBreakStartMs
    setTotalBreakMs((prev) => prev + breakDuration)
    setBreakCount((prev) => prev + 1)
    setCurrentBreakStartMs(null)
    setTimerStatus('running')
  }

  // Reset the timer state and clear the form after a completed entry.
  function resetAll() {
    setTimerStatus('idle')
    setSessionStartMs(null)
    setTotalBreakMs(0)
    setCurrentBreakStartMs(null)
    setBreakCount(0)
    setElapsedMs(0)
    setProject('')
    setClient('')
    setActivityKey('')
    setRate('')
    setLocation('')
    setEntryType('')
    setRetroStart('')
    setBreakStartField('')
    setBreakEndField('')
    setRetroEnd('')
    setObservations('')
    setRegisteredStart('')
  }

  function endSession() {
    const now = Date.now()
    const startMs = sessionStartMs ?? now

    // Honor a retroactive end time when provided; otherwise stop at "now".
    const retroEndMs = parseLocalMs(retroEnd)
    const endMs = retroEndMs ?? now
    if (endMs <= startMs) {
      setError('emp_err_end_after_start')
      return
    }

    // Prefer live-tracked breaks; fall back to the manually-typed break window.
    let breaksMs = currentBreakStartMs ? totalBreakMs + (now - currentBreakStartMs) : totalBreakMs
    if (breaksMs === 0) breaksMs = manualBreakMs()

    const netMs = Math.max(0, endMs - startMs - breaksMs)

    const newEntry = makeEntry(registeredStart || hhmmFromMs(startMs), hhmmFromMs(endMs), netMs)
    setEntries((prev) => [newEntry, ...prev])
    setRegisteredEnd(hhmmFromMs(endMs))
    setError(null)
    resetAll()
  }

  // Create a completed entry purely from typed start/break/end times (no live timer).
  function saveManualEntry() {
    const startMs = parseLocalMs(retroStart)
    const endMs = parseLocalMs(retroEnd)

    if (startMs === null) {
      setError('emp_err_start_required')
      return
    }
    if (endMs === null) {
      setError('emp_err_end_required')
      return
    }
    if (endMs <= startMs) {
      setError('emp_err_end_after_start')
      return
    }

    // Optional break window: both fields must be present together and sit inside the entry.
    const bStart = parseLocalMs(breakStartField)
    const bEnd = parseLocalMs(breakEndField)
    if ((bStart === null) !== (bEnd === null)) {
      setError('emp_err_break_incomplete')
      return
    }
    let breaksMs = 0
    if (bStart !== null && bEnd !== null) {
      if (bEnd <= bStart || bStart < startMs || bEnd > endMs) {
        setError('emp_err_break_range')
        return
      }
      breaksMs = bEnd - bStart
    }

    const netMs = endMs - startMs - breaksMs
    if (netMs <= 0) {
      setError('emp_err_break_range')
      return
    }

    const newEntry = makeEntry(hhmmFromMs(startMs), hhmmFromMs(endMs), netMs)
    setEntries((prev) => [newEntry, ...prev])
    setError(null)
    resetAll()
  }

  function clearError() {
    setError(null)
  }

  function clearHistory() {
    setEntries([])
  }

  // Merge edited fields into an existing history entry (in-memory).
  function updateEntry(id: string, patch: Partial<HistoryEntry>) {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    )
  }

  return (
    <TrackerContext.Provider
      value={{
        project, setProject,
        client, setClient,
        activityKey, setActivityKey,
        rate, setRate,
        location, setLocation,
        entryType, setEntryType,
        retroStart, setRetroStart,
        breakStartField, setBreakStartField,
        breakEndField, setBreakEndField,
        retroEnd, setRetroEnd,
        observations, setObservations,
        registeredStart,
        registeredEnd,
        timerStatus,
        elapsedMs,
        breakCount,
        error,
        clearError,
        startSession,
        startBreak,
        resumeSession,
        endSession,
        saveManualEntry,
        entries,
        clearHistory,
        updateEntry,
      }}
    >
      {children}
    </TrackerContext.Provider>
  )
}

export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used inside TrackerProvider')
  return ctx
}

export { formatHHMMSS, toRateStr }
