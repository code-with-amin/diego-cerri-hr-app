'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Clock,
  History,
  PanelLeftClose,
  X,
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
  mobileOpen = false,
  onClose,
}: {
  collapsed?: boolean
  onToggle?: () => void
  /** Below lg the sidebar is an off-canvas drawer; this controls its open state. */
  mobileOpen?: boolean
  onClose?: () => void
}) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const { timerStatus } = useTracker()

  // `collapsed` is a desktop-only affordance; below lg the drawer is always
  // fully expanded, so collapse classes are all scoped to `lg:`.
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col gap-6 overflow-y-auto border-r bg-card p-6 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-hidden lg:bg-card/60 lg:shadow-none ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } ${collapsed ? 'lg:items-center lg:px-2' : ''}`}
    >
      {/* Brand + toggles */}
      <div className="flex items-center justify-between gap-2">
        <div className={`flex items-center gap-2 ${collapsed ? 'lg:justify-center' : ''}`}>
          <svg viewBox="0 0 48 48" fill="none" aria-label="Logo do sistema de apontamento" className='size-8 shrink-0'><rect x="5" y="5" width="38" height="38" rx="12" stroke="currentColor" stroke-width="3"></rect><path d="M17 30V18h6.5c4 0 6.5 2.2 6.5 6s-2.5 6-6.5 6H17Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"></path><path d="M31 14v20" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg>
          <div className={collapsed ? 'lg:hidden' : ''}>
            <h1 className='text-md font-semibold text-foreground'>{t('emp_brand_name')}</h1>
            <p className='text-xs text-muted-foreground'>{t('emp_brand_tagline')}</p>
          </div>
        </div>
        {/* Desktop collapse — only while expanded (the floating button re-expands) */}
        {onToggle && !collapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:inline-flex"
          >
            <PanelLeftClose className="size-5" />
          </button>
        )}
        {/* Mobile close */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <div className={`grid gap-4 lg:gap-6 ${collapsed ? 'lg:w-full' : ''}`}>
        {/* Connected user */}
        <Card size="sm" className={`px-4 gap-1 ${collapsed ? 'lg:hidden' : ''}`}>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {t('emp_user_connected')}
          </span>
          <span className="font-bold">{MOCK_EMPLOYEE.name}</span>
          <p className="text-xs text-muted-foreground">{MOCK_EMPLOYEE.role}</p>
        </Card>

        {/* Shortcuts */}
        <div className="space-y-3">
          <p
            className={`text-xs uppercase tracking-wide text-muted-foreground ${
              collapsed ? 'lg:hidden' : ''
            }`}
          >
            {t('emp_shortcuts')}
          </p>
          <nav className="grid gap-2">
            <NavItem
              icon={LayoutDashboard}
              label={t('emp_nav_dashboard')}
              href="/employee/dashboard"
              active={pathname === '/employee/dashboard'}
              collapsed={collapsed}
              onNavigate={onClose}
            />
            <NavItem
              icon={Clock}
              label={t('emp_nav_tracking')}
              value={timerStatus !== 'idle' ? t('emp_status_running') : t('emp_nav_today')}
              href="/employee/tracker"
              active={pathname === '/employee/tracker'}
              collapsed={collapsed}
              onNavigate={onClose}
            />
            <NavItem
              icon={History}
              label={t('emp_nav_history')}
              href="/employee/entries"
              active={pathname === '/employee/entries'}
              collapsed={collapsed}
              onNavigate={onClose}
            />
          </nav>
        </div>

        {/* Best practices */}
        <Card size="sm" className={`px-4 gap-3 ${collapsed ? 'lg:hidden' : ''}`}>
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
  disabled,
  icon: Icon,
  collapsed,
  onNavigate,
}: {
  label: string
  value?: string
  href?: string
  active?: boolean
  disabled?: boolean
  icon?: LucideIcon
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const className = `flex min-h-11 items-center gap-2.5 rounded-lg border px-4 py-2.5 text-left text-sm justify-between transition-colors ${
    collapsed ? 'lg:justify-center lg:px-0' : ''
  } ${
    disabled
      ? 'border-border cursor-not-allowed text-muted-foreground'
      : active
        ? 'border-primary/30 bg-primary/10 font-semibold'
        : 'border-transparent hover:bg-muted'
  }`

  // Full content is always rendered; when collapsed, the label/value collapse
  // to icon-only at lg+ while the mobile drawer keeps them visible.
  const content = (
    <>
      <span className="flex items-center gap-2.5">
        {Icon ? <Icon className="size-5 shrink-0" /> : null}
        <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
      </span>
      {value ? (
        <span className={`text-xs text-muted-foreground ${collapsed ? 'lg:hidden' : ''}`}>
          {value}
        </span>
      ) : null}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
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
