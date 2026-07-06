import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ExternalLink } from 'lucide-react'
import type { DashboardRow } from '@/services/dashboard'
import { formatWaitingTime } from '@/services/dashboard'

export function DelayAlerts({ data }: { data: DashboardRow[] }) {
  const delayed = data.filter((r) => r.is_delayed_48h === true)

  return (
    <Card className="shadow-sm border-orange-200">
      <CardHeader className="pb-3 bg-orange-50/50 rounded-t-lg">
        <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
          <AlertTriangle className="w-4 h-4" />
          Delay Alerts — Requests Pending &gt; 48 Hours ({delayed.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {delayed.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No delayed requests.</p>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-xs">Request ID</TableHead>
                <TableHead className="text-xs">Requester</TableHead>
                <TableHead className="text-xs">Event</TableHead>
                <TableHead className="text-xs">Current Stage</TableHead>
                <TableHead className="text-xs text-right">Waiting</TableHead>
                <TableHead className="text-xs text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delayed.map((r) => (
                <TableRow key={r.request_id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">{r.request_id}</TableCell>
                  <TableCell className="text-sm">{r.requester_name ?? '—'}</TableCell>
                  <TableCell className="text-sm">{r.event_name ?? '—'}</TableCell>
                  <TableCell className="text-sm">{r.current_stage ?? '—'}</TableCell>
                  <TableCell className="text-sm text-right font-medium text-orange-600">
                    {formatWaitingTime(r)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/requests/${r.request_id}`}>
                        <ExternalLink className="w-3 h-3 mr-1" /> Open
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
