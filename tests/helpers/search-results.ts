import { expect, type Page } from '@playwright/test';

/**
 * Confirm the search results page has loaded (works for both results and no-results).
 */
export async function assertSearchResultsPageLoaded(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: 'Filter jobs by' })).toBeVisible({ timeout: 15000 });

  const resultsLegend = page.locator('.list-controls__text__legend').first();
  await expect(resultsLegend).toBeAttached();

  const ariaLabel = await resultsLegend.getAttribute('aria-label');
  if (ariaLabel) {
    console.log(`✅ Search results page loaded: ${ariaLabel.trim()}`);
  } else {
    console.log('✅ Search results page loaded');
  }
}

/**
 * Pass if job listings exist OR the "No jobs found" message is shown.
 */
export async function assertJobsOrNoJobsFound(page: Page): Promise<{ hasJobs: boolean; count: number }> {
  const noJobsHeading = page.getByRole('heading', { name: /no jobs found/i });
  const jobListingLinks = page.locator('article h3 a');

  await expect(jobListingLinks.first().or(noJobsHeading)).toBeVisible({ timeout: 15000 });

  if (await noJobsHeading.isVisible()) {
    console.log('✅ "No jobs found" message is displayed');
    return { hasJobs: false, count: 0 };
  }

  const count = await jobListingLinks.count();
  expect(count).toBeGreaterThan(0);
  console.log(`✅ Found ${count} job listing(s)`);
  return { hasJobs: true, count };
}
