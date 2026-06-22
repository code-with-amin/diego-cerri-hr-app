import Link from 'next/link'
import { LayoutDashboard, LogOut, Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { logoutAction } from '@/app/login/actions'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Candidates', href: '/dashboard', icon: Users },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col bg-primary text-slate-100 flex-shrink-0">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary-foreground font-bold text-m">
          KPI
        </div>
        <span className="font-semibold text-m tracking-wide">Engineering</span>
      </div>

      <Separator className="bg-slate-700" />

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Icon className="h-4 w-4" />
              {item.label}
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
          <button
            type="submit"
            title="Sign out"
            className="text-slate-500 hover:text-slate-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </aside>
  )
}
