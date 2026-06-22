"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/providers/LanguageProvider"
import { CandidateStatus } from "@/lib/types"

interface PipelineChartProps {
  counts: Record<CandidateStatus, number>
}

const STATUS_META: { status: CandidateStatus; colour: string }[] = [
  { status: "New", colour: "#3b82f6" },
  { status: "Under Review", colour: "#f59e0b" },
  { status: "Approved", colour: "#22c55e" },
  { status: "Rejected", colour: "#ef4444" },
]

export function PipelineChart({ counts }: PipelineChartProps) {
  const { t } = useLanguage()
  const data = STATUS_META.map(({ status, colour }) => ({
    name: status,
    value: counts[status] ?? 0,
    colour,
  }))

  const total = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {t('chart_pipeline')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={76}
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
              <span className="ml-auto font-semibold">{entry.value}</span>
            </div>
          ))}
          <div className="col-span-2 mt-1 pt-2 border-t flex justify-between text-xs font-semibold">
            <span>{t('chart_total')}</span>
            <span>{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
