'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/components/providers/LanguageProvider'

export function EmployeeSearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const qParam = searchParams.get('q') ?? ''
  const [searchValue, setSearchValue] = useState(qParam)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setSearchValue(qParam)
  }, [qParam])

  useEffect(() => () => clearTimeout(searchTimer.current), [])

  const updateParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('q', value)
      } else {
        params.delete('q')
      }
      params.delete('page')
      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const onSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value)
      clearTimeout(searchTimer.current)
      searchTimer.current = setTimeout(() => updateParam(value.trim()), 350)
    },
    [updateParam],
  )

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('emps_search_placeholder')}
          className="pl-9"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
