import { supabase } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

export type DashboardRow = Tables<'reimbursement_dashboard_view'>

export interface FilterState {
  search: string
  status: string
  eventId: string
  costCenterId: string
  paymentMethod: string
  requester: string
  responsibleRole: string
}

export const defaultFilters: FilterState = {
  search: '',
  status: 'all',
  eventId: 'all',
  costCenterId: 'all',
  paymentMethod: 'all',
  requester: 'all',
  responsibleRole: 'all',
}

export const CHART_COLORS = [
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

export async function fetchDashboardData(): Promise<DashboardRow[]> {
  const { data, error } = await supabase
    .from('reimbursement_dashboard_view')
    .select('*')
    .order('submitted_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export function getAgingBucket(days: number | null): string {
  if (days === null || days === undefined) return '0–1 day'
  if (days <= 1) return '0–1 day'
  if (days <= 3) return '2–3 days'
  if (days <= 7) return '4–7 days'
  if (days <= 14) return '8–14 days'
  return '15+ days'
}

export const AGING_BUCKETS = ['0–1 day', '2–3 days', '4–7 days', '8–14 days', '15+ days']

export function formatWaitingTime(row: DashboardRow): string {
  const ref = row.stage_started_at || row.submitted_at
  if (!ref) return '—'
  const hours = Math.floor((Date.now() - new Date(ref).getTime()) / 3600000)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  const rem = hours % 24
  return rem > 0 ? `${days}d ${rem}h` : `${days}d`
}

export function getOldestAge(rows: DashboardRow[]): string {
  const valid = rows.filter((r) => r.stage_started_at || r.submitted_at)
  if (valid.length === 0) return '—'
  const oldest = valid.reduce(
    (min, r) => {
      const d = new Date(r.stage_started_at || r.submitted_at!)
      return d < min ? d : min
    },
    new Date(valid[0].stage_started_at || valid[0].submitted_at!),
  )
  const hours = Math.floor((Date.now() - oldest.getTime()) / 3600000)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}
