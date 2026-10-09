import { test, expect } from '@playwright/test';
import {
  PAGE_TITLE,
  PROFILE_URL_PATTERN,
  getFieldByLabel,
  clickSave,
  goToProfileEdit,
} from '../helpers/profile-edit';

test.describe('UNOPS Careers - Edit Personal Information Page (Actions)', () => {

  test.beforeEach(async ({ page }) => {
    await goToProfileEdit(page);
  });

  test('Verify Save persists Private Telephone change', async ({ page }) => {
    const phoneField = await getFieldByLabel(page, 'Private Telephone');
    const originalPhone = await phoneField.inputValue();
    const testPhone = '+959123456789';

    await test.step('Update Private Telephone and save', async () => {
      await phoneField.fill(testPhone);
      await clickSave(page);
      await expect(page).toHaveURL(/\/careersmarketplace\/ProfileEdit/i);
      await expect(phoneField).toHaveValue(testPhone);
      console.log(`✅ Private Telephone saved: "${testPhone}"`);
    });

    await test.step('Verify value persists after reload', async () => {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: PAGE_TITLE })).toBeVisible({ timeout: 15000 });
      await expect(phoneField).toHaveValue(testPhone);
      console.log('✅ Private Telephone persisted after reload');
    });

    await test.step('Restore original Private Telephone', async () => {
      await phoneField.fill(originalPhone);
      await clickSave(page);
      await expect(phoneField).toHaveValue(originalPhone);
      console.log(`✅ Private Telephone restored: "${originalPhone || '(empty)'}"`);
    });
  });

  test('Verify Save shows validation when First Name is cleared', async ({ page }) => {
    const firstNameField = await getFieldByLabel(page, 'First Name *');
    const originalFirstName = await firstNameField.inputValue();

    await test.step('Clear First Name and click Save', async () => {
      await firstNameField.fill('');
      await clickSave(page);
      console.log('✅ Cleared First Name and clicked Save');
    });

    await test.step('Verify validation error and remain on edit page', async () => {
      await expect(page).toHaveURL(/\/careersmarketplace\/ProfileEdit/i);
      await expect(page.getByRole('alert')).toContainText(/First Name.*required/i);
      await expect(page.getByRole('heading', { name: PAGE_TITLE })).toBeVisible();
      console.log('✅ Validation error shown for required First Name');
    });

    await test.step('Restore First Name', async () => {
      await firstNameField.fill(originalFirstName);
      await expect(firstNameField).toHaveValue(originalFirstName);
      console.log(`✅ First Name restored: "${originalFirstName}"`);
    });
  });

  test('Verify Save shows validation when Private Email format is invalid', async ({ page }) => {
    const emailField = await getFieldByLabel(page, 'Private Email *');
    const originalEmail = await emailField.inputValue();

    await test.step('Enter invalid Private Email and click Save', async () => {
      await emailField.fill('not-an-email');
      await clickSave(page);
      console.log('✅ Entered invalid Private Email and clicked Save');
    });

    await test.step('Verify validation error and remain on edit page', async () => {
      await expect(page).toHaveURL(/\/careersmarketplace\/ProfileEdit/i);
      await expect(page.getByRole('alert')).toContainText(/Private Email.*not valid/i);
      await expect(page.getByRole('heading', { name: PAGE_TITLE })).toBeVisible();
      console.log('✅ Validation error shown for invalid Private Email');
    });

    await test.step('Restore Private Email', async () => {
      await emailField.fill(originalEmail);
      await expect(emailField).toHaveValue(originalEmail);
      console.log(`✅ Private Email restored: "${originalEmail}"`);
    });
  });

  test('Verify personal information dropdown selections', async ({ page }) => {
    await test.step('Select Gender', async () => {
      const genderField = await getFieldByLabel(page, 'Gender *');
      await genderField.selectOption({ label: 'Female' });
      await expect(genderField.locator('option:checked')).toHaveText('Female');
      console.log('✅ Gender set to "Female"');
    });

    await test.step('Select Currently working for UNOPS', async () => {
      const unopsField = await getFieldByLabel(page, 'Currently working for UNOPS *');
      await unopsField.selectOption({ label: 'No' });
      await expect(unopsField.locator('option:checked')).toHaveText('No');
      console.log('✅ "Currently working for UNOPS" set to "No"');
    });

    await test.step('Verify Country of Nationality selection', async () => {
      const countryField = await getFieldByLabel(page, 'Country of Nationality *');
      const selectedCountries = countryField.locator('option:checked');
      await expect(selectedCountries.first()).toBeAttached();
      const countries = (await selectedCountries.allInnerTexts()).map((c) => c.trim()).filter(Boolean);
      expect(countries.length).toBeGreaterThan(0);
      console.log(`✅ Country of Nationality has a selection: ${countries.join(', ')}`);
    });
  });

  test('Verify Cancel discards unsaved Private Telephone change', async ({ page }) => {
    const phoneField = await getFieldByLabel(page, 'Private Telephone');
    const originalPhone = await phoneField.inputValue();
    const unsavedPhone = '+959999999999';

    await test.step('Change Private Telephone without saving', async () => {
      await phoneField.fill(unsavedPhone);
      await expect(phoneField).toHaveValue(unsavedPhone);
      console.log(`✅ Updated Private Telephone (unsaved): "${unsavedPhone}"`);
    });

    await test.step('Click Cancel and return to My Profile', async () => {
      await page.getByRole('button', { name: 'Cancel', exact: true }).click();
      await page.waitForURL(PROFILE_URL_PATTERN, { timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible({ timeout: 15000 });
      console.log('✅ Cancelled edit and returned to My Profile');
    });

    await test.step('Verify unsaved change was not persisted', async () => {
      await page.getByRole('link', { name: 'Edit Personal Information' }).click();
      await page.waitForURL('**/ProfileEdit**', { timeout: 30000 });
      await expect(page.getByRole('heading', { name: PAGE_TITLE })).toBeVisible({ timeout: 15000 });

      const phoneAfterReopen = await getFieldByLabel(page, 'Private Telephone');
      await expect(phoneAfterReopen).toHaveValue(originalPhone);
      console.log(`✅ Private Telephone unchanged after cancel: "${originalPhone || '(empty)'}"`);
    });
  });

  test('Verify Cancel navigates back to My Profile', async ({ page }) => {
    await test.step('Click Cancel button', async () => {
      const cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
      await expect(cancelButton).toBeVisible();
      await expect(cancelButton).toBeEnabled();
      await cancelButton.click();
      console.log('✅ Clicked Cancel button');
    });

    await test.step('Verify navigation back to My Profile', async () => {
      await page.waitForURL(PROFILE_URL_PATTERN, { timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(PROFILE_URL_PATTERN);
      console.log(`✅ Navigated back to My Profile: ${page.url()}`);
    });
  });

});
