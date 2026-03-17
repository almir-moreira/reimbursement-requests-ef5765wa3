import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useCartStore from '@/stores/useCartStore'
import useAuthStore from '@/stores/useAuthStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { totalItems, setIsCartOpen } = useCartStore()
  const { isAuthenticated, user, setIsAuthModalOpen, logout } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`)
      setIsMobileSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b border-border shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4 lg:w-1/4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
              <span className="font-serif font-bold text-white text-xl">ND</span>
            </div>
            <span className="font-serif font-bold text-xl tracking-tight hidden sm:block text-primary">
              Numismática Digital
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center items-center gap-8">
          <Link
            to="/catalogo?cat=Cédulas"
            className="text-sm font-semibold hover:text-accent transition-colors text-foreground"
          >
            Cédulas
          </Link>
          <Link
            to="/catalogo?cat=Moedas"
            className="text-sm font-semibold hover:text-accent transition-colors text-foreground"
          >
            Moedas
          </Link>
          <Link
            to="/catalogo?cat=Coleções"
            className="text-sm font-semibold hover:text-accent transition-colors text-foreground"
          >
            Coleções
          </Link>
          <Link
            to="/catalogo"
            className="text-sm font-semibold text-accent hover:text-primary transition-colors"
          >
            Ver Tudo
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 lg:w-1/4">
          <div className="relative hidden md:block max-w-[200px] w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar itens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-9 bg-muted/50 border-transparent focus-visible:border-accent rounded-full h-10"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            {isMobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden sm:flex gap-2 text-sm font-medium">
                  <User className="w-4 h-4 text-primary" />
                  <span className="truncate max-w-[100px]">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Minha Conta</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Meus Pedidos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAuthModalOpen(true)}
              className="relative hover:text-accent hover:bg-transparent"
            >
              <User className="w-5 h-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-accent hover:bg-transparent"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground ring-2 ring-background animate-fade-in-up">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className="absolute top-20 left-0 w-full p-4 bg-background border-b border-border md:hidden z-50 animate-in slide-in-from-top-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar moedas, cédulas, anos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-9 w-full bg-muted/50"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
