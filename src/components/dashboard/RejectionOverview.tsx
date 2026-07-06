import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { XCircle } from 'lucide-react'
import type { DashboardRow } from '@/services/dashboard'
import { CHART_COLORS } from '@/services/dashboard'

const chartConfig = {
  count: { label: 'Rejections', color: 'hsl(var(--chart-4))' },
}

export function RejectionOverview({ data }: { data: DashboardRow[] }) {
  if (data.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-green-500" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejection Overview
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-8 text-center">
            No rejected requests in the current filter.
          </p>
        </CardContent>
      </Card>
    )
  }

  const stageCounts = data.reduce<Record<string, number>>((acc, row) => {
    const stage = row.current_stage || 'Unknown'
    acc[stage] = (acc[stage] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(stageCounts).map(([stage, count]) => ({
    stage,
    count,
  }))

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejection Overview
            </CardTitle>
          </div>
          <Badge variant="destructive">{data.length} Rejected</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              width={120}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill={CHART_COLORS[3]} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="space-y-2 max-h-[200px] overflow-auto">
          {data.slice(0, 10).map((row) => (
            <div
              key={row.request_id}
              className="flex items-start justify-between gap-2 p-2 rounded-md border border-red-100 bg-red-50/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {row.request_id}
                  </span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1">
                    {row.current_stage || '—'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {row.rejection_reason ||
                    row.qc_rejection_reason ||
                    row.co_rejection_reason ||
                    'No reason provided'}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {row.requester_name || '—'}
              </span>
            </div>
          ))}
          {data.length > 10 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              +{data.length - 10} more...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
