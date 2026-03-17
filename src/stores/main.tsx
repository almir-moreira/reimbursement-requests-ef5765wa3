import React, { ReactNode } from 'react'
import { CartProvider } from './useCartStore'
import { AuthProvider } from './useAuthStore'
import { AdminProvider } from './useAdminStore'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>{children}</AdminProvider>
      </CartProvider>
    </AuthProvider>
  )
}
