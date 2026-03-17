import { ReimbursementRequest } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useMasterDataStore from '@/stores/useMasterDataStore'
import { useTranslation } from '@/lib/i18n'

interface Props {
  formData: Partial<ReimbursementRequest>
  onChange: (data: Partial<ReimbursementRequest>) => void
  readOnly: boolean
}

export function RequestHeader({ formData, onChange, readOnly }: Props) {
  const { events } = useMasterDataStore()
  const { t } = useTranslation()
  const reqUser = formData.requesterDetails || {}

  const handleEventChange = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    onChange({
      eventId,
      costCenter: event?.costCenter || '',
      account: event?.account || '',
      workorder: event?.workorder || '',
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase">Id</Label>
          <Input disabled value={formData.id || ''} className="bg-muted/50 font-mono text-xs" />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase">Status</Label>
          <Input disabled value={t(formData.status || '')} className="bg-muted/50 font-semibold" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-muted-foreground text-xs uppercase">Event</Label>
          <Select disabled={readOnly} value={formData.eventId} onValueChange={handleEventChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase">Account</Label>
          <Input
            disabled
            value={formData.account || ''}
            className="bg-muted/50 font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase">Workorder</Label>
          <Input
            disabled
            value={formData.workorder || ''}
            className="bg-muted/50 font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold border-b pb-2">Requester Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">Requester</Label>
            <Input disabled value={reqUser.name || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Email</Label>
            <Input disabled value={reqUser.email || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Organization</Label>
            <Input disabled value={reqUser.organization || ''} className="bg-muted/30" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">Address</Label>
            <Input disabled value={reqUser.address || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">City</Label>
            <Input disabled value={reqUser.city || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">State</Label>
            <Input disabled value={reqUser.state || ''} className="bg-muted/30" />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">ZIP Code</Label>
            <Input disabled value={reqUser.zipCode || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Country</Label>
            <Input disabled value={reqUser.country || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">Telephone</Label>
            <Input disabled value={reqUser.phone || ''} className="bg-muted/30" />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="font-serif font-bold text-xl text-primary">Bank Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">Holder</Label>
            <Input disabled value={reqUser.bankHolder || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Bank Name</Label>
            <Input disabled value={reqUser.bankName || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Account Number</Label>
            <Input disabled value={reqUser.bankAccount || ''} className="bg-muted/30" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">IBAN</Label>
            <Input disabled value={reqUser.iban || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">SWIFT</Label>
            <Input disabled value={reqUser.swift || ''} className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">BIC</Label>
            <Input disabled value={reqUser.bic || ''} className="bg-muted/30" />
          </div>
        </div>
      </div>
    </div>
  )
}
