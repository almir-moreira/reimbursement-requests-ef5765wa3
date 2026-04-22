import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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
  const { events, costCenters } = useMasterDataStore()
  const [countries, setCountries] = useState<string[]>([])

  useEffect(() => {
    const fetchCountries = async () => {
      const { data } = await supabase.from('countries').select('name').order('name')
      if (data) {
        setCountries(data.map((c) => c.name).filter(Boolean) as string[])
      }
    }
    fetchCountries()
  }, [])

  const handleEventChange = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    onChange({
      eventId,
      costCenter: event?.costCenter || formData.costCenter,
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Requester Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label>Requester Name</Label>
          <Input disabled value={formData.requesterDetails?.name || ''} />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            disabled={readOnly}
            value={formData.country || formData.requesterDetails?.country || ''}
            onValueChange={(val) => {
              onChange({
                country: val,
                requesterDetails: { ...formData.requesterDetails, country: val },
              })
            }}
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
          <Label>Event</Label>
          <Select
            disabled={readOnly}
            value={formData.eventId || ''}
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
        <div className="space-y-2">
          <Label>Cost Center</Label>
          <Input
            disabled
            value={
              costCenters.find((c) => c.code === formData.costCenter)?.name ||
              formData.costCenter ||
              ''
            }
            placeholder="Auto-filled from Event"
          />
        </div>
      </div>
    </div>
  )
}
