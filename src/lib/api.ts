import type {
  Category,
  Transaction,
  TransactionSummary,
  Document,
  DocumentQueryResult,
  Budget,
  BudgetStatus,
} from '@/lib/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (res.status === 204) return undefined as T
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.detail?.detail ?? err?.detail ?? res.statusText)
  }
  return res.json()
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function listCategories(): Promise<Category[]> {
  return request('/categories')
}

export function createCategory(body: { name: string; description?: string | null }): Promise<Category> {
  return request('/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function getCategory(id: number): Promise<Category> {
  return request(`/categories/${id}`)
}

export function updateCategory(id: number, body: { name?: string; description?: string | null }): Promise<Category> {
  return request(`/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function deleteCategory(id: number): Promise<void> {
  return request(`/categories/${id}`, { method: 'DELETE' })
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export function listTransactions(params?: {
  type?: 'income' | 'expense'
  category_id?: number
  date_from?: string
  date_to?: string
}): Promise<Transaction[]> {
  const qs = new URLSearchParams()
  if (params?.type) qs.set('type', params.type)
  if (params?.category_id) qs.set('category_id', String(params.category_id))
  if (params?.date_from) qs.set('date_from', params.date_from)
  if (params?.date_to) qs.set('date_to', params.date_to)
  const query = qs.toString() ? `?${qs}` : ''
  return request(`/transactions${query}`)
}

export function createTransaction(body: {
  amount: number
  type: 'income' | 'expense'
  category_id: number
  date?: string
  description?: string | null
}): Promise<Transaction> {
  return request('/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function getTransaction(id: number): Promise<Transaction> {
  return request(`/transactions/${id}`)
}

export function updateTransaction(id: number, body: {
  amount?: number
  type?: 'income' | 'expense'
  date?: string
  description?: string | null
  category_id?: number
}): Promise<Transaction> {
  return request(`/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function deleteTransaction(id: number): Promise<void> {
  return request(`/transactions/${id}`, { method: 'DELETE' })
}

export function getTransactionSummary(params: { date_from: string; date_to: string }): Promise<TransactionSummary> {
  const qs = new URLSearchParams(params)
  return request(`/transactions/summary?${qs}`)
}

// ─── Budgets ──────────────────────────────────────────────────────────────────

export function listBudgets(params?: { month?: string; category_id?: number }): Promise<Budget[]> {
  const qs = new URLSearchParams()
  if (params?.month) qs.set('month', params.month)
  if (params?.category_id) qs.set('category_id', String(params.category_id))
  const query = qs.toString() ? `?${qs}` : ''
  return request(`/budgets${query}`)
}

export function createBudget(body: { category_id: number; monthly_limit: number; month: string }): Promise<Budget> {
  return request('/budgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function getBudget(id: number): Promise<Budget> {
  return request(`/budgets/${id}`)
}

export function deleteBudget(id: number): Promise<void> {
  return request(`/budgets/${id}`, { method: 'DELETE' })
}

export function getBudgetStatus(id: number): Promise<BudgetStatus> {
  return request(`/budgets/${id}/status`)
}

// ─── Documents ────────────────────────────────────────────────────────────────

export function uploadDocument(file: File): Promise<Document> {
  const form = new FormData()
  form.append('file', file)
  return request('/documents', { method: 'POST', body: form })
}

export function queryDocument(id: number, question: string): Promise<DocumentQueryResult> {
  return request(`/documents/${id}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })
}
