import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ProductCard } from '@/components/ProductCard'
import { mockProducts, ItemCategory } from '@/lib/mock-data'

const CATEGORIES: ItemCategory[] = ['Cédulas', 'Moedas', 'Medalhas', 'Coleções']
const ORIGINS = ['Brasil', 'Estados Unidos', 'Europa', 'Ásia']
const MATERIALS = ['Papel', 'Prata', 'Ouro', 'Níquel', 'Bronze']

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()

  // States for filters
  const [selectedCats, setSelectedCats] = useState<string[]>(searchParams.getAll('cat'))
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState('newest')

  const toggleFilter = (setFn: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setFn((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]))
  }

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts]
    if (selectedCats.length > 0) result = result.filter((p) => selectedCats.includes(p.category))
    if (selectedOrigins.length > 0)
      result = result.filter((p) => selectedOrigins.includes(p.origin))

    switch (sortOrder) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'year_asc':
        result.sort((a, b) => a.year - b.year)
        break
      case 'year_desc':
        result.sort((a, b) => b.year - a.year)
        break
      // newest is default, mock data order
    }
    return result
  }, [selectedCats, selectedOrigins, sortOrder])

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif font-bold text-lg mb-4 flex items-center border-b pb-2">
          Categorias
        </h3>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCats.includes(cat)}
                onCheckedChange={() => toggleFilter(setSelectedCats, cat)}
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif font-bold text-lg mb-4 flex items-center border-b pb-2">
          Origem
        </h3>
        <div className="space-y-3">
          {ORIGINS.map((orig) => (
            <div key={orig} className="flex items-center space-x-2">
              <Checkbox
                id={`orig-${orig}`}
                checked={selectedOrigins.includes(orig)}
                onCheckedChange={() => toggleFilter(setSelectedOrigins, orig)}
              />
              <Label
                htmlFor={`orig-${orig}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {orig}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif font-bold text-lg mb-4 flex items-center border-b pb-2">
          Material
        </h3>
        <div className="space-y-3">
          {MATERIALS.map((mat) => (
            <div key={mat} className="flex items-center space-x-2">
              <Checkbox id={`mat-${mat}`} />
              <Label htmlFor={`mat-${mat}`} className="text-sm font-medium cursor-pointer">
                {mat}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">Catálogo Completo</h1>
        <p className="text-muted-foreground text-lg">
          Encontre peças raras para valorizar sua coleção.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 pr-8 border-r border-border">
          <div className="sticky top-28">
            <FiltersContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm mb-6 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden w-full sm:w-auto flex gap-2">
                    <Filter className="w-4 h-4" /> Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="font-serif text-2xl flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5" /> Filtros Avançados
                    </SheetTitle>
                  </SheetHeader>
                  <FiltersContent />
                </SheetContent>
              </Sheet>
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                Exibindo <strong className="text-foreground">{filteredProducts.length}</strong>{' '}
                itens
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium whitespace-nowrap">Ordenar por:</span>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="price_asc">Menor Preço</SelectItem>
                  <SelectItem value="price_desc">Maior Preço</SelectItem>
                  <SelectItem value="year_asc">Ano (Antigo - Novo)</SelectItem>
                  <SelectItem value="year_desc">Ano (Novo - Antigo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
              <h3 className="text-xl font-serif font-bold text-primary mb-2">
                Nenhum item encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente remover alguns filtros para ver mais resultados.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCats([])
                  setSelectedOrigins([])
                }}
                className="mt-4"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDuration: '0.4s' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
