import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { mockProducts } from '@/lib/mock-data'

export default function Index() {
  const featuredProducts = mockProducts.filter((p) => p.isFeatured).slice(0, 4)
  const newProducts = mockProducts.filter((p) => p.isNew).slice(0, 4)

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] bg-primary overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.usecurling.com/p/1600/900?q=numismatics%20dark&color=black"
            alt="Numismatics Hero"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center text-primary-foreground h-full pt-10">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="text-accent font-bold tracking-widest text-sm uppercase mb-4 block">
              Coleções Premium
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6 text-white">
              História em <br />
              suas mãos.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg font-light">
              Descubra notas e moedas raras certificadas do Brasil e do mundo. Inicie ou expanda sua
              coleção com garantia de autenticidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-base h-14 px-8"
              >
                <Link to="/catalogo">
                  Explorar Catálogo <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-base h-14 px-8"
              >
                <Link to="/catalogo?cat=Moedas">Moedas do Império</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories (Circular) */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12">O que você procura?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              {
                title: 'Cédulas Nacionais',
                img: 'https://img.usecurling.com/p/300/300?q=brazil%20banknote',
                link: '/catalogo?cat=Cédulas&origin=Brasil',
              },
              {
                title: 'Moedas Raras',
                img: 'https://img.usecurling.com/p/300/300?q=rare%20gold%20coin',
                link: '/catalogo?cat=Moedas',
              },
              {
                title: 'Papel Moeda Estrangeiro',
                img: 'https://img.usecurling.com/p/300/300?q=international%20banknotes',
                link: '/catalogo?cat=Cédulas',
              },
              {
                title: 'Coleções Completas',
                img: 'https://img.usecurling.com/p/300/300?q=collection%20album',
                link: '/catalogo?cat=Coleções',
              },
            ].map((cat, i) => (
              <Link to={cat.link} key={i} className="group flex flex-col items-center">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-background shadow-lg group-hover:border-accent transition-all duration-300 group-hover:shadow-xl relative mb-4">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-serif font-bold text-lg group-hover:text-accent transition-colors">
                  {cat.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-accent font-bold uppercase text-xs tracking-wider flex items-center gap-2 mb-2">
                <Star className="w-4 h-4" /> Destaques
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Peças Exclusivas</h2>
            </div>
            <Button variant="link" asChild className="hidden md:flex text-primary">
              <Link to="/catalogo">
                Ver todos <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link to="/catalogo">Ver todos os destaques</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Institutional Banner */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://img.usecurling.com/p/800/800?q=pattern&color=black')] mix-blend-overlay pointer-events-none"></div>
            <div className="p-10 md:p-16 flex flex-col justify-center w-full md:w-1/2 relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Avaliamos sua coleção
              </h2>
              <p className="text-primary-foreground/80 mb-8 font-light text-lg">
                Possui itens numismáticos guardados? Nossa equipe de especialistas oferece avaliação
                profissional e compramos sua coleção com pagamento à vista.
              </p>
              <Button
                variant="outline"
                className="self-start bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground text-base px-8"
              >
                Falar com Especialista
              </Button>
            </div>
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-muted">
              <img
                src="https://img.usecurling.com/p/800/600?q=magnifying%20glass%20coin&color=gray"
                alt="Avaliação Numismática"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
