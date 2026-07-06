'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'

/**
 * Password field with a show/hide (eye) toggle. Drop-in replacement for
 * `<Input type="password" />` — forwards every input prop; the `type` is
 * managed internally. The toggle is `type="button"` so it never submits a
 * form and stays out of the tab order (`tabIndex={-1}`).
 */
function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'type'>) {
  const { t } = useLanguage()
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('pr-9', className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={visible ? t('pwd_hide') : t('pwd_show')}
        title={visible ? t('pwd_hide') : t('pwd_show')}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-0 top-0 flex h-full items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        disabled={props.disabled}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export { PasswordInput }
