'use client'

import { useMemo, useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import { MOCK_ENTRIES } from '@/data/employee-mock'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const COLUMNS: TranslationKey[] = [
  'emp_col_date',
  'emp_col_project',
  'emp_col_activity',
  'emp_col_start',
  'emp_col_end',
  'emp_col_net_hours',
  'emp_col_rate',
  'emp_col_cost',
]

const PAGE_SIZE_OPTIONS = [10, 25, 50]

export function EntriesTable() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MOCK_ENTRIES
    return MOCK_ENTRIES.filter(
      (e) =>
        e.project.toLowerCase().includes(q) ||
        t(e.activityKey as TranslationKey).toLowerCase().includes(q),
    )
  }, [query, t])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)
  const from = total === 0 ? 0 : start + 1
  const to = Math.min(start + pageSize, total)

  function onSearch(value: string) {
    setQuery(value)
    setPage(1)
  }

  function onPageSize(value: string | null) {
    if (!value) return
    setPageSize(Number(value))
    setPage(1)
  }

  return (
    <Card className="py-0">
      <div className="space-y-5 p-6">
        {/* Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('emp_entries_search')}
              className="pl-9"
              value={query}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            {total} {t('emp_pg_entries')}
          </span>
        </div>

        {/* Table */}
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
                {pageItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMNS.length}
                      className="text-center text-muted-foreground py-10 text-sm"
                    >
                      {t('emp_entries_empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {entry.date}
                      </TableCell>
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {t('emp_pg_showing')} {from}–{to} {t('emp_pg_of')} {total} {t('emp_pg_entries')}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Select value={String(pageSize)} onValueChange={onPageSize}>
                <SelectTrigger className="h-8 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={String(s)} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>{t('emp_pg_per_page')}</span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('emp_pg_previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  className="flex items-center gap-1"
                >
                  {t('emp_pg_next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
