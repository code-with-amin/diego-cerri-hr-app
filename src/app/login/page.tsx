import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            HR
          </div>
          <h1 className="text-xl font-semibold">HR Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Sign in to access the dashboard</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  autoComplete="email"
                  readOnly
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  readOnly
                />
              </div>
              <Button type="button" className="w-full mt-2">
                Sign in
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Authentication will be functional in Milestone 2.
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Restricted to authorised HR personnel only.
        </p>
      </div>
    </div>
  )
}
