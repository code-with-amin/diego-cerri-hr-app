'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EMP_AUTH_COOKIE } from '@/lib/auth'

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api'

export async function employeeLoginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let token: string | null = null
  let disabled = false
  try {
    const res = await fetch(`${API_URL}/employee/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      const data = await res.json()
      token = data.token ?? null
    } else if (res.status === 403) {
      // Valid credentials but the account is disabled by an admin.
      disabled = true
    }
  } catch {
    // network error — fall through to the error redirect
  }

  if (token) {
    const cookieStore = await cookies()
    cookieStore.set(EMP_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })
    redirect('/employee/dashboard')
  }

  if (disabled) {
    redirect('/employee/login?error=disabled')
  }

  redirect('/employee/login?error=invalid')
}

export async function employeeLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(EMP_AUTH_COOKIE)
  redirect('/employee/login')
}
