'use client'

import { useState, useTransition } from 'react'
import type React from 'react'
import { Sparkles, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CandidateStatus } from '@/lib/types'
import { updateStatusAction } from '@/app/actions/update-status'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const STATUSES: CandidateStatus[] = ['New', 'Under Review', 'Approved', 'Rejected']

const statusIcons: Record<CandidateStatus, React.ReactNode> = {
  New:            <Sparkles     className="size-3.5 text-sky-500" />,
  'Under Review': <Clock        className="size-3.5 text-yellow-500" />,
  Approved:       <CheckCircle2 className="size-3.5 text-green-500" />,
  Rejected:       <XCircle      className="size-3.5 text-red-500" />,
}

interface StatusSelectorProps {
  candidateId: string
  currentStatus: CandidateStatus
  /** Compact inline variant used in the candidate listing table (no label). */
  compact?: boolean
}

export function StatusSelector({ candidateId, currentStatus, compact = false }: StatusSelectorProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  function handleChange(status: CandidateStatus) {
    if (status === currentStatus || isPending) return
    setError(null)
    startTransition(async () => {
      const result = await updateStatusAction(candidateId, status)
      if (result.error) setError(result.error)
    })
  }

  return (
    <div>
      {!compact && (
        <p className="mb-2 text-s font-semibold uppercase tracking-wide text-muted-foreground">
          {t('status_label')}
        </p>
      )}
      <div className={cn('flex items-center gap-2', compact && 'min-w-[150px]')}>
        <Select
          value={currentStatus}
          onValueChange={(v) => handleChange(v as CandidateStatus)}
          disabled={isPending}
        >
          <SelectTrigger
            className={cn(
              compact ? 'w-[150px]' : 'w-full',
              isPending && 'opacity-60 cursor-wait',
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                <span className="flex items-center gap-2">
                  {statusIcons[status]}
                  {status}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Inline spinner — shown in compact mode next to the trigger. */}
        {compact && isPending && <Spinner className="size-3.5 text-muted-foreground" />}
      </div>
      {!compact && isPending && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Spinner className="size-3" />
          {t('status_saving')}
        </p>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
