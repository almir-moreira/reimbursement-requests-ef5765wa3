import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Role } from '@/types'
import { sendEmail } from '@/lib/smtp'

interface AuthContextData {
  user: User | null
  lang: 'en' | 'ar'
  setLang: (lang: 'en' | 'ar') => void
  users: User[]
  login: (email: string, password?: string) => boolean
  register: (email: string, name: string, password?: string) => void
  logout: () => void
  updateProfile: (id: string, data: Partial<User>) => void
  adminAddUser: (data: Partial<User>) => void
  adminDeleteUser: (id: string) => void
}

const initialUsers: User[] = [
  {
    id: 'u-1',
    name: 'Admin User',
    email: 'admin@kaiciid.org',
    password: 'password',
    role: 'admin',
  },
  { id: 'u-2', name: 'Quality Control', email: 'qc@kaiciid.org', password: 'password', role: 'qc' },
  {
    id: 'u-3',
    name: 'Certifying Officer',
    email: 'co@kaiciid.org',
    password: 'password',
    role: 'co',
  },
  {
    id: 'u-4',
    name: 'Finance Dept',
    email: 'finance@kaiciid.org',
    password: 'password',
    role: 'finance',
  },
  {
    id: 'u-5',
    name: 'Dorna Khan',
    email: 'dorna@example.com',
    password: 'password',
    role: 'requester',
    city: 'Bristol',
    bankName: 'HSBC UK',
    country: 'UK',
    address: 'Flat 71 Hope Quay, Rope Walk',
    zipCode: 'BS1 6ZF',
    phone: '+447946609450',
    bankHolder: 'Dorna Khan',
    iban: '20547565/GB25HBUK40166420547565',
    swift: 'HBUKGB4196Y',
    bankCode: '40-16-64',
  },
]

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('auth_user_v3')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return null
  })

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('auth_users_list_v3')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return initialUsers
  })

  const [lang, setLang] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    if (user) localStorage.setItem('auth_user_v3', JSON.stringify(user))
    else localStorage.removeItem('auth_user_v3')
  }, [user])

  useEffect(() => {
    localStorage.setItem('auth_users_list_v3', JSON.stringify(users))
    // Sync current user if modified in users list
    if (user) {
      const updatedUser = users.find((u) => u.id === user.id)
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser)
      }
    }
  }, [users])

  const login = (email: string, password?: string) => {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && (!password || u.password === password),
    )
    if (found) {
      setUser(found)
      return true
    }
    return false
  }

  const register = async (email: string, name: string, password?: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      name,
      password,
      role: 'requester',
    }
    setUsers((prev) => [...prev, newUser])
    await sendEmail({
      to: email,
      subject: 'Welcome to KAICIID Reimbursement Portal',
      body: `Hi ${name},\n\nPlease confirm your email address to access the portal. You can now login with your credentials.`,
    })
  }

  const logout = () => setUser(null)

  const updateProfile = (id: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
  }

  const adminAddUser = (data: Partial<User>) => {
    setUsers((prev) => [...prev, { ...data, id: `usr-${Date.now()}` } as User])
  }

  const adminDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        lang,
        setLang,
        users,
        login,
        register,
        logout,
        updateProfile,
        adminAddUser,
        adminDeleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuthStore() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthStore must be used within AuthProvider')
  return context
}
