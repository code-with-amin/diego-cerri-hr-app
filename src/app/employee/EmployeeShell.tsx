'use client'

import { EmployeeHeader } from '@/components/employee/EmployeeHeader'
import { TrackerSidebar } from './tracker/TrackerSidebar'
import { TrackerProvider } from '@/components/providers/TrackerContext'

export function EmployeeShell({ children }: { children: React.ReactNode }) {
  return (
    <TrackerProvider>
      <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[320px_1fr] bg-muted/40">
        {/* Top header — mobile & tablet only; on lg the sidebar carries the brand */}
        <div className="lg:hidden">
          <EmployeeHeader showSignOut />
        </div>
        <TrackerSidebar />
        <main className="p-4 md:p-6 space-y-6">{children}</main>
      </div>
    </TrackerProvider>
  )
}
