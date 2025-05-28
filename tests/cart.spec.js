import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { CartPage } from '../pages/cart.page';

test.describe('Homepage tests', () => {
  /** @type {import('../pages/home.page').HomePage} */
  /** @type {import('../pages/cart.page').CartPage} */
  let homePage;
  let loginPage;
  let cartPage;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    cartPage = new CartPage(page);

    await loginPage.cookiesBanner.waitFor({ state: 'visible', timeout: 2000 });
    await loginPage.cookiesBanner.click();
    await expect(cartPage.mainMenu.homePageButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
  });

  test('Verify subscription in cart page', async ({ page }) => {
    const subscriptionEmail = 'test@test.pl';

    await cartPage.mainMenu.cartButton.click();

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

    await cartPage.mainMenu.productsButton.click();

    for (let i = 0; i < productIds.length; i++) {
      const id = productIds[i];

      await page
        .locator(`.productinfo.text-center a[data-product-id="${id}"]`)
        .click();
      await page.waitForTimeout(1000);
      if (i === productIds.length - 1) {
        await cartPage.cartViewInProductDetail.click();
      } else {
        await cartPage.continueShoppingButton.click();
        await page.waitForTimeout(1000);
      }
    }
    await page.waitForSelector(cartPage.cartProductsInfoBox);
    const cartItems = await page.$$(cartPage.productInfo);
    const itemsInCart = cartItems.length;

    console.log(`Produkty w koszyku: ${itemsInCart}`);
    expect(itemsInCart).toBe(totalProducts);
  });
});
