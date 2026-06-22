'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CandidateStatus } from '@/lib/types'
import { updateStatusAction } from '@/app/actions/update-status'
import { useLanguage } from '@/components/providers/LanguageProvider'

const STATUSES: CandidateStatus[] = ['New', 'Under Review', 'Approved', 'Rejected']

const activeClasses: Record<CandidateStatus, string> = {
  New:            'bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-100',
  'Under Review': 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100',
  Approved:       'bg-green-100 text-green-700 border-green-300 hover:bg-green-100',
  Rejected:       'bg-red-100 text-red-700 border-red-300 hover:bg-red-100',
}

interface StatusSelectorProps {
  candidateId: string
  currentStatus: CandidateStatus
}

export function StatusSelector({ candidateId, currentStatus }: StatusSelectorProps) {
  const [isPending, startTransition] = useTransition()
  const { t } = useLanguage()

  function handleSelect(status: CandidateStatus) {
    if (status === currentStatus || isPending) return
    startTransition(() => updateStatusAction(candidateId, status))
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t('status_label')}
      </p>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => {
          const isActive = status === currentStatus
          return (
            <Button
              key={status}
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handleSelect(status)}
              className={cn(
                'transition-colors',
                isActive ? activeClasses[status] : 'hover:bg-muted',
                isPending && 'opacity-60 cursor-wait',
              )}
            >
              {status}
            </Button>
          )
        })}
      </div>
      {isPending && (
        <p className="mt-2 text-xs text-muted-foreground animate-pulse">{t('status_saving')}</p>
      )}
    </div>
  )
}
