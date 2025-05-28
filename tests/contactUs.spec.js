import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ContactUsPage } from '../pages/contactus.page';

test.describe('Contact Us tests', () => {
  /** @type {import('../pages/contactus.page').ContactUsPage} */
  let contactUsPage;
  let loginPage;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    loginPage = new LoginPage(page);
    contactUsPage = new ContactUsPage(page);

    await loginPage.cookiesBanner.waitFor({ state: 'visible', timeout: 2000 });
    await loginPage.cookiesBanner.click();
    await expect(contactUsPage.mainMenu.homePageButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
  });
  test('Contact Us form', async ({ page }) => {
    const contactUsName = 'Jill';
    const contactUsEmail = 'test@test.pl';
    const contactUsSubject = 'testing';
    const contactUsMessage = 'test';

    await contactUsPage.mainMenu.contactUsButton.waitFor({
      state: 'visible',
      timeout: 3000,
    });
    await contactUsPage.mainMenu.contactUsButton.click();
    await expect(page.locator('.contact-form > h2')).toBeVisible();

    await contactUsPage.contactUsName.fill(contactUsName);
    await contactUsPage.contactUsEmail.fill(contactUsEmail);
    await contactUsPage.contactUsSubject.fill(contactUsSubject);
    await contactUsPage.contactUsMessage.fill(contactUsMessage);

    await contactUsPage.contactUsFormUpload.setInputFiles(
      'C:/nsispromotion_log.txt'
    );

    page.once('dialog', async (dialog) => {
      console.log('Alert:', dialog.message());
      await dialog.accept();
    });

    await contactUsPage.contactUsFormSubmitButton.scrollIntoViewIfNeeded();
    await contactUsPage.contactUsFormSubmitButton.click();

    await expect(page.locator('.status.alert-success')).toBeVisible({
      timeout: 2000,
    });

    await page.locator('.btn.btn-success').click();
    await expect(contactUsPage.mainMenu.homePageButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
  });
});
