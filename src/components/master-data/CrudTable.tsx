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

interface CrudTableProps {
  columns: Column[]
  data: any[]
  onChange: (data: any[]) => void
  newItemTemplate: any
}

export function CrudTable({ columns, data, onChange, newItemTemplate }: CrudTableProps) {
  const handleUpdate = (index: number, key: string, value: any) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [key]: value }
    onChange(newData)
  }

  const handleAdd = () => {
    onChange([...data, { ...newItemTemplate, id: `item-${Date.now()}` }])
  }

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

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
            {data.map((row, i) => (
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
            {data.length === 0 && (
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
      <Button
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="text-[#4a8ebf] border-[#4a8ebf] hover:bg-[#4a8ebf]/10"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Record
      </Button>
    </div>
  )
}
