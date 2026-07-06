'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import { summaryAction } from '@/app/employee/tracker/actions'

const PERIOD_KEYS = [
  { key: 'chart_period_7' as const, value: '7' },
  { key: 'chart_period_14' as const, value: '14' },
  { key: 'chart_period_30' as const, value: '30' },
]

// Palette cycled across however many activities the breakdown returns.
const COLOURS = ['#3b82f6', '#f59e0b', '#22c55e', '#a855f7', '#ec4899', '#14b8a6', '#ef4444', '#6366f1']

type Breakdown = { activityKey: string; hours: number; cost: string }

export function ActivityBreakdownChart({ breakdown }: { breakdown: Breakdown[] }) {
  const [period, setPeriod] = useState('7')
  const [items, setItems] = useState(breakdown)
  const { t } = useLanguage()

  async function onPeriodChange(value: string | null) {
    if (!value) return
    setPeriod(value)
    const res = await summaryAction(Number(value))
    if (res.ok) setItems(res.summary.activityBreakdown)
  }

  const data = items.map((b, i) => ({
    name: t(b.activityKey as TranslationKey),
    value: b.hours,
    colour: COLOURS[i % COLOURS.length],
  }))
  const total = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {t('emp_chart_activity')}
          </CardTitle>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger size="sm" className="w-36">
              <span className="text-sm">
                {t(PERIOD_KEYS.find((p) => p.value === period)!.key)}
              </span>
            </SelectTrigger>
            <SelectContent>
              {PERIOD_KEYS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {t(p.key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Tooltip
                formatter={(value, name) => [`${value} h`, name]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={80}
                strokeWidth={2}
                stroke="#fff"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.colour} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ background: entry.colour }}
              />
              <span className="text-muted-foreground truncate">{entry.name}</span>
              <span className="ml-auto font-semibold">{entry.value} h</span>
            </div>
          ))}
          <div className="col-span-2 mt-1 pt-2 border-t flex justify-between text-xs font-semibold">
            <span>{t('chart_total')}</span>
            <span>{total} h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
