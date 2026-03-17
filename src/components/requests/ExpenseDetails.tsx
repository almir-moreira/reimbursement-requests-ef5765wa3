import { ReimbursementRequest, Expense } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import useAuthStore from '@/stores/useAuthStore'
import useMasterDataStore from '@/stores/useMasterDataStore'

interface Props {
  formData: Partial<ReimbursementRequest>
  onChange: (data: Partial<ReimbursementRequest>) => void
  readOnly: boolean
}

export function ExpenseDetails({ formData, onChange, readOnly }: Props) {
  const { user, lang } = useAuthStore()
  const { exchangeRates } = useMasterDataStore()
  const expenses = formData.expenses || []
  const isInternal = user?.role !== 'requester'

  const addExpense = () => {
    onChange({
      expenses: [
        ...expenses,
        { id: `exp-${Date.now()}`, description: '', amount: 0, currency: 'USD' },
      ],
    })
  }

  const updateExp = (index: number, field: keyof Expense, value: any) => {
    const newExps = [...expenses]
    newExps[index] = { ...newExps[index], [field]: value }

    if (isInternal && (field === 'amount' || field === 'currency' || field === 'exchangeRate')) {
      const amt = Number(newExps[index].amount) || 0
      const rate = Number(newExps[index].exchangeRate) || 1
      newExps[index].amountEuros = amt * rate * 0.92
    }
    onChange({ expenses: newExps })
  }

  const removeExp = (index: number) => {
    onChange({ expenses: expenses.filter((_, i) => i !== index) })
  }

  const totalEuros = expenses.reduce((sum, e) => sum + (e.amountEuros || 0), 0)

  return (
    <div className="space-y-6 pt-6 border-t border-border" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="font-serif font-bold text-xl text-primary">Expense Details</h3>
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-start text-muted-foreground">
              <th className="p-3 font-semibold min-w-[200px] text-start">Description</th>
              <th className="p-3 font-semibold w-32 text-start">Amount</th>
              <th className="p-3 font-semibold w-32 text-start">Currency</th>
              {isInternal && (
                <>
                  <th className="p-3 font-semibold w-32 text-start">Account</th>
                  <th className="p-3 font-semibold w-32 text-start">Workorder</th>
                  <th className="p-3 font-semibold w-24 text-start">Exch. Rate</th>
                  <th className="p-3 font-semibold w-32 text-start">Amt Euros</th>
                </>
              )}
              {!readOnly && <th className="p-3 font-semibold w-12 text-start"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.map((exp, i) => (
              <tr key={exp.id} className="hover:bg-muted/20">
                <td className="p-2">
                  <Input
                    disabled={readOnly}
                    value={exp.description}
                    onChange={(e) => updateExp(i, 'description', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    disabled={readOnly}
                    type="number"
                    value={exp.amount}
                    onChange={(e) => updateExp(i, 'amount', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Select
                    disabled={readOnly}
                    value={exp.currency}
                    onValueChange={(v) => updateExp(i, 'currency', v)}
                  >
                    <SelectTrigger dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      {exchangeRates.map((r) => (
                        <SelectItem key={r.currency} value={r.currency}>
                          {r.currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                {isInternal && (
                  <>
                    <td className="p-2">
                      <Input
                        disabled={readOnly && user?.role !== 'qc'}
                        value={exp.account || ''}
                        onChange={(e) => updateExp(i, 'account', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        disabled={readOnly && user?.role !== 'qc'}
                        value={exp.workorder || ''}
                        onChange={(e) => updateExp(i, 'workorder', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        disabled={readOnly && user?.role !== 'qc'}
                        type="number"
                        value={exp.exchangeRate || ''}
                        onChange={(e) => updateExp(i, 'exchangeRate', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        disabled
                        value={exp.amountEuros?.toFixed(2) || ''}
                        className="bg-muted/30 font-bold text-end"
                      />
                    </td>
                  </>
                )}
                {!readOnly && (
                  <td className="p-2 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExp(i)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={isInternal ? 8 : 4} className="text-center p-6 text-muted-foreground">
                  No expenses added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addExpense}
          className="text-success border-success hover:bg-success/10"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Row
        </Button>
      )}
      {isInternal && (
        <div className="flex justify-end mt-4 pt-4 border-t border-border/50">
          <div className="w-64 space-y-2">
            <Label className="text-end block text-muted-foreground uppercase text-xs">
              Total Amount in Euros
            </Label>
            <Input
              disabled
              value={totalEuros.toFixed(2)}
              className="text-end font-bold text-xl bg-primary/5 text-primary border-primary/20 h-12"
            />
          </div>
        </div>
      )}
    </div>
  )
}
