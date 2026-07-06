import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, RotateCcw, Filter } from 'lucide-react'
import { FilterState } from '@/services/dashboard'
import type { FilterOptions } from '@/hooks/use-dashboard-data'

interface Props {
  filters: FilterState
  onChange: (f: FilterState) => void
  onReset: () => void
  options: FilterOptions
}

export function DashboardFilters({ filters, onChange, onReset, options }: Props) {
  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Filter className="w-4 h-4 text-[#4a8ebf]" />
        <span className="text-sm font-medium">Filters</span>
        <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={onReset}>
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ID or name..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={filters.status} onValueChange={(v) => update('status', v)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {options.statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.eventId} onValueChange={(v) => update('eventId', v)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {options.events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.costCenterId} onValueChange={(v) => update('costCenterId', v)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Cost Centre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cost Centres</SelectItem>
            {options.costCenters.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.paymentMethod} onValueChange={(v) => update('paymentMethod', v)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            {options.paymentMethods.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.requester} onValueChange={(v) => update('requester', v)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Requester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requesters</SelectItem>
            {options.requesters.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.responsibleRole} onValueChange={(v) => update('responsibleRole', v)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Responsible" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {options.responsibleRoles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
