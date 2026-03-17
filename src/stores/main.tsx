import React, { ReactNode } from 'react'
import { AuthProvider } from './useAuthStore'
import { MasterDataProvider } from './useMasterDataStore'
import { ReimbursementProvider } from './useReimbursementStore'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MasterDataProvider>
        <ReimbursementProvider>{children}</ReimbursementProvider>
      </MasterDataProvider>
    </AuthProvider>
  )
}
