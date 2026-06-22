import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatCards } from '@/components/dashboard/StatCards'
import { PipelineChart } from '@/components/dashboard/PipelineChart'
import { SubmissionsChart } from '@/components/dashboard/SubmissionsChart'
import { LatestCandidatesSection } from '@/components/dashboard/LatestCandidatesSection'
import { getCandidates } from '@/lib/candidate-store'
import { CandidateStatus } from '@/lib/types'

export default function DashboardPage() {
  const all = getCandidates()

  const statusCounts = all.reduce(
    (acc, c) => { acc[c.status] = (acc[c.status] ?? 0) + 1; return acc },
    {} as Record<CandidateStatus, number>,
  )

  return (
    <DashboardShell
      titleKey="page_dashboard"
      subtitleKey="page_dashboard_subtitle"
    >
      <StatCards total={all.length} counts={statusCounts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SubmissionsChart candidates={all} />
        </div>
        <div>
          <PipelineChart counts={statusCounts} />
        </div>
      </div>

      <LatestCandidatesSection candidates={all.slice(0, 5)} />
    </DashboardShell>
  )
}
