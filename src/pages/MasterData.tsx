import { useTranslation } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useMasterDataStore from '@/stores/useMasterDataStore'
import useAuthStore from '@/stores/useAuthStore'
import { CrudTable } from '@/components/master-data/CrudTable'
import { RequesterManager } from '@/components/master-data/RequesterManager'
import { SystemUsersManager } from '@/components/master-data/SystemUsersManager'
import { ExchangeRatesManager } from '@/components/master-data/ExchangeRatesManager'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export default function MasterData() {
  const { t } = useTranslation()
  const store = useMasterDataStore()
  const { user } = useAuthStore()

  const tabsConfig = [
    { id: 'systemUsers', label: 'System Users', roles: ['admin'] },
    { id: 'requesters', label: 'Requesters', roles: ['admin', 'finance'] },
    { id: 'exchangeRates', label: 'Exchange Rates', roles: ['admin', 'finance'] },
    { id: 'events', label: 'Events Matrix', roles: ['admin', 'qc'] },
    { id: 'countries', label: 'Countries', roles: ['admin'] },
    { id: 'costCenters', label: 'Cost Centres', roles: ['admin'] },
    { id: 'accounts', label: 'Accounts', roles: ['admin'] },
    { id: 'workorders', label: 'Workorders', roles: ['admin'] },
  ]

  const visibleTabs = tabsConfig.filter((t) => t.roles.includes(user?.role || ''))
  const defaultTab = visibleTabs[0]?.id || ''

  const dynamicTabsData = [
    {
      key: 'events',
      tableName: 'events',
      data: store.events,
      cols: [
        { key: 'name', label: 'Name' },
        { key: 'cost_center', label: 'Cost Centre' },
        { key: 'account', label: 'Account' },
        { key: 'workorder', label: 'Workorder' },
        { key: 'qc_name', label: 'QC Name' },
        { key: 'qc_email', label: 'QC Email' },
      ],
      tpl: { name: '', cost_center: '', account: '', workorder: '', qc_name: '', qc_email: '' },
    },
    {
      key: 'countries',
      tableName: 'countries',
      data: store.countries,
      cols: [{ key: 'name', label: 'Country Name' }],
      tpl: { name: '' },
    },
    {
      key: 'costCenters',
      tableName: 'cost_centers',
      data: store.costCenters,
      cols: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'co_name', label: 'CO Name' },
        { key: 'co_email', label: 'CO Email' },
      ],
      tpl: { code: '', name: '', co_name: '', co_email: '' },
    },
    {
      key: 'accounts',
      tableName: 'accounts',
      data: store.accounts,
      cols: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
      ],
      tpl: { code: '', name: '' },
    },
    {
      key: 'workorders',
      tableName: 'workorders',
      data: store.workorders,
      cols: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
      ],
      tpl: { code: '', name: '' },
    },
  ]

  if (!defaultTab) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        You do not have permission to view Master Data.
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up pb-20">
      <h1 className="text-3xl font-serif font-bold text-[#4a8ebf]">{t('masterData')}</h1>

      <Tabs defaultValue={defaultTab} className="w-full mt-8">
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <TabsList className="h-12 justify-start bg-muted/50 p-1">
            {visibleTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-6 h-full data-[state=active]:bg-background"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {visibleTabs.find((t) => t.id === 'systemUsers') && (
          <TabsContent value="systemUsers" className="mt-2">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-[#4a8ebf]">System Users</CardTitle>
                <CardDescription>
                  Manage Quality Control, Certifying Officers, and Finance team members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemUsersManager />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {visibleTabs.find((t) => t.id === 'requesters') && (
          <TabsContent value="requesters" className="mt-2">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-[#4a8ebf]">Requesters</CardTitle>
                <CardDescription>
                  View and manage requester profiles and financial information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequesterManager />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {visibleTabs.find((t) => t.id === 'exchangeRates') && (
          <TabsContent value="exchangeRates" className="mt-2">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-[#4a8ebf]">Exchange Rates</CardTitle>
                <CardDescription>Manage exchange rates via Excel import.</CardDescription>
              </CardHeader>
              <CardContent>
                <ExchangeRatesManager />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {dynamicTabsData.map((dynTab) => {
          const tabConfig = visibleTabs.find((t) => t.id === dynTab.key)
          if (!tabConfig) return null

          return (
            <TabsContent key={dynTab.key} value={dynTab.key} className="mt-2">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-[#4a8ebf]">
                    {tabConfig.label}
                  </CardTitle>
                  <CardDescription>
                    Manage your {tabConfig.label.toLowerCase()} records in the system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CrudTable
                    columns={dynTab.cols as any}
                    data={dynTab.data}
                    tableName={dynTab.tableName}
                    newItemTemplate={dynTab.tpl}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
