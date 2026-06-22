'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number
  totalPages: number
  totalResults: number
  pageSize: number
}

export function Pagination({ page, totalPages, totalResults, pageSize }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goTo(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (p === 1) {
      params.delete('page')
    } else {
      params.set('page', String(p))
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  function getPages(): (number | 'ellipsis')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | 'ellipsis')[] = [1]
    if (page > 3) pages.push('ellipsis')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalResults)

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">
        Showing {from}–{to} of {totalResults} candidates
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPages().map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-1.5 text-sm text-muted-foreground">…</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              size="sm"
              className="w-9"
              onClick={() => goTo(p)}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
