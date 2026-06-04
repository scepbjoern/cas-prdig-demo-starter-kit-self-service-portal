import { test, expect } from '@playwright/test'

async function loginAsApplicant(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'applicant@example.com')
  await page.fill('input[type="password"]', 'a')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'admin@example.com')
  await page.fill('input[type="password"]', 'a')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/')
}

test.describe('Antrag CRUD', () => {
  test('Applicant kann neuen Antrag erstellen als Entwurf', async ({ page }) => {
    await loginAsApplicant(page)
    await page.goto('/antraege/neu')

    const uniqueTitle = `Test-Antrag E2E ${Date.now()}`
    await page.fill('input[name="titel"]', uniqueTitle)
    await page.fill('input[name="anbieter"]', 'ZHAW')
    await page.fill('input[name="startdatum"]', '2026-09-01')
    await page.fill('input[name="kostenChf"]', '1000')
    await page.fill('input[name="kostenstelle"]', 'WB-123')
    await page.fill('textarea[name="begruendung"]', 'Eine ausreichend lange Begruendung fuer den Test.')
    
    await page.click('button:has-text("Entwurf speichern")')

    // Nach Erstellen: Weiterleitung zur Detailseite abwarten
    await page.waitForURL(/\/antraege\/[^/]+$/)
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible()
    await expect(page.locator('text=Entwurf').first()).toBeVisible()
  })

  test('Applicant kann Antrag erfassen und direkt einreichen', async ({ page }) => {
    await loginAsApplicant(page)
    await page.goto('/antraege/neu')

    const uniqueTitle = `Test-Antrag Einreichen E2E ${Date.now()}`
    await page.fill('input[name="titel"]', uniqueTitle)
    await page.fill('input[name="anbieter"]', 'ZHAW')
    await page.fill('input[name="startdatum"]', '2026-10-01')
    await page.fill('input[name="kostenChf"]', '2000')
    await page.fill('input[name="kostenstelle"]', 'WB-456')
    await page.fill('textarea[name="begruendung"]', 'Auch dies ist eine ausreichend lange Begruendung fuer den Test.')

    await page.click('button:has-text("Speichern und einreichen")')
    
    // Dialog Bestätigung
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
    await dialog.locator('button:has-text("Ja, einreichen")').click()

    // Redirect to detail page
    await page.waitForURL(/\/antraege\/[^/]+$/)
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible()
    await expect(page.locator('text=Eingereicht').first()).toBeVisible()

    // Check list
    await page.goto('/antraege')
    const row = page.locator('tr', { hasText: uniqueTitle })
    await expect(row.locator('text=Eingereicht')).toBeVisible()
  })

  test('Applicant kann Antraege nach Status filtern', async ({ page }) => {
    await loginAsApplicant(page)
    await page.goto('/antraege')

    // Klick auf "Eingereicht" Filter-Button
    await page.click('a:has-text("Eingereicht")')
    await expect(page).toHaveURL(/.*status=EINGEREICHT.*/)

    // Nur eingereichte Anträge sollten sichtbar sein
    await expect(page.locator('text=CAS Prozessdigitalisierung')).toBeVisible()
    await expect(page.locator('text=Workshop Service Design Grundlagen')).not.toBeVisible()

    // Klick auf "Alle" Filter-Button
    await page.click('a:has-text("Alle")')
    await expect(page.locator('text=Workshop Service Design Grundlagen')).toBeVisible()
  })

  test('Applicant kann Antraege nach Titel durchsuchen', async ({ page }) => {
    await loginAsApplicant(page)
    await page.goto('/antraege')

    // Eingabe im Suchfeld und Submit
    await page.fill('input[name="suche"]', 'Six Sigma')
    await page.click('button:has-text("Suchen")')
    await expect(page).toHaveURL(/.*suche=Six\+Sigma.*/)

    // Nur der passende Antrag sollte sichtbar sein
    await expect(page.locator('text=Lean Six Sigma Green Belt')).toBeVisible()
    await expect(page.locator('text=CAS Prozessdigitalisierung')).not.toBeVisible()
  })

  test('Admin sieht eingereichte Anträge', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/antraege')

    await expect(page.locator('text=Eingereicht').first()).toBeVisible()
  })
})
