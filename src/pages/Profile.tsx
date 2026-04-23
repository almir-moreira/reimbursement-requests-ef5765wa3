import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import useAuthStore from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Save } from 'lucide-react'
import useMasterDataStore from '@/stores/useMasterDataStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Profile() {
  const { t } = useTranslation()
  const { user, updateProfile } = useAuthStore()
  const { countries } = useMasterDataStore()
  const [formData, setFormData] = useState(user || {})

  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    if (user?.id) {
      updateProfile(user.id, formData)
      toast({ title: 'Profile updated successfully' })
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-primary">Requesters Data</h1>
        <Button onClick={handleSave} className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white">
          <Save className="w-4 h-4 mr-2" /> {t('save')}
        </Button>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="bg-[#4a8ebf] text-white py-4">
          <CardTitle className="text-lg font-medium tracking-wide">Requesters Data</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase">Id</Label>
              <Input disabled value={formData.id || ''} className="bg-muted/50" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-muted-foreground text-xs uppercase">Name</Label>
              <Input name="name" value={formData.name || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase">Email</Label>
              <Input name="email" value={formData.email || ''} onChange={handleChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-muted-foreground text-xs uppercase">Address</Label>
              <Input name="address" value={formData.address || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase">City</Label>
              <Input name="city" value={formData.city || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase">State</Label>
              <Input name="state" value={formData.state || ''} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase">Country</Label>
              <Select
                value={formData.country || undefined}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {[...(countries || [])]
                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                    .map((country) => {
                      const val = country.name || country.id
                      if (!val) return null
                      return (
                        <SelectItem key={country.id} value={val}>
                          {country.name || country.id}
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase">ZIP Code</Label>
              <Input name="zipCode" value={formData.zipCode || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase">Phone</Label>
              <Input name="phone" value={formData.phone || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase">Organization</Label>
              <Input
                name="organization"
                value={formData.organization || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-border">
            <h3 className="font-serif font-bold text-xl text-primary">{t('bankInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground text-xs uppercase">Account Holder</Label>
                <Input
                  name="bankHolder"
                  value={formData.bankHolder || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">Bank Name</Label>
                <Input name="bankName" value={formData.bankName || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">
                  Bank Account Number
                </Label>
                <Input
                  name="bankAccount"
                  value={formData.bankAccount || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground text-xs uppercase">IBAN</Label>
                <Input name="iban" value={formData.iban || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">BIC</Label>
                <Input name="bic" value={formData.bic || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">SWIFT</Label>
                <Input name="swift" value={formData.swift || ''} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase">Bank Code</Label>
                <Input name="bankCode" value={formData.bankCode || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground text-xs uppercase">Bank Country</Label>
                <Select
                  value={formData.bankCountry || undefined}
                  onValueChange={(value) => setFormData({ ...formData, bankCountry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank country" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...(countries || [])]
                      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                      .map((country) => {
                        const val = country.name || country.id
                        if (!val) return null
                        return (
                          <SelectItem key={country.id} value={val}>
                            {country.name || country.id}
                          </SelectItem>
                        )
                      })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-4">
                <Label className="text-muted-foreground text-xs uppercase">
                  Additional Bank Information
                </Label>
                <Input
                  name="additionalBankInfo"
                  value={formData.additionalBankInfo || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
