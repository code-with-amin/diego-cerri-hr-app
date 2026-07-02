'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTracker } from '@/components/providers/TrackerContext'
import { TranslationKey } from '@/lib/i18n'

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

export function TrackerTopbar({
  eyebrow = 'emp_daily_entry',
  title = 'emp_page_title',
  desc = 'emp_page_desc',
}: {
  eyebrow?: TranslationKey
  title?: TranslationKey
  desc?: TranslationKey
} = {}) {
  const { t } = useLanguage()
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
      </div>

      {/* Heading block */}
      <div className="space-y-1 max-w-prose">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {t(eyebrow)}
        </span>
        <h2 className="text-2xl font-semibold leading-tight">{t(title)}</h2>
        <p className="text-sm text-muted-foreground">{t(desc)}</p>
      </div>
    </header>
  )
}
