'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export function TrackerTopbar() {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="space-y-4">
      {/* Top row — status, current time, lang, sign out */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
          <span>{t('emp_status_not_started')}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm">
          <span className="text-muted-foreground">{t('emp_current_time')}:</span>
          <strong className="font-mono font-semibold tabular-nums">00:00:00</strong>
        </div>
        {/* Lang + sign out — only on lg; smaller screens use the top header */}
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
        <Button variant="outline" size="sm" className="hidden lg:inline-flex">
          {t('emp_sign_out')}
        </Button>
      </div>

      {/* Heading block — below the top row */}
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
