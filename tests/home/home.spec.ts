import { test, expect } from '@playwright/test';

test.describe('UNOPS Careers Home Screen - Navigation Menu Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('', { waitUntil: 'domcontentloaded', timeout: 60000 });

    const acceptCookiesBtn = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookiesBtn.isVisible()) {
      await acceptCookiesBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Verify "Open Positions" menu item is visible and navigates correctly', async ({ page }) => {
    const openPositionsLink = page.locator('nav.menu a.menu__link', { hasText: 'Open Positions' });

    await expect(openPositionsLink).toBeVisible();
    console.log('✅ "Open Positions" menu item is visible');

    const href = await openPositionsLink.getAttribute('href');
    expect(href).toContain('/careersmarketplace/SearchJobs');
    console.log(`✅ "Open Positions" href is correct: ${href}`);

    await openPositionsLink.click();
    await page.waitForURL('**/SearchJobs**');
    console.log('✅ Navigated to Search Jobs page successfully');
  });

  test('Verify "How to Apply" menu item is visible and has correct link', async ({ page }) => {
    const howToApplyLink = page.locator('nav.menu a.menu__link', { hasText: 'How To Apply' });

    await expect(howToApplyLink).toBeVisible();
    console.log('✅ "How To Apply" menu item is visible');

    const href = (await howToApplyLink.getAttribute('href')) ?? '';
    expect(href).toBeTruthy();
    expect(href.length).toBeGreaterThan(0);
    console.log(`✅ "How To Apply" href is present: ${href}`);

    const target = await howToApplyLink.getAttribute('target');
    expect(target).toBe('_blank');
    console.log('✅ "How To Apply" opens in a new tab (_blank)');
  });

  test('Verify "What We Offer" menu item is visible and has correct link', async ({ page }) => {
    const whatWeOfferLink = page.locator('nav.menu a.menu__link', { hasText: 'What We Offer' });

    await expect(whatWeOfferLink).toBeVisible();
    console.log('✅ "What We Offer" menu item is visible');

    const href = (await whatWeOfferLink.getAttribute('href')) ?? '';
    expect(href).toBeTruthy();
    expect(href.length).toBeGreaterThan(0);
    console.log(`✅ "What We Offer" href is present: ${href}`);

    const target = await whatWeOfferLink.getAttribute('target');
    expect(target).toBe('_blank');
    console.log('✅ "What We Offer" opens in a new tab (_blank)');
  });

  test('Verify "Login" menu item is visible and navigates correctly', async ({ page }) => {
    const loginLink = page.locator('nav.menu a.menu__link', { hasText: 'Login' });

    await expect(loginLink).toBeVisible();
    console.log('✅ "Login" menu item is visible');

    const href = await loginLink.getAttribute('href');
    expect(href).toContain('/careersmarketplace/Login');
    console.log(`✅ "Login" href is correct: ${href}`);

    await loginLink.click();
    await page.waitForURL('**/Login**');
    console.log('✅ Navigated to Login page successfully');
  });

  test('Verify all four menu items are present on the home screen', async ({ page }) => {
    const menuItems = [
      { name: 'Open Positions', selector: 'nav.menu a.menu__link' },
      { name: 'How To Apply',   selector: 'nav.menu a.menu__link' },
      { name: 'What We Offer',  selector: 'nav.menu a.menu__link' },
      { name: 'Login',          selector: 'nav.menu a.menu__link' },
    ];

    for (const item of menuItems) {
      const link = page.locator(item.selector, { hasText: item.name });
      await expect(link).toBeVisible();
      console.log(`✅ Menu item "${item.name}" is visible`);
    }

    console.log('✅ All four menu items verified: Open Positions, How To Apply, What We Offer, Login');
  });

  test('Verify all search field labels are visible on the home screen', async ({ page }) => {
    const expectedLabels = ['Keywords', 'Country', 'Duty Station', 'Position Area'];

    for (const labelText of expectedLabels) {
      const label = page.locator('form#tpt_jobSortableForm label', { hasText: labelText });
      await expect(label).toBeVisible();
      console.log(`✅ Search label "${labelText}" is visible`);
    }

    console.log('✅ All search field labels verified: Keywords, Country, Duty Station, Position Area');
  });

  test('Verify all search input fields are present and interactable', async ({ page }) => {
    const keywordsInput = page.locator('input[id="491"]');
    await expect(keywordsInput).toBeVisible();
    await expect(keywordsInput).toBeEnabled();
    const keywordsLabel = page.locator('label[for="491"]');
    await expect(keywordsLabel).toHaveText('Keywords');
    console.log('✅ Keywords input is visible, enabled, and correctly labelled');

    const countrySelect = page.locator('select[id="4611"]');
    await expect(countrySelect).toBeAttached();
    const countryLabel = page.locator('label[for="4611"]');
    await expect(countryLabel).toHaveText('Country');
    console.log('✅ Country select field is present and correctly labelled');

    const dutyStationSelect = page.locator('select[id="1018"]');
    await expect(dutyStationSelect).toBeAttached();
    const dutyStationLabel = page.locator('label[for="1018"]');
    await expect(dutyStationLabel).toHaveText('Duty Station');
    console.log('✅ Duty Station select field is present and correctly labelled');

    const positionAreaSelect = page.locator('select[id="1019"]');
    await expect(positionAreaSelect).toBeAttached();
    const positionAreaLabel = page.locator('label[for="1019"]');
    await expect(positionAreaLabel).toHaveText('Position Area');
    console.log('✅ Position Area select field is present and correctly labelled');

    const searchButton = page.locator('button[id="948-submit"]');
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeEnabled();
    await expect(searchButton).toHaveText('Search');
    console.log('✅ Search button is visible, enabled, and correctly labelled');

    await keywordsInput.fill('Engineer');
    await expect(keywordsInput).toHaveValue('Engineer');
    console.log('✅ Keywords input accepts text: "Engineer"');

    console.log('✅ All search inputs and labels validated successfully');
  });

  test('Verify all menu items navigate to correct URLs', async ({ page, context }) => {
    const EXPECTED_URLS = {
      openPositions : '/careersmarketplace/SearchJobs',
      howToApply    : '12OaKUNVXkDrHxTNKtJ0lTdhC1VtYrCYg',
      whatWeOffer   : 'https://docs.google.com/presentation/d/1-DzF1ktroVWC5za3JzqRab2gUZMu_WL3FHGWj1UBwUo/edit?usp=sharing',
      login         : '/careersmarketplace/Login',
    };

    const openPositionsLink = page.locator('nav.menu a.menu__link', { hasText: 'Open Positions' });
    await expect(openPositionsLink).toBeVisible();
    await openPositionsLink.click();
    await page.waitForURL('**/SearchJobs**');
    expect(page.url()).toContain(EXPECTED_URLS.openPositions);
    console.log(`✅ "Open Positions" navigated to: ${page.url()}`);

    await page.goto('', { waitUntil: 'domcontentloaded', timeout: 60000 });
    const acceptCookiesBtn = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookiesBtn.isVisible()) {
      await acceptCookiesBtn.click();
      await page.waitForTimeout(500);
    }

    const howToApplyLink = page.locator('nav.menu a.menu__link', { hasText: 'How To Apply' });
    await expect(howToApplyLink).toBeVisible();

    const [howToApplyTab] = await Promise.all([
      context.waitForEvent('page'),
      howToApplyLink.click(),
    ]);
    await howToApplyTab.waitForURL(/drive\.google\.com/, { waitUntil: 'commit', timeout: 60000 });
    const howToApplyUrl = howToApplyTab.url();
    expect(howToApplyUrl).toContain('drive.google.com');
    expect(howToApplyUrl).toContain(EXPECTED_URLS.howToApply);
    console.log(`✅ "How To Apply" opened new tab with URL: ${howToApplyUrl}`);
    await howToApplyTab.close();

    const whatWeOfferLink = page.locator('nav.menu a.menu__link', { hasText: 'What We Offer' });
    await expect(whatWeOfferLink).toBeVisible();

    const [whatWeOfferTab] = await Promise.all([
      context.waitForEvent('page'),
      whatWeOfferLink.click(),
    ]);
    await whatWeOfferTab.waitForURL(/docs\.google\.com/, { waitUntil: 'commit', timeout: 60000 });
    const whatWeOfferUrl = whatWeOfferTab.url();
    expect(whatWeOfferUrl).toContain('docs.google.com');
    expect(whatWeOfferUrl).toContain('1-DzF1ktroVWC5za3JzqRab2gUZMu_WL3FHGWj1UBwUo');
    console.log(`✅ "What We Offer" opened new tab with URL: ${whatWeOfferUrl}`);
    await whatWeOfferTab.close();

    const loginLink = page.locator('nav.menu a.menu__link', { hasText: 'Login' });
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await page.waitForURL('**/Login**');
    expect(page.url()).toContain(EXPECTED_URLS.login);
    console.log(`✅ "Login" navigated to: ${page.url()}`);

    console.log('✅ All menu items navigate to their correct URLs');
  });

});
