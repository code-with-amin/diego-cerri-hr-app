'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTracker, formatHHMMSS } from '@/components/providers/TrackerContext'
import { Card } from '@/components/ui/card'

function toCostStr(ms: number, rateStr: string): string {
  const rateNum = parseFloat(rateStr.replace(',', '.')) || 0
  const hours = ms / 3_600_000
  const cost = hours * rateNum
  return `R$ ${cost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function SummaryPanel() {
  const { t } = useLanguage()
  const { timerStatus, elapsedMs, breakCount, rate } = useTracker()

  const netHours = (elapsedMs / 3_600_000).toFixed(2)
  const cost = toCostStr(elapsedMs, rate)

  const timelineStatus =
    timerStatus === 'running'
      ? { dot: 'bg-emerald-500', title: t('emp_timeline_running_title'), desc: t('emp_timeline_running_desc') }
      : timerStatus === 'paused'
      ? { dot: 'bg-amber-400', title: t('emp_timeline_paused_title'), desc: t('emp_timeline_paused_desc') }
      : { dot: 'bg-muted-foreground/50', title: t('emp_timeline_ready_title'), desc: t('emp_timeline_ready_desc') }

  return (
    <Card className="py-0">
      <div className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{t('emp_summary_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('emp_summary_desc')}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('emp_net_time')}
            </span>
            <strong className="block text-lg font-mono tabular-nums">
              {formatHHMMSS(elapsedMs)}
            </strong>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('emp_breaks')}
            </span>
            <strong className="block text-lg">{breakCount}</strong>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('emp_hours_estimated')}
            </span>
            <strong className="block text-lg font-mono tabular-nums">{netHours} h</strong>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('emp_cost_current')}
            </span>
            <strong className="block text-lg">{cost}</strong>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <span className={`mt-1.5 h-3 w-3 rounded-full ${timelineStatus.dot}`} />
            <div>
              <strong className="block text-sm">{timelineStatus.title}</strong>
              <small className="text-xs text-muted-foreground">{timelineStatus.desc}</small>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
