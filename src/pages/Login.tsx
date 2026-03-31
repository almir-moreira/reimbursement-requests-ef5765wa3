import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro de Autenticação',
          description: 'E-mail ou senha incorretos. Tente novamente.',
        })
        return
      }

      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao sistema de reembolsos.',
      })
      navigate('/dashboard')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao tentar fazer login. Tente mais tarde.',
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
              Acesso Restrito
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Insira suas credenciais para acessar a plataforma
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Senha
                </Label>
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
          <CardFooter className="pb-8 pt-2">
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar na Plataforma'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
