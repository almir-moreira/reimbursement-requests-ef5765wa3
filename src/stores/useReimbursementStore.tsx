import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ReimbursementRequest } from '@/types'

interface ReimbursementContextData {
  requests: ReimbursementRequest[]
  addRequest: (req: ReimbursementRequest) => void
  updateRequest: (id: string, req: Partial<ReimbursementRequest>) => void
}

const ReimbursementContext = createContext<ReimbursementContextData | undefined>(undefined)

export function ReimbursementProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ReimbursementRequest[]>(() => {
    try {
      const saved = localStorage.getItem('reimbursement_requests_v2')
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  })

  useEffect(() => {
    localStorage.setItem('reimbursement_requests_v2', JSON.stringify(requests))
  }, [requests])

  const addRequest = (req: ReimbursementRequest) => {
    setRequests((prev) => [req, ...prev])
  }

  const updateRequest = (id: string, req: Partial<ReimbursementRequest>) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...req } : r)))
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
