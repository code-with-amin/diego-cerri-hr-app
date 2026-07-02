'use client'

import { Menu } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/employee/ThemeToggle'
import { employeeLogoutAction } from '@/app/employee/login/actions'

interface EmployeeHeaderProps {
  showSignOut?: boolean
  /** Opens the mobile navigation drawer. When set, a hamburger button is shown. */
  onMenuClick?: () => void
}

export function EmployeeHeader({ showSignOut, onMenuClick }: EmployeeHeaderProps) {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="border-b bg-card px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="-ml-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <div className="flex items-center rounded-lg border overflow-hidden text-xs font-semibold">
          {(['en', 'pt'] as Language[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === l
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        {showSignOut && (
          <form action={employeeLogoutAction}>
            <Button type="submit" variant="outline" size="sm">{t('emp_sign_out')}</Button>
          </form>
        )}
      </div>
    </header>
  )
}
