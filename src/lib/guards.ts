import 'server-only'
import { getAdminMe } from './api-client'
import { getMe } from './employee-store'

/**
 * Authoritative server-side gates for the two portals. Each calls the backend
 * `/me` endpoint (role-checked by `requireAdmin` / `requireEmployee`); on a
 * missing/expired/wrong-role token the underlying fetch redirects to the
 * matching logout route, so these only return for a correctly-authenticated
 * user of that role. Call them from a segment `layout.tsx`.
 */
export async function requireAdminSession() {
  await getAdminMe()
}

export async function requireEmployeeSession() {
  await getMe()
}
