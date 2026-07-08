import type { ReactNode } from 'react'
import { requireEmployeeSession } from '@/lib/guards'

/** Authoritative employee gate for /employee/dashboard. */
export default async function EmployeeDashboardLayout({ children }: { children: ReactNode }) {
  await requireEmployeeSession()
  return <>{children}</>
}
