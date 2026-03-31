import { useState } from 'react'
import { User, Role } from '@/types'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Edit, Plus, Trash2 } from 'lucide-react'
import useAuthStore from '@/stores/useAuthStore'

export function SystemUsersManager() {
  const { users, updateProfile, adminAddUser, adminDeleteUser } = useAuthStore()
  const systemUsers = users.filter((u) => u.role !== 'requester')

  const [editing, setEditing] = useState<Partial<User> | null>(null)
  const [isNew, setIsNew] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNew && editing) {
      adminAddUser({ ...editing, role: editing.role || 'qc' })
    } else if (editing && editing.id) {
      updateProfile(editing.id, editing)
    }
    setEditing(null)
    setIsNew(false)
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {systemUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="uppercase text-[10px]">
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(u)
                        setIsNew(false)
                      }}
                      className="h-8 w-8 text-[#4a8ebf]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => adminDeleteUser(u.id!)}
                      className="h-8 w-8 text-destructive"
                      disabled={u.role === 'admin'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        onClick={() => {
          setEditing({ role: 'qc' })
          setIsNew(true)
        }}
        className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white"
      >
        <Plus className="w-4 h-4 mr-2" /> Add System User
      </Button>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Add System User' : 'Edit System User'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  required
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  required
                  type="email"
                  value={editing.email || ''}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder={isNew ? 'Required' : 'Leave empty to keep current'}
                  value={editing.password || ''}
                  onChange={(e) => setEditing({ ...editing, password: e.target.value })}
                  required={isNew}
                />
              </div>
              <div className="space-y-2">
                <Label>System Role</Label>
                <Select
                  value={editing.role}
                  onValueChange={(v: Role) => setEditing({ ...editing, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qc">Quality Control (QC)</SelectItem>
                    <SelectItem value="co">Certifying Officer (CO)</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
