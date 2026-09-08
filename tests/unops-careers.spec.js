const { test, expect } = require('@playwright/test');

const HOME_URL = 'https://careers.unops.org/';

async function acceptCookiesIfVisible(page) {
  const acceptCookiesBtn = page.getByRole('button', { name: 'Accept all' });
  try {
    await acceptCookiesBtn.waitFor({ state: 'visible', timeout: 5000 });
    await acceptCookiesBtn.click();
  } catch {
    // Cookie banner not shown
  }
}

async function goToSearchJobs(page) {
  await page.goto(HOME_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await acceptCookiesIfVisible(page);
  await expect(page.getByRole('heading', { name: 'Careers to build the future' })).toBeVisible({ timeout: 15000 });

  const seeAllLink = page.getByRole('link', { name: 'See All Open Positions' });
  await expect(seeAllLink).toBeVisible();
  await seeAllLink.click();
  await page.waitForURL('**/SearchJobs**', { timeout: 30000 });
}

test('Navigate and validate Open Positions on UNOPS Careers page', async ({ page }) => {
  await goToSearchJobs(page);

  // SearchJobs uses a breadcrumb + filter heading, not an "Open Positions" page heading
  await expect(page.getByRole('navigation', { name: 'Main menu' }).getByRole('link', { name: 'Open Positions' })).toBeVisible();
  await expect(page.getByRole('list', { name: 'breadcrumbs' }).getByText('Open Positions')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Filter jobs by' })).toBeVisible();

  const jobListings = page.locator('article h3');
  await expect(jobListings.first()).toBeVisible({ timeout: 15000 });
  const count = await jobListings.count();
  expect(count).toBeGreaterThan(0);
  console.log(`Found ${count} job listings`);

  const firstJob = page.locator('article').first();
  await expect(firstJob).toBeVisible();

  const keywordInput = page.getByRole('combobox', { name: 'Keywords' });
  await keywordInput.fill('Engineer');
  await page.getByRole('button', { name: 'Search' }).click();

  await page.waitForURL(/SearchJobs\/Engineer/i, { timeout: 15000 });
  await expect(page.locator('.list-controls__text__legend').first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.list-controls__text__reset').first()).toBeVisible();

  const filteredJobs = page.locator('article');
  await expect(filteredJobs.first()).toBeVisible();
  const filteredCount = await filteredJobs.count();
  expect(filteredCount).toBeGreaterThan(0);
  console.log(`Found ${filteredCount} Engineer search results`);

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
  await expect(page.locator('.list-controls__text__legend').first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.list-controls__text__reset').first()).toBeVisible();

  const jobCards = page.locator('article');
  await expect(jobCards.first()).toBeVisible();

  // Keyword search can match job body, not only the title of the first card
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
