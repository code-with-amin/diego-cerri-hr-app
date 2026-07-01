'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'

// Representative sample data — hours by activity type.
const BREAKDOWN: { labelKey: TranslationKey; value: number; colour: string }[] = [
  { labelKey: 'emp_activity_bim', value: 12, colour: '#3b82f6' },
  { labelKey: 'emp_activity_compat', value: 8, colour: '#f59e0b' },
  { labelKey: 'emp_activity_meeting', value: 6, colour: '#22c55e' },
  { labelKey: 'emp_activity_docs', value: 6, colour: '#a855f7' },
]

export function ActivityBreakdownChart() {
  const { t } = useLanguage()
  const data = BREAKDOWN.map((b) => ({ name: t(b.labelKey), value: b.value, colour: b.colour }))
  const total = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {t('emp_chart_activity')}
        </CardTitle>
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
