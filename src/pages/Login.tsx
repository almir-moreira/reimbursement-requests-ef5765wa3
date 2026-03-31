import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/lib/i18n'
import useAuthStore from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('securepassword123')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If the user is already authenticated in the store, redirect them immediately
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      // Direct call to supabase to ensure immediate feedback and prevent multiple clicks
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      toast({ title: 'Logged in successfully' })
      // Navigate immediately. The onAuthStateChange listener in the app will update the store.
      navigate('/dashboard', { replace: true })
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-border animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-[#4a8ebf]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <span className="font-bold text-2xl text-[#4a8ebf]">K</span>
          </div>
          <CardTitle className="text-2xl font-serif text-[#4a8ebf]">KAICIID</CardTitle>
          <CardDescription className="text-md">Reimbursement Requests Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@kaiciid.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold h-11"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="text-center mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4 font-medium">Demo Accounts:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail('requester@kaiciid.org')}
                  className="text-xs hover:bg-[#4a8ebf]/10 hover:text-[#4a8ebf]"
                >
                  Requester
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail('qc@kaiciid.org')}
                  className="text-xs hover:bg-[#4a8ebf]/10 hover:text-[#4a8ebf]"
                >
                  QC
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail('co@kaiciid.org')}
                  className="text-xs hover:bg-[#4a8ebf]/10 hover:text-[#4a8ebf]"
                >
                  CO
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail('finance@kaiciid.org')}
                  className="text-xs hover:bg-[#4a8ebf]/10 hover:text-[#4a8ebf]"
                >
                  Finance
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail('admin@kaiciid.org')}
                  className="text-xs hover:bg-[#4a8ebf]/10 hover:text-[#4a8ebf]"
                >
                  Admin
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
