import { ReimbursementRequest, User } from '@/types'
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
import useAuthStore from '@/stores/useAuthStore'
import { useTranslation } from '@/lib/i18n'

interface Props {
  formData: Partial<ReimbursementRequest>
  onChange: (data: Partial<ReimbursementRequest>) => void
  readOnly: boolean
}

export function RequestHeader({ formData, onChange, readOnly }: Props) {
  const { events } = useMasterDataStore()
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const reqUser = formData.requesterDetails || {}

  const isQc = user?.role === 'qc'
  const canEditQcFields = !readOnly
  const canEditRequesterFields = !readOnly && !isQc

  const handleEventChange = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    onChange({
      eventId,
      costCenter: event?.costCenter || '',
      account: event?.account || '',
      workorder: event?.workorder || '',
    })
  }

  const updateRequesterDetails = (field: keyof User, value: string) => {
    onChange({
      requesterDetails: {
        ...reqUser,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
        <div className="space-y-2 lg:col-span-1">
          <Label className="text-muted-foreground text-xs uppercase">Id</Label>
          <Input disabled value={formData.id || ''} className="bg-muted/50 font-mono text-xs" />
        </div>
        <div className="space-y-2 lg:col-span-1">
          <Label className="text-muted-foreground text-xs uppercase">Status</Label>
          <Input
            disabled
            value={
              formData.status === 'Pending'
                ? 'Pending Review'
                : formData.status === 'Checked'
                  ? 'Pending Approval'
                  : formData.status === 'Approved'
                    ? 'Pending Processing'
                    : formData.status === 'Processed'
                      ? 'Processed & Closed'
                      : formData.status
            }
            className="bg-muted/50 font-semibold"
          />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label className="text-muted-foreground text-xs uppercase">Event</Label>
          <Select
            disabled={!canEditQcFields}
            value={formData.eventId}
            onValueChange={handleEventChange}
          >
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
        <div className="space-y-2 lg:col-span-1">
          <Label className="text-muted-foreground text-xs uppercase">Cost Centre</Label>
          <Input
            disabled={!canEditQcFields}
            value={formData.costCenter || ''}
            onChange={(e) => onChange({ costCenter: e.target.value })}
            className={
              !canEditQcFields ? 'bg-muted/50 font-mono text-xs' : 'font-mono text-xs bg-white'
            }
            placeholder="e.g. CC-01"
          />
        </div>
        <div className="space-y-2 lg:col-span-1">
          <Label className="text-muted-foreground text-xs uppercase">Account</Label>
          <Input
            disabled={!canEditQcFields}
            value={formData.account || ''}
            onChange={(e) => onChange({ account: e.target.value })}
            className={
              !canEditQcFields ? 'bg-muted/50 font-mono text-xs' : 'font-mono text-xs bg-white'
            }
          />
        </div>
        <div className="space-y-2 lg:col-span-1">
          <Label className="text-muted-foreground text-xs uppercase">Workorder</Label>
          <Input
            disabled={!canEditQcFields}
            value={formData.workorder || ''}
            onChange={(e) => onChange({ workorder: e.target.value })}
            className={
              !canEditQcFields ? 'bg-muted/50 font-mono text-xs' : 'font-mono text-xs bg-white'
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold border-b pb-2">Requester Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">Requester</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.name || ''}
              onChange={(e) => updateRequesterDetails('name', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Email</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.email || ''}
              onChange={(e) => updateRequesterDetails('email', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Organization</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.organization || ''}
              onChange={(e) => updateRequesterDetails('organization', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">Address</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.address || ''}
              onChange={(e) => updateRequesterDetails('address', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">City</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.city || ''}
              onChange={(e) => updateRequesterDetails('city', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">State</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.state || ''}
              onChange={(e) => updateRequesterDetails('state', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">ZIP Code</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.zipCode || ''}
              onChange={(e) => updateRequesterDetails('zipCode', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Country</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.country || ''}
              onChange={(e) => updateRequesterDetails('country', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">Telephone</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.phone || ''}
              onChange={(e) => updateRequesterDetails('phone', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="font-serif font-bold text-xl text-primary">Bank Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">Holder</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.bankHolder || ''}
              onChange={(e) => updateRequesterDetails('bankHolder', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Bank Name</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.bankName || ''}
              onChange={(e) => updateRequesterDetails('bankName', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">Account Number</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.bankAccount || ''}
              onChange={(e) => updateRequesterDetails('bankAccount', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-muted-foreground text-xs uppercase">IBAN</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.iban || ''}
              onChange={(e) => updateRequesterDetails('iban', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">SWIFT</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.swift || ''}
              onChange={(e) => updateRequesterDetails('swift', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase">BIC</Label>
            <Input
              disabled={!canEditRequesterFields}
              value={reqUser.bic || ''}
              onChange={(e) => updateRequesterDetails('bic', e.target.value)}
              className={!canEditRequesterFields ? 'bg-muted/30' : ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
