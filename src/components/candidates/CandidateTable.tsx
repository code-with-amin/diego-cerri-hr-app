'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Candidate } from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import { useLanguage } from '@/components/providers/LanguageProvider'

interface CandidateTableProps {
  candidates: Candidate[]
  startIndex?: number
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export function CandidateTable({ candidates, startIndex = 1 }: CandidateTableProps) {
  const { t } = useLanguage()

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center">{t('col_number')}</TableHead>
              <TableHead>{t('col_candidate')}</TableHead>
              <TableHead>{t('col_seniority')}</TableHead>
              <TableHead>{t('col_city')}</TableHead>
              <TableHead>{t('col_hourly_rate')}</TableHead>
              <TableHead>{t('col_status')}</TableHead>
              <TableHead>{t('col_submitted')}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate, index) => (
              <TableRow key={candidate.id}>
                <TableCell className="text-center text-sm text-muted-foreground font-medium">
                  {startIndex + index}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {initials(candidate.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{candidate.fullName}</p>
                      <p className="text-xs text-muted-foreground">{candidate.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {candidate.seniority ?? '—'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {candidate.city || '—'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {candidate.hourlyRate || '—'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={candidate.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(candidate.submittedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/candidates/${candidate.id}`}
                    className={buttonVariants({ variant: 'default', size: 'sm' })}
                  >
                    {t('btn_view_profile')}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
