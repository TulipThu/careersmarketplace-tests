import { expect, type Page } from '@playwright/test';
import { acceptCookiesIfVisible } from './auth';

export async function goToSearchJobs(page: Page): Promise<void> {
  await page.goto('', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await acceptCookiesIfVisible(page);
  await expect(page.getByRole('heading', { name: 'Careers to build the future' })).toBeVisible({ timeout: 15000 });

  const seeAllLink = page.getByRole('link', { name: 'See All Open Positions' });
  await expect(seeAllLink).toBeVisible();
  await seeAllLink.click();
  await page.waitForURL('**/SearchJobs**', { timeout: 30000 });
}

/** Open Positions / job search results page with the filter panel. */
export async function goToOpenPositionsPage(page: Page): Promise<void> {
  await page.goto('/careersmarketplace/SearchJobs', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await acceptCookiesIfVisible(page);
  await expect(page.getByRole('heading', { name: 'Filter jobs by' })).toBeVisible({ timeout: 15000 });
}
