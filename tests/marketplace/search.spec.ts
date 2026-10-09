import { test, expect } from '@playwright/test';
import { assertSearchResultsPageLoaded, assertJobsOrNoJobsFound } from '../helpers/search-results';
import { acceptCookiesIfVisible } from '../helpers/auth';

test('Verify four search input fields are present on Careers Marketplace', async ({ page }) => {
  await page.goto('/careersmarketplace');
  await acceptCookiesIfVisible(page);

  const searchForm = page.locator('#tpt_jobSortableForm');
  await expect(searchForm).toBeVisible({ timeout: 15000 });

  const keywordsLabel = page.locator('label[for="491"]');
  await expect(keywordsLabel).toBeVisible();
  await expect(keywordsLabel).toHaveText('Keywords');

  const keywordsInput = page.locator('input#\\34 91');
  await expect(keywordsInput).toBeVisible();

  const countryLabel = page.locator('label[for="4611"]');
  await expect(countryLabel).toBeVisible();
  await expect(countryLabel).toHaveText('Country');

  const countryContainer = page.locator('#fieldSpecContainer4611');
  await expect(countryContainer).toBeVisible();

  const dutyStationLabel = page.locator('label[for="1018"]');
  await expect(dutyStationLabel).toBeVisible();
  await expect(dutyStationLabel).toHaveText('Duty Station');

  const dutyStationContainer = page.locator('#fieldSpecContainer1018');
  await expect(dutyStationContainer).toBeVisible();

  const positionAreaLabel = page.locator('label[for="1019"]');
  await expect(positionAreaLabel).toBeVisible();
  await expect(positionAreaLabel).toHaveText('Position Area');

  const positionAreaContainer = page.locator('#fieldSpecContainer1019');
  await expect(positionAreaContainer).toBeVisible();

  console.log('✅ All four search fields verified: Keywords, Country, Duty Station, Position Area');
});

test('Search with Country = Thailand and Duty Station = Bangkok', async ({ page }) => {
  await page.goto('/careersmarketplace');
  await acceptCookiesIfVisible(page);

  const searchForm = page.locator('#tpt_jobSortableForm');
  await expect(searchForm).toBeVisible({ timeout: 15000 });

  const countrySelect2 = page.locator('#fieldSpecContainer4611 .select2-container');
  await countrySelect2.waitFor({ state: 'visible', timeout: 10000 });
  await countrySelect2.click();

  const countrySearchInput = page.locator('.select2-container--open .select2-search__field');
  await countrySearchInput.waitFor({ state: 'visible', timeout: 5000 });
  await countrySearchInput.fill('Thailand');

  const thailandOption = page.locator('.select2-results__option', { hasText: 'Thailand' });
  await thailandOption.waitFor({ state: 'visible', timeout: 10000 });
  await thailandOption.click();
  console.log('✅ Country "Thailand" selected');

  await page.waitForTimeout(2000);

  const dutyStationSelect2 = page.locator('#fieldSpecContainer1018 .select2-container');
  await dutyStationSelect2.waitFor({ state: 'visible', timeout: 10000 });
  await dutyStationSelect2.click();

  const dutyStationSearchInput = page.locator('.select2-container--open .select2-search__field');
  await dutyStationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
  await dutyStationSearchInput.fill('Bangkok');

  const bangkokOption = page.locator('.select2-results__option', { hasText: 'Bangkok' });
  await bangkokOption.waitFor({ state: 'visible', timeout: 10000 });
  await bangkokOption.click();
  console.log('✅ Duty Station "Bangkok" selected');

  const searchButton = page.locator('button#\\39 48-submit');
  await expect(searchButton).toBeVisible();
  await searchButton.click();
  console.log('✅ Search button clicked');

  await page.waitForURL('**/SearchJobs**', { timeout: 15000 });
  console.log(`✅ Navigated to search results: ${page.url()}`);

  await assertSearchResultsPageLoaded(page);

  const filtersApplied = page.locator('.list-controls__text__reset').first();
  await expect(filtersApplied).toBeAttached();
  console.log('✅ Filters applied confirmation is present on the results page');

  await assertJobsOrNoJobsFound(page);
});
