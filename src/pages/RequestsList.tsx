import { Link } from 'react-router-dom'
import { useTranslation } from '@/lib/i18n'
import useReimbursementStore from '@/stores/useReimbursementStore'
import useAuthStore from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye } from 'lucide-react'

export default function RequestsList() {
  const { t } = useTranslation()
  const { requests } = useReimbursementStore()
  const { user } = useAuthStore()

  const filteredRequests =
    user?.role === 'requester' ? requests.filter((r) => r.requesterId === user.id) : requests

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-serif font-bold text-primary">{t('requests')}</h1>
        {user?.role === 'requester' && (
          <Button asChild className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90">
            <Link to="/requests/new">
              <Plus className="w-4 h-4 mr-2" /> {t('newRequest')}
            </Link>
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>{t('date')}</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((req) => (
              <TableRow key={req.id} className="hover:bg-muted/30">
                <TableCell className="font-medium font-mono text-xs">{req.id}</TableCell>
                <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
                <TableCell>{req.eventId}</TableCell>
                <TableCell>{req.requesterDetails?.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`
                    ${req.status === 'Paid' ? 'bg-success/10 text-success border-success/20' : ''}
                    ${req.status === 'Rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' : ''}
                    ${req.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : ''}
                    ${req.status === 'Approved' || req.status === 'Checked' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                  `}
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-[#4a8ebf] hover:text-[#4a8ebf] hover:bg-[#4a8ebf]/10"
                  >
                    <Link to={`/requests/${req.id}`}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No requests found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
