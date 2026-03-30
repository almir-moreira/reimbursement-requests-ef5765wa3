import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ReimbursementRequest, User } from '@/types'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface ReimbursementContextData {
  requests: ReimbursementRequest[]
  addRequest: (req: ReimbursementRequest) => Promise<void>
  updateRequest: (id: string, req: Partial<ReimbursementRequest>) => Promise<void>
}

const ReimbursementContext = createContext<ReimbursementContextData | undefined>(undefined)

export function ReimbursementProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ReimbursementRequest[]>(() => {
    try {
      const saved = localStorage.getItem('reimbursement_requests_v2')
      if (saved) {
        return JSON.parse(saved) as ReimbursementRequest[]
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
    if (isSupabaseConfigured) {
      try {
        await supabase.from('requests').insert([req])
      } catch (error) {
        console.error('Supabase fetch error:', error)
      }
    }
    setRequests((prev) => [req, ...prev])
  }

  const updateRequest = async (id: string, req: Partial<ReimbursementRequest>) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('requests').update(req).eq('id', id)
      } catch (error) {
        console.error('Supabase fetch error:', error)
      }
    }
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, ...req }
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
