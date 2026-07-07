import { redirect } from 'next/navigation'

export default function Home() {
  // The app defaults to the employee portal. An already-authenticated employee
  // is bounced on to /employee/dashboard by the middleware.
  redirect('/employee/login')
}
