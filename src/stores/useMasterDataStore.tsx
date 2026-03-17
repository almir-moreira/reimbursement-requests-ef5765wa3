import { createContext, useContext, useState, ReactNode } from 'react'

export interface EventDetail {
  id: string
  name: string
  costCenter: string
  account: string
  workorder: string
}

export interface ExchangeRate {
  currency: string
  rateToUsd: number
}

interface MasterDataContextData {
  events: EventDetail[]
  exchangeRates: ExchangeRate[]
  countries: string[]
}

const initialEvents = [
  { id: 'Workshop', name: 'Workshop', costCenter: 'Events', account: 'ACC-01', workorder: 'WO-01' },
  {
    id: 'Conference',
    name: 'Conference',
    costCenter: 'Events',
    account: 'ACC-02',
    workorder: 'WO-02',
  },
]

const initialRates = [
  { currency: 'KES', rateToUsd: 0.0076 },
  { currency: 'EUR', rateToUsd: 1.08 },
  { currency: 'USD', rateToUsd: 1 },
]

const initialCountries = ['Kenya', 'Portugal', 'USA', 'Egypt', 'UAE']

const MasterDataContext = createContext<MasterDataContextData | undefined>(undefined)

export function MasterDataProvider({ children }: { children: ReactNode }) {
  const [events] = useState<EventDetail[]>(initialEvents)
  const [exchangeRates] = useState<ExchangeRate[]>(initialRates)
  const [countries] = useState<string[]>(initialCountries)

  return (
    <MasterDataContext.Provider value={{ events, exchangeRates, countries }}>
      {children}
    </MasterDataContext.Provider>
  )
}

export default function useMasterDataStore() {
  const context = useContext(MasterDataContext)
  if (!context) throw new Error('useMasterDataStore must be used within MasterDataProvider')
  return context
}
