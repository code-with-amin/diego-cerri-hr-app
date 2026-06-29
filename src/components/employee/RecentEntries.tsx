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

const COLUMNS: TranslationKey[] = [
  'emp_col_project',
  'emp_col_activity',
  'emp_col_start',
  'emp_col_end',
  'emp_col_net_hours',
  'emp_col_cost',
]

// Representative sample data — swap for real entries once wired up.
const ENTRIES: {
  project: string
  activityKey: TranslationKey
  start: string
  end: string
  hours: string
  cost: string
}[] = [
  { project: 'Linha 3 — Expansão', activityKey: 'emp_activity_bim', start: '08:30', end: '12:00', hours: '3.50 h', cost: 'R$ 420,00' },
  { project: 'KPI Engenharia', activityKey: 'emp_activity_meeting', start: '13:00', end: '14:00', hours: '1.00 h', cost: 'R$ 120,00' },
  { project: 'Retrofit Galpão B', activityKey: 'emp_activity_compat', start: '14:15', end: '16:45', hours: '2.50 h', cost: 'R$ 300,00' },
  { project: 'Documentação OS-204', activityKey: 'emp_activity_docs', start: '17:00', end: '18:00', hours: '1.00 h', cost: 'R$ 120,00' },
]

export function RecentEntries() {
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
            href="/employee/tracker"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            {t('emp_open_tracker')}
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
                {ENTRIES.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{entry.project}</TableCell>
                    <TableCell>{t(entry.activityKey)}</TableCell>
                    <TableCell className="tabular-nums">{entry.start}</TableCell>
                    <TableCell className="tabular-nums">{entry.end}</TableCell>
                    <TableCell className="tabular-nums">{entry.hours}</TableCell>
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
