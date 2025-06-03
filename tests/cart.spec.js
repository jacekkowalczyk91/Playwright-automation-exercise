import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { CartPage } from '../pages/cart.page';
import { ProductsPage } from '../pages/products.page';
import { RegisterPage } from '../pages/register.page';
import { registerData } from '../test-data/register-data';
import { cartData } from '../test-data/cart-data';

test.describe('Homepage tests', () => {
  /** @type {import('../pages/home.page').HomePage} */
  /** @type {import('../pages/cart.page').CartPage} */
  let homePage, loginPage, cartPage, productsPage, registerPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    [homePage, loginPage, cartPage, productsPage, registerPage] = [
      new HomePage(page),
      new LoginPage(page),
      new CartPage(page),
      new ProductsPage(page),
      new RegisterPage(page),
    ];

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
    await homePage.subscriptionSubmitButton.click();

    await expect(homePage.subscriptionSubmitButton).toBeVisible();
  });
  test('Add products to cart', async ({ page }) => {
    const productIds = [1, 2, 3];
    const totalProducts = productIds.length;

    await cartPage.mainMenu.productsButton.click();

    await cartPage.addingProductsToCart(page, cartPage, productIds);
    await cartPage.cartProductsInfoBox.waitFor();
    const cartItems = await cartPage.productInfo.allTextContents();
    const itemsInCart = cartItems.length;

    console.log(`Produkty w koszyku: ${itemsInCart}`);
    expect(itemsInCart).toBe(totalProducts);
  });
  test('Verify products quantity in cart', async ({ page }) => {
    const quantityNumber = '7';

    await productsPage.productDetailView.first().click();

    await expect(cartPage.productsDetailViewInCart).toBeVisible();

    await cartPage.quantityInProductDetail.fill(quantityNumber);
    await cartPage.addToCartInProductDetailButton.click();
    await cartPage.cartViewInProductDetail.click();

    await expect(cartPage.cartProductsInfoBox).toBeVisible();

    const quantityInCart = await cartPage.quantityInCart.innerText();
    console.log(quantityInCart);
    expect(quantityInCart).toBe(quantityNumber);
  });
  test('Register while checkout', async ({ page }) => {
    const productIds = [1, 5];
    const newUserName = 'newuser';
    const newUserEmail = '35newsuer@gmail.com';
    const deliveryCommentText = 'no comment';
    const getProductsLocator = (id) =>
      page.locator(
        `.features_items .productinfo.text-center a[data-product-id="${id}"]`
      );

    for (let i = 0; i < productIds.length; i++) {
      const id = productIds[i];

      await getProductsLocator(id).click();
      await page.waitForTimeout(1000);
      if (i === productIds.length - 1) {
        await cartPage.cartViewInProductDetail.click();
      } else {
        await cartPage.continueShoppingButton.click();
        await page.waitForTimeout(1000);
      }
    }

    await expect(cartPage.cartProductsInfoBox).toBeVisible();

    await cartPage.cartCheckOutButton.click();
    await cartPage.registerLoginButtonAfterCheckout.click();

    await loginPage.signUpName.fill(newUserName);
    await loginPage.signUpEmail.fill(newUserEmail);
    await loginPage.signUpButton.click();
    await expect(registerPage.accountInformationPageText).toBeVisible();

    await registerPage.fillRegistrationForm(registerPage, registerData);

    await expect(registerPage.accountCreatedText).toBeVisible();
    await registerPage.accountContinueButton.click();

    await expect(loginPage.userNameInMenu).toBeVisible();

    await cartPage.mainMenu.cartButton.click();
    await cartPage.cartCheckOutButton.click();

    await expect(cartPage.deliveryAddressBoxTitle).toBeVisible();

    const nameText = await cartPage.deliveryTitleFirstAndLastName.textContent();

    expect(nameText.trim().startsWith(registerData.userTitle)).toBe(true);

    await expect(cartPage.deliveryTitleFirstAndLastName).toContainText(
      `${registerData.userFirstName} ${registerData.userLastName}`
    );

    const companyAndAdressesLocator = cartPage.deliveryCompanyAndAddress;
    const companyAndAdresses = [
      registerData.userCompany,
      registerData.userAddress,
      registerData.userAdditionalAddress,
    ];
    for (let i = 0; i < companyAndAdresses; i++) {
      await expect(companyAndAdressesLocator.nth(i)).toHaveText(
        companyAndAdresses[i]
      );
    }
    await expect(cartPage.deliveryCityStatePostcode).toHaveText(
      `${registerData.userCity} ${registerData.userState} ${registerData.userZipCode}`
    );
    await expect(cartPage.deliveryCountryName).toHaveText(
      registerData.userCountry
    );
    await expect(cartPage.deliveryPhoneNumber).toHaveText(
      registerData.userMobileNumber
    );
    await cartPage.reviewingProductsInCheckout(cartPage, productIds);

    await cartPage.deliveryComment.fill(deliveryCommentText);
    await cartPage.cartCheckOutButton.click();

    await cartPage.fillingCreditCardData(cartPage, registerData, cartData);

    await expect(cartPage.verifyOrderPlacedText).toBeVisible();

    await registerPage.deleteAccountButton.click();
    await expect(registerPage.deleteAccountText).toBeVisible();
  });
  test('Remove products from cart', async ({ page }) => {
    const productIds = [1, 2, 3];

    await cartPage.addingProductsToCart(page, cartPage, productIds);

    await cartPage.mainMenu.cartButton.click();
    await expect(cartPage.cartProductsInfoBox).toBeVisible();

    const cartItemsLocator = page.locator('[id^="product-"]');
    const cartItems = await cartItemsLocator.count();
    expect(cartItems).toBeGreaterThan(0);

    const randomIndex = Math.floor(Math.random() * cartItems);
    const randomItem = cartItemsLocator.nth(randomIndex);

    await randomItem.locator('.cart_delete a').click();
    await expect(cartItemsLocator).toHaveCount(cartItems - 1);

    const cartAfterDelete = await cartItemsLocator.count();
    expect(cartAfterDelete).toBe(cartItems - 1);
  });
});
