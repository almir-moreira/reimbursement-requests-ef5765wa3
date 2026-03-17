import { ReimbursementRequest } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import useAuthStore from '@/stores/useAuthStore'
import { Check, X } from 'lucide-react'

interface Props {
  formData: Partial<ReimbursementRequest>
  onAction: (status: string, comments: string, paymentReceipt?: string) => void
}

export function ApprovalSection({ formData, onAction }: Props) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState('')
  const [receiptName, setReceiptName] = useState('')

  if (!user || user.role === 'requester') return null

  const canApprove =
    (user.role === 'qc' && formData.status === 'Pending') ||
    (user.role === 'co' && formData.status === 'Checked') ||
    (user.role === 'finance' && formData.status === 'Approved')

  return (
    <div className="space-y-6 pt-6 border-t border-border mt-10 bg-[#4a8ebf]/5 p-6 rounded-xl border border-[#4a8ebf]/20">
      <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Workflow Signatures</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {formData.qcSignature && (
          <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
            <h4 className="text-xs uppercase text-muted-foreground font-bold mb-1">
              Quality Control
            </h4>
            <p className="font-medium text-sm">{formData.qcSignature.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(formData.qcSignature.date).toLocaleString()}
            </p>
          </div>
        )}
        {formData.coSignature && (
          <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
            <h4 className="text-xs uppercase text-muted-foreground font-bold mb-1">
              Certifying Officer
            </h4>
            <p className="font-medium text-sm">{formData.coSignature.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(formData.coSignature.date).toLocaleString()}
            </p>
          </div>
        )}
        {formData.financeSignature && (
          <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
            <h4 className="text-xs uppercase text-muted-foreground font-bold mb-1">Finance Paid</h4>
            <p className="font-medium text-sm">{formData.financeSignature.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(formData.financeSignature.date).toLocaleString()}
            </p>
            {formData.paymentReceipt && (
              <p className="text-xs text-success mt-1 font-semibold">
                Receipt: {formData.paymentReceipt}
              </p>
            )}
          </div>
        )}
      </div>

      {canApprove && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Comments / Rejection Reason</Label>
            <Input
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={
                user.role === 'finance'
                  ? 'Payment Reference (optional)'
                  : 'Required if rejecting...'
              }
              className="bg-white max-w-xl"
            />
          </div>

          {user.role === 'finance' && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Upload Payment Receipt</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  onChange={(e) => setReceiptName(e.target.files?.[0]?.name || '')}
                  className="bg-white max-w-md file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4a8ebf]/10 file:text-[#4a8ebf] hover:file:bg-[#4a8ebf]/20 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4 border-t border-[#4a8ebf]/10">
            <Button
              onClick={() =>
                onAction(
                  user.role === 'qc' ? 'Checked' : user.role === 'co' ? 'Approved' : 'Paid',
                  comments,
                  receiptName,
                )
              }
              className="bg-success hover:bg-success/90 h-12 px-8 text-md font-bold text-white shadow-sm"
            >
              <Check className="w-5 h-5 mr-2" />
              {user.role === 'finance' ? 'Process Payment' : 'Approve Request'}
            </Button>
            <Button
              onClick={() => onAction('Rejected', comments)}
              variant="destructive"
              className="h-12 px-8 text-md font-bold shadow-sm"
            >
              <X className="w-5 h-5 mr-2" />
              Reject Request
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
