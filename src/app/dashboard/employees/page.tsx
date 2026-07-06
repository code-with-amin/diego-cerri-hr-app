import { Suspense } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmployeeSearchBar } from '@/components/employees/EmployeeSearchBar'
import { EmployeeTable } from '@/components/employees/EmployeeTable'
import { Pagination } from '@/components/candidates/Pagination'
import { getEmployees } from '@/lib/hr-employees-store'

const VALID_PAGE_SIZES = [10, 25, 50, 100]
const DEFAULT_PAGE_SIZE = 10

interface EmployeesPageProps {
  searchParams: {
    q?: string
    page?: string
    perPage?: string
  }
}

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const rawPerPage = Number(searchParams.perPage ?? DEFAULT_PAGE_SIZE)
  const pageSize = VALID_PAGE_SIZES.includes(rawPerPage) ? rawPerPage : DEFAULT_PAGE_SIZE
  const page = Math.max(1, Number(searchParams.page ?? '1') || 1)

  const { employees, total } = await getEmployees({
    q: searchParams.q,
    page,
    limit: pageSize,
  })

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <DashboardShell
      titleKey="page_employees"
      subtitleKey="page_employees_subtitle"
      subtitleSuffix={String(total)}
    >
      <Suspense>
        <EmployeeSearchBar />
      </Suspense>
      <EmployeeTable employees={employees} startIndex={(page - 1) * pageSize + 1} />
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
