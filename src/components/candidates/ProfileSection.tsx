import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface Field {
  label: string
  value: string | number | string[] | undefined
}

interface ProfileSectionProps {
  title: string
  fields: Field[]
}

function renderValue(value: Field['value']): string {
  if (value === undefined || value === null || value === '') return '—'
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '—'
  return String(value)
}

export function ProfileSection({ title, fields }: ProfileSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs font-medium text-muted-foreground">{field.label}</dt>
              <dd className="mt-0.5 text-sm break-words">{renderValue(field.value)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
