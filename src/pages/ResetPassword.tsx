import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import useAuthStore from '@/stores/useAuthStore'
import { toast } from '@/hooks/use-toast'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const { updatePassword } = useAuthStore()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' })
      return
    }
    if (password.length < 8) {
      toast({ title: 'Password must be at least 8 characters long', variant: 'destructive' })
      return
    }

    updatePassword(email, password)
    setSuccess(true)
    toast({ title: 'Password updated successfully' })
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md shadow-elegant border-border p-6 text-center">
          <p className="text-destructive font-semibold mb-6">Invalid or expired reset link.</p>
          <Button asChild className="w-full h-12 bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white">
            <Link to="/forgot-password">Request New Link</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-elegant border-border">
        <CardHeader className="text-center pb-2">
          <h1 className="font-bold text-3xl text-[#4a8ebf] uppercase tracking-wider mb-2">
            KAICIID
          </h1>
          <CardTitle className="text-xl font-serif text-foreground/80">Set New Password</CardTitle>
          <CardDescription className="pt-2 truncate" title={email}>
            Enter your new password for {email}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-6 py-4">
              <p className="text-sm text-success font-medium bg-success/10 p-4 rounded-md border border-success/20">
                Your password has been successfully reset!
              </p>
              <Button
                asChild
                className="w-full h-12 bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold"
              >
                <Link to="/login">Go to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <p className="text-xs text-muted-foreground">Must be at least 8 characters long.</p>
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-md bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold"
              >
                Update Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
