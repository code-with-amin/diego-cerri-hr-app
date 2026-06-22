import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PipelineChart } from '@/components/dashboard/PipelineChart'
import { SubmissionsChart } from '@/components/dashboard/SubmissionsChart'
import { getCandidates } from '@/lib/candidate-store'
import { CandidateStatus } from '@/lib/types'

export default function DashboardPage() {
  const all = getCandidates()

  const statusCounts = all.reduce(
    (acc, c) => { acc[c.status] = (acc[c.status] ?? 0) + 1; return acc },
    {} as Record<CandidateStatus, number>,
  )

  const stats = [
    { label: 'Total Candidates', value: all.length },
    { label: 'New', value: statusCounts['New'] ?? 0 },
    { label: 'Under Review', value: statusCounts['Under Review'] ?? 0 },
    { label: 'Approved', value: statusCounts['Approved'] ?? 0 },
  ]

  return (
    <DashboardShell
      title="Dashboard"
      subtitle={`${all.length} total registrations`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SubmissionsChart candidates={all} />
        </div>
        <div>
          <PipelineChart counts={statusCounts} />
        </div>
      </div>
    </DashboardShell>
  )
}
