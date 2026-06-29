'use client'

import { Clock, Coffee, DollarSign, FileText } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export function TimerBar() {
  const { t } = useLanguage()

  return (
    <div className="sticky top-0 z-10 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-3 flex flex-wrap gap-6 sm:gap-10 items-center justify-center">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 opacity-60 shrink-0" />
          <span className="text-xs text-primary-foreground/70">{t('emp_net_time')}</span>
          <span className="font-mono font-semibold tabular-nums">00:00:00</span>
        </div>
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4 opacity-60 shrink-0" />
          <span className="text-xs text-primary-foreground/70">{t('emp_breaks')}</span>
          <span className="font-semibold">0</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 opacity-60 shrink-0" />
          <span className="text-xs text-primary-foreground/70">{t('emp_cost')}</span>
          <span className="font-semibold">R$ 0,00</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 opacity-60 shrink-0" />
          <span className="text-xs text-primary-foreground/70">{t('emp_entries')}</span>
          <span className="font-semibold">0</span>
        </div>
      </div>
    </div>
  )
}
