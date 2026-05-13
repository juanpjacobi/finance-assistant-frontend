import { listCategories } from '@/lib/api'
import NewTransactionForm from './NewTransactionForm'

export default async function NewTransactionPage() {
  const categories = await listCategories()
  return <NewTransactionForm categories={categories} />
}
