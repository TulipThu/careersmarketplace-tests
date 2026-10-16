import { expect, type Page } from '@playwright/test';
import { assertJobsOrNoJobsFound } from './search-results';

export const OPEN_POSITIONS_SORT_OPTIONS = [
  'Position Title',
  'ICS Level',
  'Posting End Date',
] as const;

export type OpenPositionsSortOption = (typeof OPEN_POSITIONS_SORT_OPTIONS)[number];

export interface JobCardSummary {
  title: string;
  location: string;
  icsLevel: string;
  postingEndDate: Date;
}

function sortByRegion(page: Page) {
  return page.locator('.list-controls__sort [aria-label="Sort by"]');
}

function sortByControl(page: Page) {
  return sortByRegion(page).getByRole('button');
}

export async function assertSortByControlVisible(page: Page): Promise<void> {
  await expect(sortByRegion(page)).toBeVisible({ timeout: 15000 });
  await expect(sortByControl(page)).toBeVisible();
  await expect(sortByControl(page)).toHaveText(/Sort(ed)? by/i);
}

export async function openSortByMenu(page: Page): Promise<void> {
  const button = sortByControl(page);
  await expect(button).toBeVisible();
  await button.click();
}

export async function assertSortMenuOptionsVisible(page: Page): Promise<void> {
  await openSortByMenu(page);
  for (const option of OPEN_POSITIONS_SORT_OPTIONS) {
    await expect(page.getByLabel(`Sort jobs by ${option}`, { exact: true })).toBeVisible();
  }
  await page.keyboard.press('Escape');
}

/**
 * Choose a sort field from the Sort by dropdown on Open Positions.
 */
export async function applySortBy(page: Page, option: OpenPositionsSortOption): Promise<void> {
  const sortFieldBefore = await page.locator('#tpt_jobSort').inputValue();
  const sortDirectionBefore = await page.locator('#tpt_jobSortDirection').inputValue();

  await openSortByMenu(page);
  await page.getByLabel(`Sort jobs by ${option}`, { exact: true }).click();

  await expect
    .poll(async () => {
      const sortField = await page.locator('#tpt_jobSort').inputValue();
      const sortDirection = await page.locator('#tpt_jobSortDirection').inputValue();
      return `${sortField}|${sortDirection}`;
    }, { timeout: 15000 })
    .not.toBe(`${sortFieldBefore}|${sortDirectionBefore}`);

  await expect(page.locator('article h3').first()).toBeVisible({ timeout: 15000 });
}

async function readVisibleJobTitles(page: Page): Promise<string[]> {
  const count = await page.locator('article h3').count();
  if (count === 0) {
    return [];
  }

  return page.locator('article h3').evaluateAll((headings) =>
    headings.map((heading) => (heading.textContent ?? '').replace(/\s+/g, ' ').trim())
  );
}

export async function getVisibleJobTitles(page: Page): Promise<string[]> {
  const { hasJobs } = await assertJobsOrNoJobsFound(page);
  if (!hasJobs) {
    return [];
  }

  return readVisibleJobTitles(page);
}

async function readVisibleJobCardSummaries(page: Page): Promise<JobCardSummary[]> {
  return page.locator('article').evaluateAll((cards) => {
    const parseDate = (raw: string): Date => {
      const parsed = Date.parse(raw.replace(/-/g, ' '));
      return Number.isNaN(parsed) ? new Date(0) : new Date(parsed);
    };

    return cards.map((card) => {
      const title = (card.querySelector('h3')?.textContent ?? '').replace(/\s+/g, ' ').trim();
      const subtitle = (card.querySelector('.article__header__text__subtitle')?.textContent ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const parts = subtitle.split('•').map((part) => part.trim());
      const location = parts[0] ?? '';
      const icsLevel = parts[1] ?? '';
      const postingEndDate = parseDate(parts[2] ?? '');

      return { title, location, icsLevel, postingEndDate };
    });
  });
}

export async function getVisibleJobCardSummaries(page: Page): Promise<JobCardSummary[]> {
  const { hasJobs } = await assertJobsOrNoJobsFound(page);
  if (!hasJobs) {
    return [];
  }

  return readVisibleJobCardSummaries(page);
}

export function isSortedAscendingStrings(values: string[]): boolean {
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1].localeCompare(values[i], 'en', { sensitivity: 'base' }) > 0) {
      return false;
    }
  }
  return true;
}

export function isSortedDescendingStrings(values: string[]): boolean {
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1].localeCompare(values[i], 'en', { sensitivity: 'base' }) < 0) {
      return false;
    }
  }
  return true;
}

export function isSortedAscendingDates(values: Date[]): boolean {
  for (let i = 1; i < values.length; i++) {
    if (values[i].getTime() < values[i - 1].getTime()) {
      return false;
    }
  }
  return true;
}

export function isSortedDescendingDates(values: Date[]): boolean {
  for (let i = 1; i < values.length; i++) {
    if (values[i].getTime() > values[i - 1].getTime()) {
      return false;
    }
  }
  return true;
}

export async function assertJobTitlesSortedBy(
  page: Page,
  direction: 'asc' | 'desc'
): Promise<void> {
  const titles = await readVisibleJobTitles(page);
  expect(titles.length).toBeGreaterThan(1);

  const isSorted =
    direction === 'asc' ? isSortedAscendingStrings(titles) : isSortedDescendingStrings(titles);
  expect(isSorted).toBeTruthy();
}

export async function assertJobPostingDatesSortedBy(
  page: Page,
  direction: 'asc' | 'desc'
): Promise<void> {
  const summaries = await readVisibleJobCardSummaries(page);
  expect(summaries.length).toBeGreaterThan(1);

  const dates = summaries.map((job) => job.postingEndDate);
  const isSorted =
    direction === 'asc' ? isSortedAscendingDates(dates) : isSortedDescendingDates(dates);
  expect(isSorted).toBeTruthy();
}

export async function assertJobIcsLevelsSortedBy(
  page: Page,
  direction: 'asc' | 'desc'
): Promise<void> {
  const summaries = await readVisibleJobCardSummaries(page);
  expect(summaries.length).toBeGreaterThan(1);

  const levels = summaries.map((job) => job.icsLevel);
  const isSorted =
    direction === 'asc' ? isSortedAscendingStrings(levels) : isSortedDescendingStrings(levels);
  expect(isSorted).toBeTruthy();
}
