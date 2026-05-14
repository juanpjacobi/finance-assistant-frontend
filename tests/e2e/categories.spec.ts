import { test, expect } from '@playwright/test'
import { confirmSwal, resetDatabase } from './helpers'

test.describe('Categories', () => {
  test.beforeEach(async () => { await resetDatabase() })
  test('shows empty state on clean database', async ({ page }) => {
    await page.goto('/categories')
    await expect(page.getByText('No categories yet.')).toBeVisible()
  })

  test('creates a category and shows it in the list', async ({ page }) => {
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill('Alimentación')
    await page.getByLabel('Description').fill('Comida y bebida')
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL('/categories')
    await expect(page.getByText('Alimentación')).toBeVisible()
    await expect(page.getByText('Comida y bebida')).toBeVisible()
  })

  test('edits a category', async ({ page }) => {
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill('Para editar')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')

    await page.getByRole('row', { name: 'Para editar' }).getByRole('link', { name: 'Edit' }).click()
    await page.getByLabel('Name').fill('Editada')
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page).toHaveURL('/categories')
    await expect(page.getByText('Editada')).toBeVisible()
    await expect(page.getByText('Para editar')).not.toBeVisible()
  })

  test('deletes a category', async ({ page }) => {
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill('Para borrar')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')

    await page.getByRole('row', { name: 'Para borrar' }).getByRole('button', { name: 'Delete' }).click()
    await confirmSwal(page)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Para borrar')).not.toBeVisible()
  })

  test('cannot delete a category with transactions', async ({ page }) => {
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill('Con transacciones')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')

    await page.goto('/transactions/new')
    await page.getByLabel('Amount').fill('100')
    await page.getByLabel('Category').selectOption('Con transacciones')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/transactions')

    await page.goto('/categories')
    await page.getByRole('row', { name: 'Con transacciones' }).getByRole('button', { name: 'Delete' }).click()
    await confirmSwal(page)

    await expect(page.locator('.swal2-popup')).toBeVisible()
    await expect(page.getByText('Con transacciones')).toBeVisible()
  })
})
