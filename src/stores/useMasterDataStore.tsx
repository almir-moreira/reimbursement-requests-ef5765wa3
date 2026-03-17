import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface EventDetail {
  id: string
  name: string
  costCenter: string
  account: string
  workorder: string
}

export interface ExchangeRate {
  id: string
  currency: string
  rateToUsd: number
}

export interface Country {
  id: string
  name: string
}

export interface CostCenter {
  id: string
  code: string
  name: string
}

export interface Account {
  id: string
  code: string
  name: string
}

export interface Workorder {
  id: string
  code: string
  name: string
}

export interface RequesterProfile {
  id: string
  name: string
  email: string
  organization: string
}

interface MasterDataState {
  events: EventDetail[]
  exchangeRates: ExchangeRate[]
  countries: Country[]
  costCenters: CostCenter[]
  accounts: Account[]
  workorders: Workorder[]
  requesters: RequesterProfile[]
}

interface MasterDataContextData extends MasterDataState {
  updateData: (key: keyof MasterDataState, data: any) => void
}

const initialData: MasterDataState = {
  events: [
    { id: 'ev-1', name: 'Workshop', costCenter: 'CC-01', account: 'ACC-01', workorder: 'WO-01' },
    { id: 'ev-2', name: 'Conference', costCenter: 'CC-01', account: 'ACC-02', workorder: 'WO-02' },
  ],
  exchangeRates: [
    { id: 'r-1', currency: 'KES', rateToUsd: 0.0076 },
    { id: 'r-2', currency: 'EUR', rateToUsd: 1.08 },
    { id: 'r-3', currency: 'USD', rateToUsd: 1 },
  ],
  countries: [
    { id: 'c-1', name: 'Kenya' },
    { id: 'c-2', name: 'Portugal' },
    { id: 'c-3', name: 'USA' },
    { id: 'c-4', name: 'Egypt' },
    { id: 'c-5', name: 'UAE' },
  ],
  costCenters: [{ id: 'cc-1', code: 'CC-01', name: 'Operations' }],
  accounts: [
    { id: 'a-1', code: 'ACC-01', name: 'Travel' },
    { id: 'a-2', code: 'ACC-02', name: 'Meals' },
  ],
  workorders: [{ id: 'w-1', code: 'WO-01', name: 'Field Visit' }],
  requesters: [{ id: 'req-1', name: 'John Doe', email: 'john@example.com', organization: 'WHO' }],
}

const MasterDataContext = createContext<MasterDataContextData | undefined>(undefined)

export function MasterDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MasterDataState>(() => {
    try {
      const saved = localStorage.getItem('master_data_v2')
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return initialData
  })

  useEffect(() => {
    localStorage.setItem('master_data_v2', JSON.stringify(state))
  }, [state])

  const updateData = (key: keyof MasterDataState, data: any) => {
    setState((prev) => ({ ...prev, [key]: data }))
  }

  return (
    <MasterDataContext.Provider value={{ ...state, updateData }}>
      {children}
    </MasterDataContext.Provider>
  )
}

export default function useMasterDataStore() {
  const context = useContext(MasterDataContext)
  if (!context) throw new Error('useMasterDataStore must be used within MasterDataProvider')
  return context
}
