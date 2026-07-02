'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTracker } from '@/components/providers/TrackerContext'
import { TranslationKey } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/employee/DateTimePicker'
import { ACTIVITY_KEYS as ACTIVITIES } from '@/data/employee-mock'
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

// Maps a stored select value to its translation key so the trigger shows the
// human label (Base UI's Select.Value otherwise renders the raw value).
const LOCATION_LABELS: Record<string, TranslationKey> = {
  remote: 'emp_location_remote',
  office: 'emp_location_office',
  client: 'emp_location_client',
}

const ENTRY_TYPE_LABELS: Record<string, TranslationKey> = {
  productive: 'emp_type_productive',
  admin: 'emp_type_admin',
  nonbillable: 'emp_type_nonbillable',
}

// Keep the hourly rate numeric: digits only, with at most one decimal
// separator (accepts both "," and "." and normalizes to ",").
function sanitizeRate(raw: string): string {
  const cleaned = raw.replace(/[^\d.,]/g, '').replace(/[.]/g, ',')
  const [whole, ...rest] = cleaned.split(',')
  return rest.length ? `${whole},${rest.join('')}` : whole
}

export function ActivityForm() {
  const { t } = useLanguage()
  const {
    project, setProject,
    client, setClient,
    activityKey, setActivityKey,
    rate, setRate,
    location, setLocation,
    entryType, setEntryType,
    retroStart, setRetroStart,
    breakStartField, setBreakStartField,
    breakEndField, setBreakEndField,
    retroEnd, setRetroEnd,
    observations, setObservations,
    registeredStart,
    registeredEnd,
    timerStatus,
    error,
    startSession,
    startBreak,
    resumeSession,
    endSession,
    saveManualEntry,
  } = useTracker()

  const isIdle = timerStatus === 'idle'
  const isRunning = timerStatus === 'running'
  const isPaused = timerStatus === 'paused'

  return (
    <Card className="py-0">
      <form className="space-y-6 p-6" onSubmit={(e) => e.preventDefault()}>
        {/* Panel header */}
        <div>
          <h3 className="text-lg font-semibold leading-tight">{t('emp_form_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('emp_form_desc')}</p>
        </div>

        {/* Project + Client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="project">{t('emp_project')}</Label>
            <Input
              id="project"
              placeholder={t('emp_project_ph')}
              value={project}
              onChange={(e) => setProject(e.target.value)}
              disabled={!isIdle}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client">{t('emp_client')}</Label>
            <Input
              id="client"
              placeholder={t('emp_client_ph')}
              value={client}
              onChange={(e) => setClient(e.target.value)}
              disabled={!isIdle}
            />
          </div>
        </div>

        {/* Activity + Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="activity">{t('emp_activity')}</Label>
            <Select
              value={activityKey}
              onValueChange={(v) => setActivityKey(v ?? '')}
              disabled={!isIdle}
            >
              <SelectTrigger id="activity" className="w-full">
                <SelectValue placeholder={t('emp_activity_placeholder')}>
                  {(value) =>
                    value ? t(value as TranslationKey) : t('emp_activity_placeholder')
                  }
                </SelectValue>
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
              <Input
                id="rate"
                className="pl-8"
                placeholder={t('emp_rate_ph')}
                value={rate}
                onChange={(e) => setRate(sanitizeRate(e.target.value))}
                disabled={!isIdle}
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {/* Location + Entry type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="location">{t('emp_location')}</Label>
            <Select value={location} onValueChange={(v) => setLocation(v ?? '')} disabled={!isIdle}>
              <SelectTrigger id="location" className="w-full">
                <SelectValue placeholder={t('emp_location_ph')}>
                  {(value) =>
                    value && LOCATION_LABELS[value as string]
                      ? t(LOCATION_LABELS[value as string])
                      : t('emp_location_ph')
                  }
                </SelectValue>
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
            <Select value={entryType} onValueChange={(v) => setEntryType(v ?? '')} disabled={!isIdle}>
              <SelectTrigger id="entry-type" className="w-full">
                <SelectValue placeholder={t('emp_type_ph')}>
                  {(value) =>
                    value && ENTRY_TYPE_LABELS[value as string]
                      ? t(ENTRY_TYPE_LABELS[value as string])
                      : t('emp_type_ph')
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="productive">{t('emp_type_productive')}</SelectItem>
                <SelectItem value="admin">{t('emp_type_admin')}</SelectItem>
                <SelectItem value="nonbillable">{t('emp_type_nonbillable')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Retroactive start */}
        <div className="space-y-1.5 rounded-lg border bg-muted/30 p-4">
          <Label htmlFor="retro-start">{t('emp_retro_start')}</Label>
          <DateTimePicker
            id="retro-start"
            value={retroStart}
            onChange={setRetroStart}
            disabled={!isIdle}
          />
          <p className="text-xs text-muted-foreground">{t('emp_retro_start_hint')}</p>
        </div>

        {/* Break start / Break end / Retroactive end */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="break-start">{t('emp_break_start')}</Label>
            <DateTimePicker
              id="break-start"
              value={breakStartField}
              onChange={setBreakStartField}
              disabled={!isIdle}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="break-end">{t('emp_break_end')}</Label>
            <DateTimePicker
              id="break-end"
              value={breakEndField}
              onChange={setBreakEndField}
              min={breakStartField}
              disabled={!isIdle}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="retro-end">{t('emp_retro_end')}</Label>
            <DateTimePicker
              id="retro-end"
              value={retroEnd}
              onChange={setRetroEnd}
              disabled={!isIdle}
            />
          </div>
        </div>

        {/* Registered start / end — auto-filled, read-only (visually distinct) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="registered-start" className="text-muted-foreground">
              {t('emp_registered_start')}
            </Label>
            <Input
              id="registered-start"
              value={registeredStart}
              placeholder=""
              readOnly
              tabIndex={-1}
              className="border-dashed bg-muted/60 text-muted-foreground cursor-default focus-visible:ring-0"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="registered-end" className="text-muted-foreground">
              {t('emp_registered_end')}
            </Label>
            <Input
              id="registered-end"
              value={registeredEnd}
              placeholder=""
              readOnly
              tabIndex={-1}
              className="border-dashed bg-muted/60 text-muted-foreground cursor-default focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Observations */}
        <div className="space-y-1.5">
          <Label htmlFor="observations">{t('emp_observations')}</Label>
          <Textarea
            id="observations"
            rows={3}
            placeholder={t('emp_obs_ph')}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{t('emp_obs_hint')}</p>
        </div>

        {/* Validation feedback */}
        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {t(error)}
          </p>
        )}

        {/* Action buttons — single line on wide screens; wrap (never hide) when cramped */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            disabled={!isIdle}
            onClick={startSession}
            className="shrink-0 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            {t('emp_btn_start')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!isRunning}
            onClick={startBreak}
            className="shrink-0 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            {t('emp_btn_break')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!isPaused}
            onClick={resumeSession}
            className="shrink-0 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            {t('emp_btn_resume')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isIdle}
            onClick={endSession}
            className="shrink-0 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            {t('emp_btn_end')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!isIdle}
            onClick={saveManualEntry}
            className="shrink-0 whitespace-nowrap border-primary text-primary hover:bg-primary/10 hover:text-primary disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            {t('emp_btn_manual_save')}
          </Button>
        </div>
      </form>
    </Card>
  )
}
