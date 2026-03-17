import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAuthStore from '@/stores/useAuthStore'

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Mock login/register
    login(isLogin ? name || 'Colecionador' : name, email)
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary text-center">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin
              ? 'Acesse sua conta para continuar sua coleção.'
              : 'Junte-se à nossa comunidade de numismática.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="João da Silva"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colecionador@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required placeholder="••••••••" />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-6">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </Button>
        </form>

        <div className="text-center mt-4 text-sm text-muted-foreground">
          {isLogin ? 'Ainda não tem uma conta? ' : 'Já possui uma conta? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent font-semibold hover:underline"
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
