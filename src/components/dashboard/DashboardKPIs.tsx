import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  UserCheck,
  Eye,
  ShieldCheck,
  DollarSign,
  CheckCircle,
  XCircle,
  Euro,
} from 'lucide-react'
import type { DashboardRow } from '@/services/dashboard'

interface KpiCard {
  title: string
  value: string | number
  icon: typeof FileText
  color: string
}

export function DashboardKPIs({ data }: { data: DashboardRow[] }) {
  const pendingRequester = data.filter((r) => r.is_pending_requester === true).length
  const pendingQC = data.filter((r) => r.is_pending_qc === true).length
  const pendingCO = data.filter((r) => r.is_pending_co === true).length
  const pendingFinance = data.filter((r) => r.is_pending_finance === true).length
  const processed = data.filter((r) => r.is_processed === true).length
  const rejected = data.filter((r) => r.is_rejected === true).length
  const totalAmount = data.reduce((sum, r) => sum + (r.amount_eur ?? 0), 0)
  const hasAmount = data.some((r) => r.amount_eur !== null)

  const cards: KpiCard[] = [
    { title: 'Total Requests', value: data.length, icon: FileText, color: 'text-blue-500' },
    {
      title: 'Pending Requester Action',
      value: pendingRequester,
      icon: UserCheck,
      color: 'text-amber-500',
    },
    { title: 'Pending QC Review', value: pendingQC, icon: Eye, color: 'text-orange-500' },
    { title: 'Pending CO Approval', value: pendingCO, icon: ShieldCheck, color: 'text-indigo-500' },
    {
      title: 'Pending Finance Processing',
      value: pendingFinance,
      icon: DollarSign,
      color: 'text-purple-500',
    },
    { title: 'Processed & Closed', value: processed, icon: CheckCircle, color: 'text-green-500' },
    { title: 'Rejected / Returned', value: rejected, icon: XCircle, color: 'text-red-500' },
  ]

  if (hasAmount) {
    cards.push({
      title: 'Total Amount Requested',
      value: `€${totalAmount.toFixed(2)}`,
      icon: Euro,
      color: 'text-emerald-600',
    })
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
      {cards.map((card, i) => (
        <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-1">
              <CardTitle className="text-[11px] font-medium text-muted-foreground leading-tight">
                {card.title}
              </CardTitle>
              <card.icon className={`w-4 h-4 shrink-0 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
