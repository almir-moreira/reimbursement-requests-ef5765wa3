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
import useAuthStore from '@/stores/useAuthStore'

interface RequestHeaderProps {
  formData: Partial<ReimbursementRequest>
  onChange: (data: Partial<ReimbursementRequest>) => void
  readOnly?: boolean
}

export function RequestHeader({ formData, onChange, readOnly }: RequestHeaderProps) {
  const { events, countries } = useMasterDataStore()
  const { user: currentUser } = useAuthStore()
  const user = formData.requesterDetails || {}

  const isRequesterOrKiosk = currentUser?.role === 'requester' || currentUser?.role === 'kiosk'
  const isKiosk = currentUser?.role === 'kiosk'

  const handleUserChange = (field: string, value: string) => {
    onChange({ requesterDetails: { ...user, [field]: value } as any })
  }

  const selectedEvent = events?.find((e) => e.id === formData.eventId)

  return (
    <div className="space-y-8">
      {/* Top Row: Request Details */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="space-y-2">
          <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            ID
          </Label>
          <Input disabled value={formData.id || ''} className="bg-muted/10 h-10" />
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Status
          </Label>
          <Input disabled value={formData.status || ''} className="bg-muted/10 h-10" />
        </div>
        <div className={`space-y-2 ${isRequesterOrKiosk ? 'col-span-2 md:col-span-4' : ''}`}>
          <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Event <span className="text-destructive">*</span>
          </Label>
          <Select
            disabled={readOnly}
            value={formData.eventId || ''}
            onValueChange={(val) => {
              const ev = events?.find((e) => e.id === val)
              onChange({
                eventId: val,
                costCenter: ev?.costCenter || '',
              })
            }}
          >
            <SelectTrigger className="bg-white h-10 disabled:bg-muted/10">
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
        {!isRequesterOrKiosk && (
          <>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Cost Centre
              </Label>
              <Input
                disabled={readOnly}
                value={formData.costCenter || selectedEvent?.costCenter || ''}
                onChange={(e) => onChange({ costCenter: e.target.value })}
                className="bg-white h-10 disabled:bg-muted/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Account
              </Label>
              <Input disabled value={selectedEvent?.account || ''} className="bg-muted/10 h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Workorder
              </Label>
              <Input disabled value={selectedEvent?.workorder || ''} className="bg-muted/10 h-10" />
            </div>
          </>
        )}
      </div>

      <hr className="border-border" />

      {/* Requester Info */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Requester Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Full Name</Label>
            <Input
              disabled={readOnly}
              value={user.name || ''}
              onChange={(e) => handleUserChange('name', e.target.value)}
              className="bg-white h-10 disabled:bg-muted/10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Email</Label>
            <Input
              disabled={readOnly}
              type="email"
              value={user.email || ''}
              onChange={(e) => handleUserChange('email', e.target.value)}
              className="bg-white h-10 disabled:bg-muted/10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Organization</Label>
            <Input
              disabled={readOnly}
              value={user.organization || ''}
              onChange={(e) => handleUserChange('organization', e.target.value)}
              className="bg-white h-10 disabled:bg-muted/10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Country</Label>
            <Select
              disabled={readOnly}
              value={user.country || ''}
              onValueChange={(val) => handleUserChange('country', val)}
            >
              <SelectTrigger className="bg-white h-10 disabled:bg-muted/10">
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
            <Label className="text-sm font-semibold">State / Province</Label>
            <Input
              disabled={readOnly}
              value={user.state || ''}
              onChange={(e) => handleUserChange('state', e.target.value)}
              className="bg-white h-10 disabled:bg-muted/10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">City</Label>
            <Input
              disabled={readOnly}
              value={user.city || ''}
              onChange={(e) => handleUserChange('city', e.target.value)}
              className="bg-white h-10 disabled:bg-muted/10"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold">Address</Label>
            <Input
              disabled={readOnly}
              value={user.address || ''}
              onChange={(e) => handleUserChange('address', e.target.value)}
              className="bg-white h-10 disabled:bg-muted/10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Zip / Postal Code</Label>
            <Input
              disabled={readOnly}
              value={user.zipCode || ''}
              onChange={(e) => handleUserChange('zipCode', e.target.value)}
              className="bg-white h-10 disabled:bg-muted/10"
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label className="text-sm font-semibold">Phone</Label>
            <Input
              disabled={readOnly}
              value={user.phone || ''}
              onChange={(e) => handleUserChange('phone', e.target.value)}
              className="bg-white h-10 disabled:bg-muted/10"
            />
          </div>
        </div>
      </div>

      {!isKiosk && (
        <>
          <hr className="border-border" />

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Bank Name</Label>
                <Input
                  disabled={readOnly}
                  value={user.bankName || ''}
                  onChange={(e) => handleUserChange('bankName', e.target.value)}
                  className="bg-white h-10 disabled:bg-muted/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Account Holder</Label>
                <Input
                  disabled={readOnly}
                  value={user.bankHolder || ''}
                  onChange={(e) => handleUserChange('bankHolder', e.target.value)}
                  className="bg-white h-10 disabled:bg-muted/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Bank Country</Label>
                <Select
                  disabled={readOnly}
                  value={user.bankCountry || ''}
                  onValueChange={(val) => handleUserChange('bankCountry', val)}
                >
                  <SelectTrigger className="bg-white h-10 disabled:bg-muted/10">
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
                <Label className="text-sm font-semibold">IBAN / Account Number</Label>
                <Input
                  disabled={readOnly}
                  value={user.iban || user.bankAccount || ''}
                  onChange={(e) => {
                    handleUserChange('iban', e.target.value)
                    handleUserChange('bankAccount', e.target.value)
                  }}
                  className="bg-white h-10 disabled:bg-muted/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">BIC / SWIFT</Label>
                <Input
                  disabled={readOnly}
                  value={user.bic || user.swift || ''}
                  onChange={(e) => {
                    handleUserChange('bic', e.target.value)
                    handleUserChange('swift', e.target.value)
                  }}
                  className="bg-white h-10 disabled:bg-muted/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Bank Code</Label>
                <Input
                  disabled={readOnly}
                  value={user.bankCode || ''}
                  onChange={(e) => handleUserChange('bankCode', e.target.value)}
                  className="bg-white h-10 disabled:bg-muted/10"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
