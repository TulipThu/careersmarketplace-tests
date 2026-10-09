import { test, expect } from '@playwright/test';
import { loginToProfile } from '../helpers/auth';

const PROFILE_ACTION_LINKS = [
  { label: 'Edit Personal Information', href: '/careersmarketplace/ProfileEdit' },
  { label: 'Reset Password', href: '/careersmarketplace/ResetPassword' },
  { label: 'Delete User Account', href: '/careersmarketplace/ProfileDelete' },
];

test.describe('UNOPS Careers - Profile Page Actions', () => {

  test.beforeEach(async ({ page }) => {
    await loginToProfile(page);
  });

  test('Verify profile action links are visible and have correct URLs', async ({ page }) => {
    await test.step('Ensure Personal information tab is selected', async () => {
      const personalTab = page.getByRole('tab', { name: 'Personal information' });
      await personalTab.click();
      await expect(personalTab).toHaveAttribute('aria-selected', 'true');
      console.log('✅ Personal information tab is selected');
    });

    for (const { label, href } of PROFILE_ACTION_LINKS) {
      await test.step(`Verify "${label}" link`, async () => {
        const link = page.getByRole('link', { name: label });
        await expect(link).toBeVisible();
        await expect(link).toBeEnabled();
        await expect(link).toHaveAttribute('href', new RegExp(href.replace(/\//g, '\\/'), 'i'));
        console.log(`✅ "${label}" link is visible with correct href`);
      });
    }
  });

});
