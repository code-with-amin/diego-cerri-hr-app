import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SearchFilterBar } from '@/components/candidates/SearchFilterBar'
import { CandidateTable } from '@/components/candidates/CandidateTable'
import { getCandidates } from '@/lib/candidate-store'
import { CandidateStatus } from '@/lib/types'

interface CandidatesPageProps {
  searchParams: { q?: string; status?: string; date?: string }
}

function filterCandidates(
  all: ReturnType<typeof getCandidates>,
  params: CandidatesPageProps['searchParams'],
) {
  const q = params.q?.toLowerCase().trim() ?? ''
  const status = params.status
  const date = params.date ?? ''

  return all.filter((c) => {
    if (q && !c.fullName.toLowerCase().includes(q) && !c.desiredRole.toLowerCase().includes(q)) {
      return false
    }
    if (status && status !== 'all' && c.status !== (status as CandidateStatus)) {
      return false
    }
    if (date && c.submittedAt.slice(0, 10) < date) {
      return false
    }
    return true
  })
}

export default function CandidatesPage({ searchParams }: CandidatesPageProps) {
  const all = getCandidates()
  const filtered = filterCandidates(all, searchParams)

  return (
    <DashboardShell
      titleKey="page_candidates"
      subtitleKey="page_candidates_subtitle"
      subtitleSuffix={String(all.length)}
    >
      <Suspense>
        <SearchFilterBar total={all.length} filtered={filtered.length} />
      </Suspense>
      <CandidateTable candidates={filtered} />
    </DashboardShell>
  )
}
