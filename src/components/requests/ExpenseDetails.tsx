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
  const canEditExpenses = !readOnly

  const defaultEvent = events.find((e) => e.id === formData.eventId)
  const defaultAccount = defaultEvent?.account || formData.account || ''
  const defaultWorkorder = defaultEvent?.workorder || formData.workorder || ''

  const getRates = (currencyCode: string) => {
    const opRate =
      exchangeRates.find((r) => r.Currency_Code === currencyCode)?.Operational_Rate || 1
    const eurOpRate = exchangeRates.find((r) => r.Currency_Code === 'EUR')?.Operational_Rate || 0.92

    const usdRate = 1 / opRate
    const effectiveRate = eurOpRate / opRate
    return { usdRate, effectiveRate, opRate }
  }

  const addExpense = () => {
    onChange({
      expenses: [
        ...expenses,
        {
          id: `exp-${Date.now()}`,
          description: '',
          amount: 0,
          currency: 'USD',
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
      const curr = field === 'currency' ? value : newExps[index].currency || 'USD'

      const rates = getRates(curr)

      let effectiveRate = newExps[index].exchangeRate
      if (field === 'exchangeRate') {
        effectiveRate = Number(value) || 0
      } else {
        effectiveRate = rates.effectiveRate
        newExps[index].exchangeRate = effectiveRate
      }

      newExps[index].operationalRate = rates.opRate
      newExps[index].amountUsd = amt * rates.usdRate
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
      if (e.amountEuros === undefined || e.operationalRate === undefined) {
        const { usdRate, effectiveRate, opRate } = getRates(e.currency)
        e.operationalRate = opRate
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

  // Deduplicate exchange rates by Currency_Code to avoid duplicate keys in the select
  const uniqueRatesMap = new Map()
  exchangeRates.forEach((r) => {
    if (!uniqueRatesMap.has(r.Currency_Code)) {
      uniqueRatesMap.set(r.Currency_Code, r)
    }
  })
  const uniqueRates = Array.from(uniqueRatesMap.values())

  return (
    <div className="space-y-6 pt-6 border-t border-border" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Expense Details</h3>
      <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-start text-muted-foreground">
              <th className="p-3 font-semibold min-w-[150px] text-start">Description</th>
              <th className="p-3 font-semibold w-32 text-start">Amount</th>
              <th className="p-3 font-semibold w-40 text-start">Currency</th>
              <th className="p-3 font-semibold w-24 text-center">Op. Rate</th>
              {isInternal && (
                <>
                  <th className="p-3 font-semibold w-24 text-start">Account</th>
                  <th className="p-3 font-semibold w-32 text-start">Budget Line</th>
                  <th className="p-3 font-semibold w-24 text-center">Exch. Rate</th>
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
                      !canEditExpenses
                        ? 'bg-transparent border-transparent px-1 font-mono text-sm'
                        : 'bg-white font-mono text-sm'
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
                        !canEditExpenses
                          ? 'bg-transparent border-transparent text-xs'
                          : 'bg-white text-xs'
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueRates.map((r) => (
                        <SelectItem key={r.Currency_Code} value={r.Currency_Code}>
                          {r.Currency_Code} - {r.Country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2 text-center">
                  <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    {exp.operationalRate?.toFixed(2) || getRates(exp.currency).opRate.toFixed(2)}
                  </span>
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
                          className={`w-20 text-center font-mono text-xs mx-auto px-1 ${!canEditExpenses ? 'bg-transparent border-transparent' : 'bg-white'}`}
                          disabled={!canEditExpenses}
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
                  <span className="font-semibold text-[#4a8ebf] pr-2 whitespace-nowrap">
                    € {exp.amountEuros?.toFixed(2) || '0.00'}
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
                  colSpan={isInternal ? 9 : 6}
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
