'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Clock,
  History,
  PanelLeftClose,
  type LucideIcon,
} from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTracker } from '@/components/providers/TrackerContext'
import { TranslationKey } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { MOCK_EMPLOYEE } from '@/data/employee-mock'

const TIPS: TranslationKey[] = ['emp_tip_1', 'emp_tip_2', 'emp_tip_3']

export function TrackerSidebar({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean
  onToggle?: () => void
}) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const { timerStatus } = useTracker()

  return (
    <aside
      className={`border-b lg:border-b-0 lg:border-r bg-card/60 p-4 md:p-6 flex flex-col gap-6 overflow-hidden transition-[padding] duration-300 ease-in-out ${
        collapsed ? 'lg:items-center lg:px-2' : ''
      }`}
    >
      {/* Brand + collapse toggle */}
      <div className="hidden lg:flex items-center justify-between gap-2">
        <div className={`flex items-center gap-2 ${collapsed ? 'lg:justify-center' : ''}`}>
          <svg viewBox="0 0 48 48" fill="none" aria-label="Logo do sistema de apontamento" className='size-8 shrink-0'><rect x="5" y="5" width="38" height="38" rx="12" stroke="currentColor" stroke-width="3"></rect><path d="M17 30V18h6.5c4 0 6.5 2.2 6.5 6s-2.5 6-6.5 6H17Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"></path><path d="M31 14v20" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg>
          {!collapsed && (
            <div>
              <h1 className='text-md font-semibold text-foreground'>{t('emp_brand_name')}</h1>
              <p className='text-xs text-muted-foreground'>{t('emp_brand_tagline')}</p>
            </div>
          )}
        </div>
        {onToggle && !collapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <PanelLeftClose className="size-5" />
          </button>
        )}
      </div>

      <div
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6 ${
          collapsed ? 'lg:w-full' : ''
        }`}
      >
        {/* Connected user */}
        {!collapsed && (
          <Card size="sm" className="px-4 gap-1">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('emp_user_connected')}
            </span>
            <span className="font-bold">{MOCK_EMPLOYEE.name}</span>
            <p className="text-xs text-muted-foreground">{MOCK_EMPLOYEE.role}</p>
          </Card>
        )}

        {/* Shortcuts */}
        <div className="space-y-3">
          {!collapsed && (
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('emp_shortcuts')}
            </p>
          )}
          <nav className="grid gap-2">
            <NavItem
              icon={LayoutDashboard}
              label={t('emp_nav_dashboard')}
              href="/employee/dashboard"
              active={pathname === '/employee/dashboard'}
              collapsed={collapsed}
            />
            <NavItem
              icon={Clock}
              label={t('emp_nav_tracking')}
              value={timerStatus !== 'idle' ? t('emp_status_running') : t('emp_nav_today')}
              href="/employee/tracker"
              active={pathname === '/employee/tracker'}
              collapsed={collapsed}
            />
            <NavItem
              icon={History}
              label={t('emp_nav_history')}
              href="/employee/entries"
              active={pathname === '/employee/entries'}
              collapsed={collapsed}
            />
          </nav>
        </div>

        {/* Best practices */}
        {!collapsed && (
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
        )}
      </div>
    </aside>
  )
}

function NavItem({
  label,
  value,
  href,
  active,
  disabled,
  icon: Icon,
  collapsed,
}: {
  label: string
  value?: string
  href?: string
  active?: boolean
  disabled?: boolean
  icon?: LucideIcon
  collapsed?: boolean
}) {
  const className = `flex min-h-11 items-center gap-2.5 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
    collapsed ? 'lg:justify-center lg:px-0' : 'justify-between'
  } ${
    disabled
      ? 'border-border cursor-not-allowed text-muted-foreground'
      : active
        ? 'border-primary/30 bg-primary/10 font-semibold'
        : 'border-transparent hover:bg-muted'
  }`

  const content = collapsed ? (
    Icon ? <Icon className="size-5 shrink-0" /> : <span>{label}</span>
  ) : (
    <>
      <span className="flex items-center gap-2.5">
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        {label}
      </span>
      {value ? <span className="text-xs text-muted-foreground">{value}</span> : null}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        aria-current={active ? 'page' : undefined}
        title={collapsed ? label : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      title={collapsed ? label : undefined}
    >
      {content}
    </button>
  )
}
