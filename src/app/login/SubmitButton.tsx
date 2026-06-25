'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useLanguage } from '@/components/providers/LanguageProvider'

export function SubmitButton() {
  const { pending } = useFormStatus()
  const { t } = useLanguage()

  return (
    <Button type="submit" className="w-full mt-2" disabled={pending}>
      {pending && <Spinner className="mr-2" />}
      {pending ? t('login_submitting') : t('login_submit')}
    </Button>
  )
}
