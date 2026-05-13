import { listCategories } from '@/lib/api'
import NewBudgetForm from './NewBudgetForm'

export default async function NewBudgetPage() {
  const categories = await listCategories()
  return <NewBudgetForm categories={categories} />
}
