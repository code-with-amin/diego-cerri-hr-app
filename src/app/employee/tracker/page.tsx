'use client'

import { EmployeeHeader } from '@/components/employee/EmployeeHeader'
import { TrackerSidebar } from './TrackerSidebar'
import { TrackerTopbar } from './TrackerTopbar'
import { ActivityForm } from './ActivityForm'
import { SummaryPanel } from './SummaryPanel'
import { HistoryTable } from './HistoryTable'

export default function TrackerPage() {
  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[320px_1fr] bg-muted/40">
      {/* Top header — mobile & tablet only; on lg the sidebar carries the brand */}
      <div className="lg:hidden">
        <EmployeeHeader showSignOut />
      </div>
      <TrackerSidebar />
      <main className="p-4 md:p-6 space-y-6">
        <TrackerTopbar />
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <ActivityForm />
          <SummaryPanel />
        </div>
        <HistoryTable />
      </main>
    </div>
  )
}
