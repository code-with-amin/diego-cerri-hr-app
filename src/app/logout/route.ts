import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE } from '@/lib/auth'

/**
 * Clears the admin session cookie and forwards to the login page. Used both by
 * the logout button and by `apiFetch` when the API rejects the session (401/403).
 * A route handler is the legal place to mutate cookies (unlike a render).
 */
export function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', request.url))
  res.cookies.delete(AUTH_COOKIE)
  return res
}
