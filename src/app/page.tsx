import Link from 'next/link'

const sections = [
  {
    href: '/transactions',
    label: 'Transactions',
    description: 'Income and expense records',
    icon: '↕',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    iconColor: 'text-blue-600 bg-blue-100',
  },
  {
    href: '/categories',
    label: 'Categories',
    description: 'Classify your transactions',
    icon: '⊞',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    iconColor: 'text-purple-600 bg-purple-100',
  },
  {
    href: '/budgets',
    label: 'Budgets',
    description: 'Monthly spending limits per category',
    icon: '◎',
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    iconColor: 'text-emerald-600 bg-emerald-100',
  },
  {
    href: '/documents',
    label: 'Documents',
    description: 'PDF semantic search via RAG',
    icon: '⊡',
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    iconColor: 'text-amber-600 bg-amber-100',
  },
]

export default function Home() {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-500 text-sm">Personal finance API with LLM integration via MCP and RAG.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {sections.map(({ href, label, description, icon, color, iconColor }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-xl border-2 p-5 sm:p-6 transition-all ${color} group`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3 sm:mb-4 ${iconColor}`}>
              {icon}
            </div>
            <h2 className="font-semibold text-slate-900 mb-1">{label}</h2>
            <p className="text-sm text-slate-600">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
