import { ReimbursementRequest } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Paperclip, Download } from 'lucide-react'

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
      <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Attachments</h3>
      <div className="space-y-4">
        {attachments.map((att, i) => (
          <div
            key={att.id}
            className="flex flex-col sm:flex-row items-start sm:items-end gap-4 bg-muted/20 p-4 rounded-lg border border-border"
          >
            <div className="flex-1 space-y-2 w-full">
              <Label className="text-xs uppercase text-muted-foreground">Description</Label>
              <Input
                disabled={readOnly}
                value={att.description}
                onChange={(e) => updateAtt(i, 'description', e.target.value)}
                placeholder="Receipt description"
                className={readOnly ? 'bg-white cursor-default text-foreground' : ''}
              />
            </div>
            <div className="flex-1 space-y-2 w-full">
              <Label className="text-xs uppercase text-muted-foreground">File</Label>
              {readOnly ? (
                <div className="flex items-center p-2.5 h-10 bg-white rounded-md border border-input shadow-sm hover:border-[#4a8ebf] transition-colors">
                  <Paperclip className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                  <a
                    href={`#download-${att.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      const link = document.createElement('a')
                      link.href = 'data:text/plain;charset=utf-8,Mock%20File%20Content'
                      link.download = att.fileName || 'attachment.txt'
                      link.click()
                    }}
                    className="text-sm font-semibold text-[#4a8ebf] hover:underline flex-1 truncate"
                    title="Click to download file"
                  >
                    {att.fileName || 'Unnamed Attachment'}
                  </a>
                  <Download className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    onChange={(e) => updateAtt(i, 'fileName', e.target.files?.[0]?.name || '')}
                    className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4a8ebf]/10 file:text-[#4a8ebf] hover:file:bg-[#4a8ebf]/20 cursor-pointer"
                  />
                  {att.fileName && (
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      <Paperclip className="w-4 h-4 inline mr-1" />
                      {att.fileName}
                    </span>
                  )}
                </div>
              )}
            </div>
            {!readOnly && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAtt(i)}
                className="text-destructive hover:bg-destructive/10 h-10 w-10 shrink-0 mt-2 sm:mt-0"
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
