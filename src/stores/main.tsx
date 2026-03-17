import React, { ReactNode } from 'react'
import { CartProvider } from './useCartStore'
import { AuthProvider } from './useAuthStore'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}
