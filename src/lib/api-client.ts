import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_COOKIE } from './auth'

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api'

/** Error carrying the backend's parsed status, message, and optional error code. */
export class ApiClientError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
  }
}

async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE)?.value
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
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
  // 401 (missing/expired/invalid token) or 403 (wrong role) → bounce to the
  // logout route, which clears the cookie and forwards to /login. We must NOT
  // delete the cookie here: mutating cookies during a Server Component render
  // throws (and was the cause of the 500s on stale sessions).
  if (res.status === 401 || res.status === 403) {
    redirect('/logout')
  }
  if (!res.ok) {
    const text = await res.text()
    let message = text
    let code: string | undefined
    try {
      const body = JSON.parse(text)
      if (body?.error?.message) message = body.error.message
      if (body?.error?.details?.code) code = body.error.details.code
    } catch {
      // Non-JSON body — fall back to the raw text.
    }
    throw new ApiClientError(res.status, message || `API ${res.status}`, code)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export interface AdminMe {
  id: string
  email: string
  createdAt: string
}

/**
 * Authoritative admin session check, backed by `/api/auth/me` (requireAdmin).
 * Used by the dashboard layout guard: a missing/expired/non-admin token makes
 * `apiFetch` redirect to /logout, so this only returns for a real admin.
 */
export async function getAdminMe(): Promise<AdminMe> {
  const { admin } = await apiFetch<{ admin: AdminMe }>('/auth/me')
  return admin
}
