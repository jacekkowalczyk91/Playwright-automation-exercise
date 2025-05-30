import { MainMenuComponent } from '../components/main-menu.component';

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
    this.addToCartInProductDetailButton = page.locator('button.cart')
    this.cartCheckOutButton = page.locator('.check_out')
  }
}
