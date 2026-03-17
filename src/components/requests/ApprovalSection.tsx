import { ReimbursementRequest } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import useAuthStore from '@/stores/useAuthStore'
import { Check, X } from 'lucide-react'

interface Props {
  formData: Partial<ReimbursementRequest>
  onAction: (status: string, comments: string) => void
}

export function ApprovalSection({ formData, onAction }: Props) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState('')

  if (
    !user ||
    user.role === 'requester' ||
    formData.status === 'Paid' ||
    formData.status === 'Rejected'
  ) {
    return null
  }

  const canApprove =
    (user.role === 'qc' && formData.status === 'Pending') ||
    (user.role === 'co' && formData.status === 'Checked') ||
    (user.role === 'finance' && formData.status === 'Approved')

  if (!canApprove) return null

  return (
    <div className="space-y-6 pt-6 border-t border-border mt-10 bg-[#4a8ebf]/5 p-6 rounded-xl border border-[#4a8ebf]/20">
      <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Quality Check and Approval</h3>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Comments / Rejection Reason</Label>
        <Input
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Required if rejecting..."
          className="bg-white"
        />
      </div>

      <div className="flex gap-4 pt-4 border-t border-[#4a8ebf]/10">
        <Button
          onClick={() =>
            onAction(
              user.role === 'qc' ? 'Checked' : user.role === 'co' ? 'Approved' : 'Paid',
              comments,
            )
          }
          className="bg-success hover:bg-success/90 h-12 px-8 text-md font-bold"
        >
          <Check className="w-5 h-5 mr-2" />
          {user.role === 'finance' ? 'Process Payment' : 'Approve Request'}
        </Button>
        <Button
          onClick={() => onAction('Rejected', comments)}
          variant="destructive"
          className="h-12 px-8 text-md font-bold"
        >
          <X className="w-5 h-5 mr-2" />
          Reject Request
        </Button>
      </div>
    </div>
  )
}
