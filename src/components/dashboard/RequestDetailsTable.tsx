import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Search, ListChecks } from 'lucide-react'
import type { DashboardRow } from '@/services/dashboard'
import { formatWaitingTime } from '@/services/dashboard'

const PAGE_SIZE = 8

function statusBadgeVariant(
  status: string | null,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (!status) return 'outline'
  if (status === 'rejected' || status === 'returned') return 'destructive'
  if (status === 'processed' || status === 'closed') return 'default'
  if (status === 'pending') return 'secondary'
  return 'outline'
}

export function RequestDetailsTable({ data }: { data: DashboardRow[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!search) return data
    const s = search.toLowerCase()
    return data.filter(
      (r) =>
        r.request_id?.toLowerCase().includes(s) ||
        r.requester_name?.toLowerCase().includes(s) ||
        r.event_name?.toLowerCase().includes(s),
    )
  }, [data, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const paged = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-blue-500" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Request Details
            </CardTitle>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              placeholder="Search requests..."
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Request ID</TableHead>
                <TableHead className="text-xs">Requester</TableHead>
                <TableHead className="text-xs">Event</TableHead>
                <TableHead className="text-xs">Cost Center</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Stage</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
                <TableHead className="text-xs text-right">Waiting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => (
                  <TableRow key={row.request_id} className="hover:bg-muted/50">
                    <TableCell className="text-xs font-medium">{row.request_id || '—'}</TableCell>
                    <TableCell className="text-xs">{row.requester_name || '—'}</TableCell>
                    <TableCell className="text-xs">{row.event_name || '—'}</TableCell>
                    <TableCell className="text-xs">
                      {row.cost_center_code || row.cost_center_name || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(row.status)} className="text-[10px]">
                        {row.status || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{row.current_stage || '—'}</TableCell>
                    <TableCell className="text-xs text-right">
                      {row.amount_eur != null ? `€${row.amount_eur.toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell className="text-xs text-right">{formatWaitingTime(row)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">
              {filtered.length} request{filtered.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                disabled={currentPage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
