import { useTranslation } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useMasterDataStore from '@/stores/useMasterDataStore'
import { CrudTable } from '@/components/master-data/CrudTable'
import { RequesterManager } from '@/components/master-data/RequesterManager'
import { SystemUsersManager } from '@/components/master-data/SystemUsersManager'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export default function MasterData() {
  const { t } = useTranslation()
  const store = useMasterDataStore()

  const tabs = [
    {
      key: 'exchangeRates',
      label: 'Exchange Rates',
      data: store.exchangeRates,
      cols: [
        { key: 'currency', label: 'Currency' },
        { key: 'rateToUsd', label: 'Rate to USD', type: 'number' },
      ],
      tpl: { currency: '', rateToUsd: 1 },
    },
    {
      key: 'events',
      label: 'Events Matrix',
      data: store.events,
      cols: [
        { key: 'name', label: 'Name' },
        { key: 'costCenter', label: 'Cost Center' },
        { key: 'account', label: 'Account' },
        { key: 'workorder', label: 'Workorder' },
      ],
      tpl: { name: '', costCenter: '', account: '', workorder: '' },
    },
    {
      key: 'countries',
      label: 'Countries',
      data: store.countries,
      cols: [{ key: 'name', label: 'Country Name' }],
      tpl: { name: '' },
    },
    {
      key: 'costCenters',
      label: 'Cost Centers',
      data: store.costCenters,
      cols: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
      ],
      tpl: { code: '', name: '' },
    },
    {
      key: 'accounts',
      label: 'Accounts',
      data: store.accounts,
      cols: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
      ],
      tpl: { code: '', name: '' },
    },
    {
      key: 'workorders',
      label: 'Workorders',
      data: store.workorders,
      cols: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
      ],
      tpl: { code: '', name: '' },
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up pb-20">
      <h1 className="text-3xl font-serif font-bold text-[#4a8ebf]">{t('masterData')}</h1>

      <Tabs defaultValue="systemUsers" className="w-full mt-8">
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <TabsList className="h-12 justify-start bg-muted/50 p-1">
            <TabsTrigger
              value="systemUsers"
              className="px-6 h-full data-[state=active]:bg-background"
            >
              System Users
            </TabsTrigger>
            <TabsTrigger
              value="requesters"
              className="px-6 h-full data-[state=active]:bg-background"
            >
              Requesters
            </TabsTrigger>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="px-6 h-full data-[state=active]:bg-background"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

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

        {tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-2">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-[#4a8ebf]">{tab.label}</CardTitle>
                <CardDescription>
                  Manage your {tab.label.toLowerCase()} records in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CrudTable
                  columns={tab.cols as any}
                  data={tab.data}
                  onChange={(newData) => store.updateData(tab.key as any, newData)}
                  newItemTemplate={tab.tpl}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
