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
  test('View & Cart Brand Products', async ({ page }) => {
    const firstBrand = 'Polo';
    const secondBrand = 'Madame';

    await productsPage.mainMenu.productsButton.click();
    await expect(page.locator('.brands_products')).toBeVisible();

    await page.locator(`a[href="/brand_products/${firstBrand}"]`).click();
    await expect(page.locator('.features_items .title.text-center')).toHaveText(
      `Brand - ${firstBrand} Products`
    );
    await expect(page.locator('.product-image-wrapper').first()).toBeVisible();

    await page.locator(`a[href="/brand_products/${secondBrand}"]`).click();
    await expect(page.locator('.features_items .title.text-center')).toHaveText(
      `Brand - ${secondBrand} Products`
    );
    await expect(page.locator('.product-image-wrapper').first()).toBeVisible();
  });
  test('Add review on product', async ({ page }) => {
    await productsPage.mainMenu.productsButton.click();
    await expect(productsPage.productListView).toBeVisible();

    await productsPage.productDetailView.first().click();
    await expect(page.locator('.category-tab.shop-details-tab')).toBeVisible();

    await page.locator('#name').fill('imie');
    await page.locator('#email').fill('meil@meil.com');
    await page.locator('#review').fill('opinia');
    await page.locator('#button-review').click();

    await expect(
      page.getByText('Thank you for your review.', { exact: true })
    ).toBeVisible();
  });
});
