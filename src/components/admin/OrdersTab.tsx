import { useState } from 'react'
import { Search, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import useAdminStore, { AdminOrder, OrderStatus } from '@/stores/useAdminStore'
import { formatCurrency } from '@/lib/mock-data'
import { OrderDialog } from './OrderDialog'

export function OrdersTab() {
  const { orders, updateOrderStatus, updateOrderTracking } = useAdminStore()
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-success text-white'
      case 'Shipped':
        return 'bg-blue-500 text-white'
      case 'Canceled':
        return 'bg-destructive text-white'
      case 'Pending':
        return 'bg-orange-500 text-white'
      default:
        return 'bg-secondary'
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold text-primary">Gestão de Pedidos</h2>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID ou Cliente..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Logística</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono font-medium text-xs">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                <TableCell className="font-bold text-primary">
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(val: OrderStatus) => updateOrderStatus(order.id, val)}
                  >
                    <SelectTrigger
                      className={`h-8 text-xs font-semibold border-none ${getStatusColor(order.status)}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pendente</SelectItem>
                      <SelectItem value="Paid">Pago</SelectItem>
                      <SelectItem value="Processing">Processando</SelectItem>
                      <SelectItem value="Shipped">Enviado</SelectItem>
                      <SelectItem value="Delivered">Entregue</SelectItem>
                      <SelectItem value="Canceled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {order.trackingCode && (
                      <Badge variant="outline" className="font-mono text-[10px] bg-muted">
                        {order.trackingCode}
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      <Info className="w-4 h-4 mr-1" /> Detalhes
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderDialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
        onSaveTracking={updateOrderTracking}
      />
    </div>
  )
}
