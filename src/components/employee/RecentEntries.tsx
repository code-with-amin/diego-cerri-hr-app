'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import type { HistoryEntry } from '@/data/employee-mock'

const COLUMNS: TranslationKey[] = [
  'emp_col_date',
  'emp_col_project',
  'emp_col_activity',
  'emp_col_start',
  'emp_col_end',
  'emp_col_net_hours',
  'emp_col_cost',
]

export function RecentEntries({ entries }: { entries: HistoryEntry[] }) {
  const { t } = useLanguage()

  return (
    <Card className="py-0">
      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{t('emp_recent_title')}</h3>
            <p className="text-sm text-muted-foreground">{t('emp_recent_desc')}</p>
          </div>
          <Link
            href="/employee/entries"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            {t('emp_recent_view_all')}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableHead key={col}>{t(col)}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {entry.date}
                    </TableCell>
                    <TableCell className="font-medium">{entry.project}</TableCell>
                    <TableCell>{t(entry.activityKey as TranslationKey)}</TableCell>
                    <TableCell className="tabular-nums">{entry.start}</TableCell>
                    <TableCell className="tabular-nums">{entry.end}</TableCell>
                    <TableCell className="tabular-nums">{entry.netHours}</TableCell>
                    <TableCell className="tabular-nums">{entry.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  )
}
