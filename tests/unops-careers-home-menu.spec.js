const { test, expect } = require('@playwright/test');

test('UNOPS Careers Home Screen - Full Step-by-Step Validation', async ({ page, context }) => {

  // ── STEP 1: Navigate to the UNOPS Careers home page (only once) ───────────
  await test.step('STEP 1: Open UNOPS Careers home page', async () => {
    await page.goto('https://careers.unops.org/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log(`✅ Navigated to: ${page.url()}`);
  });

  // ── STEP 2: Handle cookie consent banner ──────────────────────────────────
  await test.step('STEP 2: Dismiss cookie consent banner (if present)', async () => {
    const acceptCookiesBtn = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookiesBtn.isVisible()) {
      await acceptCookiesBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ Cookie banner dismissed');
    } else {
      console.log('ℹ️  No cookie banner found, continuing');
    }
  });

  // ── STEP 3: Verify all menu items are visible ─────────────────────────────
  await test.step('STEP 3: Verify all four menu items are visible', async () => {
    const menuItems = ['Open Positions', 'How To Apply', 'What We Offer', 'Login'];
    for (const name of menuItems) {
      const link = page.locator('nav.menu a.menu__link', { hasText: name });
      await expect(link).toBeVisible();
      console.log(`✅ Menu item "${name}" is visible`);
    }
  });

  // ── STEP 4: Verify menu item href attributes ──────────────────────────────
  await test.step('STEP 4: Verify menu item href attributes', async () => {
    const openPositionsHref = await page.locator('nav.menu a.menu__link', { hasText: 'Open Positions' }).getAttribute('href');
    expect(openPositionsHref).toContain('/careersmarketplace/SearchJobs');
    console.log(`✅ "Open Positions" href: ${openPositionsHref}`);

    const howToApplyHref = await page.locator('nav.menu a.menu__link', { hasText: 'How To Apply' }).getAttribute('href');
    expect(howToApplyHref).toContain('drive.google.com');
    const howToApplyTarget = await page.locator('nav.menu a.menu__link', { hasText: 'How To Apply' }).getAttribute('target');
    expect(howToApplyTarget).toBe('_blank');
    console.log(`✅ "How To Apply" href: ${howToApplyHref} (opens in new tab)`);

    const whatWeOfferHref = await page.locator('nav.menu a.menu__link', { hasText: 'What We Offer' }).getAttribute('href');
    expect(whatWeOfferHref).toContain('docs.google.com');
    const whatWeOfferTarget = await page.locator('nav.menu a.menu__link', { hasText: 'What We Offer' }).getAttribute('target');
    expect(whatWeOfferTarget).toBe('_blank');
    console.log(`✅ "What We Offer" href: ${whatWeOfferHref} (opens in new tab)`);

    const loginHref = await page.locator('nav.menu a.menu__link', { hasText: 'Login' }).getAttribute('href');
    expect(loginHref).toContain('/careersmarketplace/Login');
    console.log(`✅ "Login" href: ${loginHref}`);
  });

  // ── STEP 5: Verify search field labels are visible ────────────────────────
  await test.step('STEP 5: Verify search field labels are visible', async () => {
    const expectedLabels = ['Keywords', 'Country', 'Duty Station', 'Position Area'];
    for (const labelText of expectedLabels) {
      const label = page.locator('form#tpt_jobSortableForm label', { hasText: labelText });
      await expect(label).toBeVisible();
      console.log(`✅ Search label "${labelText}" is visible`);
    }
  });

  // ── STEP 6: Verify search inputs are present and correctly labelled ────────
  await test.step('STEP 6: Verify search input fields and their labels', async () => {
    // Keywords text input
    const keywordsInput = page.locator('input[id="491"]');
    await expect(keywordsInput).toBeVisible();
    await expect(keywordsInput).toBeEnabled();
    await expect(page.locator('label[for="491"]')).toHaveText('Keywords');
    console.log('✅ Keywords input — visible, enabled, correctly labelled');

    // Country select
    await expect(page.locator('select[id="4611"]')).toBeAttached();
    await expect(page.locator('label[for="4611"]')).toHaveText('Country');
    console.log('✅ Country select — present, correctly labelled');

    // Duty Station select
    await expect(page.locator('select[id="1018"]')).toBeAttached();
    await expect(page.locator('label[for="1018"]')).toHaveText('Duty Station');
    console.log('✅ Duty Station select — present, correctly labelled');

    // Position Area select
    await expect(page.locator('select[id="1019"]')).toBeAttached();
    await expect(page.locator('label[for="1019"]')).toHaveText('Position Area');
    console.log('✅ Position Area select — present, correctly labelled');
  });

  // ── STEP 7: Verify Search button is visible and enabled ───────────────────
  await test.step('STEP 7: Verify Search button is visible and enabled', async () => {
    const searchButton = page.locator('button[id="948-submit"]');
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeEnabled();
    await expect(searchButton).toHaveText('Search');
    console.log('✅ Search button — visible, enabled, labelled "Search"');
  });

  // ── STEP 8: Verify Keywords input accepts text ────────────────────────────
  await test.step('STEP 8: Verify Keywords input accepts text', async () => {
    const keywordsInput = page.locator('input[id="491"]');
    await keywordsInput.fill('Engineer');
    await expect(keywordsInput).toHaveValue('Engineer');
    console.log('✅ Keywords input accepts text: "Engineer"');
    await keywordsInput.clear();
  });

  // ── STEP 9: Navigate to "Open Positions" and verify URL ───────────────────
  await test.step('STEP 9: Click "Open Positions" and verify navigation', async () => {
    await page.locator('nav.menu a.menu__link', { hasText: 'Open Positions' }).click();
    await page.waitForURL('**/SearchJobs**', { timeout: 30000 });
    expect(page.url()).toContain('/careersmarketplace/SearchJobs');
    console.log(`✅ "Open Positions" navigated to: ${page.url()}`);
    await page.goBack({ waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ Returned to home page');
  });

  // ── STEP 10: Click "How To Apply" and verify new-tab URL ─────────────────
  await test.step('STEP 10: Click "How To Apply" and verify new-tab URL', async () => {
    const [howToApplyTab] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('nav.menu a.menu__link', { hasText: 'How To Apply' }).click(),
    ]);
    await howToApplyTab.waitForLoadState('commit', { timeout: 60000 });
    const howToApplyUrl = howToApplyTab.url();
    expect(howToApplyUrl).toContain('drive.google.com');
    expect(howToApplyUrl).toContain('12OaKUNVXkDrHxTNKtJ0lTdhC1VtYrCYg');
    console.log(`✅ "How To Apply" opened new tab: ${howToApplyUrl}`);
    await howToApplyTab.close();
  });

  // ── STEP 11: Click "What We Offer" and verify new-tab URL ────────────────
  await test.step('STEP 11: Click "What We Offer" and verify new-tab URL', async () => {
    const [whatWeOfferTab] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('nav.menu a.menu__link', { hasText: 'What We Offer' }).click(),
    ]);
    await whatWeOfferTab.waitForLoadState('commit', { timeout: 60000 });
    const whatWeOfferUrl = whatWeOfferTab.url();
    expect(whatWeOfferUrl).toContain('docs.google.com');
    expect(whatWeOfferUrl).toContain('1-DzF1ktroVWC5za3JzqRab2gUZMu_WL3FHGWj1UBwUo');
    console.log(`✅ "What We Offer" opened new tab: ${whatWeOfferUrl}`);
    await whatWeOfferTab.close();
  });

  // ── STEP 12: Verify "Not sure where to start?" banner label ─────────────
  await test.step('STEP 12: Verify "Not sure where to start?" label is visible', async () => {
    const bannerLabel = page.locator('span.banner__text__title__phrase', { hasText: 'Not sure where to start?' });
    await expect(bannerLabel).toBeVisible();
    const labelText = await bannerLabel.textContent();
    expect(labelText.trim()).toBe('Not sure where to start?');
    console.log(`✅ Banner label visible: "${labelText.trim()}"`);
  });

  // ── STEP 13: Verify "Get Recommendations" button and navigate ─────────────
  await test.step('STEP 13: Click "Get Recommendations" and verify navigation', async () => {
    const getRecommendationsBtn = page.locator('a.button--primary', { hasText: 'Get Recommendations' });
    await expect(getRecommendationsBtn).toBeVisible();

    // Verify the href before clicking
    const href = await getRecommendationsBtn.getAttribute('href');
    expect(href).toContain('/careersmarketplace/RecommendationMethods');
    console.log(`✅ "Get Recommendations" href: ${href}`);

    // Click and verify navigation
    await getRecommendationsBtn.click();
    await page.waitForURL('**/RecommendationMethods**', { timeout: 30000 });
    expect(page.url()).toContain('/careersmarketplace/RecommendationMethods');
    console.log(`✅ "Get Recommendations" navigated to: ${page.url()}`);
    await page.goBack({ waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ Returned to home page');
  });

  // ── STEP 14: Verify "See All Open Positions" button and navigate ──────────
  await test.step('STEP 14: Click "See All Open Positions" and verify navigation', async () => {
    const seeAllBtn = page.locator('a.button--secondary', { hasText: 'See All Open Positions' });
    await expect(seeAllBtn).toBeVisible();

    // Verify the href before clicking
    const href = await seeAllBtn.getAttribute('href');
    expect(href).toContain('/careersmarketplace/SearchJobs');
    console.log(`✅ "See All Open Positions" href: ${href}`);

    // Click and verify navigation
    await seeAllBtn.click();
    await page.waitForURL('**/SearchJobs**', { timeout: 30000 });
    expect(page.url()).toContain('/careersmarketplace/SearchJobs');
    console.log(`✅ "See All Open Positions" navigated to: ${page.url()}`);
    await page.goBack({ waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ Returned to home page');
  });

  // ── STEP 15: Click "Login" and verify URL ────────────────────────────────
  await test.step('STEP 15: Click "Login" and verify navigation', async () => {
    await page.locator('nav.menu a.menu__link', { hasText: 'Login' }).click();
    await page.waitForURL('**/Login**', { timeout: 30000 });
    expect(page.url()).toContain('/careersmarketplace/Login');
    console.log(`✅ "Login" navigated to: ${page.url()}`);
  });

});

