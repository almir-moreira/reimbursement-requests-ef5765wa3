import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useReimbursementStore from '@/stores/useReimbursementStore'
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
import { PrintTemplate } from '@/components/requests/PrintTemplate'
import { toast } from '@/hooks/use-toast'
import { sendEmail } from '@/lib/smtp'
import { Save, Printer, ArrowLeft, Send } from 'lucide-react'

export default function RequestForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { requests, addRequest, updateRequest } = useReimbursementStore()
  const { user } = useAuthStore()

  const isNew = id === 'new'
  const existing = requests.find((r) => r.id === id)

  const [formData, setFormData] = useState<Partial<ReimbursementRequest>>({})

  useEffect(() => {
    if (isNew && user) {
      setFormData({
        id: `REQ-${Math.floor(Math.random() * 10000)}`,
        status: 'Pending',
        requesterId: user.id,
        requesterDetails: user,
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
    } else if (existing) {
      setFormData(existing)
    }
  }, [isNew, existing, user])

  if (!formData.id) return null

  // Editing is allowed only when new or for QC when pending
  const isEditingAllowed = isNew || (user?.role === 'qc' && formData.status === 'Pending')
  const readOnly = !isEditingAllowed

  const handleSave = async () => {
    if (isNew) {
      addRequest(formData as ReimbursementRequest)
      await sendEmail({
        to: 'qc@kaiciid.org',
        subject: `New Reimbursement Request Submitted - ${formData.id}`,
        body: `A new reimbursement request has been submitted by ${user?.name}. Please log in to review it.`,
      })
      toast({ title: 'Request Submitted Successfully' })
    } else {
      updateRequest(formData.id!, formData)
      toast({ title: 'Request Updated' })
    }
    navigate('/requests')
  }

  const handleAction = async (status: string, comments: string, receipt?: string) => {
    if (status === 'Rejected' && !comments) {
      toast({ title: 'Rejection reason is required', variant: 'destructive' })
      return
    }

    const signature: Signature = {
      name: user?.name || '',
      date: new Date().toISOString(),
      role: user?.role || '',
    }

    const updates: Partial<ReimbursementRequest> = {
      status: status as any,
      history: [
        ...(formData.history || []),
        {
          id: `h-${Date.now()}`,
          date: new Date().toISOString(),
          action: status,
          userId: user?.name || '',
          comments,
        },
      ],
    }

    if (status === 'Checked' && user?.role === 'qc') updates.qcSignature = signature
    if (status === 'Approved' && user?.role === 'co') updates.coSignature = signature
    if (status === 'Paid' && user?.role === 'finance') {
      updates.financeSignature = signature
      updates.paymentReceipt = receipt
    }

    updateRequest(formData.id!, updates)
    toast({ title: `Request ${status}` })

    // SMTP Triggers based on status
    const reqEmail = formData.requesterDetails?.email || 'requester@example.com'
    if (status === 'Rejected') {
      await sendEmail({
        to: reqEmail,
        subject: `Reimbursement Request Rejected: ${formData.id}`,
        body: `Your reimbursement request ${formData.id} was rejected by ${user?.role}. Reason: ${comments}`,
      })
    } else if (status === 'Paid') {
      await sendEmail({
        to: reqEmail,
        subject: `Reimbursement Request Paid: ${formData.id}`,
        body: `Your reimbursement request ${formData.id} has been processed and paid. Payment Reference: ${receipt || 'N/A'}`,
      })
    }

    navigate('/requests')
  }

  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto pb-20 animate-fade-in-up print:hidden">
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
                className="flex-1 sm:flex-none bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold px-6"
              >
                {isNew ? <Send className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {isNew ? 'Submit Request' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>

        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader
            className={`text-white py-4 ${formData.status === 'Rejected' ? 'bg-destructive' : 'bg-[#4a8ebf]'}`}
          >
            <CardTitle className="text-xl tracking-wide flex items-center gap-3">
              Reimbursement Request Form{' '}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">
                  Requester Signature
                </Label>
                <Input
                  disabled={readOnly}
                  value={formData.signature || ''}
                  onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                  className="font-serif italic text-lg h-12 bg-muted/10"
                  placeholder="Type your full name as signature"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">Date</Label>
                <Input
                  disabled
                  type="date"
                  value={formData.date || ''}
                  className="h-12 bg-muted/30"
                />
              </div>
            </div>

            <Attachments
              formData={formData}
              onChange={(data) => setFormData({ ...formData, ...data })}
              readOnly={readOnly}
            />

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
                        className={`px-2 py-1 rounded-md ${h.action === 'Rejected' ? 'bg-destructive/10 text-destructive' : 'bg-[#4a8ebf]/10 text-[#4a8ebf]'}`}
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

      {/* Hidden layout for PDF printing */}
      <PrintTemplate formData={formData} />
    </>
  )
}
