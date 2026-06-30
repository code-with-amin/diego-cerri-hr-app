'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTracker } from '@/components/providers/TrackerContext'
import { Language } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/employee/ThemeToggle'
import { employeeLogoutAction } from '@/app/employee/login/actions'

function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    function tick() {
      const now = new Date()
      setTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export function TrackerTopbar() {
  const { lang, setLang, t } = useLanguage()
  const { timerStatus } = useTracker()
  const clock = useClock()

  const statusLabel =
    timerStatus === 'running'
      ? t('emp_status_running')
      : timerStatus === 'paused'
      ? t('emp_status_paused')
      : t('emp_status_not_started')

  const statusDot =
    timerStatus === 'running'
      ? 'bg-emerald-500'
      : timerStatus === 'paused'
      ? 'bg-amber-400'
      : 'bg-muted-foreground/50'

  return (
    <header className="space-y-4">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${statusDot}`} />
          <span>{statusLabel}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm">
          <span className="text-muted-foreground">{t('emp_current_time')}:</span>
          <strong className="font-mono font-semibold tabular-nums">{clock}</strong>
        </div>
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

      {/* Heading block */}
      <div className="space-y-1 max-w-prose">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {t('emp_daily_entry')}
        </span>
        <h2 className="text-2xl font-semibold leading-tight">{t('emp_page_title')}</h2>
        <p className="text-sm text-muted-foreground">{t('emp_page_desc')}</p>
      </div>
    </header>
  )
}
