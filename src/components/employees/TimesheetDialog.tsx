'use client'

import { useCallback, useState } from 'react'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'
import { ACTIVITY_KEYS } from '@/data/employee-mock'
import { getEmployeeTimesheetAction } from '@/app/actions/employees'
import type { BackendTimesheetResponse } from '@/lib/hr-employees-store'

const ALL_ACTIVITIES = '__all__'

function formatBRL(n: number): string {
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function timePart(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}

function datePart(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

interface TimesheetDialogProps {
  employeeId: string
  employeeName: string
  employeeEmail: string
}

export function TimesheetDialog({ employeeId, employeeName, employeeEmail }: TimesheetDialogProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BackendTimesheetResponse | null>(null)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [project, setProject] = useState('')
  const [activityKey, setActivityKey] = useState<string>(ALL_ACTIVITIES)

  const fetchTimesheet = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await getEmployeeTimesheetAction(employeeId, {
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      project: project.trim() || undefined,
      activityKey: activityKey === ALL_ACTIVITIES ? undefined : activityKey,
    })
    if (res.error) {
      setError(res.error)
      setResult(null)
    } else {
      setResult(res.data ?? null)
    }
    setLoading(false)
  }, [employeeId, dateFrom, dateTo, project, activityKey])

  function clearFilters() {
    setDateFrom('')
    setDateTo('')
    setProject('')
    setActivityKey(ALL_ACTIVITIES)
    setLoading(true)
    setError(null)
    getEmployeeTimesheetAction(employeeId, {}).then((res) => {
      if (res.error) {
        setError(res.error)
        setResult(null)
      } else {
        setResult(res.data ?? null)
      }
      setLoading(false)
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o && !result) void fetchTimesheet()
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label={t('emps_timesheet')}
            title={t('emps_timesheet')}
          />
        }
      >
        <Clock className="size-3.5" />
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('emps_ts_title')}</DialogTitle>
          <DialogDescription>{t('emps_ts_desc')}</DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 px-3 py-2">
          <p className="text-sm font-medium">{result?.employee.name ?? employeeName}</p>
          <p className="text-xs text-muted-foreground">
            {result?.employee.email ?? employeeEmail}
            {result?.employee.hourlyRate != null && (
              <> · {formatBRL(Number(result.employee.hourlyRate))}</>
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor={`ts-from-${employeeId}`}>{t('emps_ts_from')}</Label>
            <Input
              id={`ts-from-${employeeId}`}
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`ts-to-${employeeId}`}>{t('emps_ts_to')}</Label>
            <Input
              id={`ts-to-${employeeId}`}
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`ts-project-${employeeId}`}>{t('emps_ts_project')}</Label>
            <Input
              id={`ts-project-${employeeId}`}
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('emps_ts_activity')}</Label>
            <Select value={activityKey} onValueChange={(v) => setActivityKey(v ?? ALL_ACTIVITIES)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value) =>
                    value && value !== ALL_ACTIVITIES
                      ? t(value as TranslationKey)
                      : t('emps_ts_all_activities')
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ACTIVITIES}>{t('emps_ts_all_activities')}</SelectItem>
                {ACTIVITY_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(key)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" size="sm" onClick={fetchTimesheet} disabled={loading}>
            {loading && <Spinner className="mr-1.5 size-3.5" />}
            {t('emps_ts_apply')}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearFilters} disabled={loading}>
            {t('emps_ts_clear')}
          </Button>
        </div>

        {/* Entries table */}
        <div className="max-h-[45vh] overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('emp_col_date')}</TableHead>
                <TableHead>{t('emp_col_project')}</TableHead>
                <TableHead>{t('emp_col_activity')}</TableHead>
                <TableHead>{t('emp_col_start')}</TableHead>
                <TableHead>{t('emp_col_end')}</TableHead>
                <TableHead className="text-right">{t('emp_col_net_hours')}</TableHead>
                <TableHead className="text-right">{t('emp_col_rate')}</TableHead>
                <TableHead className="text-right">{t('emp_col_cost')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    <Spinner className="mx-auto size-5 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-sm text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : !result || result.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                    {t('emps_ts_empty')}
                  </TableCell>
                </TableRow>
              ) : (
                result.data.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {datePart(entry.startedAt)}
                    </TableCell>
                    <TableCell className="text-sm">{entry.project || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.activityKey ? t(entry.activityKey as TranslationKey) : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {timePart(entry.startedAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {timePart(entry.endedAt)}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {(entry.netMs / 3_600_000).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                      {formatBRL(Number(entry.rate))}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {formatBRL(Number(entry.cost))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Totals footer */}
        {result && result.data.length > 0 && (
          <div className="flex flex-wrap items-center justify-end gap-6 border-t pt-3 text-sm">
            <div>
              <span className="text-muted-foreground">{t('emps_ts_total_hours')}: </span>
              <span className="font-semibold tabular-nums">{result.totals.netHours.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('emps_ts_total_cost')}: </span>
              <span className="font-semibold tabular-nums">
                {formatBRL(Number(result.totals.cost))}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
