'use client'

import { useTransition } from 'react'
import type React from 'react'
import { Sparkles, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CandidateStatus } from '@/lib/types'
import { updateStatusAction } from '@/app/actions/update-status'
import { useLanguage } from '@/components/providers/LanguageProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const STATUSES: CandidateStatus[] = ['New', 'Under Review', 'Approved', 'Rejected']

const statusIcons: Record<CandidateStatus, React.ReactNode> = {
  New:            <Sparkles    className="size-3.5 text-sky-500" />,
  'Under Review': <Clock       className="size-3.5 text-yellow-500" />,
  Approved:       <CheckCircle2 className="size-3.5 text-green-500" />,
  Rejected:       <XCircle     className="size-3.5 text-red-500" />,
}

interface StatusSelectorProps {
  candidateId: string
  currentStatus: CandidateStatus
}

export function StatusSelector({ candidateId, currentStatus }: StatusSelectorProps) {
  const [isPending, startTransition] = useTransition()
  const { t } = useLanguage()

  function handleChange(status: CandidateStatus) {
    if (status === currentStatus || isPending) return
    startTransition(() => updateStatusAction(candidateId, status))
  }

  return (
    <div>
      <p className="mb-2 text-s font-semibold uppercase tracking-wide text-muted-foreground">
        {t('status_label')}
      </p>
      <Select
        value={currentStatus}
        onValueChange={(v) => handleChange(v as CandidateStatus)}
        disabled={isPending}
      >
        <SelectTrigger className={cn('w-full', isPending && 'opacity-60 cursor-wait')}>
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
      {isPending && (
        <p className="mt-2 text-xs text-muted-foreground animate-pulse">{t('status_saving')}</p>
      )}
    </div>
  )
}
