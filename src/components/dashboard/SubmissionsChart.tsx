"use client"

import { useRouter } from "next/navigation"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
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
  const router = useRouter()
  const data = buildDailyData(candidates)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleClick(payload: any) {
    const entry = payload?.activePayload?.[0]?.payload as { date: string; submissions: number } | undefined
    if (!entry || entry.submissions === 0) return
    router.push(`/dashboard/candidates?date=${entry.date}`)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Submissions — Last 7 Days
          </CardTitle>
          <span className="text-[10px] text-muted-foreground">Click a point to filter candidates</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-52 cursor-pointer">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} onClick={handleClick}>
              <defs>
                <linearGradient id="submissionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                cursor={{ stroke: "#3b82f6", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="submissions"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#submissionsGradient)"
                dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
