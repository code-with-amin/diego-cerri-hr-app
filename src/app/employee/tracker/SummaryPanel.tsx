'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import { Card } from '@/components/ui/card'

const KPIS: { labelKey: TranslationKey; value: string; mono?: boolean }[] = [
  { labelKey: 'emp_net_time', value: '00:00:00', mono: true },
  { labelKey: 'emp_breaks', value: '0' },
  { labelKey: 'emp_hours_estimated', value: '0.00 h', mono: true },
  { labelKey: 'emp_cost_current', value: 'R$ 0,00' },
]

export function SummaryPanel() {
  const { t } = useLanguage()

  return (
    <Card className="py-0">
      <div className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{t('emp_summary_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('emp_summary_desc')}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4">
          {KPIS.map(({ labelKey, value, mono }) => (
            <div key={labelKey} className="rounded-lg border bg-muted/30 p-4">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {t(labelKey)}
              </span>
              <strong className={`block text-lg ${mono ? 'font-mono tabular-nums' : ''}`}>
                {value}
              </strong>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <span className="mt-1.5 h-3 w-3 rounded-full bg-primary" />
            <div>
              <strong className="block text-sm">{t('emp_timeline_ready_title')}</strong>
              <small className="text-xs text-muted-foreground">{t('emp_timeline_ready_desc')}</small>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
