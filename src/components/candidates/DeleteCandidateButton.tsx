'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteCandidateAction } from '@/app/actions/delete-candidate'
import { useLanguage } from '@/components/providers/LanguageProvider'

interface DeleteCandidateButtonProps {
  candidateId: string
  candidateName: string
  /** When true, render a full-width labelled button (detail page) instead of an icon button. */
  withLabel?: boolean
  /** Where to send the user after a successful delete (e.g. back to the list). */
  redirectTo?: string
}

export function DeleteCandidateButton({
  candidateId,
  candidateName,
  withLabel = false,
  redirectTo,
}: DeleteCandidateButtonProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const confirmDelete = () => {
    setError(null)
    startTransition(async () => {
      const res = await deleteCandidateAction(candidateId)
      if (res?.error) {
        setError(t('delete_error'))
        return
      }
      setOpen(false)
      if (redirectTo) router.push(redirectTo)
      else router.refresh()
    })
  }

  return (
    <>
      {withLabel ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t('action_delete')}
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t('action_delete')}
          title={t('action_delete')}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isPending && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold">{t('delete_title')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{candidateName}</span>
                  {' — '}
                  {t('delete_body')}
                </p>
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t('delete_cancel')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmDelete}
                disabled={isPending}
              >
                {isPending ? t('delete_deleting') : t('delete_confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
