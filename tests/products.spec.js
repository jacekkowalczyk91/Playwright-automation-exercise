import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';

test.describe('Products page tests', () => {
  /** @type {import('../pages/home.page').ProductsPage} */
  let productsPage;
  let loginPage;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    productsPage = new ProductsPage(page);
    loginPage = new LoginPage(page);

    await loginPage.cookiesBanner.waitFor({ state: 'visible', timeout: 2000 });
    await loginPage.cookiesBanner.click();
    await expect(productsPage.mainMenu.homePageButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
  });

  test('Verify all products and product detail page', async ({ page }) => {
    await productsPage.mainMenu.productsButton.waitFor({
      state: 'visible',
      timeout: 3000,
    });
    await productsPage.mainMenu.productsButton.click();
    await expect(productsPage.mainMenu.productsButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );
    await expect(productsPage.productListView).toBeVisible();

    await productsPage.productDetailView.first().click();

    await expect(productsPage.productTitle).toBeVisible();
    await expect(productsPage.productCategory).toBeVisible();
    await expect(productsPage.productPrice.first()).toHaveText(/Rs\. \d+/);

    await expect(productsPage.productAvailability).toBeVisible();
    await expect(productsPage.productCondition).toBeVisible();
    await expect(productsPage.productBrand).toBeVisible();
  });
  test('Verify search product', async ({ page }) => {
    const searchName = 'top';
    const expectedSearches = ['top', 'shirt'];
    const productsTitle = page.locator(
      'div.features_items.productinfo.text-center > p:visible'
    );
    const texts = await productsTitle.allTextContents();

    await productsPage.mainMenu.productsButton.waitFor({
      state: 'visible',
      timeout: 3000,
    });
    await productsPage.mainMenu.productsButton.click();
    await expect(productsPage.mainMenu.productsButton).toHaveCSS(
      'color',
      'rgb(255, 165, 0)'
    );

    await productsPage.searchInput.fill(searchName);
    await productsPage.searchSubmitButton.click();

    for (const text of texts) {
      const lowerText = text.toLowerCase();
      const hasMatch = expectedSearches.some((expected) =>
        lowerText.includes(expected.toLowerCase())
      );

      expect(hasMatch).toBe(true);
    }
  });
});
