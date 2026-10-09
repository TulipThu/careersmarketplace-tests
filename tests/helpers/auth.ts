import { expect, test, type Page } from '@playwright/test';

export async function acceptCookiesIfVisible(page: Page): Promise<void> {
  const acceptCookiesBtn = page.getByRole('button', { name: 'Accept all' });
  try {
    await acceptCookiesBtn.waitFor({ state: 'visible', timeout: 5000 });
    await acceptCookiesBtn.click();
    await page.waitForTimeout(500);
  } catch {
    // Cookie banner not shown
  }
}

export function getCredentials(): { loginEmail: string; loginPassword: string } {
  const loginEmail = process.env.LOGIN_EMAIL;
  const loginPassword = process.env.LOGIN_PASSWORD;

  test.skip(
    !loginEmail || !loginPassword,
    'Set LOGIN_EMAIL and encrypted credentials in .env (see .env.example).'
  );

  return { loginEmail: loginEmail ?? '', loginPassword: loginPassword ?? '' };
}

export async function fillAndSubmitLogin(page: Page, loginEmail: string, loginPassword: string): Promise<void> {
  const usernameInput = page.locator('input[name="username"], input[type="email"], input[name="email"], #username, #email');
  await expect(usernameInput.first()).toBeVisible();
  await usernameInput.first().fill(loginEmail);

  const passwordInput = page.locator('input[type="password"], input[name="password"], #password');
  await expect(passwordInput.first()).toBeVisible();
  await passwordInput.first().fill(loginPassword);

  const submitBtn = page.locator('button[type="submit"], input[type="submit"], .btn-login, button:has-text("Log in"), button:has-text("Login")');
  await expect(submitBtn.first()).toBeVisible();
  await submitBtn.first().click();
}

export async function loginToProfile(page: Page): Promise<void> {
  const { loginEmail, loginPassword } = getCredentials();

  await page.goto('/careersmarketplace/Login');
  await acceptCookiesIfVisible(page);
  await fillAndSubmitLogin(page, loginEmail, loginPassword);

  await page.waitForURL('**/careersmarketplace/Profile**', { timeout: 30000 });
  await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible({ timeout: 15000 });
}
