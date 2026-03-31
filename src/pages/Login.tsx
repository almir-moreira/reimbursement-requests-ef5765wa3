import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import useAuthStore from '@/stores/useAuthStore'
import { toast } from '@/hooks/use-toast'
import pkg from '../../package.json'

export default function Login() {
  const { login, register, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('dorna@example.com')
  const [password, setPassword] = useState('password')
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (isRegistering) {
      try {
        await register(email, name, password)
        toast({ title: 'Account created! Please log in.' })
        setIsRegistering(false)
      } catch (error) {
        toast({ title: 'Registration failed', variant: 'destructive' })
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
        const success = await login(email, password)
        if (success) {
          // Navigation is handled by the useEffect watching the user state
          // to prevent race conditions with Supabase's onAuthStateChange
        } else {
          toast({ title: 'Invalid credentials', variant: 'destructive' })
          setIsLoading(false)
        }
      } catch (error) {
        toast({
          title: 'Login failed',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        })
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-elegant border-border">
        <CardHeader className="text-center pb-2">
          <h1 className="font-bold text-3xl text-[#4a8ebf] uppercase tracking-wider mb-2">
            KAICIID
          </h1>
          <CardTitle className="text-xl font-serif text-foreground/80">
            Reimbursement Requests
          </CardTitle>
          <CardDescription className="pt-2">
            {isRegistering
              ? 'Create an account to submit requests'
              : 'Login to manage your requests'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            )}
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                {!isRegistering && (
                  <Button
                    variant="link"
                    asChild
                    className="p-0 h-auto text-xs text-[#4a8ebf] font-normal"
                  >
                    <Link to="/forgot-password">Forgotten your Password?</Link>
                  </Button>
                )}
              </div>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-md bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold"
            >
              {isLoading ? '...' : isRegistering ? 'Register' : 'Sign In'}
            </Button>
          </form>

          {!isRegistering && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <p className="font-bold mb-1">Demo Accounts (pw: password):</p>
              <ul className="space-y-1">
                <li>admin@kaiciid.org (Admin)</li>
                <li>qc@kaiciid.org (Quality Control)</li>
                <li>co@kaiciid.org (Certifying Officer)</li>
                <li>finance@kaiciid.org (Finance)</li>
                <li>dorna@example.com (Requester)</li>
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center border-t border-border pt-4 gap-2">
          <Button
            variant="link"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[#4a8ebf]"
          >
            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Create one'}
          </Button>
          <div className="text-xs text-muted-foreground font-mono">v{pkg.version}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
