'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Swal from 'sweetalert2'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

interface Props {
  id: number
  apiPath: string
  label?: string
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json()
    const detail = body?.detail
    if (typeof detail === 'object') return detail?.detail ?? detail?.title ?? 'Error'
    if (typeof detail === 'string') return detail
  } catch {}
  return `Error ${res.status}`
}

export default function DeleteButton({ id, apiPath, label = 'Delete' }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handle() {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#e2e8f0',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      customClass: { cancelButton: '!text-slate-700' },
    })

    if (!result.isConfirmed) return

    setLoading(true)
    try {
      const res = await fetch(`${BASE}${apiPath}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const message = await parseErrorMessage(res)
        Swal.fire({ icon: 'error', title: 'Could not delete', text: message, confirmButtonColor: '#0f172a' })
        return
      }
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' })
      router.refresh()
    } catch {
      Swal.fire({ icon: 'error', title: 'Network error', text: 'Could not reach the server.', confirmButtonColor: '#0f172a' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50 transition-colors"
    >
      {loading ? '...' : label}
    </button>
  )
}
