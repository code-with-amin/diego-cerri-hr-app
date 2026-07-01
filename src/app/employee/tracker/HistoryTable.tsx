'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTracker } from '@/components/providers/TrackerContext'
import { TranslationKey } from '@/lib/i18n'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const COLUMNS: TranslationKey[] = [
  'emp_col_project',
  'emp_col_activity',
  'emp_col_start',
  'emp_col_end',
  'emp_col_net_hours',
  'emp_col_rate',
  'emp_col_cost',
]

export function HistoryTable() {
  const { t } = useLanguage()
  const { entries, clearHistory } = useTracker()

  return (
    <Card className="py-0">
      <div className="space-y-5 p-6">
        {/* Panel header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{t('emp_history_title')}</h3>
            <p className="text-sm text-muted-foreground">{t('emp_history_desc')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={clearHistory} disabled={entries.length === 0}>
            {t('emp_clear_history')}
          </Button>
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
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMNS.length}
                      className="text-center text-muted-foreground py-10 text-sm"
                    >
                      {t('emp_history_empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.project}</TableCell>
                      <TableCell>{t(entry.activityKey as TranslationKey)}</TableCell>
                      <TableCell className="tabular-nums">{entry.start}</TableCell>
                      <TableCell className="tabular-nums">{entry.end}</TableCell>
                      <TableCell className="tabular-nums">{entry.netHours}</TableCell>
                      <TableCell className="tabular-nums">{entry.rate}</TableCell>
                      <TableCell className="tabular-nums">{entry.cost}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  )
}
