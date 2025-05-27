import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';

test.describe('User registration test', () => {
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
  test('Add products to cart', async ({ page }) => {
    const productIds = [1, 2, 3];
    const totalProducts = productIds.length;

    await homePage.mainMenu.productsButton.click();

    for (let i = 0; i < productIds.length; i++) {
      const id = productIds[i];

      await page
        .locator(`.productinfo.text-center a[data-product-id="${id}"]`)
        .click();
      await page.waitForTimeout(1000);
      if (i === productIds.length - 1) {
        await page.getByRole('link', { name: 'View Cart' }).click();
      } else {
        await page.locator('.btn.btn-success.close-modal.btn-block').click();
        await page.waitForTimeout(1000);
      }
    }
    await page.waitForSelector('.cart_info');
    const cartItems = await page.$$('.cart_info tbody tr');
    const itemsInCart = cartItems.length;

    console.log(`Produkty w koszyku: ${itemsInCart}`);
    expect(itemsInCart).toBe(totalProducts);
  });
});
