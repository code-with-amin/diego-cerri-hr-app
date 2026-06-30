'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { EmployeeShell } from '../EmployeeShell'
import { ActivityStats } from '@/components/employee/ActivityStats'
import { HoursChart } from '@/components/employee/HoursChart'
import { ActivityBreakdownChart } from '@/components/employee/ActivityBreakdownChart'
import { RecentEntries } from '@/components/employee/RecentEntries'
import { ThemeToggle } from '@/components/employee/ThemeToggle'
import { employeeLogoutAction } from '../login/actions'

export default function EmployeeDashboardPage() {
  const { lang, setLang, t } = useLanguage()

  return (
    <EmployeeShell>
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <ThemeToggle />
          <div className="hidden lg:flex items-center overflow-hidden rounded-lg border text-xs font-semibold">
            {(['en', 'pt'] as Language[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2.5 py-1.5 transition-colors ${
                  lang === l ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <form action={employeeLogoutAction}>
            <Button type="submit" variant="outline" size="sm" className="hidden lg:inline-flex">
              {t('emp_sign_out')}
            </Button>
          </form>
        </div>

        <div className="space-y-1 max-w-prose">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {t('emp_dash_eyebrow')}
          </span>
          <h2 className="text-2xl font-semibold leading-tight">{t('emp_dash_title')}</h2>
          <p className="text-sm text-muted-foreground">{t('emp_dash_desc')}</p>
        </div>
      </header>

      {/* Stat cards */}
      <ActivityStats />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HoursChart />
        </div>
        <div>
          <ActivityBreakdownChart />
        </div>
      </div>

      {/* Recent entries */}
      <RecentEntries />
    </EmployeeShell>
  )
}
