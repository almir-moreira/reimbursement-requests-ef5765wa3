import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'
import { sendEmail } from '@/lib/smtp'
import { supabase } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

interface AuthContextData {
  user: User | null
  lang: 'en' | 'ar'
  setLang: (lang: 'en' | 'ar') => void
  users: User[]
  login: (email: string, password?: string) => Promise<boolean>
  register: (email: string, name: string, password?: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (id: string, data: Partial<User>) => Promise<void>
  adminAddUser: (data: Partial<User>) => void
  adminDeleteUser: (id: string) => void
  updatePassword: (email: string, newPassword: string) => boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [lang, setLang] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession)
      if (!currentSession?.user) {
        setUser(null)
        setLoading(false)
      } else {
        fetchProfile(currentSession.user.id)
      }
    })

    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession)
      if (initSession?.user) {
        fetchProfile(initSession.user.id)
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setUser(data as User)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (
      user?.role === 'admin' ||
      user?.role === 'qc' ||
      user?.role === 'co' ||
      user?.role === 'finance'
    ) {
      supabase
        .from('profiles')
        .select('*')
        .then(({ data }) => {
          if (data) setUsers(data as User[])
        })
    } else if (user) {
      setUsers([user])
    }
  }, [user])

  const login = async (email: string, password?: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'default',
      })
      if (!error && data.user) {
        return true
      }
    } catch (error) {
      console.error('Supabase login error:', error)
    }
    return false
  }

  const register = async (email: string, name: string, password?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || 'default',
        options: { data: { name } },
      })
      if (error) throw error

      if (data.user) {
        await supabase.from('profiles').insert([
          {
            id: data.user.id,
            email,
            name,
            role: 'requester',
          },
        ])
      }

      await sendEmail({
        to: email,
        subject: 'Welcome to KAICIID Reimbursement Requests',
        body: `Hi ${name},\n\nPlease confirm your email address to access the application.`,
      })
    } catch (error) {
      console.error('Supabase register error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Supabase logout error:', error)
    }
    setUser(null)
  }

  const updateProfile = async (id: string, data: Partial<User>) => {
    try {
      const allowedFields = [
        'name',
        'email',
        'role',
        'city',
        'bankName',
        'country',
        'address',
        'zipCode',
        'phone',
        'bankHolder',
        'iban',
        'swift',
        'bankCode',
        'organization',
        'state',
        'bankAccount',
        'bic',
      ]
      const updateData: any = {}
      Object.keys(data).forEach((key) => {
        if (allowedFields.includes(key)) {
          updateData[key] = data[key as keyof User]
        }
      })
      await supabase.from('profiles').update(updateData).eq('id', id)
      if (user?.id === id) {
        setUser({ ...user, ...data } as User)
      }
      setUsers((prev) => prev.map((u) => (u.id === id ? ({ ...u, ...data } as User) : u)))
    } catch (error) {
      console.error('Supabase updateProfile error:', error)
    }
  }

  const adminAddUser = async (data: Partial<User>) => {
    setUsers((prev) => [...prev, { ...data, id: `usr-${Date.now()}` } as User])
  }

  const adminDeleteUser = async (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const updatePassword = (email: string, newPassword: string) => {
    return false
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
        updatePassword,
        loading,
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
