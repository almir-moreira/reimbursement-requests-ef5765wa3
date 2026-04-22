import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/lib/i18n'
import useAuthStore from '@/stores/useAuthStore'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { FileText, Plus, Search, Filter } from 'lucide-react'

export default function RequestsList() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [search, setSearch] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetchRequests()
    fetchEvents()
  }, [user])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*').order('name')
      if (!error && data) {
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const fetchRequests = async () => {
    if (!user) return
    setLoading(true)
    try {
      let query = supabase
        .from('requests')
        .select('*, profiles(name, email)')
        .order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error

      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const paymentMethods = useMemo(() => {
    const methods = new Set<string>()
    requests.forEach((req) => {
      const pm = req.data?.paymentMethod || req.data?.payment_method
      if (pm && typeof pm === 'string') methods.add(pm)
    })
    return Array.from(methods).sort()
  }, [requests])

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== 'all' && req.status !== statusFilter) return false
      if (dateFilter) {
        const reqDate = req.created_at ? req.created_at.substring(0, 10) : ''
        if (reqDate !== dateFilter) return false
      }
      if (paymentMethodFilter !== 'all') {
        const pm = req.data?.paymentMethod || req.data?.payment_method
        if (pm !== paymentMethodFilter) return false
      }
      if (eventFilter !== 'all') {
        const reqEvent = req.data?.event || ''
        if (reqEvent !== eventFilter) return false
      }
      if (search) {
        const searchLower = search.toLowerCase()
        const reqId = req.id.toLowerCase()
        if (!reqId.includes(searchLower)) return false
      }
      return true
    })
  }, [requests, statusFilter, dateFilter, search, paymentMethodFilter, eventFilter])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'processed':
        return 'bg-blue-100 text-blue-800'
      case 'paid':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4a8ebf] font-serif">
            {t('requests') || 'Reimbursement Requests'}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage and track your reimbursement requests
          </p>
        </div>
        {(user?.role === 'requester' || user?.role === 'admin') && (
          <Button asChild className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-medium">
            <Link to="/requests/new">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Link>
          </Button>
        )}
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border bg-muted/30">
          <CardTitle className="text-base flex items-center gap-2 font-medium">
            <Filter className="w-4 h-4 text-[#4a8ebf]" />
            Filter Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Search ID</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Event</label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map((ev) => (
                    <SelectItem key={ev.id} value={ev.name || ev.id}>
                      {ev.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Processed">Processed</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Payment Method</label>
              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {paymentMethods.map((pm) => (
                    <SelectItem key={pm} value={pm}>
                      {pm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-xs uppercase text-muted-foreground">
                    ID
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase text-muted-foreground">
                    Event
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase text-muted-foreground">
                    Requester
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase text-muted-foreground text-right">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase text-muted-foreground text-right">
                    Amt (EUR)
                  </TableHead>
                  {user?.role !== 'requester' && (
                    <TableHead className="font-semibold text-xs uppercase text-muted-foreground">
                      Payment Method
                    </TableHead>
                  )}
                  <TableHead className="font-semibold text-xs uppercase text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs uppercase text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={user?.role !== 'requester' ? 9 : 8}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#4a8ebf] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm">Loading requests...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={user?.role !== 'requester' ? 9 : 8}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-muted-foreground/30" />
                        <p className="text-sm">No requests found matching your filters.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((req) => (
                    <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell
                        className="font-medium font-mono text-xs max-w-[200px] truncate"
                        title={req.id}
                      >
                        {req.id}
                      </TableCell>
                      <TableCell className="text-sm">
                        {req.created_at ? format(new Date(req.created_at), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {req.data?.event || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm">{req.profiles?.name || 'Unknown'}</TableCell>
                      <TableCell className="text-sm font-medium text-right whitespace-nowrap">
                        {(() => {
                          let currency =
                            req.data?.currency ||
                            req.data?.requestCurrency ||
                            req.data?.reimbursementCurrency
                          if (
                            !currency &&
                            Array.isArray(req.data?.expenses) &&
                            req.data.expenses.length > 0
                          ) {
                            currency =
                              req.data.expenses[0].currency || req.data.expenses[0].originalCurrency
                          }
                          currency = currency || 'USD'

                          let total =
                            Number(req.data?.totalAmount) ||
                            Number(req.data?.total) ||
                            Number(req.data?.amount) ||
                            Number(req.data?.totalReimbursement) ||
                            Number(req.data?.requestedAmount) ||
                            0

                          if (!total && Array.isArray(req.data?.expenses)) {
                            total = req.data.expenses.reduce(
                              (sum: number, exp: any) =>
                                sum + (Number(exp.amount) || Number(exp.amountRequested) || 0),
                              0,
                            )
                          }

                          const formatted = new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(total)

                          return `${currency} ${formatted}`
                        })()}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-right whitespace-nowrap">
                        {(() => {
                          let totalEur =
                            Number(req.data?.totalAmountEuros) ||
                            Number(req.data?.totalAmountEur) ||
                            Number(req.data?.totalEur) ||
                            Number(req.data?.amountEur) ||
                            0

                          if (!totalEur && Array.isArray(req.data?.expenses)) {
                            totalEur = req.data.expenses.reduce(
                              (sum: number, exp: any) =>
                                sum +
                                (Number(exp.amountEuros) ||
                                  Number(exp.amountEur) ||
                                  Number(exp.amount_eur) ||
                                  Number(exp.eurAmount) ||
                                  0),
                              0,
                            )
                          }

                          const formattedEur = new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(totalEur)

                          return `€ ${formattedEur}`
                        })()}
                      </TableCell>
                      {user?.role !== 'requester' && (
                        <TableCell className="text-sm">
                          {req.data?.paymentMethod || req.data?.payment_method ? (
                            <Badge variant="outline" className="font-normal text-xs bg-muted/50">
                              {req.data?.paymentMethod || req.data?.payment_method}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(req.status)} border-transparent font-medium`}
                        >
                          {req.status || 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:text-[#4a8ebf] hover:bg-[#4a8ebf]/10"
                        >
                          <Link to={`/requests/${req.id}`}>
                            <FileText className="w-4 h-4 mr-2" />
                            View
                          </Link>
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
