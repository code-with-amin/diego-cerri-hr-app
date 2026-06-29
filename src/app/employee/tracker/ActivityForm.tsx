'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ACTIVITIES: TranslationKey[] = [
  'emp_activity_bim',
  'emp_activity_compat',
  'emp_activity_docs',
  'emp_activity_meeting',
  'emp_activity_software',
  'emp_activity_review',
  'emp_activity_planning',
  'emp_activity_support',
]

export function ActivityForm() {
  const { t } = useLanguage()

  return (
    <Card className="py-0">
      <form className="space-y-6 p-6">
        {/* Panel header */}
        <div>
          <h3 className="text-lg font-semibold leading-tight">{t('emp_form_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('emp_form_desc')}</p>
        </div>

        {/* Project + Client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="project">{t('emp_project')}</Label>
            <Input id="project" placeholder="—" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client">{t('emp_client')}</Label>
            <Input id="client" placeholder="—" />
          </div>
        </div>

        {/* Activity + Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="activity">{t('emp_activity')}</Label>
            <Select>
              <SelectTrigger id="activity" className="w-full">
                <SelectValue placeholder={t('emp_activity_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITIES.map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(key)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rate">{t('emp_hourly_rate')}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                R$
              </span>
              <Input id="rate" className="pl-8" placeholder="0,00" />
            </div>
          </div>
        </div>

        {/* Location + Entry type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="location">{t('emp_location')}</Label>
            <Select>
              <SelectTrigger id="location" className="w-full">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">{t('emp_location_remote')}</SelectItem>
                <SelectItem value="office">{t('emp_location_office')}</SelectItem>
                <SelectItem value="client">{t('emp_location_client')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="entry-type">{t('emp_entry_type')}</Label>
            <Select>
              <SelectTrigger id="entry-type" className="w-full">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="productive">{t('emp_type_productive')}</SelectItem>
                <SelectItem value="admin">{t('emp_type_admin')}</SelectItem>
                <SelectItem value="nonbillable">{t('emp_type_nonbillable')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Retroactive start (highlighted note block) */}
        <div className="space-y-1.5 rounded-lg border bg-muted/30 p-4">
          <Label htmlFor="retro-start">{t('emp_retro_start')}</Label>
          <Input id="retro-start" type="datetime-local" />
          <p className="text-xs text-muted-foreground">{t('emp_retro_start_hint')}</p>
        </div>

        {/* Break start / Break end / Retroactive end */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="break-start">{t('emp_break_start')}</Label>
            <Input id="break-start" type="datetime-local" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="break-end">{t('emp_break_end')}</Label>
            <Input id="break-end" type="datetime-local" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="retro-end">{t('emp_retro_end')}</Label>
            <Input id="retro-end" type="datetime-local" />
          </div>
        </div>

        {/* Registered start / end (readonly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="registered-start">{t('emp_registered_start')}</Label>
            <Input id="registered-start" placeholder="—" readOnly />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="registered-end">{t('emp_registered_end')}</Label>
            <Input id="registered-end" placeholder="—" readOnly />
          </div>
        </div>

        {/* Project cost / break summary (readonly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="project-cost">{t('emp_project_cost')}</Label>
            <Input id="project-cost" placeholder="R$ 0,00" readOnly />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="break-summary">{t('emp_break_summary')}</Label>
            <Input id="break-summary" placeholder="—" readOnly />
          </div>
        </div>

        {/* Observations */}
        <div className="space-y-1.5">
          <Label htmlFor="observations">{t('emp_observations')}</Label>
          <Textarea id="observations" rows={3} placeholder="—" />
          <p className="text-xs text-muted-foreground">{t('emp_obs_hint')}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button type="button">{t('emp_btn_start')}</Button>
          <Button type="button" variant="outline" disabled>
            {t('emp_btn_break')}
          </Button>
          <Button type="button" variant="outline" disabled>
            {t('emp_btn_resume')}
          </Button>
          <Button type="button" variant="destructive" disabled>
            {t('emp_btn_end')}
          </Button>
        </div>
      </form>
    </Card>
  )
}
