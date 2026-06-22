import { Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface InternalNotesPanelProps {
  notes?: string
}

export function InternalNotesPanel({ notes }: InternalNotesPanelProps) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm text-amber-800">
            <Lock className="h-4 w-4" />
            Internal HR Notes
          </CardTitle>
          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-100">
            HR Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          rows={4}
          defaultValue={notes ?? ''}
          placeholder="Add internal notes visible only to HR managers…"
          className="resize-none bg-white border-amber-200 focus-visible:ring-amber-300"
          readOnly
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-amber-700">Never visible to candidates.</p>
          <Button size="sm" disabled className="opacity-60">
            Save Note
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
