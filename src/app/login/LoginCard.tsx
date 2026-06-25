'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from './actions'
import { SubmitButton } from './SubmitButton'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n'

export function LoginCard({ hasError }: { hasError: boolean }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex justify-center items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary-foreground font-bold text-m">
            KPI
          </div>
          <h1 className="text-xl text-primary-foreground font-semibold">{t('login_portal')}</h1>
        </div>
        <div className="flex items-center rounded-lg border border-primary-foreground/30 overflow-hidden text-xs font-semibold">
          {(['en', 'pt'] as Language[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === l
                  ? 'bg-secondary text-primary-foreground'
                  : 'text-primary-foreground/70 hover:bg-primary-foreground/10'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg">{t('login_title')}</CardTitle>
          <CardDescription>{t('login_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {hasError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {t('login_error')}
            </div>
          )}
          <form action={loginAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('login_email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@company.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t('login_password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-primary-foreground">{t('login_restricted')}</p>
    </div>
  )
}
