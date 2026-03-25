import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import useReimbursementStore from '@/stores/useReimbursementStore'
import useMasterDataStore from '@/stores/useMasterDataStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'

export default function Reporting() {
  const { t } = useTranslation()
  const { requests } = useReimbursementStore()
  const { costCenters, events } = useMasterDataStore()

  const [statusFilter, setStatusFilter] = useState('All')
  const [ccFilter, setCcFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = requests.filter((req) => {
    let match = true
    if (statusFilter !== 'All' && req.status !== statusFilter) match = false

    const reqCc = req.costCenter || events.find((e) => e.id === req.eventId)?.costCenter
    if (ccFilter !== 'All' && reqCc !== ccFilter) match = false

    if (dateFrom && req.date < dateFrom) match = false
    if (dateTo && req.date > dateTo) match = false

    return match
  })

  const exportCsv = () => {
    const csvRows = [
      ['Request ID', 'Date', 'Requester', 'Cost Centre', 'Status', 'Total EUR'].join(','),
    ]
    filtered.forEach((r) => {
      const totalEur = r.expenses.reduce((sum, e) => sum + (e.amountEuros || 0), 0).toFixed(2)
      const cc = r.costCenter || events.find((e) => e.id === r.eventId)?.costCenter || 'N/A'
      csvRows.push(
        [r.id, r.date, `"${r.requesterDetails?.name || ''}"`, cc, r.status, totalEur].join(','),
      )
    })
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reimbursements_report_${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up">
      <h1 className="text-3xl font-serif font-bold text-[#4a8ebf]">{t('reporting')}</h1>

      <Card className="shadow-sm border-border">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Filters</span>
            <Button
              onClick={exportCsv}
              variant="outline"
              className="text-[#4a8ebf] border-[#4a8ebf]"
            >
              <Download className="w-4 h-4 mr-2" /> {t('export')} CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                {t('status')}
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Checked">Checked</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Processed">Processed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                {t('costCenter')}
              </label>
              <Select value={ccFilter} onValueChange={setCcFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Cost Centres</SelectItem>
                  {costCenters.map((cc) => (
                    <SelectItem key={cc.code} value={cc.code}>
                      {cc.code} - {cc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                From Date
              </label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                To Date
              </label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Cost Centre</TableHead>
              <TableHead className="text-right">Total EUR</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((req) => {
              const total = req.expenses.reduce((sum, e) => sum + (e.amountEuros || 0), 0)
              const cc =
                req.costCenter || events.find((e) => e.id === req.eventId)?.costCenter || 'N/A'

              return (
                <TableRow key={req.id}>
                  <TableCell className="font-mono text-xs">{req.id}</TableCell>
                  <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
                  <TableCell>{req.requesterDetails?.name}</TableCell>
                  <TableCell>{cc}</TableCell>
                  <TableCell className="text-right font-semibold">€{total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                      ${req.status === 'Processed' ? 'bg-success/10 text-success border-success/20' : ''}
                      ${req.status === 'Rejected' ? 'bg-destructive/10 text-destructive border-destructive/20 font-bold' : ''}
                      ${req.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : ''}
                      ${req.status === 'Approved' || req.status === 'Checked' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                    `}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No records match the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
