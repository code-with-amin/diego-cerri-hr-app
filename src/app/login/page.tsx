import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { loginAction } from './actions'

interface LoginPageProps {
  searchParams: { error?: string }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const hasError = searchParams.error === 'invalid'

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-primary px-4">
      <Image
        src="/bg.jpeg" 
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,30,76,.92),rgba(28,58,97,.78))]" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className='flex justify-center items-center gap-2'>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary-foreground font-bold text-m">
            KPI
            </div>
            <h1 className="text-xl text-primary-foreground font-semibold">Engineering Portal</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>Enter your HR admin credentials</CardDescription>
          </CardHeader>
          <CardContent>
            {hasError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                Invalid email or password. Please try again.
              </div>
            )}
            <form action={loginAction} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@company.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-2">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-primary-foreground">
          Restricted to authorised HR personnel only.
        </p>
      </div>
    </div>
  )
}
