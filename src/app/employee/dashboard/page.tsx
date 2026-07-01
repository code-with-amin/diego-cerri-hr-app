'use client'

import { EmployeeShell } from '../EmployeeShell'
import { TrackerTopbar } from '../tracker/TrackerTopbar'
import { ActivityStats } from '@/components/employee/ActivityStats'
import { HoursChart } from '@/components/employee/HoursChart'
import { ActivityBreakdownChart } from '@/components/employee/ActivityBreakdownChart'
import { RecentEntries } from '@/components/employee/RecentEntries'

export default function EmployeeDashboardPage() {
  return (
    <EmployeeShell>
      <TrackerTopbar eyebrow="emp_dash_eyebrow" title="emp_dash_title" desc="emp_dash_desc" />

      {/* Stat cards */}
      <ActivityStats />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HoursChart />
        </div>
        <div>
          <ActivityBreakdownChart />
        </div>
      </div>

      {/* Recent entries */}
      <RecentEntries />
    </EmployeeShell>
  )
}
