import { useEffect } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, FileText, Database, LogOut, Globe } from 'lucide-react'
import useAuthStore from '@/stores/useAuthStore'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

export default function Layout() {
  const { user, lang, setLang, logout } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('requests'), path: '/requests', icon: FileText },
  ]

  if (user.role === 'requester') {
    navItems.push({ name: t('profile'), path: '/profile', icon: User })
  }
  if (user.role === 'admin') {
    navItems.push({ name: t('masterData'), path: '/master-data', icon: Database })
  }

  return (
    <SidebarProvider>
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="flex min-h-screen w-full bg-background font-sans"
      >
        <Sidebar>
          <div className="p-6 font-serif font-bold text-2xl border-b border-border text-[#4a8ebf]">
            {lang === 'en' ? 'Reimbursements' : 'نظام الاسترداد'}
          </div>
          <SidebarContent className="p-4 gap-2 mt-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith(item.path)}
                    className="text-md py-5"
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6 gap-4 shrink-0 shadow-sm">
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground mr-auto lg:mr-0">
              <span className="bg-[#4a8ebf]/10 text-[#4a8ebf] px-3 py-1 rounded-md capitalize font-bold">
                {user.role}
              </span>
              <span className="hidden sm:inline-block">{user.name}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              title="Toggle Language"
            >
              <Globe className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-muted/20">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
