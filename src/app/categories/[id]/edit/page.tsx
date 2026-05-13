import { getCategory } from '@/lib/api'
import EditCategoryForm from './EditCategoryForm'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategory(Number(id))
  return <EditCategoryForm category={category} />
}
