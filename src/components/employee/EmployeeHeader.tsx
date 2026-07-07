'use client'

import { useFormStatus } from 'react-dom'
import { Menu } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTracker } from '@/components/providers/TrackerContext'
import { Language } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ThemeToggle } from '@/components/employee/ThemeToggle'
import { employeeLogoutAction } from '@/app/employee/login/actions'

// Submit button for the sign-out form — reflects the action's pending state
// with the shared spinner (must live inside the <form> to read useFormStatus).
function SignOutButton() {
  const { pending } = useFormStatus()
  const { t } = useLanguage()
  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {pending && <Spinner className="mr-1.5 size-3.5" />}
      {t('emp_sign_out')}
    </Button>
  )
}

interface EmployeeHeaderProps {
  showSignOut?: boolean
  /** Opens the mobile navigation drawer. When set, a hamburger button is shown. */
  onMenuClick?: () => void
}

export function EmployeeHeader({ showSignOut, onMenuClick }: EmployeeHeaderProps) {
  const { lang, setLang, t } = useLanguage()
  const { userName, userEmail, hydrated } = useTracker()

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
        {hydrated && userName && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium">{userName}</p>
            {userEmail && (
              <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
            )}
          </div>
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
            <SignOutButton />
          </form>
        )}
      </div>
    </header>
  )
}
