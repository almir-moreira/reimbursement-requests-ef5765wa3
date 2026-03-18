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

  // RBAC Filtering Logic
  const filteredRequests = requests.filter((req) => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'requester') return req.requesterId === user.id
    if (user.role === 'qc') return true // QC needs to see history too, but acts on Pending
    if (user.role === 'co') return req.status !== 'Pending' && req.status !== 'Rejected' // Cleared by QC
    if (user.role === 'finance') return req.status === 'Approved' || req.status === 'Paid' // Approved by CO
    return false
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-serif font-bold text-[#4a8ebf]">{t('requests')}</h1>
        {user?.role === 'requester' && (
          <Button asChild className="bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 text-white font-bold">
            <Link to="/requests/new">
              <Plus className="w-4 h-4 mr-2" /> {t('newRequest')}
            </Link>
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border">
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>{t('date')}</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Total EUR</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/50">
            {filteredRequests.map((req) => {
              const total = req.expenses.reduce((sum, e) => sum + (e.amountEuros || 0), 0)

              // Determine if action is required by current user
              const needsAction =
                (user?.role === 'qc' && req.status === 'Pending') ||
                (user?.role === 'co' && req.status === 'Checked') ||
                (user?.role === 'finance' && req.status === 'Approved') ||
                (user?.role === 'requester' && req.status === 'Rejected')

              return (
                <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-bold font-mono text-xs text-[#4a8ebf]">
                    {req.id}
                  </TableCell>
                  <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
                  <TableCell>{req.requesterDetails?.name}</TableCell>
                  <TableCell className="font-semibold">€ {total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                      ${req.status === 'Paid' ? 'bg-success/10 text-success border-success/20 shadow-sm' : ''}
                      ${req.status === 'Rejected' ? 'bg-destructive/10 text-destructive border-destructive/20 font-bold shadow-sm' : ''}
                      ${req.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-sm' : ''}
                      ${req.status === 'Approved' || req.status === 'Checked' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-sm' : ''}
                    `}
                    >
                      {t(req.status) || req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={needsAction ? 'default' : 'outline'}
                      size="sm"
                      asChild
                      className={
                        needsAction
                          ? 'bg-[#4a8ebf] hover:bg-[#4a8ebf]/90 font-bold'
                          : 'text-[#4a8ebf] hover:text-[#4a8ebf] hover:bg-[#4a8ebf]/10 border-[#4a8ebf]/20'
                      }
                    >
                      <Link to={`/requests/${req.id}`}>
                        {needsAction ? (
                          <>
                            Review <span className="sr-only">Request</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </>
                        )}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-lg">
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
