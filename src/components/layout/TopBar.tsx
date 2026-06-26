'use client'

import { Menu, ArrowLeft } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n'

interface TopBarProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function TopBar({ title, subtitle, onMenuClick }: TopBarProps) {
  const { lang, setLang, t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const showBack = pathname !== '/dashboard'

  return (
    <>
      <header className="flex h-16 items-center justify-between bg-background px-4 md:px-6 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex-shrink-0"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
              onClick={() => router.back()}
              aria-label={t('btn_back')}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t('btn_back')}</span>
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-semibold truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center rounded-lg border border-input overflow-hidden text-xs font-semibold">
            {(['en', 'pt'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1.5 transition-colors ${
                  lang === l
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        <Avatar className="hidden md:inline-flex h-8 w-8">
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
