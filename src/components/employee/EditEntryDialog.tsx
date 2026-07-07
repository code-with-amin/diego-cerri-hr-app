'use client'

import * as React from 'react'
import { Pencil } from 'lucide-react'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTracker } from '@/components/providers/TrackerContext'
import { TranslationKey } from '@/lib/i18n'
import { HistoryEntry, ACTIVITY_KEYS as ACTIVITIES } from '@/data/employee-mock'
import type { UpdateEntryInput } from '@/app/employee/tracker/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// "R$ 120,00" -> 120, "3.50 h" -> 3.5
function parseNumber(value: string): number {
  const cleaned = value.replace(/[^\d.,-]/g, '').replace(/\./g, '#').replace(',', '.').replace(/#/g, '')
  return parseFloat(cleaned) || 0
}

function sanitizeNumeric(raw: string): string {
  const cleaned = raw.replace(/[^\d.,]/g, '').replace(/\./g, ',')
  const [whole, ...rest] = cleaned.split(',')
  return rest.length ? `${whole},${rest.join('')}` : whole
}

type EditableEntry = HistoryEntry & { date?: string }

// Build the backend PATCH payload from the dialog's fields. `startedAt`/`endedAt`
// are reconstructed from the entry's date + the HH:MM times; `breakMs` is
// derived so that (end - start - break) equals the edited net hours.
function buildPayload(
  entry: EditableEntry,
  date: string,
  project: string,
  activityKey: string,
  start: string,
  end: string,
  netHoursStr: string,
): UpdateEntryInput {
  const day = date || entry.date || new Date().toISOString().slice(0, 10)
  const startedAt = new Date(`${day}T${start || '00:00'}`)
  const endedAt = new Date(`${day}T${end || '00:00'}`)
  const netMs = parseNumber(netHoursStr) * 3_600_000
  const spanMs = endedAt.getTime() - startedAt.getTime()
  const breakMs = Math.max(0, Math.round(spanMs - netMs))
  return {
    project: project.trim() || '—',
    activityKey,
    startedAt: Number.isNaN(startedAt.getTime()) ? undefined : startedAt.toISOString(),
    endedAt: Number.isNaN(endedAt.getTime()) ? undefined : endedAt.toISOString(),
    breakMs,
  }
}

export function EditEntryDialog({
  entry,
  onSave,
  withDate = false,
}: {
  entry: EditableEntry
  /** Persist the edit. Defaults to the tracker context's backend updater. */
  onSave?: (id: string, payload: UpdateEntryInput) => void | Promise<void>
  /** Show a date field (used on the "all entries" page). */
  withDate?: boolean
}) {
  const { t } = useLanguage()
  const { updateEntry } = useTracker()
  const save = onSave ?? updateEntry
  const [open, setOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const [date, setDate] = React.useState(entry.date ?? '')
  const [project, setProject] = React.useState(entry.project)
  const [activityKey, setActivityKey] = React.useState(entry.activityKey)
  const [start, setStart] = React.useState(entry.start)
  const [end, setEnd] = React.useState(entry.end)
  const [netHours, setNetHours] = React.useState(String(parseNumber(entry.netHours)).replace('.', ','))
  const [rate, setRate] = React.useState(String(parseNumber(entry.rate)).replace('.', ','))

  // Re-seed the form from the entry each time the dialog opens.
  React.useEffect(() => {
    if (!open) return
    setDate(entry.date ?? '')
    setProject(entry.project)
    setActivityKey(entry.activityKey)
    setStart(entry.start)
    setEnd(entry.end)
    setNetHours(String(parseNumber(entry.netHours)).replace('.', ','))
    setRate(String(parseNumber(entry.rate)).replace('.', ','))
  }, [open, entry])

  async function handleSave() {
    setSaving(true)
    try {
      const payload = buildPayload(entry, withDate ? date : entry.date ?? '', project, activityKey, start, end, netHours)
      await save(entry.id, payload)
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label={t('emp_edit')}
            title={t('emp_edit')}
          />
        }
      >
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('emp_edit_title')}</DialogTitle>
          <DialogDescription>{t('emp_edit_desc')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Date (entries page only) */}
          {withDate && (
            <div className="space-y-1.5">
              <Label htmlFor="edit-date">{t('emp_col_date')}</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          {/* Project */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-project">{t('emp_project')}</Label>
            <Input
              id="edit-project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </div>

          {/* Activity */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-activity">{t('emp_activity')}</Label>
            <Select value={activityKey} onValueChange={(v) => setActivityKey(v ?? '')}>
              <SelectTrigger id="edit-activity" className="w-full">
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

          {/* Start + End */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-start">{t('emp_col_start')}</Label>
              <Input
                id="edit-start"
                value={start}
                placeholder="08:30"
                inputMode="numeric"
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-end">{t('emp_col_end')}</Label>
              <Input
                id="edit-end"
                value={end}
                placeholder="12:00"
                inputMode="numeric"
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Net hours + Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-net">{t('emp_col_net_hours')}</Label>
              <Input
                id="edit-net"
                value={netHours}
                placeholder="0,00"
                inputMode="decimal"
                onChange={(e) => setNetHours(sanitizeNumeric(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-rate">{t('emp_hourly_rate')}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                  R$
                </span>
                {/* Read-only: rate is a snapshot set by HR and never rewritten. */}
                <Input
                  id="edit-rate"
                  className="pl-8 border-dashed bg-muted/60 text-muted-foreground cursor-default focus-visible:ring-0"
                  value={rate}
                  placeholder="0,00"
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose
            render={<Button type="button" variant="outline" />}
          >
            {t('emp_edit_cancel')}
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving && <Spinner className="mr-1.5 size-3.5" />}
            {t('emp_edit_save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
