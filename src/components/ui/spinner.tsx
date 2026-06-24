import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Shared loading spinner used across the whole app (login, status updates,
 * notes saving, etc.) so every loading state looks identical.
 */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} aria-hidden />
}
