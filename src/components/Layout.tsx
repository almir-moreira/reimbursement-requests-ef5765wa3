import { useEffect } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  User as UserIcon,
  FileText,
  Database,
  LogOut,
  Globe,
  BarChart,
  Settings,
} from 'lucide-react'
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
  SidebarTrigger,
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
    navItems.push({ name: t('profile'), path: '/profile', icon: UserIcon })
  }
  if (user.role === 'admin' || user.role === 'finance') {
    navItems.push({ name: t('reporting'), path: '/reporting', icon: BarChart })
  }
  if (user.role === 'admin' || user.role === 'finance' || user.role === 'qc') {
    navItems.push({ name: t('masterData'), path: '/master-data', icon: Database })
  }
  if (user.role === 'admin') {
    navItems.push({ name: t('smtpSettings'), path: '/settings/smtp', icon: Settings })
  }

  return (
    <SidebarProvider>
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="flex min-h-screen w-full bg-background font-sans"
      >
        <Sidebar>
          <div className="p-6 border-b border-border hidden md:block">
            <h1 className="font-bold text-2xl text-[#4a8ebf] uppercase tracking-wider mb-1">
              KAICIID
            </h1>
            <div className="font-serif font-semibold text-lg text-foreground/80">
              {lang === 'en' ? 'Reimbursement Requests' : 'طلبات الاسترداد'}
            </div>
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
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 gap-4 shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="flex flex-col md:hidden">
                <span className="font-bold text-lg text-[#4a8ebf] uppercase tracking-wider leading-none mb-1">
                  KAICIID
                </span>
                <span className="font-serif text-sm text-foreground/80 leading-tight">
                  Reimbursement Requests
                </span>
              </div>
              <div className="hidden md:flex flex-col ml-2">
                <span className="font-bold text-lg text-[#4a8ebf] uppercase tracking-wider leading-none mb-1">
                  KAICIID
                </span>
                <span className="font-serif text-sm text-foreground/80 leading-tight">
                  Reimbursement Requests
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground mr-auto lg:mr-0">
                <span className="bg-[#4a8ebf]/10 text-[#4a8ebf] px-3 py-1 rounded-md capitalize font-bold hidden sm:inline-block">
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
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-muted/20">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
