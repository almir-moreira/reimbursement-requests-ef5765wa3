import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Product, formatCurrency } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import useCartStore from '@/stores/useCartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
  }

  return (
    <Link to={`/produto/${product.id}`} className="group block h-full">
      <div className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-elegant h-full flex flex-col relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-accent text-accent-foreground border-none">Novidade</Badge>
          )}
          <Badge
            variant="secondary"
            className="bg-primary/80 text-white backdrop-blur-md border-none"
          >
            {product.condition}
          </Badge>
        </div>

        {/* Image */}
        <div className="aspect-[4/3] bg-muted overflow-hidden relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center">
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adição Rápida
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
            {product.origin} • {product.year}
          </div>
          <h3 className="font-serif text-lg font-bold leading-tight mb-2 text-foreground line-clamp-2">
            {product.shortName}
          </h3>

          <div className="mt-auto pt-4 flex items-end justify-between">
            <div>
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through block">
                  {formatCurrency(product.oldPrice)}
                </span>
              )}
              <span className="text-xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
            </div>
            {product.stock <= 2 && (
              <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md">
                Restam {product.stock}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
