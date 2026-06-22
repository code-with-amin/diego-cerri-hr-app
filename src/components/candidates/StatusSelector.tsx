import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CandidateStatus } from '@/lib/types'

const STATUSES: CandidateStatus[] = ['New', 'Under Review', 'Approved', 'Rejected']

const activeVariantClasses: Record<CandidateStatus, string> = {
  New:            'bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-100',
  'Under Review': 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100',
  Approved:       'bg-green-100 text-green-700 border-green-300 hover:bg-green-100',
  Rejected:       'bg-red-100 text-red-700 border-red-300 hover:bg-red-100',
}

interface StatusSelectorProps {
  currentStatus: CandidateStatus
}

export function StatusSelector({ currentStatus }: StatusSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Application Status
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
              disabled
              className={cn(
                'cursor-default',
                isActive && activeVariantClasses[status],
              )}
            >
              {status}
            </Button>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Status changes will be functional in Milestone 2.
      </p>
    </div>
  )
}
