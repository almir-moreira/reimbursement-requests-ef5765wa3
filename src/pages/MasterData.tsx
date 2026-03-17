import { useTranslation } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useMasterDataStore from '@/stores/useMasterDataStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function MasterData() {
  const { t } = useTranslation()
  const { events, exchangeRates, countries } = useMasterDataStore()

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up">
      <h1 className="text-3xl font-serif font-bold text-primary">{t('masterData')}</h1>

      <Tabs defaultValue="rates" className="w-full mt-8">
        <TabsList className="mb-6 h-12 w-full justify-start bg-muted/50 p-1">
          <TabsTrigger value="rates" className="px-6 h-full data-[state=active]:bg-background">
            Exchange Rates
          </TabsTrigger>
          <TabsTrigger value="events" className="px-6 h-full data-[state=active]:bg-background">
            Events Details
          </TabsTrigger>
          <TabsTrigger value="countries" className="px-6 h-full data-[state=active]:bg-background">
            Countries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rates" className="mt-0">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Exchange Rates (vs USD)</CardTitle>
              <CardDescription>
                Manage currency conversion rates across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Currency Code</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exchangeRates.map((r) => (
                    <TableRow key={r.currency}>
                      <TableCell className="font-bold text-primary">{r.currency}</TableCell>
                      <TableCell className="font-mono">{r.rateToUsd}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-0">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Events Matrix</CardTitle>
              <CardDescription>Mapping of events to budget codes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Cost Center</TableHead>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Workorder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell>{e.costCenter}</TableCell>
                      <TableCell>
                        <span className="bg-muted px-2 py-1 rounded font-mono text-xs">
                          {e.account}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="bg-muted px-2 py-1 rounded font-mono text-xs">
                          {e.workorder}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries" className="mt-0">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Supported Countries</CardTitle>
              <CardDescription>List of available countries for requester profiles.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {countries.map((c) => (
                  <div
                    key={c}
                    className="bg-primary/5 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
