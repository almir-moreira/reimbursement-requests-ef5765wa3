import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product, mockProducts, ItemCategory } from '@/lib/mock-data'

export interface AdminUser {
  id: string
  name: string
  email: string
  registrationDate: string
  isActive: boolean
}

export type OrderStatus = 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled'

export interface AdminOrder {
  id: string
  customerName: string
  date: string
  total: number
  status: OrderStatus
  trackingCode?: string
}

interface AdminContextData {
  products: Product[]
  users: AdminUser[]
  orders: AdminOrder[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleUserStatus: (id: string) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updateOrderTracking: (id: string, trackingCode: string) => void
}

const initialUsers: AdminUser[] = [
  {
    id: 'u1',
    name: 'João Silva',
    email: 'joao@email.com',
    registrationDate: '2024-01-15',
    isActive: true,
  },
  {
    id: 'u2',
    name: 'Maria Souza',
    email: 'maria@email.com',
    registrationDate: '2024-02-20',
    isActive: true,
  },
  {
    id: 'u3',
    name: 'Carlos Santos',
    email: 'carlos@email.com',
    registrationDate: '2024-03-05',
    isActive: false,
  },
]

const initialOrders: AdminOrder[] = [
  {
    id: 'ORD-1001',
    customerName: 'João Silva',
    date: '2024-03-10',
    total: 450.0,
    status: 'Processing',
  },
  {
    id: 'ORD-1002',
    customerName: 'Ana Oliveira',
    date: '2024-03-12',
    total: 120.0,
    status: 'Pending',
  },
  {
    id: 'ORD-1003',
    customerName: 'Pedro Costa',
    date: '2024-03-15',
    total: 890.0,
    status: 'Delivered',
    trackingCode: 'BR123456789XP',
  },
]

const AdminContext = createContext<AdminContextData | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders)

  const addProduct = (prod: Omit<Product, 'id'>) => {
    setProducts([{ ...prod, id: `p${Date.now()}` }, ...products])
  }

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const toggleUserStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)))
  }

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const updateOrderTracking = (id: string, trackingCode: string) => {
    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, trackingCode, status: trackingCode ? 'Shipped' : o.status } : o,
      ),
    )
  }

  return (
    <AdminContext.Provider
      value={{
        products,
        users,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleUserStatus,
        updateOrderStatus,
        updateOrderTracking,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export default function useAdminStore() {
  const context = useContext(AdminContext)
  if (!context) throw new Error('useAdminStore must be used within AdminProvider')
  return context
}
