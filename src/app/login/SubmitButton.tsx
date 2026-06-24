'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full mt-2" disabled={pending}>
      {pending && <Spinner className="mr-2" />}
      {pending ? 'Signing in…' : 'Sign in'}
    </Button>
  )
}
