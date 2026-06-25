import { LoginCard } from './LoginCard'

interface LoginPageProps {
  searchParams: { error?: string }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const hasError = searchParams.error === 'invalid'

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <LoginCard hasError={hasError} />
    </div>
  )
}
