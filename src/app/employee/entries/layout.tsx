import type { ReactNode } from 'react'
import { requireEmployeeSession } from '@/lib/guards'

/** Authoritative employee gate for /employee/entries. */
export default async function EmployeeEntriesLayout({ children }: { children: ReactNode }) {
  await requireEmployeeSession()
  return <>{children}</>
}
