import { useEffect } from 'react'
import { CashPaymentRow, ReimbursementRequest } from '@/types'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useMasterDataStore from '@/stores/useMasterDataStore'

export function CashPaymentDetails({
  formData,
  onChange,
  readOnly,
}: {
  formData: Partial<ReimbursementRequest>
  onChange: (data: Partial<ReimbursementRequest>) => void
  readOnly: boolean
}) {
  const { exchangeRates } = useMasterDataStore()

  useEffect(() => {
    if (!formData.cashPaymentDetails || formData.cashPaymentDetails.length === 0) {
      const initialRows: CashPaymentRow[] = [
        { id: '1', currency: '', amount: 0, amountEuros: 0 },
        { id: '2', currency: '', amount: 0, amountEuros: 0 },
        { id: '3', currency: '', amount: 0, amountEuros: 0 },
        { id: 'round', currency: '', amount: 0, amountEuros: 0, isRound: true },
      ]
      onChange({ cashPaymentDetails: initialRows })
    }
  }, [formData.cashPaymentDetails, onChange])

  const details = formData.cashPaymentDetails || []

  const handleRowChange = (index: number, field: keyof CashPaymentRow, value: any) => {
    const updated = [...details]
    const row = { ...updated[index], [field]: value }

    if (field === 'currency' || field === 'amount') {
      const currency = field === 'currency' ? value : row.currency
      const amount = field === 'amount' ? value : row.amount

      let rate = 1
      if (currency && currency !== 'EUR') {
        const currencyRates = exchangeRates
          .filter((r) => r.Currency_Code === currency)
          .sort((a, b) => {
            if (!a.Effective_Date || !b.Effective_Date) return 0
            return new Date(b.Effective_Date).getTime() - new Date(a.Effective_Date).getTime()
          })
        rate = currencyRates[0]?.Operational_Rate || 1
      }

      const eurRates = exchangeRates
        .filter((r) => r.Currency_Code === 'EUR')
        .sort((a, b) => {
          if (!a.Effective_Date || !b.Effective_Date) return 0
          return new Date(b.Effective_Date).getTime() - new Date(a.Effective_Date).getTime()
        })
      const eurRate = eurRates[0]?.Operational_Rate || 1

      const calcEuros = (amt: number, rt: number, curr: string) => {
        if (curr === 'EUR') return amt
        if (curr === 'USD') return parseFloat((amt * eurRate).toFixed(2))
        const amountUsd = amt / (rt || 1)
        return parseFloat((amountUsd * eurRate).toFixed(2))
      }

      row.amountEuros = calcEuros(amount || 0, rate, currency)
    }

    updated[index] = row
    onChange({ cashPaymentDetails: updated })
  }

  const currencies = Array.from(new Set(exchangeRates.map((r) => r.Currency_Code)))
    .filter(Boolean)
    .sort()
  const totalEur = details.reduce((sum, row) => sum + (Number(row.amountEuros) || 0), 0)

  if (details.length === 0) return null

  return (
    <div className="space-y-4 pt-6 border-t border-border">
      <h3 className="font-serif font-bold text-xl text-[#4a8ebf]">Cash Payment</h3>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-20 text-center">No.</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Amount in EUR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((row, i) => (
              <TableRow key={row.id}>
                <TableCell className="text-center font-medium text-muted-foreground">
                  {row.isRound ? 'Round' : i + 1}
                </TableCell>
                <TableCell>
                  <select
                    disabled={readOnly}
                    value={row.currency}
                    onChange={(e) => handleRowChange(i, 'currency', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select currency</option>
                    <option value="EUR">EUR</option>
                    {currencies
                      .filter((c) => c !== 'EUR')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    disabled={readOnly}
                    value={row.amount || ''}
                    onChange={(e) => handleRowChange(i, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    disabled
                    value={row.amountEuros ? row.amountEuros.toFixed(2) : ''}
                    className="bg-muted/30 font-medium"
                    placeholder="0.00"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/20">
              <TableCell colSpan={3} className="text-right font-bold text-base py-4">
                Total EUR:
              </TableCell>
              <TableCell className="font-bold text-lg text-[#4a8ebf] py-4">
                {totalEur.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
