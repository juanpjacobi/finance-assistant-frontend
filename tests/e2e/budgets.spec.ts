import { test, expect } from '@playwright/test'
import { confirmSwal, resetDatabase } from './helpers'

test.describe('Budgets', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase()
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill('Ahorro')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')
  })

  test('shows empty state on clean database', async ({ page }) => {
    await page.goto('/budgets')
    await expect(page.getByText('No budgets yet.')).toBeVisible()
  })

  test('creates a budget and shows it in the list', async ({ page }) => {
    await page.goto('/budgets/new')
    await page.getByLabel('Category').selectOption('Ahorro')
    await page.getByLabel('Monthly Limit').fill('5000')
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL('/budgets')
    await expect(page.getByText('$5000.00')).toBeVisible()
  })

  test('deletes a budget', async ({ page }) => {
    await page.goto('/budgets/new')
    await page.getByLabel('Category').selectOption('Ahorro')
    await page.getByLabel('Monthly Limit').fill('1000')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/budgets')

    await page.getByRole('button', { name: 'Delete' }).click()
    await confirmSwal(page)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('No budgets yet.')).toBeVisible()
  })
})
