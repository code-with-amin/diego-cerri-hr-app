'use client'

import { Clock, Timer, DollarSign, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'

// Mirrors formatBRL from employee-store, which is server-only and can't be
// imported into this client component.
function formatBRL(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface ActivityStatsProps {
  hoursToday: number
  weekHours: number
  weekCost: string
  weekEntryCount: number
}

export function ActivityStats({
  hoursToday,
  weekHours,
  weekCost,
  weekEntryCount,
}: ActivityStatsProps) {
  const { t } = useLanguage()

  const STATS: {
    labelKey: TranslationKey
    value: string
    icon: typeof Clock
    colour: string
    bg: string
  }[] = [
    { labelKey: 'emp_stat_hours_today', value: `${hoursToday} h`, icon: Clock, colour: 'text-blue-600', bg: 'bg-blue-100' },
    { labelKey: 'emp_stat_week_hours', value: `${weekHours} h`, icon: Timer, colour: 'text-emerald-600', bg: 'bg-emerald-100' },
    { labelKey: 'emp_stat_week_cost', value: formatBRL(Number(weekCost)), icon: DollarSign, colour: 'text-amber-600', bg: 'bg-amber-100' },
    { labelKey: 'emp_stat_entries', value: String(weekEntryCount), icon: FileText, colour: 'text-violet-600', bg: 'bg-violet-100' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {STATS.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.labelKey}>
            <CardHeader className="pb-1 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t(stat.labelKey)}
                </CardTitle>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.colour}`} />
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
