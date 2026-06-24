import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_COOKIE } from './auth'

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api'

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
  if (res.status === 401) {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE)
    redirect('/login')
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
