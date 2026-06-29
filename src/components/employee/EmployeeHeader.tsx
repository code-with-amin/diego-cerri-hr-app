'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

interface EmployeeHeaderProps {
  showSignOut?: boolean
}

export function EmployeeHeader({ showSignOut }: EmployeeHeaderProps) {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="border-b bg-card px-6 py-3 flex items-center justify-between">
      <div className="flex justify-center items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary-foreground font-bold text-sm">
              KPI
            </div>
            <h1 className="text-md text-foreground font-semibold">{t('emp_portal')}</h1>
      </div>
      <div className="flex items-center gap-3">
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
          <Button variant="outline" size="sm">{t('emp_sign_out')}</Button>
        )}
      </div>
    </header>
  )
}
