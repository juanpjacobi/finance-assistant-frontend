export interface Category {
  id: number
  name: string
  description: string | null
}

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: number
  amount: number
  type: TransactionType
  date: string
  description: string | null
  category_id: number
  created_at: string
}

export interface TransactionSummary {
  date_from: string
  date_to: string
  total_income: number
  total_expenses: number
  balance: number
}

export type DocumentStatus = 'processing' | 'ready' | 'error'

export interface Document {
  id: number
  filename: string
  status: DocumentStatus
  uploaded_at: string
}

export interface DocumentQueryResult {
  question: string
  answer: string
}

export interface Budget {
  id: number
  category_id: number
  monthly_limit: number
  month: string
  created_at: string
}

export interface BudgetStatus {
  budget: Budget
  spent: number
  remaining: number
  exceeded: boolean
}

export interface Problem {
  type: string
  title: string
  status: number
  detail?: string
}
