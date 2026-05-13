import { test, expect } from '@playwright/test'
import { confirmSwal } from './helpers'

test.describe('Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill('Test Category')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')
  })

  test('creates a transaction and shows it in the list', async ({ page }) => {
    await page.goto('/transactions/new')

    await page.getByLabel('Amount').fill('1500')
    await page.getByLabel('Type').selectOption('expense')
    await page.getByLabel('Category').selectOption('Test Category')
    await page.getByLabel('Description').fill('Supermercado')
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL('/transactions')
    await expect(page.getByText('expense')).toBeVisible()
    await expect(page.getByText('-$1500.00')).toBeVisible()
    await expect(page.getByText('Supermercado')).toBeVisible()
  })

  test('deletes a transaction', async ({ page }) => {
    await page.goto('/transactions/new')
    await page.getByLabel('Amount').fill('500')
    await page.getByLabel('Category').selectOption('Test Category')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/transactions')

    const initialCount = await page.getByRole('row').count()
    await page.getByRole('button', { name: 'Delete' }).first().click()
    await confirmSwal(page)

    await expect(page.getByRole('row')).toHaveCount(initialCount - 1)
  })
})
