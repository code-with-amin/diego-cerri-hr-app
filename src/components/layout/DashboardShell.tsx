'use client'

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

  const resolvedTitle = 'titleKey' in props && props.titleKey ? t(props.titleKey) : (props as { title: string }).title
  const resolvedSubtitle = 'subtitleKey' in props && props.subtitleKey
    ? subtitleSuffix
      ? `${subtitleSuffix} ${t(props.subtitleKey)}`
      : t(props.subtitleKey)
    : (props as { subtitle?: string }).subtitle

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar title={resolvedTitle} subtitle={resolvedSubtitle} />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
