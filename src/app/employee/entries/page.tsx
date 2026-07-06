import { EmployeeShell } from '../EmployeeShell'
import { TrackerTopbar } from '../tracker/TrackerTopbar'
import { EntriesTable } from '@/components/employee/EntriesTable'
import { getEntries } from '@/lib/employee-store'

export default async function EmployeeEntriesPage() {
  const initial = await getEntries({ page: 1, limit: 10 })

  return (
    <EmployeeShell>
      <TrackerTopbar
        eyebrow="emp_entries_eyebrow"
        title="emp_entries_title"
        desc="emp_entries_desc"
      />
      <EntriesTable initialResult={initial} />
    </EmployeeShell>
  )
}
