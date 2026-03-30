import { useEffect } from 'react'
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
  const { exchangeRates, events } = useMasterDataStore()
  const expenses = formData.expenses || []

  const isQc = user?.role === 'qc'
  const isInternal = user?.role !== 'requester'
  const canEditExpenses = !readOnly || isQc

  const defaultEvent = events.find((e) => e.id === formData.eventId)
  const defaultAccount = defaultEvent?.account || formData.account || ''
  const defaultWorkorder = defaultEvent?.workorder || formData.workorder || ''

  const getRates = (currency: string) => {
    const usdRate = exchangeRates.find((r) => r.currency === currency)?.rateToUsd || 1
    const eurRateToUsd = exchangeRates.find((r) => r.currency === 'EUR')?.rateToUsd || 1.08
    const effectiveRate = usdRate / eurRateToUsd
    return { usdRate, effectiveRate }
  }

  const addExpense = () => {
    onChange({
      expenses: [
        ...expenses,
        {
          id: `exp-${Date.now()}`,
          description: '',
          amount: 0,
          currency: 'GBP',
          account: defaultAccount,
          workorder: defaultWorkorder,
        },
      ],
    })
  }

  const updateExp = (index: number, field: keyof Expense, value: any) => {
    const newExps = [...expenses]
    newExps[index] = { ...newExps[index], [field]: value }

    if (field === 'amount' || field === 'currency' || field === 'exchangeRate') {
      const amt = Number(field === 'amount' ? value : newExps[index].amount) || 0
      const curr = field === 'currency' ? value : newExps[index].currency || 'GBP'

      let effectiveRate = newExps[index].exchangeRate
      if (field === 'exchangeRate') {
        effectiveRate = Number(value) || 0
      } else {
        const rates = getRates(curr)
        effectiveRate = rates.effectiveRate
        newExps[index].exchangeRate = effectiveRate
      }

      newExps[index].amountUsd = amt * getRates(curr).usdRate
      newExps[index].amountEuros = amt * (effectiveRate || 1)
    }
    onChange({ expenses: newExps })
  }

  const removeExp = (index: number) => {
    onChange({ expenses: expenses.filter((_, i) => i !== index) })
  }

  useEffect(() => {
    let changed = false
    const newExps = expenses.map((exp) => {
      let e = { ...exp }
      if (!e.account && defaultAccount) {
        e.account = defaultAccount
        changed = true
      }
      if (!e.workorder && defaultWorkorder) {
        e.workorder = defaultWorkorder
        changed = true
      }
      if (e.amountEuros === undefined) {
        const { usdRate, effectiveRate } = getRates(e.currency)
        e.amountUsd = e.amount * usdRate
        e.exchangeRate = effectiveRate
        e.amountEuros = e.amount * effectiveRate
        changed = true
      }
      return e
    })
    if (changed && !readOnly) onChange({ expenses: newExps })
  }, [formData.eventId, defaultAccount, defaultWorkorder, exchangeRates])

  const totalEuros = expenses.reduce((sum, e) => sum + (e.amountEuros || 0), 0)

  return (
    <div className="space-y-6 pt-6 border-t border-border" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Expense Details</h3>
      <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-start text-muted-foreground">
              <th className="p-3 font-semibold min-w-[200px] text-start">Description</th>
              <th className="p-3 font-semibold w-24 text-start">Amount</th>
              <th className="p-3 font-semibold w-24 text-start">Currency</th>
              {isInternal && (
                <>
                  <th className="p-3 font-semibold w-24 text-start">Account</th>
                  <th className="p-3 font-semibold w-32 text-start">Budget Line</th>
                  <th className="p-3 font-semibold w-28 text-center">Exch. Rate</th>
                </>
              )}
              <th className="p-3 font-semibold w-32 text-right">Amt (EUR)</th>
              {canEditExpenses && <th className="p-3 font-semibold w-12 text-center"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {expenses.map((exp, i) => (
              <tr key={exp.id} className="hover:bg-muted/10 transition-colors">
                <td className="p-2">
                  <Input
                    disabled={!canEditExpenses}
                    value={exp.description}
                    onChange={(e) => updateExp(i, 'description', e.target.value)}
                    className={
                      !canEditExpenses ? 'bg-transparent border-transparent px-1' : 'bg-white'
                    }
                  />
                </td>
                <td className="p-2">
                  <Input
                    disabled={!canEditExpenses}
                    type="number"
                    value={exp.amount || ''}
                    onChange={(e) => updateExp(i, 'amount', e.target.value)}
                    className={
                      !canEditExpenses ? 'bg-transparent border-transparent px-1' : 'bg-white'
                    }
                  />
                </td>
                <td className="p-2">
                  <Select
                    disabled={!canEditExpenses}
                    value={exp.currency}
                    onValueChange={(v) => updateExp(i, 'currency', v)}
                  >
                    <SelectTrigger
                      className={
                        !canEditExpenses ? 'bg-transparent border-transparent' : 'bg-white'
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                        disabled={!canEditExpenses}
                        value={exp.account || ''}
                        onChange={(e) => updateExp(i, 'account', e.target.value)}
                        className={
                          !canEditExpenses ? 'bg-transparent border-transparent px-1' : 'bg-white'
                        }
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        disabled={!canEditExpenses}
                        value={exp.workorder || ''}
                        onChange={(e) => updateExp(i, 'workorder', e.target.value)}
                        className={
                          !canEditExpenses ? 'bg-transparent border-transparent px-1' : 'bg-white'
                        }
                      />
                    </td>
                    <td className="p-2 text-center">
                      {isQc ? (
                        <Input
                          type="number"
                          step="0.0001"
                          value={exp.exchangeRate || ''}
                          onChange={(e) => updateExp(i, 'exchangeRate', parseFloat(e.target.value))}
                          className="w-24 text-center font-mono text-xs bg-white mx-auto"
                        />
                      ) : (
                        <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                          {exp.exchangeRate?.toFixed(4) || '1.0000'}
                        </span>
                      )}
                    </td>
                  </>
                )}
                <td className="p-2 text-right">
                  <span className="font-semibold text-[#4a8ebf] pr-2">
                    {exp.amountEuros?.toFixed(2) || '0.00'}
                  </span>
                </td>
                {canEditExpenses && (
                  <td className="p-2 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExp(i)}
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td
                  colSpan={isInternal ? 8 : 5}
                  className="text-center p-8 text-muted-foreground bg-muted/20"
                >
                  No expenses added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        {canEditExpenses ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExpense}
            className="text-[#4a8ebf] border-[#4a8ebf] hover:bg-[#4a8ebf]/10"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Expense
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
          <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
            Total Amount in Euros
          </Label>
          <div className="text-2xl font-bold text-[#4a8ebf] min-w-[120px] text-right">
            € {totalEuros.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
