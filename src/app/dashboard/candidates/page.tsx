import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SearchFilterBar } from '@/components/candidates/SearchFilterBar'
import { CandidateTable } from '@/components/candidates/CandidateTable'
import { Pagination } from '@/components/candidates/Pagination'
import { getCandidates } from '@/lib/candidate-store'

const VALID_PAGE_SIZES = [10, 25, 50, 100]
const DEFAULT_PAGE_SIZE = 10

interface CandidatesPageProps {
  searchParams: {
    q?: string
    status?: string
    dateFrom?: string
    dateTo?: string
    page?: string
    perPage?: string
  }
}

export default async function CandidatesPage({ searchParams }: CandidatesPageProps) {
  const rawPerPage = Number(searchParams.perPage ?? DEFAULT_PAGE_SIZE)
  const pageSize = VALID_PAGE_SIZES.includes(rawPerPage) ? rawPerPage : DEFAULT_PAGE_SIZE
  const page = Math.max(1, Number(searchParams.page ?? '1') || 1)

  const { candidates, total } = await getCandidates({
    q: searchParams.q,
    status: searchParams.status,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
    page,
    limit: pageSize,
  })

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <DashboardShell
      titleKey="page_candidates"
      subtitleKey="page_candidates_subtitle"
      subtitleSuffix={String(total)}
    >
      <Suspense>
        <SearchFilterBar total={total} filtered={total} />
      </Suspense>
      <CandidateTable candidates={candidates} startIndex={(page - 1) * pageSize + 1} />
      <Suspense>
        <Pagination
          page={page}
          totalPages={totalPages}
          totalResults={total}
          pageSize={pageSize}
        />
      </Suspense>
    </DashboardShell>
  )
}
