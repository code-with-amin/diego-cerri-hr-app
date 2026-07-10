import type { ReactNode } from 'react'
import { requireEmployeeSession } from '@/lib/guards'

/** Authoritative employee gate for /employee/tracker. */
export default async function EmployeeTrackerLayout({ children }: { children: ReactNode }) {
  await requireEmployeeSession()
  return <>{children}</>
}
