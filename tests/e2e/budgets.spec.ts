import { test, expect } from '@playwright/test'
import { confirmSwal } from './helpers'

test.describe('Budgets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill('Budget Category')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')
  })

  test('creates a budget and shows it in the list', async ({ page }) => {
    await page.goto('/budgets/new')

    await page.getByLabel('Category').selectOption('Budget Category')
    await page.getByLabel('Monthly Limit').fill('5000')
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL('/budgets')
    await expect(page.getByText('$5000.00')).toBeVisible()
  })

  test('deletes a budget', async ({ page }) => {
    await page.goto('/budgets/new')
    await page.getByLabel('Category').selectOption('Budget Category')
    await page.getByLabel('Monthly Limit').fill('1000')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/budgets')

    const initialCount = await page.getByRole('row').count()
    await page.getByRole('button', { name: 'Delete' }).first().click()
    await confirmSwal(page)

    await expect(page.getByRole('row')).toHaveCount(initialCount - 1)
  })
})
