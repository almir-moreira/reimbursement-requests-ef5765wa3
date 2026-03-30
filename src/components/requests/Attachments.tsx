import { useState } from 'react'
import { ReimbursementRequest, Attachment } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Trash2, Paperclip, Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react'

interface Props {
  formData: Partial<ReimbursementRequest>
  onChange: (data: Partial<ReimbursementRequest>) => void
  readOnly: boolean
}

import useAuthStore from '@/stores/useAuthStore'

export function Attachments({ formData, onChange, readOnly }: Props) {
  const attachments = formData.attachments || []
  const [previewAtt, setPreviewAtt] = useState<Attachment | null>(null)
  const [zoom, setZoom] = useState(1)
  const { user } = useAuthStore()

  const isQc = user?.role === 'qc'
  const canEditAttachments = !readOnly || isQc

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

  const handleFileSelected = (index: number, file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const newAtts = [...attachments]
      newAtts[index] = {
        ...newAtts[index],
        fileName: file.name,
        fileData: e.target?.result as string,
        fileType: file.type,
      }
      onChange({ attachments: newAtts })
    }
    reader.readAsDataURL(file)
  }

  const removeAtt = (index: number) => {
    onChange({ attachments: attachments.filter((_, i) => i !== index) })
  }

  const openPreview = (att: Attachment) => {
    setPreviewAtt(att)
    setZoom(1)
  }

  const handleDownload = (att: Attachment) => {
    const link = document.createElement('a')
    link.href = att.fileData || 'data:text/plain;charset=utf-8,Mock%20File%20Content'
    link.download = att.fileName || 'attachment.txt'
    link.click()
  }

  const renderPreview = (att: Attachment | null) => {
    if (!att) return null
    const ext = att.fileName?.split('.').pop()?.toLowerCase() || ''
    const isImage =
      ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext) || att.fileType?.startsWith('image/')
    const isPdf = ext === 'pdf' || att.fileType === 'application/pdf'

    if (isImage) {
      return (
        <>
          <div className="absolute bottom-4 right-4 flex gap-1 z-10 bg-background/90 backdrop-blur p-1 rounded-md border shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="flex items-center px-2 text-xs font-medium w-12 justify-center select-none">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-border mx-1 self-center" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(1)}
              title="Reset Zoom"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
          <div className="w-full h-full overflow-auto flex p-4 bg-muted/30">
            <div className="m-auto flex items-center justify-center">
              <img
                src={att.fileData || `https://img.usecurling.com/p/1200/1200?q=document`}
                alt={att.fileName}
                style={{
                  width: zoom === 1 ? 'auto' : `${zoom * 100}%`,
                  maxWidth: zoom === 1 ? '100%' : 'none',
                  maxHeight: zoom === 1 ? '100%' : 'none',
                }}
                className="object-contain shadow-sm border bg-white transition-all duration-200"
              />
            </div>
          </div>
        </>
      )
    }

    if (isPdf) {
      const defaultPdfUri =
        'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1LBSK0osSQTz9xJLMYoW8/NTEvBIFQwMDBUMLA1MDCxMjozhDI0NTA0NzSwuQjB5QpZqBqYmBqYGFiamZhYWhibmlhbGFmbmZpYmFmYmFmaWpmaWZhZmliYWlmYWZhZkllAIASf4ZzwplbmRzdHJlYW0KZW5kb2JqCjMgMCBvYmoKMTIyCmVuZG9iago0IDAgb2JqCjw8L1R5cGUvUGFnZS9NZWRpYUJveFswIDAgNTk1LjI3NiA4NDEuODldL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA1IDAgUj4+Pj4vQ29udGVudHMgMiAwIFIvUGFyZW50IDYgMCBSPj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjYgMCBvYmoKPDwvVHlwZS9QYWdlcy9Db3VudCAxL0tpZHNbNCAwIFJdPj4KZW5kb2JqCjcgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDYgMCBSPj4KZW5kb2JqCjEgMCBvYmoKPDwvUHJvZHVjZXIoQ2FudmEpL0NyZWF0aW9uRGF0ZShEOjIwMjQwMzE3MTAwMDAwWik+PgplbmRvYmoKeHJlZgowIDgKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwNDcyIDAwMDAwIG4gCjAwMDAwMDAwMTkgMDAwMDAgbiAKMDAwMDAwMDIxMyAwMDAwMCBuIAowMDAwMDAwMjMyIDAwMDAwIG4gCjAwMDAwMDAzNTMgMDAwMDAgbiAKMDAwMDAwMDQ0MSAwMDAwMCBuIAowMDAwMDAwMTAwIDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA4L1Jvb3QgNyAwIFIvSW5mbyAxIDAgUj4+CnN0YXJ0eHJlZgo1NDQKJSVFT0YK'
      return (
        <iframe
          src={att.fileData || defaultPdfUri}
          className="w-full h-full border-0 bg-muted/10"
          title={att.fileName}
        />
      )
    }

    return (
      <div className="flex flex-col items-center justify-center text-muted-foreground p-8 w-full h-full bg-muted/20">
        <Paperclip className="w-16 h-16 mb-4 opacity-20" />
        <p>No preview available for this file type.</p>
        <p className="text-sm mt-2">Please download the file to view its contents.</p>
      </div>
    )
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
            <div className="flex-1 space-y-2 w-full min-w-0">
              <Label className="text-xs uppercase text-muted-foreground">Description</Label>
              <Input
                disabled={!canEditAttachments}
                value={att.description}
                onChange={(e) => updateAtt(i, 'description', e.target.value)}
                placeholder="Receipt description"
                className={!canEditAttachments ? 'bg-white cursor-default text-foreground' : ''}
              />
            </div>
            <div className="flex-1 space-y-2 w-full min-w-0">
              <Label className="text-xs uppercase text-muted-foreground">File</Label>
              {!canEditAttachments ? (
                <div className="flex items-center p-2.5 h-10 bg-white rounded-md border border-input shadow-sm hover:border-[#4a8ebf] transition-colors group">
                  <Paperclip className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                  <button
                    type="button"
                    onClick={() => openPreview(att)}
                    className="text-sm font-semibold text-[#4a8ebf] hover:underline flex-1 truncate text-left"
                    title="Click to preview file"
                  >
                    {att.fileName || 'Unnamed Attachment'}
                  </button>
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openPreview(att)}
                      className="text-muted-foreground hover:text-[#4a8ebf] p-1 rounded-md hover:bg-muted"
                      title="Preview file"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(att)}
                      className="text-muted-foreground hover:text-[#4a8ebf] p-1 rounded-md hover:bg-muted"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileSelected(i, e.target.files?.[0])}
                    className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4a8ebf]/10 file:text-[#4a8ebf] hover:file:bg-[#4a8ebf]/20 cursor-pointer"
                  />
                  {att.fileName && (
                    <button
                      type="button"
                      onClick={() => openPreview(att)}
                      className="text-sm font-medium truncate max-w-[150px] hover:underline hover:text-[#4a8ebf] flex items-center shrink-0"
                      title="Preview file"
                    >
                      <ZoomIn className="w-4 h-4 mr-1 shrink-0" />
                      <span className="truncate">{att.fileName}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            {canEditAttachments && (
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
      {canEditAttachments && (
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

      <Dialog open={!!previewAtt} onOpenChange={(open) => !open && setPreviewAtt(null)}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-full h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-background shrink-0">
            <DialogTitle className="truncate flex-1 pr-4 text-left">
              {previewAtt?.fileName}
            </DialogTitle>
            <div className="flex items-center gap-2 pr-8 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => previewAtt && handleDownload(previewAtt)}
              >
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 bg-muted/20 relative overflow-hidden">
            {renderPreview(previewAtt)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
