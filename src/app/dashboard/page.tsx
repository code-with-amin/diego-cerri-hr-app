import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatCards } from '@/components/dashboard/StatCards'
import { PipelineChart } from '@/components/dashboard/PipelineChart'
import { SubmissionsChart } from '@/components/dashboard/SubmissionsChart'
import { LatestCandidatesSection } from '@/components/dashboard/LatestCandidatesSection'
import { getCandidates } from '@/lib/candidate-store'
import { CandidateStatus } from '@/lib/types'

export default async function DashboardPage() {
  const [allRes, newRes, reviewRes, approvedRes, rejectedRes] = await Promise.all([
    getCandidates({ limit: 100 }),
    getCandidates({ status: 'New', limit: 1 }),
    getCandidates({ status: 'Under Review', limit: 1 }),
    getCandidates({ status: 'Approved', limit: 1 }),
    getCandidates({ status: 'Rejected', limit: 1 }),
  ])

  const statusCounts: Record<CandidateStatus, number> = {
    New: newRes.total,
    'Under Review': reviewRes.total,
    Approved: approvedRes.total,
    Rejected: rejectedRes.total,
  }

  const candidates = allRes.candidates

  return (
    <DashboardShell
      titleKey="page_dashboard"
      subtitleKey="page_dashboard_subtitle"
    >
      <StatCards total={allRes.total} counts={statusCounts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SubmissionsChart candidates={candidates} />
        </div>
        <div>
          <PipelineChart counts={statusCounts} />
        </div>
      </div>

      <LatestCandidatesSection candidates={candidates.slice(0, 5)} />
    </DashboardShell>
  )
}
