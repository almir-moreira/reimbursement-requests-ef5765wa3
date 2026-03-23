import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from '@/lib/i18n'
import useMasterDataStore from '@/stores/useMasterDataStore'
import useAuthStore from '@/stores/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Save, Mail } from 'lucide-react'

export default function SmtpSettings() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { smtpSettings, updateData } = useMasterDataStore()
  const [formData, setFormData] = useState(smtpSettings)

  useEffect(() => {
    setFormData(smtpSettings)
  }, [smtpSettings])

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateData('smtpSettings', formData)
    toast({ title: 'SMTP Settings saved successfully' })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-[#4a8ebf]">{t('smtpSettings')}</h1>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="text-xl flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#4a8ebf]" /> Email Server Credentials
          </CardTitle>
          <CardDescription>
            Configure the SMTP server settings used to send system notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input
                  name="host"
                  value={formData.host || ''}
                  onChange={handleChange}
                  placeholder="smtp.example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input
                  name="port"
                  value={formData.port || ''}
                  onChange={handleChange}
                  placeholder="587"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  name="user"
                  type="email"
                  value={formData.user || ''}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>From Email Address</Label>
                <Input
                  name="fromEmail"
                  type="email"
                  value={formData.fromEmail || ''}
                  onChange={handleChange}
                  placeholder="noreply@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Encryption Type</Label>
                <Select
                  value={formData.encryption}
                  onValueChange={(val: any) => setFormData({ ...formData, encryption: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TLS">TLS</SelectItem>
                    <SelectItem value="SSL">SSL</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
              <Button type="submit" className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white">
                <Save className="w-4 h-4 mr-2" /> Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
