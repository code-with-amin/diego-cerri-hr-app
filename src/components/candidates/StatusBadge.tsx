import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CandidateStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: CandidateStatus
}

const statusClasses: Record<CandidateStatus, string> = {
  New:            'bg-sky-100 text-sky-700 hover:bg-sky-100 border-sky-200',
  'Under Review': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
  Approved:       'bg-green-100 text-green-700 hover:bg-green-100 border-green-200',
  Rejected:       'bg-red-100 text-red-700 hover:bg-red-100 border-red-200',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', statusClasses[status])}
    >
      {status}
    </Badge>
  )
}
