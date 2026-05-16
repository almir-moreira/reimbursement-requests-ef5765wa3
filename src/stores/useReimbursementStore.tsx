import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ReimbursementRequest } from '@/types'
import { supabase } from '@/lib/supabase/client'
import useAuthStore from './useAuthStore'

interface ReimbursementContextData {
  requests: ReimbursementRequest[]
  addRequest: (req: ReimbursementRequest) => Promise<void>
  updateRequest: (id: string, req: Partial<ReimbursementRequest>) => Promise<void>
  fetchRequests: () => Promise<void>
}

const ReimbursementContext = createContext<ReimbursementContextData | undefined>(undefined)

export function ReimbursementProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ReimbursementRequest[]>([])
  const { user } = useAuthStore()

  const fetchRequests = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) {
        setRequests(
          data.map(
            (d) =>
              ({
                ...d.data,
                id: d.id,
                status: d.status,
                eventId: d.event_id || d.data?.eventId,
                costCenterId: d.cost_center_id || d.data?.costCenterId,
                requesterId: d.requester_id || d.data?.requesterId,
                paymentMethod: d.payment_method || d.data?.paymentMethod,
                qcRejectionReason: d.qc_rejection_reason || d.data?.qcRejectionReason,
                coRejectionReason: d.co_rejection_reason || d.data?.coRejectionReason,
                createdAt: d.created_at || d.data?.createdAt,
                updatedAt: d.updated_at || d.data?.updatedAt,
              }) as ReimbursementRequest,
          ),
        )
      }
    } catch (error) {
      console.error('Fetch requests error:', error)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [user])

  const addRequest = async (req: ReimbursementRequest) => {
    try {
      const dbReq = {
        id: req.id,
        user_id: user?.id,
        requester_id: req.requesterId || user?.id,
        status: req.status,
        event_id: req.eventId || null,
        cost_center_id: req.costCenterId || null,
        payment_method: req.paymentMethod || null,
        qc_rejection_reason: req.qcRejectionReason || null,
        co_rejection_reason: req.coRejectionReason || null,
        data: req as any,
      }
      const { error } = await supabase.from('requests').insert([dbReq])
      if (error) throw error
      setRequests((prev) => [req, ...prev])
    } catch (error) {
      console.error('Add request error:', error)
      throw error
    }
  }

  const updateRequest = async (id: string, req: Partial<ReimbursementRequest>) => {
    try {
      const existing = requests.find((r) => r.id === id)
      if (!existing) throw new Error('Request not found')

      let newStatus = req.status || existing.status
      let eventType = null
      let rejectionReason = null

      if (
        user?.role === 'qc' &&
        (existing.status === 'PENDING_QC' || existing.status === 'Pending')
      ) {
        if (req.status === 'Checked' || req.status === 'PENDING_CO') {
          newStatus = 'PENDING_CO'
          eventType = 'QC_APPROVED'
        } else if (req.status === 'Rejected' || req.status === 'REJECTED_BY_QC') {
          if (!req.qcRejectionReason) {
            throw new Error('Rejection reason is required')
          }
          newStatus = 'REJECTED_BY_QC'
          eventType = 'QC_REJECTED'
          rejectionReason = req.qcRejectionReason
        }
      } else if (
        user?.role === 'co' &&
        (existing.status === 'PENDING_CO' || existing.status === 'Checked')
      ) {
        if (req.status === 'Approved' || req.status === 'APPROVED_BY_CO') {
          newStatus = 'APPROVED_BY_CO'
          eventType = 'CO_APPROVED'
        } else if (req.status === 'Rejected' || req.status === 'REJECTED_BY_CO') {
          const reason = req.coRejectionReason || req.qcRejectionReason
          if (!reason) {
            throw new Error('Rejection reason is required')
          }
          newStatus = 'REJECTED_BY_CO'
          eventType = 'CO_REJECTED'
          rejectionReason = reason
          req.coRejectionReason = reason
          delete req.qcRejectionReason
        }
      }

      const updatedReq = { ...existing, ...req, status: newStatus } as ReimbursementRequest

      const { error } = await supabase
        .from('requests')
        .update({
          status: updatedReq.status,
          requester_id: updatedReq.requesterId || undefined,
          event_id: updatedReq.eventId || null,
          cost_center_id: updatedReq.costCenterId || null,
          payment_method: updatedReq.paymentMethod || null,
          qc_rejection_reason: updatedReq.qcRejectionReason || null,
          co_rejection_reason: updatedReq.coRejectionReason || null,
          data: updatedReq as any,
        })
        .eq('id', id)

      if (error) throw error

      if (eventType) {
        await supabase.from('workflow_events').insert([
          {
            request_id: id,
            event_type: eventType,
            rejection_reason: rejectionReason,
          },
        ])
      }

      setRequests((prev) => prev.map((r) => (r.id === id ? updatedReq : r)))
    } catch (error) {
      console.error('Update request error:', error)
      throw error
    }
  }

  return (
    <ReimbursementContext.Provider value={{ requests, addRequest, updateRequest, fetchRequests }}>
      {children}
    </ReimbursementContext.Provider>
  )
}

export default function useReimbursementStore() {
  const context = useContext(ReimbursementContext)
  if (!context) throw new Error('useReimbursementStore must be used within ReimbursementProvider')
  return context
}
