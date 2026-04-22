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

export function ExpenseDetails({ formData, onChange, readOnly }: any) {
  const [currencies, setCurrencies] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()

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

  const handleRemoveExpense = (id: string) => {
    onChange({ expenses: expenses.filter((e: any) => e.id !== id) })
  }

  const handleExpenseChange = async (id: string, field: string, value: any) => {
    let newExpenses = [...expenses]
    const index = newExpenses.findIndex((e: any) => e.id === id)
    if (index === -1) return

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

        if (data?.Operational_Rate) {
          expense.exchangeRate = data.Operational_Rate
          expense.amountEuros = parseFloat(
            ((expense.amount || 0) / data.Operational_Rate).toFixed(2),
          )
        } else {
          expense.exchangeRate = 1
          expense.amountEuros = expense.amount || 0
        }
      }
    } else if (field === 'amount') {
      const amount = parseFloat(value) || 0
      expense.amount = amount
      expense.amountEuros = parseFloat((amount / (expense.exchangeRate || 1)).toFixed(2))
    } else if (field === 'exchangeRate') {
      const rate = parseFloat(value) || 1
      expense.exchangeRate = rate
      expense.amountEuros = parseFloat(((expense.amount || 0) / rate).toFixed(2))
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
                onClick={() => handleRemoveExpense(expense.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mt-2">
              <div className="space-y-2 lg:col-span-1">
                <Label>Date</Label>
                <Input
                  type="date"
                  disabled={readOnly}
                  value={expense.date || ''}
                  onChange={(e) => handleExpenseChange(expense.id, 'date', e.target.value)}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label>Description</Label>
                <Input
                  disabled={readOnly}
                  value={expense.description || ''}
                  placeholder="Expense description"
                  onChange={(e) => handleExpenseChange(expense.id, 'description', e.target.value)}
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <Label>Currency</Label>
                <Select
                  disabled={readOnly || isLoading}
                  value={expense.currency || ''}
                  onValueChange={(val) => handleExpenseChange(expense.id, 'currency', val)}
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

              <div className="space-y-2 lg:col-span-1">
                <Label>Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={readOnly}
                  value={expense.amount || ''}
                  onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label>Amount in EUR</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-background flex items-center font-bold text-foreground">
                  € {Number(expense.amountEuros || 0).toFixed(2)}
                </div>
              </div>
            </div>

            {user?.role !== 'requester' && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Exchange Rate Applied:</span>
                  <span className="font-mono font-medium">{expense.exchangeRate || 1}</span>
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
