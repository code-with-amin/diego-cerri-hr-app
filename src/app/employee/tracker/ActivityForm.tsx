'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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

const TIME_FIELDS: { key: TranslationKey; id: string }[] = [
  { key: 'emp_time_start', id: 'time-start' },
  { key: 'emp_time_break_in', id: 'time-break-in' },
  { key: 'emp_time_break_out', id: 'time-break-out' },
  { key: 'emp_time_end', id: 'time-end' },
]

export function ActivityForm() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Project + Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="project">{t('emp_project')}</Label>
          <Select>
            <SelectTrigger id="project" className="w-full">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proj-alpha">Project Alpha</SelectItem>
              <SelectItem value="proj-beta">Project Beta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client">{t('emp_client')}</Label>
          <Input id="client" placeholder="—" readOnly />
        </div>
      </div>

      {/* Activity */}
      <div className="space-y-1.5">
        <Label htmlFor="activity">{t('emp_activity')}</Label>
        <Select>
          <SelectTrigger id="activity" className="w-full">
            <SelectValue placeholder="—" />
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

      {/* Rate + Location + Entry type */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rate">{t('emp_hourly_rate')}</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
              R$
            </span>
            <Input id="rate" className="pl-8" placeholder="0,00" />
          </div>
        </div>
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

      {/* Retroactive time entry */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          {t('emp_time_optional')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TIME_FIELDS.map(({ key, id }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id}>{t(key)}</Label>
              <Input id={id} type="time" />
            </div>
          ))}
        </div>
      </div>

      {/* Observations */}
      <div className="space-y-1.5">
        <Label htmlFor="observations">{t('emp_observations')}</Label>
        <Textarea id="observations" rows={3} placeholder="—" />
      </div>

      <Separator />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button>{t('emp_btn_start')}</Button>
        <Button variant="outline">{t('emp_btn_break')}</Button>
        <Button variant="outline">{t('emp_btn_resume')}</Button>
        <Button
          variant="outline"
          className="text-destructive border-destructive hover:bg-destructive/10"
        >
          {t('emp_btn_end')}
        </Button>
      </div>
    </div>
  )
}
