import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import useAuthStore from '@/stores/useAuthStore'
import { Role } from '@/types'

export default function Login() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('dorna@example.com')
  const [role, setRole] = useState<Role>('requester')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      login(email, role)
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-elegant border-border">
        <CardHeader className="text-center pb-2">
          <h1 className="font-bold text-3xl text-[#4a8ebf] uppercase tracking-wider mb-2">
            KAICIID
          </h1>
          <CardTitle className="text-xl font-serif text-foreground/80">
            Reimbursement Portal
          </CardTitle>
          <CardDescription className="pt-2">Login to manage your requests</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Role (Demo purpose)</Label>
              <Select value={role} onValueChange={(v: Role) => setRole(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requester">Requester</SelectItem>
                  <SelectItem value="qc">Quality Control (QC)</SelectItem>
                  <SelectItem value="co">Certifying Officer (CO)</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-md bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
