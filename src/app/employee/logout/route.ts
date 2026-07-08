import { NextRequest, NextResponse } from 'next/server'
import { EMP_AUTH_COOKIE } from '@/lib/auth'

/**
 * Clears the employee session cookie and forwards to the employee login page.
 * Used by `empApiFetch` when the API rejects the session (401/403). A route
 * handler is the legal place to mutate cookies (unlike a render).
 */
export function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/employee/login', request.url))
  res.cookies.delete(EMP_AUTH_COOKIE)
  return res
}
