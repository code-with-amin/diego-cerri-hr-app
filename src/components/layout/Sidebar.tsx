'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { LayoutDashboard, LogOut, Users, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { logoutAction } from '@/app/login/actions'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { TranslationKey } from '@/lib/i18n'

// Sign-out control — shows the shared spinner in place of the icon while the
// logout action runs (must live inside the <form> to read useFormStatus).
function SignOutButton() {
  const { pending } = useFormStatus()
  const { t } = useLanguage()
  return (
    <button
      type="submit"
      title={t('sign_out')}
      disabled={pending}
      className="text-slate-500 hover:text-slate-200 transition-colors disabled:opacity-70"
    >
      {pending ? <Spinner className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
    </button>
  )
}

const navItems: { labelKey: TranslationKey; href: string; icon: typeof LayoutDashboard; exact: boolean }[] = [
  { labelKey: 'nav_dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { labelKey: 'nav_candidates', href: '/dashboard/candidates', icon: Users, exact: false },
  { labelKey: 'nav_employees', href: '/dashboard/employees', icon: Clock, exact: false },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <aside className="flex h-screen w-60 flex-col bg-primary text-slate-100 flex-shrink-0">
      <div className="flex h-16 items-center px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="KPI Engenharia" className="h-8 w-auto" />
      </div>

      <Separator className="bg-slate-700" />

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.labelKey}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.labelKey)}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-slate-700" />

      <div className="px-4 py-4 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
            HR
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-200 truncate">HR Manager</p>
          <p className="text-xs text-slate-500 truncate">admin@company.com</p>
        </div>
        <form action={logoutAction}>
          <SignOutButton />
        </form>
      </div>
    </aside>
  )
}
