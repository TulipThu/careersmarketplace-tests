import { test, expect } from '@playwright/test';
import { goToOpenPositionsPage } from '../helpers/marketplace';
import { assertSearchResultsPageLoaded } from '../helpers/search-results';
import {
  applySortBy,
  assertJobIcsLevelsSortedBy,
  assertJobPostingDatesSortedBy,
  assertJobTitlesSortedBy,
  assertSortByControlVisible,
  assertSortMenuOptionsVisible,
  getVisibleJobTitles,
  OPEN_POSITIONS_SORT_OPTIONS,
} from '../helpers/open-positions-sort';

test.describe('Open Positions page — Sort by', () => {
  test.beforeEach(async ({ page }) => {
    await goToOpenPositionsPage(page);
    await assertSearchResultsPageLoaded(page);
    await assertSortByControlVisible(page);
  });

  test('Sort by control exposes all sort options', async ({ page }) => {
    await assertSortMenuOptionsVisible(page);
    expect(OPEN_POSITIONS_SORT_OPTIONS).toEqual([
      'Position Title',
      'ICS Level',
      'Posting End Date',
    ]);
  });

  test('Sort by Position Title orders job titles ascending', async ({ page }) => {
    await applySortBy(page, 'Position Title');
    await assertJobTitlesSortedBy(page, 'asc');
  });

  test('Sort by Posting End Date orders closing dates ascending', async ({ page }) => {
    await applySortBy(page, 'Posting End Date');
    await assertJobPostingDatesSortedBy(page, 'asc');
  });

  test('Sort by ICS Level orders seniority labels ascending', async ({ page }) => {
    await applySortBy(page, 'ICS Level');
    await assertJobIcsLevelsSortedBy(page, 'asc');
  });

  test('Selecting the same sort option again toggles sort direction', async ({ page }) => {
    await applySortBy(page, 'Posting End Date');
    await assertJobPostingDatesSortedBy(page, 'asc');
    const directionAfterFirst = await page.locator('#tpt_jobSortDirection').inputValue();
    const firstTitleAscending = (await getVisibleJobTitles(page))[0];

    await assertSortByControlVisible(page);
    await applySortBy(page, 'Posting End Date');
    const directionAfterSecond = await page.locator('#tpt_jobSortDirection').inputValue();
    expect(directionAfterSecond).not.toBe(directionAfterFirst);

    await assertJobPostingDatesSortedBy(page, 'desc');
    await expect(
      page.locator('.list-controls__sort [aria-label="Sort by"]').getByRole('button')
    ).toHaveText(/Sorted by Posting End Date/i);

    const firstTitleDescending = (await getVisibleJobTitles(page))[0];
    expect(firstTitleDescending).not.toBe(firstTitleAscending);
  });
});
