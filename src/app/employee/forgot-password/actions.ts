'use server'

import { redirect } from 'next/navigation'

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api'

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string
  try {
    await fetch(`${API_URL}/employee/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  } catch {
    // Ignore — always report the same neutral result (no account enumeration).
  }
  redirect('/employee/forgot-password?sent=1')
}
