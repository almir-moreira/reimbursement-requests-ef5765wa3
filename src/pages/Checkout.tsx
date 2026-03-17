import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Check, CreditCard, QrCode, Truck, User, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import useCartStore from '@/stores/useCartStore'
import useAuthStore from '@/stores/useAuthStore'
import { formatCurrency } from '@/lib/mock-data'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCartStore()
  const { isAuthenticated, user, setIsAuthModalOpen, updateAddress } = useAuthStore()

  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [isProcessing, setIsProcessing] = useState(false)

  // Address state
  const [address, setAddress] = useState({
    cep: user?.address?.cep || '',
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    complement: user?.address?.complement || '',
  })

  useEffect(() => {
    if (items.length === 0 && step !== 4) {
      navigate('/')
    }
    if (isAuthenticated && step === 1) setStep(2)
  }, [items.length, isAuthenticated, navigate, step])

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 2) {
      updateAddress(address)
      setStep(3)
    } else if (step === 3) {
      handleFinalize()
    }
  }

  const handleFinalize = () => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      setStep(4) // Success screen

      // Admin Notification Logic Simulation
      toast({
        title: '🛒 Novo Pedido Recebido (Admin)',
        description: `Pedido #${Math.floor(Math.random() * 10000)} de ${user?.name}. ${items.length} itens. Valor: ${formatCurrency(totalPrice)}.`,
        duration: 8000,
      })

      clearCart()
    }, 2000)
  }

  const frete = 25.0
  const total = totalPrice + frete

  if (step === 4) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2 text-center">
          Compra Confirmada!
        </h1>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Obrigado, <strong>{user?.name}</strong>. Seu pedido foi recebido e está sendo preparado
          para envio. Um email de confirmação foi enviado.
        </p>
        <div className="bg-muted/50 p-6 rounded-xl border border-border w-full max-w-md mb-8">
          <h3 className="font-bold mb-4">Resumo do Pedido</h3>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Nº do Pedido:</span>{' '}
            <span>#{(Math.random() * 100000).toFixed(0)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Status:</span>{' '}
            <Badge className="bg-success text-white hover:bg-success">Aprovado</Badge>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Pago:</span> <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
        <Button asChild size="lg" className="bg-primary">
          <Link to="/dashboard">Ver Meus Pedidos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <h1 className="text-3xl font-serif font-bold mb-8">Finalizar Compra</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Steps */}
        <div className="flex-1">
          {/* Stepper Header */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>

            {[
              { num: 1, label: 'Identificação', icon: User },
              { num: 2, label: 'Entrega', icon: Truck },
              { num: 3, label: 'Pagamento', icon: CreditCard },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s.num ? 'bg-primary text-white ring-4 ring-background' : 'bg-muted text-muted-foreground border-2 border-border'}`}
                >
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <span
                  className={`text-xs font-semibold ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border shadow-sm rounded-xl p-6 lg:p-8">
            {/* Step 1: Auth */}
            {step === 1 && (
              <div className="text-center py-8">
                <ShieldCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-serif font-bold mb-2">
                  Identifique-se para continuar
                </h2>
                <p className="text-muted-foreground mb-8">
                  Precisamos dos seus dados para garantir a entrega segura da sua coleção.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full max-w-sm"
                >
                  Fazer Login / Cadastrar
                </Button>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <form onSubmit={handleNextStep}>
                <h2 className="text-2xl font-serif font-bold mb-6">Onde devemos entregar?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      required
                      value={address.cep}
                      onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Endereço (Rua, Avenida)</Label>
                    <Input
                      id="street"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      required
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento (Opcional)</Label>
                    <Input
                      id="complement"
                      value={address.complement}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto bg-primary">
                  Ir para Pagamento
                </Button>
              </form>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <form onSubmit={handleNextStep}>
                <h2 className="text-2xl font-serif font-bold mb-6">Método de Pagamento</h2>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="gap-4 mb-8"
                >
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'pix' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted'}`}
                  >
                    <RadioGroupItem value="pix" id="pix" className="sr-only" />
                    <Label htmlFor="pix" className="flex items-center gap-3 cursor-pointer">
                      <QrCode className="w-6 h-6 text-success" />
                      <div>
                        <div className="font-bold text-base">PIX (Aprovação Imediata)</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          Ganhe 5% de desconto (já aplicado)
                        </div>
                      </div>
                    </Label>

                    {paymentMethod === 'pix' && (
                      <div className="mt-4 pt-4 border-t border-border/50 flex flex-col items-center">
                        <div className="w-40 h-40 bg-white p-2 border rounded-lg mb-4">
                          <img
                            src="https://img.usecurling.com/i?q=qr%20code&shape=hand-drawn"
                            alt="QR Code"
                            className="w-full h-full opacity-50"
                          />
                        </div>
                        <p className="text-sm text-center mb-4">
                          Escaneie o QR Code ou copie a chave abaixo:
                        </p>
                        <Button
                          variant="outline"
                          type="button"
                          className="w-full font-mono text-xs"
                        >
                          00020126360014BR.GOV.BCB.PIX...
                        </Button>
                      </div>
                    )}
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted'}`}
                  >
                    <RadioGroupItem value="card" id="card" className="sr-only" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <div>
                        <div className="font-bold text-base">Cartão de Crédito</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          Em até 12x sem juros
                        </div>
                      </div>
                    </Label>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                          <Label>Número do Cartão</Label>
                          <Input placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Nome Impresso</Label>
                          <Input placeholder="Como está no cartão" />
                        </div>
                        <div className="space-y-2">
                          <Label>Validade</Label>
                          <Input placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV</Label>
                          <Input placeholder="123" type="password" maxLength={4} />
                        </div>
                      </div>
                    )}
                  </div>
                </RadioGroup>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? 'Processando...'
                      : `Confirmar Pagamento - ${formatCurrency(total)}`}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-muted/30 border border-border rounded-xl p-6 sticky top-24">
            <h3 className="font-serif font-bold text-xl mb-4">Resumo da Compra</h3>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded border bg-card overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-semibold line-clamp-2 leading-tight">
                      {item.product.name}
                    </div>
                    <div className="text-muted-foreground mt-1">Qtd: {item.quantity}</div>
                    <div className="font-bold text-primary">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="mb-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete (Sedex Seguro)</span>
                <span>{formatCurrency(frete)}</span>
              </div>
              {paymentMethod === 'pix' && (
                <div className="flex justify-between text-success">
                  <span>Desconto PIX (5%)</span>
                  <span>-{formatCurrency(totalPrice * 0.05)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-primary">
                {formatCurrency(paymentMethod === 'pix' ? total - totalPrice * 0.05 : total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}
