import { useState, useMemo } from 'react'
import { useTranslation } from '@/lib/i18n'
import useAuthStore from '@/stores/useAuthStore'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs'
import { WorkflowPipeline } from '@/components/dashboard/WorkflowPipeline'
import { DelayAlerts } from '@/components/dashboard/DelayAlerts'
import { AgingCharts } from '@/components/dashboard/AgingCharts'
import { FinancialCharts } from '@/components/dashboard/FinancialCharts'
import { RejectionOverview } from '@/components/dashboard/RejectionOverview'
import { RequestDetailsTable } from '@/components/dashboard/RequestDetailsTable'
import { FilterState, defaultFilters, DashboardRow } from '@/services/dashboard'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { data, loading, lastUpdated, refetch, filterOptions } = useDashboardData()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const filteredData = useMemo<DashboardRow[]>(() => {
    return data.filter((row) => {
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (
          !row.request_id?.toLowerCase().includes(s) &&
          !row.requester_name?.toLowerCase().includes(s)
        )
          return false
      }
      if (filters.status !== 'all' && row.status !== filters.status) return false
      if (filters.eventId !== 'all' && row.event_id !== filters.eventId) return false
      if (filters.costCenterId !== 'all' && row.cost_center_id !== filters.costCenterId)
        return false
      if (filters.paymentMethod !== 'all' && row.payment_method !== filters.paymentMethod)
        return false
      if (filters.requester !== 'all' && row.requester_id !== filters.requester) return false
      if (
        filters.responsibleRole !== 'all' &&
        row.current_responsible_role !== filters.responsibleRole
      )
        return false
      return true
    })
  }, [data, filters])

  const delayedData = useMemo(
    () => filteredData.filter((r) => r.is_delayed_48h === true),
    [filteredData],
  )
  const rejectedData = useMemo(
    () => filteredData.filter((r) => r.is_rejected === true),
    [filteredData],
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#4a8ebf] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-3xl font-serif font-bold text-[#4a8ebf]">{t('dashboard')}</h1>
        {lastUpdated && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm')}
            </span>
            <Button variant="ghost" size="sm" onClick={refetch} className="h-7 px-2">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      <p className="text-muted-foreground bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
        {user?.role === 'requester'
          ? `Welcome back, ${user.name}. Here is a real-time overview of your reimbursement requests.`
          : `Welcome back, ${user?.name}. Here is an overview of the platform's reimbursement workflow.`}
      </p>

      <DashboardFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
        options={filterOptions}
      />
      <DashboardKPIs data={filteredData} />
      <WorkflowPipeline data={filteredData} />
      <DelayAlerts data={delayedData} />
      <AgingCharts data={filteredData} />
      <FinancialCharts data={filteredData} />
      <RejectionOverview data={rejectedData} />
      <RequestDetailsTable data={filteredData} />
    </div>
  )
}
