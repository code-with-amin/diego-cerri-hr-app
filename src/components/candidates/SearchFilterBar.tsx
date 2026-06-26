'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, CalendarIcon, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { cn } from '@/lib/utils'

interface SearchFilterBarProps {
  total: number
  filtered: number
}

export function SearchFilterBar({ total, filtered }: SearchFilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)

  const fromParam = searchParams.get('dateFrom')
  const toParam = searchParams.get('dateTo')
  const fromDate = fromParam ? parseISO(fromParam) : undefined
  const toDate = toParam ? parseISO(toParam) : undefined

  const hasFilters =
    searchParams.get('q') || searchParams.get('status') || fromParam || toParam

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to the first page whenever a filter changes.
      params.delete('page')
      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const clearFilters = useCallback(() => {
    router.replace(pathname)
  }, [router, pathname])

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('search_placeholder')}
          className="pl-9"
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => updateParam('q', e.target.value)}
        />
      </div>

      <Select
        defaultValue={searchParams.get('status') ?? 'all'}
        onValueChange={(value: string | null) => updateParam('status', value ?? 'all')}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filter_all')}</SelectItem>
          <SelectItem value="New">{t('stat_new')}</SelectItem>
          <SelectItem value="Under Review">{t('stat_under_review')}</SelectItem>
          <SelectItem value="Approved">{t('stat_approved')}</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1.5">
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger
            className={cn(
              'flex h-8 w-[150px] items-center justify-start rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground font-normal',
              !fromDate && 'text-muted-foreground',
            )}
            aria-label={t('filter_date_from')}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            {fromDate ? format(fromDate, 'dd/MM/yyyy') : t('filter_date_from')}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              disabled={toDate ? { after: toDate } : undefined}
              onSelect={(date) => {
                updateParam('dateFrom', date ? format(date, 'yyyy-MM-dd') : '')
                setFromOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground text-sm">→</span>

        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger
            className={cn(
              'flex h-8 w-[150px] items-center justify-start rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground font-normal',
              !toDate && 'text-muted-foreground',
            )}
            aria-label={t('filter_date_to')}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            {toDate ? format(toDate, 'dd/MM/yyyy') : t('filter_date_to')}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              disabled={fromDate ? { before: fromDate } : undefined}
              onSelect={(date) => {
                updateParam('dateTo', date ? format(date, 'yyyy-MM-dd') : '')
                setToOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          {t('filter_clear')}
        </Button>
      )}

      <span className="ml-auto text-xs text-muted-foreground">
        {filtered === total ? `${total} candidates` : `${filtered} of ${total} candidates`}
      </span>
    </div>
  )
}
