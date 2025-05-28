import { MainMenuComponent } from '../components/main-menu.component';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.mainMenu = new MainMenuComponent(page);
    
    this.cartViewInProductDetail = page.getByRole('link', { name: 'View Cart' })
    this.continueShoppingButton = page.locator('.btn.btn-success.close-modal.btn-block')
    this.cartProductsInfoBox = '.cart_info'
    this.productInfo = '.cart_info tbody tr'
  }
}
