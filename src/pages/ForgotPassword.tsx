import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { sendEmail } from '@/lib/smtp'
import { toast } from '@/hooks/use-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    const resetLink = `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}&token=mock-token-123`

    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      body: `You requested a password reset. Click the link below to set a new password:\n\n${resetLink}`,
    })

    setSubmitted(true)
    toast({ title: 'Reset link sent' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-elegant border-border">
        <CardHeader className="text-center pb-2">
          <h1 className="font-bold text-3xl text-[#4a8ebf] uppercase tracking-wider mb-2">
            KAICIID
          </h1>
          <CardTitle className="text-xl font-serif text-foreground/80">Reset Password</CardTitle>
          <CardDescription className="pt-2">
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                If an account exists for <strong>{email}</strong>, a password reset link has been
                sent.
              </p>
              <Button
                asChild
                className="w-full h-12 bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold"
              >
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-md bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold"
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </CardContent>
        {!submitted && (
          <CardFooter className="flex justify-center border-t border-border pt-4">
            <Button variant="link" asChild className="text-[#4a8ebf]">
              <Link to="/login">Back to Login</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
