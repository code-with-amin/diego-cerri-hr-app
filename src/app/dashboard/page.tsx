import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SearchFilterBar } from '@/components/candidates/SearchFilterBar'
import { CandidateTable } from '@/components/candidates/CandidateTable'
import { getCandidates } from '@/lib/candidate-store'
import { CandidateStatus } from '@/lib/types'

interface DashboardPageProps {
  searchParams: { q?: string; status?: string; date?: string }
}

function filterCandidates(
  all: ReturnType<typeof getCandidates>,
  params: DashboardPageProps['searchParams'],
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

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const all = getCandidates()
  const filtered = filterCandidates(all, searchParams)

  const stats = [
    { label: 'Total Candidates', value: all.length },
    { label: 'New', value: all.filter((c) => c.status === 'New').length },
    { label: 'Under Review', value: all.filter((c) => c.status === 'Under Review').length },
    { label: 'Approved', value: all.filter((c) => c.status === 'Approved').length },
  ]

  return (
    <DashboardShell
      title="Dashboard"
      subtitle={`${mockCandidates.length} total registrations`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Suspense>
        <SearchFilterBar total={all.length} filtered={filtered.length} />
      </Suspense>
      <CandidateTable candidates={filtered} />
    </DashboardShell>
  )
}
