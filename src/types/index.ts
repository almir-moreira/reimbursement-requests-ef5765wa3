export type Role = 'requester' | 'qc' | 'co' | 'finance' | 'admin'
export type RequestStatus = 'Pending' | 'Checked' | 'Approved' | 'Processed' | 'Rejected'

export interface User {
  id: string
  name: string
  email: string
  password?: string
  role: Role
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  phone?: string
  organization?: string
  bankHolder?: string
  bankName?: string
  bankAccount?: string
  iban?: string
  bic?: string
  swift?: string
  bankCode?: string
  bankCountry?: string
  additionalBankInfo?: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  currency: string
  account?: string
  workorder?: string
  exchangeRate?: number
  amountUsd?: number
  amountEuros?: number
}

export interface Attachment {
  id: string
  description: string
  fileName: string
}

export interface HistoryLog {
  id: string
  date: string
  action: string
  userId: string
  comments?: string
}

export interface Signature {
  name: string
  date: string
  role: string
}

export interface ReimbursementRequest {
  id: string
  status: RequestStatus
  eventId: string
  costCenter?: string
  account?: string
  workorder?: string
  requesterId: string
  requesterDetails: Partial<User>
  expenses: Expense[]
  signature: string
  date: string
  attachments: Attachment[]
  history: HistoryLog[]
  qcSignature?: Signature | null
  coSignature?: Signature | null
  financeSignature?: Signature | null
  paymentReceipt?: string
}
