import { useState, useEffect } from 'react'
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
import { supabase } from '@/lib/supabase/client'

export function RequestHeader({ formData, onChange, readOnly }: any) {
  const { events } = useMasterDataStore()
  const [countries, setCountries] = useState<string[]>([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await supabase.from('countries').select('name').order('name')
        if (data) {
          const uniqueCountries = Array.from(
            new Set(data.map((c) => c.name).filter(Boolean)),
          ) as string[]
          setCountries(uniqueCountries)
        }
      } catch (err) {
        console.error('Error fetching countries', err)
      }
    }
    fetchCountries()
  }, [])

  const requester = formData.requesterDetails || {}

  const handleRequesterChange = (field: string, value: string) => {
    onChange({
      requesterDetails: { ...requester, [field]: value },
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-bold">ID</Label>
          <Input disabled value={formData.id || ''} className="bg-muted/30 h-10" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-bold">Status</Label>
          <div className="h-10 px-3 py-2 border rounded-md bg-muted/10 flex items-center text-sm font-medium text-muted-foreground">
            {formData.status || 'Pending'}
          </div>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label className="text-xs uppercase text-muted-foreground font-bold">
            Event <span className="text-destructive">*</span>
          </Label>
          <Select
            disabled={readOnly}
            value={formData.eventId || ''}
            onValueChange={(val) => {
              const event = events.find((e: any) => e.id === val)
              onChange({
                eventId: val,
                costCenter: event?.costCenter || '',
                account: event?.account || '',
                workorder: event?.workorder || '',
              })
            }}
          >
            <SelectTrigger className="h-10 border-border/50">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((e: any) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-bold">Cost Centre</Label>
          <Input disabled value={formData.costCenter || ''} className="bg-muted/30 h-10" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-bold">Account</Label>
          <Input disabled value={formData.account || ''} className="bg-muted/30 h-10" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground font-bold">Workorder</Label>
          <Input disabled value={formData.workorder || ''} className="bg-muted/30 h-10" />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-serif font-bold text-xl text-[#4a8ebf] mb-6">Requester Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              disabled={readOnly}
              value={requester.name || ''}
              onChange={(e) => handleRequesterChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              disabled={readOnly}
              value={requester.email || ''}
              onChange={(e) => handleRequesterChange('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Organization</Label>
            <Input
              disabled={readOnly}
              value={requester.organization || ''}
              onChange={(e) => handleRequesterChange('organization', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              disabled={readOnly}
              value={requester.country || ''}
              onValueChange={(val) => handleRequesterChange('country', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>State / Province</Label>
            <Input
              disabled={readOnly}
              value={requester.state || ''}
              onChange={(e) => handleRequesterChange('state', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              disabled={readOnly}
              value={requester.city || ''}
              onChange={(e) => handleRequesterChange('city', e.target.value)}
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Address</Label>
            <Input
              disabled={readOnly}
              value={requester.address || ''}
              onChange={(e) => handleRequesterChange('address', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Zip / Postal Code</Label>
            <Input
              disabled={readOnly}
              value={requester.zipCode || ''}
              onChange={(e) => handleRequesterChange('zipCode', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              disabled={readOnly}
              value={requester.phone || ''}
              onChange={(e) => handleRequesterChange('phone', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-serif font-bold text-xl text-[#4a8ebf] mb-6">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Input
              disabled={readOnly}
              value={requester.bankName || ''}
              onChange={(e) => handleRequesterChange('bankName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Account Holder Name</Label>
            <Input
              disabled={readOnly}
              value={requester.bankHolder || ''}
              onChange={(e) => handleRequesterChange('bankHolder', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Bank Account Number</Label>
            <Input
              disabled={readOnly}
              value={requester.bankAccount || ''}
              onChange={(e) => handleRequesterChange('bankAccount', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>IBAN</Label>
            <Input
              disabled={readOnly}
              value={requester.iban || ''}
              onChange={(e) => handleRequesterChange('iban', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>SWIFT</Label>
            <Input
              disabled={readOnly}
              value={requester.swift || ''}
              onChange={(e) => handleRequesterChange('swift', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>BIC</Label>
            <Input
              disabled={readOnly}
              value={requester.bic || ''}
              onChange={(e) => handleRequesterChange('bic', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Routing / Bank Code</Label>
            <Input
              disabled={readOnly}
              value={requester.bankCode || ''}
              onChange={(e) => handleRequesterChange('bankCode', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
