import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SearchFilterBar } from '@/components/candidates/SearchFilterBar'
import { CandidateTable } from '@/components/candidates/CandidateTable'
import { mockCandidates } from '@/lib/mock-data'

function getStats(candidates: typeof mockCandidates) {
  return [
    { label: 'Total Candidates', value: candidates.length },
    { label: 'New', value: candidates.filter((c) => c.status === 'New').length },
    { label: 'Under Review', value: candidates.filter((c) => c.status === 'Under Review').length },
    { label: 'Approved', value: candidates.filter((c) => c.status === 'Approved').length },
  ]
}

export default function DashboardPage() {
  const stats = getStats(mockCandidates)

  return (
    <DashboardShell
      title="Candidates"
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

      <SearchFilterBar />
      <CandidateTable candidates={mockCandidates} />
    </DashboardShell>
  )
}
