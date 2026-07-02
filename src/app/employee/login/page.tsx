'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { employeeLoginAction } from './actions'
import { useLanguage } from '@/components/providers/LanguageProvider'

function LoginForm() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const hasError = searchParams.get('error') === 'invalid'

  return (
    <form action={employeeLoginAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">{t('login_email')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="colaborador@kpiengenharia.com"
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
      {hasError && (
        <p className="text-sm text-destructive">{t('login_error')}</p>
      )}
      <Button type="submit" className="w-full mt-2">
        {t('emp_login_submit')}
      </Button>
    </form>
  )
}

export default function EmployeeLoginPage() {
  const { t } = useLanguage()

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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1765de] text-primary-foreground font-bold text-sm">
              KPI
            </div>
            <h1 className="text-xl text-foreground font-semibold">{t('emp_portal')}</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">{t('emp_login_title')}</CardTitle>
            <CardDescription>{t('emp_login_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-primary-foreground">
          {t('emp_login_restricted')}
        </p>
      </div>
    </div>
  )
}
