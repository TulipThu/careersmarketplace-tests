const { test, expect } = require('@playwright/test');

const CAREERS_URL = 'https://careers.unops.org/careersmarketplace';

/**
 * Helper: Accept cookies if the banner appears.
 */
async function acceptCookiesIfVisible(page) {
  const acceptBtn = page.getByRole('button', { name: 'Accept all' });
  try {
    await acceptBtn.waitFor({ state: 'visible', timeout: 5000 });
    await acceptBtn.click();
    await page.waitForTimeout(500);
  } catch {
    // Cookie banner not shown — continue
  }
}

// ---------------------------------------------------------------------------
// TEST 1: Verify that all four search input fields exist on the page
// ---------------------------------------------------------------------------
test('Verify four search input fields are present on Careers Marketplace', async ({ page }) => {
  // STEP 1: Navigate to the Careers Marketplace page
  await page.goto(CAREERS_URL);
  await acceptCookiesIfVisible(page);

  // STEP 2: Wait for the search form to be fully loaded
  const searchForm = page.locator('#tpt_jobSortableForm');
  await expect(searchForm).toBeVisible({ timeout: 15000 });

  // STEP 3: Verify "Keywords" text input is present
  const keywordsLabel = page.locator('label[for="491"]');
  await expect(keywordsLabel).toBeVisible();
  await expect(keywordsLabel).toHaveText('Keywords');

  const keywordsInput = page.locator('input#\\34 91');
  await expect(keywordsInput).toBeVisible();

  // STEP 4: Verify "Country" select field is present
  const countryLabel = page.locator('label[for="4611"]');
  await expect(countryLabel).toBeVisible();
  await expect(countryLabel).toHaveText('Country');

  const countryContainer = page.locator('#fieldSpecContainer4611');
  await expect(countryContainer).toBeVisible();

  // STEP 5: Verify "Duty Station" select field is present
  const dutyStationLabel = page.locator('label[for="1018"]');
  await expect(dutyStationLabel).toBeVisible();
  await expect(dutyStationLabel).toHaveText('Duty Station');

  const dutyStationContainer = page.locator('#fieldSpecContainer1018');
  await expect(dutyStationContainer).toBeVisible();

  // STEP 6: Verify "Position Area" select field is present
  const positionAreaLabel = page.locator('label[for="1019"]');
  await expect(positionAreaLabel).toBeVisible();
  await expect(positionAreaLabel).toHaveText('Position Area');

  const positionAreaContainer = page.locator('#fieldSpecContainer1019');
  await expect(positionAreaContainer).toBeVisible();

  console.log('✅ All four search fields verified: Keywords, Country, Duty Station, Position Area');
});

// ---------------------------------------------------------------------------
// TEST 2: Select Country = Thailand, Duty Station = Bangkok, and search
// ---------------------------------------------------------------------------
test('Search with Country = Thailand and Duty Station = Bangkok', async ({ page }) => {
  // STEP 1: Navigate to the Careers Marketplace page
  await page.goto(CAREERS_URL);
  await acceptCookiesIfVisible(page);

  // STEP 2: Wait for the search form
  const searchForm = page.locator('#tpt_jobSortableForm');
  await expect(searchForm).toBeVisible({ timeout: 15000 });

  // STEP 3: Select "Thailand" in the Country field (Select2 autocomplete)
  // Click the Select2 container to open the dropdown
  const countrySelect2 = page.locator('#fieldSpecContainer4611 .select2-container');
  await countrySelect2.waitFor({ state: 'visible', timeout: 10000 });
  await countrySelect2.click();

  // Type "Thailand" in the Select2 search input
  const countrySearchInput = page.locator('.select2-container--open .select2-search__field');
  await countrySearchInput.waitFor({ state: 'visible', timeout: 5000 });
  await countrySearchInput.fill('Thailand');

  // Wait for dropdown results and select "Thailand"
  const thailandOption = page.locator('.select2-results__option', { hasText: 'Thailand' });
  await thailandOption.waitFor({ state: 'visible', timeout: 10000 });
  await thailandOption.click();
  console.log('✅ Country "Thailand" selected');

  // STEP 4: Wait for Duty Station options to load (it depends on Country)
  await page.waitForTimeout(2000);

  // STEP 5: Select "Bangkok" in the Duty Station field
  const dutyStationSelect2 = page.locator('#fieldSpecContainer1018 .select2-container');
  await dutyStationSelect2.waitFor({ state: 'visible', timeout: 10000 });
  await dutyStationSelect2.click();

  // Type "Bangkok" in the Select2 search input
  const dutyStationSearchInput = page.locator('.select2-container--open .select2-search__field');
  await dutyStationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
  await dutyStationSearchInput.fill('Bangkok');

  // Wait for dropdown results and select "Bangkok"
  const bangkokOption = page.locator('.select2-results__option', { hasText: 'Bangkok' });
  await bangkokOption.waitFor({ state: 'visible', timeout: 10000 });
  await bangkokOption.click();
  console.log('✅ Duty Station "Bangkok" selected');

  // STEP 6: Click the Search button
  const searchButton = page.locator('button#\\39 48-submit');
  await expect(searchButton).toBeVisible();
  await searchButton.click();
  console.log('✅ Search button clicked');

  // STEP 7: Wait for navigation to the search results page
  await page.waitForURL('**/SearchJobs**', { timeout: 15000 });
  console.log(`✅ Navigated to search results: ${page.url()}`);

  // STEP 8: Verify the results page loaded with search results
  // The results page shows a results count (e.g. "5 results") and a "Filter jobs by" section
  const resultsText = page.locator('.list-controls__text__legend').first();
  await expect(resultsText).toBeVisible({ timeout: 15000 });
  const resultsContent = await resultsText.textContent();
  console.log(`✅ Search results loaded: ${resultsContent.trim()}`);

  // STEP 9: Verify that the "Filters applied" reset link is visible (confirms filters were used)
  const filtersApplied = page.locator('.list-controls__text__reset').first();
  await expect(filtersApplied).toBeVisible();
  console.log('✅ Filters applied confirmation is visible on the results page');
});
