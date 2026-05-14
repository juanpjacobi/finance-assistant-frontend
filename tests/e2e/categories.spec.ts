import { test, expect } from '@playwright/test'
import { confirmSwal } from './helpers'

test.describe('Categories', () => {
  test('page loads and shows the table', async ({ page }) => {
    await page.goto('/categories')
    await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible()
    await expect(page.getByRole('link', { name: '+ New' })).toBeVisible()
  })

  test('creates a category and shows it in the list', async ({ page }) => {
    const ts = Date.now()
    const name = `Cat-${ts}`
    const desc = `Desc-${ts}`
    await page.goto('/categories/new')

    await page.getByLabel('Name').fill(name)
    await page.getByLabel('Description').fill(desc)
    await page.getByRole('button', { name: 'Create' }).click()

    await expect(page).toHaveURL('/categories')
    await expect(page.getByText(name)).toBeVisible()
    await expect(page.getByText(desc)).toBeVisible()
  })

  test('edits a category', async ({ page }) => {
    const name = `Edit-${Date.now()}`
    const edited = `${name}-edited`
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill(name)
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')

    await page.getByRole('row', { name: new RegExp(name) }).getByRole('link', { name: 'Edit' }).click()
    await page.getByLabel('Name').fill(edited)
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page).toHaveURL('/categories')
    await expect(page.getByText(edited)).toBeVisible()
  })

  test('deletes a category', async ({ page }) => {
    const name = `Del-${Date.now()}`
    await page.goto('/categories/new')
    await page.getByLabel('Name').fill(name)
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page).toHaveURL('/categories')
    await expect(page.getByText(name)).toBeVisible()

    await page.getByRole('row', { name: new RegExp(name) }).getByRole('button', { name: 'Delete' }).click()
    await confirmSwal(page)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(name)).not.toBeVisible()
  })
})
