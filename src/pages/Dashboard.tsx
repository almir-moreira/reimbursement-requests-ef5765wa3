import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import useAuthStore from '@/stores/useAuthStore'
import useMasterDataStore from '@/stores/useMasterDataStore'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, DollarSign, XCircle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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

  const getAmount = (req: any) => {
    if (typeof req.data?.totalAmount === 'number') return req.data.totalAmount
    if (typeof req.data?.total === 'number') return req.data.total
    if (typeof req.data?.amount === 'number') return req.data.amount
    if (Array.isArray(req.data?.items)) {
      return req.data.items.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0)
    }
    if (Array.isArray(req.data?.expenses)) {
      return req.data.expenses.reduce(
        (sum: number, item: any) => sum + (Number(item.amount) || 0),
        0,
      )
    }
    return 0
  }

  const eventStats = events
    .map((event: any) => {
      const eventReqs = userRequests.filter((r) => r.data?.eventId === event.id)
      return {
        name: event.name || 'Unknown',
        count: eventReqs.length,
        value: eventReqs.reduce((sum, r) => sum + getAmount(r), 0),
      }
    })
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count)

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
                config={{ count: { label: 'Requests', color: 'hsl(var(--chart-1))' } }}
                className="h-[300px] w-full"
              >
                <BarChart data={eventStats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Total Value per Event</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ value: { label: 'Total Value', color: 'hsl(var(--chart-2))' } }}
                className="h-[300px] w-full"
              >
                <BarChart data={eventStats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
