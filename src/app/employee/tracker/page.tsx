'use client'

import { EmployeeShell } from '../EmployeeShell'
import { TrackerTopbar } from './TrackerTopbar'
import { ActivityForm } from './ActivityForm'
import { SummaryPanel } from './SummaryPanel'
import { HistoryTable } from './HistoryTable'

export default function TrackerPage() {
  return (
    <EmployeeShell>
      <TrackerTopbar />
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
        <ActivityForm />
        <SummaryPanel />
      </div>
      <HistoryTable />
    </EmployeeShell>
  )
}
