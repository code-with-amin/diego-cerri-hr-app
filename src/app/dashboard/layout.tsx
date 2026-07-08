import type { ReactNode } from 'react'
import { requireAdminSession } from '@/lib/guards'

/** Authoritative admin gate for the whole /dashboard subtree. */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAdminSession()
  return <>{children}</>
}
