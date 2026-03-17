import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/lib/mock-data'
import useCartStore from '@/stores/useCartStore'

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice } =
    useCartStore()
  const navigate = useNavigate()

  const handleCheckout = () => {
    setIsCartOpen(false)
    navigate('/checkout')
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col px-0 sm:px-0 bg-background border-l border-border/50">
        <SheetHeader className="px-6 py-4 border-b border-border text-left">
          <SheetTitle className="font-serif text-2xl flex items-center gap-2 text-primary">
            <ShoppingCart className="w-6 h-6" />
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-lg font-medium">Seu carrinho está vazio.</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)} className="mt-4">
                Explorar Catálogo
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm line-clamp-2 pr-2">
                          {item.product.shortName}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-primary font-bold text-sm">
                        {formatCurrency(item.product.price)}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-input rounded-md h-8">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 h-full hover:bg-muted text-muted-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 h-full hover:bg-muted text-muted-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-card">
            <div className="flex justify-between mb-4 font-serif text-xl">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-primary">{formatCurrency(totalPrice)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Taxas e frete calculados no checkout.
            </p>
            <Button
              onClick={handleCheckout}
              className="w-full h-12 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Finalizar Compra
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
