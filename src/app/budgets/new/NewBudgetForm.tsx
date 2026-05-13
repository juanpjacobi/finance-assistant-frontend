'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBudget } from '@/lib/api'
import type { Category } from '@/lib/types'
import { toastError } from '@/lib/toast'
import FormField, { inputClass, selectClass } from '@/components/FormField'

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function NewBudgetForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [categoryId, setCategoryId] = useState(categories[0]?.id.toString() ?? '')
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [month, setMonth] = useState(currentMonth())
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setLoading(true)
    try {
      await createBudget({
        category_id: Number(categoryId),
        monthly_limit: parseFloat(monthlyLimit),
        month,
      })
      router.push('/budgets')
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
        <Link href="/budgets" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          ← Back to Budgets
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">New Budget</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        <FormField label="Category">
          <select className={selectClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            {categories.length === 0 && <option value="">No categories — create one first</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Monthly Limit">
            <input
              className={inputClass}
              type="number"
              min="0"
              step="0.01"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="0.00"
              required
            />
          </FormField>

          <FormField label="Month">
            <input
              className={inputClass}
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
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
          <Link href="/budgets" className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
