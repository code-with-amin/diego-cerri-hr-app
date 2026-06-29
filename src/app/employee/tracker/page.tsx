'use client'

import { EmployeeHeader } from '@/components/employee/EmployeeHeader'
import { TimerBar } from './TimerBar'
import { ActivityForm } from './ActivityForm'
import { HistoryTable } from './HistoryTable'
import { Card } from '@/components/ui/card'

export default function TrackerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <EmployeeHeader showSignOut />
      <TimerBar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-6 space-y-6 pb-12">
        <Card>
          <ActivityForm />
        </Card>
        <HistoryTable />
      </main>
    </div>
  )
}
