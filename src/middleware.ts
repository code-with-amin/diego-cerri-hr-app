import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, EMP_AUTH_COOKIE } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const isAdminAuthenticated = request.cookies.has(AUTH_COOKIE)
  const isEmpAuthenticated = request.cookies.has(EMP_AUTH_COOKIE)
  const { pathname } = request.nextUrl

  // Admin routes
  if (pathname.startsWith('/dashboard') && !isAdminAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (pathname === '/login' && isAdminAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Employee routes
  if (
    (pathname.startsWith('/employee/dashboard') ||
      pathname.startsWith('/employee/tracker') ||
      pathname.startsWith('/employee/entries')) &&
    !isEmpAuthenticated
  ) {
    return NextResponse.redirect(new URL('/employee/login', request.url))
  }
  // While authenticated, the auth pages redirect back into the portal.
  if (
    (pathname === '/employee/login' ||
      pathname === '/employee/forgot-password' ||
      pathname === '/employee/reset-password') &&
    isEmpAuthenticated
  ) {
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
