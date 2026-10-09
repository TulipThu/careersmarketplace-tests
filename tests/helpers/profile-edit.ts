import { expect, type Locator, type Page } from '@playwright/test';
import { loginToProfile } from './auth';

export const PAGE_TITLE = 'Edit Your Personal Information';

export const PROFILE_URL_PATTERN = /\/careersmarketplace\/Profile(?:\?|#|$)/i;

export const SECTION_TITLES = [
  'Personal Information',
  'Join our Talent Community',
  'Availability',
  'Education',
  'Work History',
  'Languages',
  'Skills',
  'Self Identification',
  'What racial identity do you most closely identify with?',
  'Attachments',
];

export const PERSONAL_INFO_LABELS = [
  'First Name *',
  'Last Name *',
  'Private Email *',
  'Alternative Private Email',
  'Private Telephone',
  'Date of Birth *',
  'Gender *',
  'Country of Nationality *',
  'Currently working for UNOPS *',
];

export const SECTION_DESCRIPTIONS = [
  'Add your education below *',
  'Add your work history below *',
  'Add your languages and level below',
  'Click here to see the list of skills',
  'If you can\'t find the certificate you need, select "Other" and enter the certification in the provided field.',
];

export const UNDERREPRESENTED_GROUP = {
  title: 'Do you identify as a member of a historically underrepresented or marginalized group?',
  description:
    'E.g. woman, young professional, racially/ethnically marginalized, person with a disability, LGBTQI+, etc. Your response is confidential, used only in aggregate, and will not affect your candidacy.',
};

export const ATTACHMENTS_SECTION = {
  title: 'Attachments',
  description:
    'Please upload one document per section. If you have multiple documents, please combine them into a single file before uploading. The accepted formats are PDF, DOC and DOCX. The maximum file size is 30 MB.',
};

export const RACIAL_IDENTITY_RADIO_LABELS = [
  'Black or African descent (origins in sub-Saharan Africa and the groups of the black African diaspora, e.g. Afro-Caribbean, Afro-Latino, Afro-European or African American)',
  'Asia (origins in Central Asia or the Caucasus, East Asia, South Asia, and Southeast Asia)',
  'White/Caucasian (origins in any of the original peoples of Europe)',
  'Hispanic, Latino/Latina/Latinx descent (origins in Latin America, e.g. Brazil, Colombia, Cuba, El Salvador, Mexico, Peru, Puerto Rico)',
  'North African/Middle Eastern (e.g. Algeria, Egypt, Iran (Islamic Republic of), Lebanon, Morocco, Syrian Arab Republic)',
  'Indigenous Peoples (peoples with social, cultural, economic, and political characteristics that are distinct from those of the dominant societies in which they live)',
  'Mixed origin/Multi-racial (identify with two or more origins)',
  'Not listed',
  'Prefer not to disclose',
];

export const ACTION_BUTTONS = ['Cancel', 'Save'];

export async function getFieldByLabel(page: Page, labelText: string): Promise<Locator> {
  const fieldLabel = page.locator('label').filter({ hasText: labelText }).first();
  await expect(fieldLabel).toBeVisible();
  const fieldId = await fieldLabel.getAttribute('for');
  expect(fieldId).toBeTruthy();
  return page.locator(`[id="${fieldId}"]`);
}

export async function clickSave(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Save', exact: true }).click();
}

export async function goToProfileEdit(page: Page): Promise<void> {
  await loginToProfile(page);
  await page.getByRole('link', { name: 'Edit Personal Information' }).click();
  await page.waitForURL('**/ProfileEdit**', { timeout: 30000 });
  await expect(page.getByRole('heading', { name: PAGE_TITLE })).toBeVisible({ timeout: 15000 });
}
