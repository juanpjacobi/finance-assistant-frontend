import { test, expect } from '@playwright/test'
import { confirmSwal } from './helpers'

test.describe('Categories', () => {
  test('shows empty state', async ({ page }) => {
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

    await page.getByRole('link', { name: 'Edit' }).first().click()
    await page.getByLabel('Name').fill('Editada')
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page).toHaveURL('/categories')
    await expect(page.getByText('Editada')).toBeVisible()
  })

  test('deletes a category', async ({ page }) => {
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill('Para borrar')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')

    const initialCount = await page.getByRole('row').count()
    await page.getByRole('button', { name: 'Delete' }).first().click()
    await confirmSwal(page)

    await expect(page.getByRole('row')).toHaveCount(initialCount - 1)
  })
})
