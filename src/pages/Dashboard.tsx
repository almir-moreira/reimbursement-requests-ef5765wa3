import { useState } from 'react'
import { LayoutDashboard, Package, Users, ShoppingCart, Settings } from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { OverviewTab } from '@/components/admin/OverviewTab'
import { ProductsTab } from '@/components/admin/ProductsTab'
import { UsersTab } from '@/components/admin/UsersTab'
import { OrdersTab } from '@/components/admin/OrdersTab'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <SidebarProvider className="w-full">
        <Sidebar
          className="border-r border-border h-[calc(100vh-4rem)] top-16 absolute z-10"
          collapsible="none"
        >
          <SidebarHeader className="p-4 border-b border-border">
            <h3 className="font-serif font-bold text-lg text-primary tracking-wide">
              Painel Admin
            </h3>
          </SidebarHeader>
          <SidebarContent className="p-2 gap-1 mt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                  className="font-medium"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Visão Geral</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'products'}
                  onClick={() => setActiveTab('products')}
                  className="font-medium"
                >
                  <Package className="w-5 h-5" />
                  <span>Catálogo de Produtos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'users'}
                  onClick={() => setActiveTab('users')}
                  className="font-medium"
                >
                  <Users className="w-5 h-5" />
                  <span>Clientes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'orders'}
                  onClick={() => setActiveTab('orders')}
                  className="font-medium"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Pedidos & Logística</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                  className="font-medium"
                >
                  <Settings className="w-5 h-5" />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-y-auto bg-muted/20">
          <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-primary">
                  Configurações do Sistema
                </h2>
                <div className="bg-card p-8 rounded-xl border border-border text-center text-muted-foreground shadow-sm">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>As configurações da plataforma estarão disponíveis em breve.</p>
                </div>
              </div>
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
