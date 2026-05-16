import { ReimbursementRequest } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import useAuthStore from '@/stores/useAuthStore'
import { Check, X, RotateCcw, Paperclip } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  formData: Partial<ReimbursementRequest>
  onAction: (
    action: 'approve' | 'reject' | 'upload_receipt',
    comments: string,
    paymentReceipt?: string,
    paymentMethod?: string,
  ) => void
}

export function ApprovalSection({ formData, onAction }: Props) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState('')
  const [receiptName, setReceiptName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<string>(
    formData.paymentMethod || 'Bank Transfer',
  )

  if (!user || user.role === 'requester' || user.role === 'admin') return null

  const isCash = formData.paymentMethod === 'Cash'
  const isQcProcessingCash = user.role === 'qc' && formData.status === 'Approved' && isCash
  const canEditPaymentMethod = user.role === 'qc' && formData.status === 'Pending'

  const canApprove =
    (user.role === 'qc' && formData.status === 'Pending') ||
    (user.role === 'co' && formData.status === 'Checked') ||
    (user.role === 'finance' && formData.status === 'Approved' && !isCash) ||
    isQcProcessingCash

  const canUploadReceipt =
    (user.role === 'finance' && formData.status === 'Processed' && !isCash) ||
    (user.role === 'qc' && formData.status === 'Processed' && isCash)

  return (
    <div className="space-y-6 pt-6 border-t border-border mt-10 bg-[#4a8ebf]/5 p-6 rounded-xl border border-[#4a8ebf]/20">
      <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Workflow Signatures</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg border shadow-sm ${formData.qcSignature ? 'bg-white border-border' : 'bg-muted/50 border-dashed border-border'}`}
        >
          <h4 className="text-xs uppercase text-muted-foreground font-bold mb-1">
            Quality Control
          </h4>
          {formData.qcSignature ? (
            <>
              <p className="font-medium text-sm">{formData.qcSignature.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(formData.qcSignature.date).toLocaleString()}
              </p>
            </>
          ) : formData.qcRejectionReason ? (
            <>
              <p className="text-xs font-bold text-destructive">Rejected</p>
              <p
                className="text-xs text-muted-foreground mt-1 line-clamp-2"
                title={formData.qcRejectionReason}
              >
                {formData.qcRejectionReason}
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground italic">Pending Review</p>
          )}
        </div>

        <div
          className={`p-4 rounded-lg border shadow-sm ${formData.coSignature ? 'bg-white border-border' : 'bg-muted/50 border-dashed border-border'}`}
        >
          <h4 className="text-xs uppercase text-muted-foreground font-bold mb-1">
            Certifying Officer
          </h4>
          {formData.coSignature ? (
            <>
              <p className="font-medium text-sm">{formData.coSignature.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(formData.coSignature.date).toLocaleString()}
              </p>
            </>
          ) : formData.coRejectionReason ? (
            <>
              <p className="text-xs font-bold text-destructive">Rejected</p>
              <p
                className="text-xs text-muted-foreground mt-1 line-clamp-2"
                title={formData.coRejectionReason}
              >
                {formData.coRejectionReason}
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground italic">Pending Approval</p>
          )}
        </div>

        <div
          className={`p-4 rounded-lg border shadow-sm ${formData.financeSignature ? 'bg-white border-border' : 'bg-muted/50 border-dashed border-border'}`}
        >
          <h4 className="text-xs uppercase text-muted-foreground font-bold mb-1">
            Payment Processed
          </h4>
          {formData.financeSignature ? (
            <>
              <p className="font-medium text-sm">{formData.financeSignature.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(formData.financeSignature.date).toLocaleString()}
              </p>
              {formData.paymentReceipt && (
                <p className="text-xs text-success mt-1 font-semibold">
                  Receipt: {formData.paymentReceipt}
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground italic">Pending Payment</p>
          )}
        </div>
      </div>

      {formData.paymentMethod && !canEditPaymentMethod && (
        <div className="mb-6 p-4 rounded-lg border shadow-sm bg-white border-border inline-block min-w-[200px]">
          <h4 className="text-xs uppercase text-muted-foreground font-bold mb-1">Payment Method</h4>
          <p className="font-medium text-sm">{formData.paymentMethod}</p>
        </div>
      )}

      {canApprove && (
        <div className="space-y-4">
          {canEditPaymentMethod && (
            <div className="space-y-2 mb-4">
              <Label className="text-sm font-semibold">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-white max-w-xl">
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Comments / Rejection Reason</Label>
            <Input
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Required if rejecting..."
              className="bg-white max-w-xl"
            />
          </div>

          {(user.role === 'finance' || isQcProcessingCash) && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Upload Payment Receipt (Optional)</Label>
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
              onClick={() => onAction('approve', comments, receiptName, paymentMethod)}
              className="bg-success hover:bg-success/90 h-12 px-8 text-md font-bold text-white shadow-sm"
            >
              <Check className="w-5 h-5 mr-2" />
              {user.role === 'finance' || isQcProcessingCash
                ? 'Process Payment'
                : 'Approve Request'}
            </Button>
            <Button
              onClick={() => onAction('reject', comments, undefined, paymentMethod)}
              variant="destructive"
              className="h-12 px-8 text-md font-bold shadow-sm"
            >
              {user.role === 'co' || user.role === 'finance' || isQcProcessingCash ? (
                <RotateCcw className="w-5 h-5 mr-2" />
              ) : (
                <X className="w-5 h-5 mr-2" />
              )}
              {user.role === 'co'
                ? 'Reject & Return to QC'
                : user.role === 'finance' || isQcProcessingCash
                  ? 'Reject Request'
                  : 'Reject to Requester'}
            </Button>
          </div>
        </div>
      )}

      {canUploadReceipt && (
        <div className="space-y-4 pt-4 border-t border-[#4a8ebf]/10">
          <Label className="text-sm font-semibold">Upload Additional Payment Proof</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              onChange={(e) => setReceiptName(e.target.files?.[0]?.name || '')}
              className="bg-white max-w-md file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4a8ebf]/10 file:text-[#4a8ebf] hover:file:bg-[#4a8ebf]/20 cursor-pointer"
            />
          </div>
          <Button
            onClick={() => onAction('upload_receipt', '', receiptName, paymentMethod)}
            className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold"
            disabled={!receiptName}
          >
            <Paperclip className="w-4 h-4 mr-2" /> Save Receipt
          </Button>
        </div>
      )}
    </div>
  )
}
