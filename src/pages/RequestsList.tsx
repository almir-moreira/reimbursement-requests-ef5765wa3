import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/lib/i18n'
import useReimbursementStore from '@/stores/useReimbursementStore'
import useAuthStore from '@/stores/useAuthStore'
import useMasterDataStore from '@/stores/useMasterDataStore'
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
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Search, ChevronUp, ChevronDown } from 'lucide-react'

type SortColumn = 'id' | 'date' | 'requester' | 'total'
type SortDirection = 'asc' | 'desc'

export default function RequestsList() {
  const { t } = useTranslation()
  const { requests } = useReimbursementStore()
  const { user } = useAuthStore()
  const { costCenters, events } = useMasterDataStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortCol, setSortCol] = useState<SortColumn>('date')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const sortedAndFiltered = useMemo(() => {
    let result = requests.filter((req) => {
      if (!user) return false
      // Admin and Finance have global visibility
      if (user.role === 'admin' || user.role === 'finance') return true
      if (user.role === 'requester') return req.requesterId === user.id
      if (user.role === 'qc') return true
      if (user.role === 'co') {
        if (req.status === 'Pending') return false
        const allowedCostCenters = costCenters
          .filter((c: any) => c.coEmail === user.email)
          .map((c: any) => c.code)
        const reqCostCenter =
          req.costCenter || events.find((e: any) => e.id === req.eventId)?.costCenter
        return allowedCostCenters.includes(reqCostCenter)
      }
      return false
    })

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          (r.requesterDetails?.name || '').toLowerCase().includes(q),
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter((r) => r.status === statusFilter)
    }
    if (dateFrom) result = result.filter((r) => r.date >= dateFrom)
    if (dateTo) result = result.filter((r) => r.date <= dateTo)

    result.sort((a, b) => {
      let valA: any = a.id
      let valB: any = b.id

      if (sortCol === 'date') {
        valA = a.date
        valB = b.date
      }
      if (sortCol === 'requester') {
        valA = a.requesterDetails?.name || ''
        valB = b.requesterDetails?.name || ''
      }
      if (sortCol === 'total') {
        valA = a.expenses.reduce((s, e) => s + (e.amountEuros || 0), 0)
        valB = b.expenses.reduce((s, e) => s + (e.amountEuros || 0), 0)
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [requests, user, search, statusFilter, dateFrom, dateTo, sortCol, sortDir])

  const SortHeader = ({
    col,
    label,
    alignRight,
  }: {
    col: SortColumn
    label: string
    alignRight?: boolean
  }) => (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 select-none transition-colors ${alignRight ? 'text-right' : ''}`}
      onClick={() => handleSort(col)}
    >
      <div className={`flex items-center gap-1 ${alignRight ? 'justify-end' : ''}`}>
        {label}
        {sortCol === col ? (
          sortDir === 'asc' ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )
        ) : (
          <div className="w-3 h-3 opacity-0 group-hover:opacity-50" />
        )}
      </div>
    </TableHead>
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-serif text-foreground/80">
          <span className="font-bold text-[#4a8ebf]">KAICIID</span> | {t('requests')}
        </h1>
        {user?.role === 'requester' && (
          <Button asChild className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold">
            <Link to="/requests/new">
              <Plus className="w-4 h-4 mr-2" /> {t('newRequest')}
            </Link>
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Request ID or Requester Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>
          <div className="space-y-1.5 w-[140px]">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending Review</SelectItem>
                <SelectItem value="Checked">Pending Approval</SelectItem>
                <SelectItem value="Approved">Pending Processing</SelectItem>
                <SelectItem value="Processed">Processed & Closed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 w-[140px]">
            <Label>From Date</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5 w-[140px]">
            <Label>To Date</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/50 border-b border-border group">
            <TableRow>
              <SortHeader col="id" label="Request ID" />
              <SortHeader col="date" label={t('date')} />
              <SortHeader col="requester" label="Requester" />
              <SortHeader col="total" label="Total EUR" alignRight />
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/50">
            {sortedAndFiltered.map((req) => {
              const total = req.expenses.reduce((sum, e) => sum + (e.amountEuros || 0), 0)

              // Determine if action is required by current user
              const needsAction =
                (user?.role === 'qc' && req.status === 'Pending') ||
                (user?.role === 'co' && req.status === 'Checked') ||
                (user?.role === 'finance' && req.status === 'Approved') ||
                (user?.role === 'requester' && req.status === 'Rejected') ||
                (user?.role === 'finance' && req.status === 'Processed' && !req.paymentReceipt)

              return (
                <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-bold font-mono text-sm text-[#4a8ebf]">
                    {req.id}
                  </TableCell>
                  <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
                  <TableCell>{req.requesterDetails?.name}</TableCell>
                  <TableCell className="font-semibold text-right">€ {total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                      ${req.status === 'Processed' ? 'bg-success/10 text-success border-success/20 shadow-sm' : ''}
                      ${req.status === 'Rejected' ? 'bg-destructive/10 text-destructive border-destructive/20 font-bold shadow-sm' : ''}
                      ${req.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-sm' : ''}
                      ${req.status === 'Checked' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-sm' : ''}
                      ${req.status === 'Approved' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-sm' : ''}
                    `}
                    >
                      {req.status === 'Pending' && 'Pending Review'}
                      {req.status === 'Checked' && 'Pending Approval'}
                      {req.status === 'Approved' && 'Pending Processing'}
                      {req.status === 'Processed' && 'Processed & Closed'}
                      {req.status === 'Rejected' && 'Rejected'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={needsAction ? 'default' : 'outline'}
                      size="sm"
                      asChild
                      className={
                        needsAction
                          ? 'bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 font-bold'
                          : 'text-[#4a8ebf] hover:text-[#4a8ebf] hover:bg-[#4a8ebf]/10 border-[#4a8ebf]/20'
                      }
                    >
                      <Link to={`/requests/${req.id}`}>
                        {needsAction ? (
                          <>
                            Review <span className="sr-only">Request</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </>
                        )}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {sortedAndFiltered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-lg">
                  No requests found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
