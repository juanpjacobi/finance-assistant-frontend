import { test, expect } from '@playwright/test'
import { confirmSwal } from './helpers'

test.describe('Transactions', () => {
  async function createCategory(page: any): Promise<string> {
    const name = `TxCat-${Date.now()}`
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill(name)
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')
    return name
  }

  test('creates a transaction and shows it in the list', async ({ page }) => {
    const categoryName = await createCategory(page)
    await page.goto('/transactions/new')

    const desc = `Supermercado-${Date.now()}`
    await page.getByLabel('Amount').fill('1500')
    await page.getByLabel('Type').selectOption('expense')
    await page.getByLabel('Category').selectOption(categoryName)
    await page.getByLabel('Description').fill(desc)
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL('/transactions')
    await expect(page.getByText(desc)).toBeVisible()
  })

  test('deletes a transaction', async ({ page }) => {
    const categoryName = await createCategory(page)
    await page.goto('/transactions/new')
    await page.getByLabel('Amount').fill('500')
    await page.getByLabel('Category').selectOption(categoryName)
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/transactions')

    await expect(page.getByText('-$500.00')).toBeVisible()
    const row = page.getByRole('row', { name: /-\$500\.00/ })
    await row.getByRole('button', { name: 'Delete' }).click()
    await confirmSwal(page)
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('row', { name: /-\$500\.00/ })).not.toBeVisible()
  })
})
