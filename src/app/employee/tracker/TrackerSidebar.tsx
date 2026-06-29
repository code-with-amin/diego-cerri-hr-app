'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import { Card } from '@/components/ui/card'

const TIPS: TranslationKey[] = ['emp_tip_1', 'emp_tip_2', 'emp_tip_3']

export function TrackerSidebar() {
  const { t } = useLanguage()
  const pathname = usePathname()

  return (
    <aside className="border-b lg:border-b-0 lg:border-r bg-card/60 p-4 md:p-6 flex flex-col gap-6">
      {/* Brand — only on lg; mobile/tablet show it in the top header instead */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary-foreground font-bold text-xs">
          KPI
        </div>
        <h1 className="text-md text-foreground font-semibold">{t('emp_portal')}</h1>
      </div>

      {/* Content — single column on lg, responsive grid on smaller screens */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
        {/* Connected user */}
        <Card size="sm" className="px-4 gap-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {t('emp_user_connected')}
          </span>
          <span className="font-bold tabular-nums">{t('emp_awaiting_login')}</span>
          <p className="text-xs text-muted-foreground">{t('emp_identify_start')}</p>
        </Card>

        {/* Shortcuts */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {t('emp_shortcuts')}
          </p>
          <nav className="grid gap-2">
            <NavItem
              label={t('emp_nav_dashboard')}
              href="/employee/dashboard"
              active={pathname === '/employee/dashboard'}
            />
            <NavItem
              label={t('emp_nav_tracking')}
              value={t('emp_nav_today')}
              href="/employee/tracker"
              active={pathname === '/employee/tracker'}
            />
            <NavItem label={t('emp_nav_breaks')} value="0" />
            <NavItem label={t('emp_nav_history')} value="0" />
          </nav>
        </div>

        {/* Best practices */}
        <Card size="sm" className="px-4 gap-3 sm:col-span-2 lg:col-span-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {t('emp_best_practices')}
          </span>
          <div className="space-y-3 text-sm text-muted-foreground">
            {TIPS.map((tip) => (
              <p key={tip}>{t(tip)}</p>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  )
}

function NavItem({
  label,
  value,
  href,
  active,
}: {
  label: string
  value?: string
  href?: string
  active?: boolean
}) {
  const className = `flex min-h-11 items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
    active ? 'border-primary/30 bg-primary/10 font-semibold' : 'border-transparent hover:bg-muted'
  }`

  const content = (
    <>
      <span>{label}</span>
      {value ? <span className="text-xs text-muted-foreground">{value}</span> : null}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={className} aria-current={active ? 'page' : undefined}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  )
}
