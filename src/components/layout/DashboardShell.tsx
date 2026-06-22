'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'

type DashboardShellProps = {
  children: React.ReactNode
  subtitleSuffix?: string
} & (
  | { titleKey: TranslationKey; title?: never; subtitleKey?: TranslationKey; subtitle?: never }
  | { title: string; titleKey?: never; subtitle?: string; subtitleKey?: never }
)

export function DashboardShell({ children, subtitleSuffix, ...props }: DashboardShellProps) {
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const resolvedTitle = 'titleKey' in props && props.titleKey ? t(props.titleKey) : (props as { title: string }).title
  const resolvedSubtitle = 'subtitleKey' in props && props.subtitleKey
    ? subtitleSuffix
      ? `${subtitleSuffix} ${t(props.subtitleKey)}`
      : t(props.subtitleKey)
    : (props as { subtitle?: string }).subtitle

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-in sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar
          title={resolvedTitle}
          subtitle={resolvedSubtitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
