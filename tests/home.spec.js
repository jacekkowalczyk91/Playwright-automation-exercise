import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';

test.describe('Homepage tests', () => {
  /** @type {import('../pages/home.page').HomePage} */
  /** @type {import('../pages/products.page').ProductsPage} */
  let homePage;
  let loginPage;
  let productsPage;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

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
    await homePage.subscriptionSubmitButton.click();

    await expect(homePage.subscriptionSubmitButton).toBeVisible();
  });
  test('View Category Products', async ({ page }) => {
    await expect(page.locator('.panel-group.category-products')).toBeVisible();

    await homePage.categoryWomenButton.click();
    await homePage.categorWomenyDressButton.click();

    await expect(homePage.categoryWomenDressTitle).toBeVisible();

    await homePage.categoryMenButton.click();
    await homePage.categoryMenJeansButton.click();

    await expect(homePage.categoryMenJeansTitle).toBeVisible();
  });
});
