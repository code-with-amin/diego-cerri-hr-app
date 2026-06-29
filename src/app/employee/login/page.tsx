import { LoginCard } from '@/app/login/LoginCard'

export default function EmployeeLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <LoginCard hasError={false} variant="employee" />
    </div>
  )
}
