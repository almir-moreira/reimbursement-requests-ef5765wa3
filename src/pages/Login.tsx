import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import logoImg from '@/assets/kaiciid-logo-2023-e2011.jpg'
import useAuthStore from '@/stores/useAuthStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter both email and password.',
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })

      if (error) {
        const isInvalidCredentials =
          error.message.includes('Invalid login credentials') || error.status === 400

        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: isInvalidCredentials
            ? 'Invalid login credentials. Please check your email and password and try again.'
            : error.message || 'Incorrect email or password. Please try again.',
        })
        return
      }

      toast({
        title: 'Login successful',
        description: 'Welcome to the reimbursement system.',
      })
      // Navigation is handled by the useEffect watching 'user'
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description: 'An error occurred while trying to log in. Please try again later.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-6 flex flex-col items-center pt-8 pb-4">
          <div className="w-full flex justify-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-2">
            <img src={logoImg} alt="KAICIID Logo" className="h-24 w-auto object-contain" />
          </div>
          <div className="space-y-2 text-center w-full">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Restricted Access
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Enter your credentials to access the platform
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#4a8ebf] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="pb-8 pt-2 flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in to Platform'
              )}
            </Button>
            <div className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#4a8ebf] hover:underline font-medium">
                Create an Account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
