import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import useAuthStore from './useAuthStore'

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
  Country: string
  Currency: string | null
  Currency_Code: string
  Effective_Date: string | null
  Operational_Rate: number | null
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
  fetchMasterData: () => Promise<void>
}

const initialData: MasterDataState = {
  events: [],
  exchangeRates: [],
  countries: [],
  costCenters: [],
  accounts: [],
  workorders: [],
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
  const [state, setState] = useState<MasterDataState>(initialData)
  const { user } = useAuthStore()

  const fetchMasterData = async () => {
    if (!user) return
    try {
      const [
        { data: events },
        { data: exchangeRates },
        { data: countries },
        { data: costCenters },
        { data: accounts },
        { data: workorders },
        { data: smtpSettings },
      ] = await Promise.all([
        supabase.from('events').select('*'),
        supabase.from('exchange_rates').select('*'),
        supabase.from('countries').select('*'),
        supabase.from('cost_centers').select('*'),
        supabase.from('accounts').select('*'),
        supabase.from('workorders').select('*'),
        supabase.from('smtp_settings').select('*'),
      ])

      setState((prev) => ({
        ...prev,
        events: (events as EventDetail[]) || [],
        exchangeRates: (exchangeRates as ExchangeRate[]) || [],
        countries: (countries as Country[]) || [],
        costCenters: (costCenters as CostCenter[]) || [],
        accounts: (accounts as Account[]) || [],
        workorders: (workorders as Workorder[]) || [],
        smtpSettings: smtpSettings?.[0]
          ? {
              host: smtpSettings[0].host,
              port: smtpSettings[0].port,
              user: smtpSettings[0].user,
              password: smtpSettings[0].password,
              fromEmail: smtpSettings[0].fromEmail,
              encryption: smtpSettings[0].encryption as any,
            }
          : prev.smtpSettings,
      }))
    } catch (error) {
      console.error('Fetch master data error:', error)
    }
  }

  useEffect(() => {
    fetchMasterData()
  }, [user])

  const updateData = async (key: keyof MasterDataState, data: any) => {
    setState((prev) => ({ ...prev, [key]: data }))
  }

  return (
    <MasterDataContext.Provider value={{ ...state, updateData, fetchMasterData }}>
      {children}
    </MasterDataContext.Provider>
  )
}

export default function useMasterDataStore() {
  const context = useContext(MasterDataContext)
  if (!context) throw new Error('useMasterDataStore must be used within MasterDataProvider')
  return context
}
