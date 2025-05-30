import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { CartPage } from '../pages/cart.page';
import { ProductsPage } from '../pages/products.page';
import { RegisterPage } from '../pages/register.page';
import { registerData } from '../test-data/register-data';
import { stringify } from 'querystring';

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
    const newUserEmail = '26newsuer@gmail.com';

    for (let i = 0; i < productIds.length; i++) {
      const id = productIds[i];

      await page
        .locator(
          `.features_items .productinfo.text-center a[data-product-id="${id}"]`
        )
        .click();
      await page.waitForTimeout(1000);
      if (i === productIds.length - 1) {
        await cartPage.cartViewInProductDetail.click();
      } else {
        await cartPage.continueShoppingButton.click();
        await page.waitForTimeout(1000);
      }
    }

    await expect(cartPage.cartProductsInfoBox).toBeVisible();

    await page.locator('.btn.check_out').click();
    await page.locator('#checkoutModal .modal-body a[href="/login"]').click();

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

    await expect(
      page.locator('#address_delivery .address_title > h3')
    ).toBeVisible();

    const nameText = await page
      .locator('#address_delivery .address_firstname.address_lastname')
      .textContent();

    expect(nameText.trim().startsWith(registerData.userTitle)).toBe(true);

    await expect(
      page.locator('#address_delivery .address_firstname.address_lastname')
    ).toContainText(
      `${registerData.userFirstName} ${registerData.userLastName}`
    );

    const companyAndAdressesLocator = page.locator(
      '#address_delivery .address_address1.address_address2'
    );
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
    await expect(
      page.locator(
        '#address_delivery .address_city.address_state_name.address_postcode'
      )
    ).toHaveText(
      `${registerData.userCity} ${registerData.userState} ${registerData.userZipCode}`
    );
    await expect(
      page.locator('#address_delivery .address_country_name')
    ).toHaveText(registerData.userCountry);
    await expect(page.locator('#address_delivery .address_phone')).toHaveText(
      registerData.userMobileNumber
    );

    const cartProductIds = await page
      .locator('[id^="product-"]')
      .evaluateAll((elements) =>
        elements.map((el) => el.id.replace('product-', ''))
      );

    for (const expectedId of productIds) {
      expect(cartProductIds).toContain(String(expectedId));
    }

    await page.locator('.form-control').fill('no comment');
    await page.locator('.check_out').click();
    await page
      .locator('[data-qa = "name-on-card"]')
      .fill(`${registerData.userFirstName} ${registerData.userLastName}`);
    await page.locator('[data-qa = "card-number"]').fill('111222333444555666');
    await page.locator('[data-qa = "cvc"]').fill('111');
    await page.locator('[data-qa = "expiry-month"]').fill('01/01');
    await page.locator('[data-qa = "expiry-year"]').fill('2000');
    await page.locator('[data-qa = "pay-button"]').click();

    await expect(page.locator('[data-qa = "order-placed"]')).toBeVisible();

    await registerPage.deleteAccountButton.click();
    await expect(registerPage.deleteAccountText).toBeVisible();
  });
});
