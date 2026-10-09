import { test, expect } from '@playwright/test';
import { assertSearchResultsPageLoaded, assertJobsOrNoJobsFound } from '../helpers/search-results';
import { goToSearchJobs } from '../helpers/marketplace';

test('Navigate and validate Open Positions on UNOPS Careers page', async ({ page }) => {
  await goToSearchJobs(page);

  await expect(page.getByRole('navigation', { name: 'Main menu' }).getByRole('link', { name: 'Open Positions' })).toBeVisible();
  await expect(page.getByRole('list', { name: 'breadcrumbs' }).getByText('Open Positions')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Filter jobs by' })).toBeVisible();

  let { hasJobs } = await assertJobsOrNoJobsFound(page);

  const keywordInput = page.getByRole('combobox', { name: 'Keywords' });
  await keywordInput.fill('Engineer');
  await page.getByRole('button', { name: 'Search' }).click();

  await page.waitForURL(/SearchJobs\/Engineer/i, { timeout: 15000 });
  await assertSearchResultsPageLoaded(page);
  await expect(page.locator('.list-controls__text__reset').first()).toBeAttached();

  ({ hasJobs } = await assertJobsOrNoJobsFound(page));
  if (!hasJobs) return;

  await page.locator('article h3 a').first().click();
  await page.waitForURL('**/JobDetail/**', { timeout: 15000 });
  const jobHeading = page.locator('h1').first();
  await expect(jobHeading).toBeVisible();
  console.log(`Job detail page loaded for: ${await jobHeading.textContent()}`);
});

test('Search for specific job with filters', async ({ page }) => {
  await goToSearchJobs(page);

  await page.getByRole('combobox', { name: 'Keywords' }).fill('Engineer');
  await page.getByRole('button', { name: 'Search' }).click();

  await page.waitForURL(/SearchJobs\/Engineer/i, { timeout: 15000 });
  await assertSearchResultsPageLoaded(page);
  await expect(page.locator('.list-controls__text__reset').first()).toBeAttached();

  const { hasJobs } = await assertJobsOrNoJobsFound(page);
  if (!hasJobs) return;

  const jobCards = page.locator('article');

  const titlesAndLinks = await jobCards.evaluateAll((cards) =>
    cards.map((card) => {
      const title = card.querySelector('h3')?.textContent ?? '';
      const href = card.querySelector('h3 a')?.getAttribute('href') ?? '';
      const share = card.querySelector('button')?.getAttribute('aria-label') ?? '';
      return `${title} ${href} ${share}`;
    })
  );
  const matchesKeyword = titlesAndLinks.some((text) => /engineer|ing[eé]nieur/i.test(text));
  expect(matchesKeyword).toBeTruthy();

  const firstJobTitle = (await page.locator('article h3').first().innerText()).replace(/\s+/g, ' ').trim();
  console.log(`Search successful. First result: ${firstJobTitle}`);
});
