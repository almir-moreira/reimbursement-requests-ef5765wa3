import { Fragment } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import type { DashboardRow } from '@/services/dashboard'
import { getOldestAge } from '@/services/dashboard'

interface Stage {
  key: string
  label: string
  filter: (r: DashboardRow) => boolean
  color: string
}

const STAGES: Stage[] = [
  {
    key: 'requester',
    label: 'Submitted / Requester',
    filter: (r) => r.is_pending_requester === true,
    color: 'bg-amber-50 border-amber-200',
  },
  {
    key: 'qc',
    label: 'QC Review',
    filter: (r) => r.is_pending_qc === true,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    key: 'co',
    label: 'CO Approval',
    filter: (r) => r.is_pending_co === true,
    color: 'bg-indigo-50 border-indigo-200',
  },
  {
    key: 'finance',
    label: 'Finance Processing',
    filter: (r) => r.is_pending_finance === true,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    key: 'closed',
    label: 'Processed & Closed',
    filter: (r) => r.is_processed === true,
    color: 'bg-green-50 border-green-200',
  },
]

export function WorkflowPipeline({ data }: { data: DashboardRow[] }) {
  return (
    <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
      {STAGES.map((stage, i) => {
        const rows = data.filter(stage.filter)
        const count = rows.length
        const amount = rows.reduce((sum, r) => sum + (r.amount_eur ?? 0), 0)
        const oldest = getOldestAge(rows)
        return (
          <Fragment key={stage.key}>
            <Card className={`flex-1 min-w-[160px] border ${stage.color} shadow-sm`}>
              <CardContent className="p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">{stage.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{count}</span>
                  <span className="text-xs text-muted-foreground">requests</span>
                </div>
                {amount > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">€{amount.toFixed(2)}</p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1">
                  Oldest: <span className="font-medium">{oldest}</span>
                </p>
              </CardContent>
            </Card>
            {i < STAGES.length - 1 && (
              <ChevronRight className="self-center text-muted-foreground shrink-0" />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
