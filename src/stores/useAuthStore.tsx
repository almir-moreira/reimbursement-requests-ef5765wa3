import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/lib/mock-data'

export interface OrderItem {
  product: Product
  quantity: number
}

export interface Address {
  cep: string
  street: string
  number: string
  complement: string
  city: string
  state: string
}

export interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
  shippingAddress?: Address
}

export interface User {
  name: string
  email: string
  address?: Address
  orders: Order[]
}

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  login: (name: string, email: string, address?: Address) => void
  logout: () => void
  updateAddress: (address: Address) => void
  addOrder: (order: Order) => void
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const login = (name: string, email: string, address?: Address) => {
    setUser({ name, email, address, orders: [] })
    setIsAuthModalOpen(false)
  }

  const logout = () => setUser(null)

  const updateAddress = (address: Address) => {
    if (user) setUser({ ...user, address })
  }

  const addOrder = (order: Order) => {
    if (user) setUser({ ...user, orders: [order, ...user.orders] })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateAddress,
        addOrder,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuthStore() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthStore must be used within a AuthProvider')
  return context
}
