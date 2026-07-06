'use client'

import { useState, useTransition } from 'react'
import { KeyRound, Check, MailCheck, MailWarning } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Employee } from '@/lib/hr-employees-store'
import { updateEmployeeAction, setEmployeePasswordAction } from '@/app/actions/employees'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TimesheetDialog } from './TimesheetDialog'

interface EmployeeTableProps {
  employees: Employee[]
  startIndex?: number
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function sanitizeNumeric(raw: string): string {
  const cleaned = raw.replace(/[^\d.,]/g, '').replace(/\./g, ',')
  const [whole, ...rest] = cleaned.split(',')
  return rest.length ? `${whole},${rest.join('')}` : whole
}

function parseNumber(value: string): number {
  return parseFloat(value.replace(',', '.')) || 0
}

export function EmployeeTable({ employees, startIndex = 1 }: EmployeeTableProps) {
  const { t } = useLanguage()

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead>{t('emps_col_name')}</TableHead>
              <TableHead>{t('emps_col_rate')}</TableHead>
              <TableHead>{t('emps_col_status')}</TableHead>
              <TableHead>{t('emps_col_created')}</TableHead>
              <TableHead className="text-right">{t('emps_col_actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  {t('emps_empty')}
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee, index) => (
                <EmployeeRow key={employee.id} employee={employee} number={startIndex + index} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function EmployeeRow({ employee, number }: { employee: Employee; number: number }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [rateValue, setRateValue] = useState(
    employee.hourlyRate != null ? String(employee.hourlyRate).replace('.', ',') : '',
  )
  const [error, setError] = useState<string | null>(null)

  const rateDirty = parseNumber(rateValue) !== (employee.hourlyRate ?? 0)

  function saveRate() {
    setError(null)
    startTransition(async () => {
      const res = await updateEmployeeAction(employee.id, { hourlyRate: parseNumber(rateValue) })
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  function toggleEnabled() {
    setError(null)
    startTransition(async () => {
      const res = await updateEmployeeAction(employee.id, { enabled: !employee.enabled })
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  return (
    <TableRow>
      <TableCell className="text-center text-sm text-muted-foreground font-medium">
        {number}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {initials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{employee.name}</p>
            <p className="text-xs text-muted-foreground">{employee.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <div className="relative w-28">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none">
              R$
            </span>
            <Input
              className="h-8 pl-8 text-sm"
              value={rateValue}
              placeholder="0,00"
              inputMode="decimal"
              disabled={isPending}
              onChange={(e) => setRateValue(sanitizeNumeric(e.target.value))}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending || !rateDirty}
            onClick={saveRate}
            aria-label={t('emps_save_rate')}
            title={t('emps_save_rate')}
          >
            {isPending ? <Spinner className="size-3.5" /> : <Check className="size-3.5" />}
          </Button>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </TableCell>
      <TableCell>
        <Button
          type="button"
          variant={employee.enabled ? 'secondary' : 'outline'}
          size="sm"
          disabled={isPending}
          onClick={toggleEnabled}
          className={cn(
            'min-w-[92px] justify-center',
            employee.enabled
              ? 'text-green-600 dark:text-green-400'
              : 'text-muted-foreground',
          )}
        >
          <span
            className={cn(
              'mr-1 inline-block size-2 rounded-full',
              employee.enabled ? 'bg-green-500' : 'bg-muted-foreground/50',
            )}
          />
          {employee.enabled ? t('emps_enabled') : t('emps_disabled')}
        </Button>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {new Date(employee.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC',
        })}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1.5">
          <ChangePasswordDialog employeeId={employee.id} employeeName={employee.name} />
          <TimesheetDialog
            employeeId={employee.id}
            employeeName={employee.name}
            employeeEmail={employee.email}
          />
        </div>
      </TableCell>
    </TableRow>
  )
}

function ChangePasswordDialog({
  employeeId,
  employeeName,
}: {
  employeeId: string
  employeeName: string
}) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ emailed: boolean; email: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function submit() {
    setError(null)
    if (password.length < 8) {
      setError(t('emps_pwd_error'))
      return
    }
    startTransition(async () => {
      const res = await setEmployeePasswordAction(employeeId, password)
      if (res.error) {
        setError(t('emps_pwd_error'))
        return
      }
      // Keep the dialog open and confirm whether the new-password email went out.
      setPassword('')
      setResult({ emailed: res.emailed ?? false, email: res.email ?? '' })
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) {
          setPassword('')
          setError(null)
          setResult(null)
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label={t('emps_change_password')}
            title={t('emps_change_password')}
          />
        }
      >
        <KeyRound className="size-3.5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('emps_pwd_title')}</DialogTitle>
          <DialogDescription>
            {employeeName} — {t('emps_pwd_desc')}
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="flex items-start gap-2 text-sm">
            {result.emailed ? (
              <MailCheck className="mt-0.5 size-5 shrink-0 text-green-600" />
            ) : (
              <MailWarning className="mt-0.5 size-5 shrink-0 text-amber-600" />
            )}
            <p>
              {t(result.emailed ? 'emps_pwd_emailed' : 'emps_pwd_not_emailed')}{' '}
              <span className="font-medium">{result.email}</span>.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor={`pwd-${employeeId}`}>{t('emps_pwd_new')}</Label>
            <PasswordInput
              id={`pwd-${employeeId}`}
              value={password}
              minLength={8}
              disabled={isPending}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        )}

        <DialogFooter>
          {result ? (
            <DialogClose render={<Button type="button" />}>
              {t('approval_dialog_ok')}
            </DialogClose>
          ) : (
            <>
              <DialogClose render={<Button type="button" variant="outline" />}>
                {t('emps_pwd_cancel')}
              </DialogClose>
              <Button type="button" onClick={submit} disabled={isPending}>
                {isPending && <Spinner className="mr-1.5 size-3.5" />}
                {t('emps_pwd_submit')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
