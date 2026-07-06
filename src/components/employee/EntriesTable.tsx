'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import type { HistoryEntry } from '@/data/employee-mock'
import type { EntriesResult } from '@/lib/employee-store'
import { listEntriesAction, updateEntryAction, type UpdateEntryInput } from '@/app/employee/tracker/actions'
import { EditEntryDialog } from '@/components/employee/EditEntryDialog'
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
  'emp_col_actions',
]

const PAGE_SIZE_OPTIONS = [10, 25, 50]

export function EntriesTable({ initialResult }: { initialResult: EntriesResult }) {
  const { t } = useLanguage()
  const [items, setItems] = useState<HistoryEntry[]>(initialResult.entries)
  const [total, setTotal] = useState(initialResult.total)
  const [page, setPage] = useState(initialResult.page)
  const [pageSize, setPageSize] = useState(initialResult.limit)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Skip the fetch on first mount — initialResult already holds page 1.
  const mounted = useRef(false)
  // Debounce timer for the project search.
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function load(nextPage: number, nextPageSize: number, nextQuery: string) {
    setLoading(true)
    try {
      const res = await listEntriesAction({
        page: nextPage,
        limit: nextPageSize,
        project: nextQuery || undefined,
      })
      if (res.ok) {
        setItems(res.result.entries)
        setTotal(res.result.total)
        setPage(res.result.page)
      }
    } finally {
      setLoading(false)
    }
  }

  // Reload when page or page size changes (search is handled by its own debounce).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    load(page, pageSize, query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  async function handleSave(id: string, payload: UpdateEntryInput) {
    const res = await updateEntryAction(id, payload)
    if (res.ok) {
      setItems((prev) => prev.map((e) => (e.id === id ? res.entry : e)))
    }
  }

  function onSearch(value: string) {
    setQuery(value)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      setPage(1)
      load(1, pageSize, value)
    }, 350)
  }

  function onPageSize(value: string | null) {
    if (!value) return
    setPageSize(Number(value))
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const from = total === 0 ? 0 : start + 1
  const to = Math.min(start + items.length, total)

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
                    <TableHead
                      key={col}
                      className={col === 'emp_col_actions' ? 'text-right' : undefined}
                    >
                      {t(col)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMNS.length}
                      className="text-center text-muted-foreground py-10 text-sm"
                    >
                      {t('emp_entries_empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((entry) => (
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
                      <TableCell className="text-right">
                        <EditEntryDialog entry={entry} onSave={handleSave} withDate />
                      </TableCell>
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
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('emp_pg_previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage(page + 1)}
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
