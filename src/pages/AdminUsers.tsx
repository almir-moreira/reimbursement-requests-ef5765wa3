import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from '@/lib/i18n'
import useAuthStore from '@/stores/useAuthStore'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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
import { Search, Users, UserPlus, RefreshCw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Profile {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

export default function AdminUsers() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      toast({ title: 'Error fetching users', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-[#4a8ebf]">Admin | Users</h1>
        <Button onClick={fetchUsers} variant="outline" className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4a8ebf]" /> User Management
              </CardTitle>
              <CardDescription>
                Manage all registered users and their platform roles.
              </CardDescription>
            </div>
            <Button className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white">
              <UserPlus className="w-4 h-4 mr-2" /> Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-1.5">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full sm:w-[200px] space-y-1.5">
              <Label>Filter by Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="qc">Quality Control (QC)</SelectItem>
                  <SelectItem value="co">Cost Center Owner (CO)</SelectItem>
                  <SelectItem value="requester">Requester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name || 'N/A'}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize font-bold shadow-sm
                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}
                            ${u.role === 'finance' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                            ${u.role === 'qc' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                            ${u.role === 'co' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                            ${u.role === 'requester' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                          `}
                        >
                          {u.role || 'requester'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-[#4a8ebf]">
                          Edit Role
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
