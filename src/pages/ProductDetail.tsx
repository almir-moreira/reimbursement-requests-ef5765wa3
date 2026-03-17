import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ChevronRight, ShoppingCart, Truck, ShieldCheck, Ruler, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockProducts, formatCurrency } from '@/lib/mock-data'
import useCartStore from '@/stores/useCartStore'

export default function ProductDetail() {
  const { id } = useParams()
  const product = mockProducts.find((p) => p.id === id) || mockProducts[0] // Fallback to first
  const { addItem } = useCartStore()
  const [mainImage, setMainImage] = useState(product.images[0])
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePos({ x, y })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <Link
          to={`/catalogo?cat=${product.category}`}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <span className="text-foreground font-medium truncate">{product.shortName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Images Column */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {/* Main Image with Zoom */}
          <div
            className="relative bg-muted rounded-2xl overflow-hidden aspect-[4/3] cursor-zoom-in group shadow-sm border border-border"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {product.isNew && (
              <Badge className="absolute top-4 left-4 z-20 bg-accent text-accent-foreground border-none">
                Novidade
              </Badge>
            )}
            <img
              src={mainImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-[2]' : 'scale-100'}`}
              style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
            />
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${mainImage === img ? 'border-accent shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="font-mono">
                {product.catalogNumber}
              </Badge>
              <Badge variant="secondary" className="bg-primary text-white">
                {product.condition}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="bg-muted/30 p-6 rounded-xl border border-border mb-8">
            <div className="flex flex-col mb-6">
              {product.oldPrice && (
                <span className="text-muted-foreground line-through text-lg">
                  {formatCurrency(product.oldPrice)}
                </span>
              )}
              <span className="text-4xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Em até 12x no cartão ou à vista no Pix.
              </span>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.02] transition-transform shadow-lg mb-4"
              onClick={() => addItem(product)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Adicionar ao Carrinho
            </Button>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-success" /> Compra Garantida
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-primary" /> Envio com Seguro
              </div>
            </div>
          </div>

          {/* Specs Table */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-accent" /> Especificações Técnicas
            </h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-border">
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 font-medium text-muted-foreground w-1/3">
                      País de Origem
                    </th>
                    <td className="px-4 py-3 font-semibold">{product.origin}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Ano de Emissão</th>
                    <td className="px-4 py-3 font-semibold">{product.year}</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Material</th>
                    <td className="px-4 py-3 font-semibold">{product.material}</td>
                  </tr>
                  {product.weight && (
                    <tr>
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Peso/Dimensões
                      </th>
                      <td className="px-4 py-3 font-semibold">{product.weight}</td>
                    </tr>
                  )}
                  <tr className={product.weight ? 'bg-muted/50' : ''}>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Catálogo Ref.</th>
                    <td className="px-4 py-3 font-semibold">{product.catalogNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
