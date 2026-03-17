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
  const [address, setAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    login(isLogin ? name || 'Colecionador' : name, email, isLogin ? undefined : address)
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary text-center">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin
              ? 'Acesse sua conta para continuar sua coleção.'
              : 'Junte-se à nossa comunidade de numismática e receba suas compras em casa.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
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

          {!isLogin && (
            <>
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
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <h3 className="col-span-2 font-serif font-semibold text-lg">Endereço de Entrega</h3>
                <div className="space-y-2 col-span-2">
                  <Label>Rua e Número</Label>
                  <div className="flex gap-2">
                    <Input
                      className="flex-1"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="Nome da Rua/Avenida"
                    />
                    <Input
                      className="w-24"
                      required
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      placeholder="Nº"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado / CEP</Label>
                  <div className="flex gap-2">
                    <Input
                      className="w-16"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="UF"
                    />
                    <Input
                      className="flex-1"
                      required
                      value={address.cep}
                      onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 mt-6">
            {isLogin ? 'Entrar' : 'Cadastrar e Salvar'}
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
