import { useState, useEffect } from 'react'
import { Truck } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminOrder } from '@/stores/useAdminStore'
import { formatCurrency } from '@/lib/mock-data'

interface OrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: AdminOrder | null
  onSaveTracking: (id: string, code: string) => void
}

export function OrderDialog({ open, onOpenChange, order, onSaveTracking }: OrderDialogProps) {
  const [trackingCode, setTrackingCode] = useState('')

  useEffect(() => {
    if (order) {
      setTrackingCode(order.trackingCode || '')
    }
  }, [order])

  const handleSave = () => {
    if (order) {
      onSaveTracking(order.id, trackingCode)
      onOpenChange(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido - {order.id}</DialogTitle>
          <DialogDescription>Gerencie o envio e logística deste pedido.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2 border border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data:</span>
              <span>{order.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status Atual:</span>
              <span className="font-semibold">{order.status}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="tracking" className="flex items-center gap-2">
              <Truck className="w-4 h-4" /> Código de Rastreio (Correios/Transportadora)
            </Label>
            <Input
              id="tracking"
              placeholder="Ex: BR123456789XP"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Ao salvar um código de rastreio, o status do pedido será alterado automaticamente para
              "Shipped".
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
