import { MainMenuComponent } from '../components/main-menu.component';
import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.mainMenu = new MainMenuComponent(page);

    this.cartViewInProductDetail = page.getByRole('link', {
      name: 'View Cart',
    });
    this.continueShoppingButton = page.locator(
      '.btn.btn-success.close-modal.btn-block'
    );
    this.cartProductsInfoBox = page.locator('.cart_info');
    this.productInfo = page.locator('.cart_info tbody tr');
    this.quantityInProductDetail = page.locator('#quantity');
    this.quantityInCart = page.locator('.cart_quantity > button');
    this.productsDetailViewInCart = page.locator('.product-details');
    this.addToCartInProductDetailButton = page.locator('button.cart');
    this.cartCheckOutButton = page.locator('.check_out');
    this.registerLoginButtonAfterCheckout = page.locator(
      '#checkoutModal .modal-body a[href="/login"]'
    );

    this.deliveryAddressBoxTitle = page.locator(
      '#address_delivery .address_title > h3'
    );
    this.deliveryTitleFirstAndLastName = page.locator(
      '#address_delivery .address_firstname.address_lastname'
    );
    this.deliveryCompanyAndAddress = page.locator(
      '#address_delivery .address_address1.address_address2'
    );
    this.deliveryCityStatePostcode = page.locator(
      '#address_delivery .address_city.address_state_name.address_postcode'
    );
    this.deliveryCountryName = page.locator(
      '#address_delivery .address_country_name'
    );
    this.deliveryPhoneNumber = page.locator('#address_delivery .address_phone');
    this.deliveryComment = page.locator('.form-control');

    this.reviewProductsIds = page.locator('[id^="product-"]');

    this.creditCardOwnerName = page.locator('[data-qa = "name-on-card"]');
    this.creditCardNumber = page.locator('[data-qa = "card-number"]');
    this.creditCardCVC = page.locator('[data-qa = "cvc"]');
    this.creditCardExpiringMonth = page.locator('[data-qa = "expiry-month"]');
    this.creditCardExpiringYear = page.locator('[data-qa = "expiry-year"]');
    this.creditCardPayButton = page.locator('[data-qa = "pay-button"]');

    this.verifyOrderPlacedText = page.locator('[data-qa = "order-placed"]');
  }
  async reviewingProductsInCheckout(cartPage, productIds) {
    const cartProductIds = await cartPage.reviewProductsIds.evaluateAll(
      (elements) => elements.map((el) => el.id.replace('product-', ''))
    );

    for (const expectedId of productIds) {
      expect(cartProductIds).toContain(String(expectedId));
    }
  }
  async fillingCreditCardData(cartPage, registerData, cartData) {
    await cartPage.creditCardOwnerName.fill(
      `${registerData.userFirstName} ${registerData.userLastName}`
    );
    await cartPage.creditCardNumber.fill(cartData.creditCardNumber);
    await cartPage.creditCardCVC.fill(cartData.creditCardCVC);
    await cartPage.creditCardExpiringMonth.fill(
      cartData.creditCardExpiringMonth
    );
    await cartPage.creditCardExpiringYear.fill(cartData.creditCardExpiringYear);
    await cartPage.creditCardPayButton.click();
  }
}
