import { expect, type Page } from '@playwright/test';
import { assertJobsOrNoJobsFound } from './search-results';

/** Field container selectors on /careersmarketplace/SearchJobs (Open Positions). */
export const OPEN_POSITIONS_FILTER = {
  keywordsInput: '#266',
  countryContainer: '#fieldSpecContainer4612',
  dutyStationContainer: '#fieldSpecContainer914',
  positionAreaContainer: '#fieldSpecContainer911',
  seniorityContainer: '#fieldSpecContainer3533',
  languageContainer: '#fieldSpecContainer4586',
} as const;

function openPositionsSearchButton(page: Page) {
  return page.getByRole('button', { name: 'Search' });
}

export async function assertOpenPositionsFilterPanelVisible(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: 'Filter jobs by' })).toBeVisible({ timeout: 15000 });

  await expect(page.getByRole('combobox', { name: 'Keywords' })).toBeVisible();
  await expect(page.locator('label[for="4612"]')).toHaveText('Country');
  await expect(page.locator('label[for="914"]')).toHaveText('Duty Station');
  await expect(page.locator('label[for="911"]')).toHaveText('Position Area');
  await expect(page.locator('label[for="3533"]')).toHaveText('Seniority Level');
  await expect(page.locator('label[for="4586"]')).toHaveText('Language');

  const searchButton = openPositionsSearchButton(page);
  await expect(searchButton).toBeVisible();
  await expect(searchButton).toHaveText('Search');
}

/**
 * Select a value in a Select2-backed filter on the Open Positions page.
 */
export async function selectOpenPositionsFilterOption(
  page: Page,
  fieldContainerSelector: string,
  searchText: string,
  optionText: string | RegExp
): Promise<void> {
  const select2 = page.locator(`${fieldContainerSelector} .select2-container`);
  await select2.waitFor({ state: 'visible', timeout: 10000 });
  await select2.click();

  const searchInput = page.locator('.select2-container--open .select2-search__field');
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.fill(searchText);

  const option = page.locator('.select2-results__option', { hasText: optionText });
  await option.waitFor({ state: 'visible', timeout: 10000 });
  await option.click();
}

export async function submitOpenPositionsSearch(page: Page): Promise<void> {
  const searchButton = openPositionsSearchButton(page);
  await expect(searchButton).toBeVisible();
  await searchButton.click();
}

export async function assertFiltersAppliedIndicator(page: Page): Promise<void> {
  await expect(page.locator('.list-controls__text__reset').first()).toBeAttached();
}

export async function getOpenPositionsResultsCount(page: Page): Promise<number> {
  const legend = page.locator('.list-controls__text__legend').first();
  await expect(legend).toBeAttached();

  const ariaLabel = (await legend.getAttribute('aria-label')) ?? '';
  const fromAria = ariaLabel.match(/(\d+)\s+results?/i);
  if (fromAria) {
    return parseInt(fromAria[1], 10);
  }

  const text = ((await legend.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  const fromText = text.match(/(\d+)\s+results?/i);
  expect(fromText, `Could not parse results count from: "${text}"`).toBeTruthy();
  return parseInt(fromText![1], 10);
}

/** True when the URL is the unfiltered Open Positions list (no keyword path segment). */
export function isUnfilteredSearchJobsUrl(url: string): boolean {
  return /\/SearchJobs\/?(\?|$)/i.test(url) && !/\/SearchJobs\/[^/?#]+/i.test(url);
}

/**
 * When jobs are listed, at least one card body should match the pattern (e.g. location).
 */
export async function assertSomeJobCardsMatch(page: Page, pattern: RegExp): Promise<void> {
  const { hasJobs } = await assertJobsOrNoJobsFound(page);
  if (!hasJobs) {
    return;
  }

  const cardTexts = await page.locator('article').evaluateAll((cards) =>
    cards.map((card) => (card.textContent ?? '').replace(/\s+/g, ' ').trim())
  );

  const matches = cardTexts.some((text) => pattern.test(text));
  expect(matches).toBeTruthy();
}
