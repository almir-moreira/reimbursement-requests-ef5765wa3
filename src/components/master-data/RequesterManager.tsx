import { useState } from 'react'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Edit, Plus, Trash2 } from 'lucide-react'
import useAuthStore from '@/stores/useAuthStore'
import { useToast } from '@/hooks/use-toast'

export function RequesterManager() {
  const { users, updateProfile, adminAddUser, adminDeleteUser } = useAuthStore()
  const { toast } = useToast()
  const requesters = users.filter((u) => u.role === 'requester')

  const [editing, setEditing] = useState<Partial<User> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (isNew && editing) {
        await adminAddUser({ ...editing, role: 'requester' })
        toast({ title: 'Requester added successfully' })
      } else if (editing && editing.id) {
        await updateProfile(editing.id, editing)
        toast({ title: 'Requester updated successfully' })
      }
      setEditing(null)
      setIsNew(false)
    } catch (err: any) {
      toast({ title: 'Error saving requester', description: err.message, variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this requester?')) return
    try {
      await adminDeleteUser(id)
      toast({ title: 'Requester deleted successfully' })
    } catch (err: any) {
      toast({ title: 'Error deleting requester', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requesters.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.name}</TableCell>
                <TableCell>{req.email}</TableCell>
                <TableCell>{req.city}</TableCell>
                <TableCell>{req.bankName}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(req)
                        setIsNew(false)
                      }}
                      className="h-8 w-8 text-[#4a8ebf]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(req.id!)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {requesters.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No requesters found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Button
        onClick={() => {
          setEditing({ role: 'requester' })
          setIsNew(true)
        }}
        className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Requester
      </Button>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Add Requester' : 'Edit Requester Profile'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleSave} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
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
                {isNew && (
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={editing.password || ''}
                      onChange={(e) => setEditing({ ...editing, password: e.target.value })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editing.phone || ''}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input
                    value={editing.organization || ''}
                    onChange={(e) => setEditing({ ...editing, organization: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Address</Label>
                  <Input
                    value={editing.address || ''}
                    onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={editing.city || ''}
                    onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input
                    value={editing.zipCode || ''}
                    onChange={(e) => setEditing({ ...editing, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4 text-[#4a8ebf]">Bank Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Holder</Label>
                    <Input
                      value={editing.bankHolder || ''}
                      onChange={(e) => setEditing({ ...editing, bankHolder: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input
                      value={editing.bankName || ''}
                      onChange={(e) => setEditing({ ...editing, bankName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Account Number / IBAN</Label>
                    <Input
                      value={editing.iban || ''}
                      onChange={(e) => setEditing({ ...editing, iban: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT / BIC</Label>
                    <Input
                      value={editing.swift || ''}
                      onChange={(e) => setEditing({ ...editing, swift: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Code</Label>
                    <Input
                      value={editing.bankCode || ''}
                      onChange={(e) => setEditing({ ...editing, bankCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
