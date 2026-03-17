import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  name: string
  email: string
  address?: {
    cep: string
    street: string
    number: string
    complement: string
  }
}

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  login: (name: string, email: string) => void
  logout: () => void
  updateAddress: (address: User['address']) => void
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const login = (name: string, email: string) => {
    setUser({ name, email })
    setIsAuthModalOpen(false)
  }

  const logout = () => setUser(null)

  const updateAddress = (address: User['address']) => {
    if (user) setUser({ ...user, address })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateAddress,
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
