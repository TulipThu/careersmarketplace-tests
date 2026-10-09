import { test, expect } from '@playwright/test';
import {
  PAGE_HEADING,
  FORM_TITLE,
  CONFIRMATION_TITLE,
  EMAIL_LABEL,
  DESCRIPTIONS,
  CONFIRMATION_DESCRIPTION,
  PROFILE_URL_PATTERN,
  goToResetPassword,
  emailField,
  emailLabel,
  expectDisplayedCopy,
} from '../helpers/reset-password';

test.describe('UNOPS Careers - Reset Password Page', () => {

  test.beforeEach(async ({ page }) => {
    await goToResetPassword(page);
  });

  test('Verify title, descriptions, email field, and action buttons', async ({ page }) => {
    await test.step('Verify page URL and title text', async () => {
      await expect(page).toHaveURL(/\/careersmarketplace\/ResetPassword/i);
      await expect(page.locator('h2.banner__text__title')).toHaveText(PAGE_HEADING);
      await expect(page.locator('h3.article__header__text__title')).toHaveText(FORM_TITLE);
      console.log(`✅ Title text is "${PAGE_HEADING}" / "${FORM_TITLE}"`);
    });

    await test.step('Verify description text', async () => {
      const descriptionParagraphs = page.locator('article.article--password p.paragraph');
      await expect(descriptionParagraphs).toHaveCount(DESCRIPTIONS.length);
      for (let i = 0; i < DESCRIPTIONS.length; i++) {
        await expectDisplayedCopy(descriptionParagraphs.nth(i), DESCRIPTIONS[i]);
        console.log(`✅ Description text is "${DESCRIPTIONS[i]}"`);
      }
    });

    await test.step('Verify email label and textbox', async () => {
      const label = emailLabel(page);
      await expect(label).toBeVisible();
      await expectDisplayedCopy(label, EMAIL_LABEL);

      const field = emailField(page);
      await expect(field).toBeVisible();
      await expect(field).toBeEnabled();
      await expect(field).toHaveAttribute('type', 'email');
      console.log(`✅ Email label text is "${EMAIL_LABEL}"`);
    });

    await test.step('Verify Continue and Cancel actions', async () => {
      const continueBtn = page.getByRole('button', { name: 'Continue', exact: true });
      await expect(continueBtn).toBeVisible();
      await expect(continueBtn).toBeEnabled();

      const cancelLink = page.locator('main').getByRole('link', { name: 'Cancel', exact: true });
      await expect(cancelLink).toBeVisible();
      await expect(cancelLink).toHaveAttribute('href', /\/careersmarketplace\/Profile/i);
      console.log('✅ Continue button and Cancel link are visible');
    });
  });

  test('Verify email textbox accepts text', async ({ page }) => {
    const field = emailField(page);

    await test.step('Fill email textbox', async () => {
      await field.fill('candidate@example.com');
      await expect(field).toHaveValue('candidate@example.com');
      console.log('✅ Email textbox accepts text');
    });
  });

  test('Verify Continue shows validation when email is empty', async ({ page }) => {
    await test.step('Click Continue without entering an email', async () => {
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      console.log('✅ Clicked Continue with empty email');
    });

    await test.step('Verify required email error and remain on page', async () => {
      await expect(page).toHaveURL(/\/careersmarketplace\/ResetPassword/i);
      await expect(page.getByRole('alert')).toContainText(/An email is required/i);
      await expect(page.getByRole('heading', { name: FORM_TITLE })).toBeVisible();
      console.log('✅ Validation error shown for empty email');
    });
  });

  test('Verify Continue is blocked when email format is invalid', async ({ page }) => {
    const field = emailField(page);

    await test.step('Enter invalid email and click Continue', async () => {
      await field.fill('not-an-email');
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      console.log('✅ Entered invalid email and clicked Continue');
    });

    await test.step('Verify native email validation and remain on page', async () => {
      await expect(page).toHaveURL(/\/careersmarketplace\/ResetPassword/i);
      await expect(page.getByRole('heading', { name: FORM_TITLE })).toBeVisible();
      await expect.poll(async () => field.evaluate((el: HTMLInputElement) => el.checkValidity())).toBe(false);
      await expect.poll(async () => field.evaluate((el: HTMLInputElement) => el.validationMessage)).toMatch(/@|email/i);
      console.log('✅ Invalid email format is blocked');
    });
  });

  test('Verify Continue with a valid email shows confirmation', async ({ page }) => {
    await test.step('Submit a valid email address', async () => {
      await emailField(page).fill('reset-does-not-exist@example.com');
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      console.log('✅ Submitted valid email address');
    });

    await test.step('Verify Check your email confirmation', async () => {
      await expect(page).toHaveURL(/\/careersmarketplace\/ResetPassword/i);
      const confirmationTitle = page.locator('h3.article__header__text__title');
      await expect(confirmationTitle).toHaveText(CONFIRMATION_TITLE, { timeout: 15000 });
      await expectDisplayedCopy(
        page.locator('article.article--password p.paragraph').first(),
        CONFIRMATION_DESCRIPTION
      );
      console.log(`✅ Confirmation title is "${CONFIRMATION_TITLE}"`);
    });
  });

  test('Verify Cancel navigates back to My Profile', async ({ page }) => {
    await test.step('Click Cancel', async () => {
      await page.locator('main').getByRole('link', { name: 'Cancel', exact: true }).click();
      console.log('✅ Clicked Cancel');
    });

    await test.step('Verify navigation back to My Profile', async () => {
      await page.waitForURL(PROFILE_URL_PATTERN, { timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(PROFILE_URL_PATTERN);
      console.log(`✅ Navigated back to My Profile: ${page.url()}`);
    });
  });

  test('Verify Cancel navigates back to My Profile after entering email', async ({ page }) => {
    await test.step('Enter email without submitting', async () => {
      await emailField(page).fill('candidate@example.com');
      await expect(emailField(page)).toHaveValue('candidate@example.com');
      console.log('✅ Entered email without submitting');
    });

    await test.step('Click Cancel', async () => {
      await page.locator('main').getByRole('link', { name: 'Cancel', exact: true }).click();
      console.log('✅ Clicked Cancel');
    });

    await test.step('Verify navigation back to My Profile', async () => {
      await page.waitForURL(PROFILE_URL_PATTERN, { timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(PROFILE_URL_PATTERN);
      console.log(`✅ Navigated back to My Profile: ${page.url()}`);
    });
  });

});
