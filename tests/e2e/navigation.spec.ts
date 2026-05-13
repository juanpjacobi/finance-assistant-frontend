import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('dashboard renders with all section links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Finance Assistant')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Transactions' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Categories' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Budgets' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Documents' }).first()).toBeVisible()
  })

  test('navigates to each section from the nav', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Categories' }).first().click()
    await expect(page).toHaveURL('/categories')

    await page.getByRole('link', { name: 'Transactions' }).first().click()
    await expect(page).toHaveURL('/transactions')

    await page.getByRole('link', { name: 'Budgets' }).first().click()
    await expect(page).toHaveURL('/budgets')

    await page.getByRole('link', { name: 'Documents' }).first().click()
    await expect(page).toHaveURL('/documents')
  })
})
