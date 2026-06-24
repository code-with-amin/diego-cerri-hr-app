'use client'

import { useEffect, useState, useTransition } from 'react'
import { Lock, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Note } from '@/lib/types'
import { addNoteAction, updateNoteAction, deleteNoteAction } from '@/app/actions/notes'

interface InternalNotesPanelProps {
  notes: Note[]
  candidateId: string
}

export function InternalNotesPanel({ notes, candidateId }: InternalNotesPanelProps) {
  const { t } = useLanguage()
  const [isPending, startTransition] = useTransition()

  const existing = notes[0] ?? null
  const [draft, setDraft] = useState(existing?.body ?? '')

  // Sync textarea when the server re-sends updated notes after revalidation
  useEffect(() => {
    setDraft(existing?.body ?? '')
  }, [existing?.id, existing?.body])

  const isDirty = draft.trim() !== (existing?.body ?? '')
  const canSave = draft.trim().length > 0 && isDirty && !isPending

  function handleSave() {
    const body = draft.trim()
    if (!body || isPending) return
    startTransition(async () => {
      if (existing) {
        await updateNoteAction(candidateId, existing.id, body)
      } else {
        await addNoteAction(candidateId, body)
      }
    })
  }

  function handleDelete() {
    if (!existing || isPending) return
    startTransition(async () => {
      await deleteNoteAction(candidateId, existing.id)
    })
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm text-amber-800">
            <Lock className="h-4 w-4" />
            {t('notes_title')}
          </CardTitle>
          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-100">
            {t('notes_hr_only')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          rows={4}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('notes_placeholder')}
          className="resize-none bg-white border-amber-200 focus-visible:ring-amber-300"
          disabled={isPending}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-amber-700">{t('notes_disclaimer')}</p>
          <div className="flex items-center gap-2">
            {existing && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={!canSave}>
              {isPending && <Spinner className="mr-1.5 size-3.5" />}
              {isPending ? t('notes_saving') : t('notes_save')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
