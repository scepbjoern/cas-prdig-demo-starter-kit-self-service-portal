import { test, expect } from '@playwright/test'

test.describe('Rollenbasierte Sichtbarkeit', () => {
  test('Admin sieht alle Navigations-Links', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'a')
    await page.click('button[type="submit"]')

    await expect(page.getByRole('navigation').getByRole('link', { name: 'Anträge' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Personen' })).toHaveCount(0)
    await expect(page.getByRole('navigation').getByRole('link', { name: 'KI-Assistent' })).toHaveCount(0)
  })

  test('Applicant sieht nur projektrelevante Navigation', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'applicant@example.com')
    await page.fill('input[type="password"]', 'a')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')

    await expect(page.getByRole('navigation').getByRole('link', { name: 'Anträge' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Personen' })).toHaveCount(0)
    await expect(page.getByRole('navigation').getByRole('link', { name: 'KI-Assistent' })).toHaveCount(0)
  })
})
