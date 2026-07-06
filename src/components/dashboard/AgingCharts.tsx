import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import type { DashboardRow } from '@/services/dashboard'
import { getAgingBucket, AGING_BUCKETS } from '@/services/dashboard'

const chartConfig = {
  count: { label: 'Requests', color: 'hsl(var(--chart-1))' },
}

export function AgingCharts({ data }: { data: DashboardRow[] }) {
  const bucketCounts = AGING_BUCKETS.map((bucket) => ({
    bucket,
    count: 0,
  }))

  for (const row of data) {
    const bucket = getAgingBucket(row.days_since_submission)
    const found = bucketCounts.find((b) => b.bucket === bucket)
    if (found) found.count++
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Aging Distribution
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <BarChart data={bucketCounts}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="bucket"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
