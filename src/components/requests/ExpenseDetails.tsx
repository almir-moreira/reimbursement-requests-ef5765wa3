import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import useAuthStore from '@/stores/useAuthStore'
import useMasterDataStore from '@/stores/useMasterDataStore'
import { cn } from '@/lib/utils'

export function ExpenseDetails({ formData, onChange, readOnly }: any) {
  const [currencies, setCurrencies] = useState<string[]>([])
  const [eurRate, setEurRate] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()
  const { accounts, workorders } = useMasterDataStore()

  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true)
      try {
        const { data: ratesData } = await supabase.from('exchange_rates').select('Currency_Code')

        if (ratesData) {
          const uniqueCurrencies = Array.from(new Set(ratesData.map((r) => r.Currency_Code)))
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
          setCurrencies(uniqueCurrencies)
        }

        const { data: eurData } = await supabase
          .from('exchange_rates')
          .select('Operational_Rate')
          .eq('Currency_Code', 'EUR')
          .order('Effective_Date', { ascending: false })
          .limit(1)
          .single()

        if (eurData?.Operational_Rate) {
          setEurRate(eurData.Operational_Rate)
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDropdownData()
  }, [])

  const expenses = formData.expenses || []

  const handleAddExpense = () => {
    const newExpense = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      description: '',
      currency: 'EUR',
      amount: 0,
      exchangeRate: 1,
      amountEuros: 0,
    }
    onChange({ expenses: [...expenses, newExpense] })
  }

  const handleRemoveExpense = (indexToRemove: number) => {
    onChange({ expenses: expenses.filter((_: any, i: number) => i !== indexToRemove) })
  }

  const calcEuros = (amount: number, rate: number, currency: string) => {
    if (currency === 'EUR') return amount
    if (currency === 'USD') return parseFloat((amount * eurRate).toFixed(2))
    const amountUsd = amount / (rate || 1)
    return parseFloat((amountUsd * eurRate).toFixed(2))
  }

  const getCalculatedRate = (rate: number, currency: string) => {
    if (currency === 'EUR') return 1
    if (currency === 'USD') return eurRate
    return (1 / (rate || 1)) * eurRate
  }

  const handleExpenseChange = async (index: number, field: string, value: any) => {
    let newExpenses = [...expenses]
    if (!newExpenses[index]) return
    const expense = { ...newExpenses[index], [field]: value }

    if (field === 'currency') {
      if (value === 'EUR') {
        expense.exchangeRate = 1
        expense.amountEuros = expense.amount || 0
      } else {
        const { data } = await supabase
          .from('exchange_rates')
          .select('Operational_Rate')
          .eq('Currency_Code', value)
          .order('Effective_Date', { ascending: false })
          .limit(1)
          .single()

        const rate = data?.Operational_Rate || 1
        expense.exchangeRate = rate
        expense.amountEuros = calcEuros(expense.amount || 0, rate, value)
      }
      expense.usdToEurRate = eurRate
      expense.calculatedRate = getCalculatedRate(expense.exchangeRate, value)
    } else if (field === 'amount') {
      const amount = parseFloat(value) || 0
      expense.amount = amount
      expense.usdToEurRate = eurRate
      expense.calculatedRate = getCalculatedRate(expense.exchangeRate || 1, expense.currency)
      expense.amountEuros = calcEuros(amount, expense.exchangeRate || 1, expense.currency)
    } else if (field === 'exchangeRate') {
      const rate = parseFloat(value) || 1
      expense.exchangeRate = rate
      expense.usdToEurRate = eurRate
      expense.calculatedRate = getCalculatedRate(rate, expense.currency)
      expense.amountEuros = calcEuros(expense.amount || 0, rate, expense.currency)
    }

    newExpenses[index] = expense
    onChange({ expenses: newExpenses })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Expense Details</h3>
        {!readOnly && (
          <Button
            onClick={handleAddExpense}
            variant="outline"
            size="sm"
            className="text-[#4a8ebf] border-[#4a8ebf]"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Expense
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {expenses.map((expense: any, index: number) => (
          <div
            key={expense.id || index}
            className="p-4 border border-border rounded-lg bg-muted/10 relative"
          >
            {!readOnly && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10 z-10"
                onClick={() => handleRemoveExpense(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <div
              className={cn(
                'grid grid-cols-1 md:grid-cols-2 gap-4 mt-2',
                user?.role === 'qc' ||
                  user?.role === 'finance' ||
                  user?.role === 'co' ||
                  user?.role === 'admin'
                  ? 'lg:grid-cols-[130px_1fr_120px_120px_100px_120px_130px]'
                  : 'lg:grid-cols-[160px_1fr_100px_140px_160px]',
              )}
            >
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  disabled={readOnly}
                  value={expense.date || ''}
                  onChange={(e) => handleExpenseChange(index, 'date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  disabled={readOnly}
                  value={expense.description || ''}
                  placeholder="Expense description"
                  onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
                />
              </div>

              {(user?.role === 'qc' ||
                user?.role === 'finance' ||
                user?.role === 'co' ||
                user?.role === 'admin') && (
                <>
                  <div className="space-y-2">
                    <Label>Account</Label>
                    <Select
                      disabled={readOnly && user?.role !== 'qc'}
                      value={expense.account || ''}
                      onValueChange={(val) => handleExpenseChange(index, 'account', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts?.map((a) => (
                          <SelectItem key={a.id} value={a.code || a.id}>
                            {a.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Workorder</Label>
                    <Select
                      disabled={readOnly && user?.role !== 'qc'}
                      value={expense.workorder || ''}
                      onValueChange={(val) => handleExpenseChange(index, 'workorder', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Workorder" />
                      </SelectTrigger>
                      <SelectContent>
                        {workorders?.map((w) => (
                          <SelectItem key={w.id} value={w.code || w.id}>
                            {w.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  disabled={readOnly || isLoading}
                  value={expense.currency || ''}
                  onValueChange={(val) => handleExpenseChange(index, 'currency', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    {currencies
                      .filter((c) => c !== 'EUR')
                      .map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="text"
                  disabled={readOnly}
                  value={
                    typeof expense.amount === 'number'
                      ? expense.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ''
                  }
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '')
                    if (!val) val = '0'
                    const num = parseInt(val, 10) / 100
                    handleExpenseChange(index, 'amount', num)
                  }}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label>Amount in EUR</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-background flex items-center justify-between font-bold text-foreground">
                  <span className="text-muted-foreground mr-1">€</span>
                  <span>
                    {Number(expense.amountEuros || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {user?.role !== 'requester' && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Exchange Rate Applied (to USD):</span>
                    <span className="font-mono font-medium">{expense.exchangeRate || 1}</span>
                  </div>
                  {expense.currency !== 'EUR' && (
                    <div className="flex items-center gap-4">
                      <span>USD to EUR Rate:</span>
                      <span className="font-mono font-medium">
                        {expense.usdToEurRate || eurRate}
                      </span>
                    </div>
                  )}
                  {expense.currency !== 'EUR' && (
                    <div className="flex items-center gap-4">
                      <span>Final Rate (Local to EUR):</span>
                      <span className="font-mono font-medium text-[#4a8ebf]">
                        {expense.calculatedRate
                          ? expense.calculatedRate.toFixed(6)
                          : (
                              (1 / (expense.exchangeRate || 1)) *
                              (expense.usdToEurRate || eurRate)
                            ).toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {expenses.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
            {isLoading ? 'Loading expense options...' : 'No expenses added yet.'}
          </div>
        )}
      </div>

      {expenses.length > 0 && (
        <div className="flex justify-end p-4 bg-muted/30 rounded-lg mt-4 border border-border">
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Total Reimbursement Amount</div>
            <div className="text-2xl font-bold text-[#4a8ebf]">
              €{' '}
              {expenses
                .reduce((sum: number, e: any) => sum + (Number(e.amountEuros) || 0), 0)
                .toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
