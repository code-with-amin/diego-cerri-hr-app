'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PaginationProps {
  page: number
  totalPages: number
  totalResults: number
  pageSize: number
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export function Pagination({ page, totalPages, totalResults, pageSize }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function goTo(p: number, size?: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (p <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(p))
    }
    if (size && size !== 25) {
      params.set('perPage', String(size))
    } else {
      params.delete('perPage')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalResults)

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">
        Showing {from}–{to} of {totalResults} candidates
      </p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => goTo(1, Number(val))}
          >
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
          <span>per page</span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => goTo(page - 1)}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => goTo(page + 1)}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
