import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';

test.describe('User registration test', () => {
  /** @type {import('../pages/home.page').HomePage} */
  let homePage;
  let loginPage;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);

    await loginPage.cookiesBanner.waitFor({ state: 'visible', timeout: 2000 });
    await loginPage.cookiesBanner.click();
    await expect(homePage.mainMenu.homePagetButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
  });
  test.only('Contact Us form', async ({ page }) => {
    const contactUsName = 'Jill';
    const contactUsEmail = 'test@test.pl';
    const contactUsSubject = 'testing';
    const contactUsMessage = 'test';

    await homePage.mainMenu.contactUsButton.click({ timeout: 2000 });
    await expect(page.locator('.contact-form > h2')).toBeVisible();

    await homePage.contactUsName.fill(contactUsName);
    await homePage.contactUsEmail.fill(contactUsEmail);
    await homePage.contactUsSubject.fill(contactUsSubject);
    await homePage.contactUsMessage.fill(contactUsMessage);

    await page
      .locator('#contact-us-form > div:nth-child(6) > input')
      .setInputFiles('C:/nsispromotion_log.txt');

    page.once('dialog', async (dialog) => {
      console.log('Alert:', dialog.message());
      await dialog.accept();
    });
    await page.locator('[data-qa="submit-button"]').click();

    await expect(page.locator('.status.alert-success')).toBeVisible();

    await page.locator('.btn.btn-success').click();
    await expect(homePage.mainMenu.homePagetButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
  });
});
