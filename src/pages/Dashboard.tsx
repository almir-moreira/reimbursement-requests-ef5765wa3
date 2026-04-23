import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import useAuthStore from '@/stores/useAuthStore'
import useMasterDataStore from '@/stores/useMasterDataStore'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, DollarSign, XCircle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { costCenters, events } = useMasterDataStore()
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return
      try {
        const { data, error } = await supabase.from('requests').select('*')
        if (error) throw error
        setRequests(data || [])
      } catch (err) {
        console.error('Error fetching requests:', err)
      }
    }
    fetchRequests()
  }, [user])

  const userRequests = requests.filter((req) => {
    if (!user) return false
    if (user.role === 'admin' || user.role === 'finance') return true
    if (user.role === 'requester') return req.user_id === user.id
    if (user.role === 'qc') return true
    if (user.role === 'co') {
      if (req.status === 'Pending') return false
      const allowedCostCenters = costCenters
        .filter((c: any) => c.coEmail === user.email)
        .map((c: any) => c.code)
      const reqCostCenter =
        req.data?.costCenter || events.find((e: any) => e.id === req.data?.eventId)?.costCenter
      return allowedCostCenters.includes(reqCostCenter)
    }
    return false
  })

  const getAmountEuros = (req: any) => {
    if (!req || !req.data) return 0
    const data = req.data

    const isEur = (c: any) => {
      if (!c) return false
      const curr = String(c).trim().toUpperCase()
      return curr === 'EUR' || curr === 'EURO' || curr === 'EUROS' || curr === '€'
    }

    const parseAmt = (val: any) => {
      if (val === null || val === undefined || val === '') return 0
      if (typeof val === 'number') return val
      let strVal = String(val).trim()
      if (/\d+\.\d{3},\d{2}/.test(strVal) || /,\d{2}$/.test(strVal)) {
        strVal = strVal.replace(/\./g, '').replace(',', '.')
      } else {
        strVal = strVal.replace(/,/g, '')
      }
      const parsed = parseFloat(strVal)
      return isNaN(parsed) ? 0 : parsed
    }

    if (data.totalAmountEUR !== undefined) return parseAmt(data.totalAmountEUR)
    if (data.totalEur !== undefined) return parseAmt(data.totalEur)
    if (data.totalEUR !== undefined) return parseAmt(data.totalEUR)

    const reqCurrency =
      data.currency || data.RequestersData?.currency || data.BankInformation?.currency
    const hasEurCurrency = isEur(reqCurrency)

    let total = 0
    let foundItems = false

    const itemsList = Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.expenses)
        ? data.expenses
        : []

    if (itemsList.length > 0) {
      foundItems = true
      total = itemsList.reduce((sum: number, item: any) => {
        const itemCurrency = item.currency || reqCurrency
        if (isEur(itemCurrency) || (!itemCurrency && hasEurCurrency)) {
          return sum + parseAmt(item.amount || item.total || item.value || 0)
        }
        return sum
      }, 0)
    }

    if (foundItems && total > 0) return total

    if (hasEurCurrency) {
      if (data.totalAmount !== undefined) return parseAmt(data.totalAmount)
      if (data.total !== undefined) return parseAmt(data.total)
      if (data.amount !== undefined) return parseAmt(data.amount)
      if (data.TotalAmount !== undefined) return parseAmt(data.TotalAmount)
      if (data.Amount !== undefined) return parseAmt(data.Amount)
    }

    return 0
  }

  const eventStats = events
    .map((event: any) => {
      const eventReqs = userRequests.filter((r) => r.data?.eventId === event.id)
      const rawValue = eventReqs.reduce((sum, r) => sum + getAmountEuros(r), 0)
      return {
        name: event.name || 'Unknown',
        count: eventReqs.length,
        value: Number(rawValue.toFixed(2)),
      }
    })
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count)

  const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#6366f1',
    '#14b8a6',
    '#d946ef',
  ]

  const total = userRequests.length
  const pendingReview = userRequests.filter((r) => r.status === 'Pending').length
  const pendingApproval = userRequests.filter((r) => r.status === 'Checked').length
  const pendingProcessing = userRequests.filter((r) => r.status === 'Approved').length
  const processed = userRequests.filter((r) => r.status === 'Processed').length
  const rejected = userRequests.filter((r) => r.status === 'Rejected').length

  const stats = [
    { title: 'Total Requests', value: total, icon: FileText, color: 'text-[#4a8ebf]' },
    { title: 'Pending Review', value: pendingReview, icon: Clock, color: 'text-orange-500' },
    {
      title: 'Pending Approval',
      value: pendingApproval,
      icon: CheckCircle,
      color: 'text-blue-500',
    },
    {
      title: 'Pending Processing',
      value: pendingProcessing,
      icon: DollarSign,
      color: 'text-purple-500',
    },
    { title: 'Processed & Closed', value: processed, icon: CheckCircle, color: 'text-success' },
    { title: 'Rejected', value: rejected, icon: XCircle, color: 'text-destructive' },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up">
      <h1 className="text-3xl font-serif font-bold text-[#4a8ebf]">{t('dashboard')}</h1>

      {user?.role === 'requester' ? (
        <p className="text-muted-foreground bg-blue-50 p-4 rounded-lg border border-blue-100">
          Welcome back, {user.name}. You can view the real-time status of all your reimbursement
          requests below. Check the "Requests" page to view detailed histories and manage
          rejections.
        </p>
      ) : (
        <p className="text-muted-foreground bg-blue-50 p-4 rounded-lg border border-blue-100">
          Welcome back, {user?.name}. Here is an overview of the platform's current reimbursement
          workflow.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mt-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full bg-muted ${stat.color} bg-opacity-20`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {eventStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Requests per Event</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ count: { label: 'Requests' } }}
                className="h-[300px] w-full"
              >
                <BarChart data={eventStats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {eventStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Total Value per Event (EUR)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ value: { label: 'Total Value (EUR)' } }}
                className="h-[300px] w-full"
              >
                <BarChart data={eventStats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {eventStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
