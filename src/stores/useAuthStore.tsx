import { createContext, useContext, useState, ReactNode } from 'react'
import { User, Role } from '@/types'

interface AuthContextData {
  user: User | null
  lang: 'en' | 'ar'
  setLang: (lang: 'en' | 'ar') => void
  login: (email: string, role: Role) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [lang, setLang] = useState<'en' | 'ar'>('en')

  const login = (email: string, role: Role) => {
    setUser({
      id: `usr-${Date.now()}`,
      name: email.split('@')[0] || 'John Doe',
      email,
      role,
      country: 'Kenya',
      city: 'Nairobi',
      state: 'Central',
      zipCode: '11111',
      phone: '212444555888',
      organization: 'African Union',
      address: 'Martin Luther King Av 1000',
      bankHolder: 'John Doe',
      bankName: 'Citybank',
      bankAccount: '929-0029-0989',
      iban: 'KN999000888777666',
      swift: 'KN1234556',
      bic: '999888777',
      bankCode: '99910',
      bankCountry: 'Portugal',
    })
  }

  const logout = () => setUser(null)

  const updateUser = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data })
  }

  return (
    <AuthContext.Provider value={{ user, lang, setLang, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuthStore() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthStore must be used within AuthProvider')
  return context
}
