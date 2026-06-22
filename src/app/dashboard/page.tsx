import Link from 'next/link'
import { Users, UserPlus, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PipelineChart } from '@/components/dashboard/PipelineChart'
import { SubmissionsChart } from '@/components/dashboard/SubmissionsChart'
import { CandidateTable } from '@/components/candidates/CandidateTable'
import { getCandidates } from '@/lib/candidate-store'
import { CandidateStatus } from '@/lib/types'

export default function DashboardPage() {
  const all = getCandidates()

  const statusCounts = all.reduce(
    (acc, c) => { acc[c.status] = (acc[c.status] ?? 0) + 1; return acc },
    {} as Record<CandidateStatus, number>,
  )

  const stats = [
    { label: 'Total Candidates', value: all.length, icon: Users, colour: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'New', value: statusCounts['New'] ?? 0, icon: UserPlus, colour: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Under Review', value: statusCounts['Under Review'] ?? 0, icon: Clock, colour: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Approved', value: statusCounts['Approved'] ?? 0, icon: CheckCircle, colour: 'text-green-600', bg: 'bg-green-100' },
  ]

  return (
    <DashboardShell
      title="Dashboard"
      subtitle={`${all.length} candidates · pipeline analytics & recent activity`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-1 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </CardTitle>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.colour}`} />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SubmissionsChart candidates={all} />
        </div>
        <div>
          <PipelineChart counts={statusCounts} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Latest Candidates</h2>
          <Link
            href="/dashboard/candidates"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            View all
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
        <CandidateTable candidates={all.slice(0, 5)} />
      </div>
    </DashboardShell>
  )
}
