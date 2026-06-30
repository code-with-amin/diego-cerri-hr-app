'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EMP_AUTH_COOKIE } from '@/lib/auth'
import { MOCK_EMPLOYEE_CREDENTIALS } from '@/data/employee-mock'

export async function employeeLoginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const valid =
    email === MOCK_EMPLOYEE_CREDENTIALS.email &&
    password === MOCK_EMPLOYEE_CREDENTIALS.password

  if (valid) {
    const cookieStore = await cookies()
    cookieStore.set(EMP_AUTH_COOKIE, 'mock-emp-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })
    redirect('/employee/dashboard')
  }

  redirect('/employee/login?error=invalid')
}

export async function employeeLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(EMP_AUTH_COOKIE)
  redirect('/employee/login')
}
