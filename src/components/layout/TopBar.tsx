'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { lang, setLang } = useLanguage()

  return (
    <>
      <header className="flex h-16 items-center justify-between bg-background px-6 flex-shrink-0">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-input overflow-hidden text-xs font-semibold">
            {(['en', 'pt'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 transition-colors ${
                  lang === l
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              HR
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <Separator />
    </>
  )
}
