import { test, expect } from '@playwright/test';
import { loginToProfile } from '../helpers/auth';

const PROFILE_TABS = [
  {
    label: 'Personal information',
    content: 'Personal Details',
  },
  {
    label: 'My Applications',
    content: 'Ongoing Applications',
  },
  {
    label: 'Job Alerts',
    content: 'Create Job Alert',
  },
];

test.describe('UNOPS Careers - Profile Page Tabs', () => {

  test.beforeEach(async ({ page }) => {
    await loginToProfile(page);
  });

  test('Verify all three profile tabs are visible with correct labels', async ({ page }) => {
    await test.step('Verify My Profile page is loaded', async () => {
      await expect(page).toHaveURL(/\/careersmarketplace\/Profile/i);
      console.log(`✅ Profile page loaded: ${page.url()}`);
    });

    await test.step('Verify all three tab labels are visible', async () => {
      const tablist = page.getByRole('tablist');
      await expect(tablist).toBeVisible();

      for (const { label } of PROFILE_TABS) {
        const tab = page.getByRole('tab', { name: label });
        await expect(tab).toBeVisible();
        await expect(tab).toHaveText(new RegExp(label.replace(/\s+/g, '\\s+'), 'i'));
        console.log(`✅ Tab "${label}" is visible`);
      }
    });
  });

  test('Verify profile tabs are clickable and show the correct content', async ({ page }) => {
    for (const { label, content } of PROFILE_TABS) {
      await test.step(`Click "${label}" tab and verify content`, async () => {
        const tab = page.getByRole('tab', { name: label });
        await expect(tab).toBeVisible();
        await tab.click();

        await expect(tab).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('main')).toContainText(content);
        console.log(`✅ "${label}" tab selected and shows "${content}"`);
      });
    }
  });

  test('Verify profile tabs are focusable and activatable with keyboard', async ({ page }) => {
    for (const { label, content } of PROFILE_TABS) {
      await test.step(`Focus and activate "${label}" tab with Enter key`, async () => {
        const tab = page.getByRole('tab', { name: label });
        await tab.focus();
        await expect(tab).toBeFocused();
        await page.keyboard.press('Enter');

        await expect(tab).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('main')).toContainText(content);
        console.log(`✅ "${label}" tab activated via keyboard`);
      });
    }
  });

});
