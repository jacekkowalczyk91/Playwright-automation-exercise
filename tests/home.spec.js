import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { loginData } from '../test-data/login-data';

test.describe('Homepage tests', () => {
  /** @type {import('../pages/home.page').HomePage} */
  /** @type {import('../pages/products.page').ProductsPage} */
  let homePage;
  let loginPage;
  let productsPage;
  let cartPage;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

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
  test('Search Products and Verify Cart After Login', async ({ page }) => {
    const searchText = 'top';
    const names = ['top', 'shirt'];

    await homePage.mainMenu.productsButton.click();
    await expect(homePage.mainMenu.productsButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );

    await page.locator('#search_product').fill(searchText);
    await page.locator('#submit_search').click();

    await expect(page.locator('.features_items .title.text-center')).toHaveText(
      'Searched Products'
    );

    const productName = page.locator('.productinfo > p');
    const productCount = await productName.count();
    expect(productCount).toBeGreaterThan(0);

    for (let i = 0; i < productCount; i++) {
      const productNames = await productName.nth(i).textContent();
      const lowerProductNames = productNames.toLowerCase();

      const match = names.some((name) => lowerProductNames.includes(name));
      expect(match).toBe(true);
    }
    const productCards = page.locator('.productinfo');
    const productsToAddCount = await productCards.count();
    const productIds = [];

    for (let i = 0; i < productsToAddCount; i++) {
      const addButton = productCards.nth(i).locator('a.add-to-cart');
      const id = await addButton.getAttribute('data-product-id');

      if (id) {
        productIds.push(id);
      }
    }
    await cartPage.addingProductsToCart(page, cartPage, productIds);
    await homePage.mainMenu.cartButton.click();
    await expect(cartPage.cartProductsInfoBox).toBeVisible();

    const cartItemsLocator = page.locator('[id^="product-"]');
    const cartItems = await cartItemsLocator.count();
    expect(cartItems).toBe(productIds.length);

    await homePage.mainMenu.signUpNavbarButton.click();

    await loginPage.loginInput.fill(loginData.userName);
    await loginPage.passwordInput.fill(loginData.userPassword);
    await loginPage.loginButton.click();

    await homePage.mainMenu.cartButton.click();
    await homePage.verifyingNumberOfProducts(page, productIds);
  });
  test('Add to cart from Recommended items', async ({ page }) => {
    await page.locator('#footer').scrollIntoViewIfNeeded();

    await expect(page.locator('.recommended_items')).toBeVisible();

    const firstVisibleProduct = page
      .locator('#recommended-item-carousel .product-image-wrapper')
      .filter({
        has: page.locator(':visible'),
      })
      .first();
    const productName = await firstVisibleProduct.locator('p').textContent();

    await expect(firstVisibleProduct).toBeVisible();
    await firstVisibleProduct.hover();

    const addToCart = firstVisibleProduct.locator('.add-to-cart');
    await expect(addToCart).toBeVisible();
    await addToCart.click();

    await cartPage.cartViewInProductDetail.click();

    const cartItems = page.locator('.cart_description h4 a');
    await expect(cartItems).toContainText(productName.trim());
  });
});
