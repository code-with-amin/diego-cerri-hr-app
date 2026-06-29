'use client'

import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { loginAction } from '@/app/login/actions'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function EmployeeLoginPage() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-primary px-4">
      <Image
        src="/bg.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,30,76,.92),rgba(28,58,97,.78))]" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="flex justify-center items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary-foreground font-bold text-sm">
              KPI
            </div>
            <h1 className="text-xl text-primary-foreground font-semibold">{t('emp_portal')}</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">{t('emp_login_title')}</CardTitle>
            <CardDescription>{t('emp_login_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={loginAction} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t('login_email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="employee@company.com"
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
              <Button type="submit" className="w-full mt-2">
                {t('emp_login_submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-primary-foreground">
          {t('emp_login_restricted')}
        </p>
      </div>
    </div>
  )
}
