import { Page } from '@playwright/test'

export async function confirmSwal(page: Page) {
  await page.locator('.swal2-confirm').click()
}
