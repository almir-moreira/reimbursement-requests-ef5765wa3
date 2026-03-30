import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ReimbursementRequest, User } from '@/types'
import { supabase } from '@/lib/supabase'

interface ReimbursementContextData {
  requests: ReimbursementRequest[]
  addRequest: (req: ReimbursementRequest) => Promise<void>
  updateRequest: (id: string, req: Partial<ReimbursementRequest>) => Promise<void>
}

const ReimbursementContext = createContext<ReimbursementContextData | undefined>(undefined)

const getUsers = (): User[] => {
  try {
    const saved = localStorage.getItem('auth_users_list_v3')
    if (saved) return JSON.parse(saved)
  } catch {
    /* ignore */
  }
  return []
}

export function ReimbursementProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ReimbursementRequest[]>(() => {
    try {
      const saved = localStorage.getItem('reimbursement_requests_v2')
      if (saved) {
        const parsed = JSON.parse(saved) as ReimbursementRequest[]
        const users = getUsers()

        return parsed.map((req) => {
          if (req.history) {
            req.history = req.history.map((h) => {
              if (h.action === 'Approved') {
                const u = users.find((user) => user.id === h.userId)
                if (u?.role === 'finance' || h.userId === 'u-4') {
                  return { ...h, action: 'Processed' }
                }
              }
              return h
            })
          }
          return req
        })
      }
    } catch {
      /* ignore */
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('reimbursement_requests_v2', JSON.stringify(requests))
  }, [requests])

  const addRequest = async (req: ReimbursementRequest) => {
    try {
      await supabase.from('requests').insert([req])
    } catch {
      /* ignore */
    }
    setRequests((prev) => [req, ...prev])
  }

  const updateRequest = async (id: string, req: Partial<ReimbursementRequest>) => {
    try {
      await supabase.from('requests').update(req).eq('id', id)
    } catch {
      /* ignore */
    }
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...req }
          if (updated.history) {
            const users = getUsers()
            updated.history = updated.history.map((h) => {
              if (h.action === 'Approved') {
                const u = users.find((user) => user.id === h.userId)
                if (u?.role === 'finance' || h.userId === 'u-4') {
                  return { ...h, action: 'Processed' }
                }
              }
              return h
            })
          }
          return updated
        }
        return r
      }),
    )
  }

  return (
    <ReimbursementContext.Provider value={{ requests, addRequest, updateRequest }}>
      {children}
    </ReimbursementContext.Provider>
  )
}

export default function useReimbursementStore() {
  const context = useContext(ReimbursementContext)
  if (!context) throw new Error('useReimbursementStore must be used within ReimbursementProvider')
  return context
}
