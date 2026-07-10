import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, EMP_AUTH_COOKIE } from '@/lib/auth'

interface Claims {
  role?: string
  exp?: number
}

/**
 * Decode — NOT verify — a JWT's payload for a fast, coarse edge gate. The Edge
 * middleware has no access to the signing secret, so signature verification is
 * intentionally left to the backend and the `/me` layout guards. Returns the
 * claims, or null if the token is malformed or past its `exp`. A token that
 * decodes to the right role but has a forged signature still passes here and is
 * caught server-side by the layout guard (which routes it to /logout).
 */
function readClaims(token: string | undefined): Claims | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    const claims = JSON.parse(json) as Claims
    if (typeof claims.exp === 'number' && claims.exp * 1000 <= Date.now()) return null
    return claims
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasAdminCookie = request.cookies.has(AUTH_COOKIE)
  const hasEmpCookie = request.cookies.has(EMP_AUTH_COOKIE)
  const isAdmin = readClaims(request.cookies.get(AUTH_COOKIE)?.value)?.role === 'admin'
  const isEmployee = readClaims(request.cookies.get(EMP_AUTH_COOKIE)?.value)?.role === 'employee'

  // Redirect to `to`, clearing a stale/wrong cookie on the way out.
  const bounce = (to: string, clear?: string) => {
    const res = NextResponse.redirect(new URL(to, request.url))
    if (clear) res.cookies.delete(clear)
    return res
  }

  // Admin area
  if (pathname.startsWith('/dashboard') && !isAdmin) {
    return bounce('/login', hasAdminCookie ? AUTH_COOKIE : undefined)
  }
  if (pathname === '/login' && isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Employee area
  const empProtected =
    pathname.startsWith('/employee/dashboard') ||
    pathname.startsWith('/employee/tracker') ||
    pathname.startsWith('/employee/entries')
  if (empProtected && !isEmployee) {
    return bounce('/employee/login', hasEmpCookie ? EMP_AUTH_COOKIE : undefined)
  }
  const empAuthPage =
    pathname === '/employee/login' ||
    pathname === '/employee/forgot-password' ||
    pathname === '/employee/reset-password'
  if (empAuthPage && isEmployee) {
    return NextResponse.redirect(new URL('/employee/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/employee/dashboard/:path*',
    '/employee/tracker/:path*',
    '/employee/entries/:path*',
    '/employee/login',
    '/employee/forgot-password',
    '/employee/reset-password',
  ],
}
