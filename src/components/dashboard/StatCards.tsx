'use client'

import { Users, XCircle, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { CandidateStatus } from '@/lib/types'

interface StatCardsProps {
  total: number
  counts: Record<CandidateStatus, number>
}

export function StatCards({ total, counts }: StatCardsProps) {
  const { t } = useLanguage()

  const stats = [
    { labelKey: t('stat_total'), value: total, icon: Users, colour: 'text-slate-600', bg: 'bg-slate-100' },
    { labelKey: t('stat_rejected'), value: counts['Rejected'] ?? 0, icon: XCircle, colour: 'text-red-600', bg: 'bg-red-100' },
    { labelKey: t('stat_under_review'), value: counts['Under Review'] ?? 0, icon: Clock, colour: 'text-amber-600', bg: 'bg-amber-100' },
    { labelKey: t('stat_approved'), value: counts['Approved'] ?? 0, icon: CheckCircle, colour: 'text-green-600', bg: 'bg-green-100' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.labelKey}>
            <CardHeader className="pb-1 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.labelKey}
                </CardTitle>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.colour}`} />
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
