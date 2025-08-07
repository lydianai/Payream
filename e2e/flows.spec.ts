import { test, expect } from '@playwright/test';

test.describe('User Journeys', () => {
  test('Homepage loads and search works', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Türkiye'nin En Kapsamlı Fintech Platformu/i })).toBeVisible();
    
    await page.getByPlaceholder(/POS, blockchain, fintech çözümü ara/i).fill('PayTR');
    await page.getByRole('button', { name: 'Ara' }).click();

    await expect(page).toHaveURL(/.*\/search\?q=PayTR/);
    await expect(page.getByText('PayTR')).toBeVisible();
  });

  test('Search, filter, and navigate to provider page', async ({ page }) => {
    await page.goto('/search');
    
    // Filter by category
    await page.getByRole('button', { name: 'Kategori seçin' }).click();
    await page.getByRole('option', { name: 'Sanal POS (15)' }).click();
    await expect(page.getByText('PayTR')).toBeVisible();
    await expect(page.getByText('iyzico')).not.toBeVisible();

    // Navigate to detail page
    await page.locator('article', { hasText: 'PayTR' }).getByRole('link', { name: 'Değerlendirmeleri Gör' }).click();
    await expect(page).toHaveURL(/.*\/provider\/1/);
    await expect(page.getByRole('heading', { name: 'PayTR' })).toBeVisible();
  });

  test('Select providers and compare them', async ({ page, context }) => {
    await page.goto('/search');
    await expect(page.getByText('PayTR')).toBeVisible();
    await expect(page.getByText('iyzico')).toBeVisible();

    // Select two providers
    await page.locator('article', { hasText: 'PayTR' }).getByLabel(/PayTR karşılaştırmaya ekle/i).check();
    await page.locator('article', { hasText: 'iyzico' }).getByLabel(/iyzico karşılaştırmaya ekle/i).check();

    await expect(page.getByText('2 sağlayıcı seçildi')).toBeVisible();
    
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('button', { name: 'Karşılaştır' }).click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    
    await expect(newPage).toHaveURL(/.*\/comparison\?providers=1,2/);
    await expect(newPage.getByRole('heading', { name: 'POS Karşılaştırması' })).toBeVisible();
    await expect(newPage.getByText('PayTR')).toBeVisible();
    await expect(newPage.getByText('iyzico')).toBeVisible();
    await newPage.close();
  });

  test('Submit a review for a provider', async ({ page }) => {
    // This test requires authentication, which is handled by global.setup.ts
    await page.goto('/provider/1'); // Go to PayTR's page

    await expect(page.getByRole('heading', { name: 'PayTR' })).toBeVisible();

    // The user is logged in, so the "Write a Review" button should be visible
    await page.getByRole('button', { name: 'Değerlendirme Yaz' }).click();

    // Fill out the review form
    await expect(page.getByRole('heading', { name: 'PayTR için Değerlendirme Yaz' })).toBeVisible();

    // Rate 5 stars
    await page.getByRole('radio', { name: '5 yıldız' }).click();

    await page.getByLabel('Başlık *').fill('Harika bir servis!');
    await page.getByLabel('Değerlendirme *').fill('Çok memnun kaldım, entegrasyonu çok kolaydı.');

    // Add pros and cons
    await page.getByPlaceholder('Bir artı ekleyin...').fill('Hızlı destek');
    await page.getByRole('button', { name: 'Artı ekle' }).click();
    await page.getByPlaceholder('Bir eksi ekleyin...').fill('Arayüz biraz karışık');
    await page.getByRole('button', { name: 'Eksi ekle' }).click();

    // Select dropdowns
    await page.getByRole('combobox', { name: 'Kullanım Süresi' }).click();
    await page.getByRole('option', { name: '6-12 ay' }).click();

    await page.getByRole('combobox', { name: 'İşletme Büyüklüğü' }).click();
    await page.getByRole('option', { name: 'Küçük İşletme (1-10 kişi)' }).click();

    await page.getByRole('combobox', { name: 'Kullanım Alanı' }).click();
    await page.getByRole('option', { name: 'E-ticaret' }).click();

    // Check the recommend checkbox
    await page.getByLabel('Bu POS sistemini başkalarına tavsiye ederim').check();

    // Submit the form
    await page.getByRole('button', { name: 'Değerlendirme Gönder' }).click();

    // Check for success toast
    await expect(page.getByText('Değerlendirme Gönderildi')).toBeVisible();

    // The review form should disappear
    await expect(page.getByRole('heading', { name: 'PayTR için Değerlendirme Yaz' })).not.toBeVisible();

    // The new review should appear in the list
    await expect(page.getByText('Harika bir servis!')).toBeVisible();
    await expect(page.getByText('Çok memnun kaldım, entegrasyonu çok kolaydı.')).toBeVisible();
  });
});
