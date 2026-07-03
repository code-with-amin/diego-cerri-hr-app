import { EmployeeShell } from '../EmployeeShell'
import { TrackerTopbar } from '../tracker/TrackerTopbar'
import { ActivityStats } from '@/components/employee/ActivityStats'
import { HoursChart } from '@/components/employee/HoursChart'
import { ActivityBreakdownChart } from '@/components/employee/ActivityBreakdownChart'
import { RecentEntries } from '@/components/employee/RecentEntries'
import { getSummary, mapEntry } from '@/lib/employee-store'

export default async function EmployeeDashboardPage() {
  const summary = await getSummary(7)

  return (
    <EmployeeShell>
      <TrackerTopbar eyebrow="emp_dash_eyebrow" title="emp_dash_title" desc="emp_dash_desc" />

      {/* Stat cards */}
      <ActivityStats
        hoursToday={summary.hoursToday}
        weekHours={summary.weekHours}
        weekCost={summary.weekCost}
        weekEntryCount={summary.weekEntryCount}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HoursChart perDay={summary.perDay} />
        </div>
        <div>
          <ActivityBreakdownChart breakdown={summary.activityBreakdown} />
        </div>
      </div>

      {/* Recent entries */}
      <RecentEntries entries={summary.recent.map(mapEntry).slice(0, 5)} />
    </EmployeeShell>
  )
}
