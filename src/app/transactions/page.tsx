import Link from 'next/link'
import { listTransactions } from '@/lib/api'
import type { Transaction } from '@/lib/types'
import DeleteButton from '@/components/DeleteButton'

export default async function TransactionsPage() {
  const transactions: Transaction[] = await listTransactions()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">{transactions.length} total</p>
        </div>
        <Link
          href="/transactions/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors shrink-0"
        >
          + New
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-150">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-700 w-16">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Type</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Description</th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-slate-400 text-center">
                    No transactions yet.{' '}
                    <Link href="/transactions/new" className="text-slate-600 underline">Create one</Link>
                  </td>
                </tr>
              )}
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{t.id}</td>
                  <td className="px-4 py-3 text-slate-700">{t.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.type === 'income' ? '▲' : '▼'} {t.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono font-semibold ${
                    t.type === 'income' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">#{t.category_id}</td>
                  <td className="px-4 py-3 text-slate-600">{t.description ?? <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton id={t.id} apiPath="/transactions" />
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
