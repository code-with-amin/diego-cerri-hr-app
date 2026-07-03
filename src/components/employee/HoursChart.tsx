'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { summaryAction } from '@/app/employee/tracker/actions'

const PERIOD_KEYS = [
  { key: 'chart_period_7' as const, value: '7' },
  { key: 'chart_period_14' as const, value: '14' },
  { key: 'chart_period_30' as const, value: '30' },
]

type PerDay = { date: string; hours: number }

// "2026-07-04" → "04/07"
function dayLabel(date: string): string {
  const [, m, d] = date.split('-')
  return d && m ? `${d}/${m}` : date
}

function toChartData(perDay: PerDay[]) {
  return perDay.map((p) => ({ label: dayLabel(p.date), hours: p.hours }))
}

export function HoursChart({ perDay }: { perDay: PerDay[] }) {
  const [period, setPeriod] = useState('7')
  const [data, setData] = useState(() => toChartData(perDay))
  const { t } = useLanguage()

  async function onPeriodChange(value: string | null) {
    if (!value) return
    setPeriod(value)
    const res = await summaryAction(Number(value))
    if (res.ok) setData(toChartData(res.summary.perDay))
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {t('emp_chart_hours')}
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
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                interval={Number(period) > 14 ? 4 : 0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value) => [`${value} h`, t('emp_chart_hours')]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#hoursGradient)"
                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
