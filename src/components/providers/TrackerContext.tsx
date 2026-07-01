'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { MOCK_HISTORY, type HistoryEntry } from '@/data/employee-mock'

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

  // Actions
  startSession: () => void
  startBreak: () => void
  resumeSession: () => void
  endSession: () => void

  // History
  entries: HistoryEntry[]
  clearHistory: () => void
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

function nowHHMM(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
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
    setSessionStartMs(startMs)
    setTotalBreakMs(0)
    setBreakCount(0)
    setCurrentBreakStartMs(null)
    setElapsedMs(now - startMs)
    setRegisteredStart(nowHHMM())
    setRegisteredEnd('')
    setTimerStatus('running')
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

  function endSession() {
    const now = Date.now()
    const finalBreakMs = currentBreakStartMs ? totalBreakMs + (now - currentBreakStartMs) : totalBreakMs
    const netMs = Math.max(0, now - (sessionStartMs ?? now) - finalBreakMs)

    const newEntry: HistoryEntry = {
      id: String(Date.now()),
      project: project || '—',
      activityKey: activityKey || 'emp_activity_bim',
      start: registeredStart || nowHHMM(),
      end: nowHHMM(),
      netHours: toNetHoursStr(netMs),
      rate: toRateStr(rate),
      cost: toCostStr(netMs, rate),
    }

    setEntries((prev) => [newEntry, ...prev])
    setRegisteredEnd(nowHHMM())

    // Reset timer and form
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
    setRegisteredEnd('')
  }

  function clearHistory() {
    setEntries([])
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
        startSession,
        startBreak,
        resumeSession,
        endSession,
        entries,
        clearHistory,
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
