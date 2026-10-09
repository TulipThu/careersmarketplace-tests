import { expect, type Locator, type Page, type Request } from '@playwright/test';
import { loginToProfile } from './auth';
import { PROFILE_URL_PATTERN } from './profile-edit';

export { PROFILE_URL_PATTERN };

export const PAGE_HEADING = 'Delete User Account';
export const FORM_TITLE = 'Are you sure you want to delete your User Account?';

export const DESCRIPTIONS = [
  'By clicking on “Delete”, you acknowledge having read our UNOPS Company Privacy Policy and consent to the terms described therein.',
];

export const PRIVACY_POLICY_URL = 'https://www.unops.org/privacy';

export const HOME_URL_PATTERN = /\/careersmarketplace(?:\/Home)?\/?(?:\?|#|$)/i;
export const HOME_HEADING = 'Careers to build the future';

export function displayedCopy(text: string | null): string {
  return String(text)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(?:ProfileDelete|DeleteUserAccount|AlexTest)\.[A-Za-z0-9.]+\s*/i, '')
    .replace(/^AlexTest\.\s*/i, '');
}

export async function expectDisplayedCopy(locator: Locator, expected: string): Promise<void> {
  await expect.poll(async () => displayedCopy(await locator.innerText())).toBe(expected);
}

export async function goToProfileDelete(page: Page): Promise<void> {
  await loginToProfile(page);
  await page.getByRole('tab', { name: 'Personal information' }).click();
  await page.getByRole('link', { name: 'Delete User Account' }).click();
  await page.waitForURL('**/ProfileDelete**', { timeout: 30000 });
  await expect(page.getByRole('heading', { name: PAGE_HEADING })).toBeVisible({ timeout: 15000 });
}

export function deleteArticle(page: Page): Locator {
  return page.locator('main article').first();
}

export function deleteButton(page: Page): Locator {
  return page.getByRole('button', { name: 'Delete', exact: true });
}

export function cancelButton(page: Page): Locator {
  return page.getByRole('button', { name: 'Cancel', exact: true });
}

/**
 * Call after the Delete page has loaded. Intercepts every non-GET request and any request
 * to ProfileDelete/Logout so the account deletion never reaches the server.
 * Blocked navigations are answered with a redirect to the home page instead.
 * Returns the list of blocked requests so the test can assert Delete was attempted.
 */
export async function blockAccountDeletion(page: Page, homeUrl: string): Promise<Request[]> {
  const blocked: Request[] = [];
  await page.route('**/*', async (route) => {
    const request = route.request();
    const touchesAccount = /\/(?:ProfileDelete|Logout)\b/i.test(request.url());
    if (request.method() === 'GET' && !touchesAccount) {
      await route.continue();
      return;
    }
    blocked.push(request);
    if (request.isNavigationRequest()) {
      await route.fulfill({ status: 302, headers: { location: homeUrl } });
    } else {
      await route.abort();
    }
  });
  return blocked;
}
