'use client'

import { EmployeeShell } from '../EmployeeShell'
import { TrackerTopbar } from '../tracker/TrackerTopbar'
import { EntriesTable } from '@/components/employee/EntriesTable'

export default function EmployeeEntriesPage() {
  return (
    <EmployeeShell>
      <TrackerTopbar
        eyebrow="emp_entries_eyebrow"
        title="emp_entries_title"
        desc="emp_entries_desc"
      />
      <EntriesTable />
    </EmployeeShell>
  )
}
