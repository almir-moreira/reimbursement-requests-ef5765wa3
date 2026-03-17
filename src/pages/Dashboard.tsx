import { useTranslation } from '@/lib/i18n'
import useReimbursementStore from '@/stores/useReimbursementStore'
import useAuthStore from '@/stores/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, Clock, DollarSign, XCircle } from 'lucide-react'

export default function Dashboard() {
  const { t } = useTranslation()
  const { requests } = useReimbursementStore()
  const { user } = useAuthStore()

  const userRequests =
    user?.role === 'requester' ? requests.filter((r) => r.requesterId === user.id) : requests

  const total = userRequests.length
  const pending = userRequests.filter((r) => r.status === 'Pending').length
  const approved = userRequests.filter(
    (r) => r.status === 'Approved' || r.status === 'Checked',
  ).length
  const paid = userRequests.filter((r) => r.status === 'Paid').length
  const rejected = userRequests.filter((r) => r.status === 'Rejected').length

  const stats = [
    { title: 'Total Requests', value: total, icon: FileText, color: 'text-[#4a8ebf]' },
    { title: 'Pending Approval', value: pending, icon: Clock, color: 'text-orange-500' },
    { title: 'In Progress', value: approved, icon: CheckCircle, color: 'text-blue-500' },
    { title: 'Paid & Closed', value: paid, icon: DollarSign, color: 'text-success' },
    { title: 'Rejected', value: rejected, icon: XCircle, color: 'text-destructive' },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up">
      <h1 className="text-3xl font-serif font-bold text-primary">{t('dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full bg-muted ${stat.color} bg-opacity-20`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
