'use server'

import { redirect } from 'next/navigation'

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api'

export async function resetPasswordAction(formData: FormData) {
  const token = (formData.get('token') as string) ?? ''
  const password = (formData.get('password') as string) ?? ''
  const confirm = (formData.get('confirm') as string) ?? ''

  const back = (reason: string) =>
    `/employee/reset-password?token=${encodeURIComponent(token)}&error=${reason}`

  if (password.length < 8) redirect(back('short'))
  if (password !== confirm) redirect(back('mismatch'))

  let ok = false
  try {
    const res = await fetch(`${API_URL}/employee/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    ok = res.ok
  } catch {
    ok = false
  }

  if (ok) redirect('/employee/login?reset=1')
  redirect(back('invalid'))
}
