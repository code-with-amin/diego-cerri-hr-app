'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/app/login/SubmitButton'
import { forgotPasswordAction } from './actions'
import { useLanguage } from '@/components/providers/LanguageProvider'

function ForgotForm() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const sent = searchParams.get('sent') === '1'

  if (sent) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('emp_forgot_sent')}</p>
        <Link href="/employee/login" className="text-sm text-primary hover:underline">
          {t('emp_reset_back')}
        </Link>
      </div>
    )
  }

  return (
    <form action={forgotPasswordAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">{t('login_email')}</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <SubmitButton idleKey="emp_forgot_submit" pendingKey="emp_forgot_submitting" />
      <Link
        href="/employee/login"
        className="block text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {t('emp_reset_back')}
      </Link>
    </form>
  )
}

export default function ForgotPasswordPage() {
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
            <CardTitle className="text-lg">{t('emp_forgot_title')}</CardTitle>
            <CardDescription>{t('emp_forgot_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <ForgotForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
