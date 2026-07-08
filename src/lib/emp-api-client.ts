import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EMP_AUTH_COOKIE } from './auth'

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api'

/** Error carrying the backend's human message so server actions can surface it. */
export class EmpApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'EmpApiError'
    this.status = status
  }
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(EMP_AUTH_COOKIE)?.value
}

/**
 * Fetch against the employee API using the `emp_session` cookie.
 * A 401 clears the cookie and redirects to the employee login (mirrors the
 * admin `apiFetch`). Other non-2xx responses throw an `EmpApiError` whose
 * message is the backend's `error.message` when present.
 */
export async function empApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers as Record<string, string> | undefined),
    },
    cache: 'no-store',
  })

  // 401 (missing/expired/invalid token) or 403 (wrong role) → the employee
  // logout route clears the cookie and forwards to /employee/login. Cookies
  // can't be mutated during a render, so we don't delete here.
  if (res.status === 401 || res.status === 403) {
    redirect('/employee/logout')
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      message = body?.error?.message ?? message
    } catch {
      // non-JSON body — keep the generic message
    }
    throw new EmpApiError(res.status, message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
