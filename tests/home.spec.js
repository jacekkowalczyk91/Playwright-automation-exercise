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
    await expect(homePage.mainMenu.homePageButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
  });
  test('Contact Us form', async ({ page }) => {
    const contactUsName = 'Jill';
    const contactUsEmail = 'test@test.pl';
    const contactUsSubject = 'testing';
    const contactUsMessage = 'test';

    await homePage.mainMenu.contactUsButton.waitFor({
      state: 'visible',
      timeout: 3000,
    });
    await homePage.mainMenu.contactUsButton.click();
    await expect(page.locator('.contact-form > h2')).toBeVisible();

    await homePage.contactUsName.fill(contactUsName);
    await homePage.contactUsEmail.fill(contactUsEmail);
    await homePage.contactUsSubject.fill(contactUsSubject);
    await homePage.contactUsMessage.fill(contactUsMessage);

    await homePage.contactUsFormUpload.setInputFiles(
      'C:/nsispromotion_log.txt'
    );

    page.once('dialog', async (dialog) => {
      console.log('Alert:', dialog.message());
      await dialog.accept();
    });

    await homePage.contactUsFormSubmitButton.scrollIntoViewIfNeeded();
    await homePage.contactUsFormSubmitButton.click();

    await expect(page.locator('.status.alert-success')).toBeVisible({
      timeout: 2000,
    });

    await page.locator('.btn.btn-success').click();
    await expect(homePage.mainMenu.homePageButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
  });
  test('Verify test cases page', async ({ page }) => {
    await homePage.mainMenu.testCasesButton.waitFor({
      state: 'visible',
      timeout: 3000,
    });
    await homePage.mainMenu.testCasesButton.click();
    await expect(homePage.mainMenu.testCasesButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
  });
  test('Verify all products and product detail page', async ({ page }) => {
    await homePage.mainMenu.productsButton.waitFor({
      state: 'visible',
      timeout: 3000,
    });
    await homePage.mainMenu.productsButton.click();
    await expect(homePage.mainMenu.productsButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
    await expect(page.locator('.features_items')).toBeVisible();

    await page
      .locator('ul.nav.nav-pills.nav-justified > li > a')
      .first()
      .click();

    await expect(page.locator('div.product-information > h2')).toBeVisible();
    await expect(page.getByText('Category:')).toBeVisible();
    await expect(
      page.locator('div.product-information > span').first()
    ).toHaveText(/Rs\. \d+/);

    await expect(
      page.getByText(/^Availability:\s*\S+/, { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText(/^Condition:\s*\S+/, { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText(/^Brand:\s*\S+/, { exact: false })
    ).toBeVisible();
  });
});
