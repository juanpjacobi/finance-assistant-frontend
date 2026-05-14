import { test, expect } from '@playwright/test'
import { confirmSwal, resetDatabase } from './helpers'

test.describe('Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase()
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill('Gastos')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')
  })

  test('shows empty state on clean database', async ({ page }) => {
    await page.goto('/transactions')
    await expect(page.getByText('No transactions yet.')).toBeVisible()
  })

  test('creates a transaction and shows it in the list', async ({ page }) => {
    await page.goto('/transactions/new')
    await page.getByLabel('Amount').fill('1500')
    await page.getByLabel('Type').selectOption('expense')
    await page.getByLabel('Category').selectOption('Gastos')
    await page.getByLabel('Description').fill('Supermercado')
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL('/transactions')
    await expect(page.getByText('Supermercado')).toBeVisible()
    await expect(page.getByText('-$1500.00')).toBeVisible()
  })

  test('deletes a transaction', async ({ page }) => {
    await page.goto('/transactions/new')
    await page.getByLabel('Amount').fill('500')
    await page.getByLabel('Category').selectOption('Gastos')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/transactions')

    await page.getByRole('button', { name: 'Delete' }).click()
    await confirmSwal(page)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('No transactions yet.')).toBeVisible()
  })
})
