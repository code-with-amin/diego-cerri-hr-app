'use client'

import { useState } from 'react'
import { PanelLeftOpen } from 'lucide-react'
import { EmployeeHeader } from '@/components/employee/EmployeeHeader'
import { TrackerSidebar } from './tracker/TrackerSidebar'
import { TrackerProvider } from '@/components/providers/TrackerContext'

const SIDEBAR_KEY = 'emp_sidebar_collapsed'

export function EmployeeShell({ children }: { children: React.ReactNode }) {
  // Read synchronously so a remount on navigation mounts in the right state
  // (no expanded → collapsed flash).
  const [collapsed, setCollapsed] = useState<boolean>(
    () => typeof window !== 'undefined' && localStorage.getItem(SIDEBAR_KEY) === 'true',
  )

  function setCollapsedPersist(value: boolean) {
    setCollapsed(value)
    localStorage.setItem(SIDEBAR_KEY, String(value))
  }

  return (
    <TrackerProvider>
      <div
        className={`relative min-h-screen flex flex-col lg:grid bg-muted/40 transition-[grid-template-columns] duration-300 ease-in-out ${
          collapsed ? 'lg:grid-cols-[80px_1fr]' : 'lg:grid-cols-[320px_1fr]'
        }`}
      >
        {/* Top header — mobile & tablet only; on lg the sidebar carries the brand */}
        <div className="lg:hidden">
          <EmployeeHeader showSignOut />
        </div>
        <TrackerSidebar collapsed={collapsed} onToggle={() => setCollapsedPersist(!collapsed)} />

        {/* Floating expand button — sits on the collapsed sidebar's right edge */}
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsedPersist(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="hidden lg:flex absolute top-6 left-20 z-20 -translate-x-1/2 items-center justify-center rounded-full border bg-card p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
          >
            <PanelLeftOpen className="size-5" />
          </button>
        )}

        <main className="p-4 md:p-6 space-y-6">{children}</main>
      </div>
    </TrackerProvider>
  )
}
