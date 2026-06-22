import 'server-only'
import fs from 'fs'
import path from 'path'
import { mockCandidates } from './mock-data'
import { Candidate, CandidateStatus } from './types'

const STORE_PATH = path.join(process.cwd(), 'data', 'status-overrides.json')

function readOverrides(): Record<string, CandidateStatus> {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'))
    }
  } catch {}
  return {}
}

function writeOverrides(overrides: Record<string, CandidateStatus>) {
  const dir = path.dirname(STORE_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(STORE_PATH, JSON.stringify(overrides, null, 2))
}

export function getCandidates(): Candidate[] {
  const overrides = readOverrides()
  return mockCandidates.map((c) => ({
    ...c,
    status: overrides[c.id] ?? c.status,
  }))
}

export function getCandidateById(id: string): Candidate | undefined {
  return getCandidates().find((c) => c.id === id)
}

export function updateCandidateStatus(id: string, status: CandidateStatus): void {
  const overrides = readOverrides()
  overrides[id] = status
  writeOverrides(overrides)
}
