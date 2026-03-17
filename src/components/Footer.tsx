import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, Award, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-primary/20">
      <div className="container mx-auto px-4">
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <Award className="w-10 h-10 text-accent" />
            <div>
              <h4 className="font-serif font-bold text-lg">Autenticidade Garantida</h4>
              <p className="text-sm text-primary-foreground/70">
                Itens avaliados por especialistas.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-center">
            <ShieldCheck className="w-10 h-10 text-accent" />
            <div>
              <h4 className="font-serif font-bold text-lg">Compra Segura</h4>
              <p className="text-sm text-primary-foreground/70">
                Dados criptografados e sigilo total.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-end">
            <Truck className="w-10 h-10 text-accent" />
            <div>
              <h4 className="font-serif font-bold text-lg">Envio Rápido</h4>
              <p className="text-sm text-primary-foreground/70">
                Embalagem segura para todo o Brasil.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-sm">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="font-serif font-bold text-primary">ND</span>
              </div>
              <span className="font-serif font-bold text-xl tracking-tight">
                Numismática Digital
              </span>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              Sua plataforma premium para compra e venda de cédulas e moedas raras. História em suas
              mãos.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4 text-white">Catálogo</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <Link to="/catalogo?cat=Moedas" className="hover:text-accent transition-colors">
                  Moedas do Império
                </Link>
              </li>
              <li>
                <Link to="/catalogo?cat=Cédulas" className="hover:text-accent transition-colors">
                  Cédulas da República
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-accent transition-colors">
                  Papel Moeda Estrangeiro
                </Link>
              </li>
              <li>
                <Link to="/catalogo?novidades=true" className="hover:text-accent transition-colors">
                  Novidades
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-4 text-white">Ajuda & Suporte</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Como Comprar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Tabela de Conservação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Trocas e Devoluções
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-4 text-white">Pagamento</h4>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-semibold">PIX</div>
              <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-semibold">VISA</div>
              <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-semibold">
                MASTERCARD
              </div>
            </div>
            <h4 className="font-serif font-bold text-lg mt-6 mb-2 text-white">Segurança</h4>
            <div className="flex gap-2">
              <div className="bg-white/10 px-3 py-1 rounded text-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-success" /> SSL
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-primary-foreground/50 text-xs border-t border-white/10 pt-8">
          <p>© {new Date().getFullYear()} Numismática Digital. Todos os direitos reservados.</p>
          <p className="mt-1">CNPJ: 00.000.000/0001-00 | Rua Fictícia, 123 - São Paulo/SP</p>
        </div>
      </div>
    </footer>
  )
}
