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
  test('Verify subscription in homepage', async ({ page }) => {
    const subscriptionEmail = 'test@test.pl';

    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(homePage.subscriptionText).toHaveText('Subscription');

    await homePage.subscriptionInput.fill(subscriptionEmail);
    await page.locator('#subscribe').click();

    await expect(homePage.subscriptionSubmitButton).toBeVisible();
  });
  test('Verify subscription in cart page', async ({ page }) => {
    const subscriptionEmail = 'test@test.pl';

    await homePage.mainMenu.cartButton.click();

    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(homePage.subscriptionText).toHaveText('Subscription');

    await homePage.subscriptionInput.fill(subscriptionEmail);
    await page.locator('#subscribe').click();

    await expect(homePage.subscriptionSubmitButton).toBeVisible();
  });
});
