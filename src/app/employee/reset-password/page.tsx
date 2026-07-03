'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { resetPasswordAction } from './actions'
import { useLanguage } from '@/components/providers/LanguageProvider'
import type { TranslationKey } from '@/lib/i18n'

const ERROR_KEYS: Record<string, TranslationKey> = {
  invalid: 'emp_reset_error_invalid',
  mismatch: 'emp_reset_error_mismatch',
  short: 'emp_reset_error_short',
}

function ResetForm() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const errorKey = ERROR_KEYS[searchParams.get('error') ?? '']

  if (!token) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{t('emp_reset_error_invalid')}</p>
        <Link href="/employee/forgot-password" className="text-sm text-primary hover:underline">
          {t('emp_forgot_title')}
        </Link>
      </div>
    )
  }

  return (
    <form action={resetPasswordAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-1.5">
        <Label htmlFor="password">{t('emp_reset_password')}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">{t('emp_reset_confirm')}</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      {errorKey && <p className="text-sm text-destructive">{t(errorKey)}</p>}
      <Button type="submit" className="w-full mt-2">
        {t('emp_reset_submit')}
      </Button>
      <Link
        href="/employee/login"
        className="block text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {t('emp_reset_back')}
      </Link>
    </form>
  )
}

export default function ResetPasswordPage() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-primary px-4">
      <Image src="/bg.jpeg" alt="Background" fill priority className="object-cover" />
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
            <CardTitle className="text-lg">{t('emp_reset_title')}</CardTitle>
            <CardDescription>{t('emp_reset_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <ResetForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
