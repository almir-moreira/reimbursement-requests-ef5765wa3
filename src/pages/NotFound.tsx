import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-serif font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Peça Não Encontrada</h2>
        <p className="text-muted-foreground mb-8">
          Parece que esta página se perdeu na história. Não conseguimos encontrar o que você estava
          procurando.
        </p>
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/">Voltar para a Coleção</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
