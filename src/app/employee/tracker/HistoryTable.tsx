'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TranslationKey } from '@/lib/i18n'

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

  return (
    <div className="p-4 md:p-6 space-y-3">
      <h2 className="font-semibold text-sm">{t('emp_history_title')}</h2>
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
            <TableRow>
              <TableCell
                colSpan={COLUMNS.length}
                className="text-center text-muted-foreground py-10 text-sm"
              >
                {t('emp_history_empty')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}
