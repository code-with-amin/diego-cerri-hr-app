'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { HistoryEntry } from '@/data/employee-mock'
import {
  bootstrapTrackerAction,
  breakAction,
  resumeAction,
  startSessionAction,
  stopAction,
  manualEntryAction,
  updateEntryAction,
  type UpdateEntryInput,
} from '@/app/employee/tracker/actions'
import type { BackendSession } from '@/lib/employee-store'

export type TimerStatus = 'idle' | 'running' | 'paused'
export type TrackerMode = 'live' | 'manual'

interface TrackerContextValue {
  // Which module the form is in: live timer vs manual (retroactive) entry.
  mode: TrackerMode
  setMode: (m: TrackerMode) => void

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

  // Connected user (from /me)
  userName: string
  userEmail: string
  userRole: string
  hydrated: boolean

  // Validation / server feedback (display-ready message, or null)
  error: string | null
  clearError: () => void

  // Actions (persist to the backend)
  startSession: () => void
  startBreak: () => void
  resumeSession: () => void
  endSession: () => void
  saveManualEntry: () => void

  // History
  entries: HistoryEntry[]
  clearHistory: () => void
  updateEntry: (id: string, payload: UpdateEntryInput) => Promise<void>
}

const TrackerContext = createContext<TrackerContextValue | null>(null)

function formatHHMMSS(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
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

// datetime-local string → ISO (or undefined if empty/invalid).
function localToISO(value: string): string | undefined {
  const ms = parseLocalMs(value)
  return ms === null ? undefined : new Date(ms).toISOString()
}

function hhmmFromMs(ms: number): string {
  const d = new Date(ms)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function toRateStr(rateStr: string): string {
  const rateNum = parseFloat(String(rateStr).replace(',', '.')) || 0
  return `R$ ${rateNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  // Module selector: 'live' captures times at click-time, 'manual' takes them
  // from the datetime pickers.
  const [mode, setMode] = useState<TrackerMode>('live')

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

  // Connected user
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('')
  const [userRate, setUserRate] = useState('') // authoritative read-only rate
  const [hydrated, setHydrated] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [entries, setEntries] = useState<HistoryEntry[]>([])

  // Guards a mutation in flight so double-clicks don't double-post.
  const pending = useRef(false)

  // Restore timer state from a persisted server session.
  function hydrateFromSession(session: BackendSession, fallbackRate: string) {
    const startMs = new Date(session.startedAt).getTime()
    setSessionStartMs(startMs)
    setTotalBreakMs(session.totalBreakMs)
    setBreakCount(session.breakCount)
    setProject(session.project)
    setClient(session.client ?? '')
    setActivityKey(session.activityKey)
    setLocation(session.location ?? '')
    setEntryType(session.entryType ?? '')
    setObservations(session.observations ?? '')
    setRate(session.rateSnapshot ?? fallbackRate)
    setRegisteredStart(hhmmFromMs(startMs))
    setRegisteredEnd('')
    if (session.status === 'paused' && session.currentBreakStartedAt) {
      const breakStart = new Date(session.currentBreakStartedAt).getTime()
      setCurrentBreakStartMs(breakStart)
      setElapsedMs(Math.max(0, breakStart - startMs - session.totalBreakMs))
      setTimerStatus('paused')
    } else {
      setCurrentBreakStartMs(null)
      setElapsedMs(Math.max(0, Date.now() - startMs - session.totalBreakMs))
      setTimerStatus('running')
    }
  }

  // Bootstrap on mount: connected user, active session, recent entries.
  useEffect(() => {
    let cancelled = false
    bootstrapTrackerAction()
      .then((data) => {
        if (cancelled) return
        setUserName(data.me.name ?? data.me.email)
        setUserEmail(data.me.email)
        setUserRole(data.me.role)
        setUserRate(data.me.hourlyRate ?? '')
        setRate(data.me.hourlyRate ?? '')
        setEntries(data.entries)
        if (data.session) hydrateFromSession(data.session, data.me.hourlyRate ?? '')
        setHydrated(true)
      })
      .catch(() => {
        if (!cancelled) setHydrated(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Live elapsed time interval (client-side UX tick).
  useEffect(() => {
    if (timerStatus !== 'running' || sessionStartMs === null) return
    const id = setInterval(() => {
      setElapsedMs(Date.now() - sessionStartMs - totalBreakMs)
    }, 1000)
    return () => clearInterval(id)
  }, [timerStatus, sessionStartMs, totalBreakMs])

  // Reset the timer + form after a completed entry (rate stays = user's rate).
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
    setLocation('')
    setEntryType('')
    setRetroStart('')
    setBreakStartField('')
    setBreakEndField('')
    setRetroEnd('')
    setObservations('')
    setRegisteredStart('')
    setRate(userRate)
  }

  // Shared required-field check for both modules. Every field is required
  // except the observations/notes (and, in manual mode, the optional break).
  // Returns an error message, or null when all required fields are present.
  function validateRequiredFields(): string | null {
    if (!project.trim()) return 'Informe o projeto.'
    if (!client.trim()) return 'Informe o cliente.'
    if (!activityKey) return 'Selecione a atividade.'
    if (!location) return 'Selecione o local de trabalho.'
    if (!entryType) return 'Selecione o tipo de lançamento.'
    return null
  }

  async function startSession() {
    if (pending.current) return
    const missing = validateRequiredFields()
    if (missing) {
      setError(missing)
      return
    }
    pending.current = true
    setError(null)
    try {
      const res = await startSessionAction({
        project,
        client: client || undefined,
        activityKey,
        location: location || undefined,
        entryType: entryType || undefined,
        observations: observations || undefined,
        // Live mode is strictly runtime: the server stamps the start at now.
      })
      if (!res.ok) {
        setError(res.error)
        return
      }
      const startMs = new Date(res.session.startedAt).getTime()
      setSessionStartMs(startMs)
      setTotalBreakMs(0)
      setBreakCount(0)
      setCurrentBreakStartMs(null)
      setElapsedMs(Math.max(0, Date.now() - startMs))
      setRegisteredStart(hhmmFromMs(startMs))
      setRegisteredEnd('')
      setTimerStatus('running')
    } finally {
      pending.current = false
    }
  }

  async function startBreak() {
    if (pending.current) return
    pending.current = true
    setError(null)
    try {
      const res = await breakAction()
      if (!res.ok) {
        setError(res.error)
        return
      }
      const at = res.session.currentBreakStartedAt
        ? new Date(res.session.currentBreakStartedAt).getTime()
        : Date.now()
      setCurrentBreakStartMs(at)
      setTimerStatus('paused')
    } finally {
      pending.current = false
    }
  }

  async function resumeSession() {
    if (pending.current) return
    pending.current = true
    setError(null)
    try {
      const res = await resumeAction()
      if (!res.ok) {
        setError(res.error)
        return
      }
      setTotalBreakMs(res.session.totalBreakMs)
      setBreakCount(res.session.breakCount)
      setCurrentBreakStartMs(null)
      setTimerStatus('running')
    } finally {
      pending.current = false
    }
  }

  async function endSession() {
    if (pending.current) return
    pending.current = true
    setError(null)
    try {
      // Live mode is strictly runtime: the server stamps the end at now.
      const res = await stopAction()
      if (!res.ok) {
        setError(res.error)
        return
      }
      setEntries((prev) => [res.entry, ...prev])
      setRegisteredEnd(res.entry.end)
      resetAll()
    } finally {
      pending.current = false
    }
  }

  async function saveManualEntry() {
    if (pending.current) return

    const missing = validateRequiredFields()
    if (missing) {
      setError(missing)
      return
    }

    const startMs = parseLocalMs(retroStart)
    const endMs = parseLocalMs(retroEnd)

    if (startMs === null) {
      setError('Informe a data/hora de início.')
      return
    }
    if (endMs === null) {
      setError('Informe a data/hora de término.')
      return
    }
    if (endMs <= startMs) {
      setError('O término deve ser depois do início.')
      return
    }

    // Optional break window — both fields together and within the entry.
    const bStart = parseLocalMs(breakStartField)
    const bEnd = parseLocalMs(breakEndField)
    if ((bStart === null) !== (bEnd === null)) {
      setError('Preencha início e fim do intervalo.')
      return
    }
    let breakMs = 0
    if (bStart !== null && bEnd !== null) {
      if (bEnd <= bStart || bStart < startMs || bEnd > endMs) {
        setError('Intervalo fora do período do lançamento.')
        return
      }
      breakMs = bEnd - bStart
    }

    pending.current = true
    setError(null)
    try {
      const res = await manualEntryAction({
        project,
        client: client || undefined,
        activityKey,
        location: location || undefined,
        entryType: entryType || undefined,
        startedAt: new Date(startMs).toISOString(),
        endedAt: new Date(endMs).toISOString(),
        breakMs,
        notes: observations || undefined,
      })
      if (!res.ok) {
        setError(res.error)
        return
      }
      setEntries((prev) => [res.entry, ...prev])
      resetAll()
    } finally {
      pending.current = false
    }
  }

  function clearError() {
    setError(null)
  }

  // View-only clear of the on-screen list; persisted entries remain in the DB
  // and reappear on reload / navigation.
  function clearHistory() {
    setEntries([])
  }

  async function updateEntry(id: string, payload: UpdateEntryInput) {
    const res = await updateEntryAction(id, payload)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setEntries((prev) => prev.map((entry) => (entry.id === id ? res.entry : entry)))
  }

  return (
    <TrackerContext.Provider
      value={{
        mode, setMode,
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
        userName,
        userEmail,
        userRole,
        hydrated,
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
