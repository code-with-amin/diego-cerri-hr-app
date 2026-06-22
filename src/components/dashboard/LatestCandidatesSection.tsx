'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { CandidateTable } from '@/components/candidates/CandidateTable'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Candidate } from '@/lib/types'

interface LatestCandidatesSectionProps {
  candidates: Candidate[]
}

export function LatestCandidatesSection({ candidates }: LatestCandidatesSectionProps) {
  const { t } = useLanguage()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">{t('latest_candidates')}</h2>
        <Link
          href="/dashboard/candidates"
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        >
          {t('view_all')}
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </div>
      <CandidateTable candidates={candidates} />
    </div>
  )
}
