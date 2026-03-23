import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface EventDetail {
  id: string
  name: string
  costCenter: string
  account: string
  workorder: string
  qcName: string
  qcEmail: string
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
  coName: string
  coEmail: string
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

export interface SmtpSettings {
  host: string
  port: string
  user: string
  password?: string
  fromEmail: string
  encryption: 'SSL' | 'TLS' | 'None'
}

interface MasterDataState {
  events: EventDetail[]
  exchangeRates: ExchangeRate[]
  countries: Country[]
  costCenters: CostCenter[]
  accounts: Account[]
  workorders: Workorder[]
  smtpSettings: SmtpSettings
}

interface MasterDataContextData extends MasterDataState {
  updateData: (key: keyof MasterDataState, data: any) => void
}

const initialData: MasterDataState = {
  events: [
    {
      id: 'ev-1',
      name: 'Workshop',
      costCenter: 'CC-01',
      account: '62000',
      workorder: 'P1134-12',
      qcName: 'Quality Control',
      qcEmail: 'qc@kaiciid.org',
    },
    {
      id: 'ev-2',
      name: 'Conference',
      costCenter: 'CC-02',
      account: '62001',
      workorder: 'P1135-12',
      qcName: 'Jane Smith',
      qcEmail: 'jane.smith@kaiciid.org',
    },
  ],
  exchangeRates: [
    { id: 'r-1', currency: 'GBP', rateToUsd: 1.25 },
    { id: 'r-2', currency: 'EUR', rateToUsd: 1.08 },
    { id: 'r-3', currency: 'USD', rateToUsd: 1 },
    { id: 'r-4', currency: 'KES', rateToUsd: 0.0076 },
  ],
  countries: [
    { id: 'c-1', name: 'Kenya' },
    { id: 'c-2', name: 'Portugal' },
    { id: 'c-3', name: 'USA' },
    { id: 'c-4', name: 'UK' },
  ],
  costCenters: [
    {
      id: 'cc-1',
      code: 'CC-01',
      name: 'Operations',
      coName: 'Certifying Officer',
      coEmail: 'co@kaiciid.org',
    },
  ],
  accounts: [
    { id: 'a-1', code: '62000', name: 'Travel' },
    { id: 'a-2', code: '62001', name: 'Meals' },
  ],
  workorders: [{ id: 'w-1', code: 'P1134-12', name: 'Field Visit' }],
  smtpSettings: {
    host: 'smtp.gmail.com',
    port: '587',
    user: 'admin@kaiciid.org',
    password: '',
    fromEmail: 'noreply@kaiciid.org',
    encryption: 'TLS',
  },
}

const MasterDataContext = createContext<MasterDataContextData | undefined>(undefined)

export function MasterDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MasterDataState>(() => {
    try {
      const saved = localStorage.getItem('master_data_v6')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...initialData,
          ...parsed,
          smtpSettings: parsed.smtpSettings || initialData.smtpSettings,
        }
      }
    } catch {
      // ignore
    }
    return initialData
  })

  useEffect(() => {
    localStorage.setItem('master_data_v6', JSON.stringify(state))
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
