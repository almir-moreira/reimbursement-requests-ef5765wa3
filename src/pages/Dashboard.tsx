import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, User, MapPin, LogOut, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useAuthStore from '@/stores/useAuthStore'
import { formatCurrency } from '@/lib/mock-data'

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  if (!user) return null

  const orders = user.orders || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Minha Conta</h1>
          <p className="text-muted-foreground">
            Bem-vindo(a) de volta,{' '}
            <span className="font-semibold text-foreground">{user.name}</span>
          </p>
        </div>
        <Button
          variant="outline"
          className="text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> Sair da Conta
        </Button>
      </div>

      <Tabs defaultValue="pedidos" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8 bg-muted/50 p-1">
          <TabsTrigger
            value="pedidos"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Package className="w-4 h-4 mr-2" /> Pedidos
          </TabsTrigger>
          <TabsTrigger
            value="perfil"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <User className="w-4 h-4 mr-2" /> Perfil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos" className="space-y-6">
          <h2 className="text-xl font-serif font-bold mb-4">Histórico de Compras</h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não realizou nenhuma compra conosco.
              </p>
              <Button onClick={() => navigate('/catalogo')}>Explorar Catálogo</Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <div className="bg-muted/50 px-6 py-4 border-b border-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground block">
                        Pedido realizado em
                      </span>
                      <span className="font-medium">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Total Pago</span>
                      <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-sm text-muted-foreground block">Pedido nº</span>
                      <span className="font-mono text-sm">{order.id}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <Badge
                        variant={order.status === 'Entregue' ? 'default' : 'secondary'}
                        className={
                          order.status === 'Entregue'
                            ? 'bg-success hover:bg-success'
                            : 'bg-accent text-accent-foreground'
                        }
                      >
                        {order.status}
                      </Badge>
                      <Button variant="link" className="text-primary p-0 h-auto">
                        Ver Detalhes
                      </Button>
                    </div>

                    <div className="divide-y divide-border">
                      {order.items.map((item, i) => (
                        <div key={i} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                          <div className="w-20 h-20 rounded border bg-card shrink-0">
                            <img
                              src={item.product.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm lg:text-base">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Ref: {item.product.catalogNumber} &bull; Qtd: {item.quantity}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 h-8 text-xs"
                              onClick={() => navigate(`/produto/${item.product.id}`)}
                            >
                              Comprar Novamente
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.shippingAddress && (
                      <div className="mt-6 pt-4 border-t border-border flex items-start gap-3 text-sm">
                        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block mb-1">Destino de Entrega:</span>
                          <span className="text-muted-foreground">
                            {order.shippingAddress.street}, {order.shippingAddress.number}{' '}
                            {order.shippingAddress.complement &&
                              `- ${order.shippingAddress.complement}`}
                            <br />
                            {order.shippingAddress.city} - {order.shippingAddress.state} (CEP:{' '}
                            {order.shippingAddress.cep})
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="perfil">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Dados Pessoais
                </CardTitle>
                <CardDescription>Informações básicas da sua conta.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground block">Nome Completo</span>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">E-mail</span>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Editar Dados
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Endereço de Entrega Padrão
                </CardTitle>
                <CardDescription>Onde suas coleções serão entregues.</CardDescription>
              </CardHeader>
              <CardContent>
                {user.address?.street ? (
                  <div className="space-y-1 bg-muted/30 p-4 rounded-lg border border-border">
                    <p className="font-medium">
                      {user.address.street}, {user.address.number}
                    </p>
                    {user.address.complement && (
                      <p className="text-sm text-muted-foreground">{user.address.complement}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {user.address.city} - {user.address.state}
                    </p>
                    <p className="text-sm text-muted-foreground">CEP: {user.address.cep}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-muted/30 rounded-lg border border-dashed text-sm text-muted-foreground">
                    Nenhum endereço cadastrado.
                  </div>
                )}
                <Button variant="outline" className="w-full mt-6">
                  Atualizar Endereço
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
