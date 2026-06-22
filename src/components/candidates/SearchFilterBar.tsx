'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/components/providers/LanguageProvider'

interface SearchFilterBarProps {
  total: number
  filtered: number
}

export function SearchFilterBar({ total, filtered }: SearchFilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

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

      <Input
        type="date"
        className="w-[160px]"
        defaultValue={searchParams.get('date') ?? ''}
        onChange={(e) => updateParam('date', e.target.value)}
      />

      <span className="ml-auto text-xs text-muted-foreground">
        {filtered === total ? `${total} candidates` : `${filtered} of ${total} candidates`}
      </span>
    </div>
  )
}
