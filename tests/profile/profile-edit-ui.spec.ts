import { test, expect } from '@playwright/test';
import {
  PAGE_TITLE,
  SECTION_TITLES,
  PERSONAL_INFO_LABELS,
  SECTION_DESCRIPTIONS,
  UNDERREPRESENTED_GROUP,
  ATTACHMENTS_SECTION,
  RACIAL_IDENTITY_RADIO_LABELS,
  ACTION_BUTTONS,
  goToProfileEdit,
} from '../helpers/profile-edit';

test.describe('UNOPS Careers - Edit Personal Information Page (UI)', () => {

  test.beforeEach(async ({ page }) => {
    await goToProfileEdit(page);
  });

  test('Verify page title, section titles, and URL', async ({ page }) => {
    await test.step('Verify Edit Personal Information page loaded', async () => {
      await expect(page).toHaveURL(/\/careersmarketplace\/ProfileEdit/i);
      await expect(page.getByRole('heading', { name: PAGE_TITLE })).toBeVisible();
      console.log(`✅ Edit page loaded: ${page.url()}`);
    });

    await test.step('Verify all section titles are visible', async () => {
      for (const title of SECTION_TITLES) {
        await expect(page.locator('main').getByText(title, { exact: true }).first()).toBeVisible();
        console.log(`✅ Section title visible: "${title}"`);
      }
    });
  });

  test('Verify personal information labels and text fields', async ({ page }) => {
    for (const label of PERSONAL_INFO_LABELS) {
      await test.step(`Verify label and field for "${label}"`, async () => {
        const fieldLabel = page.locator('label').filter({ hasText: label }).first();
        await expect(fieldLabel).toBeVisible();

        const fieldId = await fieldLabel.getAttribute('for');
        if (fieldId) {
          const field = page.locator(`[id="${fieldId}"]`);
          await expect(field).toBeVisible();
          await expect(field).toBeEnabled();
        } else {
          const field = page.getByLabel(label.replace(' *', ''), { exact: false });
          await expect(field.first()).toBeVisible();
        }

        console.log(`✅ Label and field verified: "${label}"`);
      });
    }
  });

  test('Verify section descriptions are visible', async ({ page }) => {
    for (const description of SECTION_DESCRIPTIONS) {
      await test.step(`Verify description: "${description.slice(0, 40)}..."`, async () => {
        await expect(page.locator('main').getByText(description, { exact: true })).toBeVisible();
        console.log(`✅ Description visible: "${description}"`);
      });
    }
  });

  test('Verify racial identity radio button labels are visible', async ({ page }) => {
    await test.step('Scroll to Self Identification section', async () => {
      await page.getByText('What racial identity do you most closely identify with?', { exact: true }).scrollIntoViewIfNeeded();
    });

    for (const radioLabel of RACIAL_IDENTITY_RADIO_LABELS) {
      await test.step(`Verify radio option: "${radioLabel.slice(0, 40)}..."`, async () => {
        const radio = page.getByRole('radio', { name: radioLabel });
        await expect(radio).toBeVisible();
        console.log(`✅ Radio option visible: "${radioLabel.slice(0, 50)}..."`);
      });
    }
  });

  test('Verify underrepresented group title and description', async ({ page }) => {
    const underrepresentedField = page.getByRole('combobox', {
      name: UNDERREPRESENTED_GROUP.title,
    });

    await test.step('Scroll to underrepresented group question', async () => {
      await page.getByText('Self Identification', { exact: true }).scrollIntoViewIfNeeded();
      await underrepresentedField.scrollIntoViewIfNeeded();
    });

    await test.step('Verify underrepresented group title is visible', async () => {
      await expect(underrepresentedField).toBeVisible();
      console.log(`✅ Title visible: "${UNDERREPRESENTED_GROUP.title}"`);
    });

    await test.step('Verify underrepresented group description is visible', async () => {
      await expect(page.locator('main').getByText(UNDERREPRESENTED_GROUP.description, { exact: true })).toBeVisible();
      console.log(`✅ Description visible: "${UNDERREPRESENTED_GROUP.description}"`);
    });
  });

  test('Verify Attachments section title and description', async ({ page }) => {
    await test.step('Scroll to Attachments section', async () => {
      await page.getByText(ATTACHMENTS_SECTION.title, { exact: true }).scrollIntoViewIfNeeded();
    });

    await test.step('Verify Attachments title is visible', async () => {
      await expect(page.locator('main').getByText(ATTACHMENTS_SECTION.title, { exact: true }).first()).toBeVisible();
      console.log(`✅ Title visible: "${ATTACHMENTS_SECTION.title}"`);
    });

    await test.step('Verify Attachments description is visible', async () => {
      await expect(page.locator('main').getByText(ATTACHMENTS_SECTION.description, { exact: true })).toBeVisible();
      console.log(`✅ Description visible: "${ATTACHMENTS_SECTION.description}"`);
    });
  });

  test('Verify action buttons are visible and enabled', async ({ page }) => {
    for (const buttonName of ACTION_BUTTONS) {
      await test.step(`Verify "${buttonName}" button`, async () => {
        const button = page.getByRole('button', { name: buttonName, exact: true });
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
        console.log(`✅ Action button visible and enabled: "${buttonName}"`);
      });
    }
  });

});
