import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useAdminStore from '@/stores/useAdminStore'
import { formatCurrency } from '@/lib/mock-data'

export function OverviewTab() {
  const { products, users, orders } = useAdminStore()

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const activeUsers = users.filter((u) => u.isActive).length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

  const stats = [
    {
      title: 'Receita Total',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      trend: '+12% este mês',
    },
    {
      title: 'Pedidos Realizados',
      value: orders.length,
      icon: ShoppingCart,
      trend: '+5% este mês',
    },
    { title: 'Usuários Ativos', value: activeUsers, icon: Users, trend: '+2 novos hoje' },
    {
      title: 'Itens em Estoque',
      value: totalStock,
      icon: Package,
      trend: '15 itens com baixo estoque',
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold text-primary">Visão Geral</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.id} &bull; {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">{formatCurrency(order.total)}</p>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-muted rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
