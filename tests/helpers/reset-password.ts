import { expect, type Locator, type Page } from '@playwright/test';
import { loginToProfile } from './auth';
import { PROFILE_URL_PATTERN } from './profile-edit';

export { PROFILE_URL_PATTERN };

export const PAGE_HEADING = 'Reset Password';
export const FORM_TITLE = 'Reset your password';
export const CONFIRMATION_TITLE = 'Check your email';
export const EMAIL_LABEL = 'E-Email *';
export const EMAIL_INPUT = '#tpt_resetPasswordEmail';

export const DESCRIPTIONS = [
  'Enter the email address associated with your account, then click "Continue".',
  "We'll email you a link to reset your password. NOTE: Accounts under the UNOPS email address will not be able to log in to the Careers Portal.",
];

export const CONFIRMATION_DESCRIPTION =
  'If the email address you entered is associated with an account in our records, you will receive an email from us with instructions for resetting your password.';

export function displayedCopy(text: string | null): string {
  return String(text)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^ResetPassword\.[A-Za-z0-9]+\.\s*/i, '');
}

export async function expectDisplayedCopy(locator: Locator, expected: string): Promise<void> {
  await expect.poll(async () => displayedCopy(await locator.innerText())).toBe(expected);
}

export async function goToResetPassword(page: Page): Promise<void> {
  await loginToProfile(page);
  await page.getByRole('tab', { name: 'Personal information' }).click();
  await page.getByRole('link', { name: 'Reset Password' }).click();
  await page.waitForURL('**/ResetPassword**', { timeout: 30000 });
  await expect(page.getByRole('heading', { name: FORM_TITLE })).toBeVisible({ timeout: 15000 });
}

export function emailField(page: Page): Locator {
  return page.locator(EMAIL_INPUT);
}

export function emailLabel(page: Page): Locator {
  return page.locator('label[for="tpt_resetPasswordEmail"]');
}
