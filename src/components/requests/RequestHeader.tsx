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

interface RequestHeaderProps {
  formData: Partial<ReimbursementRequest>
  onChange: (data: Partial<ReimbursementRequest>) => void
  readOnly?: boolean
}

export function RequestHeader({ formData, onChange, readOnly }: RequestHeaderProps) {
  const { events, costCenters, countries } = useMasterDataStore()
  const user = formData.requesterDetails || {}

  const handleUserChange = (field: string, value: string) => {
    onChange({ requesterDetails: { ...user, [field]: value } as any })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground">
            Event <span className="text-destructive">*</span>
          </Label>
          <Select
            disabled={readOnly}
            value={formData.eventId || ''}
            onValueChange={(val) => onChange({ eventId: val })}
          >
            <SelectTrigger className="bg-muted/10 h-10">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {events?.map((e) => {
                if (!e.id) return null
                return (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name || e.id}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground">Cost Center</Label>
          <Select
            disabled={readOnly}
            value={formData.costCenter || ''}
            onValueChange={(val) => onChange({ costCenter: val })}
          >
            <SelectTrigger className="bg-muted/10 h-10">
              <SelectValue placeholder="Select Cost Center" />
            </SelectTrigger>
            <SelectContent>
              {costCenters?.map((c) => {
                if (!c.code) return null
                return (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name || c.code}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-[#4a8ebf] border-b border-border pb-2">
          Requester Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Name</Label>
            <Input
              disabled={readOnly}
              value={user.name || ''}
              onChange={(e) => handleUserChange('name', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Email</Label>
            <Input
              disabled={readOnly}
              type="email"
              value={user.email || ''}
              onChange={(e) => handleUserChange('email', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Organization</Label>
            <Input
              disabled={readOnly}
              value={user.organization || ''}
              onChange={(e) => handleUserChange('organization', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Phone</Label>
            <Input
              disabled={readOnly}
              value={user.phone || ''}
              onChange={(e) => handleUserChange('phone', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs uppercase text-muted-foreground">Address</Label>
            <Input
              disabled={readOnly}
              value={user.address || ''}
              onChange={(e) => handleUserChange('address', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">City</Label>
            <Input
              disabled={readOnly}
              value={user.city || ''}
              onChange={(e) => handleUserChange('city', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">State/Province</Label>
            <Input
              disabled={readOnly}
              value={user.state || ''}
              onChange={(e) => handleUserChange('state', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Zip/Postal Code</Label>
            <Input
              disabled={readOnly}
              value={user.zipCode || ''}
              onChange={(e) => handleUserChange('zipCode', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Country</Label>
            <Select
              disabled={readOnly}
              value={user.country || ''}
              onValueChange={(val) => handleUserChange('country', val)}
            >
              <SelectTrigger className="bg-muted/10 h-10">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries?.map((c) => {
                  const val = c.name || c.id
                  if (!val) return null
                  return (
                    <SelectItem key={c.id} value={val}>
                      {c.name || c.id}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-[#4a8ebf] border-b border-border pb-2">
          Bank Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Bank Name</Label>
            <Input
              disabled={readOnly}
              value={user.bankName || ''}
              onChange={(e) => handleUserChange('bankName', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Account Holder</Label>
            <Input
              disabled={readOnly}
              value={user.bankHolder || ''}
              onChange={(e) => handleUserChange('bankHolder', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Bank Country</Label>
            <Select
              disabled={readOnly}
              value={user.bankCountry || ''}
              onValueChange={(val) => handleUserChange('bankCountry', val)}
            >
              <SelectTrigger className="bg-muted/10 h-10">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries?.map((c) => {
                  const val = c.name || c.id
                  if (!val) return null
                  return (
                    <SelectItem key={c.id} value={val}>
                      {c.name || c.id}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">IBAN / Account Number</Label>
            <Input
              disabled={readOnly}
              value={user.iban || user.bankAccount || ''}
              onChange={(e) => {
                handleUserChange('iban', e.target.value)
                handleUserChange('bankAccount', e.target.value)
              }}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">BIC / SWIFT</Label>
            <Input
              disabled={readOnly}
              value={user.bic || user.swift || ''}
              onChange={(e) => {
                handleUserChange('bic', e.target.value)
                handleUserChange('swift', e.target.value)
              }}
              className="bg-muted/10 h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Bank Code</Label>
            <Input
              disabled={readOnly}
              value={user.bankCode || ''}
              onChange={(e) => handleUserChange('bankCode', e.target.value)}
              className="bg-muted/10 h-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
