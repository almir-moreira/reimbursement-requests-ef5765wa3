import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Upload, RefreshCw, FileSpreadsheet } from 'lucide-react'

export function ExchangeRatesManager() {
  const [rates, setRates] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    const [ratesRes, logsRes] = await Promise.all([
      supabase.from('exchange_rates').select('*').order('Country'),
      supabase
        .from('exchange_rates_log')
        .select('*, imported_by(name)')
        .order('imported_at', { ascending: false })
        .limit(5),
    ])

    if (ratesRes.data) setRates(ratesRes.data)
    if (logsRes.data) setLogs(logsRes.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-exchange-rates`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: formData,
        },
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to import')
      }

      toast({
        title: 'Success',
        description: `Successfully imported ${data.processed} exchange rates.`,
      })
      fetchData()
    } catch (error: any) {
      toast({
        title: 'Import Failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Current Exchange Rates</h3>
          <p className="text-sm text-muted-foreground">
            Upload an Excel (.xlsx) file to update the rates. Format: Country, Currency, Currency
            Code, Effective Date, Rate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading || uploading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="relative">
            <Input
              type="file"
              accept=".xlsx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button size="sm" disabled={uploading}>
              {uploading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? 'Importing...' : 'Import Rates'}
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Currency Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead className="text-right">Operational Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : rates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No exchange rates found. Please import an Excel file.
                </TableCell>
              </TableRow>
            ) : (
              rates.map((rate) => (
                <TableRow key={rate.Country}>
                  <TableCell className="font-medium">{rate.Currency_Code}</TableCell>
                  <TableCell>{rate.Country}</TableCell>
                  <TableCell>{rate.Currency}</TableCell>
                  <TableCell>{rate.Effective_Date}</TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {rate.Operational_Rate.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {logs.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
            Recent Imports
          </h4>
          <div className="text-sm border rounded-md p-4 bg-muted/20 space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex justify-between items-center py-1 border-b last:border-0 border-border"
              >
                <span className="text-muted-foreground">
                  {new Date(log.imported_at).toLocaleString()}
                </span>
                <span>
                  <span className="font-medium">{log.processed_rows} rows</span> imported by{' '}
                  {log.imported_by?.name || 'Unknown'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
