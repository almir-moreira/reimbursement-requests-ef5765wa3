import { ReimbursementRequest } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Paperclip } from 'lucide-react'

interface Props {
  formData: Partial<ReimbursementRequest>
  onChange: (data: Partial<ReimbursementRequest>) => void
  readOnly: boolean
}

export function Attachments({ formData, onChange, readOnly }: Props) {
  const attachments = formData.attachments || []

  const addAttachment = () => {
    onChange({
      attachments: [...attachments, { id: `att-${Date.now()}`, description: '', fileName: '' }],
    })
  }

  const updateAtt = (index: number, field: string, value: string) => {
    const newAtts = [...attachments]
    newAtts[index] = { ...newAtts[index], [field]: value }
    onChange({ attachments: newAtts })
  }

  const removeAtt = (index: number) => {
    onChange({ attachments: attachments.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6 pt-6 border-t border-border">
      <h3 className="font-serif font-bold text-xl text-primary">Attachments</h3>
      <div className="space-y-4">
        {attachments.map((att, i) => (
          <div
            key={att.id}
            className="flex items-end gap-4 bg-muted/20 p-4 rounded-lg border border-border"
          >
            <div className="flex-1 space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Description</Label>
              <Input
                disabled={readOnly}
                value={att.description}
                onChange={(e) => updateAtt(i, 'description', e.target.value)}
                placeholder="Receipt description"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">File</Label>
              <div className="flex items-center gap-2">
                <Input
                  disabled={readOnly}
                  type="file"
                  onChange={(e) => updateAtt(i, 'fileName', e.target.files?.[0]?.name || '')}
                  className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {att.fileName && (
                  <span className="text-sm font-medium">
                    <Paperclip className="w-4 h-4 inline mr-1" />
                    {att.fileName}
                  </span>
                )}
              </div>
            </div>
            {!readOnly && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAtt(i)}
                className="text-destructive hover:bg-destructive/10 h-10 w-10 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {attachments.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No attachments added.</p>
        )}
      </div>
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAttachment}
          className="text-success border-success hover:bg-success/10"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Attachment
        </Button>
      )}
    </div>
  )
}
