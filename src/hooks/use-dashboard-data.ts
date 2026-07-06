import { useState, useEffect, useCallback, useMemo } from 'react'
import useAuthStore from '@/stores/useAuthStore'
import { fetchDashboardData, DashboardRow } from '@/services/dashboard'

export interface FilterOptions {
  statuses: string[]
  events: { id: string; name: string }[]
  costCenters: { id: string; name: string }[]
  paymentMethods: string[]
  requesters: { id: string; name: string }[]
  responsibleRoles: string[]
}

export function useDashboardData() {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashboardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const rows = await fetchDashboardData()
      setData(rows)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const roleFilteredData = useMemo(() => {
    if (!user) return []
    if (user.role === 'requester') {
      return data.filter((r) => r.requester_id === user.id)
    }
    return data
  }, [data, user])

  const filterOptions = useMemo<FilterOptions>(() => {
    const events = new Map<string, string>()
    const costCenters = new Map<string, string>()
    const paymentMethods = new Set<string>()
    const requesters = new Map<string, string>()
    const statuses = new Set<string>()
    const roles = new Set<string>()

    roleFilteredData.forEach((r) => {
      if (r.event_id && r.event_name) events.set(r.event_id, r.event_name)
      if (r.cost_center_id && r.cost_center_name)
        costCenters.set(r.cost_center_id, r.cost_center_name)
      if (r.payment_method) paymentMethods.add(r.payment_method)
      if (r.requester_id && r.requester_name) requesters.set(r.requester_id, r.requester_name)
      if (r.status) statuses.add(r.status)
      if (r.current_responsible_role) roles.add(r.current_responsible_role)
    })

    return {
      statuses: Array.from(statuses).sort(),
      events: Array.from(events.entries()).map(([id, name]) => ({ id, name })),
      costCenters: Array.from(costCenters.entries()).map(([id, name]) => ({ id, name })),
      paymentMethods: Array.from(paymentMethods).sort(),
      requesters: Array.from(requesters.entries()).map(([id, name]) => ({ id, name })),
      responsibleRoles: Array.from(roles).sort(),
    }
  }, [roleFilteredData])

  return { data: roleFilteredData, loading, lastUpdated, refetch: load, filterOptions }
}
