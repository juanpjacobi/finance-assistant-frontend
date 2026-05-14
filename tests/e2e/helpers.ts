import { Page, request } from '@playwright/test'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function confirmSwal(page: Page) {
  await page.locator('.swal2-confirm').click()
}

export async function resetDatabase() {
  const ctx = await request.newContext()
  await ctx.delete(`${API}/test/reset`)
  await ctx.dispose()
}
