import Link from 'next/link'
import { listBudgets } from '@/lib/api'
import type { Budget } from '@/lib/types'
import DeleteButton from '@/components/DeleteButton'

export default async function BudgetsPage() {
  const budgets: Budget[] = await listBudgets()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Budgets</h1>
          <p className="text-slate-500 text-sm mt-1">{budgets.length} total</p>
        </div>
        <Link
          href="/budgets/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors shrink-0"
        >
          + New
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-96">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-700 w-16">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Month</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Category</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">Monthly Limit</th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {budgets.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-slate-400 text-center">
                    No budgets yet.{' '}
                    <Link href="/budgets/new" className="text-slate-600 underline">Create one</Link>
                  </td>
                </tr>
              )}
              {budgets.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{b.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{b.month}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">#{b.category_id}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">
                    ${b.monthly_limit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton id={b.id} apiPath="/budgets" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
