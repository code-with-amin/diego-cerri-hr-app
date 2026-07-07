'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useLanguage } from '@/components/providers/LanguageProvider'
import type { TranslationKey } from '@/lib/i18n'

/**
 * Submit button that reflects the parent <form action> pending state with a
 * shared spinner + "…submitting" label. Reused across every server-action form
 * (admin login, employee login, password reset) so loading states look
 * identical. Defaults to the admin-login labels.
 */
export function SubmitButton({
  idleKey = 'login_submit',
  pendingKey = 'login_submitting',
}: {
  idleKey?: TranslationKey
  pendingKey?: TranslationKey
}) {
  const { pending } = useFormStatus()
  const { t } = useLanguage()

  return (
    <Button type="submit" className="w-full mt-2" disabled={pending}>
      {pending && <Spinner className="mr-2" />}
      {pending ? t(pendingKey) : t(idleKey)}
    </Button>
  )
}
