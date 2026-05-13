'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createTransaction } from '@/lib/api'
import type { Category } from '@/lib/types'
import { toastError } from '@/lib/toast'
import FormField, { inputClass, selectClass } from '@/components/FormField'

export default function NewTransactionForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [categoryId, setCategoryId] = useState(categories[0]?.id.toString() ?? '')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setLoading(true)
    try {
      await createTransaction({
        amount: parseFloat(amount),
        type,
        category_id: Number(categoryId),
        date: date || undefined,
        description: description || null,
      })
      router.push('/transactions')
      router.refresh()
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/transactions" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          ← Back to Transactions
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">New Transaction</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Amount">
            <input
              className={inputClass}
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </FormField>

          <FormField label="Type">
            <select className={selectClass} value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </FormField>
        </div>

        <FormField label="Category">
          <select className={selectClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            {categories.length === 0 && <option value="">No categories — create one first</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date">
            <input
              className={inputClass}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>

          <FormField label="Description">
            <input
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
            />
          </FormField>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || categories.length === 0}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
          <Link href="/transactions" className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
