import { test, expect } from '@playwright/test'
import { confirmSwal } from './helpers'

test.describe('Budgets', () => {
  async function createCategory(page: any): Promise<string> {
    const name = `BudCat-${Date.now()}`
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill(name)
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')
    return name
  }

  test('creates a budget and shows it in the list', async ({ page }) => {
    const categoryName = await createCategory(page)
    await page.goto('/budgets/new')

    await page.getByLabel('Category').selectOption(categoryName)
    await page.getByLabel('Monthly Limit').fill('5000')
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL('/budgets')
    await expect(page.getByText('$5000.00').first()).toBeVisible()
  })

  test('deletes a budget', async ({ page }) => {
    const categoryName = await createCategory(page)
    await page.goto('/budgets/new')
    await page.getByLabel('Category').selectOption(categoryName)
    await page.getByLabel('Monthly Limit').fill('1234')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/budgets')

    await expect(page.getByText('$1234.00')).toBeVisible()
    const row = page.getByRole('row', { name: /\$1234\.00/ })
    await row.getByRole('button', { name: 'Delete' }).click()
    await confirmSwal(page)
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('row', { name: /\$1234\.00/ })).not.toBeVisible()
  })
})
