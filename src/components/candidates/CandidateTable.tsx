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
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  const { t } = useLanguage()

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('col_candidate')}</TableHead>
              <TableHead>{t('col_role')}</TableHead>
              <TableHead>{t('col_location')}</TableHead>
              <TableHead>{t('col_work_model')}</TableHead>
              <TableHead>{t('col_status')}</TableHead>
              <TableHead>{t('col_submitted')}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
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
                <TableCell className="text-sm">{candidate.desiredRole}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {candidate.city}, {candidate.state}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {candidate.preferredWorkModel}
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
