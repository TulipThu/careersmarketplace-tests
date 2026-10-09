import { test, expect } from '@playwright/test';
import {
  PAGE_HEADING,
  FORM_TITLE,
  DESCRIPTIONS,
  PRIVACY_POLICY_URL,
  HOME_URL_PATTERN,
  HOME_HEADING,
  PROFILE_URL_PATTERN,
  goToProfileDelete,
  deleteArticle,
  deleteButton,
  cancelButton,
  blockAccountDeletion,
  expectDisplayedCopy,
} from '../helpers/profile-delete';

test.describe('UNOPS Careers - Delete User Account Page', () => {

  test.beforeEach(async ({ page }) => {
    await goToProfileDelete(page);
  });

  test('Verify title, descriptions, and action buttons', async ({ page }) => {
    await test.step('Verify page URL and title text', async () => {
      await expect(page).toHaveURL(/\/careersmarketplace\/ProfileDelete/i);
      await expect(page.locator('h2.banner__text__title')).toHaveText(PAGE_HEADING);
      await expectDisplayedCopy(deleteArticle(page).locator('h3'), FORM_TITLE);
      console.log(`✅ Title text is "${PAGE_HEADING}" / "${FORM_TITLE}"`);
    });

    await test.step('Verify description text', async () => {
      const descriptionParagraphs = deleteArticle(page).locator('p');
      await expect(descriptionParagraphs.first()).toBeVisible();
      await expect(descriptionParagraphs).toHaveCount(DESCRIPTIONS.length);

      for (let i = 0; i < DESCRIPTIONS.length; i++) {
        await expectDisplayedCopy(descriptionParagraphs.nth(i), DESCRIPTIONS[i]);
        console.log(`✅ Description text is "${DESCRIPTIONS[i]}"`);
      }

      const privacyLink = deleteArticle(page).getByRole('link', { name: /Privacy Policy/i });
      await expect(privacyLink).toHaveAttribute('href', PRIVACY_POLICY_URL);
      console.log(`✅ Privacy Policy link points to ${PRIVACY_POLICY_URL}`);
    });

    await test.step('Verify Delete and Cancel buttons', async () => {
      const deleteBtn = deleteButton(page);
      await expect(deleteBtn).toBeVisible();
      await expect(deleteBtn).toBeEnabled();

      const cancel = cancelButton(page);
      await expect(cancel).toBeVisible();
      await expect(cancel).toBeEnabled();
      console.log('✅ Delete and Cancel buttons are visible and enabled');
    });
  });

  test('Verify Cancel navigates back to My Profile', async ({ page }) => {
    await test.step('Click Cancel', async () => {
      await cancelButton(page).click();
      console.log('✅ Clicked Cancel');
    });

    await test.step('Verify navigation back to My Profile', async () => {
      await page.waitForURL(PROFILE_URL_PATTERN, { timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(PROFILE_URL_PATTERN);
      console.log(`✅ Navigated back to My Profile: ${page.url()}`);
    });
  });

  test('Verify Delete navigates to home screen (account is not deleted)', async ({ page }) => {
    const homeUrl = new URL('/careersmarketplace', page.url()).toString();
    const blockedRequests = await blockAccountDeletion(page, homeUrl);

    page.on('dialog', async (dialog) => {
      console.log(`ℹ️  Browser dialog accepted (delete request is blocked): ${dialog.message()}`);
      await dialog.accept();
    });

    await test.step('Click Delete button (request is intercepted)', async () => {
      await deleteButton(page).click();
      await expect.poll(() => blockedRequests.length, { timeout: 15000 }).toBeGreaterThan(0);
      const attempted = blockedRequests[0];
      expect(attempted.url()).toMatch(/\/careersmarketplace\/ProfileDelete/i);
      console.log(`✅ Delete submitted ${attempted.method()} ${attempted.url()} — blocked before reaching the server`);
    });

    await test.step('Verify navigation to home screen', async () => {
      await page.waitForURL(HOME_URL_PATTERN, { timeout: 30000 });
      await expect(page.getByRole('heading', { name: HOME_HEADING })).toBeVisible({ timeout: 15000 });
      await expect(page).not.toHaveURL(/\/careersmarketplace\/ProfileDelete/i);
      console.log(`✅ Navigated to home screen: ${page.url()}`);
    });
  });

});
