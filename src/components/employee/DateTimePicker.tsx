'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { ptBR, enUS } from 'date-fns/locale'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// Format a Date to the datetime-local string "YYYY-MM-DDTHH:mm" (local time)
// so the value stays compatible with `new Date(value)` used by the tracker.
function toLocalValue(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

function startOfDay(d: Date): Date {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

interface DateTimePickerProps {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  /** Lower bound (datetime-local string). The effective floor is max(now, min). */
  min?: string
}

/**
 * Date + time picker backed by the shadcn Calendar. Anything before the floor —
 * the later of "now" and the optional `min` bound — is muted and non-selectable,
 * so e.g. a break end can never sit before its break start.
 */
export function DateTimePicker({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  min,
}: DateTimePickerProps) {
  const { lang, t } = useLanguage()
  const locale = lang === 'pt' ? ptBR : enUS

  const parsed = value ? new Date(value) : undefined
  const selected = parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined

  // Floor = later of "now" and the optional `min` bound.
  const minParsed = min ? new Date(min) : undefined
  const minMs = minParsed && !Number.isNaN(minParsed.getTime()) ? minParsed.getTime() : 0
  const floor = new Date(Math.max(Date.now(), minMs))

  const timeValue = selected ? `${pad(selected.getHours())}:${pad(selected.getMinutes())}` : ''
  const minTime =
    selected && isSameDay(selected, floor)
      ? `${pad(floor.getHours())}:${pad(floor.getMinutes())}`
      : undefined

  function handleDateSelect(date: Date | undefined) {
    if (!date) return
    // Keep the previously chosen time of day, defaulting to the floor for a fresh pick.
    const hours = selected ? selected.getHours() : floor.getHours()
    const minutes = selected ? selected.getMinutes() : floor.getMinutes()
    const combined = new Date(date)
    combined.setHours(hours, minutes, 0, 0)
    // Never allow a moment before the floor.
    if (combined.getTime() < floor.getTime()) {
      combined.setHours(floor.getHours(), floor.getMinutes(), 0, 0)
    }
    onChange(toLocalValue(combined))
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return
    const [h, m] = e.target.value.split(':').map(Number)
    const base = selected ?? new Date(floor)
    const combined = new Date(base)
    combined.setHours(h || 0, m || 0, 0, 0)
    // Reject times before the floor (past, or before the min bound).
    if (combined.getTime() < floor.getTime()) return
    onChange(toLocalValue(combined))
  }

  const label = selected
    ? selected.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : placeholder ?? t('emp_select_datetime')

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            id={id}
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !selected && 'text-muted-foreground',
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          disabled={{ before: startOfDay(floor) }}
          locale={locale}
        />
        <div className="border-t pt-2.5">
          <Input
            type="time"
            aria-label="time"
            value={timeValue}
            min={minTime}
            onChange={handleTimeChange}
            disabled={!selected}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
