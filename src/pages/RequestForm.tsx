import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useReimbursementStore from '@/stores/useReimbursementStore'
import useMasterDataStore from '@/stores/useMasterDataStore'
import useAuthStore from '@/stores/useAuthStore'
import { ReimbursementRequest, Signature } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RequestHeader } from '@/components/requests/RequestHeader'
import { ExpenseDetails } from '@/components/requests/ExpenseDetails'
import { Attachments } from '@/components/requests/Attachments'
import { ApprovalSection } from '@/components/requests/ApprovalSection'
import { CashPaymentDetails } from '@/components/requests/CashPaymentDetails'
import { PrintTemplate } from '@/components/requests/PrintTemplate'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Save, Printer, ArrowLeft, Send, RotateCcw } from 'lucide-react'

export default function RequestForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { requests, addRequest, updateRequest } = useReimbursementStore()
  const { costCenters, events } = useMasterDataStore()
  const { user, updateProfile } = useAuthStore()

  const isNew = id === 'new'
  const existing = requests.find((r) => r.id === id)

  const [formData, setFormData] = useState<Partial<ReimbursementRequest>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true
    const initNew = async () => {
      if (!isNew || !user || formData.id) return

      const currentYear = new Date().getFullYear().toString()
      let newId = `${currentYear}-0001`

      try {
        // @ts-expect-error - get_next_request_id is defined in migrations but not yet typed
        const { data: nextId, error } = await supabase.rpc('get_next_request_id', {
          req_year: currentYear,
        })
        if (!error && nextId) {
          newId = nextId
        }
      } catch (err) {
        console.error('Error fetching next ID', err)
      }

      if (!isMounted) return
      const initialRequesterDetails = user.role === 'kiosk' ? { role: 'kiosk' } : user

      setFormData({
        id: newId,
        status: 'Pending',
        requesterId: user.id,
        requesterDetails: initialRequesterDetails as any,
        expenses: [],
        attachments: [],
        signature: '',
        date: new Date().toISOString().split('T')[0],
        history: [
          {
            id: `h-${Date.now()}`,
            date: new Date().toISOString(),
            action: 'Created',
            userId: user.name || 'Requester',
          },
        ],
      })
    }

    if (isNew) {
      initNew()
    } else if (existing && !formData.id) {
      setFormData(existing)
    }

    return () => {
      isMounted = false
    }
  }, [isNew, existing, user, formData.id])

  if (!formData.id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4a8ebf]"></div>
      </div>
    )
  }

  const isPostCO = formData.status === 'Approved' || formData.status === 'Processed'
  const isRequesterEditing =
    (user?.role === 'requester' || user?.role === 'kiosk') &&
    (isNew || formData.status === 'Rejected')
  const isQcEditing = user?.role === 'qc' && !isPostCO
  const readOnly = (!isRequesterEditing && !isQcEditing) || isPostCO

  const handleSave = async () => {
    if (!formData.eventId) {
      toast({
        title: 'Validation Error',
        description: 'Event is mandatory.',
        variant: 'destructive',
      })
      return
    }
    if (!formData.expenses || formData.expenses.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one Expense detail is mandatory.',
        variant: 'destructive',
      })
      return
    }
    const validAttachments = formData.attachments?.filter((a) => a.fileName) || []
    if (validAttachments.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one Attachment file is mandatory.',
        variant: 'destructive',
      })
      return
    }
    if (!formData.signature || formData.signature.trim() === '') {
      toast({
        title: 'Validation Error',
        description: 'Signature is mandatory.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      const isResubmission = !isNew && formData.status === 'Rejected'

      const totalAmount =
        formData.expenses?.reduce((sum, e) => sum + (Number(e.amount) || 0), 0) || 0
      const totalAmountEuros =
        formData.expenses?.reduce((sum, e) => sum + (Number(e.amountEuros) || 0), 0) || 0

      const reqCc =
        formData.costCenter || events.find((e) => e.id === formData.eventId)?.cost_center
      const ccData = costCenters.find((c) => c.code === reqCc || c.id === reqCc)
      const costCenterId = ccData?.id || null

      const payload = {
        ...formData,
        totalAmount,
        totalAmountEuros,
        costCenterId,
        paymentMethod: formData.paymentMethod || 'Bank Transfer',
      } as ReimbursementRequest

      if (isNew) {
        try {
          // Re-calculate ID at submit time to prevent concurrent conflicts
          const currentYear = new Date().getFullYear().toString()
          // @ts-expect-error - get_next_request_id is defined in migrations but not yet typed
          const { data: nextId, error } = await supabase.rpc('get_next_request_id', {
            req_year: currentYear,
          })
          if (!error && nextId) {
            payload.id = nextId
          }

          await addRequest(payload)
          if (user?.role === 'requester' && payload.requesterDetails) {
            await updateProfile(user.id, payload.requesterDetails)
          }

          try {
            await supabase.from('workflow_events').insert({
              request_id: payload.id,
              event_type: 'REQUEST_CREATED',
              rejection_reason: null,
            })
          } catch (err) {
            console.error('Failed to log workflow event:', err)
          }
          toast({ title: 'Request Submitted Successfully' })
          navigate('/requests')
        } catch (err: any) {
          toast({
            title: 'Error saving request',
            description: err.message || 'Unknown error',
            variant: 'destructive',
          })
        }
      } else if (isResubmission) {
        try {
          if (user?.role === 'requester' && payload.requesterDetails) {
            await updateProfile(user.id, payload.requesterDetails)
          }
          await updateRequest(payload.id!, {
            ...payload,
            status: 'Pending',
            qcSignature: null,
            history: [
              ...(payload.history || []),
              {
                id: `h-${Date.now()}`,
                date: new Date().toISOString(),
                action: 'Resubmitted',
                userId: user?.name || '',
              },
            ],
          })
          try {
            await supabase.from('workflow_events').insert({
              request_id: payload.id,
              event_type: 'REQUEST_CREATED',
              rejection_reason: null,
            })
          } catch (err) {
            console.error('Failed to log workflow event:', err)
          }
          toast({ title: 'Request Resubmitted for Review' })
          navigate('/requests')
        } catch (err: any) {
          toast({
            title: 'Error resubmitting request',
            description: err.message || 'Unknown error',
            variant: 'destructive',
          })
        }
      } else {
        try {
          await updateRequest(payload.id!, payload)
          toast({ title: 'Request Updated' })
          navigate('/requests')
        } catch (err: any) {
          toast({
            title: 'Error updating request',
            description: err.message || 'Unknown error',
            variant: 'destructive',
          })
        }
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleAction = async (
    action: 'approve' | 'reject' | 'upload_receipt',
    comments: string,
    receipt?: string,
    paymentMethod?: string,
  ) => {
    setIsSaving(true)
    try {
      const isCash = formData.paymentMethod === 'Cash'
      const isQcProcessingCash = user?.role === 'qc' && formData.status === 'Approved' && isCash
      const isQcUploadingReceipt = user?.role === 'qc' && formData.status === 'Processed' && isCash

      if (action === 'upload_receipt') {
        const totalAmount =
          formData.expenses?.reduce((sum, e) => sum + (Number(e.amount) || 0), 0) || 0
        const totalAmountEuros =
          formData.expenses?.reduce((sum, e) => sum + (Number(e.amountEuros) || 0), 0) || 0

        await updateRequest(formData.id!, {
          ...formData,
          paymentReceipt: receipt,
          totalAmount,
          totalAmountEuros,
          history: [
            ...(formData.history || []),
            {
              id: `h-${Date.now()}`,
              date: new Date().toISOString(),
              action: 'Receipt Uploaded',
              userId: user?.name || (isQcUploadingReceipt ? 'QC' : 'Finance'),
              comments: 'Additional payment proof attached.',
            },
          ],
        })
        toast({ title: 'Payment Receipt Uploaded' })
        navigate('/requests')
        return
      }

      if (action === 'reject' && !comments) {
        toast({ title: 'Rejection reason is required', variant: 'destructive' })
        setIsSaving(false)
        return
      }

      const signature: Signature = {
        name: user?.name || '',
        date: new Date().toISOString(),
        role: user?.role || '',
      }

      let newStatus = formData.status
      let historyAction = action === 'approve' ? 'Approved' : 'Rejected'
      const updates: Partial<ReimbursementRequest> = {}

      if (user?.role === 'qc' && !isQcProcessingCash) {
        if (action === 'approve') {
          newStatus = 'Checked'
          historyAction = 'Reviewed'
          updates.qcSignature = signature
          if (paymentMethod) updates.paymentMethod = paymentMethod as any
        } else {
          newStatus = 'Rejected'
          updates.qcSignature = null
          updates.qcRejectionReason = comments
        }
      } else if (user?.role === 'co') {
        if (action === 'approve') {
          newStatus = 'Approved'
          historyAction = 'Approved'
          updates.coSignature = signature
        } else {
          newStatus = 'Rejected'
          updates.qcSignature = null
          updates.coSignature = null
          updates.coRejectionReason = comments
        }
      } else if (user?.role === 'finance' || isQcProcessingCash) {
        if (action === 'approve') {
          newStatus = 'Processed'
          historyAction = 'Processed'
          updates.financeSignature = signature
          if (receipt) updates.paymentReceipt = receipt
        } else {
          newStatus = 'Rejected'
          updates.coSignature = null
          updates.financeSignature = null
        }
      }

      const newHistory = [
        ...(formData.history || []),
        {
          id: `h-${Date.now()}`,
          date: new Date().toISOString(),
          action: historyAction,
          userId: user?.name || '',
          comments,
        },
      ]

      const totalAmount =
        formData.expenses?.reduce((sum, e) => sum + (Number(e.amount) || 0), 0) || 0
      const totalAmountEuros =
        formData.expenses?.reduce((sum, e) => sum + (Number(e.amountEuros) || 0), 0) || 0

      const reqCc =
        formData.costCenter || events.find((e) => e.id === formData.eventId)?.cost_center
      const ccData = costCenters.find((c) => c.code === reqCc || c.id === reqCc)
      const costCenterId = ccData?.id || null

      const fullPayload = {
        ...formData,
        costCenterId,
        ...updates,
        status: newStatus as any,
        history: newHistory,
        totalAmount,
        totalAmountEuros,
      }

      try {
        await updateRequest(formData.id!, fullPayload)
        toast({ title: `Request ${newStatus}` })

        let eventType = ''
        if (action === 'approve') {
          if (user?.role === 'qc') eventType = 'QC_APPROVED'
          else if (user?.role === 'co') eventType = 'CO_APPROVED'
        } else if (action === 'reject') {
          if (user?.role === 'qc') eventType = 'QC_REJECTED'
          else if (user?.role === 'co') eventType = 'CO_REJECTED'
        }

        if (eventType) {
          try {
            await supabase.from('workflow_events').insert({
              request_id: formData.id,
              event_type: eventType,
              rejection_reason: action === 'reject' ? comments : null,
            })
          } catch (err) {
            console.error('Failed to log workflow event:', err)
          }
        }

        navigate('/requests')
      } catch (err: any) {
        toast({
          title: 'Error processing action',
          description: err.message || 'Unknown error',
          variant: 'destructive',
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto pb-20 animate-fade-in-up print:hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#4a8ebf]">Reimbursement Request</h1>
            {formData.id && (
              <p className="text-muted-foreground mt-1 text-sm">
                Request ID: <span className="font-medium text-foreground">{formData.id}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="bg-background">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
          <div className="flex gap-3 w-full sm:w-auto">
            {!isNew && (
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 sm:flex-none bg-background text-[#4a8ebf] border-[#4a8ebf]"
              >
                <Printer className="w-4 h-4 mr-2" /> Print PDF
              </Button>
            )}
            {!readOnly && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold px-6"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : isNew ? (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Submit Request
                  </>
                ) : formData.status === 'Rejected' ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" /> Resubmit Request
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader
            className={`text-white py-4 ${formData.status === 'Rejected' ? 'bg-destructive' : 'bg-[#4a8ebf]'}`}
          >
            <CardTitle className="text-xl tracking-wide flex items-center gap-3">
              Request Details
              {formData.status === 'Rejected' && (
                <span className="text-sm bg-white/20 px-2 py-0.5 rounded ml-auto">REJECTED</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-10 space-y-8 bg-card">
            <RequestHeader
              formData={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
              readOnly={readOnly}
            />

            <ExpenseDetails
              formData={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
              readOnly={readOnly}
            />

            <Attachments
              formData={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
              readOnly={readOnly}
            />

            <div className="space-y-6 pt-6 border-t border-border">
              <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Requester Signature</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase">Signature</Label>
                  <Input
                    disabled={!isRequesterEditing}
                    value={formData.signature || ''}
                    onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                    className="font-script text-6xl h-24 bg-muted/10 py-2"
                    placeholder="Type your full name as signature"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase">Date</Label>
                  <Input
                    disabled
                    type="date"
                    value={formData.date || ''}
                    className="h-16 bg-muted/30"
                  />
                </div>
              </div>
            </div>

            {formData.paymentMethod === 'Cash' && (
              <CashPaymentDetails
                formData={formData}
                onChange={(data) => setFormData({ ...formData, ...data })}
                readOnly={!(user?.role === 'qc' && formData.status !== 'Processed')}
              />
            )}

            <ApprovalSection formData={formData} onAction={handleAction} />
          </CardContent>
        </Card>

        {!isNew && (
          <Card className="border-border shadow-sm mt-10">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="text-lg text-[#4a8ebf]">Audit History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {formData.history?.map((h, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-6 p-4 text-sm hover:bg-muted/20 transition-colors"
                  >
                    <div className="w-48 text-muted-foreground font-mono text-xs">
                      {new Date(h.date).toLocaleString()}
                    </div>
                    <div className="w-40 font-bold">
                      <span
                        className={`px-2 py-1 rounded-md ${h.action === 'Rejected' ? 'bg-destructive/10 text-destructive' : h.action === 'Processed' ? 'bg-success/10 text-success' : 'bg-[#4a8ebf]/10 text-[#4a8ebf]'}`}
                      >
                        {h.action}
                      </span>
                    </div>
                    <div className="w-40 text-muted-foreground truncate">{h.userId}</div>
                    <div className="flex-1 text-muted-foreground">
                      {h.comments || 'System update'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <PrintTemplate formData={formData} />
    </>
  )
}
