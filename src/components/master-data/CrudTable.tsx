import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface Column {
  key: string
  label: string
  type?: 'text' | 'number'
}

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import useMasterDataStore from '@/stores/useMasterDataStore'
import { toast } from '@/hooks/use-toast'

interface CrudTableProps {
  columns: Column[]
  data: any[]
  tableName: string
  newItemTemplate: any
}

export function CrudTable({ columns, data, tableName, newItemTemplate }: CrudTableProps) {
  const { fetchMasterData } = useMasterDataStore()
  const [localData, setLocalData] = useState(data)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleUpdate = (index: number, key: string, value: any) => {
    const newData = [...localData]
    newData[index] = { ...newData[index], [key]: value }
    setLocalData(newData)
  }

  const handleAdd = () => {
    setLocalData([...localData, { ...newItemTemplate, id: crypto.randomUUID() }])
  }

  const handleRemove = (index: number) => {
    setLocalData(localData.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (localData.length > 0) {
        const { error } = await supabase.from(tableName).upsert(localData)
        if (error) throw error
      }

      const originalIds = data.map((d: any) => d.id).filter(Boolean)
      const currentIds = localData.map((d: any) => d.id).filter(Boolean)
      const deletedIds = originalIds.filter((id: string) => !currentIds.includes(id))

      if (deletedIds.length > 0) {
        const { error: delError } = await supabase.from(tableName).delete().in('id', deletedIds)
        if (delError) throw delError
      }

      toast({ title: 'Records saved successfully' })
      await fetchMasterData()
    } catch (err: any) {
      toast({ title: 'Error saving records', description: err.message, variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = JSON.stringify(data) !== JSON.stringify(localData)

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localData.map((row, i) => (
              <TableRow key={row.id || i}>
                {columns.map((col) => (
                  <TableCell key={col.key} className="p-2">
                    <Input
                      type={col.type || 'text'}
                      value={row[col.key] || ''}
                      onChange={(e) =>
                        handleUpdate(
                          i,
                          col.key,
                          col.type === 'number' ? Number(e.target.value) : e.target.value,
                        )
                      }
                      className="h-8 text-sm bg-transparent border-transparent hover:border-input focus:border-input"
                    />
                  </TableCell>
                ))}
                <TableCell className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(i)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {localData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-muted-foreground"
                >
                  No records found. Click 'Add Record' to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="text-[#4a8ebf] border-[#4a8ebf] hover:bg-[#4a8ebf]/10"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Record
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
