import Link from 'next/link'
import { listCategories } from '@/lib/api'
import type { Category } from '@/lib/types'
import DeleteButton from '@/components/DeleteButton'

export default async function CategoriesPage() {
  const categories: Category[] = await listCategories()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">{categories.length} total</p>
        </div>
        <Link
          href="/categories/new"
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
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Description</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-slate-400 text-center">
                    No categories yet.{' '}
                    <Link href="/categories/new" className="text-slate-600 underline">Create one</Link>
                  </td>
                </tr>
              )}
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.description ?? <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/categories/${c.id}/edit`} className="text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors">
                        Edit
                      </Link>
                      <DeleteButton id={c.id} apiPath="/categories" />
                    </div>
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
