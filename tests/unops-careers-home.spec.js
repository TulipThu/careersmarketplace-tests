const { test, expect } = require('@playwright/test');

test.describe('UNOPS Careers Home Screen - Navigation Menu Validation', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the UNOPS Careers home page
    // Use 'domcontentloaded' (faster than default 'load') to avoid timeouts on slow networks
    await page.goto('https://careers.unops.org/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Handle cookie consent banner if visible
    const acceptCookiesBtn = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookiesBtn.isVisible()) {
      await acceptCookiesBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Verify "Open Positions" menu item is visible and navigates correctly', async ({ page }) => {
    // STEP 1: Locate the "Open Positions" menu link
    const openPositionsLink = page.locator('nav.menu a.menu__link', { hasText: 'Open Positions' });

    // STEP 2: Verify the menu item is visible
    await expect(openPositionsLink).toBeVisible();
    console.log('✅ "Open Positions" menu item is visible');

    // STEP 3: Verify the href points to the correct URL
    const href = await openPositionsLink.getAttribute('href');
    expect(href).toContain('/careersmarketplace/SearchJobs');
    console.log(`✅ "Open Positions" href is correct: ${href}`);

    // STEP 4: Click and verify navigation
    await openPositionsLink.click();
    await page.waitForURL('**/SearchJobs**');
    console.log('✅ Navigated to Search Jobs page successfully');
  });

  test('Verify "How to Apply" menu item is visible and has correct link', async ({ page }) => {
    // STEP 1: Locate the "How To Apply" menu link
    const howToApplyLink = page.locator('nav.menu a.menu__link', { hasText: 'How To Apply' });

    // STEP 2: Verify the menu item is visible
    await expect(howToApplyLink).toBeVisible();
    console.log('✅ "How To Apply" menu item is visible');

    // STEP 3: Verify the href is a valid external link (Google Drive)
    const href = await howToApplyLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href.length).toBeGreaterThan(0);
    console.log(`✅ "How To Apply" href is present: ${href}`);

    // STEP 4: Verify it opens in a new tab
    const target = await howToApplyLink.getAttribute('target');
    expect(target).toBe('_blank');
    console.log('✅ "How To Apply" opens in a new tab (_blank)');
  });

  test('Verify "What We Offer" menu item is visible and has correct link', async ({ page }) => {
    // STEP 1: Locate the "What We Offer" menu link
    const whatWeOfferLink = page.locator('nav.menu a.menu__link', { hasText: 'What We Offer' });

    // STEP 2: Verify the menu item is visible
    await expect(whatWeOfferLink).toBeVisible();
    console.log('✅ "What We Offer" menu item is visible');

    // STEP 3: Verify the href is a valid external link (Google Slides)
    const href = await whatWeOfferLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href.length).toBeGreaterThan(0);
    console.log(`✅ "What We Offer" href is present: ${href}`);

    // STEP 4: Verify it opens in a new tab
    const target = await whatWeOfferLink.getAttribute('target');
    expect(target).toBe('_blank');
    console.log('✅ "What We Offer" opens in a new tab (_blank)');
  });

  test('Verify "Login" menu item is visible and navigates correctly', async ({ page }) => {
    // STEP 1: Locate the "Login" menu link
    const loginLink = page.locator('nav.menu a.menu__link', { hasText: 'Login' });

    // STEP 2: Verify the menu item is visible
    await expect(loginLink).toBeVisible();
    console.log('✅ "Login" menu item is visible');

    // STEP 3: Verify the href points to the Login page
    const href = await loginLink.getAttribute('href');
    expect(href).toContain('/careersmarketplace/Login');
    console.log(`✅ "Login" href is correct: ${href}`);

    // STEP 4: Click and verify navigation to login page
    await loginLink.click();
    await page.waitForURL('**/Login**');
    console.log('✅ Navigated to Login page successfully');
  });

  test('Verify all four menu items are present on the home screen', async ({ page }) => {
    // STEP 1: Define all expected menu items
    const menuItems = [
      { name: 'Open Positions', selector: 'nav.menu a.menu__link' },
      { name: 'How To Apply',   selector: 'nav.menu a.menu__link' },
      { name: 'What We Offer',  selector: 'nav.menu a.menu__link' },
      { name: 'Login',          selector: 'nav.menu a.menu__link' },
    ];

    // STEP 2: Verify each menu item is visible
    for (const item of menuItems) {
      const link = page.locator(item.selector, { hasText: item.name });
      await expect(link).toBeVisible();
      console.log(`✅ Menu item "${item.name}" is visible`);
    }

    console.log('✅ All four menu items verified: Open Positions, How To Apply, What We Offer, Login');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // SEARCH BOX VALIDATION
  // ─────────────────────────────────────────────────────────────────────────

  test('Verify all search field labels are visible on the home screen', async ({ page }) => {
    // STEP 1: Define all expected labels in the search form
    const expectedLabels = ['Keywords', 'Country', 'Duty Station', 'Position Area'];

    // STEP 2: Verify each label is visible inside the search form
    for (const labelText of expectedLabels) {
      const label = page.locator('form#tpt_jobSortableForm label', { hasText: labelText });
      await expect(label).toBeVisible();
      console.log(`✅ Search label "${labelText}" is visible`);
    }

    console.log('✅ All search field labels verified: Keywords, Country, Duty Station, Position Area');
  });

  test('Verify all search input fields are present and interactable', async ({ page }) => {
    // STEP 1: Verify "Keywords" text input is visible and enabled
    // Note: CSS IDs starting with digits (#491) are invalid selectors; use attribute selectors instead
    const keywordsInput = page.locator('input[id="491"]');
    await expect(keywordsInput).toBeVisible();
    await expect(keywordsInput).toBeEnabled();
    const keywordsLabel = page.locator('label[for="491"]');
    await expect(keywordsLabel).toHaveText('Keywords');
    console.log('✅ Keywords input is visible, enabled, and correctly labelled');

    // STEP 2: Verify "Country" select field is present with correct label
    const countrySelect = page.locator('select[id="4611"]');
    await expect(countrySelect).toBeAttached();
    const countryLabel = page.locator('label[for="4611"]');
    await expect(countryLabel).toHaveText('Country');
    console.log('✅ Country select field is present and correctly labelled');

    // STEP 3: Verify "Duty Station" select field is present with correct label
    const dutyStationSelect = page.locator('select[id="1018"]');
    await expect(dutyStationSelect).toBeAttached();
    const dutyStationLabel = page.locator('label[for="1018"]');
    await expect(dutyStationLabel).toHaveText('Duty Station');
    console.log('✅ Duty Station select field is present and correctly labelled');

    // STEP 4: Verify "Position Area" select field is present with correct label
    const positionAreaSelect = page.locator('select[id="1019"]');
    await expect(positionAreaSelect).toBeAttached();
    const positionAreaLabel = page.locator('label[for="1019"]');
    await expect(positionAreaLabel).toHaveText('Position Area');
    console.log('✅ Position Area select field is present and correctly labelled');

    // STEP 5: Verify the "Search" submit button is visible and enabled
    const searchButton = page.locator('button[id="948-submit"]');
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeEnabled();
    await expect(searchButton).toHaveText('Search');
    console.log('✅ Search button is visible, enabled, and correctly labelled');

    // STEP 6: Verify Keywords field accepts text input
    await keywordsInput.fill('Engineer');
    await expect(keywordsInput).toHaveValue('Engineer');
    console.log('✅ Keywords input accepts text: "Engineer"');

    console.log('✅ All search inputs and labels validated successfully');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // MENU NAVIGATION URL VALIDATION
  // ─────────────────────────────────────────────────────────────────────────

  test('Verify all menu items navigate to correct URLs', async ({ page, context }) => {
    // Expected URLs for each menu item
    const EXPECTED_URLS = {
      openPositions : 'https://careers.unops.org/careersmarketplace/SearchJobs',
      howToApply    : 'https://drive.google.com/file/d/12OaKUNVXkDrHxTNKtJ0lTdhC1VtYrCYg/view?usp=sharing',
      whatWeOffer   : 'https://docs.google.com/presentation/d/1-DzF1ktroVWC5za3JzqRab2gUZMu_WL3FHGWj1UBwUo/edit?usp=sharing',
      login         : 'https://careers.unops.org/careersmarketplace/Login',
    };

    // ── 1. Open Positions (same tab) ──────────────────────────────────────
    const openPositionsLink = page.locator('nav.menu a.menu__link', { hasText: 'Open Positions' });
    await expect(openPositionsLink).toBeVisible();
    await openPositionsLink.click();
    await page.waitForURL('**/SearchJobs**');
    expect(page.url()).toContain(EXPECTED_URLS.openPositions);
    console.log(`✅ "Open Positions" navigated to: ${page.url()}`);

    // Go back to home for next steps
    await page.goto('https://careers.unops.org/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    const acceptCookiesBtn = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookiesBtn.isVisible()) {
      await acceptCookiesBtn.click();
      await page.waitForTimeout(500);
    }

    // ── 2. How To Apply (opens new tab) ──────────────────────────────────
    const howToApplyLink = page.locator('nav.menu a.menu__link', { hasText: 'How To Apply' });
    await expect(howToApplyLink).toBeVisible();

    // Listen for the new tab before clicking
    const [howToApplyTab] = await Promise.all([
      context.waitForEvent('page'),
      howToApplyLink.click(),
    ]);
    await howToApplyTab.waitForLoadState('domcontentloaded');
    const howToApplyUrl = howToApplyTab.url();
    expect(howToApplyUrl).toContain('drive.google.com');
    expect(howToApplyUrl).toBe(EXPECTED_URLS.howToApply);
    console.log(`✅ "How To Apply" opened new tab with URL: ${howToApplyUrl}`);
    await howToApplyTab.close();

    // ── 3. What We Offer (opens new tab) ─────────────────────────────────
    const whatWeOfferLink = page.locator('nav.menu a.menu__link', { hasText: 'What We Offer' });
    await expect(whatWeOfferLink).toBeVisible();

    const [whatWeOfferTab] = await Promise.all([
      context.waitForEvent('page'),
      whatWeOfferLink.click(),
    ]);
    // Use 'commit' (URL resolved) instead of 'domcontentloaded' — Google Slides is slow to fully load
    await whatWeOfferTab.waitForLoadState('commit', { timeout: 60000 });
    const whatWeOfferUrl = whatWeOfferTab.url();
    expect(whatWeOfferUrl).toContain('docs.google.com');
    // Google Slides rewrites the URL after load (e.g. adds ?slide=id.p), so check the stable presentation ID
    expect(whatWeOfferUrl).toContain('1-DzF1ktroVWC5za3JzqRab2gUZMu_WL3FHGWj1UBwUo');
    console.log(`✅ "What We Offer" opened new tab with URL: ${whatWeOfferUrl}`);
    await whatWeOfferTab.close();

    // ── 4. Login (same tab) ───────────────────────────────────────────────
    const loginLink = page.locator('nav.menu a.menu__link', { hasText: 'Login' });
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await page.waitForURL('**/Login**');
    expect(page.url()).toContain(EXPECTED_URLS.login);
    console.log(`✅ "Login" navigated to: ${page.url()}`);

    console.log('✅ All menu items navigate to their correct URLs');
  });

});
