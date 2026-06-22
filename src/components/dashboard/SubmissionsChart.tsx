"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Candidate } from "@/lib/types"

interface SubmissionsChartProps {
  candidates: Candidate[]
}

function buildDailyData(candidates: Candidate[]) {
  const today = new Date()
  const days: { date: string; label: string; submissions: number }[] = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const isoDate = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    days.push({ date: isoDate, label, submissions: 0 })
  }

  for (const c of candidates) {
    const isoDate = c.submittedAt.slice(0, 10)
    const bucket = days.find((d) => d.date === isoDate)
    if (bucket) bucket.submissions++
  }

  return days
}

export function SubmissionsChart({ candidates }: SubmissionsChartProps) {
  const data = buildDailyData(candidates)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Submissions — Last 7 Days
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value) => [value, "Submissions"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
