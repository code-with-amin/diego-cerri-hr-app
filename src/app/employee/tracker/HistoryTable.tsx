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
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
    <Card className="py-0">
      <div className="space-y-5 p-6">
        {/* Panel header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{t('emp_history_title')}</h3>
            <p className="text-sm text-muted-foreground">{t('emp_history_desc')}</p>
          </div>
          <Button variant="outline" size="sm">
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
    </Card>
  )
}
