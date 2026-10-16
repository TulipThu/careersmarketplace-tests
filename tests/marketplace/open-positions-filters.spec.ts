import { test, expect } from '@playwright/test';
import { goToOpenPositionsPage } from '../helpers/marketplace';
import {
  OPEN_POSITIONS_FILTER,
  assertFiltersAppliedIndicator,
  assertOpenPositionsFilterPanelVisible,
  assertSomeJobCardsMatch,
  getOpenPositionsResultsCount,
  isUnfilteredSearchJobsUrl,
  selectOpenPositionsFilterOption,
  submitOpenPositionsSearch,
} from '../helpers/open-positions-filters';
import { assertJobsOrNoJobsFound, assertSearchResultsPageLoaded } from '../helpers/search-results';

test.describe('Open Positions page — job filters', () => {
  test.beforeEach(async ({ page }) => {
    await goToOpenPositionsPage(page);
    await assertOpenPositionsFilterPanelVisible(page);
  });

  test('Keyword filter updates results and shows applied-filters indicator', async ({ page }) => {
    const baselineCount = await getOpenPositionsResultsCount(page);

    await page.getByRole('combobox', { name: 'Keywords' }).fill('Engineer');
    await submitOpenPositionsSearch(page);

    await page.waitForURL(/SearchJobs/i, { timeout: 15000 });
    await assertSearchResultsPageLoaded(page);
    await assertFiltersAppliedIndicator(page);

    const filteredCount = await getOpenPositionsResultsCount(page);
    expect(filteredCount).toBeLessThanOrEqual(baselineCount);

    const { hasJobs } = await assertJobsOrNoJobsFound(page);
    if (hasJobs) {
      await assertSomeJobCardsMatch(page, /engineer|ing[eé]nieur/i);
    }
  });

  test('Country filter narrows results', async ({ page }) => {
    const baselineCount = await getOpenPositionsResultsCount(page);

    await selectOpenPositionsFilterOption(
      page,
      OPEN_POSITIONS_FILTER.countryContainer,
      'Thailand',
      'Thailand'
    );
    await submitOpenPositionsSearch(page);

    await page.waitForURL('**/SearchJobs**', { timeout: 15000 });
    await assertSearchResultsPageLoaded(page);
    await assertFiltersAppliedIndicator(page);

    const filteredCount = await getOpenPositionsResultsCount(page);
    expect(filteredCount).toBeLessThanOrEqual(baselineCount);

    await assertSomeJobCardsMatch(page, /Thailand/i);
  });

  test('Country and Duty Station filters return location-consistent results', async ({ page }) => {
    await selectOpenPositionsFilterOption(
      page,
      OPEN_POSITIONS_FILTER.countryContainer,
      'Thailand',
      'Thailand'
    );

    // Duty station options may load after country selection.
    await page.waitForTimeout(2000);

    await selectOpenPositionsFilterOption(
      page,
      OPEN_POSITIONS_FILTER.dutyStationContainer,
      'Bangkok',
      'Bangkok'
    );
    await submitOpenPositionsSearch(page);

    await page.waitForURL('**/SearchJobs**', { timeout: 15000 });
    await assertSearchResultsPageLoaded(page);
    await assertFiltersAppliedIndicator(page);

    await assertSomeJobCardsMatch(page, /Bangkok|Thailand/i);
  });

  test('Seniority Level filter applies and updates the results list', async ({ page }) => {
    const baselineCount = await getOpenPositionsResultsCount(page);

    await selectOpenPositionsFilterOption(
      page,
      OPEN_POSITIONS_FILTER.seniorityContainer,
      'Mid Level',
      /Mid Level/i
    );
    await submitOpenPositionsSearch(page);

    await page.waitForURL('**/SearchJobs**', { timeout: 15000 });
    await assertSearchResultsPageLoaded(page);
    await assertFiltersAppliedIndicator(page);

    const filteredCount = await getOpenPositionsResultsCount(page);
    expect(filteredCount).toBeLessThanOrEqual(baselineCount);

    await assertSomeJobCardsMatch(page, /Mid Level/i);
  });

  test('Reset control restores unfiltered results after keyword search', async ({ page }) => {
    const baselineCount = await getOpenPositionsResultsCount(page);

    await page.getByRole('combobox', { name: 'Keywords' }).fill('Engineer');
    await submitOpenPositionsSearch(page);
    await page.waitForURL(/SearchJobs\/Engineer/i, { timeout: 15000 });
    await assertFiltersAppliedIndicator(page);

    const filteredCount = await getOpenPositionsResultsCount(page);
    expect(filteredCount).toBeLessThanOrEqual(baselineCount);

    const resetLink = page.getByRole('link', { name: 'Reset search filters' });
    await expect(resetLink).toBeVisible();
    await Promise.all([
      page.waitForURL((url) => isUnfilteredSearchJobsUrl(url.toString()), { timeout: 15000 }),
      resetLink.click(),
    ]);

    await assertSearchResultsPageLoaded(page);
    const restoredCount = await getOpenPositionsResultsCount(page);
    expect(restoredCount).toBeGreaterThan(filteredCount);
    expect(restoredCount).toBe(baselineCount);
  });
});
