import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Pie, PieChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { DashboardRow } from '@/services/dashboard'
import { CHART_COLORS } from '@/services/dashboard'

function groupSum(rows: DashboardRow[], keyFn: (r: DashboardRow) => string | null) {
  const map = new Map<string, number>()
  rows.forEach((r) => {
    if (r.amount_eur === null || r.amount_eur === undefined) return
    const key = keyFn(r)
    if (!key) return
    map.set(key, (map.get(key) ?? 0) + r.amount_eur)
  })
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value)
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[220px] w-full">
          {children}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function BarChartCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  if (data.length === 0) return null
  return (
    <ChartCard title={title}>
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `€${v}`} />
        <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  )
}

function PieChartCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  if (data.length === 0) return null
  return (
    <ChartCard title={title}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartCard>
  )
}

export function FinancialCharts({ data }: { data: DashboardRow[] }) {
  const withAmount = data.filter((r) => r.amount_eur !== null && r.amount_eur !== undefined)
  if (withAmount.length === 0) return null

  const byStatus = groupSum(data, (r) => r.status)
  const byEvent = groupSum(data, (r) => r.event_name)
  const byCostCenter = groupSum(data, (r) => r.cost_center_name)
  const byPayment = groupSum(data, (r) => r.payment_method)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PieChartCard title="Total Value (EUR) by Status" data={byStatus} />
      <BarChartCard title="Total Value (EUR) by Event" data={byEvent} />
      <BarChartCard title="Total Value (EUR) by Cost Centre" data={byCostCenter} />
      <PieChartCard title="Total Value (EUR) by Payment Method" data={byPayment} />
    </div>
  )
}
